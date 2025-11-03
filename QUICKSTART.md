# FINIX Backend - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Set Up Database
1. Make sure PostgreSQL is running
2. Create the database:
   ```sql
   CREATE DATABASE finix_db;
   ```

### Step 3: Configure Environment
1. Copy `env_template.txt` to `.env`
2. Edit `.env` and set:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `GROQ_API_KEY` - (Optional for MVP) Your Groq API key

### Step 4: Run the Server
```bash
# Option 1: Using the run script
python run.py

# Option 2: Using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Step 5: Access the API
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📝 Test the API

### 1. Create a User
```bash
curl -X POST "http://localhost:8000/users/" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "home_currency": "USD"}'
```

### 2. Create a Travel Goal
```bash
curl -X POST "http://localhost:8000/travel-goals/" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "name": "Trip to Japan",
    "target_amount": 5000.00,
    "current_saved": 1500.00,
    "destination": "Tokyo, Japan"
  }'
```

### 3. Add Transactions
```bash
curl -X POST "http://localhost:8000/transactions/" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "amount": 45.50,
    "category": "Entertainment",
    "currency": "USD",
    "date": "2024-01-15",
    "description": "Movie tickets"
  }'
```

### 4. Get AI Suggestions (Core Innovation!)
```bash
curl "http://localhost:8000/suggestions/1"
```

This endpoint will:
- Analyze all user transactions
- Compare against travel goals
- Generate personalized savings suggestions using AI (or mock data if API key not set)

## 🎯 MVP Development Flow

### Round 1 Demo (Mock Mode)
- Run without `GROQ_API_KEY` set
- The `/suggestions/{user_id}` endpoint will return mock suggestions
- Perfect for initial pitch and architecture validation

### Round 2 (Full AI Integration)
- Add your `GROQ_API_KEY` to `.env`
- Restart the server
- Now suggestions are powered by Groq AI!

## 🔧 Troubleshooting

### Database Connection Issues
- Check PostgreSQL is running: `pg_isready`
- Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Ensure database `finix_db` exists

### Import Errors
- Make sure you're running from the project root, not inside `backend/` directory
- Or run: `python -m uvicorn backend.main:app --reload`

### AI Suggestions Return Mock Data
- This is expected if `GROQ_API_KEY` is not set
- Mock suggestions still demonstrate the concept for MVP
- Add API key for full AI-powered suggestions

## 📚 Next Steps

1. Integrate with your Next.js frontend
2. Add authentication/authorization
3. Implement rate limiting for production
4. Set up logging and monitoring
5. Deploy to production (AWS, Railway, Render, etc.)

## 🎉 You're Ready!

Your FINIX backend is now ready to power the frontend and demonstrate the AI-powered savings suggestions!

