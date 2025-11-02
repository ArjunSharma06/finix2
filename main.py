"""
FastAPI main application for FINIX backend.
Entry point for all API endpoints and CORS configuration.
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from database import get_db, init_db, engine
from models import Base, User, Transaction, TravelGoal
from schemas import (
    UserCreate, UserResponse,
    TransactionCreate, TransactionResponse,
    TravelGoalCreate, TravelGoalUpdate, TravelGoalResponse,
    AISuggestionResponse,
    SuggestionsCalculateRequest, TransactionsSummaryRequest,
    StatelessTransactionInput
)
from ai_engine import AIEngine

# Create FastAPI app instance
app = FastAPI(
    title="FINIX API",
    description="AI-Powered Financial & Travel Platform Backend",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js default port (local dev)
        "http://localhost:3001",  # Alternative Next.js port
        "http://localhost:5173",  # Vite default port
        "https://finix9.vercel.app",  # Production frontend (Vercel)
        "https://*.vercel.app",  # All Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Engine instance (lazy initialization)
ai_engine: Optional[AIEngine] = None

def get_ai_engine() -> Optional[AIEngine]:
    """Get or create AI Engine instance (lazy initialization)."""
    global ai_engine
    if ai_engine is None:
        try:
            ai_engine = AIEngine()
        except ValueError as e:
            # If API key is missing, return None (will use mock mode)
            print(f"Warning: {e}. AI suggestions will fall back to mock responses.")
            ai_engine = None
    return ai_engine

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on application startup."""
    db_initialized = init_db()
    if not db_initialized:
        print("[INFO] Running in database-less mode. Some endpoints may not work.")


# Health Check Endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint to verify API is running."""
    from database import check_db_connection, SKIP_DB_INIT
    
    db_status = "connected" if check_db_connection() else "disconnected"
    if SKIP_DB_INIT:
        db_status = "skipped"
    
    return {
        "status": "healthy",
        "service": "FINIX API",
        "database": db_status,
        "version": "1.0.0"
    }


# ==================== USER ENDPOINTS ====================

@app.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user account.
    
    Args:
        user: User creation data
        db: Database session
        
    Returns:
        Created user object
    """
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Get user by ID.
    
    Args:
        user_id: User ID
        db: Database session
        
    Returns:
        User object
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    return user


@app.get("/users/", response_model=List[UserResponse])
async def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    List all users with pagination.
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        db: Database session
        
    Returns:
        List of user objects
    """
    users = db.query(User).offset(skip).limit(limit).all()
    return users


# ==================== TRANSACTION ENDPOINTS ====================

@app.post("/transactions/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    """
    Create a new transaction record.
    
    Args:
        transaction: Transaction creation data
        db: Database session
        
    Returns:
        Created transaction object
    """
    # Verify user exists
    user = db.query(User).filter(User.id == transaction.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {transaction.user_id} not found"
        )
    
    db_transaction = Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


@app.get("/transactions/{user_id}", response_model=List[TransactionResponse])
async def get_transactions(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    start_date: date = None,
    end_date: date = None,
    category: str = None,
    db: Session = Depends(get_db)
):
    """
    Get all transactions for a specific user.
    
    Args:
        user_id: User ID
        skip: Number of records to skip
        limit: Maximum number of records to return
        start_date: Optional start date filter
        end_date: Optional end date filter
        category: Optional category filter
        db: Database session
        
    Returns:
        List of transaction objects
    """
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    query = db.query(Transaction).filter(Transaction.user_id == user_id)
    
    # Apply filters
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    if category:
        query = query.filter(Transaction.category == category)
    
    transactions = query.order_by(Transaction.date.desc()).offset(skip).limit(limit).all()
    return transactions


@app.get("/transactions/{user_id}/summary")
async def get_transaction_summary(user_id: int, db: Session = Depends(get_db)):
    """
    Get transaction summary statistics for a user.
    
    Args:
        user_id: User ID
        db: Database session
        
    Returns:
        Summary statistics
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()
    
    if not transactions:
        return {
            "total_transactions": 0,
            "total_amount": 0,
            "average_amount": 0,
            "categories": {}
        }
    
    total_amount = sum(float(t.amount) for t in transactions)
    categories = {}
    for t in transactions:
        categories[t.category] = categories.get(t.category, 0) + float(t.amount)
    
    return {
        "total_transactions": len(transactions),
        "total_amount": total_amount,
        "average_amount": total_amount / len(transactions) if transactions else 0,
        "categories": categories
    }


# ==================== TRAVEL GOAL ENDPOINTS ====================

@app.post("/travel-goals/", response_model=TravelGoalResponse, status_code=status.HTTP_201_CREATED)
async def create_travel_goal(goal: TravelGoalCreate, db: Session = Depends(get_db)):
    """
    Create a new travel goal.
    
    Args:
        goal: Travel goal creation data
        db: Database session
        
    Returns:
        Created travel goal object
    """
    # Verify user exists
    user = db.query(User).filter(User.id == goal.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {goal.user_id} not found"
        )
    
    db_goal = TravelGoal(**goal.dict())
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal


@app.get("/travel-goals/{user_id}", response_model=List[TravelGoalResponse])
async def get_travel_goals(user_id: int, db: Session = Depends(get_db)):
    """
    Get all travel goals for a specific user.
    
    Args:
        user_id: User ID
        db: Database session
        
    Returns:
        List of travel goal objects
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    goals = db.query(TravelGoal).filter(TravelGoal.user_id == user_id).order_by(TravelGoal.created_at.desc()).all()
    return goals


@app.get("/travel-goals/{user_id}/{goal_id}", response_model=TravelGoalResponse)
async def get_travel_goal(user_id: int, goal_id: int, db: Session = Depends(get_db)):
    """
    Get a specific travel goal.
    
    Args:
        user_id: User ID
        goal_id: Travel goal ID
        db: Database session
        
    Returns:
        Travel goal object
    """
    goal = db.query(TravelGoal).filter(
        TravelGoal.id == goal_id,
        TravelGoal.user_id == user_id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Travel goal with ID {goal_id} not found for user {user_id}"
        )
    
    return goal


@app.put("/travel-goals/{user_id}/{goal_id}", response_model=TravelGoalResponse)
async def update_travel_goal(
    user_id: int,
    goal_id: int,
    goal_update: TravelGoalUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing travel goal.
    
    Args:
        user_id: User ID
        goal_id: Travel goal ID
        goal_update: Updated travel goal data
        db: Database session
        
    Returns:
        Updated travel goal object
    """
    goal = db.query(TravelGoal).filter(
        TravelGoal.id == goal_id,
        TravelGoal.user_id == user_id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Travel goal with ID {goal_id} not found for user {user_id}"
        )
    
    # Update only provided fields
    update_data = goal_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(goal, field, value)
    
    db.commit()
    db.refresh(goal)
    return goal


@app.delete("/travel-goals/{user_id}/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_travel_goal(user_id: int, goal_id: int, db: Session = Depends(get_db)):
    """
    Delete a travel goal.
    
    Args:
        user_id: User ID
        goal_id: Travel goal ID
        db: Database session
    """
    goal = db.query(TravelGoal).filter(
        TravelGoal.id == goal_id,
        TravelGoal.user_id == user_id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Travel goal with ID {goal_id} not found for user {user_id}"
        )
    
    db.delete(goal)
    db.commit()
    return None


# ==================== AI SUGGESTIONS ENDPOINT ====================

@app.get("/suggestions/{user_id}", response_model=AISuggestionResponse)
async def get_ai_suggestions(user_id: int, db: Session = Depends(get_db)):
    """
    Get AI-generated personalized savings suggestions.
    
    This is the core innovation endpoint that connects spending patterns to travel goals.
    
    Args:
        user_id: User ID
        db: Database session
        
    Returns:
        AI-generated savings suggestions with analysis
    """
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    # Check if user has a travel goal
    travel_goal = db.query(TravelGoal).filter(TravelGoal.user_id == user_id).first()
    if not travel_goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No travel goal found for user {user_id}. Please create a travel goal first."
        )
    
    try:
        # Get AI engine (lazy initialization)
        engine = get_ai_engine()
        if engine is None:
            # Create engine in mock mode (no API key required)
            from ai_engine import AIEngine
            engine = AIEngine(mock_mode=True)
        
        # Generate AI suggestions
        suggestions = engine.generate_suggestions(db, user_id)
        return suggestions
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # Log error and return mock suggestions as fallback
        print(f"Error generating AI suggestions: {str(e)}")
        # Try to generate fallback mock suggestions
        try:
            suggestions = ai_engine.generate_suggestions(db, user_id)
            return suggestions
        except Exception as fallback_error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate suggestions: {str(fallback_error)}"
            )


