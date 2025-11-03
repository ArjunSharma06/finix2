import json
from typing import Dict, List
from pydantic import BaseModel
from fastapi import HTTPException

class TravelSuggestionsRequest(BaseModel):
    destination: str
    budgets: Dict[str, int]

def register_travel_routes(app):
    print("Registering travel suggestions route...")
    
    def debug_log(*args, **kwargs):
        """Helper function to print debug messages with a timestamp"""
        from datetime import datetime
        timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
        print(f"[{timestamp}]", *args, **kwargs)

    @app.post("/travel/suggestions", response_model=List[dict])
    async def get_travel_suggestions(request: TravelSuggestionsRequest):
        """
        Get AI-generated travel suggestions for a destination with specified budgets.
        """
        debug_log("Processing new request")
        debug_log("Request data:", vars(request))

        try:
            from lib.utils import generateTravelSuggestions

            debug_log("Imported generateTravelSuggestions successfully")
            debug_log("Calling function with:", {
                "destination": request.destination,
                "budgets": request.budgets
            })

            try:
                # generateTravelSuggestions is a synchronous helper. Call it directly.
                suggestions = generateTravelSuggestions(request.destination, request.budgets)
                debug_log("Got suggestions:", suggestions)
                return suggestions

            except Exception as e:
                debug_log("Error in generateTravelSuggestions")
                import traceback
                debug_log("Error type:", type(e))
                debug_log("Error message:", str(e))
                debug_log("Traceback:")
                traceback.print_exc()
                raise

        except Exception as e:
            debug_log("Error in route handler")
            import traceback
            debug_log("Error type:", type(e))
            debug_log("Error message:", str(e))
            debug_log("Traceback:")
            traceback.print_exc()

            raise HTTPException(
                status_code=500,
                detail=str(e)
            )