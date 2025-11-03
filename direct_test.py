import os
from dotenv import load_dotenv

def test():
    # Load environment variables
    load_dotenv()
    
    # Import here to avoid any module loading issues
    from lib.utils import generateTravelSuggestions
    
    destination = "Goa"
    budgets = {
        "Accommodation": 5000,
        "Flights": 8000,
        "Activities": 3000,
        "Restaurants": 2000
    }
    
    print("\nStarting test with:")
    print(f"Destination: {destination}")
    print("Budgets:", budgets)
    print("\nCalling generateTravelSuggestions...")
    
    try:
        suggestions = generateTravelSuggestions(destination, budgets)
        print("\nSuccess! Got suggestions:", suggestions)
    except Exception as e:
        print("\nError occurred:")
        print(f"Type: {type(e)}")
        print(f"Message: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()