# Mock Agricultural Database for AgriPilot AI

CROP_DISCOVERY_DATA = [
    {
        "crop_name": "Tomato",
        "growth_duration": "90-110 days",
        "water_requirement": "Medium (Drip Irrigation recommended)",
        "risk_level": "Medium-High (Susceptible to early blight and pest attacks)",
        "profit_potential": "High ($1,200 - $1,800 net per acre)",
        "expected_yield": "12 - 15 tons per acre",
        "best_season": "Kharif/Rabi",
        "details": "Tomatoes have a short crop cycle and offer rapid cash flow, but require active pest management and consistent water."
    },
    {
        "crop_name": "Maize",
        "growth_duration": "100-120 days",
        "water_requirement": "Low-Medium (Can survive dry spells, rainfed works)",
        "risk_level": "Low-Medium (Resilient crop, main risk is fall armyworm)",
        "profit_potential": "Medium ($600 - $900 net per acre)",
        "expected_yield": "2.5 - 3.5 tons per acre",
        "best_season": "Kharif",
        "details": "Maize is a sturdy grain crop with high market demand for feed and starch, requiring lower initial investment."
    },
    {
        "crop_name": "Groundnut",
        "growth_duration": "110-130 days",
        "water_requirement": "Low (Prefers sandy-loam soils, drought tolerant)",
        "risk_level": "Low (Main risk is late leaf spot)",
        "profit_potential": "Medium-High ($800 - $1,100 net per acre)",
        "expected_yield": "1.5 - 2.0 tons per acre",
        "best_season": "Kharif",
        "details": "Groundnuts enrich soil nitrogen, tolerate dry spells well, and have a highly stable market value."
    },
    {
        "crop_name": "Cotton",
        "growth_duration": "150-180 days",
        "water_requirement": "Medium-High (Requires dry weather during flowering/boll opening)",
        "risk_level": "High (Pest risk like pink bollworm is elevated)",
        "profit_potential": "High ($1,500 - $2,200 net per acre)",
        "expected_yield": "0.8 - 1.2 tons (lint) per acre",
        "best_season": "Kharif",
        "details": "Cotton is a major cash crop with long growth cycles, commanding premium prices but demanding extensive crop care."
    },
    {
        "crop_name": "Chilli",
        "growth_duration": "120-150 days",
        "water_requirement": "Medium (Thrives in well-drained loamy soil)",
        "risk_level": "Medium (Prone to thrips and leaf curl virus)",
        "profit_potential": "Very High ($2,000 - $3,000 net per acre)",
        "expected_yield": "1.8 - 2.5 tons (dry chilli) per acre",
        "best_season": "Kharif/Rabi",
        "details": "Chilli yields premium profits due to culinary and industrial demand, but is labor-intensive during harvesting."
    }
]

