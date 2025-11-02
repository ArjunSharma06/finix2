"use client"

import { useMemo, useState, useEffect } from "react"
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts"
import SmartSuggestions from "./smart-suggestions"
import { TrendingDown, Target } from "lucide-react"
import { useFinixData } from "@/lib/data-context"

const COLORS = [
  "rgb(69, 159, 121)", // Primary Green
  "rgb(52, 168, 148)", // Teal
  "rgb(34, 197, 194)", // Cyan/Teal
  "rgb(59, 130, 246)", // Blue
  "rgb(14, 165, 233)", // Sky Blue
  "rgb(168, 85, 247)", // Purple accent
]

export default function RightSidebar() {
  const { transactions, travelGoal, monthlyBudget } = useFinixData()
  const [mounted, setMounted] = useState(false)

  // Fix hydration issue
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate current month spending
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

  const totalSpent = currentMonthSpending
  const budgetRemaining = Math.max(0, monthlyBudget - currentMonthSpending)

  // Calculate category breakdown
  const categoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {}
    transactions.forEach((tx) => {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount
    })

    const total = Object.values(categoryMap).reduce((sum, val) => sum + val, 0)
    if (total === 0) return []

    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value: Math.round((value / total) * 100),
        amount: value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [transactions])

  return (
    <div className="w-80 overflow-auto p-6 space-y-6">
      {/* Budget Status Card */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20 p-6 space-y-4 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Remaining Budget</p>
            <p className="text-3xl font-bold text-foreground">${budgetRemaining.toLocaleString()}</p>
          </div>
          <Target className="w-10 h-10 text-primary/40" />
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${Math.min((totalSpent / monthlyBudget) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          ${totalSpent.toLocaleString()} of ${monthlyBudget.toLocaleString()} spent
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4 hover:shadow-md transition-all duration-300">
        <h2 className="text-lg font-semibold text-foreground">Spending by Category</h2>
        {categoryData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={800}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                  formatter={(value) => <span className="text-xs text-foreground font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Category List */}
            <div className="space-y-2 border-t border-border pt-4">
              {categoryData.map((category, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-sm text-foreground font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-foreground">{category.value}%</span>
                    <p className="text-xs text-muted-foreground">${category.amount.toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No spending data yet</p>
            <p className="text-xs mt-1">Add transactions to see category breakdown</p>
          </div>
        )}
      </div>

      {/* Smart Suggestions */}
      <SmartSuggestions />

      {/* Monthly Goal Card */}
      <div className="bg-white rounded-xl border border-border p-5 space-y-3 hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-foreground">Monthly Goal</h3>
        </div>
        <p className="text-sm text-muted-foreground">You're tracking well! Keep up the good spending habits.</p>
        <div className="flex gap-2 pt-2">
          <button className="flex-1 text-xs py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
            Adjust Goal
          </button>
        </div>
      </div>
    </div>
  )
}
