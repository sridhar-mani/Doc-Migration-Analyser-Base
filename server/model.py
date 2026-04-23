from db import base
from sqlalchemy import  Column, Integer, String, Float, Text, DateTime
from datetime import datetime

class MigrateRecord(base):
    __tablename__ = "migrations"

    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    total_pages = Column(Integer)
    word_count = Column(Integer)
    paragraph_count = Column(Integer)
    heading_count = Column(Integer)
    avg_words_per_paragraph = Column(Integer)
    migration_effort_score = Column(Float)

    readability_level = Column(String)
    content_clarity = Column(Text)
    structural_quality = Column(String)
    migration_readiness = Column(String)
    
    improvement_suggestions = Column(Text)