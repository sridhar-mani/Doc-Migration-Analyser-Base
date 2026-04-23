from pydantic import BaseModel, Field
from typing import List, Literal

class DocumentMetrics(BaseModel):
    total_pages: int
    word_count: int
    paragraph_count: int
    heading_count: int
    avg_words_per_paragraph: int
    migration_effort_score: float = Field(description="Complexity score from 0-10")

class AIAnalysis(BaseModel):
    readability_level: str = Field(description="Easy, Medium, or Complex")
    content_clarity: str
    structural_quality: str
    migration_readiness: str 
    improvement_suggestions: List[str]

class FinalReport(BaseModel):
    filename: str
    metrics: DocumentMetrics
    ai_analysis: AIAnalysis