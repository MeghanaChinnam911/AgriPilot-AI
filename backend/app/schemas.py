from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class FarmerProfile(BaseModel):
    location: str = Field(..., description="Location of the farm (e.g. City/Region)")
    land_area: float = Field(..., description="Land area in acres")
    soil_type: str = Field(..., description="Type of soil (e.g. Clay, Sandy, Loamy, Silt)")
    water_availability: str = Field(..., description="Water source (e.g. Rainfed, Borewell, Canal, Drip)")
    planting_date: str = Field(..., description="Planned planting date (YYYY-MM-DD)")
    budget: float = Field(..., description="Farming budget in USD or Local Currency")
    farming_experience: str = Field(..., description="Experience level (Beginner, Intermediate, Expert)")

class CropSelection(BaseModel):
    crop_name: str

class ChatRequest(BaseModel):
    message: str
    chat_history: Optional[List[Dict[str, str]]] = []
    profile: Optional[FarmerProfile] = None
    selected_crop: Optional[str] = None

class ScenarioSimulationRequest(BaseModel):
    current_crop: str
    scenario_type: str  # 'crop_change', 'delay_sell', 'weather_risk'
    parameters: Dict[str, Any]

class ImageAnalysisRequest(BaseModel):
    image_url: Optional[str] = None
    file_bytes: Optional[str] = None  # Base64 encoded string

class DocumentAnalysisRequest(BaseModel):
    doc_type: str  # 'soil_report', 'insurance', 'government'
    file_bytes: Optional[str] = None  # Base64 encoded string
