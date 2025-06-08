from io import BytesIO
from PIL import Image
from fastapi import FastAPI, UploadFile,File
import numpy as np
import tensorflow as tf
import uvicorn
import requests
from fastapi.middleware.cors import CORSMiddleware
from database import create_db, save_prediction
from models import PredictionHistory
from sqlalchemy.orm import Session
from database import SessionLocal
from datetime import datetime
from fastapi.staticfiles import StaticFiles




# App setup
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#  Model Serving Info
endpoint = "http://localhost:8501/v1/models/potatoes_model/versions/2:predict"
CLASS_NAMES = ['Healthy', 'Early Blight', 'Late Blight']

#  Startup Hook
@app.on_event("startup")
def startup_event():
    create_db()

@app.get("/ping")
async  def ping():
    return "Hello I am alive"

# 🔹 Image Reader
def read_file_as_image(data)->np.ndarray:
    # image =np.array(Image.open(BytesIO(data)))
    # return image
    image = Image.open(BytesIO(data)).convert("RGB")
    image = image.resize((256, 256))  # Resize to match training size
    image = np.array(image) / 255.0  # Normalize pixel values
    return image


# 🔹 Predict Route
@app.post("/predict")
async def predict(
        file: UploadFile = File(...)
):

    image =read_file_as_image(await file.read())  #read file that upload in postman
    img_batch = np.expand_dims(image, axis=0)



    json_data = {
        "instances" : img_batch.tolist()

    }
    response =requests.post(endpoint, json=json_data)

    print("Raw response from TensorFlow Serving:", response.text)
    prediction = np.array(response.json()['predictions'][0])
    predicted_class = CLASS_NAMES[np.argmax(prediction)]
    confidence = float(np.max(prediction))

    # Save prediction
    save_prediction(file.filename, predicted_class, confidence)
    print(f"Saved prediction: {file.filename} - {predicted_class} - {confidence}")

    return {
        "class": predicted_class,
        "confidence": float(confidence)
    }


# 🔹 Get History Route 
@app.get("/history")
def get_prediction_history():
    db: Session = SessionLocal()
    predictions = db.query(PredictionHistory).order_by(PredictionHistory.timestamp.desc()).limit(10).all()
    print(f"Found {len(predictions)} history records.")
    db.close()

    return [
        {
            "id": p.id,
            "filename": p.filename,
            "prediction_class": p.prediction_class,
            "confidence": p.confidence,
            "timestamp": p.timestamp.isoformat()
        }
        for p in predictions
    ]



if __name__ =="__main__":
    uvicorn.run(app,host='localhost', port=8888 )