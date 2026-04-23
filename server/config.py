from dotenv import load_dotenv
import os

load_dotenv()

class TestEnv():
    temp_dir = os.getenv("TEMP_DIR","temp_uploads")