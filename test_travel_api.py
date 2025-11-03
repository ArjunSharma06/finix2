import requests
import json

def test_travel_suggestions():
    print("\nTesting travel suggestions API...")
    destination = "Goa"
    budgets = {
        "Accommodation": 5000,
        "Flights": 8000,
        "Activities": 3000,
        "Restaurants": 2000
    }
    
    try:
        print(f"\nSending request for {destination} with budgets:")
        print(json.dumps(budgets, indent=2))
        
        response = requests.post(
            "http://127.0.0.1:8000/travel/suggestions",
            json={
                "destination": destination,
                "budgets": budgets
            }
        )
        
        print(f"\nResponse status: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            suggestions = response.json()
            print("\nSuccessfully received travel suggestions:")
            print(json.dumps(suggestions, indent=2))
        else:
            print("\nError response:")
            print(f"Status code: {response.status_code}")
            print("Headers:", dict(response.headers))
            print("Raw response text:", response.text)
            try:
                error_data = response.json()
                print("Parsed error data:", json.dumps(error_data, indent=2))
            except:
                print("Could not parse response as JSON")
            
    except requests.exceptions.RequestException as e:
        print(f"\nNetwork error:")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
    except Exception as e:
        print(f"\nUnexpected error:")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")

if __name__ == "__main__":
    test_travel_suggestions()