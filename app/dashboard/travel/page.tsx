"use client"

import { Plane, MapPin, Calendar, Users } from "lucide-react"
import { useState } from "react"

const trips = [
  {
    id: 1,
    name: "Las Vegas Trip",
    destination: "Las Vegas, NV",
    startDate: "Oct 15",
    endDate: "Oct 22",
    budget: 3000,
    spent: 2450,
    status: "completed",
    members: 5,
    expenses: [
      { description: "Flight", amount: 450, date: "Oct 15" },
      { description: "Hotel", amount: 1200, date: "Oct 15" },
      { description: "Activities", amount: 600, date: "Oct 17" },
      { description: "Dining", amount: 200, date: "Oct 22" },
    ],
  },
  {
    id: 2,
    name: "Beach Getaway",
    destination: "Cancun, Mexico",
    startDate: "Dec 20",
    endDate: "Dec 27",
    budget: 2500,
    spent: 850,
    status: "upcoming",
    members: 3,
    expenses: [
      { description: "Flight", amount: 500, date: "Dec 20" },
      { description: "Hotel (partial)", amount: 350, date: "Dec 20" },
    ],
  },
]

const budgetCategories = [
  { category: "Flights", budget: 1000, spent: 950, percentage: 95 },
  { category: "Accommodation", budget: 1500, spent: 1550, percentage: 103 },
  { category: "Dining", budget: 600, spent: 520, percentage: 87 },
  { category: "Activities", budget: 800, spent: 620, percentage: 78 },
  { category: "Transportation", budget: 300, spent: 280, percentage: 93 },
  { category: "Shopping", budget: 500, spent: 350, percentage: 70 },
]

export default function TravelPage() {
  const [selectedTrip, setSelectedTrip] = useState(null)
  const activeTrip = trips.find((t) => t.status === "upcoming")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Plane className="w-6 h-6 text-white" />
          </div>
          Travel Expenses
        </h1>
        <p className="text-muted-foreground">Track and manage your trip budgets</p>
      </div>

      {/* Upcoming Trip Summary */}
      {activeTrip && (
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm opacity-80 mb-2">Next Trip</p>
              <h2 className="text-2xl font-bold">{activeTrip.name}</h2>
              <p className="text-sm opacity-80 mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {activeTrip.destination}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-80 mb-2">Dates</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {activeTrip.startDate} - {activeTrip.endDate}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-80 mb-2">Budget Remaining</p>
              <p className="text-lg font-semibold">${(activeTrip.budget - activeTrip.spent).toFixed(2)}</p>
              <p className="text-xs opacity-80 mt-1">
                {Math.round((activeTrip.spent / activeTrip.budget) * 100)}% of budget used
              </p>
            </div>
            <div>
              <p className="text-sm opacity-80 mb-2">Travelers</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                {activeTrip.members} people
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Budget Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Budget Breakdown</h2>
        <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300">
          <div className="space-y-4">
            {budgetCategories.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-foreground">{item.category}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex gap-2">
                      <span className="text-xs text-muted-foreground">${item.spent}</span>
                      <span className="text-xs text-muted-foreground">/ ${item.budget}</span>
                    </div>
                    <span
                      className={`text-xs font-semibold ${item.percentage > 100 ? "text-red-600" : "text-emerald-600"}`}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${item.percentage > 100 ? "bg-red-500" : "bg-gradient-to-r from-cyan-500 to-blue-600"}`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Trips */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">All Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => setSelectedTrip(selectedTrip?.id === trip.id ? null : trip)}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Trip Header */}
              <div
                className={`bg-gradient-to-r ${trip.status === "completed" ? "from-slate-400 to-slate-500" : "from-cyan-500 to-blue-600"} p-6 text-white`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold">{trip.name}</h3>
                    <p className="text-sm opacity-80 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {trip.destination}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      trip.status === "completed" ? "bg-slate-700" : "bg-blue-700"
                    }`}
                  >
                    {trip.status === "completed" ? "Completed" : "Upcoming"}
                  </span>
                </div>
              </div>

              {/* Trip Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Duration</p>
                    <p className="font-semibold text-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {trip.startDate} - {trip.endDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Group</p>
                    <p className="font-semibold text-foreground flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {trip.members} people
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Budget</p>
                    <p className="text-lg font-bold text-foreground">${trip.budget.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Spent</p>
                    <p className="text-lg font-bold text-cyan-600">${trip.spent.toFixed(2)}</p>
                  </div>
                </div>

                {/* Budget Bar */}
                <div className="mt-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(trip.spent / trip.budget) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.round((trip.spent / trip.budget) * 100)}% of budget used
                  </p>
                </div>
              </div>

              {/* Expandable Expenses */}
              {selectedTrip?.id === trip.id && (
                <div className="border-t border-border p-6 bg-muted/30">
                  <h4 className="font-semibold text-foreground mb-3">Expenses</h4>
                  <div className="space-y-2">
                    {trip.expenses.map((expense, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{expense.description}</p>
                          <p className="text-xs text-muted-foreground">{expense.date}</p>
                        </div>
                        <p className="font-semibold text-foreground">${expense.amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