TIMELINES = {
    "Tomato": [
        {"week": 1, "stage": "Land Preparation", "activity": "Deep ploughing, applying farmyard manure, adjusting soil pH.", "risks": "Soil-borne pathogens", "fertilizers": "Organic compost (5 tons/acre)", "water": "Pre-irrigation to maintain moisture", "diseases": "None", "market": "N/A"},
        {"week": 2, "stage": "Seed Sowing & Nursery", "activity": "Sowing seeds in nursery beds or pro-trays.", "risks": "Damping-off in nursery", "fertilizers": "N-P-K 19-19-19 starter solution", "water": "Light sprinkling daily", "diseases": "Damping-off", "market": "N/A"},
        {"week": 4, "stage": "Transplanting", "activity": "Moving 25-day old seedlings to the main field with drip lines.", "risks": "Transplant shock, cutworms", "fertilizers": "Basal dose: DAP 50kg, MOP 25kg per acre", "water": "Drip irrigation for 1 hour daily", "diseases": "Root rot", "market": "N/A"},
        {"week": 6, "stage": "Vegetative & Trellising", "activity": "Staking plants using bamboo poles and twine.", "risks": "Weed competition, early aphid attacks", "fertilizers": "Urea 25kg, Micronutrient spray", "water": "Drip irrigation for 1.5 hours every alternate day", "diseases": "Early Blight", "market": "Analyze seed/input cost trends"},
        {"week": 8, "stage": "Flowering & Fruit Set", "activity": "Foliar spray of Calcium Nitrate and Boron to prevent blossom-end rot.", "risks": "Flower drop due to extreme heat", "fertilizers": "Calcium Nitrate 10kg, Boron 1kg", "water": "Consistent moisture, avoid waterlogging", "diseases": "Late Blight, Thrips", "market": "Check early harvest wholesale market demand"},
        {"week": 12, "stage": "Harvest Planning", "activity": "Harvesting breaker-stage tomatoes for distant markets.", "risks": "Fruit cracking, post-harvest bruising", "fertilizers": "Sulphate of Potash (SOP) 15kg (improves color/shelf life)", "water": "Reduce irrigation duration to avoid watery fruits", "diseases": "Fruit rot", "market": "Select local vs distant Mandi (compare rates)"},
        {"week": 13, "stage": "Market Dispatch", "activity": "Sorting, grading, crate packing, and transporting to mandi.", "risks": "Transit delays, sudden price drops", "fertilizers": "None", "water": "Stop irrigation 2 days prior to final pick", "diseases": "None", "market": "Highest bid: eNAM Central Mandi"}
    ],
    "Maize": [
        {"week": 1, "stage": "Land Preparation", "activity": "Ploughing, creating ridges and furrows for drainage.", "risks": "Poor seedbed compaction", "fertilizers": "Well-rotted compost, Zinc Sulphate 10kg", "water": "Ensure soil has decent residual moisture", "diseases": "None", "market": "N/A"},
        {"week": 2, "stage": "Sowing", "activity": "Dibbling seeds at a depth of 5cm with 60x20cm spacing.", "risks": "Seed rotting, rodent damage", "fertilizers": "Basal: N-P-K 20:20:20 (50kg/acre)", "water": "Irrigate immediately after sowing", "diseases": "Seedling blight", "market": "N/A"},
        {"week": 4, "stage": "Early Vegetative & Weeding", "activity": "Hand weeding and thinning extra seedlings.", "risks": "Fall Armyworm (FAW) leaf damage", "fertilizers": "Top dress: Urea (30kg/acre)", "water": "Irrigate if rainfall fails for 10 days", "diseases": "None", "market": "N/A"},
        {"week": 6, "stage": "Knee-High Stage", "activity": "Earthing up soil around plants to support roots.", "risks": "Nutrient deficiency, lodging due to wind", "fertilizers": "Second top-dressing: Urea (25kg/acre)", "water": "Critical stage: moderate water required", "diseases": "Turcicum leaf blight", "market": "Check starch mill purchase rates"},
        {"week": 8, "stage": "Tasseling & Silking", "activity": "Monitoring cob formation and silk emergence.", "risks": "Water stress reduces grain fill significantly", "fertilizers": "Potassium spray for drought resilience", "water": "High water requirement: ensure weekly watering", "diseases": "Common rust", "market": "Analyze feed manufacturer demands"},
        {"week": 12, "stage": "Harvesting", "activity": "Harvesting when moisture content drops to 15-18%.", "risks": "Cob rot, aflatoxin due to moisture", "fertilizers": "None", "water": "Stop irrigation completely", "diseases": "Ear rot", "market": "Compare local grain dealer vs govt purchase center"},
        {"week": 13, "stage": "Market Dispatch", "activity": "Shelling, drying, bagging, and dispatching.", "risks": "Damp storage hazards", "fertilizers": "None", "water": "Keep grains dry", "diseases": "None", "market": "Highest profit: Apex Grain Terminal"}
    ]
}

