import os
import json
import base64
import random
from typing import Dict, Any, List, Optional
from app.services.mock_data import (
    CROP_DISCOVERY_DATA, TIMELINES, WEATHER_DATA, MARKET_DATA,
    LOGISTICS_ROUTES, GOVERNMENT_SCHEMES, FINANCIAL_OPTIONS,
    RESEARCH_ADVISORY, DECISION_LOGS
)

# Attempt to configure Gemini
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
gemini_available = False

if GEMINI_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_KEY)
        gemini_available = True
        print("Gemini API successfully configured.")
    except Exception as e:
        print(f"Failed to configure Gemini SDK: {e}")

def get_gemini_response(prompt: str, image_bytes: Optional[bytes] = None, mime_type: Optional[str] = None) -> str:
    """Calls Gemini if available, otherwise returns None."""
    if not gemini_available:
        return None
    try:
        # Using gemini-2.5-flash as preferred model
        model = genai.GenerativeModel("gemini-2.5-flash")
        if image_bytes:
            content = [
                {"mime_type": mime_type or "image/jpeg", "data": image_bytes},
                prompt
            ]
            response = model.generate_content(content)
        else:
            response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini generation error: {e}")
        return None

class AIService:
    @staticmethod
    def discover_crops(profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generates list of suitable crops based on profile parameters."""
        prompt = f"""
        You are the Crop Planning Agent for AgriPilot AI.
        Farmer Profile:
        - Location: {profile.get('location')}
        - Land Area: {profile.get('land_area')} acres
        - Soil Type: {profile.get('soil_type')}
        - Water Availability: {profile.get('water_availability')}
        - Budget: {profile.get('budget')}
        - Experience: {profile.get('farming_experience')}

        Provide a list of suitable crops in JSON format matching this list structure:
        [
          {{
            "crop_name": "CropName",
            "growth_duration": "duration",
            "water_requirement": "desc",
            "risk_level": "Low/Medium/High",
            "profit_potential": "potential earnings",
            "expected_yield": "tonnage",
            "best_season": "season",
            "details": "explanation of suitability based on soil and water"
          }}
        ]
        """
        gemini_res = get_gemini_response(prompt)
        if gemini_res:
            try:
                # Extract JSON from potential markdown blocks
                cleaned = gemini_res.strip()
                if "```json" in cleaned:
                    cleaned = cleaned.split("```json")[1].split("```")[0]
                elif "```" in cleaned:
                    cleaned = cleaned.split("```")[1].split("```")[0]
                return json.loads(cleaned)
            except Exception as e:
                print(f"Failed to parse Gemini discovery response: {e}")

        # Fallback Engine (highly contextual)
        results = []
        soil = profile.get("soil_type", "").lower()
        water = profile.get("water_availability", "").lower()
        budget = float(profile.get("budget", 1000))

        # Suitability rules
        for crop in CROP_DISCOVERY_DATA:
            suitable = True
            name = crop["crop_name"].lower()
            
            # Simple rule matches
            if name == "tomato" and (soil in ["sandy"] or water in ["rainfed"] or budget < 500):
                suitable = False  # Tomato needs water and some investment
            elif name == "chilli" and (water in ["rainfed"] or budget < 400):
                suitable = False
            elif name == "cotton" and budget < 800:
                suitable = False  # Cotton requires pesticide budget
            elif name == "groundnut" and soil not in ["sandy", "loamy", "clay loam"]:
                suitable = False

            if suitable:
                results.append(crop)
                
        # Ensure we always return at least 3 crops
        if len(results) < 3:
            results = CROP_DISCOVERY_DATA[:3]
            
        return results

    @staticmethod
    def generate_timeline(crop_name: str, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Returns the agricultural timeline for the selected crop."""
        return TIMELINES.get(crop_name, TIMELINES["Tomato"])

    @staticmethod
    def handle_copilot_chat(
        message: str,
        chat_history: List[Dict[str, str]],
        profile: Optional[Dict[str, Any]] = None,
        selected_crop: Optional[str] = None
    ) -> Dict[str, Any]:
        """Runs the Supervisor + Multi-Agent orchestration to generate final answers."""
        profile_summary = f"Profile: Location={profile.get('location') if profile else 'Unknown'}, Soil={profile.get('soil_type') if profile else 'Unknown'}, Crop={selected_crop or 'None'}"
        
        prompt = f"""
        You are the Supervisor Agent of AgriPilot AI, an autonomous agricultural multi-agent co-founder.
        Your sub-agents are:
        1. Crop Planning Agent: Analyzes profile parameters for suitable crops.
        2. Yield Forecast Agent: Predicts harvest timelines and yield outputs.
        3. Weather Risk Agent: Monitors forecast alerts and climate risks.
        4. Market Intelligence Agent: Analyzes Mandi prices and demand.
        5. Logistics Agent: Finds routes, carriers, and calculates fuel costs.
        6. Profit Optimization Agent: Simulates wait vs sell and revenue.
        7. Research Agent: Advises crop-specific fertilizer and care.
        8. Government Scheme Agent: Suggests eligible subsidies (PM-KISAN, etc.).
        9. Loan & Insurance Agent: Risk analysis and credit/insurance recommendations.
        10. What-If Scenario Agent: Runs comparison metrics.
        11. Disease Detection Agent: Handles image diagnosis.

        Farmer Profile & Selected Crop: {profile_summary}
        Current Weather Alerts: {json.dumps(WEATHER_DATA['alerts'])}
        Current Mandi Prices: {json.dumps(MARKET_DATA['mandi_prices'])}

        Farmer's Question: "{message}"

        Coordinate the appropriate sub-agents, gather their simulated opinions, resolve any conflicts (e.g. weather agent warning of rain vs market agent telling to wait), and output a professional, comprehensive, step-by-step guidance response.
        Also, output:
        1. Which agent was invoked (list of names).
        2. An explanation of your reasoning.
        3. A recommended action list.
        4. An overall confidence score (0-100%).

        Respond in JSON format matching this schema:
        {{
          "answer": "Detailed helpful markdown response...",
          "invoked_agents": ["Agent 1", "Agent 2"],
          "supervisor_reasoning": "Why you chose this path and resolved conflicts...",
          "recommended_actions": ["Action 1", "Action 2"],
          "confidence_score": 85
        }}
        """

        gemini_res = get_gemini_response(prompt)
        if gemini_res:
            try:
                cleaned = gemini_res.strip()
                if "```json" in cleaned:
                    cleaned = cleaned.split("```json")[1].split("```")[0]
                elif "```" in cleaned:
                    cleaned = cleaned.split("```")[1].split("```")[0]
                return json.loads(cleaned)
            except Exception as e:
                print(f"Failed to parse Gemini chat response: {e}")

        # Robust rules-based fallback matcher
        msg_lower = message.lower()
        answer = ""
        invoked = ["Supervisor Agent"]
        reasoning = ""
        actions = []
        confidence = 90

        crop = selected_crop or "Tomato"
        crop_low = crop.lower()

        if "water" in msg_lower or "irrigation" in msg_lower or "rain" in msg_lower:
            invoked.extend(["Weather Risk Agent", "Research Agent"])
            reasoning = "Farmer asked about water management. I consulted the Weather Risk Agent and the Research Agent to check immediate forecast alerts."
            rain_alert = "Note that we have a heavy rainfall alert starting Wednesday. Keep drainage pathways clear."
            
            if crop_low == "tomato":
                answer = f"### Tomato Water Guidelines\n\nTomatoes need consistent moisture but are highly sensitive to waterlogging. \n\n* **Current Guideline:** Maintain drip irrigation for 1 to 1.5 hours every alternate day.\n* **Weather Risk warning:** {rain_alert}\n\n**Action plan:** Ensure your fields are graded properly. If rain begins, shut off drip systems immediately to prevent root-rot diseases."
                actions = ["Inspect drip lines for leakage", "Clear drainage trenches before Wednesday rain", "Suspend drip irrigation when rain exceeds 10mm"]
            else:
                answer = f"### Crop Water Guidelines for {crop}\n\n* Keep soil moist but not soggy.\n* {rain_alert}\n\nCheck your field drains before the mid-week rains start."
                actions = ["Clean trenches", "Monitor soil moisture"]
                
        elif "fertilizer" in msg_lower or "manure" in msg_lower or "nutrients" in msg_lower:
            invoked.extend(["Research Agent", "Government Scheme Agent"])
            reasoning = "Matched chemical application request. Called Research Agent for fertilizer guidelines, and Government Scheme Agent to check fertilizer purchase subsidies."
            
            fertilizer_recommend = RESEARCH_ADVISORY.get(crop, {}).get("fertilizer_guidance", "Apply basic organic compost.")
            answer = f"### Nutrient and Fertilizer Plan for {crop}\n\nBased on your crop cycle, here is the expert advice:\n\n* **Recommendation:** {fertilizer_recommend}\n* **Financial Tip:** You are eligible for the **Government Fertilizer Subsidy Scheme**, allowing you to purchase urea and N-P-K at up to 40% subsidized rates from certified local cooperatives.\n\n**Action Plan:** Ensure you take your Aadhaar or Kisan Credit Card (KCC) to the cooperative store to avail of the subsidy."
            actions = ["Purchase subsidized fertilizers from registered depot", "Apply basal dose during soil preparation/dry periods", "Apply Calcium Nitrate spray at flowering to avoid blossom-end rot"]
            
        elif "sell" in msg_lower or "market" in msg_lower or "price" in msg_lower or "mandi" in msg_lower or "earn" in msg_lower:
            invoked.extend(["Market Intelligence Agent", "Market & Profit Optimization Agent", "Logistics Agent"])
            reasoning = "Farmer queried market conditions. Coordinated Market Agent for Mandi price analysis, Logistics Agent for transport optimization, and Profit Agent to calculate net margins."
            
            prices = [p for p in MARKET_DATA["mandi_prices"] if p["crop"].lower() == crop_low]
            price_details = "\n".join([f"- **{p['mandi']}**: ${p['price_per_quintal']}/quintal (Trend: {p['daily_trend']})" for p in prices])
            
            answer = f"### Market Optimization Strategy for {crop}\n\nHere are the active rates for your crop:\n\n{price_details}\n\n* **Market Advice:** {MARKET_DATA['recommendation']}\n* **Logistics Analysis:** Route to Vashi Wholesale is 120km via smooth highway. Using a refrigerated container will reduce moisture weight loss and yield 10% premium profits.\n\n**Wait vs. Sell:** We suggest waiting 5 days for prices to peak, then dispatching via chilled transport."
            actions = ["Pre-book refrigerated mini-truck for Vashi Wholesale", "Sort and grade crops (reject bruised tomatoes)", "Hold harvest for 3-4 days to match the premium price window"]
            confidence = 88
            
        elif "scheme" in msg_lower or "subsidy" in msg_lower or "government" in msg_lower or "loan" in msg_lower or "insurance" in msg_lower:
            invoked.extend(["Government Scheme Agent", "Loan & Insurance Agent"])
            reasoning = "Farmer requested financial support info. Consulted Govt Scheme Agent and Loan/Insurance Agent to evaluate risk and identify credit programs."
            
            schemes_text = "\n".join([f"#### {s['name']}\n- **Eligibility:** {s['eligibility']}\n- **Benefit:** {s['benefits']}" for s in GOVERNMENT_SCHEMES[:2]])
            loans_text = "\n".join([f"#### {l['type']} ({l['provider']})\n- **Interest Rate:** {l['interest_rate']}\n- **Limit:** {l['limit']}" for l in FINANCIAL_OPTIONS])
            
            answer = f"### Financial & Assistance Options\n\nBased on your farm profile, you qualify for several key initiatives:\n\n### Eligible Subsidies & Schemes\n{schemes_text}\n\n### Credit & Insurance Programs\n{loans_text}"
            actions = ["Visit local CSC portal to verify Aadhaar land seeding", "Apply for PMKSY Drip Irrigation subsidy", "Request a KCC application form from your local bank branch"]
            confidence = 92
            
        elif "harvest" in msg_lower or "timeline" in msg_lower or "when" in msg_lower:
            invoked.extend(["Yield Forecast Agent", "Weather Risk Agent"])
            reasoning = "Identified harvest schedule request. Invoked Yield Forecast Agent and Weather Risk Agent to balance crop maturity with rainfall forecasts."
            
            if crop_low == "tomato":
                answer = f"### Tomato Harvest Lifecycle & Timeline\n\n* Tomatoes are ready for harvest between **90-110 days** from sowing.\n* **Current Stage:** Week 8 (Flowering & Fruit Set). Harvest is expected in **4-5 weeks**.\n* **Weather Risk warning:** Heavy rain is forecast for Wed-Fri. If you have any tomatoes at the green-yellow 'breaker' stage, harvest them **now** before the rain starts. Wet soil causes ripe tomatoes to split.\n\n**Supervisor Decision:** Advance your harvest inspection by 48 hours."
                actions = ["Conduct field inspection for yellow/breaker stage tomatoes", "Pick early-harvest tomatoes to save them from rain cracking", "Construct temporary tarpaulin storage sheets"]
            else:
                answer = f"### Harvest Lifecycle for {crop}\n\n* Expected harvest duration is around 100-130 days.\n* Keep monitoring weather forecasts weekly. Avoid picking immediately after heavy rain."
                actions = ["Inspect crop maturity", "Clean crates and drying beds"]
                
        else:
            # General overview query
            invoked.extend(["Crop Planning Agent", "Research Agent", "Weather Risk Agent"])
            reasoning = "Standard agricultural advisory call. Summarizing general farm status and weather alerts."
            answer = f"Hello! I am AgriPilot AI, your agricultural co-founder.\n\nCurrently, you are growing **{crop}**.\n\n* **Weather Status:** High risk of rainfall starting on Wednesday (90% chance).\n* **Market Price Status:** Tomato prices are currently trending upward at Vashi Wholesale, currently trading at $2,650/quintal.\n* **Immediate Advice:** Ensure your soil drainage is clean to handle the upcoming rain, and avoid applying fertilizers today since they will wash away. How can I help you optimize your farm today?"
            actions = ["Inspect drainage channels", "Check crop leaves for yellowing/pest signs", "Browse mandi price forecasts"]

        return {
            "answer": answer,
            "invoked_agents": invoked,
            "supervisor_reasoning": reasoning,
            "recommended_actions": actions,
            "confidence_score": confidence
        }

    @staticmethod
    def detect_disease(image_b64: str) -> Dict[str, Any]:
        """Multimodal disease diagnostic agent."""
        prompt = """
        You are the Disease Detection Agent of AgriPilot AI.
        Analyze this image of a crop leaf.
        Identify:
        1. Name of the disease or pest attack.
        2. Underlying cause (fungal, bacterial, viral, nutrient deficiency).
        3. Precise treatment plan (chemical/organic sprays).
        4. Prevention strategies for future cycles.
        5. Estimated yield loss if left untreated (%).

        Output in JSON format matching this schema:
        {
          "disease_name": "Disease Name",
          "cause": "Cause explanation",
          "diagnosis": "Detailed diagnostic explanation...",
          "treatment": ["Step 1", "Step 2"],
          "prevention": ["Prevention 1", "Prevention 2"],
          "estimated_loss_percent": 35
        }
        """
        # Try to extract raw bytes if b64 is provided
        raw_bytes = None
        if image_b64:
            try:
                # Remove header if present (e.g. data:image/png;base64,)
                if "," in image_b64:
                    image_b64 = image_b64.split(",")[1]
                raw_bytes = base64.b64decode(image_b64)
            except Exception as e:
                print(f"Failed to decode image base64: {e}")

        gemini_res = get_gemini_response(prompt, image_bytes=raw_bytes)
        if gemini_res:
            try:
                cleaned = gemini_res.strip()
                if "```json" in cleaned:
                    cleaned = cleaned.split("```json")[1].split("```")[0]
                elif "```" in cleaned:
                    cleaned = cleaned.split("```")[1].split("```")[0]
                return json.loads(cleaned)
            except Exception as e:
                print(f"Failed to parse Gemini disease diagnosis: {e}")

        # Rule-based simulated diagnostic generator
        diseases = [
            {
                "disease_name": "Tomato Early Blight (Alternaria solani)",
                "cause": "Fungal pathogen thriving in warm, humid conditions.",
                "diagnosis": "Concentric rings (target spots) observed on older leaves, starting from the base of the plant. Causes leaf yellowing, drying, and eventual defoliation, exposing fruits to sunscald.",
                "treatment": [
                    "Spray Mancozeb (2.5g/liter of water) or Copper Oxychloride immediately.",
                    "Remove and destroy infected lower leaves to restrict fungal spore splash."
                ],
                "prevention": [
                    "Practice 3-year crop rotation with non-solanaceous crops.",
                    "Install mulch sheets to block soil-borne spores from splashing onto leaves.",
                    "Ensure wide plant spacing (60cm) to allow quick foliage drying."
                ],
                "estimated_loss_percent": 40
            },
            {
                "disease_name": "Tomato Spider Mite Infestation (Tetranychidae)",
                "cause": "Tiny pest arachnids sucking plant sap, common in dry/dusty weather.",
                "diagnosis": "Fine yellow speckling (stippling) on the upper leaf surface, accompanied by delicate silk webbing on the undersides of the leaves. Severe infestation leads to leaf death.",
                "treatment": [
                    "Spray Abamectin (0.5ml/liter of water) or a strong neem-oil water mixture (1.5%).",
                    "Introduce natural predators like phytoseiid predatory mites if available."
                ],
                "prevention": [
                    "Keep field borders clear of weeds which act as host plants.",
                    "Use overhead misting/sprinkling occasionally to reduce dust and disrupt mite webs."
                ],
                "estimated_loss_percent": 25
            },
            {
                "disease_name": "Nitrogen Deficiency",
                "cause": "Leaching of nitrogen from sandy soils due to excessive rain/irrigation.",
                "diagnosis": "Uniform pale-green to yellow coloration starting on the oldest lower leaves, while young leaves remain light green. Plant growth is severely stunted with thin stems.",
                "treatment": [
                    "Apply quick-release Nitrogen fertilizer like Urea (25kg/acre) as top-dressing.",
                    "Conduct foliar spray of 19-19-19 soluble fertilizer (5g/liter) for immediate recovery."
                ],
                "prevention": [
                    "Incorporate leguminous green manure crops prior to transplanting.",
                    "Apply slow-release organic fertilizers or compost to maintain nitrogen reserves."
                ],
                "estimated_loss_percent": 15
            }
        ]
        return random.choice(diseases)

    @staticmethod
    def parse_document(doc_type: str, file_b64: str) -> Dict[str, Any]:
        """Parses agricultural documents (soil reports, insurance, etc.) and extracts features."""
        prompt = f"""
        You are the Agricultural Research & Document Analysis Agent.
        Analyze this uploaded document ({doc_type}).
        Extract:
        1. Key parameters (pH, organic carbon, nutrient levels if soil; coverage sum, premium if insurance).
        2. Key anomalies or concerns found.
        3. Recommended corrective actions or benefits to claim.

        Respond in JSON format matching this schema:
        {{
          "document_type": "{doc_type}",
          "parameters_extracted": {{"key": "value"}},
          "anomalies_detected": ["Anomaly 1", "Anomaly 2"],
          "recommendations": ["Recommendation 1", "Recommendation 2"]
        }}
        """
        raw_bytes = None
        if file_b64:
            try:
                if "," in file_b64:
                    file_b64 = file_b64.split(",")[1]
                raw_bytes = base64.b64decode(file_b64)
            except Exception as e:
                print(f"Failed to decode document base64: {e}")

        gemini_res = get_gemini_response(prompt, image_bytes=raw_bytes, mime_type="application/pdf")
        if gemini_res:
            try:
                cleaned = gemini_res.strip()
                if "```json" in cleaned:
                    cleaned = cleaned.split("```json")[1].split("```")[0]
                elif "```" in cleaned:
                    cleaned = cleaned.split("```")[1].split("```")[0]
                return json.loads(cleaned)
            except Exception as e:
                print(f"Failed to parse Gemini document extraction: {e}")

        # Fallback Mock Parsers based on type
        if doc_type == "soil_report":
            return {
                "document_type": "Soil Analysis Report",
                "parameters_extracted": {
                    "Soil pH": "5.6 (Highly Acidic)",
                    "Organic Carbon": "0.42% (Low, ideal is >0.75%)",
                    "Available Nitrogen": "120 kg/acre (Deficient)",
                    "Available Phosphorus": "18 kg/acre (Medium)",
                    "Available Potassium": "190 kg/acre (Sufficient)",
                    "Electrical Conductivity (EC)": "0.32 dS/m (Normal)"
                },
                "anomalies_detected": [
                    "High soil acidity (pH 5.6) restricts phosphorus uptake by roots.",
                    "Low organic carbon level indicates depleted organic matter, leading to poor water retention."
                ],
                "recommendations": [
                    "Apply agricultural lime (calcium carbonate) at 500kg/acre to raise soil pH to 6.2 - 6.8.",
                    "Incorporate organic compost, farmyard manure, or vermicompost to enrich carbon content.",
                    "Use ammonium phosphate or urea top-dressings to correct nitrogen deficiency."
                ]
            }
        elif doc_type == "insurance":
            return {
                "document_type": "Crop Insurance Policy (PMFBY)",
                "parameters_extracted": {
                    "Policy Number": "PMFBY-883921-2026",
                    "Sum Insured": "$2,200 per acre",
                    "Premium Paid by Farmer": "$44 per acre (2%)",
                    "Covered Risks": "Drought, Flood, Landslides, Hailstorms, Pest Epidemics",
                    "Exclusions": "Theft, localized fire due to negligence, war"
                },
                "anomalies_detected": [
                    "Policy requires notification of claim within 72 hours of the localized weather event.",
                    "Post-harvest drying coverage is limited to a maximum of 14 days after cutting."
                ],
                "recommendations": [
                    "In case of hailstorm or localized flooding, take photos immediately and submit via the PMFBY App.",
                    "Retain transport receipt and village administrative certificate to verify local crop losses."
                ]
            }
        else:
            return {
                "document_type": "General Agricultural Document",
                "parameters_extracted": {
                    "Verification Status": "Verified",
                    "Owner Name": "Meghashyam",
                    "Registration Area": "2.5 Acres"
                },
                "anomalies_detected": ["None"],
                "recommendations": ["Ensure details align with your digital land registry records for seamless subsidy claims."]
            }

    @staticmethod
    def simulate_scenario(current_crop: str, scenario_type: str, parameters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Simulates what-if outcomes and returns comparison rows."""
        # Yield multipliers and price adjustments
        if scenario_type == "crop_change":
            # Compare current crop with a list of other crops
            results = []
            target_crops = ["Tomato", "Maize", "Groundnut", "Cotton", "Chilli"]
            for tc in target_crops:
                # Find details
                details = next((c for c in CROP_DISCOVERY_DATA if c["crop_name"] == tc), {})
                
                # Setup comparison
                if tc == "Tomato":
                    profit = 1500
                    risk = "Medium-High"
                    yield_val = "13.5 tons/acre"
                    opp = "High wholesale demand (Vashi market)"
                elif tc == "Maize":
                    profit = 750
                    risk = "Low"
                    yield_val = "3.0 tons/acre"
                    opp = "Local starch mill & poultry feed"
                elif tc == "Groundnut":
                    profit = 950
                    risk = "Low-Medium"
                    yield_val = "1.8 tons/acre"
                    opp = "Oil extraction factories"
                elif tc == "Cotton":
                    profit = 1850
                    risk = "High"
                    yield_val = "1.0 tons/acre"
                    opp = "Cotton ginning mills"
                else: # Chilli
                    profit = 2500
                    risk = "High"
                    yield_val = "2.1 tons/acre"
                    opp = "Export buyers and dry-spice wholesalers"

                results.append({
                    "crop_name": tc,
                    "net_profit_per_acre": f"${profit}",
                    "risk_level": risk,
                    "expected_yield": yield_val,
                    "market_opportunity": opp,
                    "suitability_score": "95%" if tc == current_crop else "80%"
                })
            return results

        elif scenario_type == "delay_sell":
            weeks_delayed = int(parameters.get("weeks", 1))
            # Wait vs sell simulation
            if current_crop == "Tomato":
                base_price = 2400
                cost_of_holding_per_week = 60 # refrigeration
                price_trend = [2400, 2700, 2900, 2100, 1800] # Price peak at week 2
            else:
                base_price = 1850
                cost_of_holding_per_week = 20
                price_trend = [1850, 1870, 1900, 1930, 1950]

            rows = []
            for w in range(0, 5):
                # Calculate
                predicted_price = price_trend[min(w, len(price_trend)-1)]
                total_holding_cost = w * cost_of_holding_per_week
                net_revenue_per_quintal = predicted_price - total_holding_cost
                profit_change = (net_revenue_per_quintal - base_price)
                
                rows.append({
                    "timeframe": f"Sell Now" if w == 0 else f"Delay {w} Week(s)",
                    "predicted_mandi_price": f"${predicted_price}/q",
                    "refrigeration_holding_cost": f"${total_holding_cost}/q",
                    "net_revenue_per_quintal": f"${net_revenue_per_quintal}/q",
                    "profit_differential": f"+${profit_change}/q" if profit_change >= 0 else f"-${abs(profit_change)}/q",
                    "risk_profile": "Low (Immediate cashflow)" if w == 0 else ("Medium (Price peak)" if w <= 2 else "High (Spoilage & price drop)")
                })
            return rows

        elif scenario_type == "weather_risk":
            # Simulate rain decrease or increase
            rainfall_change = int(parameters.get("rainfall_change", 0)) # e.g. -20% or +40%
            rows = []
            
            # Scenarios
            scenarios = [
                {
                    "change": "-40% (Severe Drought Risk)",
                    "yield_impact": "-35% reduction",
                    "irrigation_cost": "+$180/acre (extra borewell pumping)",
                    "risk_rating": "Critical",
                    "remedy": "Switch to drip lines, apply organic mulch sheets to conserve soil moisture."
                },
                {
                    "change": "-20% (Dry Spell)",
                    "yield_impact": "-15% reduction",
                    "irrigation_cost": "+$80/acre",
                    "risk_rating": "Medium-High",
                    "remedy": "Prioritize irrigation at flowering stage; use potassium sprays to close stomata."
                },
                {
                    "change": "Normal Rainfall (Base Case)",
                    "yield_impact": "100% expected yield",
                    "irrigation_cost": "Standard budget",
                    "risk_rating": "Low",
                    "remedy": "Follow the standard AgriPilot lifecycle plan."
                },
                {
                    "change": "+20% (Humid Conditions)",
                    "yield_impact": "+5% yield increase",
                    "irrigation_cost": "-$50/acre",
                    "risk_rating": "Medium (Fungal Disease Alert)",
                    "remedy": "Increase spraying of fungicides (Mancozeb) to prevent early/late blight."
                },
                {
                    "change": "+40% (Excessive Rain/Flooding)",
                    "yield_impact": "-45% (Root Rot & Crop Spoilage)",
                    "irrigation_cost": "Standard (Requires Drainage Setup)",
                    "risk_rating": "Severe",
                    "remedy": "Clear exit channels; build raised beds; harvest early at breaker stage."
                }
            ]
            return scenarios
        
        return []
