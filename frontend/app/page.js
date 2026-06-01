"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sprout, Thermometer, CloudRain, TrendingUp, AlertTriangle, 
  MapPin, HelpCircle, User, Info, DollarSign, Calendar, 
  TrendingDown, CheckCircle2, ShieldAlert, Cpu, Network,
  Mic, MicOff, Volume2, Upload, FileText, Play, ArrowRight, Check, X
} from "lucide-react";

export default function Home() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState("dashboard"); // dashboard, profile, discovery, recommendations, timeline, market, disease, weather, logistics, schemes, profit, chat
  
  // App Core State
  const [profile, setProfile] = useState({
    location: "California Central Valley",
    land_area: 5.0,
    soil_type: "Loamy",
    water_availability: "Drip Irrigation",
    planting_date: "2026-06-15",
    budget: 1500,
    farming_experience: "Intermediate"
  });
  
  const [profileSaved, setProfileSaved] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [cropsList, setCropsList] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [decisionLogs, setDecisionLogs] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [collaborationSchema, setCollaborationSchema] = useState(null);
  
  // Interactive UI Inputs
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Welcome! I am AgriPilot AI, your autonomous agricultural co-founder. I monitor your weather, soil, and market pricing in real-time. Try asking me a question or uploading a leaf photo to diagnose diseases!" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [activeAgents, setActiveAgents] = useState(["Supervisor Agent", "Crop Planning Agent", "Weather Risk Agent"]);
  
  // Multimodal Inputs
  const [diseaseImage, setDiseaseImage] = useState(null);
  const [diseaseDiagnosis, setDiseaseDiagnosis] = useState(null);
  const [diseaseLoading, setDiseaseLoading] = useState(false);
  
  const [documentType, setDocumentType] = useState("soil_report");
  const [documentAnalysis, setDocumentAnalysis] = useState(null);
  const [docLoading, setDocLoading] = useState(false);
  const [uploadedDocName, setUploadedDocName] = useState("");

  // What-If Scenario inputs
  const [scenarioType, setScenarioType] = useState("crop_change");
  const [delayWeeks, setDelayWeeks] = useState(1);
  const [rainfallChange, setRainfallChange] = useState(0);
  const [simulationResults, setSimulationResults] = useState([]);
  const [simulating, setSimulating] = useState(false);

  // Audio / Speech State
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Load and refresh core dashboard metrics from backend
  useEffect(() => {
    fetchDashboardData();
    // Check speech API support
    if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      setSpeechSupported(true);
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch Weather
      const wRes = await fetch("http://localhost:8000/api/weather");
      if (wRes.ok) {
        const wData = await wRes.json();
        setWeatherData(wData);
        setWeatherAlerts(wData.alerts || []);
      }
      
      // Fetch Markets & Logistics
      const mRes = await fetch("http://localhost:8000/api/market");
      if (mRes.ok) {
        const mData = await mRes.json();
        setMarketData(mData.market_data);
        setRoutes(mData.logistics_routes || []);
      }
      
      // Fetch Timeline & Logs
      const tRes = await fetch("http://localhost:8000/api/timeline");
      if (tRes.ok) {
        const tData = await tRes.json();
        setSelectedCrop(tData.selected_crop || "Tomato");
        setTimeline(tData.timeline || []);
        setDecisionLogs(tData.decision_logs || []);
      }
      
      // Fetch crops list
      const cRes = await fetch("http://localhost:8000/api/crops/discover");
      if (cRes.ok) {
        const cData = await cRes.json();
        setCropsList(cData);
      }

      // Fetch agents collaboration
      const agRes = await fetch("http://localhost:8000/api/collaboration");
      if (agRes.ok) {
        const agData = await agRes.json();
        setCollaborationSchema(agData);
      }
    } catch (e) {
      console.warn("Backend not running or returned error. Falling back to local simulated data generator.", e);
      // Fallback local initializers
      setSelectedCrop("Tomato");
      setTimeline([
        {week: 1, stage: "Land Preparation", activity: "Deep ploughing, applying farmyard manure, adjusting soil pH.", risks: "Soil-borne pathogens", fertilizers: "Organic compost (5 tons/acre)", water: "Pre-irrigation to maintain moisture", diseases: "None", market: "N/A"},
        {week: 2, stage: "Seed Sowing & Nursery", activity: "Sowing seeds in nursery beds or pro-trays.", risks: "Damping-off in nursery", fertilizers: "NPK starter solution", water: "Daily light sprinkling", diseases: "Damping-off", market: "N/A"},
        {week: 4, stage: "Transplanting", activity: "Moving 25-day old seedlings to the main field with drip lines.", risks: "Transplant shock", fertilizers: "DAP 50kg, MOP 25kg per acre", water: "Drip irrigation 1 hour daily", diseases: "Root rot", market: "N/A"},
        {week: 6, stage: "Vegetative & Trellising", activity: "Staking plants using bamboo poles and twine.", risks: "Weeds, aphids", fertilizers: "Urea 25kg, Micronutrients", water: "Drip irrigation alternate days", diseases: "Early Blight", market: "Analyze input costs"},
        {week: 8, stage: "Flowering & Fruit Set", activity: "Foliar spray of Calcium Nitrate and Boron.", risks: "Flower drop due to heat", fertilizers: "Calcium Nitrate 10kg, Boron 1kg", water: "Consistent moisture", diseases: "Late Blight, Thrips", market: "Check mandi demand"},
        {week: 12, stage: "Harvest Planning", activity: "Harvesting breaker-stage tomatoes for distant markets.", risks: "Fruit cracking, transit delays", fertilizers: "SOP 15kg (color improvements)", water: "Reduce watering duration", diseases: "Fruit rot", market: "Compare Vashi vs local cooperative rates"},
        {week: 13, stage: "Market Dispatch", activity: "Sorting, grading, packing, and transporting to mandi.", risks: "Transit delays", fertilizers: "None", water: "Stop irrigation 2 days prior", diseases: "None", market: "Highest bid: eNAM Central Mandi"}
      ]);
      setDecisionLogs([
        {day: 12, agent: "Weather Risk Agent", decision: "Detected high-probability heavy rainfall (80mm) forecast starting Wed. Suspend fertilizers.", status: "Critical"},
        {day: 12, agent: "Supervisor Agent", decision: "Overrode default timeline. Ordered clearing of main drain channels to mitigate field flood hazards.", status: "Enforced"},
        {day: 15, agent: "Market Intelligence Agent", decision: "Prices spiked by +$200/quintal at Vashi Wholesale due to severe highway washouts.", status: "Approved"},
        {day: 15, agent: "Logistics Agent", decision: "Rerouted logistics carrier to Vashi Wholesale. Recommends closed reefer truck for cargo protection.", status: "Enforced"},
        {day: 15, agent: "Market & Profit Agent", decision: "Delay harvest delivery by 3 days. Estimated net revenue gain is +$350.", status: "Enforced"}
      ]);
      setWeatherAlerts([
        {
          severity: "High",
          type: "Heavy Rainfall Warning (Wed-Fri)",
          description: "A low-pressure system is expected to bring 80-120mm of rainfall. High risk of waterlogging in low-lying crop fields.",
          actions: [
            "Clear drainage channels in tomato and chilli fields immediately.",
            "Postpone fertilizer application scheduled for mid-week.",
            "Complete any pending harvesting before Wednesday morning."
          ]
        }
      ]);
    }
  };

  // Submit profile to FastAPI
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setProfileSaved(true);
        // Discover crops automatically
        const cRes = await fetch("http://localhost:8000/api/crops/discover");
        if (cRes.ok) {
          const cData = await cRes.json();
          setCropsList(cData);
        }
        setCurrentView("discovery");
      }
    } catch (err) {
      setProfileSaved(true);
      setCurrentView("discovery"); // Fallback routing for mock
    }
  };

  // Select crop and compile timeline
  const handleSelectCrop = async (cropName) => {
    setSelectedCrop(cropName);
    try {
      const res = await fetch("http://localhost:8000/api/crops/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop_name: cropName })
      });
      if (res.ok) {
        const data = await res.json();
        setTimeline(data.timeline);
        setDecisionLogs(data.decision_logs);
      }
      setCurrentView("timeline");
    } catch (err) {
      // Local mock selector fallback
      setTimeline(cropName === "Tomato" || cropName === "Maize" ? TIMELINES_MOCK[cropName] : TIMELINES_MOCK["Tomato"]);
      setDecisionLogs([
        { day: 1, agent: "Crop Planning Agent", decision: `Confirmed selection of ${cropName} based on profile parameters.`, status: "Approved" },
        ...decisionLogs
      ]);
      setCurrentView("timeline");
    }
  };

  // Copilot conversation query
  const handleSendChat = async (e) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatMessage("");
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          profile: profile,
          selected_crop: selectedCrop
        })
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [...prev, { role: "assistant", content: data.answer }]);
        setActiveAgents(data.invoked_agents);
        setDecisionLogs(data.decision_logs);
        // Automatically speak response if voice is supported
        speakMessage(data.answer);
      }
    } catch (err) {
      // Local fallback mock AI chatbot replies
      setTimeout(() => {
        const reply = mockLocalChatReply(userMsg, selectedCrop);
        setChatHistory(prev => [...prev, { role: "assistant", content: reply.answer }]);
        setActiveAgents(reply.invoked_agents);
        setDecisionLogs(prev => [
          { day: 15, agent: reply.invoked_agents[1] || "Research Agent", decision: `Simulated query routing. Handled: "${userMsg.substring(0, 30)}..."`, status: "Approved" },
          ...prev
        ]);
        speakMessage(reply.answer);
      }, 800);
    } finally {
      setChatLoading(false);
    }
  };

  // Web Speech synthesis read-aloud
  const speakMessage = (text) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // stop past speaker
      // Remove markdown tags for smoother voicing
      const plainText = text.replace(/[*#`_\-]/g, "").substring(0, 160); // Read first 160 chars
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Speech recognition dictation
  const toggleSpeechRecording = () => {
    if (!speechSupported) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      const r = new SpeechRecognition();
      r.continuous = false;
      r.interimResults = false;
      r.lang = "en-US";

      r.onstart = () => {
        setIsRecording(true);
      };

      r.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setChatMessage(transcript);
        setIsRecording(false);
      };

      r.onerror = () => {
        setIsRecording(false);
      };

      r.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = r;
      r.start();
    }
  };

  // Handle mock leaf disease image analysis
  const handleDiseaseUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      setDiseaseImage(reader.result);
      setDiseaseLoading(true);
      setDiseaseDiagnosis(null);
      
      try {
        const res = await fetch("http://localhost:8000/api/disease/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file_bytes: reader.result })
        });
        if (res.ok) {
          const data = await res.json();
          setDiseaseDiagnosis(data);
        }
      } catch (err) {
        // Local mock fallback diagnosis
        setTimeout(() => {
          setDiseaseDiagnosis({
            disease_name: "Tomato Early Blight (Alternaria solani)",
            cause: "Fungal pathogen thriving in high humidity.",
            diagnosis: "Observed target-shaped concentric rings on lower foliage. Spreading upward, threatening yield.",
            treatment: [
              "Spray Copper Oxychloride (2.5g/L) immediately.",
              "Prune and burn lower infected foliage."
            ],
            prevention: [
              "Use crop rotation.",
              "Set up straw/plastic mulch to prevent soil spores from splashing."
            ],
            estimated_loss_percent: 30
          });
        }, 1200);
      } finally {
        setDiseaseLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle document uploading
  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedDocName(file.name);
    setDocLoading(true);
    setDocumentAnalysis(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/document/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doc_type: documentType,
            file_bytes: reader.result
          })
        });
        if (res.ok) {
          const data = await res.json();
          setDocumentAnalysis(data);
        }
      } catch (err) {
        // Fallback local mock document analyzer
        setTimeout(() => {
          if (documentType === "soil_report") {
            setDocumentAnalysis({
              document_type: "Soil Chemistry Report (Lab verified)",
              parameters_extracted: {
                "Soil pH": "5.7 (Acidic)",
                "Organic Carbon": "0.45% (Deficient)",
                "Nitrogen (N)": "115 kg/acre (Low)",
                "Potash (K)": "220 kg/acre (Good)"
              },
              anomalies_detected: [
                "Acidic soil restricts phosphorus solubilization and root spread.",
                "Organic carbon depletion points to poor water retention capacity."
              ],
              recommendations: [
                "Incorporate 500kg Lime per acre to buffer pH upwards.",
                "Blend in 5 tons vermicompost to build carbon and nitrogen reservoirs."
              ]
            });
          } else {
            setDocumentAnalysis({
              document_type: "Crop Insurance Scheme policy details",
              parameters_extracted: {
                "Insured Amount": "$2,000 per acre",
                "Policy Premium": "2% ($40/acre)",
                "Covered Events": "Cyclone, Hail, Localized flooding"
              },
              anomalies_detected: ["Losses must be filed with photos within 72 hours of rain events."],
              recommendations: ["Pre-register your KCC card with the insurance app for instant automatic payouts."]
            });
          }
        }, 1200);
      } finally {
        setDocLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Run What-If Simulations
  const runSimulation = async () => {
    setSimulating(true);
    setSimulationResults([]);
    try {
      const res = await fetch("http://localhost:8000/api/scenario/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_crop: selectedCrop,
          scenario_type: scenarioType,
          parameters: {
            weeks: delayWeeks,
            rainfall_change: rainfallChange
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResults(data.results || []);
      }
    } catch (err) {
      // Local simulations fallback
      setTimeout(() => {
        if (scenarioType === "crop_change") {
          setSimulationResults([
            { crop_name: "Tomato", net_profit_per_acre: "$1,650", risk_level: "Medium", expected_yield: "14 tons/acre", market_opportunity: "High local demand", suitability_score: "95%" },
            { crop_name: "Maize", net_profit_per_acre: "$750", risk_level: "Low", expected_yield: "3.2 tons/acre", market_opportunity: "Starch mills feed", suitability_score: "85%" },
            { crop_name: "Groundnut", net_profit_per_acre: "$1,050", risk_level: "Low", expected_yield: "1.9 tons/acre", market_opportunity: "Oilseed merchants", suitability_score: "90%" },
            { crop_name: "Chilli", net_profit_per_acre: "$2,400", risk_level: "High", expected_yield: "2.2 tons/acre", market_opportunity: "Dry spice export", suitability_score: "75%" }
          ]);
        } else if (scenarioType === "delay_sell") {
          setSimulationResults([
            { timeframe: "Sell Now", predicted_mandi_price: "$2400/q", refrigeration_holding_cost: "$0", net_revenue_per_quintal: "$2400/q", profit_differential: "$0", risk_profile: "Low (Immediate cash)" },
            { timeframe: "Delay 1 Week", predicted_mandi_price: "$2700/q", refrigeration_holding_cost: "$60/q", net_revenue_per_quintal: "$2640/q", profit_differential: "+$240/q", risk_profile: "Medium" },
            { timeframe: "Delay 2 Weeks", predicted_mandi_price: "$2900/q", refrigeration_holding_cost: "$120/q", net_revenue_per_quintal: "$2780/q", profit_differential: "+$380/q", risk_profile: "Medium-High" },
            { timeframe: "Delay 3 Weeks", predicted_mandi_price: "$2100/q", refrigeration_holding_cost: "$180/q", net_revenue_per_quintal: "$1920/q", profit_differential: "-$480/q", risk_profile: "High" }
          ]);
        } else {
          setSimulationResults([
            { change: "-40% (Drought)", yield_impact: "-35%", irrigation_cost: "+$180/acre", risk_rating: "Critical", remedy: "Convert to drip, apply straw mulch" },
            { change: "-20% (Dry spell)", yield_impact: "-15%", irrigation_cost: "+$80/acre", risk_rating: "High", remedy: "Water at flowering stages" },
            { change: "Normal", yield_impact: "100%", irrigation_cost: "Standard", risk_rating: "Low", remedy: "Follow standard AgriPilot timeline" },
            { change: "+20% (Humid)", yield_impact: "+5%", irrigation_cost: "-$50/acre", risk_rating: "Medium", remedy: "Increase fungicide sprays against blights" }
          ]);
        }
      }, 1000);
    } finally {
      setSimulating(false);
    }
  };

  // Helper local chatbot handler for fallback replies
  const mockLocalChatReply = (messageText, crop) => {
    const text = messageText.toLowerCase();
    let answer = "";
    let invoked = ["Supervisor Agent"];
    
    if (text.includes("water") || text.includes("irrigation") || text.includes("rain")) {
      invoked.push("Weather Risk Agent");
      invoked.push("Research Agent");
      answer = `### Irrigation Advisory: ${crop}\n\n* **Weather Risk Override:** Heavy rain (90% probability) is expected between Wed and Fri. \n* **Irrigation Adjustments:** Suspend standard drip lines immediately before Wednesday to protect roots from water saturation. \n* **Drainage Action:** Run field inspections and clear out ditch channels. Standing water will cause tomato splitting.`;
    } else if (text.includes("fertilizer") || text.includes("urea") || text.includes("nutrient")) {
      invoked.push("Research Agent");
      invoked.push("Government Scheme Agent");
      answer = `### Nutrient Advisory: ${crop}\n\n* **Immediate Task:** Week 8 Flowering Stage calls for foliar sprays of **Calcium Nitrate** and **Boron** to ensure fruit firmness and stop blossom-end rot.\n* **Subsidy Alert:** You qualify for the **Subsidized Fertilizer Program** at public cooperatives. Purchase urea at 40% rebate using your KCC card.`;
    } else if (text.includes("sell") || text.includes("market") || text.includes("price") || text.includes("mandi")) {
      invoked.push("Market Intelligence Agent");
      invoked.push("Logistics Optimization Agent");
      invoked.push("Market & Profit Agent");
      answer = `### Commercial Sale Advisory: ${crop}\n\n* **Market Comparison:** Vashi Wholesale offers the highest rates ($2,650/quintal) vs Central Mandi ($2,400/quintal).\n* **Wait vs Sell Strategy:** Our simulation flags a price peak in 8-10 days due to rain blockages on cargo. Hold your harvest by 5 days and hire a refrigerated carriage. Net gain: **+$350/quintal**.`;
    } else {
      answer = `### AgriPilot Autonomous Recommendation\n\nI have evaluated your farm profile located on Loamy soil growing **${crop}**:\n\n* **Weather Threat:** Heavy rainfall scheduled starting Wednesday. Drainage checks are critical.\n* **Farming tasks:** Ensure stakes are firm to keep fruits off damp soil.\n* **Market advice:** Hold sales until next week's transport corridor disruption spikes the price index.`;
    }
    
    return { answer, invoked_agents: invoked };
  };

  return (
    <div className="flex h-screen bg-[#040908] text-[#f0fdf4] font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#070f0e] border-r border-[#10b981]/15 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-[#10b981]/10">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center glow-animation">
              <Sprout className="text-black w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-emerald-400">AgriPilot AI</h1>
              <p className="text-[10px] text-emerald-600/80 tracking-widest uppercase font-semibold">Autonomous Co-Founder</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-200px)]">
            {[
              { id: "dashboard", label: "Dashboard", icon: Cpu },
              { id: "profile", label: "Farmer Profile", icon: User },
              { id: "discovery", label: "Crop Discovery", icon: Sprout },
              { id: "recommendations", label: "AI Decisions", icon: Network },
              { id: "timeline", label: "Farming Timeline", icon: Calendar },
              { id: "market", label: "Market Intel", icon: TrendingUp },
              { id: "disease", label: "Disease Detection", icon: ShieldAlert },
              { id: "weather", label: "Weather Center", icon: CloudRain },
              { id: "logistics", label: "Logistics Center", icon: MapPin },
              { id: "schemes", label: "Government Schemes", icon: FileText },
              { id: "profit", label: "Profit Forecast", icon: DollarSign },
              { id: "chat", label: "Copilot Chat", icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    active 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium" 
                      : "text-emerald-100/50 hover:bg-emerald-500/5 hover:text-emerald-300"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-emerald-100/40"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-[#10b981]/10 bg-emerald-950/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/20 flex items-center justify-center">
              <User className="text-emerald-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-300">{profile.farming_experience} Farmer</p>
              <p className="text-[10px] text-emerald-500/70">{profile.location.substring(0, 18)}...</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Upper Status Header */}
        <header className="h-16 border-b border-[#10b981]/15 bg-[#070f0e]/50 backdrop-blur px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold text-emerald-100">
              Active Crop: <span className="text-emerald-400 font-bold ml-1">{selectedCrop}</span>
            </h2>
            <div className="h-4 w-px bg-emerald-500/20" />
            <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 px-3 py-1 rounded-full text-[11px] text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-animation animate-ping" />
              Monitoring Stage: Week 8 (Flowering)
            </div>
          </div>

          <div className="flex items-center gap-4">
            {weatherAlerts.length > 0 && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full text-xs text-rose-300 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Weather Alert: Heavy Rain Warning
              </div>
            )}
            <span className="text-xs text-emerald-500/60 font-mono">2026-06-01 (Kharif Season)</span>
          </div>
        </header>

        {/* Central View Space */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* VIEW: DASHBOARD */}
          {currentView === "dashboard" && (
            <div className="space-y-8">
              
              {/* Upper Banner & Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                <div className="glass-panel p-5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-500/70 font-semibold uppercase">Predicted Yield</span>
                    <TrendingUp className="text-emerald-400 w-4 h-4" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-100">13.5 Tons</h3>
                  <p className="text-[10px] text-emerald-500/50">Based on loamy soil / drip water inputs</p>
                </div>

                <div className="glass-panel p-5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-500/70 font-semibold uppercase">Net Profit Margin</span>
                    <DollarSign className="text-emerald-400 w-4 h-4" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-100">$2,350 <span className="text-xs text-emerald-400">/acre</span></h3>
                  <p className="text-[10px] text-emerald-400/80 font-medium">Wait recommendation active (+20%)</p>
                </div>

                <div className="glass-panel p-5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-500/70 font-semibold uppercase">Harvest Window</span>
                    <Calendar className="text-emerald-400 w-4 h-4" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-100">Week 12-13</h3>
                  <p className="text-[10px] text-emerald-500/50">Expected target: 28 days left</p>
                </div>

                <div className="glass-panel p-5 rounded-xl space-y-2 border-rose-500/25 bg-rose-950/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-rose-400/80 font-semibold uppercase">Active Risk Level</span>
                    <AlertTriangle className="text-rose-400 w-4 h-4" />
                  </div>
                  <h3 className="text-2xl font-bold text-rose-200">High Risk</h3>
                  <p className="text-[10px] text-rose-400/70">Rainfall scheduled starting Wed</p>
                </div>

              </div>

              {/* Confidence Gauges Row */}
              <div className="glass-panel p-6 rounded-xl space-y-6">
                <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">AI Confidence Meters</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { title: "Yield Prediction", value: 92 },
                    { title: "Disease Diagnostic", value: 95 },
                    { title: "Price Forecasting", value: 88 },
                    { title: "Weather Reliability", value: 96 }
                  ].map((gauge, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        {/* Circular SVG Gauge */}
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="8" fill="transparent" />
                          <circle cx="48" cy="48" r="40" stroke="#10b981" strokeWidth="8" fill="transparent" 
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * gauge.value) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-lg font-bold text-emerald-200">{gauge.value}%</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-500/70 text-center">{gauge.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core visual graph: Collaboration Map & Decision Log split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Agent Collaboration graph panel */}
                <div className="lg:col-span-8 glass-panel p-6 rounded-xl space-y-6 relative overflow-hidden">
                  <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">LangGraph Agent Multi-Agent Collaboration Graph</h4>
                  <div className="w-full h-80 relative flex items-center justify-center border border-emerald-500/5 bg-[#030605] rounded-lg">
                    
                    {/* SVG Connections */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {/* Draw lines from center Supervisor (x:50%, y:50%) to surrounding agents */}
                      {/* Coordinate lines will glow if active */}
                      {[
                        { x: 10, y: 15, key: "Crop Planning Agent" },
                        { x: 30, y: 15, key: "Yield Forecast Agent" },
                        { x: 50, y: 15, key: "Weather Risk Agent" },
                        { x: 70, y: 15, key: "Market Intelligence Agent" },
                        { x: 90, y: 15, key: "Logistics Optimization Agent" },
                        { x: 10, y: 85, key: "Disease Detection Agent" },
                        { x: 30, y: 85, key: "Market & Profit Agent" },
                        { x: 50, y: 85, key: "Agricultural Research Agent" },
                        { x: 70, y: 85, key: "Government Scheme Agent" },
                        { x: 90, y: 85, key: "Loan & Insurance Agent" }
                      ].map((node, index) => {
                        const isActive = activeAgents.includes(node.key);
                        return (
                          <line
                            key={index}
                            x1="50%"
                            y1="50%"
                            x2={`${node.x}%`}
                            y2={`${node.y}%`}
                            stroke={isActive ? "#10b981" : "#112a23"}
                            strokeWidth={isActive ? "2" : "1"}
                            strokeDasharray={isActive ? "4,4" : "0"}
                            className={isActive ? "animate-[dash_10s_linear_infinite]" : ""}
                          />
                        );
                      })}
                    </svg>

                    {/* Center Supervisor Node */}
                    <div className="absolute z-10 w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex flex-col items-center justify-center text-center shadow-lg shadow-emerald-500/20">
                      <Cpu className="text-emerald-400 w-6 h-6 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-200 mt-1 uppercase leading-tight">Supervisor<br/>Agent</span>
                    </div>

                    {/* Surrounding Node Labels */}
                    {[
                      { x: "left-6 top-6", label: "Crop Planning", key: "Crop Planning Agent" },
                      { x: "left-[26%] top-6", label: "Yield Forecast", key: "Yield Forecast Agent" },
                      { x: "left-[45%] top-6", label: "Weather Risk", key: "Weather Risk Agent" },
                      { x: "right-[26%] top-6", label: "Market Intel", key: "Market Intelligence Agent" },
                      { x: "right-6 top-6", label: "Logistics", key: "Logistics Optimization Agent" },
                      { x: "left-6 bottom-6", label: "Disease Detect", key: "Disease Detection Agent" },
                      { x: "left-[26%] bottom-6", label: "Profit Opt", key: "Market & Profit Agent" },
                      { x: "left-[45%] bottom-6", label: "Agri Research", key: "Agricultural Research Agent" },
                      { x: "right-[26%] bottom-6", label: "Gov Schemes", key: "Government Scheme Agent" },
                      { x: "right-6 bottom-6", label: "Loan/Insurance", key: "Loan & Insurance Agent" }
                    ].map((node, index) => {
                      const isActive = activeAgents.includes(node.key);
                      return (
                        <div
                          key={index}
                          className={`absolute p-2 rounded border text-[10px] font-medium transition-all ${node.x} ${
                            isActive
                              ? "bg-emerald-500/10 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/10"
                              : "bg-[#0c1412] border-emerald-500/10 text-emerald-100/30"
                          }`}
                        >
                          {node.label}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center text-xs text-emerald-500/60 font-mono">
                    <span>* Lines pulsate to indicate real-time routing sequences</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-400" /> Active Nodes
                    </span>
                  </div>
                </div>

                {/* AI Decision Timeline */}
                <div className="lg:col-span-4 glass-panel p-6 rounded-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">AI Decision Timeline</h4>
                    <div className="space-y-4 overflow-y-auto max-h-72 pr-2">
                      {decisionLogs.slice(0, 5).map((log, index) => {
                        const isCritical = log.status === "Critical" || log.status === "Enforced";
                        return (
                          <div key={index} className="flex gap-3 border-l-2 border-emerald-500/20 pl-4 relative">
                            {/* Dot overlay */}
                            <span className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border ${
                              isCritical ? "bg-rose-500 border-rose-400" : "bg-emerald-500 border-emerald-400"
                            }`} />
                            <div className="space-y-1">
                              <span className="text-[10px] text-emerald-500/60 font-mono">Day {log.day} - {log.agent}</span>
                              <p className="text-xs text-emerald-200 font-light">{log.decision}</p>
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                                isCritical ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              }`}>
                                {log.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentView("recommendations")}
                    className="w-full mt-4 text-center py-2 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/5 transition"
                  >
                    View All Decision Streams
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* VIEW: FARMER PROFILE */}
          {currentView === "profile" && (
            <div className="max-w-2xl mx-auto glass-panel p-8 rounded-xl space-y-6">
              <div className="border-b border-[#10b981]/15 pb-4">
                <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                  <User className="w-5 h-5" /> Farmer Profiling & Soil Registry
                </h3>
                <p className="text-xs text-emerald-500/70 mt-1">Calibrate profile variables to receive optimized crop recommendations.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-emerald-400 uppercase">Farm Location</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full bg-emerald-950/20 border border-emerald-500/20 focus:border-emerald-400 rounded-lg px-4 py-2.5 text-sm text-emerald-100 outline-none"
                    placeholder="e.g. California Valley"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-emerald-400 uppercase">Land Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={profile.land_area}
                    onChange={(e) => setProfile({ ...profile, land_area: parseFloat(e.target.value) })}
                    className="w-full bg-emerald-950/20 border border-emerald-500/20 focus:border-emerald-400 rounded-lg px-4 py-2.5 text-sm text-emerald-100 outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-emerald-400 uppercase">Soil Type</label>
                  <select
                    value={profile.soil_type}
                    onChange={(e) => setProfile({ ...profile, soil_type: e.target.value })}
                    className="w-full bg-[#081512] border border-emerald-500/20 focus:border-emerald-400 rounded-lg px-4 py-2.5 text-sm text-emerald-100 outline-none"
                  >
                    <option value="Loamy">Loamy (Recommended)</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Black Cotton">Black Cotton</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-emerald-400 uppercase">Water Availability</label>
                  <select
                    value={profile.water_availability}
                    onChange={(e) => setProfile({ ...profile, water_availability: e.target.value })}
                    className="w-full bg-[#081512] border border-emerald-500/20 focus:border-emerald-400 rounded-lg px-4 py-2.5 text-sm text-emerald-100 outline-none"
                  >
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Borewell/Pump">Borewell/Pump</option>
                    <option value="Rainfed Only">Rainfed Only</option>
                    <option value="Canal Source">Canal Source</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-emerald-400 uppercase">Planting Target Date</label>
                  <input
                    type="date"
                    value={profile.planting_date}
                    onChange={(e) => setProfile({ ...profile, planting_date: e.target.value })}
                    className="w-full bg-emerald-950/20 border border-emerald-500/20 focus:border-emerald-400 rounded-lg px-4 py-2.5 text-sm text-emerald-100 outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-emerald-400 uppercase">Working Budget ($)</label>
                  <input
                    type="number"
                    value={profile.budget}
                    onChange={(e) => setProfile({ ...profile, budget: parseFloat(e.target.value) })}
                    className="w-full bg-emerald-950/20 border border-emerald-500/20 focus:border-emerald-400 rounded-lg px-4 py-2.5 text-sm text-emerald-100 outline-none"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-emerald-400 uppercase">Farming Experience Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Beginner", "Intermediate", "Expert"].map((exp) => (
                      <button
                        type="button"
                        key={exp}
                        onClick={() => setProfile({ ...profile, farming_experience: exp })}
                        className={`py-2 rounded-lg text-xs font-semibold border transition ${
                          profile.farming_experience === exp
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                            : "bg-emerald-950/10 border-emerald-500/10 text-emerald-500 hover:bg-emerald-500/5"
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="md:col-span-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg text-sm transition tracking-wider flex items-center justify-center gap-2"
                >
                  Save Profile & Discover Suitable Crops <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* VIEW: CROP DISCOVERY */}
          {currentView === "discovery" && (
            <div className="space-y-6">
              <div className="border-b border-[#10b981]/15 pb-4">
                <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                  <Sprout className="w-5 h-5" /> Crop Suitability Analysis
                </h3>
                <p className="text-xs text-emerald-500/70 mt-1">Autonomous evaluation matching soil chemistry, climate records, and local commercial demand index.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cropsList.map((crop, index) => (
                  <div key={index} className="glass-panel p-6 rounded-xl flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition group">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-emerald-100 group-hover:text-emerald-400 transition">{crop.crop_name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          crop.risk_level.includes("High") 
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}>
                          {crop.risk_level.split(" ")[0]} Risk
                        </span>
                      </div>
                      <p className="text-xs text-emerald-300/80 font-light leading-relaxed">{crop.details}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-emerald-500/10">
                      <div className="flex justify-between text-xs">
                        <span className="text-emerald-500/60">Duration:</span>
                        <span className="font-semibold text-emerald-200">{crop.growth_duration}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-emerald-500/60">Water:</span>
                        <span className="font-semibold text-emerald-200">{crop.water_requirement.split(" ")[0]}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-emerald-500/60">Yield:</span>
                        <span className="font-semibold text-emerald-200">{crop.expected_yield}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-emerald-500/60">Profit Margin:</span>
                        <span className="font-bold text-emerald-400">{crop.profit_potential.split(" ")[0]}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectCrop(crop.crop_name)}
                      className={`w-full py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        selectedCrop === crop.crop_name
                          ? "bg-emerald-500 text-black"
                          : "bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                      }`}
                    >
                      {selectedCrop === crop.crop_name ? (
                        <>Selected Crop <Check className="w-3.5 h-3.5" /></>
                      ) : (
                        "Select Crop & Build Timeline"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: AI RECOMMENDATIONS (SUPERVISOR LOGS) */}
          {currentView === "recommendations" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="border-b border-[#10b981]/15 pb-4">
                <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                  <Network className="w-5 h-5" /> Multi-Agent Supervisor Log
                </h3>
                <p className="text-xs text-emerald-500/70 mt-1">Full audit log representing supervisor agent synthesis, resolving sub-agent scheduling overrides.</p>
              </div>

              <div className="space-y-6">
                {decisionLogs.map((log, index) => {
                  const isCritical = log.status === "Critical" || log.status === "Enforced";
                  return (
                    <div key={index} className={`glass-panel p-5 rounded-xl border-l-4 transition ${
                      isCritical ? "border-l-rose-500 bg-rose-950/5" : "border-l-emerald-500"
                    }`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isCritical ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
                          }`}>
                            <Cpu className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-emerald-100">{log.agent}</h4>
                            <p className="text-[10px] text-emerald-500/60 font-mono">Day {log.day} of cultivation cycle</p>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          isCritical ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <p className="text-sm font-light text-emerald-200 mt-4 leading-relaxed">{log.decision}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: FARMING TIMELINE */}
          {currentView === "timeline" && (
            <div className="space-y-6">
              <div className="border-b border-[#10b981]/15 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> Dynamic Crop Timeline: {selectedCrop}
                  </h3>
                  <p className="text-xs text-emerald-500/70 mt-1">Autonomous schedule updating continuously based on weather threats and input prices.</p>
                </div>
                <button 
                  onClick={() => setCurrentView("chat")}
                  className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-lg hover:bg-emerald-600 transition flex items-center gap-1.5"
                >
                  Consult Chat Copilot <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Timeline Horizontal Line / Steps */}
              <div className="glass-panel p-8 rounded-xl space-y-8 overflow-x-auto">
                <div className="flex justify-between min-w-[900px] relative pb-4">
                  
                  {/* Gray background connector */}
                  <div className="absolute top-5 left-4 right-4 h-0.5 bg-emerald-950" />
                  
                  {timeline.map((stage, idx) => {
                    const isActive = idx === 4; // Mock Stage Week 8 active
                    return (
                      <div key={idx} className="flex flex-col items-center text-center w-32 relative z-10 space-y-2 group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition ${
                          isActive 
                            ? "bg-emerald-500 text-black border-emerald-400 glow-animation scale-110" 
                            : idx < 4 
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30" 
                            : "bg-[#0b1210] text-emerald-500/40 border-emerald-500/10"
                        }`}>
                          W{stage.week}
                        </div>
                        <div className="space-y-1">
                          <span className={`text-[11px] font-bold block ${isActive ? "text-emerald-400" : "text-emerald-100/70"}`}>
                            {stage.stage}
                          </span>
                          <span className="text-[9px] text-emerald-500/50 block font-light leading-tight px-1 opacity-0 group-hover:opacity-100 transition duration-300">
                            {stage.activity.substring(0, 45)}...
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stage Detail Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {timeline.map((stage, idx) => {
                  const isActive = idx === 4;
                  return (
                    <div key={idx} className={`glass-panel p-6 rounded-xl space-y-4 border-t-4 transition ${
                      isActive 
                        ? "border-t-emerald-400 bg-emerald-950/5 shadow-md shadow-emerald-500/5" 
                        : "border-t-emerald-500/10"
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-400 font-mono">Week {stage.week}</span>
                        <span className="text-xs font-semibold text-emerald-200">{stage.stage}</span>
                      </div>
                      
                      <div className="space-y-2.5 text-xs">
                        <div>
                          <span className="text-emerald-500/60 block font-medium uppercase text-[9px]">Activity:</span>
                          <p className="text-emerald-200 font-light leading-relaxed">{stage.activity}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-emerald-500/5">
                          <div>
                            <span className="text-emerald-500/60 block font-medium uppercase text-[9px]">Fertilizer:</span>
                            <span className="text-emerald-300 font-mono text-[11px]">{stage.fertilizers}</span>
                          </div>
                          <div>
                            <span className="text-emerald-500/60 block font-medium uppercase text-[9px]">Water Requirement:</span>
                            <span className="text-emerald-300 text-[11px]">{stage.water}</span>
                          </div>
                        </div>

                        {stage.risks !== "None" && (
                          <div className="pt-2 border-t border-emerald-500/5 flex items-center gap-1.5 text-[11px] text-rose-300 font-light">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>Risk: {stage.risks}</span>
                          </div>
                        )}

                        {stage.market !== "N/A" && (
                          <div className="pt-2 border-t border-emerald-500/5 flex items-center gap-1.5 text-[11px] text-emerald-300 font-light">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Market: {stage.market}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: MARKET INTELLIGENCE */}
          {currentView === "market" && (
            <div className="space-y-6">
              <div className="border-b border-[#10b981]/15 pb-4">
                <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Market Intelligence Center (eNAM / Mandi Rates)
                </h3>
                <p className="text-xs text-emerald-500/70 mt-1">Live national wholesale pricing databases, demand analytics, and price peaks forecast modeling.</p>
              </div>

              {/* Mandi pricing list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Rates Table */}
                <div className="glass-panel p-6 rounded-xl space-y-4">
                  <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Active Wholesale Mandi Rates ({selectedCrop})</h4>
                  <div className="divide-y divide-emerald-500/10">
                    {[
                      { name: "Vashi Wholesale Terminal", rate: "$2,650/q", change: "+200", trend: "up", demand: "Very High" },
                      { name: "Central Mandi", rate: "$2,400/q", change: "+120", trend: "up", demand: "High" },
                      { name: "Apex Grain Cooperative", rate: "$2,100/q", change: "0", trend: "flat", demand: "Stable" },
                      { name: "Regional Krishi Center", rate: "$2,050/q", change: "-50", trend: "down", demand: "Moderate" }
                    ].map((mandi, idx) => (
                      <div key={idx} className="flex justify-between py-3 text-xs items-center">
                        <div>
                          <p className="font-semibold text-emerald-100">{mandi.name}</p>
                          <span className="text-[10px] text-emerald-500/60">Demand Index: {mandi.demand}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-300 font-mono">{mandi.rate}</p>
                          <span className={`text-[10px] font-semibold ${
                            mandi.trend === "up" ? "text-emerald-400" : mandi.trend === "down" ? "text-rose-400" : "text-emerald-500/50"
                          }`}>
                            {mandi.change.startsWith("+") || mandi.change.startsWith("-") ? mandi.change : `+${mandi.change}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Forecast Chart (Custom SVG implementation for safety & beauty) */}
                <div className="glass-panel p-6 rounded-xl space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">4-Week Price Forecast</h4>
                    <p className="text-[10px] text-emerald-500/50 mt-1">Autonomous predictive modeling based on logistics blockages and rain delays.</p>
                  </div>

                  <div className="h-48 relative border-b border-l border-emerald-500/20 px-2 py-4">
                    {/* SVG Line Chart */}
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="25" x2="100" y2="25" stroke="#112a23" strokeWidth="0.5" strokeDasharray="3,3" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="#112a23" strokeWidth="0.5" strokeDasharray="3,3" />
                      <line x1="0" y1="75" x2="100" y2="75" stroke="#112a23" strokeWidth="0.5" strokeDasharray="3,3" />
                      
                      {/* Price curve line path */}
                      <path
                        d="M 5,75 Q 30,30 50,15 T 95,85"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                      />
                      
                      {/* Glowing dots at key points */}
                      <circle cx="5" cy="75" r="2" fill="#10b981" />
                      <circle cx="28" cy="45" r="2" fill="#10b981" />
                      <circle cx="50" cy="15" r="2.5" fill="#34d399" className="animate-ping" />
                      <circle cx="73" cy="35" r="2" fill="#10b981" />
                      <circle cx="95" cy="85" r="2" fill="#10b981" />
                    </svg>

                    {/* Chart Labels */}
                    <div className="absolute inset-0 flex justify-between items-end text-[9px] text-emerald-500/50 px-2 pointer-events-none">
                      <span>Now</span>
                      <span>Week +1</span>
                      <span className="text-emerald-300 font-bold">Week +2 (Peak)</span>
                      <span>Week +3</span>
                      <span>Week +4</span>
                    </div>
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-lg text-xs space-y-2">
                    <span className="font-bold text-emerald-400 block uppercase text-[10px]">Supervisor Trade Guidance:</span>
                    <p className="text-emerald-200 font-light leading-relaxed">
                      Delay harvesting and selling by exactly 8-10 days. The forecasted heavy rainfall will saturate supply pipelines, driving up rates at Vashi Wholesale to a predicted peak of **$2,900/quintal** on Week +2.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: DISEASE DETECTION */}
          {currentView === "disease" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-[#10b981]/15 pb-4">
                <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> Multimodal Disease & Pest Diagnoser
                </h3>
                <p className="text-xs text-emerald-500/70 mt-1">Upload leaf captures to diagnose pathogen outbreaks, nutrient deficiencies, or insects.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Upload Area */}
                <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/20 hover:border-emerald-400/40 transition relative min-h-64">
                  {diseaseImage ? (
                    <div className="w-full space-y-4">
                      <img src={diseaseImage} alt="Crop leaf" className="w-full max-h-48 object-cover rounded-lg" />
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-emerald-500/50">Image loaded</span>
                        <button 
                          onClick={() => { setDiseaseImage(null); setDiseaseDiagnosis(null); }}
                          className="text-xs text-rose-400 hover:text-rose-300"
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center space-y-3 p-8 text-center">
                      <Upload className="w-10 h-10 text-emerald-500/40" />
                      <div>
                        <span className="text-sm font-bold text-emerald-300 block">Upload Leaf Photo</span>
                        <span className="text-[10px] text-emerald-500/50 block mt-1">Accepts PNG, JPG or camera capture</span>
                      </div>
                      <input type="file" accept="image/*" onChange={handleDiseaseUpload} className="hidden" />
                    </label>
                  )}

                  {diseaseLoading && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-xl space-y-3">
                      <div className="w-8 h-8 rounded-full border-2 border-t-emerald-400 border-emerald-500/10 animate-spin" />
                      <span className="text-xs text-emerald-300 uppercase tracking-widest font-bold">Analyzing Leaf...</span>
                    </div>
                  )}
                </div>

                {/* Diagnostic Output */}
                <div className="glass-panel p-6 rounded-xl space-y-4 min-h-64 flex flex-col justify-between">
                  {diseaseDiagnosis ? (
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] text-rose-400 font-bold uppercase block tracking-wider">Diagnosis Result</span>
                        <h4 className="text-lg font-bold text-emerald-100 mt-0.5">{diseaseDiagnosis.disease_name}</h4>
                        <p className="text-xs text-emerald-400/80 mt-1">{diseaseDiagnosis.cause}</p>
                      </div>

                      <div className="space-y-2 text-xs font-light text-emerald-200">
                        <p className="leading-relaxed"><strong className="font-semibold text-emerald-400">Diagnosis Details:</strong> {diseaseDiagnosis.diagnosis}</p>
                        
                        <div className="pt-2 border-t border-emerald-500/10 space-y-1">
                          <strong className="font-semibold text-emerald-400 block text-[10px] uppercase">Treatment Action Checklist:</strong>
                          {diseaseDiagnosis.treatment.map((t, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-[#10b981]/10 space-y-1">
                          <strong className="font-semibold text-emerald-400 block text-[10px] uppercase">Prevention Guideline:</strong>
                          {diseaseDiagnosis.prevention.map((p, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-emerald-500/10 flex justify-between text-xs font-semibold">
                        <span className="text-rose-400">Predicted Yield Loss (if neglected):</span>
                        <span className="text-rose-300 font-bold font-mono">{diseaseDiagnosis.estimated_loss_percent}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-12 space-y-3">
                      <Info className="w-8 h-8 text-emerald-500/20" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-200">Diagnostic Panel Idle</p>
                        <p className="text-xs text-emerald-500/40 mt-1">Load a high-quality picture of leaf spots to fetch autonomous chemical/organic care actions.</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* VIEW: WEATHER CENTER */}
          {currentView === "weather" && (
            <div className="space-y-6">
              <div className="border-b border-[#10b981]/15 pb-4">
                <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                  <CloudRain className="w-5 h-5" /> Weather Center & Soil Risks
                </h3>
                <p className="text-xs text-emerald-500/70 mt-1">Live agronomic weather forecasts, humidity monitoring, and heavy rainfall hazard preventions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left metrics block */}
                <div className="md:col-span-1 glass-panel p-6 rounded-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] text-emerald-500/60 uppercase font-bold tracking-wider">Current Weather Metrics</span>
                    <div className="flex items-center gap-4">
                      <Thermometer className="w-10 h-10 text-emerald-400" />
                      <div>
                        <h4 className="text-3xl font-extrabold text-emerald-100 font-mono">31°C</h4>
                        <p className="text-xs text-emerald-500/50">Humidity: 68% | Winds: 14 km/h</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-emerald-500/10">
                    <span className="text-[10px] text-emerald-500/60 uppercase font-bold tracking-wider">Tomorrow's Outlook</span>
                    <div className="flex justify-between text-xs text-emerald-200">
                      <span>Condition:</span>
                      <span className="font-semibold">Partly Cloudy</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-200">
                      <span>Rainfall probability:</span>
                      <span className="font-semibold text-emerald-400">40%</span>
                    </div>
                  </div>
                </div>

                {/* Center Alerts */}
                <div className="md:col-span-2 glass-panel p-6 rounded-xl space-y-4 border-rose-500/20 bg-rose-950/5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-xs tracking-wider">
                      <AlertTriangle className="w-4.5 h-4.5" /> Severe Climate Warning
                    </div>
                    
                    {weatherAlerts.map((alert, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="text-sm font-bold text-rose-200">{alert.type}</h4>
                        <p className="text-xs text-emerald-200/90 font-light leading-relaxed">{alert.description}</p>
                        
                        <div className="pt-2 space-y-1">
                          <strong className="text-[10px] text-rose-400 uppercase font-bold block">Supervisor Enforced Protection Tasks:</strong>
                          {alert.actions.map((act, idy) => (
                            <div key={idy} className="flex items-start gap-1.5 text-xs text-emerald-100">
                              <span className="text-rose-400 font-bold">•</span>
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <span className="text-[10px] text-rose-400/50 font-mono">* Critical alarms push automated triggers adjusting logistics and harvest schedules</span>
                </div>

              </div>

              {/* 7-Day Forecast Grid */}
              <div className="glass-panel p-6 rounded-xl space-y-4">
                <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">7-Day Local Weather Forecast</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  {[
                    { day: "Mon", temp: "31°C", cond: "Sunny", rain: "5%", color: "text-amber-400" },
                    { day: "Tue", temp: "32°C", cond: "Sunny", rain: "10%", color: "text-amber-400" },
                    { day: "Wed", temp: "29°C", cond: "Rainy", rain: "40%", color: "text-emerald-400 animate-pulse" },
                    { day: "Thu", temp: "26°C", cond: "Heavy Rain", rain: "90%", color: "text-rose-400 animate-pulse" },
                    { day: "Fri", temp: "28°C", cond: "Stormy", rain: "75%", color: "text-rose-400 animate-pulse" },
                    { day: "Sat", temp: "30°C", cond: "Clear", rain: "10%", color: "text-emerald-400" },
                    { day: "Sun", temp: "31°C", cond: "Sunny", rain: "5%", color: "text-amber-400" }
                  ].map((f, i) => (
                    <div key={i} className="bg-[#091512] border border-emerald-500/5 p-4 rounded-lg flex flex-col items-center space-y-2">
                      <span className="text-xs font-semibold text-emerald-500/70">{f.day}</span>
                      <span className="text-base font-bold text-emerald-100 font-mono">{f.temp}</span>
                      <span className={`text-[10px] font-bold ${f.color}`}>{f.cond}</span>
                      <span className="text-[9px] text-emerald-500/40">Rain: {f.rain}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: LOGISTICS CENTER */}
          {currentView === "logistics" && (
            <div className="space-y-6">
              <div className="border-b border-[#10b981]/15 pb-4">
                <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Logistics Optimization Center
                </h3>
                <p className="text-xs text-emerald-500/70 mt-1">Autonomous route analysis, shipping fee estimates, and cold-chain transport matches.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Routes details */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-xl space-y-6">
                  <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Recommended Delivery Strategies</h4>
                  
                  <div className="space-y-4">
                    {routes.map((route, idx) => (
                      <div key={idx} className="bg-[#091512] border border-emerald-500/10 p-5 rounded-lg flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-2.5 max-w-md">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-400" />
                            <h5 className="font-bold text-emerald-100 text-sm">{route.destination}</h5>
                          </div>
                          <p className="text-xs text-emerald-200/90 font-light leading-relaxed">{route.road_condition}</p>
                          <p className="text-[11px] text-emerald-400/80 font-medium"><strong className="font-semibold text-emerald-500/70">Vehicle Suggestion:</strong> {route.transport_type}</p>
                        </div>

                        <div className="sm:text-right flex flex-col justify-between shrink-0 space-y-2">
                          <div>
                            <span className="text-[10px] text-emerald-500/60 uppercase block">Distance / Duration</span>
                            <span className="text-xs font-bold text-emerald-200 block">{route.distance} ({route.duration})</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-emerald-500/60 uppercase block">Estimated cost</span>
                            <span className="text-sm font-bold text-emerald-300 font-mono block">${route.estimated_cost}</span>
                            <span className="text-[9px] text-emerald-500/40">Includes fuel: ${route.fuel_cost}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Mock Widget */}
                <div className="lg:col-span-1 glass-panel p-6 rounded-xl flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Live Route Map</h4>
                    <p className="text-[10px] text-emerald-500/50">Tracking logistics route parameters utilizing OpenStreetMap layers.</p>
                  </div>

                  {/* Visual Map Mockup placeholder using standard Tailwind patterns */}
                  <div className="h-60 rounded-lg bg-[#030605] border border-emerald-500/10 flex items-center justify-center relative overflow-hidden">
                    {/* Simulated map circles */}
                    <div className="absolute w-24 h-24 rounded-full border border-emerald-500/10 animate-ping opacity-25" />
                    <div className="absolute w-48 h-48 rounded-full border border-emerald-500/5 animate-ping opacity-15" />
                    
                    {/* Route line */}
                    <svg className="absolute inset-0 w-full h-full">
                      <path d="M 30,180 Q 90,90 180,50" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5,5" className="animate-[dash_8s_linear_infinite]" />
                    </svg>

                    {/* Source dot */}
                    <div className="absolute left-6 bottom-12 flex flex-col items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-black shadow" />
                      <span className="text-[9px] bg-black/80 px-1 py-0.5 rounded text-emerald-300 mt-1 font-bold">My Farm</span>
                    </div>

                    {/* Destination dot */}
                    <div className="absolute right-12 top-8 flex flex-col items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-black shadow" />
                      <span className="text-[9px] bg-black/80 px-1 py-0.5 rounded text-rose-300 mt-1 font-bold">Vashi Mandi</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-500/60 font-mono text-center block">* Map automatically matches delivery truck GPS coordinates</span>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: GOVERNMENT SCHEMES */}
          {currentView === "schemes" && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="border-b border-[#10b981]/15 pb-4">
                <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Government Subsidies & Schemes Matcher
                </h3>
                <p className="text-xs text-emerald-500/70 mt-1">Autonomous eligibility filters matching farmer land sizes and location fields against central state programs.</p>
              </div>

              {/* Upload soil/doc portal inside schemes */}
              <div className="glass-panel p-6 rounded-xl space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Document Analysis & Parameter Extractor</h4>
                  <p className="text-xs text-emerald-500/50 mt-1">Upload a PDF soil chemistry result card or policy document to automatically calibrate profile metrics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Selector & Drag/Drop */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-emerald-400 uppercase">Document Category</label>
                      <select 
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="w-full bg-[#081512] border border-emerald-500/20 focus:border-emerald-400 rounded-lg px-4 py-2.5 text-sm text-emerald-100 outline-none"
                      >
                        <option value="soil_report">Lab Soil Analysis Report</option>
                        <option value="insurance">Crop Insurance Policy</option>
                        <option value="government">Government Subsidies Registry</option>
                      </select>
                    </div>

                    <div className="border-2 border-dashed border-emerald-500/20 hover:border-emerald-400/40 rounded-lg p-6 text-center cursor-pointer flex flex-col items-center justify-center space-y-2 relative min-h-32">
                      <FileText className="w-8 h-8 text-emerald-500/30" />
                      {uploadedDocName ? (
                        <div className="space-y-1">
                          <span className="text-xs text-emerald-300 font-bold block truncate max-w-xs">{uploadedDocName}</span>
                          <span className="text-[9px] text-emerald-500/60 block">Document parsed</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-xs text-emerald-300 block font-semibold">Upload PDF/Report Doc</span>
                          <span className="text-[9px] text-emerald-500/40 block mt-0.5">Click to drag files here</span>
                        </div>
                      )}
                      <input type="file" onChange={handleDocUpload} className="hidden" id="docInput" />
                      <label htmlFor="docInput" className="absolute inset-0 cursor-pointer" />

                      {docLoading && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg space-y-2">
                          <div className="w-6 h-6 rounded-full border-2 border-t-emerald-400 border-emerald-500/10 animate-spin" />
                          <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold">Extracting PDF parameters...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Parsed Outputs */}
                  <div className="bg-[#050b09] border border-emerald-500/10 p-5 rounded-lg flex flex-col justify-between min-h-48">
                    {documentAnalysis ? (
                      <div className="space-y-4 text-xs">
                        <div>
                          <span className="text-[10px] text-emerald-500/60 font-bold uppercase block">Analysis Result</span>
                          <h5 className="font-bold text-emerald-200 text-sm">{documentAnalysis.document_type}</h5>
                        </div>

                        <div className="space-y-2">
                          <strong className="text-emerald-400 text-[10px] uppercase font-bold block">Extracted Parameter Details:</strong>
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                            {Object.entries(documentAnalysis.parameters_extracted).map(([k, v], id) => (
                              <div key={id} className="bg-[#0b1613] p-1.5 rounded border border-emerald-500/5">
                                <span className="text-emerald-500/60 block text-[9px] font-sans">{k}</span>
                                <span className="text-emerald-300 font-bold">{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {documentAnalysis.anomalies_detected.length > 0 && (
                          <div className="space-y-1 pt-2 border-t border-emerald-500/5 text-rose-300">
                            <span className="text-[10px] uppercase font-bold block">Anomalies/Alerts detected:</span>
                            {documentAnalysis.anomalies_detected.map((an, id) => (
                              <p key={id} className="leading-tight">• {an}</p>
                            ))}
                          </div>
                        )}

                        <div className="space-y-1 pt-2 border-t border-emerald-500/5 text-emerald-100">
                          <span className="text-[10px] uppercase font-bold block text-emerald-400">Action Recommendations:</span>
                          {documentAnalysis.recommendations.map((re, id) => (
                            <p key={id} className="leading-tight">• {re}</p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center h-full space-y-2 text-emerald-500/30">
                        <Info className="w-7 h-7" />
                        <p className="text-xs">Document analysis data will display here post file load.</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Subsidies match list */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Eligible Schemes matching Farmer Profile</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: "PM-KISAN Income Support", benefit: "$75/year direct transfer", info: "Direct cash aid sent in 3 intervals.", guidance: "Requires Aadhaar land registration validation." },
                    { name: "Subsidized Micro-Irrigation Scheme", benefit: "55% to 80% drip subsidy", info: "Covers drip line installation kits.", guidance: "File soil testing values with authorized vendors." },
                    { name: "Fertilizer Subsidy Scheme", benefit: "Up to 40% rebate", info: "Subsidized urea and potash rates.", guidance: "Claim directly at POS shops via Kisan Card." },
                    { name: "Weather Crop Insurance (PMFBY)", benefit: "Full crop sum coverage", info: "Covers rainfall floods and cyclones.", guidance: "Premium is 2% sum insured, register at local bank." }
                  ].map((sch, idx) => (
                    <div key={idx} className="glass-panel p-5 rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-emerald-200 text-sm">{sch.name}</h5>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase shrink-0">
                          {sch.benefit}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-200/80 font-light leading-relaxed">{sch.info}</p>
                      <div className="pt-2 border-t border-emerald-500/5 text-[11px] text-emerald-400 font-light">
                        <strong className="font-semibold">Application Steps:</strong> {sch.guidance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PROFIT FORECAST & SCENARIO SIMULATOR */}
          {currentView === "profit" && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="border-b border-[#10b981]/15 pb-4">
                <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> What-If Scenario Simulators
                </h3>
                <p className="text-xs text-emerald-500/70 mt-1">Simulate trade-offs between crop choices, storage timelines, and moisture variations on net profits.</p>
              </div>

              {/* Simulator Config */}
              <div className="glass-panel p-6 rounded-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-emerald-400 uppercase">Simulation Scenario</label>
                    <select 
                      value={scenarioType}
                      onChange={(e) => setScenarioType(e.target.value)}
                      className="w-full bg-[#081512] border border-emerald-500/20 focus:border-emerald-400 rounded-lg px-4 py-2.5 text-sm text-emerald-100 outline-none"
                    >
                      <option value="crop_change">Crop Swap (e.g. Tomato vs Maize)</option>
                      <option value="delay_sell">Wait vs Sell Timing (Weeks)</option>
                      <option value="weather_risk">Rainfall Shifts (% increase/decrease)</option>
                    </select>
                  </div>

                  {scenarioType === "delay_sell" ? (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-emerald-400 uppercase">Delay Selling Weeks</label>
                      <input 
                        type="range" min="1" max="4" value={delayWeeks}
                        onChange={(e) => setDelayWeeks(parseInt(e.target.value))}
                        className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-3"
                      />
                      <span className="text-xs text-emerald-300 font-bold block mt-1 font-mono">Delay: {delayWeeks} Week(s)</span>
                    </div>
                  ) : scenarioType === "weather_risk" ? (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-emerald-400 uppercase">Rainfall Shift Percentage</label>
                      <input 
                        type="range" min="-40" max="40" step="20" value={rainfallChange}
                        onChange={(e) => setRainfallChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-3"
                      />
                      <span className="text-xs text-emerald-300 font-bold block mt-1 font-mono">Shift: {rainfallChange > 0 ? `+${rainfallChange}` : rainfallChange}%</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-emerald-500/40 uppercase">No Sub-params Required</label>
                      <p className="text-xs text-emerald-500/60 mt-3.5">Comparing all primary hackathon crops</p>
                    </div>
                  )}

                  <div className="flex items-end">
                    <button
                      onClick={runSimulation}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg text-sm transition tracking-wider flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-black" /> Run Simulation
                    </button>
                  </div>

                </div>

                {/* Simulation Output Table */}
                <div className="bg-[#030605] border border-emerald-500/10 rounded-lg overflow-hidden">
                  {simulating ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-3">
                      <div className="w-8 h-8 rounded-full border-2 border-t-emerald-400 border-emerald-500/10 animate-spin" />
                      <span className="text-xs text-emerald-300 uppercase tracking-widest font-bold">Simulating Future Scenarios...</span>
                    </div>
                  ) : simulationResults.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-emerald-100">
                        <thead className="bg-[#081512] text-emerald-400 uppercase text-[10px] font-bold border-b border-emerald-500/10">
                          {scenarioType === "crop_change" ? (
                            <tr>
                              <th className="px-6 py-3">Crop Name</th>
                              <th className="px-6 py-3">Net Profit / Acre</th>
                              <th className="px-6 py-3">Risk Rating</th>
                              <th className="px-6 py-3">Expected Yield</th>
                              <th className="px-6 py-3">Market Opportunity</th>
                            </tr>
                          ) : scenarioType === "delay_sell" ? (
                            <tr>
                              <th className="px-6 py-3">Timeframe</th>
                              <th className="px-6 py-3">Mandi Price Prediction</th>
                              <th className="px-6 py-3">Reefer Cost</th>
                              <th className="px-6 py-3">Net Revenue / Q</th>
                              <th className="px-6 py-3">Profit Margin Difference</th>
                              <th className="px-6 py-3">Risk Profile</th>
                            </tr>
                          ) : (
                            <tr>
                              <th className="px-6 py-3">Rainfall Shift</th>
                              <th className="px-6 py-3">Yield Impact</th>
                              <th className="px-6 py-3">Borewell cost delta</th>
                              <th className="px-6 py-3">Severity Rating</th>
                              <th className="px-6 py-3">Mitigation / Remedy</th>
                            </tr>
                          )}
                        </thead>
                        <tbody className="divide-y divide-emerald-500/5">
                          {scenarioType === "crop_change" && simulationResults.map((r, id) => (
                            <tr key={id} className="hover:bg-emerald-500/5 transition">
                              <td className="px-6 py-4 font-bold text-emerald-300">{r.crop_name}</td>
                              <td className="px-6 py-4 font-bold font-mono text-emerald-400">{r.net_profit_per_acre}</td>
                              <td className="px-6 py-4">{r.risk_level}</td>
                              <td className="px-6 py-4">{r.expected_yield}</td>
                              <td className="px-6 py-4 font-light">{r.market_opportunity}</td>
                            </tr>
                          ))}
                          {scenarioType === "delay_sell" && simulationResults.map((r, id) => (
                            <tr key={id} className="hover:bg-emerald-500/5 transition">
                              <td className="px-6 py-4 font-bold text-emerald-300">{r.timeframe}</td>
                              <td className="px-6 py-4 font-mono">{r.predicted_mandi_price}</td>
                              <td className="px-6 py-4 font-mono">{r.refrigeration_holding_cost}</td>
                              <td className="px-6 py-4 font-bold font-mono">{r.net_revenue_per_quintal}</td>
                              <td className={`px-6 py-4 font-bold font-mono ${r.profit_differential.startsWith("+") ? "text-emerald-400" : r.profit_differential.startsWith("-") ? "text-rose-400" : "text-emerald-500/50"}`}>{r.profit_differential}</td>
                              <td className="px-6 py-4 font-light">{r.risk_profile}</td>
                            </tr>
                          ))}
                          {scenarioType === "weather_risk" && simulationResults.map((r, id) => (
                            <tr key={id} className="hover:bg-emerald-500/5 transition">
                              <td className="px-6 py-4 font-bold text-emerald-300">{r.change}</td>
                              <td className="px-6 py-4 font-mono text-rose-300">{r.yield_impact}</td>
                              <td className="px-6 py-4 font-mono">{r.irrigation_cost}</td>
                              <td className="px-6 py-4">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                                  r.risk_rating === "Critical" || r.risk_rating === "Severe" || r.risk_rating.includes("Medium-High")
                                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                }`}>
                                  {r.risk_rating}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-light">{r.remedy}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-12 text-emerald-500/30">
                      <Info className="w-8 h-8 mb-2" />
                      <p>Run a simulation to generate comparing outcome charts.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* VIEW: COPILOT CHAT */}
          {currentView === "chat" && (
            <div className="max-w-4xl mx-auto glass-panel p-6 rounded-xl flex flex-col h-[calc(100vh-180px)]">
              
              {/* Chat Header */}
              <div className="border-b border-[#10b981]/15 pb-4 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                    <Cpu className="w-5 h-5" /> Smart Farmer Copilot Chat
                  </h3>
                  <p className="text-[11px] text-emerald-500/60 mt-0.5">Real-time answers grounded on your current crop timeline and immediate weather/pricing factors.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-500/60">Voice Dictation:</span>
                  <button
                    onClick={toggleSpeechRecording}
                    className={`p-2 rounded-full border transition duration-300 ${
                      isRecording
                        ? "bg-rose-500/20 border-rose-400 text-rose-400 animate-pulse"
                        : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                    }`}
                    title={speechSupported ? "Toggle dictation input" : "SpeechRecognition is not supported in this browser"}
                    disabled={!speechSupported}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Chat Message Scroll */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-2">
                {chatHistory.map((chat, idx) => {
                  const isUser = chat.role === "user";
                  return (
                    <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-xl p-4 text-xs leading-relaxed space-y-2 border ${
                        isUser 
                          ? "bg-emerald-500/10 border-emerald-400 text-emerald-200" 
                          : "bg-emerald-950/20 border-emerald-500/10 text-emerald-100"
                      }`}>
                        <span className="text-[9px] uppercase font-bold text-emerald-500/50 block font-mono">
                          {isUser ? "You" : "AgriPilot AI"}
                        </span>
                        
                        {/* Custom markdown formatting helper blocks */}
                        <div className="space-y-2 font-light">
                          {chat.content.split("\n\n").map((para, id) => {
                            if (para.startsWith("###")) {
                              return <h4 key={id} className="text-emerald-400 font-bold mt-3 text-[13px]">{para.replace("###", "")}</h4>;
                            } else if (para.startsWith("*") || para.startsWith("-")) {
                              return (
                                <ul key={id} className="list-disc pl-4 space-y-1 mt-1 text-[11px]">
                                  {para.split("\n").map((li, idy) => (
                                    <li key={idy}>{li.replace(/^[\*\-]\s*/, "")}</li>
                                  ))}
                                </ul>
                              );
                            }
                            return <p key={id}>{para}</p>;
                          })}
                        </div>

                        {!isUser && (
                          <button
                            onClick={() => speakMessage(chat.content)}
                            className="pt-2 flex items-center gap-1.5 text-[9px] text-emerald-400/80 hover:text-emerald-300 font-semibold border-t border-emerald-500/5 mt-3 uppercase"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> Read Out Loud
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-emerald-950/20 border border-emerald-500/5 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border border-t-emerald-400 border-emerald-500/10 animate-spin" />
                      <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-semibold font-mono">Supervisor routing query...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChat} className="flex gap-3 pt-4 border-t border-[#10b981]/15 shrink-0">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 bg-emerald-950/20 border border-emerald-500/20 focus:border-emerald-400 rounded-lg px-4 py-3 text-xs text-emerald-100 outline-none"
                  placeholder={isRecording ? "Listening naturally..." : "Ask: 'Should I apply fertilizer today?' or 'Which market yields the highest profit?'"}
                  required
                />
                <button
                  type="submit"
                  className="px-6 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg text-xs transition uppercase tracking-wider"
                >
                  Send Query
                </button>
              </form>

            </div>
          )}

        </div>
      </main>
      
    </div>
  );
}

// Simple fallback timelines database
const TIMELINES_MOCK = {
  "Tomato": [
    {week: 1, stage: "Land Preparation", activity: "Deep ploughing, compost spreading, soil moisture tuning.", risks: "None", fertilizers: "Organic compost", water: "Pre-irrigation", diseases: "None", market: "N/A"},
    {week: 2, stage: "Sowing", activity: "Insert seeds into beds or trays.", risks: "None", fertilizers: "NPK 19-19-19", water: "Sprinklers daily", diseases: "None", market: "N/A"},
    {week: 4, stage: "Transplanting", activity: "Move seedlings to rows with drip pipes.", risks: "Root rot", fertilizers: "DAP", water: "Drip 1 hour daily", diseases: "None", market: "N/A"},
    {week: 6, stage: "Vegetative", activity: "Staking bamboo poles for vine support.", risks: "Weeds", fertilizers: "Urea top dress", water: "Drip alternate days", diseases: "Early blight", market: "Input costs check"},
    {week: 8, stage: "Flowering & Fruit", activity: "Apply foliar Calcium Nitrate to secure fruits.", risks: "Flower drop", fertilizers: "Calcium Nitrate", water: "Consistent moisture", diseases: "Thrips", market: "Check mandi rates"},
    {week: 12, stage: "Harvest Planning", activity: "Pick breaker stage crops for transits.", risks: "Splitting", fertilizers: "SOP", water: "Reduce watering", diseases: "Fruit rot", market: "Compare wholesale"},
    {week: 13, stage: "Market Dispatch", activity: "Sorting, bagging, and dispatching to high buyer.", risks: "Spoilage", fertilizers: "None", water: "None", diseases: "None", market: "eNAM auction"}
  ],
  "Maize": [
    {week: 1, stage: "Land Preparation", activity: "Furrow channels excavation.", risks: "None", fertilizers: "Zinc sulphate", water: "Moist soil", diseases: "None", market: "N/A"},
    {week: 2, stage: "Sowing", activity: "Sow seeds at 5cm deep.", risks: "Germination failure", fertilizers: "NPK 20:20:20", water: "Irrigate once", diseases: "None", market: "N/A"},
    {week: 4, stage: "Early Vegetative", activity: "Thinning and weeding rows.", risks: "Armyworm", fertilizers: "Urea", water: "Irrigate every 10 days", diseases: "None", market: "N/A"},
    {week: 6, stage: "Knee-High Stage", activity: "Earthing up soil to root anchorages.", risks: "Deficiencies", fertilizers: "Urea top dress", water: "Moderate", diseases: "Blight", market: "Starch prices"},
    {week: 8, stage: "Tasseling", activity: "Monitor cob forming.", risks: "Dry spells", fertilizers: "Potassium spray", water: "Crucial watering", diseases: "Rust", market: "Feed mills demand"},
    {week: 12, stage: "Harvesting", activity: "Drying cobs to 15% moisture.", risks: "Aflatoxin", fertilizers: "None", water: "None", diseases: "Rot", market: "Compare options"},
    {week: 13, stage: "Dispatch", activity: "Shelling, bagging and shipping to terminal.", risks: "Damp storage", fertilizers: "None", water: "None", diseases: "None", market: "Apex Grain Hub"}
  ]
};
