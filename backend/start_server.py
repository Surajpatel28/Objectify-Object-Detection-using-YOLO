#!/usr/bin/env python3
"""
Backend server starter script for Object Detection Application
"""

import subprocess
import sys
import os
from pathlib import Path

def check_requirements():
    """Check if all required packages are installed."""
    try:
        import fastapi
        import uvicorn
        import cv2
        import numpy
        from ultralytics import YOLO
        from PIL import Image
        print("✓ All required packages are installed")
        return True
    except ImportError as e:
        print(f"✗ Missing package: {e}")
        print("Please install requirements: pip install -r requirements.txt")
        return False

def start_server():
    """Start the FastAPI server."""
    if not check_requirements():
        sys.exit(1)
    
    print("Starting Object Detection API server...")
    print("Server will be available at: http://localhost:8000")
    print("API documentation available at: http://localhost:8000/docs")
    print("Press Ctrl+C to stop the server")
    
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == "__main__":
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    start_server()
