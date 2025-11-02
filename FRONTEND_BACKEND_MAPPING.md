# Frontend-Backend Integration Mapping

## Frontend URL
**Production**: [https://finix9.vercel.app](https://finix9.vercel.app)

## Frontend Sections → Backend API Mapping

### ✅ 1. Overview (Dashboard) Section
**Frontend Location**: `/dashboard`

**Backend Endpoints Required**:
- ✅ `GET /transactions/{user_id}/summary` - Financial overview, spending totals
- ✅ `GET /transactions/{user_id}?limit=20` - Recent transactions table
- ✅ `GET /transactions/{user_id}?start_date={date}&end_date={date}` - Spending trends (3M, 1Y)
- ✅ `GET /suggestions/{user_id}` - Smart Suggestions sidebar
- ⚠️ **Budget feature** - Not yet implemented (frontend shows budget, but no backend endpoint)

**Data Needed**:
- This Month Spending: `transactions/{user_id}/summary` (filter by current month)
- Budget: *Not in backend yet* - Frontend may be using mock data
- Year to Date: `transactions/{user_id}?start_date=YYYY-01-01`
- Spending by Category: `transactions/{user_id}/summary` (includes categories object)
- Remaining Budget: *Not in backend yet*

---

### ✅ 2. Expenses Section
**Frontend Location**: `/expenses` (likely)

**Backend Endpoints**:
- ✅ `GET /transactions/{user_id}` - View all transactions
  - Query params: `skip`, `limit`, `start_date`, `end_date`, `category`
- ✅ `POST /transactions/` - Create new transaction
- ✅ `GET /transactions/{user_id}/summary` - Summary statistics

**Status**: ✅ **Fully Supported**

---

### ✅ 3. Travel Section
**Frontend Location**: `/travel` (likely)

**Backend Endpoints**:
- ✅ `GET /travel-goals/{user_id}` - List all travel goals
- ✅ `POST /travel-goals/` - Create new travel goal
- ✅ `GET /travel-goals/{user_id}/{goal_id}` - Get specific goal
- ✅ `PUT /travel-goals/{user_id}/{goal_id}` - Update goal (e.g., update `current_saved`)
- ✅ `DELETE /travel-goals/{user_id}/{goal_id}` - Delete goal
- ✅ `GET /suggestions/{user_id}` - AI suggestions linked to travel goals

**Status**: ✅ **Fully Supported**

---

### ✅ 4. Smart Suggestions Section
**Frontend Location**: `/suggestions` or shown on dashboard

**Backend Endpoints**:
- ✅ `GET /suggestions/{user_id}` - Get AI-powered savings suggestions

**Response Includes**:
- Personalized suggestions (title, description, potential savings, impact)
- Spending analysis (average monthly spending, non-essential spending)
- Timeline projections (months to goal)
- Category-based recommendations

**Status**: ✅ **Fully Supported** (uses Groq API)

---

### ⚠️ 5. Wallet Section
**Frontend Location**: `/wallet` (likely)

**Backend Endpoints Needed**:
- ❌ Wallet balance - *Not implemented*
- ❌ Payment methods - *Not implemented*
- ❌ Account linking - *Not implemented*
- ❌ Multiple wallets/accounts - *Not implemented*

**Status**: ⚠️ **Not Yet Implemented**

**Potential Implementation**:
```python
# Suggested endpoints:
POST /wallets/ - Create wallet/account
GET /wallets/{user_id} - List user wallets
GET /wallets/{user_id}/{wallet_id} - Get wallet details
PUT /wallets/{user_id}/{wallet_id} - Update wallet
DELETE /wallets/{user_id}/{wallet_id} - Delete wallet
GET /wallets/{user_id}/{wallet_id}/balance - Get current balance
```

---

### ⚠️ 6. FairShare Section
**Frontend Location**: `/fairshare` (likely)

**Backend Endpoints Needed**:
- ❌ Group expense splitting - *Not implemented*
- ❌ Shared budgets - *Not implemented*
- ❌ Multi-user transactions - *Not implemented*
- ❌ Split bills - *Not implemented*

**Status**: ⚠️ **Not Yet Implemented**

**Potential Implementation**:
```python
# Suggested endpoints:
POST /groups/ - Create expense group
GET /groups/{user_id} - List user's groups
POST /groups/{group_id}/expenses/ - Add shared expense
POST /groups/{group_id}/expenses/{expense_id}/split - Split expense
GET /groups/{group_id}/balances - Get group balances
```

---

## CORS Configuration

✅ **Already Configured** in `main.py`:
```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "https://finix9.vercel.app",  # ✅ Production frontend
    "https://*.vercel.app",        # ✅ All Vercel previews
]
```

---

## Current Backend API Status

### ✅ Fully Supported Sections:
1. **Overview/Dashboard** - 90% (missing budget endpoints)
2. **Expenses** - 100% ✅
3. **Travel** - 100% ✅
4. **Smart Suggestions** - 100% ✅

### ⚠️ Partially Supported:
1. **Overview** - Budget feature missing

### ❌ Not Supported:
1. **Wallet** - Complete feature missing
2. **FairShare** - Complete feature missing

---

## Frontend Data Flow Examples

### Dashboard Overview:
```javascript
// 1. Get user ID (from auth/session)
const userId = getCurrentUserId();

// 2. Get monthly summary
const summary = await fetch(
  `https://your-backend-api.com/transactions/${userId}/summary`
);

// 3. Get recent transactions
const transactions = await fetch(
  `https://your-backend-api.com/transactions/${userId}?limit=20`
);

// 4. Get smart suggestions
const suggestions = await fetch(
  `https://your-backend-api.com/suggestions/${userId}`
);
```

### Expenses Section:
```javascript
// Get filtered transactions
const filtered = await fetch(
  `https://your-backend-api.com/transactions/${userId}?category=Dining&start_date=2024-08-01&end_date=2024-08-31`
);

// Create transaction
await fetch(`https://your-backend-api.com/transactions/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: userId,
    amount: 45.50,
    category: "Dining",
    currency: "USD",
    date: "2024-08-14",
    description: "Starbucks"
  })
});
```

### Travel Section:
```javascript
// Get all travel goals
const goals = await fetch(
  `https://your-backend-api.com/travel-goals/${userId}`
);

// Update savings progress
await fetch(
  `https://your-backend-api.com/travel-goals/${userId}/${goalId}`,
  {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      current_saved: 1500.00
    })
  }
);
```

---

## Next Steps for Full Integration

### Priority 1: Budget Management (for Overview section)
- Add `Budget` model and endpoints
- Track monthly/yearly budgets
- Calculate remaining budget

### Priority 2: Wallet Section
- Design wallet/account data model
- Implement CRUD endpoints
- Link transactions to wallets

### Priority 3: FairShare Section
- Design group/expense-splitting model
- Implement multi-user expense sharing
- Add balance settlement logic

---

## Testing Integration

1. **Test from Vercel Frontend**:
   ```bash
   # Update frontend API URL to your backend
   # Test each section:
   # - Overview: Check dashboard loads
   # - Expenses: Create/view transactions
   # - Travel: Create/view goals
   # - Smart Suggestions: Verify AI suggestions appear
   ```

2. **Check Browser Console**:
   - Look for CORS errors
   - Check API response formats
   - Verify authentication (if implemented)

---

**Last Updated**: Based on frontend analysis at [https://finix9.vercel.app/dashboard](https://finix9.vercel.app/dashboard)
