"use client"

import { Users, Plus, Split, CheckCircle2, AlertCircle } from "lucide-react"
import { useState } from "react"

const activeGroups = [
  { id: 1, name: "Roommates", members: 3, totalSpent: 450.0, yourShare: 150.0, settled: 2 },
  { id: 2, name: "Trip to Vegas", members: 5, totalSpent: 2100.0, yourShare: 420.0, settled: 3 },
  { id: 3, name: "Office Lunch", members: 4, totalSpent: 85.6, yourShare: 21.4, settled: 4 },
]

const pendingSettlements = [
  { id: 1, type: "owe", person: "Sarah Chen", amount: 85.5, reason: "Apartment rent split", dueDate: "Nov 5" },
  { id: 2, type: "owed", person: "James Wilson", amount: 42.3, reason: "Concert tickets", dueDate: "Nov 8" },
  { id: 3, type: "owe", person: "Emma Roberts", amount: 156.25, reason: "Vegas trip expenses", dueDate: "Nov 12" },
  { id: 4, type: "settled", person: "Mike Johnson", amount: 75.0, reason: "Dinner split", settledDate: "Oct 28" },
]

const expenseHistory = [
  { id: 1, description: "Dinner at Restaurant", group: "Office Lunch", amount: 85.6, date: "Nov 2", addedBy: "You" },
  {
    id: 2,
    description: "Hotel in Vegas",
    group: "Trip to Vegas",
    amount: 1800.0,
    date: "Oct 28",
    addedBy: "James Wilson",
  },
  { id: 3, description: "Monthly Rent", group: "Roommates", amount: 450.0, date: "Oct 25", addedBy: "Sarah Chen" },
]

export default function FairSharePage() {
  const [activeTab, setActiveTab] = useState("groups")

  const totalOwed = pendingSettlements.filter((s) => s.type === "owe").reduce((sum, s) => sum + s.amount, 0)

  const totalOwnedToYou = pendingSettlements.filter((s) => s.type === "owed").reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          FairShare
        </h1>
        <p className="text-muted-foreground">Split expenses fairly with friends and groups</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">You Owe</span>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">${totalOwed.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Across {pendingSettlements.filter((s) => s.type === "owe").length} people
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">Owed to You</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">${totalOwnedToYou.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">
            From {pendingSettlements.filter((s) => s.type === "owed").length} people
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">Active Groups</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{activeGroups.length}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {activeGroups.reduce((sum, g) => sum + g.members, 0)} total members
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("groups")}
          className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
            activeTab === "groups"
              ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
              : "bg-white border border-border text-foreground hover:bg-muted"
          }`}
        >
          Active Groups
        </button>
        <button
          onClick={() => setActiveTab("settlements")}
          className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
            activeTab === "settlements"
              ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
              : "bg-white border border-border text-foreground hover:bg-muted"
          }`}
        >
          Settlements
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
            activeTab === "history"
              ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
              : "bg-white border border-border text-foreground hover:bg-muted"
          }`}
        >
          History
        </button>
      </div>

      {/* Active Groups */}
      {activeTab === "groups" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {activeGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-foreground">{group.name}</h3>
                  <div className="flex -space-x-2">
                    {Array.from({ length: group.members }).map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 mb-4 pb-4 border-b border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                    <p className="text-xl font-bold text-foreground">${group.totalSpent.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Your Share</p>
                    <p className="text-lg font-semibold text-purple-600">${group.yourShare.toFixed(2)}</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors font-medium">
                  <Split className="w-4 h-4" />
                  View Details
                </button>
              </div>
            ))}
            <button className="bg-white rounded-2xl p-6 border border-dashed border-border hover:shadow-lg transition-all duration-300 flex items-center justify-center">
              <div className="text-center">
                <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <span className="font-medium text-foreground">New Group</span>
              </div>
            </button>
          </div>
        </>
      )}

      {/* Settlements */}
      {activeTab === "settlements" && (
        <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Settlement Status</h2>
          <div className="space-y-3">
            {pendingSettlements.map((settlement) => (
              <div
                key={settlement.id}
                className="flex items-center justify-between p-4 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      settlement.type === "owe"
                        ? "bg-red-500"
                        : settlement.type === "owed"
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                    }`}
                  >
                    {settlement.person.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{settlement.person}</p>
                    <p className="text-sm text-muted-foreground">{settlement.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      settlement.type === "owe"
                        ? "text-red-600"
                        : settlement.type === "owed"
                          ? "text-emerald-600"
                          : "text-slate-500"
                    }`}
                  >
                    {settlement.type === "owe" ? "-" : settlement.type === "owed" ? "+" : ""}${settlement.amount}
                  </p>
                  {settlement.type === "settled" ? (
                    <p className="text-xs text-slate-500">Settled</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Due {settlement.dueDate}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {activeTab === "history" && (
        <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Expense History</h2>
          <div className="space-y-3">
            {expenseHistory.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <div>
                  <p className="font-medium text-foreground">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {expense.group} • Added by {expense.addedBy} on {expense.date}
                  </p>
                </div>
                <p className="text-lg font-semibold text-foreground">${expense.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
