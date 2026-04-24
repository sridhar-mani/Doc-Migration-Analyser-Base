from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from server.config import TestEnv

eng = create_engine(TestEnv.db_url, connect_args= {"check_same_thread":False})
ses = sessionmaker(bind=eng, autoflush=False, autocommit = False)
base = declarative_base()

def get_db():
    db = ses()
    try:
        yield db
    finally:
        db.close()