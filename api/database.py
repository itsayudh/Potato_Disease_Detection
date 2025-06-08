from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,Session
from models import Base, PredictionHistory
from datetime import datetime

DATABASE_URL = "sqlite:///./predictions.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables if they don't exist
def create_db():
    Base.metadata.create_all(bind=engine)

def save_prediction(filename: str, predicted_class: str, confidence: float):
    db: Session = SessionLocal()
    prediction = PredictionHistory(
        filename=filename,
        prediction_class=predicted_class,
        confidence=confidence,
        timestamp=datetime.utcnow()
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    db.close()