# Create default schedules for other crops just in case they are selected
for crop in ["Groundnut", "Cotton", "Chilli"]:
    TIMELINES[crop] = [
        {"week": 1, "stage": "Land Preparation", "activity": f"Ploughing land for {crop} planting.", "risks": "Weed growth", "fertilizers": "Compost", "water": "Light irrigation", "diseases": "None", "market": "N/A"},
        {"week": 2, "stage": "Sowing", "activity": "Sowing seeds at recommended depth.", "risks": "Poor germination", "fertilizers": "Starter NPK", "water": "Moist soil maintenance", "diseases": "Damping-off", "market": "N/A"},
        {"week": 4, "stage": "Vegetative Growth", "activity": "Weeding and plant protection.", "risks": "Sucking pests", "fertilizers": "Urea top dress", "water": "Regular watering", "diseases": "Leaf spot", "market": "N/A"},
        {"week": 8, "stage": "Flowering & Development", "activity": "Foliar nutrient sprays and monitoring.", "risks": "Flower drop", "fertilizers": "Potash and Calcium", "water": "Crucial watering phase", "diseases": "Blight", "market": "N/A"},
        {"week": 12, "stage": "Harvest Planning", "activity": "Testing maturity and preparing harvest equipment.", "risks": "Sudden rain damage", "fertilizers": "None", "water": "Dry condition maintenance", "diseases": "Rot", "market": "Market analysis"},
        {"week": 13, "stage": "Harvest & Dispatch", "activity": "Sorting and transporting to wholesale buyers.", "risks": "Spoilage", "fertilizers": "None", "water": "None", "diseases": "None", "market": "Mandi sale"}
    ]

WEATHER_DATA = {
    "current_temp": "31°C",
    "humidity": "68%",
    "rainfall_probability": "15%",
    "wind_speed": "14 km/h",
    "forecast": [
        {"day": "Mon", "temp": "31°C", "condition": "Sunny", "rain": "5%"},
        {"day": "Tue", "temp": "32°C", "condition": "Sunny", "rain": "10%"},
        {"day": "Wed", "temp": "29°C", "condition": "Partly Cloudy", "rain": "40%"},
        {"day": "Thu", "temp": "26°C", "condition": "Heavy Rain", "rain": "90%"},
        {"day": "Fri", "temp": "28°C", "condition": "Thunderstorm", "rain": "75%"},
        {"day": "Sat", "temp": "30°C", "condition": "Clear", "rain": "10%"},
        {"day": "Sun", "temp": "31°C", "condition": "Sunny", "rain": "5%"}
    ],
    "alerts": [
        {
            "severity": "High",
            "type": "Heavy Rainfall Warning (Wed-Fri)",
            "description": "A low-pressure system is expected to bring 80-120mm of rainfall. High risk of waterlogging in low-lying crop fields.",
            "actions": [
                "Clear drainage channels in tomato and chilli fields immediately.",
                "Postpone fertilizer application scheduled for mid-week.",
                "Complete any pending harvesting before Wednesday morning."
            ]
        }
    ]
}

