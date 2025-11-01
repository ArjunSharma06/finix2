"use client"

import { useState } from "react"
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
import { TrendingDown, Filter, Download } from "lucide-react"

const expensesData = [
  { month: "Jan", groceries: 2800, transport: 1500, entertainment: 950, utilities: 1200 },
  { month: "Feb", groceries: 3200, transport: 1600, entertainment: 1100, utilities: 1250 },
  { month: "Mar", groceries: 2900, transport: 1450, entertainment: 1000, utilities: 1200 },
  { month: "Apr", groceries: 3500, transport: 1700, entertainment: 1300, utilities: 1350 },
  { month: "May", groceries: 3100, transport: 1550, entertainment: 1150, utilities: 1280 },
  { month: "Jun", groceries: 3400, transport: 1650, entertainment: 1200, utilities: 1300 },
]

const categoryData = [
  { name: "Groceries", value: 18900, percentage: 32 },
  { name: "Transport", value: 9450, percentage: 16 },
  { name: "Entertainment", value: 6700, percentage: 11 },
  { name: "Utilities", value: 7380, percentage: 13 },
  { name: "Dining", value: 8250, percentage: 14 },
  { name: "Others", value: 8820, percentage: 14 },
]

const recentExpenses = [
  { id: 1, category: "Groceries", amount: -850, date: "Nov 2, 2024", vendor: "BigBasket", icon: "🛒" },
  { id: 2, category: "Transport", amount: -450, date: "Nov 1, 2024", vendor: "Uber", icon: "🚗" },
  { id: 3, category: "Dining", amount: -620, date: "Oct 31, 2024", vendor: "Restaurant XYZ", icon: "🍽️" },
  { id: 4, category: "Entertainment", amount: -250, date: "Oct 30, 2024", vendor: "Netflix", icon: "🎬" },
  { id: 5, category: "Utilities", amount: -1200, date: "Oct 28, 2024", vendor: "Electric Bill", icon: "⚡" },
]

const COLORS = ["#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#8b5cf6", "#ec4899"]

export default function ExpensesPage() {
  const [timeRange, setTimeRange] = useState("6m")
  const totalExpenses = categoryData.reduce((sum, cat) => sum + cat.value, 0)
  const avgMonthly = totalExpenses / 6

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              Expenses Analysis
            </h1>
            <p className="text-muted-foreground mt-2">Track and analyze your spending patterns</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-border hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-border hover:bg-muted transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {["1m", "3m", "6m", "1y", "all"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                timeRange === range
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                  : "bg-white text-foreground hover:bg-muted"
              }`}
            >
              {range === "1m" ? "1M" : range === "3m" ? "3M" : range === "6m" ? "6M" : range === "1y" ? "1Y" : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <p className="text-muted-foreground text-sm mb-2">Total Expenses</p>
          <p className="text-3xl font-bold text-foreground">₹{totalExpenses.toLocaleString("en-IN")}</p>
          <p className="text-xs text-emerald-600 mt-2">+12% from last period</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <p className="text-muted-foreground text-sm mb-2">Average Monthly</p>
          <p className="text-3xl font-bold text-foreground">
            ₹{avgMonthly.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Based on 6 months</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <p className="text-muted-foreground text-sm mb-2">Highest Category</p>
          <p className="text-3xl font-bold text-foreground">Groceries</p>
          <p className="text-xs text-muted-foreground mt-2">32% of total spending</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <p className="text-muted-foreground text-sm mb-2">Budget Status</p>
          <p className="text-3xl font-bold text-emerald-600">On Track</p>
          <p className="text-xs text-muted-foreground mt-2">89% of monthly budget</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Stacked Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Monthly Spending Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expensesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
              />
              <Legend />
              <Bar dataKey="groceries" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="transport" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="entertainment" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              <Bar dataKey="utilities" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Expenses</h2>
        <div className="space-y-3">
          {recentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{expense.icon}</span>
                <div>
                  <p className="font-medium text-foreground">{expense.vendor}</p>
                  <p className="text-sm text-muted-foreground">{expense.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600">₹{Math.abs(expense.amount).toLocaleString("en-IN")}</p>
                <p className="text-sm text-muted-foreground">{expense.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
