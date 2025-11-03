"""
Simple script to run the FINIX backend server.
Usage: python run.py
"""

import uvicorn
import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    
    # Determine if we're running from backend directory or parent directory
    current_dir = os.path.abspath('.')
    parent_dir = os.path.dirname(current_dir)
    
    # Add parent directory to path if running from backend directory
    if os.path.basename(current_dir) == 'backend' and parent_dir not in sys.path:
        sys.path.insert(0, parent_dir)
    
    # Try to determine the correct module path
    try:
        # First try running from backend directory
        import main
        app_module = "main:app"
        print(f"[INFO] Running from backend directory")
    except ImportError:
        # If that fails, try from parent directory
        app_module = "backend.main:app"
        print(f"[INFO] Running from parent directory")
    
    print(f"[INFO] Starting server on {host}:{port}")
    print(f"[INFO] API docs will be available at: http://localhost:{port}/docs")
    
    uvicorn.run(
        app_module,
        host=host,
        port=port,
        reload=True,  # Enable auto-reload during development
        log_level="info"
    )

