# PostgreSQL Database Setup Guide

## Current Status
Based on the connection test, PostgreSQL is **not running** on your system.

## Option 1: Install PostgreSQL Locally

### Windows Installation Steps:

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Or use installer: https://www.postgresql.org/download/
   - Download the latest version (15 or 16 recommended)

2. **Install PostgreSQL:**
   - Run the installer
   - **Important:** During installation, remember the password you set for the `postgres` user
   - Default port is `5432` (usually fine to keep as default)
   - Install location: Usually `C:\Program Files\PostgreSQL\<version>`

3. **Start PostgreSQL Service:**
   - After installation, PostgreSQL should start automatically
   - To check if it's running:
     ```powershell
     Get-Service postgresql*
     ```
   - To start it manually if needed:
     ```powershell
     Start-Service postgresql-x64-<version>
     ```

4. **Create the Database:**
   - Open pgAdmin (comes with PostgreSQL) or use command line
   - Connect to localhost server
   - Right-click "Databases" → "Create" → "Database"
   - Name: `finix_db`
   
   **OR use SQL:**
   ```sql
   CREATE DATABASE finix_db;
   ```

5. **Update your `.env` file:**
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/finix_db
   ```
   Replace `YOUR_PASSWORD` with the password you set during installation.

## Option 2: Use Docker (Easier for Development)

If you have Docker installed:

```powershell
docker run --name finix-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=finix_db -p 5432:5432 -d postgres
```

This creates a PostgreSQL container with:
- Database name: `finix_db`
- Username: `postgres`
- Password: `postgres`
- Port: `5432`

Your `.env` file already has the correct configuration for this.

## Option 3: Use a Cloud Database (Production)

### Free Options:
1. **Supabase** (Recommended): https://supabase.com
   - Free tier: 500 MB database, unlimited API requests
   - Copy connection string to `.env`

2. **Railway**: https://railway.app
   - Free tier available

3. **Neon**: https://neon.tech
   - Serverless PostgreSQL, free tier

4. **Render**: https://render.com
   - Free PostgreSQL database

## Test Your Connection

After setting up PostgreSQL, run:
```powershell
python test_db_connection.py
```

This will verify:
- PostgreSQL is running
- Connection credentials are correct
- Database exists
- You can connect to the database

## Quick Start with Docker (Recommended)

If you have Docker:

```powershell
# Start PostgreSQL container
docker run --name finix-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=finix_db -p 5432:5432 -d postgres

# Test connection
python test_db_connection.py
```

The database tables will be created automatically when you run your FastAPI server!

## Next Steps

Once your database is connected:
1. Run `python test_db_connection.py` to verify
2. Start your server: `python run.py`
3. The tables will be created automatically on startup
4. Access API docs at: http://localhost:8000/docs

