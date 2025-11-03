"use client"

import { Plane, MapPin, Calendar, Save, Edit2, DollarSign } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { useFinixData } from "@/lib/data-context"
import { japanTravelSuggestions } from "@/lib/mock-travel-data"
import type { TravelSuggestion } from "@/types/travel"

interface BudgetCategory {
  category: string
  budget: number
  spent: number
}

const DEFAULT_CATEGORIES = [
  { category: "Flights", budget: 0, spent: 0 },
  { category: "Accommodation", budget: 0, spent: 0 },
  { category: "Dining", budget: 0, spent: 0 },
  { category: "Activities", budget: 0, spent: 0 },
  { category: "Transportation", budget: 0, spent: 0 },
  { category: "Shopping", budget: 0, spent: 0 },
]

export default function TravelPage() {
  const { travelGoal, setTravelGoal, transactions } = useFinixData()
  const [showForm, setShowForm] = useState(!travelGoal)
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [suggestions] = useState<TravelSuggestion[]>(japanTravelSuggestions)
  const [formData, setFormData] = useState({
    name: travelGoal?.name || "",
    destination: travelGoal?.destination || "",
    target_amount: travelGoal?.target_amount?.toString() || "",
    current_saved: travelGoal?.current_saved?.toString() || "0",
    target_date: travelGoal?.target_date || "",
  })

  // Load budget categories from localStorage
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("finix_travel_budget_categories")
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES
    }
    return DEFAULT_CATEGORIES
  })

  // Save budget categories to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("finix_travel_budget_categories", JSON.stringify(budgetCategories))
    }
  }, [budgetCategories])

  // Calculate spent amounts from transactions (travel-related categories)
  const calculatedSpending = useMemo(() => {
    const travelRelatedCategories = [
      "Travel", "Flights", "Accommodation", "Hotel", "Dining", "Restaurant", 
      "Activities", "Entertainment", "Transportation", "Transport", "Shopping"
    ]
    
    const spending: Record<string, number> = {}
    travelRelatedCategories.forEach(cat => {
      spending[cat] = 0
    })

    transactions.forEach((tx) => {
      const category = tx.category
      if (travelRelatedCategories.some(relCat => category.toLowerCase().includes(relCat.toLowerCase()))) {
        // Map transaction categories to budget categories
        if (category.toLowerCase().includes("flight") || category.toLowerCase().includes("travel") && !category.toLowerCase().includes("transport")) {
          spending["Flights"] = (spending["Flights"] || 0) + tx.amount
        } else if (category.toLowerCase().includes("hotel") || category.toLowerCase().includes("accommodation")) {
          spending["Accommodation"] = (spending["Accommodation"] || 0) + tx.amount
        } else if (category.toLowerCase().includes("dining") || category.toLowerCase().includes("restaurant") || category.toLowerCase().includes("food")) {
          spending["Dining"] = (spending["Dining"] || 0) + tx.amount
        } else if (category.toLowerCase().includes("activity") || category.toLowerCase().includes("entertainment")) {
          spending["Activities"] = (spending["Activities"] || 0) + tx.amount
        } else if (category.toLowerCase().includes("transport")) {
          spending["Transportation"] = (spending["Transportation"] || 0) + tx.amount
        } else if (category.toLowerCase().includes("shopping")) {
          spending["Shopping"] = (spending["Shopping"] || 0) + tx.amount
        }
      }
    })

    return spending
  }, [transactions])

  // Update budget categories with calculated spending
  const budgetWithSpending = useMemo(() => {
    return budgetCategories.map(cat => ({
      ...cat,
      spent: calculatedSpending[cat.category] || 0,
      percentage: cat.budget > 0 ? Math.round((calculatedSpending[cat.category] || 0) / cat.budget * 100) : 0
    }))
  }, [budgetCategories, calculatedSpending])

  // Using static suggestions now, no need to fetch

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetAmount = parseFloat(formData.target_amount)
    const currentSaved = parseFloat(formData.current_saved) || 0

    if (isNaN(targetAmount) || targetAmount <= 0 || !formData.name) {
      return
    }

    setTravelGoal({
      name: formData.name,
      destination: formData.destination || undefined,
      target_amount: targetAmount,
      current_saved: currentSaved,
      target_date: formData.target_date || undefined,
    })

    setShowForm(false)
  }

  const remainingAmount = travelGoal
    ? travelGoal.target_amount - (travelGoal.current_saved || 0)
    : 0
  const progressPercentage = travelGoal
    ? Math.round(((travelGoal.current_saved || 0) / travelGoal.target_amount) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            Travel Goal
          </h1>
          <p className="text-muted-foreground">Set your travel savings goal</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg text-white rounded-lg transition-all font-medium"
          >
            <Plane className="w-4 h-4" />
            Add Goal
          </button>
        )}
      </div>

      {/* Travel Goal Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-border mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plane className="w-5 h-5" />
            {travelGoal ? "Update Travel Goal" : "Create Travel Goal"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Goal Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Summer Europe Trip"
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Destination
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g., Paris, France"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-foreground"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Target Amount (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.target_amount}
                  onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                  placeholder="0.00"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Currently Saved (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.current_saved}
                  onChange={(e) => setFormData({ ...formData, current_saved: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-foreground"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Target Date (Optional)
              </label>
              <input
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-foreground"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                <Save className="w-4 h-4" />
                Save Goal
              </button>
              {travelGoal && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({
                      name: travelGoal.name,
                      destination: travelGoal.destination || "",
                      target_amount: travelGoal.target_amount.toString(),
                      current_saved: (travelGoal.current_saved || 0).toString(),
                      target_date: travelGoal.target_date || "",
                    })
                  }}
                  className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Travel Goal Display */}
      {travelGoal && !showForm && (
        <>
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 relative">
            <button
              onClick={() => setShowForm(true)}
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit Goal
            </button>
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">{travelGoal.name}</h2>
              {travelGoal.destination && (
                <p className="text-sm opacity-90 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {travelGoal.destination}
                </p>
              )}
              {travelGoal.target_date && (
                <p className="text-sm opacity-90 flex items-center gap-2 mt-2">
                  <Calendar className="w-4 h-4" />
                  Target: {new Date(travelGoal.target_date).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm opacity-80 mb-2">Target Amount</p>
                <p className="text-2xl font-bold">₹{travelGoal.target_amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-2">Currently Saved</p>
                <p className="text-2xl font-bold">₹{(travelGoal.current_saved || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-2">Remaining</p>
                <p className="text-2xl font-bold">₹{remainingAmount.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm opacity-80">Progress</p>
                <p className="text-sm font-semibold">{progressPercentage}%</p>
              </div>
              <div className="w-full bg-white/20 rounded-full h-4">
                <div
                  className="bg-white h-4 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Budget Breakdown
              </h2>
              <button
                onClick={() => setShowBudgetForm(!showBudgetForm)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg text-white rounded-lg transition-all font-medium"
              >
                <Edit2 className="w-4 h-4" />
                {showBudgetForm ? "Cancel" : "Edit Budgets"}
              </button>
            </div>

            {/* Budget Form */}
            {showBudgetForm && (
              <div className="bg-white rounded-2xl p-6 border border-border mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Set Budgets for Each Category</h3>
                <div className="space-y-4">
                  {budgetCategories.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-40">
                        <label className="text-sm font-medium text-foreground">{cat.category}</label>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={cat.budget || ""}
                        onChange={(e) => {
                          const newCategories = [...budgetCategories]
                          newCategories[idx].budget = parseFloat(e.target.value) || 0
                          setBudgetCategories(newCategories)
                        }}
                        placeholder="0.00"
                        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-foreground"
                      />
                      <span className="text-sm text-muted-foreground w-16">Budget</span>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        localStorage.setItem("finix_travel_budget_categories", JSON.stringify(budgetCategories))
                      }
                      setShowBudgetForm(false)
                    }}
                    className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    Save Budgets
                  </button>
                </div>
              </div>
            )}

            {/* Budget Display */}
            <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300">
              {budgetWithSpending.some(cat => cat.budget > 0) ? (
                <div className="space-y-4">
                  {budgetWithSpending
                    .filter(cat => cat.budget > 0)
                    .map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium text-foreground">{item.category}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex gap-2">
                              <span className="text-xs text-muted-foreground">₹{item.spent.toFixed(2)}</span>
                              <span className="text-xs text-muted-foreground">/ ₹{item.budget.toFixed(2)}</span>
                            </div>
                            <span
                              className={`text-xs font-semibold ${
                                item.percentage > 100 ? "text-red-600" : "text-emerald-600"
                              }`}
                            >
                              {item.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                item.percentage > 100
                                  ? "bg-red-500"
                                  : "bg-gradient-to-r from-cyan-500 to-blue-600"
                              }`}
                              style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No budget categories set yet</p>
                  <p className="text-xs mt-1">Click "Edit Budgets" to set your travel budget breakdown</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Travel Suggestions */}
          {travelGoal?.destination && Object.values(budgetCategories).some(cat => cat.budget > 0) && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Travel Suggestions
                </h2>
              </div>

              <div className="relative">
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex space-x-4">
                    {suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex-none w-80 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="h-48 w-full relative">
                            <img
                              src={suggestion.imageUrl}
                              alt={suggestion.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-purple-600 px-2 py-1 rounded-lg text-xs font-semibold text-white capitalize">
                              {suggestion.category}
                            </div>
                            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-sm font-semibold">
                              ₹{suggestion.price.toLocaleString()} {suggestion.priceLabel}
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg">{suggestion.name}</h3>
                              <div className="flex items-center text-sm text-yellow-500">
                                ★ {suggestion.rating}
                              </div>
                            </div>
                            {suggestion.location && (
                              <p className="text-sm text-gray-600 mb-2">
                                📍 {suggestion.location}
                              </p>
                            )}
                            {suggestion.airline && (
                              <p className="text-sm text-gray-600 mb-2">
                                ✈️ {suggestion.airline}
                              </p>
                            )}
                            {suggestion.cuisine && (
                              <p className="text-sm text-gray-600 mb-2">
                                🍽️ {suggestion.cuisine}
                              </p>
                            )}
                            {suggestion.timing && (
                              <p className="text-sm text-gray-600 mb-2">
                                🕒 {suggestion.timing}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 mb-3">{suggestion.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {suggestion.features.map((feature: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="w-full text-center py-12 text-muted-foreground">
                        <p>No suggestions available for your destination and budget.</p>
                        <p className="text-sm mt-2">Try adjusting your budgets or changing the destination.</p>
                      </div>
                    )}
                  </div>
                </div>
                {suggestions.length > 0 && (
                  <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                    .scrollbar-hide {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    }
                  `}</style>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {!travelGoal && !showForm && (
        <div className="bg-white rounded-2xl p-12 border border-border text-center">
          <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Travel Goal Set</h3>
          <p className="text-muted-foreground mb-4">
            Create a travel goal to start tracking your savings progress.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            Create Travel Goal
          </button>
        </div>
      )}
    </div>
  )
}
