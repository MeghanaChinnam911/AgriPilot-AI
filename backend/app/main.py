import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import base64

from app.schemas import FarmerProfile, CropSelection, ChatRequest, ScenarioSimulationRequest, ImageAnalysisRequest, DocumentAnalysisRequest
from app.services.mock_data import CROP_DISCOVERY_DATA, TIMELINES, WEATHER_DATA, MARKET_DATA, LOGISTICS_ROUTES, GOVERNMENT_SCHEMES, FINANCIAL_OPTIONS, DECISION_LOGS
from app.services.ai_service import AIService
from app.agents.state import AgentState
from app.agents.supervisor import AgriPilotMultiAgentSystem

app = FastAPI(title="AgriPilot AI API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Database for Hackathon/Simulation Version
db = {
    "profile": None,
    "selected_crop": None,
    "timeline": [],
    "decision_logs": list(DECISION_LOGS),
    "chat_history": []
}

agent_system = AgriPilotMultiAgentSystem()

@app.get("/")
def read_root():
    return {"message": "Welcome to AgriPilot AI – Autonomous Agricultural Co-founder API!"}

@app.post("/api/profile")
def save_profile(profile: FarmerProfile):
    db["profile"] = profile.model_dump()
    return {
        "status": "success",
        "message": "Farmer profile saved successfully",
        "profile": db["profile"]
    }

@app.get("/api/crops/discover")
def discover_crops():
    if not db["profile"]:
        # Return default discovery if no profile saved yet
        return CROP_DISCOVERY_DATA
    
    crops = AIService.discover_crops(db["profile"])
    return crops

@app.post("/api/crops/select")
def select_crop(selection: CropSelection):
    crop = selection.crop_name
    db["selected_crop"] = crop
    
    # Load default timeline based on selected crop
    db["timeline"] = AIService.generate_timeline(crop, db["profile"] or {})
    
    # Append initial decision logs
    db["decision_logs"].insert(0, {
        "day": 1,
        "agent": "Crop Planning Agent",
        "decision": f"Confirmed selection of {crop} as the primary production crop.",
        "status": "Approved"
    })
    
    return {
        "status": "success",
        "selected_crop": crop,
        "timeline": db["timeline"],
        "decision_logs": db["decision_logs"]
    }

@app.get("/api/timeline")
def get_timeline():
    return {
        "selected_crop": db["selected_crop"],
        "timeline": db["timeline"],
        "decision_logs": db["decision_logs"]
    }

@app.post("/api/chat")
def chat_copilot(req: ChatRequest):
    # Initialize state
    state = AgentState(
        profile=db["profile"] or req.profile.model_dump() if req.profile else None,
        selected_crop=db["selected_crop"] or req.selected_crop,
        weather_alerts=WEATHER_DATA["alerts"],
        mandi_prices=MARKET_DATA["mandi_prices"],
        chat_history=db["chat_history"],
        latest_message=req.message,
        decision_log=db["decision_logs"]
    )
    
    # Run the Multi-Agent System
    updated_state = agent_system.run_workflow(state)
    
    # Update DB state
    db["decision_logs"] = updated_state.decision_log
    
    # Append to chat history
    db["chat_history"].append({"role": "user", "content": req.message})
    db["chat_history"].append({"role": "assistant", "content": updated_state.supervisor_recommendation})
    
    # Keep history bounded
    db["chat_history"] = db["chat_history"][-20:]
    
    return {
        "answer": updated_state.supervisor_recommendation,
        "invoked_agents": updated_state.invoked_agents,
        "decision_logs": updated_state.decision_log,
        "chat_history": db["chat_history"]
    }

@app.post("/api/disease/detect")
def detect_disease(req: ImageAnalysisRequest):
    # Decode image or use mock data
    diagnosis = AIService.detect_disease(req.file_bytes or "")
    
    # Append to decision log
    db["decision_logs"].insert(0, {
        "day": 12,
        "agent": "Disease Detection Agent",
        "decision": f"Diagnosed leaf spot issue: {diagnosis.get('disease_name')}. Recommended organic spray.",
        "status": "Critical"
    })
    
    return diagnosis

@app.post("/api/document/parse")
def parse_document(req: DocumentAnalysisRequest):
    result = AIService.parse_document(req.doc_type, req.file_bytes or "")
    
    # Append to decision log
    db["decision_logs"].insert(0, {
        "day": 2,
        "agent": "Agricultural Research Agent",
        "decision": f"Parsed {req.doc_type} document successfully. Calibrating organic soil inputs.",
        "status": "Approved"
    })
    
    return result

@app.post("/api/scenario/simulate")
def simulate_scenario(req: ScenarioSimulationRequest):
    results = AIService.simulate_scenario(req.current_crop, req.scenario_type, req.parameters)
    return {
        "scenario_type": req.scenario_type,
        "results": results
    }

@app.get("/api/weather")
def get_weather():
    return WEATHER_DATA

@app.get("/api/market")
def get_market():
    return {
        "market_data": MARKET_DATA,
        "logistics_routes": LOGISTICS_ROUTES
    }

@app.get("/api/collaboration")
def get_collaboration():
    """Returns collaboration schema for visual representation in frontend."""
    return {
        "supervisor": "Supervisor Agent",
        "sub_agents": [
            {"name": "Crop Planning Agent", "role": "Analyzes soil & crop suitability"},
            {"name": "Yield Forecast Agent", "role": "Predicts harvest volume and timing"},
            {"name": "Weather Risk Agent", "role": "Monitors cyclone, drought & heavy rainfall alerts"},
            {"name": "Market Intelligence Agent", "role": "Tracks eNAM prices & wholesale index trends"},
            {"name": "Logistics Optimization Agent", "role": "Finds refrigerated carriers & routes"},
            {"name": "Market & Profit Agent", "role": "Simulates wait vs sell schedules for maximum margin"},
            {"name": "Disease Detection Agent", "role": "Analyzes crop leaf images & provides treatment"},
            {"name": "Government Scheme Agent", "role": "Searches subsidies & irrigation funding"},
            {"name": "Loan & Insurance Agent", "role": "Identifies low-rate loans & weather coverage"},
            {"name": "Agricultural Research Agent", "role": "Recommends best fertilizer application stages"},
            {"name": "What-If Scenario Agent", "role": "Simulates custom climate and pricing trade-offs"}
        ]
    }
