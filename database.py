"""
Database connection and session management for FINIX backend.
Handles PostgreSQL connection pooling and session lifecycle.
"""

from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
import os
from typing import Generator, Optional

# Database URL from environment variable
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/finix_db"
)

# Flag to skip database initialization (useful for testing without DB)
SKIP_DB_INIT = os.getenv("SKIP_DB_INIT", "false").lower() == "true"

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using them
    pool_size=10,
    max_overflow=20,
    echo=False  # Set to True for SQL query logging during development
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


def get_db() -> Generator:
    """
    Dependency function for FastAPI to get database sessions.
    Yields a database session and ensures proper cleanup.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> bool:
    """
    Initialize the database by creating all tables.
    Call this function once to set up the database schema.
    
    Returns:
        bool: True if initialization was successful, False otherwise
    """
    if SKIP_DB_INIT:
        print("[INFO] Database initialization skipped (SKIP_DB_INIT=true)")
        return False
    
    try:
        Base.metadata.create_all(bind=engine)
        print("[OK] Database tables initialized successfully")
        return True
    except OperationalError as e:
        print(f"[WARNING] Database initialization failed: {str(e)}")
        print("[INFO] Continuing without database. Set SKIP_DB_INIT=true to suppress this warning.")
        return False
    except Exception as e:
        print(f"[ERROR] Unexpected error during database initialization: {str(e)}")
        return False


def check_db_connection() -> bool:
    """
    Check if database connection is available.
    
    Returns:
        bool: True if connection is available, False otherwise
    """
    if SKIP_DB_INIT:
        return False
    
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False

