# API Integration Guide for Frontend

This guide helps you connect your frontend at [https://finix9.vercel.app](https://finix9.vercel.app) to the backend API.

## Backend API Base URL

**Development**: `http://localhost:8000`
**Production**: (Update when deployed)

---

## Quick Start

### 1. Update Frontend API Configuration

Set your API base URL:

```javascript
// In your frontend API config
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

For Vercel deployment, add environment variable:
```
NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app
```

### 2. CORS Configuration

✅ **Updated**: Backend now allows requests from `https://finix9.vercel.app`

---

## API Endpoints Reference

### Base URL: `http://localhost:8000` (or your production URL)

### 1. Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "service": "FINIX API",
  "database": "connected|skipped|disconnected",
  "version": "1.0.0"
}
```

---

### 2. User Management

#### Create User
```
POST /users/
Content-Type: application/json

{
  "username": "sarah",
  "home_currency": "USD"
}
```

#### Get User
```
GET /users/{user_id}
```

#### List Users
```
GET /users/?skip=0&limit=100
```

---

### 3. Transactions

#### Create Transaction
```
POST /transactions/
Content-Type: application/json

{
  "user_id": 1,
  "amount": 45.50,
  "category": "Dining",
  "currency": "USD",
  "date": "2024-08-14",
  "description": "Starbucks"
}
```

#### Get Transactions
```
GET /transactions/{user_id}?skip=0&limit=20&start_date=2024-08-01&end_date=2024-08-31&category=Dining
```

**Query Parameters:**
- `skip` - Pagination offset (default: 0)
- `limit` - Results per page (default: 100)
- `start_date` - Filter from date (YYYY-MM-DD)
- `end_date` - Filter to date (YYYY-MM-DD)
- `category` - Filter by category name

#### Get Transaction Summary
```
GET /transactions/{user_id}/summary
```

**Response:**
```json
{
  "total_transactions": 43,
  "total_amount": 3560.00,
  "average_amount": 82.79,
  "categories": {
    "Housing": 1200.00,
    "Dining": 640.80,
    "Utilities": 313.32,
    "Entertainment": 78.98,
    "Transportation": 76.80,
    "Shopping": 389.98
  }
}
```

---

### 4. Travel Goals

#### Create Travel Goal
```
POST /travel-goals/
Content-Type: application/json

{
  "user_id": 1,
  "name": "Trip to Japan",
  "target_amount": 5000.00,
  "current_saved": 1500.00,
  "target_date": "2025-06-01",
  "destination": "Tokyo, Japan"
}
```

#### Get All Travel Goals
```
GET /travel-goals/{user_id}
```

#### Get Specific Travel Goal
```
GET /travel-goals/{user_id}/{goal_id}
```

#### Update Travel Goal
```
PUT /travel-goals/{user_id}/{goal_id}
Content-Type: application/json

{
  "current_saved": 2000.00,
  "target_amount": 5500.00
}
```

#### Delete Travel Goal
```
DELETE /travel-goals/{user_id}/{goal_id}
```

---

### 5. Smart Suggestions (AI-Powered)

#### Get AI Suggestions
```
GET /suggestions/{user_id}
```

**Response:**
```json
{
  "user_id": 1,
  "travel_goal_name": "Trip to Japan",
  "target_amount": 5000.00,
  "current_saved": 1500.00,
  "remaining_amount": 3500.00,
  "average_monthly_spending": 2500.00,
  "non_essential_spending": 800.00,
  "months_to_goal_current": 14.0,
  "months_to_goal_optimized": 9.5,
  "suggestions": [
    {
      "title": "Reduce Dining Spending",
      "description": "Based on your spending patterns, reducing dining expenses by 30% could save you $192.24 per month...",
      "potential_savings": 192.24,
      "impact": "Saves approximately 4.5 months toward your trip",
      "category": "Dining"
    }
  ],
  "generated_at": "2024-08-15T10:30:00Z"
}
```

---

## Frontend Integration Examples

### React/Next.js Example

```typescript
// api/client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = {
  // Transactions
  async getTransactions(userId: number, params?: {
    skip?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
    category?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const url = `${API_BASE}/transactions/${userId}${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await fetch(url);
    return response.json();
  },

  // Summary
  async getTransactionSummary(userId: number) {
    const response = await fetch(`${API_BASE}/transactions/${userId}/summary`);
    return response.json();
  },

  // Smart Suggestions
  async getSuggestions(userId: number) {
    const response = await fetch(`${API_BASE}/suggestions/${userId}`);
    return response.json();
  },

  // Travel Goals
  async getTravelGoals(userId: number) {
    const response = await fetch(`${API_BASE}/travel-goals/${userId}`);
    return response.json();
  },
};
```

### Dashboard Component Example

```typescript
// components/Dashboard.tsx
import { useEffect, useState } from 'react';
import { apiClient } from '@/api/client';

export default function Dashboard({ userId }: { userId: number }) {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    // Fetch summary
    apiClient.getTransactionSummary(userId).then(setSummary);

    // Fetch recent transactions
    apiClient.getTransactions(userId, { limit: 20 }).then(setTransactions);

    // Fetch AI suggestions
    apiClient.getSuggestions(userId).then(setSuggestions);
  }, [userId]);

  // Render dashboard...
}
```

---

## Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "detail": "Error message here"
}
```

---

## Category Names

Use these standard category names (case-sensitive):
- `Housing`
- `Groceries`
- `Dining`
- `Entertainment`
- `Utilities`
- `Transportation`
- `Shopping`
- `Travel`
- `Mobile`
- `Healthcare`
- `Bills`
- `Insurance`

---

## Date Format

All dates should be in **ISO 8601 format**: `YYYY-MM-DD`

Example: `2024-08-14`

---

## Testing with curl

```bash
# Health check
curl http://localhost:8000/health

# Get transactions summary
curl http://localhost:8000/transactions/1/summary

# Create transaction
curl -X POST http://localhost:8000/transactions/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "amount": 45.50,
    "category": "Dining",
    "currency": "USD",
    "date": "2024-08-14",
    "description": "Starbucks"
  }'

# Get AI suggestions
curl http://localhost:8000/suggestions/1
```

---

## Next Steps

1. ✅ CORS updated for Vercel
2. ⚠️ Set up authentication (if needed)
3. ⚠️ Deploy backend to production (Railway, Render, etc.)
4. ✅ Test API integration with frontend
5. ⚠️ Add budget management endpoints (if needed)

