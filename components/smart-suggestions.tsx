"use client"

import { Zap, ArrowRight, Lightbulb, AlertCircle } from "lucide-react"

export default function SmartSuggestions() {
  const suggestions = [
    {
      category: "Dining",
      icon: AlertCircle,
      title: "High Dining Spending",
      description: "23% above average this month",
      action: "Review",
    },
    {
      category: "Entertainment",
      icon: Lightbulb,
      title: "Bundle Streaming Services",
      description: "Save $8.99/month with combo",
      action: "Save",
    },
    {
      category: "Utilities",
      icon: Zap,
      title: "Reduce Peak Hours Usage",
      description: "Potential savings: $35/month",
      action: "Learn",
    },
  ]

  return (
    <div className="bg-white rounded-xl border border-border p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-foreground">Smart Suggestions</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">AI-powered insights</p>

      <div className="space-y-3">
        {suggestions.map((suggestion, idx) => {
          const SuggestionIcon = suggestion.icon
          return (
            <div
              key={idx}
              className="p-4 bg-gradient-to-r from-muted/50 to-transparent rounded-lg hover:from-muted hover:shadow-md transition-all duration-200 group cursor-pointer border border-border/50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <SuggestionIcon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {suggestion.category}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">{suggestion.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{suggestion.description}</p>
              <button className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-md font-medium hover:bg-primary/20 transition-all duration-200">
                {suggestion.action}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
