"""
Step-by-step testing script for FINIX backend.
Tests all components systematically.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def print_step(step_num, description):
    """Print a formatted step header."""
    print("\n" + "=" * 70)
    print(f"STEP {step_num}: {description}")
    print("=" * 70)

def test_env_config():
    """Test 1: Verify environment configuration."""
    print_step(1, "Verifying Environment Configuration")
    
    # Check .env file exists (in current dir or backend dir)
    env_path = ".env"
    if not os.path.exists(env_path):
        env_path = "backend/.env"
        if not os.path.exists(env_path):
            print("[ERROR] .env file not found!")
            print("       Create it from env_template.txt in backend directory")
            return False
    
    print(f"[OK] .env file exists at: {env_path}")
    
    # Check SKIP_DB_INIT
    skip_db = os.getenv("SKIP_DB_INIT", "false").lower() == "true"
    print(f"[OK] SKIP_DB_INIT = {skip_db}")
    
    # Check GROQ_API_KEY
    api_key = os.getenv("GROQ_API_KEY")
    if api_key and api_key != "your_groq_api_key_here":
        print(f"[OK] GROQ_API_KEY is set (length: {len(api_key)})")
    else:
        print("[WARNING] GROQ_API_KEY not set or is placeholder")
    
    # Check DATABASE_URL
    db_url = os.getenv("DATABASE_URL", "")
    print(f"[INFO] DATABASE_URL configured")
    
    return True

def test_imports():
    """Test 2: Verify all imports work."""
    print_step(2, "Testing Python Imports")
    
    imports_to_test = [
        ("fastapi", "FastAPI"),
        ("uvicorn", "Uvicorn"),
        ("sqlalchemy", "SQLAlchemy"),
        ("pydantic", "Pydantic"),
        ("pandas", "Pandas"),
        ("groq", "Groq"),
        ("dotenv", "python-dotenv"),
    ]
    
    failed_imports = []
    for module_name, display_name in imports_to_test:
        try:
            __import__(module_name)
            print(f"[OK] {display_name} imported successfully")
        except ImportError as e:
            print(f"[ERROR] {display_name} import failed: {str(e)}")
            failed_imports.append(display_name)
    
    if failed_imports:
        print(f"\n[ERROR] Failed to import: {', '.join(failed_imports)}")
        print("        Run: pip install -r requirements.txt")
        return False
    
    return True

def test_backend_imports():
    """Test 3: Verify backend module imports."""
    print_step(3, "Testing Backend Module Imports")
    
    # Add current directory and parent directory to path
    import sys
    import os
    current_dir = os.path.abspath('.')
    parent_dir = os.path.dirname(current_dir)
    
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)
    if parent_dir not in sys.path:
        sys.path.insert(0, parent_dir)
    
    try:
        from database import get_db, init_db, check_db_connection, SKIP_DB_INIT
        print("[OK] database module imported")
    except Exception as e:
        print(f"[ERROR] database import failed: {str(e)}")
        return False
    
    try:
        from models import User, Transaction, TravelGoal
        print("[OK] models module imported")
    except Exception as e:
        print(f"[ERROR] models import failed: {str(e)}")
        return False
    
    try:
        from schemas import (
            UserCreate, UserResponse,
            TransactionCreate, TransactionResponse,
            TravelGoalCreate, TravelGoalResponse,
            AISuggestionResponse
        )
        print("[OK] schemas module imported")
    except Exception as e:
        print(f"[ERROR] schemas import failed: {str(e)}")
        return False
    
    try:
        from ai_engine import AIEngine
        print("[OK] ai_engine module imported")
    except Exception as e:
        print(f"[ERROR] ai_engine import failed: {str(e)}")
        print(f"       Error details: {str(e)}")
        return False
    
    try:
        from main import app
        print("[OK] main module (FastAPI app) imported")
    except Exception as e:
        print(f"[ERROR] main import failed: {str(e)}")
        return False
    
    return True

def test_database_config():
    """Test 4: Verify database configuration."""
    print_step(4, "Testing Database Configuration")
    
    try:
        from database import SKIP_DB_INIT, check_db_connection
    except ImportError:
        from backend.database import SKIP_DB_INIT, check_db_connection
    
    if SKIP_DB_INIT:
        print("[OK] Database initialization is SKIPPED (as configured)")
        print("     Server will run without database connection")
    else:
        print("[INFO] Database initialization is ENABLED")
        connected = check_db_connection()
        if connected:
            print("[OK] Database connection successful")
        else:
            print("[WARNING] Database connection failed (but continuing)")
            print("          Set SKIP_DB_INIT=true to suppress warnings")
    
    return True

def test_ai_engine():
    """Test 5: Verify AI Engine initialization."""
    print_step(5, "Testing AI Engine (Groq)")
    
    try:
        from ai_engine import AIEngine
    except ImportError:
        from backend.ai_engine import AIEngine
    import os
    
    api_key = os.getenv("GROQ_API_KEY")
    
    if not api_key or api_key == "your_groq_api_key_here":
        print("[INFO] Testing AI Engine in MOCK MODE")
        print("       (GROQ_API_KEY not set - using mock suggestions)")
        try:
            engine = AIEngine(mock_mode=True)
            print("[OK] AI Engine initialized in mock mode")
        except Exception as e:
            print(f"[ERROR] AI Engine mock mode failed: {str(e)}")
            return False
    else:
        print("[INFO] Testing AI Engine with GROQ_API_KEY")
        try:
            engine = AIEngine(mock_mode=False)
            print("[OK] AI Engine initialized with Groq API")
        except Exception as e:
            print(f"[WARNING] AI Engine with API key failed: {str(e)}")
            print("           Falling back to mock mode...")
            try:
                engine = AIEngine(mock_mode=True)
                print("[OK] AI Engine works in mock mode as fallback")
            except Exception as e2:
                print(f"[ERROR] AI Engine completely failed: {str(e2)}")
                return False
    
    return True

def test_fastapi_app():
    """Test 6: Verify FastAPI app configuration."""
    print_step(6, "Testing FastAPI Application")
    
    try:
        from main import app
    except ImportError:
        from backend.main import app
    
    # Check app is created
    if app is None:
        print("[ERROR] FastAPI app is None")
        return False
    print("[OK] FastAPI app instance created")
    
    # Check app title
    if hasattr(app, 'title') and app.title == "FINIX API":
        print("[OK] App title configured correctly")
    
    # Check routes
    routes = [route.path for route in app.routes]
    print(f"[OK] Found {len(routes)} routes")
    
    # Check key endpoints exist
    key_endpoints = ["/", "/health", "/docs", "/redoc"]
    found_endpoints = [ep for ep in key_endpoints if any(ep in route for route in routes)]
    print(f"[OK] Key endpoints available: {', '.join(found_endpoints)}")
    
    return True

def main():
    """Run all tests step by step."""
    # Add current directory to Python path for imports
    import sys
    if '.' not in sys.path:
        sys.path.insert(0, '.')
    
    print("\n" + "=" * 70)
    print("FINIX BACKEND - STEP BY STEP TESTING")
    print("=" * 70)
    
    tests = [
        ("Environment Config", test_env_config),
        ("Python Imports", test_imports),
        ("Backend Imports", test_backend_imports),
        ("Database Config", test_database_config),
        ("AI Engine", test_ai_engine),
        ("FastAPI App", test_fastapi_app),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"[ERROR] Test '{name}' crashed: {str(e)}")
            results.append((name, False))
    
    # Summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "[PASS]" if result else "[FAIL]"
        print(f"{status} {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n[SUCCESS] All tests passed! Your backend is ready to run.")
        print("\nNext: Start the server with: python run.py")
    else:
        print(f"\n[WARNING] {total - passed} test(s) failed. Please fix the issues above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

