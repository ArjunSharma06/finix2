"use client"

import { Lightbulb, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import { useState, useMemo } from "react"
import { useFinixData } from "@/lib/data-context"

// Client-only suggestions page: no AI, no API calls. Computes simple recommendations from local transactions.

export default function SuggestionsPage() {
  const { transactions, travelGoal } = useFinixData()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [dismissedIds, setDismissedIds] = useState<number[]>([])

  const fmtINR = (v: number) => `₹${v.toFixed(2)}`

  const NON_ESSENTIAL = ["food", "dining", "entertainment", "subscriptions", "shopping", "leisure", "utilities"]

  // Compute simple monthly averages over a 90 day window (approx 3 months)
  const { categoryMonthlyAvg, totalMonthlySpend } = useMemo(() => {
    if (!transactions || transactions.length === 0) return { categoryMonthlyAvg: {}, totalMonthlySpend: 0 }

    const now = new Date()
    const windowStart = new Date(now)
    windowStart.setDate(now.getDate() - 90)

    const sums: Record<string, number> = {}
    let windowSum = 0

    for (const t of transactions) {
      const amt = Number((t as any).amount || 0)
      const cat = ((t as any).category || "uncategorized").toString().toLowerCase()
      const date = new Date((t as any).date || now.toString())
      if (date >= windowStart) {
        sums[cat] = (sums[cat] || 0) + amt
        windowSum += amt
      }
    }

    const categoryMonthlyAvg: Record<string, number> = {}
    for (const k of Object.keys(sums)) {
      categoryMonthlyAvg[k] = sums[k] / 3
    }

    return { categoryMonthlyAvg, totalMonthlySpend: windowSum / 3 }
  }, [transactions])

  // Build local suggestions: 20% reduction on non-essential categories, plus travel allocation suggestion
  const localSuggestions = useMemo(() => {
    const rows: Array<{ title: string; description: string; potential_savings: number; impact: string; category?: string } > = []

    for (const [cat, avg] of Object.entries(categoryMonthlyAvg)) {
      if (NON_ESSENTIAL.includes(cat)) {
        const potential = +(avg * 0.2)
        if (potential > 1) {
          rows.push({
            title: `Reduce ${cat.charAt(0).toUpperCase() + cat.slice(1)} spending by 20%`,
            description: `Trim discretionary spending in ${cat} to save about ${fmtINR(potential)} per month.`,
            potential_savings: Math.round(potential * 100) / 100,
            impact: potential > 300 ? "High" : potential > 100 ? "Medium" : "Low",
            category: cat,
          })
        }
      }
    }

    if (travelGoal) {
      const remaining = Math.max(0, (Number((travelGoal as any).target_amount || 0) - Number((travelGoal as any).current_saved || 0)))
      let months = 6
      if ((travelGoal as any).target_date) {
        const target = new Date((travelGoal as any).target_date)
        const now = new Date()
        const diffMonths = Math.max(1, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)))
        months = diffMonths
      }
      const requiredMonthly = +(remaining / Math.max(1, months))
      if (requiredMonthly > 0) {
        rows.unshift({
          title: `Allocate ${fmtINR(requiredMonthly)}/month toward your ${((travelGoal as any).name) || "travel"} goal`,
          description: `To reach ${fmtINR(remaining)} in ${months} month(s) you'll need to set aside ~${fmtINR(requiredMonthly)} per month. Consider shifting this from discretionary categories.`,
          potential_savings: Math.round(requiredMonthly * 100) / 100,
          impact: "High",
          category: "travel-target",
        })
      }
    }

    return rows
  }, [categoryMonthlyAvg, travelGoal])

  const suggestions = localSuggestions.map((s, idx) => ({ ...s, id: idx + 1, priority: s.impact === "High" ? "high" : s.impact === "Medium" ? "medium" : "low" }))
  const activeSuggestions = suggestions.filter((_, idx) => !dismissedIds.includes(idx + 1))

  const handleDismiss = (id: number) => setDismissedIds((prev) => [...prev, id])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            Smart Suggestions
          </h1>
          <p className="text-muted-foreground">Personalized recommendations computed locally — no backend or AI required.</p>
        </div>
      </div>

      {/* Suggestions List */}
      {activeSuggestions.length > 0 ? (
        <div className="space-y-4">
          {activeSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div onClick={() => setExpandedId(expandedId === suggestion.id ? null : suggestion.id)} className="p-6 cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${suggestion.priority === "high" ? "bg-red-100 text-red-600" : suggestion.priority === "medium" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>
                    {suggestion.priority === "high" ? <AlertCircle className="w-6 h-6" /> : <Lightbulb className="w-6 h-6" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{suggestion.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600">Save {fmtINR(Number(suggestion.potential_savings))}</p>
                        <p className="text-xs text-muted-foreground mt-1">{suggestion.category}</p>
                      </div>
                    </div>
                  </div>

                  <ArrowRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 mt-1 ${expandedId === suggestion.id ? "rotate-90" : ""}`} />
                </div>
              </div>

              {expandedId === suggestion.id && (
                <div className="border-t border-border p-6 bg-muted/30">
                  <h4 className="font-semibold text-foreground mb-3">Details</h4>
                  <p className="text-sm text-foreground mb-4">{suggestion.description}</p>

                  <div className="bg-white rounded-lg p-4 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Potential Monthly Savings:</span>
                      <span className="font-semibold text-emerald-600">{fmtINR(Number(suggestion.potential_savings))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Impact:</span>
                      <span className="font-semibold text-foreground">{suggestion.impact}</span>
                    </div>
                    {suggestion.category && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-semibold text-foreground">{suggestion.category}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-border">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-md transition-all font-medium">Learn More</button>
                    <button onClick={() => handleDismiss(suggestion.id)} className="flex-1 px-4 py-2 bg-white border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium">Dismiss</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground mb-4">No suggestions available right now. Add transactions or set a travel goal to get personalized recommendations.</p>
        </div>
      )}
    </div>
  )
}
