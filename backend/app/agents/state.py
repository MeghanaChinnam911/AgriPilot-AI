from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class AgentState(BaseModel):
    # Core Farmer Inputs
    profile: Optional[Dict[str, Any]] = None
    selected_crop: Optional[str] = None
    
    # Environment Variables
    weather_alerts: List[Dict[str, Any]] = []
    mandi_prices: List[Dict[str, Any]] = []
    active_timeline_week: int = 1
    
    # Multi-Agent Outputs
    crop_planning_decision: Optional[Dict[str, Any]] = None
    yield_forecast_decision: Optional[Dict[str, Any]] = None
    weather_risk_decision: Optional[Dict[str, Any]] = None
    market_intel_decision: Optional[Dict[str, Any]] = None
    logistics_decision: Optional[Dict[str, Any]] = None
    disease_detection_decision: Optional[Dict[str, Any]] = None
    profit_opt_decision: Optional[Dict[str, Any]] = None
    research_decision: Optional[Dict[str, Any]] = None
    schemes_decision: Optional[Dict[str, Any]] = None
    finance_decision: Optional[Dict[str, Any]] = None
    scenario_decision: Optional[Dict[str, Any]] = None
    
    # Orchestration Variables
    chat_history: List[Dict[str, str]] = []
    latest_message: str = ""
    invoked_agents: List[str] = []
    supervisor_recommendation: Optional[str] = None
    decision_log: List[Dict[str, Any]] = []
