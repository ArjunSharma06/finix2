"use client"

import { useState, useEffect } from "react"
import { Zap, ArrowRight, Lightbulb, AlertCircle, Loader2 } from "lucide-react"
import { useFinixData } from "@/lib/data-context"
import { calculateSuggestions, type SavingsSuggestion } from "@/lib/api-client"
import Link from "next/link"

export default function SmartSuggestions() {
  const { transactions, travelGoal } = useFinixData()
  const [suggestions, setSuggestions] = useState<SavingsSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Fix hydration issue - only run on client
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return // Don't run until client-side hydration is complete
    
    const fetchSuggestions = async () => {
      if (!travelGoal || transactions.length === 0) {
        setSuggestions([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await calculateSuggestions(transactions, travelGoal, 1)
        setSuggestions(response.suggestions.slice(0, 3)) // Show top 3
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load suggestions"
        setError(errorMessage)
        console.error("Error fetching suggestions:", err)
        // Don't clear suggestions on error - keep showing helpful message
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, transactions.length, travelGoal?.name, travelGoal?.target_amount])

  const displaySuggestions = suggestions.length > 0 ? suggestions : [
    {
      title: "Add Transactions & Travel Goal",
      description: "Add transactions and set a travel goal to see AI-powered savings suggestions",
      potential_savings: 0,
      impact: "Get started",
      category: "Setup",
    },
    {
      title: "Track Your Spending",
      description: "Start adding transactions on the Wallet or Expenses page",
      potential_savings: 0,
      impact: "Learn more",
      category: "Getting Started",
    },
  ]

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Smart Suggestions</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">AI-powered insights</p>
        <div className="text-xs text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Smart Suggestions</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="ml-2 text-sm text-muted-foreground">Loading suggestions...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-foreground">Smart Suggestions</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">AI-powered insights</p>

      <div className="space-y-3">
        {displaySuggestions.map((suggestion, idx) => {
          const getIcon = () => {
            if (suggestion.category?.toLowerCase().includes("food") || suggestion.category?.toLowerCase().includes("dining")) {
              return AlertCircle
            }
            if (suggestion.potential_savings > 100) {
              return Zap
            }
            return Lightbulb
          }
          const SuggestionIcon = getIcon()
          
          return (
            <Link
              key={idx}
              href="/dashboard/suggestions"
              className="block p-4 bg-gradient-to-r from-muted/50 to-transparent rounded-lg hover:from-muted hover:shadow-md transition-all duration-200 group cursor-pointer border border-border/50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <SuggestionIcon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {suggestion.category || "General"}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">{suggestion.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{suggestion.description}</p>
              {suggestion.potential_savings > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600">
                    Save ${suggestion.potential_savings.toFixed(2)}/month
                  </span>
                  <span className="text-xs text-muted-foreground">{suggestion.impact}</span>
                </div>
              )}
            </Link>
          )
        })}
      </div>
      
      {error && (
        <div className="text-xs text-red-500 mt-2">
          {error}. <Link href="/dashboard/suggestions" className="underline">View full suggestions</Link>
        </div>
      )}
      
      {suggestions.length === 0 && !loading && transactions.length > 0 && travelGoal && (
        <Link
          href="/dashboard/suggestions"
          className="block text-xs text-center text-primary hover:underline mt-2"
        >
          View all suggestions →
        </Link>
      )}
    </div>
  )
}
