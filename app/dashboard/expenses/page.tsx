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
  { month: "Jan", groceries: 280, transport: 150, entertainment: 95, utilities: 120 },
  { month: "Feb", groceries: 320, transport: 160, entertainment: 110, utilities: 125 },
  { month: "Mar", groceries: 290, transport: 145, entertainment: 100, utilities: 120 },
  { month: "Apr", groceries: 350, transport: 170, entertainment: 130, utilities: 135 },
  { month: "May", groceries: 310, transport: 155, entertainment: 115, utilities: 128 },
  { month: "Jun", groceries: 340, transport: 165, entertainment: 120, utilities: 130 },
]

const categoryData = [
  { name: "Groceries", value: 1890, percentage: 32 },
  { name: "Transport", value: 945, percentage: 16 },
  { name: "Entertainment", value: 670, percentage: 11 },
  { name: "Utilities", value: 738, percentage: 13 },
  { name: "Dining", value: 825, percentage: 14 },
  { name: "Others", value: 882, percentage: 14 },
]

const recentExpenses = [
  { id: 1, category: "Groceries", amount: -85, date: "Nov 2, 2024", vendor: "Whole Foods", icon: "🛒" },
  { id: 2, category: "Transport", amount: -45, date: "Nov 1, 2024", vendor: "Uber", icon: "🚗" },
  { id: 3, category: "Dining", amount: -62, date: "Oct 31, 2024", vendor: "Restaurant XYZ", icon: "🍽️" },
  { id: 4, category: "Entertainment", amount: -25, date: "Oct 30, 2024", vendor: "Netflix", icon: "🎬" },
  { id: 5, category: "Utilities", amount: -120, date: "Oct 28, 2024", vendor: "Electric Bill", icon: "⚡" },
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
          <p className="text-3xl font-bold text-foreground">${totalExpenses.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-2">+12% from last period</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <p className="text-muted-foreground text-sm mb-2">Average Monthly</p>
          <p className="text-3xl font-bold text-foreground">
            ${avgMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
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
              <Tooltip formatter={(value) => `$${value}`} />
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
                <p className="font-semibold text-red-600">${Math.abs(expense.amount)}</p>
                <p className="text-sm text-muted-foreground">{expense.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
