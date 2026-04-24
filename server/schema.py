from pydantic import BaseModel, Field
from typing import List, Optional

class DocumentMetrics(BaseModel):
    total_pages: int
    word_count: int
    paragraph_count: int
    heading_count: int
    avg_words_per_paragraph: int

class AIAnalysis(BaseModel):
    readability_level: str = Field(description="Easy, Medium, or Complex")
    content_clarity: str = Field(description="Evaluation of language clarity and consistency")
    structural_quality: str = Field(description="Assessment of organization (e.g., well-organized vs. fragmented)")
    migration_readiness: str = Field(description="Verdict: Ready, Needs Work, or High Effort")
    migration_effort_score: float = Field(description="Complexity score from 0-10, assessed by LLM")
    improvement_suggestions: List[str]

class FinalReport(BaseModel):
    filename: str
    file_path: Optional[str] = None
    metrics: DocumentMetrics
    ai_analysis: AIAnalysis 