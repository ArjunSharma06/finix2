"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import TransactionTable from "./transaction-table"

const spendingData = [
  { month: "Jan", amount: 28500, budget: 35000 },
  { month: "Feb", amount: 31200, budget: 35000 },
  { month: "Mar", amount: 26500, budget: 35000 },
  { month: "Apr", amount: 38900, budget: 35000 },
  { month: "May", amount: 34200, budget: 35000 },
  { month: "Jun", amount: 37400, budget: 35000 },
  { month: "Jul", amount: 41200, budget: 35000 },
  { month: "Aug", amount: 35600, budget: 35000 },
]

export default function MainContent() {
  const currentMonth = spendingData[spendingData.length - 1]
  const previousMonth = spendingData[spendingData.length - 2]
  const percentageChange = (((currentMonth.amount - previousMonth.amount) / previousMonth.amount) * 100).toFixed(1)

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Welcome Header with Animation */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome back, Sarah!</h1>
        <p className="text-muted-foreground">Here's your financial overview for August</p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Current Month Spending */}
        <div className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">This Month</p>
          <p className="text-2xl font-bold text-foreground">₹{currentMonth.amount.toLocaleString("en-IN")}</p>
          <p className={`text-xs mt-2 ${percentageChange > 0 ? "text-red-500" : "text-green-500"} font-medium`}>
            {percentageChange > 0 ? "+" : ""}
            {percentageChange}% from last month
          </p>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Budget</p>
          <p className="text-2xl font-bold text-foreground">₹{currentMonth.budget.toLocaleString("en-IN")}</p>
          <p className="text-xs mt-2 text-green-600 font-medium">
            ₹{(currentMonth.budget - currentMonth.amount).toLocaleString("en-IN")} remaining
          </p>
        </div>

        {/* Year Total */}
        <div className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Year to Date</p>
          <p className="text-2xl font-bold text-foreground">
            ₹{spendingData.reduce((sum, d) => sum + d.amount, 0).toLocaleString("en-IN")}
          </p>
          <p className="text-xs mt-2 text-muted-foreground font-medium">8 months tracked</p>
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
              formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
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
