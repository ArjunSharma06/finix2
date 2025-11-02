"use client"

import { useState, useMemo, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import TransactionTable from "./transaction-table"
import { Settings, DollarSign } from "lucide-react"
import { useFinixData } from "@/lib/data-context"

export default function MainContent() {
  const { balance, setBalance, transactions, monthlyBudget, setMonthlyBudget } = useFinixData()
  const [showForm, setShowForm] = useState(false)
  const [formBalance, setFormBalance] = useState<string>("")
  const [formBudget, setFormBudget] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  // Fix hydration issue
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate spending from transactions
  const totalSpending = transactions.reduce((sum, tx) => sum + tx.amount, 0)

  // Calculate current month spending (transactions from current month)
  const currentMonthSpending = useMemo(() => {
    if (!mounted) return 0 // Return 0 during SSR to avoid hydration mismatch
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    return transactions
      .filter((tx) => {
        const txDate = new Date(tx.date)
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
      })
      .reduce((sum, tx) => sum + tx.amount, 0)
  }, [transactions, mounted])

  // Calculate previous month spending
  const previousMonthSpending = useMemo(() => {
    if (!mounted) return 0 // Return 0 during SSR to avoid hydration mismatch
    const now = new Date()
    const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
    const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
    
    return transactions
      .filter((tx) => {
        const txDate = new Date(tx.date)
        return txDate.getMonth() === prevMonth && txDate.getFullYear() === prevYear
      })
      .reduce((sum, tx) => sum + tx.amount, 0)
  }, [transactions, mounted])

  // Calculate percentage change
  const percentageChange = previousMonthSpending > 0
    ? (((currentMonthSpending - previousMonthSpending) / previousMonthSpending) * 100).toFixed(1)
    : "0.0"

  // Generate spending data for graph (last 6 months)
  const spendingData = useMemo(() => {
    const months: { month: string; amount: number; budget: number }[] = []
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const month = monthNames[date.getMonth()]
      const monthNum = date.getMonth()
      const year = date.getFullYear()
      
      const monthSpending = transactions
        .filter((tx) => {
          const txDate = new Date(tx.date)
          return txDate.getMonth() === monthNum && txDate.getFullYear() === year
        })
        .reduce((sum, tx) => sum + tx.amount, 0)
      
      months.push({
        month,
        amount: monthSpending,
        budget: monthlyBudget,
      })
    }
    
    return months
  }, [transactions, monthlyBudget])

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (formBalance) {
      setBalance(parseFloat(formBalance) || 0)
    }
    if (formBudget) {
      setMonthlyBudget(parseFloat(formBudget) || 3500)
    }
    setShowForm(false)
    setFormBalance("")
    setFormBudget("")
  }

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Welcome Header with Animation */}
      <div className="space-y-1 animate-fade-in flex items-start justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome back, Sarah!</h1>
          <p className="text-muted-foreground">Here's your financial overview for August</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
        >
          <Settings className="w-4 h-4" />
          Set Budget
        </button>
      </div>

      {/* Budget & Balance Form (Round 1 Prototype) */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Set Your Financial Goals
          </h3>
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Balance ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formBalance}
                  onChange={(e) => setFormBalance(e.target.value)}
                  placeholder={balance.toString()}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Monthly Budget ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formBudget}
                  onChange={(e) => setFormBudget(e.target.value)}
                  placeholder={monthlyBudget.toString()}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-medium"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setFormBalance("")
                  setFormBudget("")
                }}
                className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
          {balance > 0 && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Current Balance: <span className="font-semibold text-foreground">${balance.toLocaleString()}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Current Month Spending */}
        <div className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">This Month</p>
          <p className="text-2xl font-bold text-foreground">${currentMonthSpending.toLocaleString()}</p>
          <p className={`text-xs mt-2 ${parseFloat(percentageChange) > 0 ? "text-red-500" : "text-green-500"} font-medium`}>
            {parseFloat(percentageChange) > 0 ? "+" : ""}
            {percentageChange}% from last month
          </p>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Budget</p>
          <p className="text-2xl font-bold text-foreground">${monthlyBudget.toLocaleString()}</p>
          <p className={`text-xs mt-2 ${(monthlyBudget - currentMonthSpending) >= 0 ? "text-green-600" : "text-red-500"} font-medium`}>
            ${Math.abs(monthlyBudget - currentMonthSpending).toLocaleString()} {monthlyBudget - currentMonthSpending >= 0 ? "remaining" : "over budget"}
          </p>
        </div>

        {/* Total Spending */}
        <div className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Total Spending</p>
          <p className="text-2xl font-bold text-foreground">
            ${totalSpending.toLocaleString()}
          </p>
          <p className="text-xs mt-2 text-muted-foreground font-medium">{transactions.length} transactions</p>
        </div>
      </div>

      {/* Spending Overview Chart */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Spending Trends</h2>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded-md font-medium transition-all hover:opacity-90">
              3M
            </button>
            <button className="text-xs px-3 py-1 bg-muted text-foreground rounded-md font-medium hover:bg-muted/80 transition-all">
              1Y
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={spendingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(69, 159, 121)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="rgb(69, 159, 121)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(200, 150, 100)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="rgb(200, 150, 100)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(240, 240, 240)" />
            <XAxis dataKey="month" stroke="rgb(140, 140, 140)" style={{ fontSize: "12px" }} />
            <YAxis stroke="rgb(140, 140, 140)" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid rgb(220, 220, 220)",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="rgb(69, 159, 121)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSpend)"
              name="Spending"
            />
            <Area
              type="monotone"
              dataKey="budget"
              stroke="rgb(200, 150, 100)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={0.1}
              fill="url(#colorBudget)"
              name="Budget"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <TransactionTable />
    </div>
  )
}
