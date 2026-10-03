from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# Load trained model and encoders
model = joblib.load("models/final_xgboost_model.pkl")
label_encoder = joblib.load("models/course_label_encoder.pkl")
course_encoder = joblib.load("models/current_course_encoder.pkl")
course_mapping = {
    "HTML & CSS": "AAA",
    "JSS": "BBB",
    "React JS": "CCC",
    "Node.js & Express": "DDD",
    "SQL & Database": "EEE",
    "Python Programming": "FFF",
    "ML": "GGG"
}
reverse_course_mapping = {
    value: key
    for key, value in course_mapping.items()
}
allowed_next_courses = {
    "HTML & CSS": [
        "JSS",
        "React JS",
        "Node.js & Express",
        "SQL & Database",
        "Python Programming",
        "ML"
    ],

    "JSS": [
        "React JS",
        "Node.js & Express",
        "SQL & Database",
        "Python Programming",
        "ML"
    ],

    "React JS": [
        "Node.js & Express",
        "SQL & Database",
        "Python Programming",
        "ML"
    ],

    "Node.js & Express": [
        "SQL & Database",
        "Python Programming",
        "ML"
    ],

    "SQL & Database": [
        "Python Programming",
        "ML"
    ],

    "Python Programming": [
        "ML"
    ],

    "ML": []
}


class StudentData(BaseModel):
    current_course: str
    mean_score: float
    assessment_count: float
    course_score: float
    total_clicks: float
    active_days: float
    learning_resources: float


@app.get("/")
def home():
    return {"message": "Course Recommendation API is running"}

@app.post("/recommend")
def recommend(data: StudentData):

    # 1. Convert real LMS course name to OULAD course code
    current_course_code = course_mapping[data.current_course]

    # 2. Encode current course
    current_course_encoded = course_encoder.transform(
        [current_course_code]
    )[0]

    # 3. Create input in the same order as training
    input_data = np.array([[
        current_course_encoded,
        data.mean_score,
        data.assessment_count,
        data.course_score,
        data.total_clicks,
        data.active_days,
        data.learning_resources
    ]])

    # 4. Get prediction probabilities from XGBoost
    probabilities = model.predict_proba(input_data)[0]

    # 5. Sort all courses by probability
    all_indices = np.argsort(probabilities)[::-1]

    # 6. Convert predictions to OULAD course codes
    courses = label_encoder.inverse_transform(all_indices)

    # 7. Get courses allowed after the current course
    allowed_courses = allowed_next_courses[data.current_course]

    # 8. Apply prerequisite filtering
    recommendations = []

    for index, course_code in zip(all_indices, courses):

        # Convert OULAD code to real LMS course name
        real_course_name = reverse_course_mapping[course_code]

        # Only include courses allowed by prerequisites
        if real_course_name in allowed_courses:

            recommendations.append({
                "course": real_course_name,
                "probability": round(float(probabilities[index]) * 100, 2)
            })

        # Stop after getting top 2 valid recommendations
        if len(recommendations) == 2:
            break

    # 9. Return recommendations
    return {
        "recommendations": recommendations
    }