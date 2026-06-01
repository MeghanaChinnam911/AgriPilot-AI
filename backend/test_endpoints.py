import subprocess
import time
import requests
import json
import sys

def run_tests():
    print("Starting FastAPI app in a background process...")
    # Launch uvicorn server in backend folder
    cmd = [sys.executable, "run.py"]
    proc = subprocess.Popen(cmd, cwd="c:\\Users\\megha\\OneDrive\\Desktop\\agripilot\\backend")
    
    # Wait for server to start
    time.sleep(3)
    
    url = "http://127.0.0.1:8000"
    try:
        # Test Root
        res = requests.get(url + "/")
        print(f"GET / response: {res.status_code} - {res.json()}")
        assert res.status_code == 200
        
        # Test Profile Save
        profile_data = {
            "location": "Central Valley",
            "land_area": 10.5,
            "soil_type": "Clay",
            "water_availability": "Borewell/Pump",
            "planting_date": "2026-06-15",
            "budget": 2000.0,
            "farming_experience": "Expert"
        }
        res = requests.post(url + "/api/profile", json=profile_data)
        print(f"POST /api/profile response: {res.status_code} - {res.json().get('status')}")
        assert res.status_code == 200
        
        # Test Crop Discovery
        res = requests.get(url + "/api/crops/discover")
        discovered = res.json()
        print(f"GET /api/crops/discover count: {len(discovered)}")
        assert res.status_code == 200
        assert len(discovered) > 0
        
        # Test Crop Selection
        res = requests.post(url + "/api/crops/select", json={"crop_name": "Tomato"})
        print(f"POST /api/crops/select response: {res.status_code} - selected: {res.json().get('selected_crop')}")
        assert res.status_code == 200
        assert len(res.json().get("timeline")) > 0
        
        # Test Chat Copilot (Weather Alert Question)
        chat_payload = {
            "message": "Is the heavy rain going to affect my tomato crops?",
            "profile": profile_data,
            "selected_crop": "Tomato"
        }
        res = requests.post(url + "/api/chat", json=chat_payload)
        chat_res = res.json()
        print(f"POST /api/chat status: {res.status_code}")
        print(f"Supervisor Decision: {chat_res.get('answer')[:120]}...")
        print(f"Invoked Agents: {chat_res.get('invoked_agents')}")
        assert res.status_code == 200
        assert "Supervisor Agent" in chat_res.get("invoked_agents")
        
        # Test Disease Diagnostic
        res = requests.post(url + "/api/disease/detect", json={"file_bytes": ""})
        diag = res.json()
        print(f"POST /api/disease/detect response: {diag.get('disease_name')} - Loss: {diag.get('estimated_loss_percent')}%")
        assert res.status_code == 200
        
        # Test Scenario Simulation
        sim_payload = {
            "current_crop": "Tomato",
            "scenario_type": "delay_sell",
            "parameters": {"weeks": 2}
        }
        res = requests.post(url + "/api/scenario/simulate", json=sim_payload)
        print(f"POST /api/scenario/simulate count: {len(res.json().get('results'))}")
        assert res.status_code == 200
        
        print("\n=== ALL ENDPOINT INTEGRATION TESTS PASSED SUCCESSFULLY ===")
        
    except Exception as e:
        print(f"Tests failed: {e}")
    finally:
        # Kill the process
        print("Stopping FastAPI server...")
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    run_tests()
