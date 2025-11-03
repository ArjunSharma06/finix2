"""
SQLAlchemy ORM models for FINIX database schema.
Defines User, Transaction, and TravelGoal tables.
"""

from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    """
    User model representing user accounts and base preferences.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    home_currency = Column(String(3), default="USD", nullable=False)  # ISO 4217 currency code
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    travel_goals = relationship("TravelGoal", back_populates="user", cascade="all, delete-orphan")


class Transaction(Base):
    """
    Transaction model representing raw spending data.
    This is the core input for AI analysis.
    """
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Numeric(12, 2), nullable=False)  # Supports up to 9,999,999,999.99
    category = Column(String(50), nullable=False, index=True)  # e.g., "Food", "Transport", "Entertainment"
    currency = Column(String(3), default="USD", nullable=False)  # ISO 4217 currency code
    date = Column(Date, nullable=False, index=True)
    description = Column(String(255), nullable=True)  # Optional transaction description
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="transactions")


class TravelGoal(Base):
    """
    TravelGoal model defining specific savings targets and context.
    This provides the goal context for AI-generated savings advice.
    """
    __tablename__ = "travel_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)  # e.g., "Trip to Japan"
    target_amount = Column(Numeric(12, 2), nullable=False)  # Target savings amount
    current_saved = Column(Numeric(12, 2), default=0.0, nullable=False)  # Current savings progress
    target_date = Column(Date, nullable=True)  # Optional target date for the trip
    destination = Column(String(255), nullable=True)  # Optional destination description
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="travel_goals")

