# FINIX - AI-Powered Financial & Travel Platform

FINIX is an all-in-one platform designed to shift personal finance from passive expense tracking to proactive, goal-oriented savings and intelligent travel planning. The platform combines budgeting, expense splitting, and trip planning into a single, intelligent application.

## 🎯 Core Innovation

FINIX serves as the **Single Source of Truth** for a user's financial life, with an AI Engine that generates personalized, context-aware savings strategies by directly comparing real-time spending habits against concrete travel goals.

**Value Proposition**: Unification of three distinct functionalities (budgeting, expense splitting, trip planning) into a single, intelligent application - **"1 App Replaces 3"**.

## 🏗️ Architecture

This is a full-stack application with separate frontend and backend components:

### Backend (Python/FastAPI)
- **Technology**: FastAPI, PostgreSQL, SQLAlchemy, Groq API
- **Location**: Root directory (`main.py`, `models.py`, `database.py`, etc.)
- **Purpose**: RESTful API server handling database operations and AI-powered suggestions

### Frontend (Next.js/React)
- **Technology**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Location**: Root directory with Next.js structure (`app/`, `components/`, etc.)
- **Purpose**: Modern web interface for financial dashboard, expense tracking, and travel planning

## 🚀 Features

### Financial Management
- **Smart Analytics**: Real-time insights into spending patterns with AI-powered recommendations
- **Expense Tracking**: Comprehensive expense management and categorization
- **Wallet Management**: Multi-wallet support with balance tracking
- **Budget Tracking**: Monthly budget monitoring and alerts

### Social Features
- **FairShare**: Split expenses with friends and track shared costs

### Travel Planning
- **Travel Goals**: Set savings targets for specific trips
- **AI-Powered Suggestions**: Get personalized savings strategies that link current spending to travel goals

### User Experience
- **Dark Mode**: Beautiful dark and light themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smart Suggestions**: AI-powered recommendations to optimize finances

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI Engine**: Groq API (with mock mode fallback)
- **Data Processing**: Pandas

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

### For Backend
- Python 3.9+
- PostgreSQL 12+
- Groq API key

### For Frontend
- Node.js 18.17+ (LTS recommended)
- pnpm (recommended) or npm/yarn
- Git 2.0+

## 🚀 Quick Start

### Backend Setup

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the template
   # Windows: copy env_template.txt .env
   # Linux/Mac: cp env_template.txt .env
   
   # Edit .env with your credentials:
   # DATABASE_URL=postgresql://user:password@host:port/database
   # GROQ_API_KEY=your_api_key_here
   ```

4. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE finix_db;
   ```

