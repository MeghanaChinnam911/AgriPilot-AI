import uvicorn
import os

if __name__ == "__main__":
    # Ensure app directory is in Python path if running manually
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting AgriPilot AI Backend on port {port}...")
    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=True)
