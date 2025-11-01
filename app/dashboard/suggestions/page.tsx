"use client"

import { Lightbulb, TrendingDown, PiggyBank, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import { useState } from "react"

const suggestions = [
  {
    id: 1,
    title: "Reduce Subscription Spending",
    description: "You're paying for 7 subscriptions. Consider keeping only the ones you use.",
    savings: 45.99,
    priority: "high",
    category: "Subscriptions",
    tips: ["Netflix - $15.99/month (consider downgrade)", "Apple Music - $10.99/month", "Cloud Storage - $9.99/month"],
  },
  {
    id: 2,
    title: "Optimize Dining Budget",
    description: "Your dining expenses have increased 35% this month. Try meal planning.",
    savings: 150.0,
    priority: "high",
    category: "Dining",
    tips: [
      "Cook at home 2-3 times per week",
      "Use grocery delivery services for bulk items",
      "Plan meals ahead to reduce impulse spending",
    ],
  },
  {
    id: 3,
    title: "Savings Goal Progress",
    description: "You're 40% towards your $5,000 emergency fund goal. Keep going!",
    savings: 2000,
    priority: "medium",
    category: "Savings",
    tips: ["Automate $300/month transfer to savings", "Redirect subscription savings here", "Set milestone rewards"],
  },
  {
    id: 4,
    title: "Switch to Lower Rates",
    description: "Your car insurance rate can be reduced by switching providers.",
    savings: 28.5,
    priority: "medium",
    category: "Insurance",
    tips: [
      "Compare rates on Geico, State Farm, Progressive",
      "Bundle home + auto for discounts",
      "Increase deductible if comfortable",
    ],
  },
  {
    id: 5,
    title: "Automate Your Finances",
    description: "Set up automatic bill payments and transfers for 5% extra savings.",
    savings: 75.0,
    priority: "low",
    category: "Automation",
    tips: [
      "Automate bill payments before due dates",
      "Set recurring transfers to savings",
      "Use round-up features on purchases",
    ],
  },
  {
    id: 6,
    title: "Track Discretionary Spending",
    description: "Detailed tracking reveals you can save ~$120/month on entertainment.",
    savings: 120.0,
    priority: "low",
    category: "Entertainment",
    tips: [
      "Use FINIX to categorize spending",
      "Review weekly spending reports",
      "Set daily/weekly limits on categories",
    ],
  },
]

export default function SuggestionsPage() {
  const [expandedId, setExpandedId] = useState(null)
  const [dismissedIds, setDismissedIds] = useState([])

  const totalPotentialSavings = suggestions
    .filter((s) => !dismissedIds.includes(s.id))
    .reduce((sum, s) => sum + s.savings, 0)

  const highPriority = suggestions.filter((s) => s.priority === "high" && !dismissedIds.includes(s.id))
  const activeSuggestions = suggestions.filter((s) => !dismissedIds.includes(s.id))

  const handleDismiss = (id) => {
    setDismissedIds([...dismissedIds, id])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          Smart Suggestions
        </h1>
        <p className="text-muted-foreground">AI-powered personalized recommendations to optimize your finances</p>
      </div>

      {/* Savings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm opacity-80">Potential Monthly Savings</span>
            <TrendingDown className="w-5 h-5" />
          </div>
          <p className="text-4xl font-bold">${totalPotentialSavings.toFixed(2)}</p>
          <p className="text-xs opacity-80 mt-2">Annual savings: ${(totalPotentialSavings * 12).toFixed(0)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">Active Suggestions</span>
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">{activeSuggestions.length}</p>
          <p className="text-xs text-muted-foreground mt-2">{highPriority.length} high priority</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">Dismissed</span>
            <CheckCircle2 className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-foreground">{dismissedIds.length}</p>
          <p className="text-xs text-muted-foreground mt-2">You can review these anytime</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">Implementation Status</span>
            <PiggyBank className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">3/6</p>
          <p className="text-xs text-muted-foreground mt-2">Suggestions acted upon</p>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {activeSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="bg-white rounded-2xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div
              onClick={() => setExpandedId(expandedId === suggestion.id ? null : suggestion.id)}
              className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Priority Indicator */}
                <div
                  className={`mt-1 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    suggestion.priority === "high"
                      ? "bg-red-100 text-red-600"
                      : suggestion.priority === "medium"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {suggestion.priority === "high" ? (
                    <AlertCircle className="w-6 h-6" />
                  ) : (
                    <Lightbulb className="w-6 h-6" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{suggestion.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">Save ${suggestion.savings.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{suggestion.category}</p>
                    </div>
                  </div>
                </div>

                {/* Expand Arrow */}
                <ArrowRight
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 mt-1 ${expandedId === suggestion.id ? "rotate-90" : ""}`}
                />
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === suggestion.id && (
              <div className="border-t border-border p-6 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-3">Action Items</h4>
                <ul className="space-y-2 mb-6">
                  {suggestion.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-md transition-all font-medium">
                    Learn More
                  </button>
                  <button
                    onClick={() => handleDismiss(suggestion.id)}
                    className="flex-1 px-4 py-2 bg-white border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {activeSuggestions.length === 0 && (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground mb-4">
            You've dismissed all suggestions. Check back soon for new personalized recommendations.
          </p>
          <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-md transition-all font-medium">
            View Dismissed Suggestions
          </button>
        </div>
      )}
    </div>
  )
}
