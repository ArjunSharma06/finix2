"use client"

import { useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingDown, Plus, Minus, ChevronLeft, Menu } from "lucide-react"
import { useFinixData } from "@/lib/data-context"

const COLORS = ["#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#8b5cf6", "#ec4899"]

export default function ExpensesPage() {
  const { transactions, addTransaction, removeTransaction } = useFinixData()
  const [timeRange, setTimeRange] = useState("6m")
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [transactionForm, setTransactionForm] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  })

  // Filter transactions based on selected time range
  const getFilteredTransactions = useMemo(() => {
    const now = new Date()
    const monthsToSubtract = timeRange === "1m" ? 1 : 
                            timeRange === "3m" ? 3 : 
                            timeRange === "6m" ? 6 : 
                            timeRange === "1y" ? 12 : 0
    
    const startDate = new Date(now)
    if (monthsToSubtract > 0) {
      startDate.setMonth(now.getMonth() - monthsToSubtract)
    }
    
    return transactions.filter(tx => {
      if (timeRange === "all") return true
      const txDate = new Date(tx.date)
      return txDate >= startDate && txDate <= now
    })
  }, [transactions, timeRange])

  // Calculate expenses from filtered transactions
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {}
    getFilteredTransactions.forEach((tx) => {
      categories[tx.category] = (categories[tx.category] || 0) + tx.amount
    })

    const total = Object.values(categories).reduce((sum, val) => sum + val, 0)
    
    // Sort by value (amount) in descending order
    return Object.entries(categories)
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value) // Sort by highest expense first
  }, [getFilteredTransactions])

  const totalExpenses = useMemo(() => categoryData.reduce((sum, cat) => sum + cat.value, 0), [categoryData])
  const avgAmount = useMemo(() => getFilteredTransactions.length > 0 ? 
    totalExpenses / getFilteredTransactions.length : 0, [totalExpenses, getFilteredTransactions])

  const recentExpenses = useMemo(() => {
    return getFilteredTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
      .slice(0, 5)
      .map((tx) => ({
        id: tx.id!,
        category: tx.category,
        amount: -tx.amount,
        date: new Date(tx.date).toLocaleDateString(),
        vendor: tx.description || tx.category,
        icon: "💰",
      }))
  }, [transactions])

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(transactionForm.amount)
    if (isNaN(amount) || amount <= 0 || !transactionForm.category) {
      return
    }

    addTransaction({
      amount: amount,
      category: transactionForm.category,
      date: transactionForm.date,
      description: transactionForm.description || undefined,
      currency: "INR",
    })

    setTransactionForm({
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    })
    setShowTransactionForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <button
          onClick={() => {
            const event = new CustomEvent('toggle-sidebar', { detail: {} });
            window.dispatchEvent(event);
          }}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              Expenses Analysis
            </h1>
            <p className="text-muted-foreground mt-2">Track and analyze your spending patterns</p>
          </div>
          {/* Top-right space intentionally left empty */}
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 items-center">
          {["1m", "3m", "6m", "1y", "all"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                timeRange === range
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white text-slate-900 border border-slate-200 hover:shadow-md"
              }`}
            >
              {range === "1m" ? "1M" : range === "3m" ? "3M" : range === "6m" ? "6M" : range === "1y" ? "1Y" : "All"}
            </button>
          ))}
          <button
            onClick={() => setShowTransactionForm(!showTransactionForm)}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg text-white rounded-lg transition-all font-medium"
          >
            {showTransactionForm ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showTransactionForm ? "Cancel" : "Add Expense"}
          </button>
        </div>
      </div>

      {/* Add Transaction Form */}
      {showTransactionForm && (
        <div className="bg-white rounded-2xl p-6 border border-border mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Add New Expense</h3>
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                  placeholder="0.00"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  value={transactionForm.category}
                  onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                  placeholder="e.g., Food, Transport, Entertainment"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={transactionForm.date}
                  onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                  placeholder="e.g., Restaurant meal"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Add Expense
            </button>
          </form>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <p className="text-muted-foreground text-sm mb-2">Total Expenses</p>
          <p className="text-3xl font-bold text-foreground">₹{totalExpenses.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">{getFilteredTransactions.length} transactions</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <p className="text-muted-foreground text-sm mb-2">Average Amount</p>
          <p className="text-3xl font-bold text-foreground">
            ₹{avgAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Per transaction</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <p className="text-muted-foreground text-sm mb-2">Highest Category</p>
          <p className="text-3xl font-bold text-foreground">
            {categoryData.length > 0 ? categoryData[0].name : "N/A"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {categoryData.length > 0 ? `${categoryData[0].percentage}% of total` : "No data"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <p className="text-muted-foreground text-sm mb-2">Categories</p>
          <p className="text-3xl font-bold text-emerald-600">{categoryData.length}</p>
          <p className="text-xs text-muted-foreground mt-2">Active categories</p>
        </div>
      </div>

      {/* Charts Section */}
      {categoryData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Category Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category List */}
          <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Categories</h2>
            <div className="space-y-3">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">₹{cat.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{cat.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {categoryData.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-border text-center mb-8">
          <p className="text-muted-foreground">No expense data yet. Add some expenses to see visualizations.</p>
        </div>
      )}

      {/* Recent Expenses */}
      <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Expenses</h2>
        {recentExpenses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No expenses yet. Add some expenses to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{expense.icon}</span>
                  <div>
                    <p className="font-medium text-foreground">{expense.vendor}</p>
                    <p className="text-sm text-muted-foreground">{expense.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-red-600">₹{Math.abs(expense.amount).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{expense.category}</p>
                  </div>
                  <button
                    onClick={() => removeTransaction(expense.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                    title="Remove expense"
                  >
                    <Minus className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
