from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.routers import predict, models

app = FastAPI(
    title="NaukriPredict",
    description="Multi-model student placement and salary prediction",
    version="2.0.0",
)

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)
app.include_router(models.router)


@app.get("/health")
def health():
    return {"status": "ok", "env": os.getenv("ENV", "development")}