from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from server.config import TestEnv

connect_args = {"check_same_thread": False} if TestEnv.db_url.startswith("sqlite") else {}
eng = create_engine(TestEnv.db_url, connect_args=connect_args)
ses = sessionmaker(bind=eng, autoflush=False, autocommit=False)
base = declarative_base()


def get_db():
    db = ses()
    try:
        yield db
    finally:
        db.close()