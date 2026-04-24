from server.parser import parse
from http.client import HTTP_PORT
import shutil
from typing import Annotated
from sqlalchemy import true
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from server.schema import FinalReport, DocumentMetrics
from server.config import TestEnv
from server.ai_evaluator import evaluate_ai
from server.db import ses, get_db, base, eng
from server.model import MigrateRecord
import os
import shutil
import aiofiles
import json
from pathlib import Path

app = FastAPI(title="Migration Auditing")

if TestEnv.db_url.startswith("sqlite:///"):
    db_file = Path(TestEnv.db_url.removeprefix("sqlite:///"))
    if not db_file.exists():
        base.metadata.create_all(bind=eng)
else:
    base.metadata.create_all(bind=eng)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials= True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

os.makedirs(TestEnv.temp_dir,exist_ok=True)

@app.post(
    "/api/analyze",
    response_model=FinalReport,
    responses={
        400: {"description": "Upload only pdf or word."},
        500: {"description": "Internal server error."},
    },
)
async def analyze_doc(
    db: Annotated[Session, Depends(get_db)],
    file: Annotated[UploadFile, File(...)],
    
):
    if not file.filename.endswith((".pdf",".docx")):
        raise HTTPException(status_code=400, detail="Upload only pdf or word.")
    file_path = os.path.join(TestEnv.temp_dir, file.filename)
    async with aiofiles.open(file_path, 'wb') as buffer:
        while chunk := await file.read(1024 * 1024):
            await buffer.write(chunk)
    
    try:
        raw_metrics = parse(file_path, file.filename.split(".")[-1].lower())
        raw_text = raw_metrics.pop("raw_text")
        metrics = DocumentMetrics(**raw_metrics)
        ai_analysis = evaluate_ai(raw_text, metrics)

        rec = MigrateRecord(
            filename = file.filename,
            total_pages=metrics.total_pages,
            word_count=metrics.word_count,
            paragraph_count=metrics.paragraph_count,
            heading_count=metrics.heading_count,
            avg_words_per_paragraph=metrics.avg_words_per_paragraph,
            migration_effort_score=ai_analysis.migration_effort_score,
            readability_level=ai_analysis.readability_level,
            content_clarity=ai_analysis.content_clarity,
            structural_quality=ai_analysis.structural_quality,
            migration_readiness=ai_analysis.migration_readiness,
            improvement_suggestions=json.dumps(ai_analysis.improvement_suggestions)
        )
        db.add(rec)
        db.commit()

        return FinalReport(filename=file.filename, metrics=metrics, ai_analysis=ai_analysis)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code = 500, detail = str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@app.get(
    "/api/history",
    responses={500: {"description": "Internal server error."}},
)
async def history(db: Annotated[Session, Depends(get_db)]):
    try:
        records = db.query(MigrateRecord).order_by(MigrateRecord.created_at.desc()).all()
        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