# ==================== STATELESS API ENDPOINTS (Round 1 Prototype) ====================

@app.post("/suggestions/calculate", response_model=AISuggestionResponse)
async def calculate_suggestions_stateless(request: SuggestionsCalculateRequest):
    """
    Calculate AI-generated savings suggestions from provided data (stateless - no database).
    
    This endpoint is for Round 1 Prototype where data is sent in the request body.
    Perfect for frontend forms that collect user input manually.
    
    Args:
        request: Contains transactions list and travel goal data
        
    Returns:
        AI-generated savings suggestions with analysis
    """
    try:
        # Get or create AI engine (will use Groq API if key is set, otherwise mock mode)
        engine = get_ai_engine()
        if engine is None:
            # Fallback to mock mode if API key not available
            from ai_engine import AIEngine
            engine = AIEngine(mock_mode=True)
        
        # Convert Pydantic models to dictionaries
        transactions_data = [
            {
                "amount": t.amount,
                "category": t.category,
                "currency": t.currency,
                "date": t.date,
                "description": t.description
            }
            for t in request.transactions
        ]
        
        travel_goal_data = {
            "name": request.travel_goal.name,
            "target_amount": request.travel_goal.target_amount,
            "current_saved": request.travel_goal.current_saved,
            "target_date": request.travel_goal.target_date,
            "destination": request.travel_goal.destination,
            "user_id": request.user_id
        }
        
        # Generate suggestions using stateless method
        suggestions = engine.generate_suggestions_stateless(transactions_data, travel_goal_data)
        return suggestions
        
    except Exception as e:
        print(f"Error generating stateless suggestions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate suggestions: {str(e)}"
        )


@app.post("/transactions/summary")
async def get_transaction_summary_stateless(request: TransactionsSummaryRequest):
    """
    Calculate transaction summary statistics from provided data (stateless - no database).
    
    This endpoint accepts a list of transactions and returns summary statistics.
    Used for Round 1 Prototype with manual data input.
    
    Args:
        request: Contains list of transactions
        
    Returns:
        Summary statistics (total, average, categories breakdown)
    """
    try:
        if not request.transactions:
            return {
                "total_transactions": 0,
                "total_amount": 0,
                "average_amount": 0,
                "categories": {}
            }
        
        total_amount = sum(float(t.amount) for t in request.transactions)
        categories = {}
        
        for t in request.transactions:
            category = t.category
            amount = float(t.amount)
            categories[category] = categories.get(category, 0) + amount
        
        return {
            "total_transactions": len(request.transactions),
            "total_amount": total_amount,
            "average_amount": total_amount / len(request.transactions) if request.transactions else 0,
            "categories": categories
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error calculating summary: {str(e)}"
        )


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to FINIX API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

