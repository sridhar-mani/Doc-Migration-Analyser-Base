from dotenv import load_dotenv
import os
from pathlib import Path

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

class TestEnv:
    temp_dir = os.getenv("TEMP_DIR", str(BASE_DIR / "temp_uploads"))
    db_url = os.getenv("DATABASE", f"sqlite:///{BASE_DIR / 'migration.db'}")
    ai_model = os.getenv("AI_MODEL", "qwen3.5:4b")
