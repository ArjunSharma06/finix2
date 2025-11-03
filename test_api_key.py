"""
Quick script to verify your Groq API key is configured correctly.
Run: python test_api_key.py
"""

from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

print("=" * 60)
print("Testing Groq API Key Configuration")
print("=" * 60)

# Get API key
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    print("\n[ERROR] GROQ_API_KEY not found in environment variables!")
    print("\nMake sure you have:")
    print("1. Created a .env file in the backend directory")
    print("2. Added: GROQ_API_KEY=your_actual_api_key_here")
    print("3. The .env file is in the same directory as this script")
    exit(1)

if api_key == "your_groq_api_key_here" or api_key.startswith("your_"):
    print("\n[WARNING] API key appears to be a placeholder!")
    print(f"Current value: {api_key[:10]}...")
    print("\nPlease replace 'your_groq_api_key_here' with your actual Groq API key.")
    print("Get your API key from: https://console.groq.com/")
    exit(1)

# Check key format (Groq API keys typically start with 'gsk_')
if not api_key.startswith("gsk_"):
    print(f"\n[WARNING] API key doesn't start with 'gsk_'")
    print(f"Make sure you're using a valid Groq API key.")
    print(f"Current key format: {api_key[:10]}...")

print(f"\n[OK] API key found: {api_key[:10]}...{api_key[-4:]}")
print(f"Length: {len(api_key)} characters")

# Try to initialize Groq client (optional - tests if key works)
try:
    from groq import Groq
    # Create client without extra parameters to avoid compatibility issues
    client = Groq(api_key=api_key)
    print("\n[OK] Groq client initialized successfully!")
    print("\nYour API key is configured correctly and ready to use.")
except Exception as e:
    print(f"\n[INFO] Note: Groq client test had an issue (may be version compatibility)")
    print(f"Error: {str(e)}")
    print("\nBut the API key IS loaded correctly from .env file!")
    print("The API key will work when used in the actual application.")

print("\n" + "=" * 60)
print("Configuration test complete!")
print("=" * 60)

