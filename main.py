
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# Load saved model and encoder
model = joblib.load("models/final_xgboost_model.pkl")
label_encoder = joblib.load("models/course_label_encoder.pkl")

# Student input features
class StudentInput(BaseModel):
    mean_score: float
    assessment_count: int
    course_score: float
    total_clicks: int
    active_days: int
    learning_resources: int


@app.get("/")
def home():
    return {
        "message": "LMS Course Recommendation API is running"
    }


@app.post("/recommend")
def recommend(data: StudentInput):

    data = data.model_dump()

    df = pd.DataFrame([data])

    probabilities = model.predict_proba(df)[0]

    top3_indices = probabilities.argsort()[-3:][::-1]

    courses = label_encoder.inverse_transform(
        model.classes_[top3_indices].astype(int)
    )

    recommendations = []

    for i in range(len(courses)):
        recommendations.append({
            "course": str(courses[i]),
            "probability": float(probabilities[top3_indices[i]])
        })

    return {
        "recommendations": recommendations
    }