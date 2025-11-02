"use client"

import { Lightbulb, TrendingDown, PiggyBank, AlertCircle, CheckCircle2, ArrowRight, Loader2, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { useFinixData } from "@/lib/data-context"
import { calculateSuggestions, type AISuggestionResponse, type SavingsSuggestion } from "@/lib/api-client"

export default function SuggestionsPage() {
  const { transactions, travelGoal } = useFinixData()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [dismissedIds, setDismissedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestionsData, setSuggestionsData] = useState<AISuggestionResponse | null>(null)
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null)

  const fetchSuggestions = async () => {
    if (!travelGoal || transactions.length === 0) {
      setError("Please add transactions and set a travel goal first.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await calculateSuggestions(transactions, travelGoal, 1)
      setSuggestionsData(response)
      setLastGenerated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate suggestions. Please try again.")
      console.error("Error fetching suggestions:", err)
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch suggestions when data is available
  useEffect(() => {
    if (travelGoal && transactions.length > 0 && !suggestionsData) {
      fetchSuggestions()
    }
  }, [travelGoal, transactions.length])

  const suggestions: (SavingsSuggestion & { id: number; priority: string })[] = suggestionsData
    ? suggestionsData.suggestions.map((s, idx) => ({
        ...s,
        id: idx + 1,
        priority: s.potential_savings > 100 ? "high" : s.potential_savings > 50 ? "medium" : "low",
      }))
    : []

  const totalPotentialSavings = suggestions
    .filter((s) => !dismissedIds.includes(s.id))
    .reduce((sum, s) => sum + Number(s.potential_savings), 0)

  const highPriority = suggestions.filter((s) => s.priority === "high" && !dismissedIds.includes(s.id))
  const activeSuggestions = suggestions.filter((s) => !dismissedIds.includes(s.id))

  const handleDismiss = (id: number) => {
    setDismissedIds([...dismissedIds, id])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            Smart Suggestions
          </h1>
          <p className="text-muted-foreground">AI-powered personalized recommendations to optimize your finances</p>
          {lastGenerated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastGenerated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={fetchSuggestions}
          disabled={loading || !travelGoal || transactions.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State - No Data */}
      {(!travelGoal || transactions.length === 0) && !loading && (
        <div className="bg-white rounded-2xl p-12 border border-border text-center">
          <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Setup Required</h3>
          <p className="text-muted-foreground mb-4">
            {!travelGoal && "Please set a travel goal first. "}
            {transactions.length === 0 && "Please add some transactions. "}
            Then click "Refresh" to generate AI-powered suggestions.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl p-12 border border-border text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing your spending patterns...</p>
        </div>
      )}

      {/* Savings Summary */}
      {suggestionsData && !loading && (
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
      )}

      {/* Suggestions List */}
      {!loading && activeSuggestions.length > 0 && (
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
                      <p className="text-lg font-bold text-emerald-600">Save ${Number(suggestion.potential_savings).toFixed(2)}</p>
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
                <h4 className="font-semibold text-foreground mb-3">Details</h4>
                <p className="text-sm text-foreground mb-4">{suggestion.description}</p>
                {suggestionsData && (
                  <div className="bg-white rounded-lg p-4 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Potential Monthly Savings:</span>
                      <span className="font-semibold text-emerald-600">
                        ${Number(suggestion.potential_savings).toLocaleString()}
                      </span>
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
                )}

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
      )}

      {/* Empty State - No Suggestions */}
      {!loading && activeSuggestions.length === 0 && suggestionsData && (
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