MARKET_DATA = {
    "mandi_prices": [
        {"crop": "Tomato", "mandi": "Central Mandi", "price_per_quintal": 2400, "daily_trend": "+120", "demand": "High"},
        {"crop": "Tomato", "mandi": "Vashi Wholesale", "price_per_quintal": 2650, "daily_trend": "+200", "demand": "Very High"},
        {"crop": "Tomato", "mandi": "Local Farmer Cooperative", "price_per_quintal": 2100, "daily_trend": "0", "demand": "Stable"},
        {"crop": "Maize", "mandi": "Central Mandi", "price_per_quintal": 1850, "daily_trend": "-30", "demand": "Moderate"},
        {"crop": "Maize", "mandi": "Grain Terminal", "price_per_quintal": 1980, "daily_trend": "+40", "demand": "High"},
        {"crop": "Groundnut", "mandi": "Oilseed Terminal", "price_per_quintal": 6200, "daily_trend": "+100", "demand": "High"},
        {"crop": "Cotton", "mandi": "Cotton Corporation Hub", "price_per_quintal": 7400, "daily_trend": "-50", "demand": "Stable"},
        {"crop": "Chilli", "mandi": "Spice Mandi", "price_per_quintal": 18500, "daily_trend": "+450", "demand": "Very High"}
    ],
    "price_forecast": {
        "Tomato": [
            {"week": "Current", "price": 2400},
            {"week": "Week +1", "price": 2700},
            {"week": "Week +2", "price": 2900},
            {"week": "Week +3", "price": 2100},
            {"week": "Week +4", "price": 1800}
        ],
        "Maize": [
            {"week": "Current", "price": 1850},
            {"week": "Week +1", "price": 1870},
            {"week": "Week +2", "price": 1900},
            {"week": "Week +3", "price": 1930},
            {"week": "Week +4", "price": 1950}
        ]
    },
    "recommendation": "Vashi Wholesale offers the highest price ($2,650/quintal). Prices are forecasted to rise for 2 weeks due to transport bottlenecks, then fall as the major harvesting season peaks. Best selling window is in 8 to 14 days."
}

LOGISTICS_ROUTES = [
    {
        "destination": "Vashi Wholesale (Recommended)",
        "distance": "120 km",
        "duration": "3.5 hours",
        "transport_type": "Chilled container truck (highly recommended to maintain tomato freshness)",
        "estimated_cost": 280,
        "fuel_cost": 150,
        "road_condition": "Smooth National Highway. Low transit risks.",
        "net_revenue_multiplier": 1.10
    },
    {
        "destination": "Central Mandi",
        "distance": "45 km",
        "duration": "1.5 hours",
        "transport_type": "Open mini-truck",
        "estimated_cost": 110,
        "fuel_cost": 50,
        "road_condition": "State highway with moderate traffic. Risk of mechanical vibrations damaging ripe tomatoes.",
        "net_revenue_multiplier": 0.95
    },
    {
        "destination": "Local Cooperative Hub",
        "distance": "12 km",
        "duration": "25 mins",
        "transport_type": "Tractor / Small carriage",
        "estimated_cost": 30,
        "fuel_cost": 15,
        "road_condition": "Dirt and gravel roads. Easy transport, but lower pricing rates.",
        "net_revenue_multiplier": 0.85
    }
]

GOVERNMENT_SCHEMES = [
    {
        "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "eligibility": "All landholding farmer families across the country with cultivable land.",
        "benefits": "Direct income support of $75 (INR 6,000) per year in three equal installments directly into bank accounts.",
        "guidance": "Requires Aadhaar verification, Land Registry records, and an active bank account. Apply via PM-KISAN portal or local CSC center."
    },
    {
        "name": "Subsidized Micro-Irrigation Scheme (PMKSY)",
        "eligibility": "Small and marginal farmers who want to set up drip or sprinkler systems.",
        "benefits": "55% to 80% financial subsidy on the total cost of installing drip lines and motor pump accessories.",
        "guidance": "Need to submit soil testing report, land map (Khasra/Khatauni), and quotation from an approved irrigation vendor."
    },
    {
        "name": "Fertilizer Subsidy Scheme",
        "eligibility": "All active farmers purchasing registered agricultural inputs.",
        "benefits": "Urea and P&K fertilizers are sold at highly subsidized statutory rates at retail outlets using POS machines.",
        "guidance": "Purchase directly from authorized dealers using your Aadhaar or Kisan Credit Card (KCC)."
    },
    {
        "name": "National Agricultural Insurance Scheme (PMFBY)",
        "eligibility": "Farmers growing notified crops in notified areas. Compulsory for farmers with active bank crop loans.",
        "benefits": "Low premium rates (1.5% to 2% for food crops, 5% for horticultural crops) with full sum insured coverage against weather anomalies.",
        "guidance": "Premium is automatically debited if you have a KCC loan. Non-loanee farmers can register on the PMFBY portal with land records."
    }
]

