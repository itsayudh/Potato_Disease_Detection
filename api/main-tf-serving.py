from io import BytesIO

from PIL import Image
from fastapi import FastAPI, UploadFile,File
import numpy as np
import tensorflow as tf
import uvicorn
import requests

app = FastAPI()

endpoint = "http://localhost:8501/v1/models/potatoes_model/versions/2:predict"

CLASS_NAMES = ['healthy', 'early_blight', 'late_blight']

@app.get("/ping")
async  def ping():
    return "Hello I am alive"

def read_file_as_image(data)->np.ndarray:
    # image =np.array(Image.open(BytesIO(data)))
    # return image
    image = Image.open(BytesIO(data)).convert("RGB")
    image = image.resize((256, 256))  # Resize to match training size
    image = np.array(image) / 255.0  # Normalize pixel values
    return image


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

    return {
        "class": predicted_class,
        "confidence": float(confidence)
    }


if __name__ =="__main__":
    uvicorn.run(app,host='localhost', port=8888 )