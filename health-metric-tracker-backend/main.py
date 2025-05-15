from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # your React app URL
    allow_credentials=True,
    allow_methods=["*"],    # <-- ALLOW ALL METHODS including OPTIONS
    allow_headers=["*"],    # <-- ALLOW ALL HEADERS
)

# Initialize the database
database.init_db()

# ---------- DATA MODELS ----------
class HealthMetric(BaseModel):
    steps: int
    sleep_hours: float
    heart_rate: int
    date: str

# ---------- API ENDPOINTS ----------

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Health Metrics Tracker!"}

@app.post("/submit")
async def submit_metric(metric: HealthMetric):
    database.insert_metric(metric.steps, metric.sleep_hours, metric.heart_rate, metric.date)
    return {"message": "Metric submitted successfully"}

@app.get("/metrics", response_model=List[HealthMetric])
async def get_metrics():
    rows = database.get_all_metrics()

    metrics = []
    for row in rows:
        metric = HealthMetric(steps=row[0], sleep_hours=row[1], heart_rate=row[2], date=row[3])
        metrics.append(metric)
    return metrics