FINANCIAL_OPTIONS = [
    {
        "type": "Kisan Credit Card (KCC) Loan",
        "provider": "State Cooperative & Public Banks",
        "limit": "Up to $3,500 based on land size and crop type",
        "interest_rate": "7% per annum (effective rate 4% after timely repayment subvention)",
        "risk_assessment": "Low risk, highly recommended for short-term operational credit (seeds, fertilizer, labor).",
        "requirements": "Land cultivation rights document, Aadhaar card, crop plan."
    },
    {
        "type": "Solar Pump Joint Subsidy Loan",
        "provider": "Agricultural Development Bank",
        "limit": "Up to $5,000 for purchasing and installing solar pump sets",
        "interest_rate": "8.5% per annum",
        "risk_assessment": "Medium risk, but reduces recurring irrigation fuel costs (diesel) to zero, boosting long-term profits.",
        "requirements": "Approved government subsidy letter, ground water certificate."
    }
]

RESEARCH_ADVISORY = {
    "Tomato": {
        "best_practices": "Use high-yielding hybrid seeds. Maintain raised beds (15cm height, 1m width). Practice crop rotation with cereals to disrupt pathogen cycles.",
        "fertilizer_guidance": "Basal dose of 50kg Nitrogen, 60kg Phosphorus, 50kg Potassium per acre. Foliar spray of Calcium Nitrate (0.5%) during flowering to prevent blossom-end rot.",
        "crop_care": "Install sticky traps for whiteflies. Keep humidity in check by pruning lower senescent leaves. Ensure stakes are secure to keep fruits off damp soil."
    },
    "Maize": {
        "best_practices": "Sow seeds at optimal depth (5cm) to ensure strong root anchorages. Practice crop rotation with legume crops like soybean to restore nitrogen levels.",
        "fertilizer_guidance": "Basal dose: N-P-K 40:40:40 kg/acre. Top dress with 30kg Urea at 30 days (knee-high) and 30kg Urea at 55 days (tasseling).",
        "crop_care": "Spray Neem oil (1500 ppm) at first sign of Fall Armyworm. Keep the field weed-free for the first 45 days to avoid grain competition."
    }
}

DECISION_LOGS = [
    {"day": 1, "agent": "Crop Planning Agent", "decision": "Analyzed clay loam soil & budget. Recommended Tomato over Chilli due to faster return cycles.", "status": "Approved"},
    {"day": 4, "agent": "Government Scheme Agent", "decision": "Matched farmer profile with PMKSY Drip Irrigation subsidy. Estimated savings: $850.", "status": "Informational"},
    {"day": 8, "agent": "Research Agent", "decision": "Identified vegetative transition. Recommended top dressing with Nitrogen (Urea 25kg) and micronutrient spray.", "status": "Implemented"},
    {"day": 12, "agent": "Weather Risk Agent", "decision": "Detected high-probability rainfall warning (80mm) starting in 2 days. Issued alert to clear drainage.", "status": "Critical"},
    {"day": 12, "agent": "Supervisor Agent", "decision": "Overrode default timeline. Commanded advancement of crop inspection and clearing of drain trenches to prevent root waterlogging.", "status": "Enforced"},
    {"day": 15, "agent": "Market Intelligence Agent", "decision": "Detected market price spike at Vashi Wholesale due to highway washouts. Recommended holding crop for 3 days.", "status": "Approved"},
    {"day": 15, "agent": "Logistics Agent", "decision": "Rerouted shipment to Vashi Wholesale. Recommends refrigerated carriage over open carriage to prevent moisture spoilage.", "status": "Enforced"},
    {"day": 15, "agent": "Market & Profit Agent", "decision": "Calculated wait-vs-sell parameters. Predicted additional net revenue of $350 after accounting for refrigeration costs.", "status": "Enforced"}
]
