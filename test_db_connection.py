"""
Script to test database connection and setup.
Run this to verify your PostgreSQL connection is working.
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# Load environment variables
load_dotenv()

def test_connection():
    """Test the database connection."""
    database_url = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/finix_db"
    )
    
    print("=" * 60)
    print("Testing Database Connection")
    print("=" * 60)
    print(f"Database URL: {database_url.split('@')[0]}@*****")  # Hide password
    
    try:
        # Create engine
        engine = create_engine(database_url, pool_pre_ping=True)
        
        # Test connection
        print("\n1. Testing connection...")
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"   [OK] Connected successfully!")
            print(f"   PostgreSQL version: {version.split(',')[0]}")
        
        # Check if database exists
        print("\n2. Checking if database 'finix_db' exists...")
        # Extract database name from URL
        db_name = database_url.split('/')[-1]
        
        # Connect to default postgres database to check
        base_url = '/'.join(database_url.split('/')[:-1]) + '/postgres'
        check_engine = create_engine(base_url, pool_pre_ping=True)
        
        with check_engine.connect() as conn:
            result = conn.execute(
                text("SELECT 1 FROM pg_database WHERE datname = :dbname"),
                {"dbname": db_name}
            )
            exists = result.fetchone()
            
            if exists:
                print(f"   [OK] Database '{db_name}' exists")
                
                # Test connection to the actual database
                print(f"\n3. Testing connection to '{db_name}'...")
                with engine.connect() as conn:
                    conn.execute(text("SELECT 1"))
                print(f"   [OK] Can connect to '{db_name}'")
                
            else:
                print(f"   [WARNING] Database '{db_name}' does not exist")
                print(f"\n   To create it, run this SQL command:")
                print(f"   CREATE DATABASE {db_name};")
                print(f"\n   Or connect to PostgreSQL and run:")
                print(f"   psql -U postgres -c 'CREATE DATABASE {db_name};'")
        
        print("\n" + "=" * 60)
        print("[SUCCESS] Database connection test PASSED!")
        print("=" * 60)
        return True
        
    except OperationalError as e:
        print("\n" + "=" * 60)
        print("[ERROR] Database connection FAILED!")
        print("=" * 60)
        print(f"\nError: {str(e)}\n")
        
        # Provide helpful error messages
        error_msg = str(e).lower()
        
        if "could not translate host name" in error_msg or "could not connect" in error_msg or "connection refused" in error_msg:
            print("[INFO] Troubleshooting:")
            print("   1. Make sure PostgreSQL is installed and running")
            print("   2. Check if PostgreSQL service is running:")
            print("      - Windows: Check Services app or run 'Get-Service postgresql*'")
            print("      - Or: Open pgAdmin and check if server is accessible")
            print("   3. Verify the host is correct (localhost or 127.0.0.1)")
        
        elif "authentication failed" in error_msg or "password" in error_msg:
            print("[INFO] Troubleshooting:")
            print("   1. Check your DATABASE_URL in .env file")
            print("   2. Verify the username and password are correct")
            print("   3. Default PostgreSQL installation uses:")
            print("      - Username: postgres")
            print("      - Password: (what you set during installation)")
        
        elif "database" in error_msg and "does not exist" in error_msg:
            print("[INFO] Troubleshooting:")
            print("   1. The database 'finix_db' needs to be created")
            print("   2. Connect to PostgreSQL and run: CREATE DATABASE finix_db;")
            print("   3. Or use pgAdmin to create the database")
        
        else:
            print("[INFO] Troubleshooting:")
            print("   1. Verify PostgreSQL is installed")
            print("   2. Check your .env file DATABASE_URL format:")
            print("      postgresql://username:password@host:port/database_name")
            print("   3. Make sure PostgreSQL service is running")
        
        return False
    
    except Exception as e:
        print("\n" + "=" * 60)
        print("[ERROR] Unexpected error occurred!")
        print("=" * 60)
        print(f"\nError: {str(e)}\n")
        return False

if __name__ == "__main__":
    test_connection()

