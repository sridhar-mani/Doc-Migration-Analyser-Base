from server.parser import parse
from http.client import HTTP_PORT
import shutil
from sqlalchemy import true
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from server.schema import FinalReport
from server.config import TestEnv
from server.ai_evaluator import evaluate_ai
from db import ses, get_db
from model import MigrateRecord
import os
import shutil

app = FastAPI(title="Migration Auditing")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials= True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

os.makedirs(TestEnv.temp_dir,exist_ok=True)

@app.post("/api/analyze", response_model=FinalReport)
async def analyze_doc(file: UploadFile = File(...)):
    if not file.filename.endswith((".pdf",".docx")):
        raise HTTPException(status_code=400, detail="Upload only pdf or word.")
    file_path = os.path.join(TestEnv.temp_dir, file.filename)
    with open(file_path,'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        raw_metrics = parse(file_path, file.filename.split(".")[-1].lower())
        raw_text  = raw_metrics.pop("raw_text")
        ai_analysis = evaluate_ai(raw_text, raw_metrics)
        return FinalReport(filename=file.filename, metrics=raw_metrics, ai_analysis=ai_analysis)
    except Exception as e:
        raise HTTPException(status_code = 500, detail = str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@app.get("/api/history")
async def history(db: Session = Depends(get_db)):
    try:
        records = db.query(MigrateRecord).order_by(MigrateRecord.created_at.desc()).all()
        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
