# Migration

Working automation app for document migration readiness.

## 1. Setup Instructions

Requirements:
- Python 3.10+
- Node.js 18+
- Ollama running locally
- Ollama model: qwen3.5:9b

Install backend:
```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Install frontend:
```bash
cd ../frontend
npm install
```

Pull AI model (once):
```bash
ollama pull qwen3.5:9b
```

Optional env vars:
```bash
export TEMP_DIR=temp_uploads
export DATABASE=sqlite:///./migration.db
export VITE_API_BASE=http://localhost:8000
```

## 2. Tools / Libraries Used

Backend:
- FastAPI
- SQLAlchemy
- Pydantic
- python-docx
- PyMuPDF
- LangChain
- Ollama
- aiofiles
- python-dotenv

Frontend:
- React
- Vite
- Tailwind CSS

## 3. Steps to Run

Run backend:
```bash
cd server
source .venv/bin/activate
cd ..
uvicorn server.app:app --reload --host 0.0.0.0 --port 8000
```

Run frontend:
```bash
cd frontend
npm run dev
```

URLs:
- API: http://localhost:8000
- UI: http://localhost:5173

## 4. Sample Input and Output

Sample input:
```bash
curl -X POST "http://localhost:8000/api/analyze" -F "file=@/path/to/sample.docx"
```

Sample output:
```json
{
  "filename": "sample.docx",
  "metrics": {
    "total_pages": 3,
    "word_count": 1240,
    "paragraph_count": 78,
    "heading_count": 12,
    "avg_words_per_paragraph": 16
  },
  "ai_analysis": {
    "readability_level": "Medium",
    "content_clarity": "Clear overall with some long sections.",
    "structural_quality": "Well organized.",
    "migration_readiness": "Needs Work",
    "migration_effort_score": 6.1,
    "improvement_suggestions": [
      "Break long paragraphs.",
      "Standardize headings.",
      "Add clearer section flow."
    ]
  }
}
```

Sample history call:
```bash
curl "http://localhost:8000/api/history"
```
