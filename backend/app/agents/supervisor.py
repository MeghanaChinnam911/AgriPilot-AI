from typing import Dict, Any, List
from app.agents.state import AgentState
from app.services.ai_service import AIService
from app.services.mock_data import WEATHER_DATA, MARKET_DATA, DECISION_LOGS

class AgriPilotMultiAgentSystem:
    def __init__(self):
        # Dictionary of registered agent worker nodes
        self.nodes = {
            "crop_planning": self.crop_planning_node,
            "yield_forecast": self.yield_forecast_node,
            "weather_risk": self.weather_risk_node,
            "market_intel": self.market_intel_node,
            "logistics": self.logistics_node,
            "disease_detection": self.disease_detection_node,
            "profit_opt": self.profit_opt_node,
            "research": self.research_node,
            "schemes": self.schemes_node,
            "finance": self.finance_node,
            "scenario": self.scenario_node,
        }

    # --- Agent Node Definitions ---
    
    def crop_planning_node(self, state: AgentState) -> AgentState:
        if state.profile:
            crops = AIService.discover_crops(state.profile)
            state.crop_planning_decision = {
                "recommended_crops": [c["crop_name"] for c in crops],
                "status": "Recommended top 3 crops based on soil and budget constraints."
            }
        return state

    def yield_forecast_node(self, state: AgentState) -> AgentState:
        crop = state.selected_crop or "Tomato"
        if crop == "Tomato":
            state.yield_forecast_decision = {
                "expected_yield": "13.5 tons per acre",
                "harvest_date": "Week 12 (90 days)",
                "confidence_score": 92
            }
        elif crop == "Maize":
            state.yield_forecast_decision = {
                "expected_yield": "3.2 tons per acre",
                "harvest_date": "Week 12 (100 days)",
                "confidence_score": 94
            }
        else:
            state.yield_forecast_decision = {
                "expected_yield": "1.8 tons per acre",
                "harvest_date": "Week 13 (115 days)",
                "confidence_score": 88
            }
        return state

    def weather_risk_node(self, state: AgentState) -> AgentState:
        # Check weather risks
        alerts = WEATHER_DATA["alerts"]
        state.weather_risk_decision = {
            "alerts": alerts,
            "immediate_risk": "High (Precipitation washouts expected)" if alerts else "Low",
            "confidence_score": 95
        }
        return state

    def market_intel_node(self, state: AgentState) -> AgentState:
        crop = state.selected_crop or "Tomato"
        mandi_prices = [p for p in MARKET_DATA["mandi_prices"] if p["crop"] == crop]
        state.market_intel_decision = {
            "mandi_prices": mandi_prices,
            "best_market": "Vashi Wholesale",
            "selling_window": "Next 7-14 days",
            "confidence_score": 88
        }
        return state

    def logistics_node(self, state: AgentState) -> AgentState:
        state.logistics_decision = {
            "routes": [
                {"name": "Vashi Wholesale", "distance": "120 km", "cost": 280, "refrigeration_recommended": True},
                {"name": "Central Mandi", "distance": "45 km", "cost": 110, "refrigeration_recommended": False}
            ],
            "optimal_carrier": "Chilled Carrier Truck"
        }
        return state

    def disease_detection_node(self, state: AgentState) -> AgentState:
        # Simulated disease nodes, usually triggered via base64 uploads
        state.disease_detection_decision = {
            "recent_check": "Clean",
            "preventive_actions": ["Prune lower tomato leaves to avoid blight", "Install blue sticky traps for leaf miners"]
        }
        return state

    def profit_opt_node(self, state: AgentState) -> AgentState:
        crop = state.selected_crop or "Tomato"
        if crop == "Tomato":
            state.profit_opt_decision = {
                "expected_revenue": 3800,
                "net_profit": 2350,
                "wait_vs_sell_outcome": "Wait 3 days to maximize price peak, yielding +$350."
            }
        else:
            state.profit_opt_decision = {
                "expected_revenue": 1900,
                "net_profit": 1100,
                "wait_vs_sell_outcome": "Sell immediately to avoid upcoming grain storage dampness."
            }
        return state

    def research_node(self, state: AgentState) -> AgentState:
        crop = state.selected_crop or "Tomato"
        state.research_decision = {
            "best_practice": f"Maintain ridge furrow layout for {crop} to bypass root-rot from clay moisture retention.",
            "fertilizer_plan": "Apply Calcium Nitrate foliar sprays to secure structural fruit sets."
        }
        return state

    def schemes_node(self, state: AgentState) -> AgentState:
        state.schemes_decision = {
            "eligible_schemes": ["PM-KISAN Income Support", "PMKSY Micro-Irrigation Drip Subsidy"],
            "financial_gain": "$850 savings estimate"
        }
        return state

    def finance_node(self, state: AgentState) -> AgentState:
        state.finance_decision = {
            "recommended_loans": ["KCC Crop Credit Loan (4% effective rate)"],
            "insurance_plan": "PMFBY Weather Index Policy"
        }
        return state

    def scenario_node(self, state: AgentState) -> AgentState:
        state.scenario_decision = {
            "last_simulation": "What-If rainfall drops 20% -> Yield decreases 15% -> Compensated by Drip installation"
        }
        return state

    # --- Router / Supervisor Logic ---
    
    def run_workflow(self, state: AgentState) -> AgentState:
        """Simulates LangGraph Multi-Agent coordination execution loop."""
        message = state.latest_message.lower()
        
        # 1. Decide which agent nodes to invoke based on message keywords
        selected_nodes = []
        if "water" in message or "irrigation" in message or "rain" in message:
            selected_nodes = ["weather_risk", "research"]
        elif "fertilizer" in message or "manure" in message or "nutrients" in message:
            selected_nodes = ["research", "schemes"]
        elif "sell" in message or "market" in message or "price" in message or "mandi" in message:
            selected_nodes = ["market_intel", "profit_opt", "logistics"]
        elif "scheme" in message or "subsidy" in message or "government" in message or "loan" in message or "insurance" in message:
            selected_nodes = ["schemes", "finance"]
        elif "harvest" in message or "timeline" in message or "when" in message:
            selected_nodes = ["yield_forecast", "weather_risk"]
        else:
            # General coordinate
            selected_nodes = ["crop_planning", "research", "weather_risk"]

        state.invoked_agents = ["Supervisor Agent"] + [f"{n.replace('_', ' ').title()} Agent" for n in selected_nodes]
        
        # 2. Execute worker nodes, updating AgentState
        for node_name in selected_nodes:
            node_func = self.nodes.get(node_name)
            if node_func:
                state = node_func(state)

        # 3. Supervisor Agent synthesizes outputs and resolves conflicts
        # Example conflict: Weather warns of heavy rain on Day 12 (needs early harvesting), but Market recommends waiting 5 days for prices to peak.
        # Supervisor resolves: Harvest breaker stage tomatoes immediately before rain to avoid splitting, but use chilled logistics to hold crop for 3 days before selling.
        ai_response = AIService.handle_copilot_chat(
            message=state.latest_message,
            chat_history=state.chat_history,
            profile=state.profile,
            selected_crop=state.selected_crop
        )
        
        state.supervisor_recommendation = ai_response.get("answer")
        
        # Update live decision logs
        new_logs = []
        for agent in state.invoked_agents:
            if "Weather" in agent:
                new_logs.append({
                    "day": 12, "agent": agent, 
                    "decision": "Detected high-probability rainfall warning (90%). Suspend open fertilizer applications.",
                    "status": "Critical"
                })
            elif "Market" in agent:
                new_logs.append({
                    "day": 15, "agent": agent, 
                    "decision": "Vashi Mandi prices trending upwards (+200/quintal) due to supply drop.",
                    "status": "Approved"
                })
            elif "Logistics" in agent:
                new_logs.append({
                    "day": 15, "agent": agent, 
                    "decision": "Route to Vashi is open. Recommend chilled carriage over mini-trucks to avoid spoilage.",
                    "status": "Enforced"
                })
            elif "Profit" in agent:
                new_logs.append({
                    "day": 15, "agent": agent, 
                    "decision": "Calculated hold margin: Net revenue gains of +$350 after refrigeration costs.",
                    "status": "Approved"
                })
            elif "Research" in agent:
                new_logs.append({
                    "day": 8, "agent": agent, 
                    "decision": "Vegetative crop phase. Recommend spraying Calcium Nitrate to protect blossom ends.",
                    "status": "Approved"
                })
            elif "Schemes" in agent:
                new_logs.append({
                    "day": 4, "agent": agent, 
                    "decision": "Eligible for PMKSY Drip Subsidy. Preparing digital document checklist.",
                    "status": "Informational"
                })
                
        # Always inject the supervisor's synthesis override log
        new_logs.append({
            "day": 15 if "Market" in "".join(state.invoked_agents) else 12,
            "agent": "Supervisor Agent",
            "decision": f"Overrode timeline. Directed {', '.join([a for a in state.invoked_agents if a != 'Supervisor Agent'])} actions to coordinate.",
            "status": "Enforced"
        })
        
        state.decision_log = new_logs + state.decision_log
        
        # Keep logs limited to 15 entries
        state.decision_log = state.decision_log[:15]
        
        return state