5. **Start the backend server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at:
   - API: http://localhost:8000
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   # Using pnpm (recommended)
   pnpm install
   
   # OR using npm
   npm install
   
   # OR using yarn
   yarn install
   ```

2. **Set up environment variables (optional):**
   ```bash
   # Copy the example file (if it exists)
   # Windows: Copy-Item .env.example .env.local
   # Linux/Mac: cp .env.example .env.local
   
   # Configure API endpoint if backend is on different port
   # NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   # OR: npm run dev
   # OR: yarn dev
   ```

   The frontend will be available at: http://localhost:3000

## 📁 Project Structure

```
finix/
├── # Backend Files
├── main.py                 # FastAPI entry point
├── models.py              # SQLAlchemy ORM models
├── schemas.py             # Pydantic schemas
├── database.py            # Database connection & session management
├── ai_engine.py           # AI Engine ("Central Brain")
├── requirements.txt       # Python dependencies
├── env_template.txt       # Environment variables template
│
├── # Frontend Files
├── app/                   # Next.js App Router
│   ├── dashboard/        # Dashboard pages
│   │   ├── expenses/     # Expenses page
│   │   ├── fairshare/    # FairShare page
│   │   ├── travel/       # Travel page
│   │   ├── wallet/       # Wallet page
│   │   ├── suggestions/  # Smart Suggestions page
│   │   └── page.tsx      # Dashboard overview
│   ├── landing/          # Landing page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Root page
│   └── globals.css       # Global styles
├── components/           # React components
├── lib/                  # Utility functions
├── public/              # Static assets
├── package.json         # Node.js dependencies
├── next.config.mjs      # Next.js configuration
└── tsconfig.json        # TypeScript configuration
```

## 📋 API Endpoints

### User Management
- `POST /users/` - Create a new user
- `GET /users/{user_id}` - Get user by ID
- `GET /users/` - List all users

### Transactions
- `POST /transactions/` - Create a new transaction
- `GET /transactions/{user_id}` - Get all transactions for a user
  - Query params: `skip`, `limit`, `start_date`, `end_date`, `category`
- `GET /transactions/{user_id}/summary` - Get transaction summary statistics

### Travel Goals
- `POST /travel-goals/` - Create a new travel goal
- `GET /travel-goals/{user_id}` - Get all travel goals for a user
- `GET /travel-goals/{user_id}/{goal_id}` - Get specific travel goal
- `PUT /travel-goals/{user_id}/{goal_id}` - Update travel goal
- `DELETE /travel-goals/{user_id}/{goal_id}` - Delete travel goal

### AI Suggestions (Core Innovation)
- `GET /suggestions/{user_id}` - Get AI-generated personalized savings suggestions

See the [API documentation](http://localhost:8000/docs) for detailed request/response schemas.

## 🤖 AI Engine

The AI Engine (`ai_engine.py`) is the **"Central Brain"** of FINIX:

1. **Data Retrieval**: Fetches user transactions and travel goals from PostgreSQL
2. **Processing (Pandas)**: Analyzes spending patterns, calculates metrics (average spending, non-essential spending, savings shortfall)
3. **LLM Prompting (Groq)**: Generates personalized savings strategies linking current expenses to travel goals
4. **Proactive Insight**: Returns actionable suggestions that accelerate travel timeline

### Fallback Mode

If the Groq API is unavailable or fails, the engine automatically falls back to mock suggestions (useful for Round 1 Demo/MVP without live LLM).

## 🗄️ Database Schema

### Users Table
- `id` (PK)
- `username` (unique)
- `home_currency` (default: USD)
- `created_at`, `updated_at`

### Transactions Table
- `id` (PK)
- `user_id` (FK)
- `amount`
- `category`
- `currency`
- `date`
- `description` (optional)
- `created_at`

### TravelGoals Table
- `id` (PK)
- `user_id` (FK)
- `name`
- `target_amount`
- `current_saved`
- `target_date` (optional)
- `destination` (optional)
- `created_at`, `updated_at`

## 🔧 Configuration

### Backend Environment Variables
```bash
DATABASE_URL=postgresql://user:password@host:port/database
GROQ_API_KEY=your_api_key_here
```

### Frontend Environment Variables (Optional)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Failed:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env` file
- Ensure database exists: `CREATE DATABASE finix_db;`

**AI Suggestions Not Working:**
- Check `GROQ_API_KEY` in `.env` file
- Engine will fallback to mock suggestions if API key is missing
- Check API rate limits and quotas

### Frontend Issues

**Port Already in Use:**
```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000
# macOS/Linux: lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

**Module Not Found:**
```bash
# Clear Next.js cache
rm -rf .next  # or Remove-Item -Recurse -Force .next on Windows
pnpm install
pnpm dev
```

**API Connection Issues:**
- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

## 🚢 Production Deployment

### Backend
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend
```bash
pnpm build
pnpm start
```

**Recommended Settings:**
- Use environment variables for all secrets
- Enable HTTPS in production
- Configure CORS for production domain
- Set up database connection pooling
- Implement authentication/authorization

## 🔒 Security Notes

- Always use environment variables for sensitive data (API keys, database passwords)
- Never commit `.env` files to version control
- Implement authentication/authorization before production deployment
- Use HTTPS in production
- Validate and sanitize all user inputs (handled by Pydantic schemas in backend)

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Groq API Documentation](https://console.groq.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ using FastAPI, Next.js, React, and TypeScript**
