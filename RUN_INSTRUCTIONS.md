# 🚀 FINIX Round 1 Prototype - Quick Start Guide

## Prerequisites Check

Before starting, make sure you have:
- ✅ Python 3.8+ installed
- ✅ Node.js 18+ installed  
- ✅ Groq API Key (optional - app works without it in mock mode)

## Quick Test (Optional)

Run this to verify setup:

```bash
cd C:\Users\yasha\backend
python quick_test.py
```

## Step-by-Step Setup

### 1️⃣ Backend Setup

**Step 1: Open Terminal 1 (Backend)**

```powershell
# Navigate to project
cd C:\Users\yasha\backend

# Create/activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

**Step 2: Create `.env` file**

Create a file named `.env` in `C:\Users\yasha\backend\.env`:

```env
# Skip Database for Round 1 (no PostgreSQL needed)
SKIP_DB_INIT=true

# Groq API Key (optional - will use mock if not set)
GROQ_API_KEY=your_actual_groq_api_key_here

# Server config (optional)
HOST=0.0.0.0
PORT=8000
```

**Step 3: Start Backend Server**

```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Start server
python run.py
```

✅ **Backend should start on:** `http://localhost:8000`
✅ **API Docs available at:** `http://localhost:8000/docs`
✅ **Health check:** `http://localhost:8000/health`

---

### 2️⃣ Frontend Setup

**Step 1: Open Terminal 2 (Frontend)**

```powershell
# Navigate to project (same directory)
cd C:\Users\yasha\backend

# Install dependencies
npm install
# OR if you use pnpm
pnpm install
```

**Step 2: Start Frontend Server**

```powershell
npm run dev
# OR
pnpm dev
```

✅ **Frontend should start on:** `http://localhost:3000`

---

### 3️⃣ Test the Application

1. **Open browser:** http://localhost:3000

2. **Test Wallet Page:**
   - Click "Wallet" in sidebar
   - Set balance (e.g., $5000)
   - Add transaction (Amount: $50, Category: Food, Date: today)

3. **Test Expenses Page:**
   - Click "Expenses" in sidebar
   - Add 2-3 more transactions
   - Verify category breakdown appears

4. **Test Travel Page:**
   - Click "Travel" in sidebar
   - Set goal: Name: "Europe Trip", Target: $5000, Saved: $500
   - Verify progress bar shows 10%

5. **Test Smart Suggestions:**
   - Click "Smart Suggestions" in sidebar
   - Should auto-load AI suggestions (or mock if no API key)
   - Verify suggestions appear with savings amounts

6. **Test Overview:**
   - Click "Overview" (Dashboard)
   - Verify transactions appear in table
   - Verify balance displays

---

## Troubleshooting

### Backend Won't Start

**Port 8000 in use:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <process_id> /F
```

**Module not found:**
```powershell
# Activate venv and reinstall
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Import errors:**
```powershell
# Make sure you're in the backend directory
cd C:\Users\yasha\backend
python quick_test.py
```

### Frontend Won't Start

**Port 3000 in use:**
```powershell
# Use different port
npm run dev -- -p 3001
```

**Module errors:**
```powershell
# Clear and reinstall
Remove-Item -Recurse -Force node_modules, .next
npm install
```

**API connection errors:**
- Make sure backend is running on port 8000
- Check browser console (F12) for errors
- Verify `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000` (optional)

### No Suggestions Showing

1. **Make sure you have:**
   - ✅ Added at least 3-5 transactions
   - ✅ Set a travel goal

2. **Check backend logs:**
   - Look for errors in terminal where backend is running

3. **Try mock mode:**
   - If `GROQ_API_KEY` not set, suggestions will be mock
   - Still functional for demonstration

---

## Quick Verification Checklist

- [ ] Backend starts on port 8000
- [ ] Frontend starts on port 3000  
- [ ] Health endpoint works: http://localhost:8000/health
- [ ] Can set balance on Wallet page
- [ ] Can add transactions
- [ ] Can set travel goal
- [ ] Suggestions page loads
- [ ] Data persists on refresh
- [ ] No console errors (F12)

---

## Expected Demo Flow

1. **Wallet**: Set balance $5000, add 3 transactions
2. **Expenses**: Add 2 more transactions  
3. **Travel**: Set goal "Europe Trip" - $5000 target, $500 saved
4. **Suggestions**: See AI-powered savings recommendations
5. **Overview**: Verify all data appears correctly

---

## API Testing (Optional)

Test backend directly:
- Open: http://localhost:8000/docs
- Try endpoint: `POST /suggestions/calculate`
- Use sample JSON from TESTING_GUIDE.md

---

**Need help?** Check `TESTING_GUIDE.md` for detailed testing instructions.

