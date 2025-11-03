"""
Pydantic schemas for request/response validation in FINIX API.
Ensures data integrity and type safety for all API endpoints.
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal


# User Schemas
class UserBase(BaseModel):
    """Base schema for User with common fields."""
    username: str = Field(..., min_length=1, max_length=100)
    home_currency: str = Field(default="USD", min_length=3, max_length=3)


class UserCreate(UserBase):
    """Schema for creating a new user."""
    pass


class UserResponse(UserBase):
    """Schema for user response."""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Transaction Schemas
class TransactionBase(BaseModel):
    """Base schema for Transaction with common fields."""
    amount: Decimal = Field(..., gt=0, description="Transaction amount (must be positive)")
    category: str = Field(..., min_length=1, max_length=50)
    currency: str = Field(default="USD", min_length=3, max_length=3)
    date: date
    description: Optional[str] = Field(None, max_length=255)

    @validator('currency')
    def validate_currency(cls, v):
        """Ensure currency code is uppercase."""
        return v.upper() if v else v


class TransactionCreate(TransactionBase):
    """Schema for creating a new transaction."""
    user_id: int


class TransactionResponse(TransactionBase):
    """Schema for transaction response."""
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# TravelGoal Schemas
class TravelGoalBase(BaseModel):
    """Base schema for TravelGoal with common fields."""
    name: str = Field(..., min_length=1, max_length=255)
    target_amount: Decimal = Field(..., gt=0, description="Target savings amount (must be positive)")
    current_saved: Decimal = Field(default=0.0, ge=0, description="Current savings (must be non-negative)")
    target_date: Optional[date] = None
    destination: Optional[str] = Field(None, max_length=255)


class TravelGoalCreate(TravelGoalBase):
    """Schema for creating a new travel goal."""
    user_id: int


class TravelGoalUpdate(BaseModel):
    """Schema for updating an existing travel goal."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    target_amount: Optional[Decimal] = Field(None, gt=0)
    current_saved: Optional[Decimal] = Field(None, ge=0)
    target_date: Optional[date] = None
    destination: Optional[str] = Field(None, max_length=255)


class TravelGoalResponse(TravelGoalBase):
    """Schema for travel goal response."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# AI Suggestion Schemas
class SavingsSuggestion(BaseModel):
    """Schema for a single savings suggestion."""
    title: str = Field(..., description="Suggestion title")
    description: str = Field(..., description="Detailed suggestion description")
    potential_savings: Decimal = Field(..., ge=0, description="Potential monthly savings amount")
    impact: str = Field(..., description="Impact on travel goal timeline")
    category: Optional[str] = Field(None, description="Related expense category")


class AISuggestionResponse(BaseModel):
    """Schema for AI-generated savings suggestions response."""
    user_id: int
    travel_goal_name: str
    target_amount: Decimal
    current_saved: Decimal
    remaining_amount: Decimal
    average_monthly_spending: Decimal
    non_essential_spending: Decimal
    months_to_goal_current: Optional[float] = None
    months_to_goal_optimized: Optional[float] = None
    suggestions: List[SavingsSuggestion]
    generated_at: datetime

    class Config:
        from_attributes = True


# Stateless API Schemas (Round 1 Prototype - No Database)
class StatelessTransactionInput(BaseModel):
    """Schema for transaction input in stateless API calls."""
    amount: Decimal = Field(..., gt=0)
    category: str = Field(..., min_length=1, max_length=50)
    currency: str = Field(default="USD", min_length=3, max_length=3)
    date: date
    description: Optional[str] = Field(None, max_length=255)


class StatelessTravelGoalInput(BaseModel):
    """Schema for travel goal input in stateless API calls."""
    name: str = Field(..., min_length=1, max_length=255)
    target_amount: Decimal = Field(..., gt=0)
    current_saved: Decimal = Field(default=0.0, ge=0)
    target_date: Optional[date] = None
    destination: Optional[str] = Field(None, max_length=255)


class SuggestionsCalculateRequest(BaseModel):
    """Schema for stateless suggestions calculation request."""
    transactions: List[StatelessTransactionInput] = Field(..., description="List of user transactions")
    travel_goal: StatelessTravelGoalInput = Field(..., description="Travel goal information")
    user_id: int = Field(default=1, description="User ID for response (not used for calculation)")


class TransactionsSummaryRequest(BaseModel):
    """Schema for stateless transaction summary request."""
    transactions: List[StatelessTransactionInput] = Field(..., description="List of transactions to summarize")
