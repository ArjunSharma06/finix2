export interface Transaction {
  id: string
  description: string
  date: string
  category: string
  amount: number
  icon: any
  type: "debit" | "credit"
  status: "completed" | "pending"
}

export interface Account {
  id: string
  name: string
  balance: number
  type: "checking" | "savings"
  lastUpdated: string
}

export interface FinancialMetrics {
  totalSpent: number
  budget: number
  remaining: number
  percentageSpent: number
  monthlyAverage: number
}

// Mock user data - in production, this would come from an API
export const userAccounts: Account[] = [
  {
    id: "1",
    name: "Main Checking",
    balance: 3245.5,
    type: "checking",
    lastUpdated: "2024-08-15",
  },
  {
    id: "2",
    name: "Savings Account",
    balance: 12500.0,
    type: "savings",
    lastUpdated: "2024-08-15",
  },
]

export const financialMetrics: FinancialMetrics = {
  totalSpent: 4120,
  budget: 5500,
  remaining: 1380,
  percentageSpent: 74.9,
  monthlyAverage: 3505,
}

export const monthlyData = [
  { month: "Jan", amount: 2850, budget: 3500 },
  { month: "Feb", amount: 3120, budget: 3500 },
  { month: "Mar", amount: 2650, budget: 3500 },
  { month: "Apr", amount: 3890, budget: 3500 },
  { month: "May", amount: 3420, budget: 3500 },
  { month: "Jun", amount: 3740, budget: 3500 },
  { month: "Jul", amount: 3560, budget: 3500 },
  { month: "Aug", amount: 4120, budget: 3500 },
]
