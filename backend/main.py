# Run: uvicorn main:app --reload
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS Middleware for frontend fetch
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def Boolean():
    return "Boolean-based Blind Function Executed"

def Error():
    return "Error-based Function Executed"

def Union():
    return "Union query-based Function Executed"

def Stacked():
    return "Stack queries Function Executed"

def Time():
    return "Time-based Blind Function Executed"

def Inline():
    return "Inline queries Function Executed"

FUNCTIONS = {
    "Boolean-based Blind": Boolean,
    "Error-based": Error,
    "Union query-based": Union,
    "Stack queries": Stacked,
    "Time-based Blind": Time,
    "Inline queries": Inline,
}

#Model recieve data from frontend
class TestRequest(BaseModel):
    selected_tests: List[str]
    url: str  #เพิ่มURLจากfrontend

@app.post("/submit-test")
async def submit_test(request: TestRequest):
    if not request.selected_tests:
        raise HTTPException(status_code=400, detail="No tests selected")

    print(f"Received URL: {request.url}")  # Debug URL
    print(f"Received tests: {request.selected_tests}")  # Debug tests

    results = {}
    for name in request.selected_tests:
        if name in FUNCTIONS:
            results[name] = FUNCTIONS[name]()
        else:
            results[name] = "❌ Test not found"

    return {
        "url": request.url,
        "results": results
    }