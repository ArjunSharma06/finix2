"""
Quick test script to verify backend setup for Round 1 Prototype
Run this before starting the full application
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_imports():
    """Test if all required packages are installed"""
    print("=" * 60)
    print("TESTING: Python Package Imports")
    print("=" * 60)
    
    try:
        import fastapi
        print("[OK] fastapi")
    except ImportError:
        print("[FAIL] fastapi - Install with: pip install fastapi")
        return False
    
    try:
        import uvicorn
        print("[OK] uvicorn")
    except ImportError:
        print("[FAIL] uvicorn - Install with: pip install uvicorn[standard]")
        return False
    
    try:
        import pandas
        print("[OK] pandas")
    except ImportError:
        print("[FAIL] pandas - Install with: pip install pandas")
        return False
    
    try:
        import groq
        print("[OK] groq")
    except ImportError:
        print("[FAIL] groq - Install with: pip install groq")
        return False
    
    try:
        import pydantic
        print("[OK] pydantic")
    except ImportError:
        print("[FAIL] pydantic - Install with: pip install pydantic")
        return False
    
    print("\n[OK] All packages imported successfully!")
    return True

def test_environment():
    """Test environment variables"""
    print("\n" + "=" * 60)
    print("TESTING: Environment Variables")
    print("=" * 60)
    
    groq_key = os.getenv("GROQ_API_KEY")
    skip_db = os.getenv("SKIP_DB_INIT", "false").lower()
    
    if groq_key and groq_key != "your_groq_api_key_here":
        print("[OK] GROQ_API_KEY is set")
    else:
        print("[WARNING] GROQ_API_KEY not set (will use mock suggestions)")
    
    if skip_db == "true":
        print("[OK] SKIP_DB_INIT=true (Round 1 mode - no database needed)")
    else:
        print("[WARNING] SKIP_DB_INIT=false (will try to connect to database)")
    
    return True

def test_backend_imports():
    """Test if backend modules can be imported"""
    print("\n" + "=" * 60)
    print("TESTING: Backend Module Imports")
    print("=" * 60)
    
    try:
        # Add current directory to path
        if os.path.dirname(__file__) not in sys.path:
            sys.path.insert(0, os.path.dirname(__file__))
        
        import main
        print("[OK] main.py")
        
        import schemas
        print("[OK] schemas.py")
        
        import ai_engine
        print("[OK] ai_engine.py")
        
        # Test AI Engine initialization
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key and groq_key != "your_groq_api_key_here":
            # Test with real API key
            try:
                engine = ai_engine.AIEngine(mock_mode=False)
                print("[OK] AIEngine initializes with Groq API key")
            except Exception as e:
                print(f"[WARNING] AIEngine with API key failed: {e}")
                print("[INFO] Falling back to mock mode...")
                try:
                    engine = ai_engine.AIEngine(mock_mode=True)
                    print("[OK] AIEngine initializes in mock mode (fallback)")
                except Exception as e2:
                    print(f"[FAIL] AIEngine initialization completely failed: {e2}")
                    return False
        else:
            # Test with mock mode
            try:
                engine = ai_engine.AIEngine(mock_mode=True)
                print("[OK] AIEngine initializes in mock mode")
            except Exception as e:
                print(f"[FAIL] AIEngine initialization failed: {e}")
                return False
        
        print("\n[OK] All backend modules imported successfully!")
        return True
    except ImportError as e:
        print(f"✗ Import error: {e}")
        return False

def main():
    print("\n" + "=" * 60)
    print("FINIX Round 1 Prototype - Quick Setup Test")
    print("=" * 60)
    print()
    
    all_passed = True
    
    # Test 1: Package imports
    if not test_imports():
        all_passed = False
    
    # Test 2: Environment variables
    if not test_environment():
        all_passed = False
    
    # Test 3: Backend modules
    if not test_backend_imports():
        all_passed = False
    
    print("\n" + "=" * 60)
    if all_passed:
        print("[SUCCESS] ALL TESTS PASSED!")
        print("[OK] Ready to start backend server")
        print("\nNext steps:")
        print("  1. Start backend: python run.py")
        print("  2. Start frontend: npm run dev (in another terminal)")
        print("  3. Open browser: http://localhost:3000")
    else:
        print("[FAIL] SOME TESTS FAILED")
        print("  Please fix the issues above before starting the server")
    print("=" * 60)
    print()

if __name__ == "__main__":
    main()

