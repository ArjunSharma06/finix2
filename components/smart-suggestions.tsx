"use client"

import { useMemo } from "react"
import { Zap, ArrowRight, Lightbulb, AlertCircle } from "lucide-react"
import { useFinixData } from "@/lib/data-context"
import { SmartSuggestion } from "@/types/suggestions"
import { computeMonthlySummary, generateSuggestions } from "@/lib/suggestion-utils"

export default function SmartSuggestions() {
  const { transactions, travelGoal } = useFinixData()
  
  // Compute monthly averages over 90 days
  const { categoryMonthlyAvg, totalMonthlySpend } = useMemo(() => 
    computeMonthlySummary(transactions || []), 
    [transactions]
  )

  // Generate suggestions based on local data
  const suggestions = useMemo(() => 
    generateSuggestions(categoryMonthlyAvg, travelGoal),
    [categoryMonthlyAvg, travelGoal]
  )

  const totalSavings = suggestions.reduce((sum, s) => sum + s.savings, 0)
  const activeCount = suggestions.length
  const dismissedCount = 0 // We're not tracking dismissals in the overview component
  const implementationProgress = `${activeCount}/${activeCount + dismissedCount}`
  const lastUpdated = new Date().toLocaleTimeString()
  const loading = false

  const getIconComponent = (iconType?: string) => {
    switch (iconType) {
      case "alert":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "bulb":
        return <Lightbulb className="w-4 h-4 text-yellow-500" />
      default:
        return <Zap className="w-4 h-4 text-primary" />
    }
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-foreground">Smart Suggestions</h2>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-primary/10 rounded-lg">
          <h3 className="text-sm font-medium text-primary/80 mb-1">Monthly Savings</h3>
          <p className="text-xl font-bold text-primary">₹{totalSavings.toFixed(2)}</p>
          <p className="text-xs text-primary/70">Annual: ₹{(totalSavings * 12).toFixed(2)}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Active</h3>
          <p className="text-xl font-bold text-gray-700">{activeCount}</p>
          <p className="text-xs text-gray-500">{activeCount} suggestions</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Progress</h3>
          <p className="text-xl font-bold text-gray-700">{implementationProgress}</p>
          <p className="text-xs text-gray-500">Implemented</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Updated</h3>
          <p className="text-xl font-bold text-gray-700">{lastUpdated ? "Just now" : "-"}</p>
          <p className="text-xs text-gray-500">Last refresh</p>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Analyzing your finances...</p>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="p-4 bg-gradient-to-r from-muted/50 to-transparent rounded-lg hover:from-muted hover:shadow-md transition-all duration-200 group cursor-pointer border border-border/50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getIconComponent(suggestion.icon)}
                  </div>
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    {suggestion.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary">₹{suggestion.savings.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">{suggestion.title}</h3>
              <p className="text-xs text-muted-foreground">{suggestion.description}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">Add transactions to get personalized suggestions</p>
          </div>
        )}
      </div>
    </div>
  )
}
