import json
import os
from pathlib import Path
from typing import Annotated, Optional
from uuid import uuid4

import aiofiles
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from server.ai_evaluator import evaluate_ai
from server.config import TestEnv
from server.db import base, eng, get_db
from server.model import MigrateRecord
from server.parser import parse
from server.schema import DocumentMetrics, FinalReport


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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(TestEnv.temp_dir, exist_ok=True)


def sanitize_filename(filename: str) -> str:
    return Path(filename).name


def build_storage_path(filename: str) -> Path:
    return Path(TestEnv.temp_dir) / f"{uuid4().hex}_{sanitize_filename(filename)}"


def remove_file_if_exists(file_path: Optional[str]) -> None:
    if not file_path:
        return

    path = Path(file_path)
    if path.exists():
        path.unlink()


def get_extension(filename: str) -> str:
    return Path(filename).suffix.lstrip(".").lower()


def apply_analysis_update(record: MigrateRecord, metrics: DocumentMetrics, ai_analysis) -> None:
    record.total_pages = metrics.total_pages
    record.word_count = metrics.word_count
    record.paragraph_count = metrics.paragraph_count
    record.heading_count = metrics.heading_count
    record.avg_words_per_paragraph = metrics.avg_words_per_paragraph
    record.migration_effort_score = ai_analysis.migration_effort_score
    record.readability_level = ai_analysis.readability_level
    record.content_clarity = ai_analysis.content_clarity
    record.structural_quality = ai_analysis.structural_quality
    record.migration_readiness = ai_analysis.migration_readiness
    record.improvement_suggestions = json.dumps(ai_analysis.improvement_suggestions)


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
    original_name = file.filename or "uploaded_document"
    file_ext = get_extension(original_name)
    if file_ext not in {"pdf", "docx"}:
        raise HTTPException(status_code=400, detail="Upload only pdf or word.")

    file_path = build_storage_path(original_name)
    persisted = False

    async with aiofiles.open(file_path, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            await buffer.write(chunk)

    try:
        raw_metrics = parse(str(file_path), file_ext)
        raw_text = raw_metrics.pop("raw_text")
        metrics = DocumentMetrics(**raw_metrics)
        ai_analysis = await evaluate_ai(raw_text, metrics)

        rec = MigrateRecord(filename=original_name, file_path=str(file_path))
        apply_analysis_update(rec, metrics, ai_analysis)
        db.add(rec)
        db.commit()
        db.refresh(rec)
        persisted = True

        return FinalReport(
            filename=rec.filename,
            file_path=rec.file_path,
            metrics=metrics,
            ai_analysis=ai_analysis,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if not persisted:
            remove_file_if_exists(str(file_path))


@app.get(
    "/api/history",
    responses={500: {"description": "Internal server error."}},
)
async def history(db: Annotated[Session, Depends(get_db)]):
    records = db.query(MigrateRecord).order_by(MigrateRecord.created_at.desc()).all()
    return records


@app.post(
    "/api/recheck/{record_id}",
    responses={404: {"description": "Record not found."}, 500: {"description": "Internal server error."}},
)
async def recheck_history(record_id: int, db: Annotated[Session, Depends(get_db)]):
    rec = db.query(MigrateRecord).filter(MigrateRecord.id == record_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found.")

    if not rec.file_path:
        raise HTTPException(status_code=400, detail="No file path stored for this record.")

    file_path = Path(rec.file_path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Source file no longer exists.")

    raw_metrics = parse(str(file_path), get_extension(rec.filename or file_path.name))
    raw_text = raw_metrics.pop("raw_text")
    metrics = DocumentMetrics(**raw_metrics)
    ai_analysis = await evaluate_ai(raw_text, metrics)
    apply_analysis_update(rec, metrics, ai_analysis)
    db.commit()
    db.refresh(rec)

    return {"success": True, "record": rec}


@app.delete(
    "/api/history/{record_id}",
    responses={404: {"description": "Record not found."}, 500: {"description": "Internal server error."}},
)
async def delete_history(record_id: int, db: Annotated[Session, Depends(get_db)]):
    rec = db.query(MigrateRecord).filter(MigrateRecord.id == record_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Record not found.")

    remove_file_if_exists(rec.file_path)
    db.delete(rec)
    db.commit()
    return {"success": True}
        