"use client"

import type React from "react"
import { WalletIcon, Eye, EyeOff, Plus } from "lucide-react"
import { useState } from "react"

interface Transaction {
  id: number
  description: string
  amount: number
  date: string
  type: "income" | "expense" | "transfer"
  category: string
}

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true)
  const [balance, setBalance] = useState<number>(0)
  const [showBalanceForm, setShowBalanceForm] = useState(false)
  const [balanceInput, setBalanceInput] = useState<string>("")
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, description: "Initial Balance", amount: 0, date: new Date().toLocaleDateString(), type: "income", category: "Balance" },
  ])

  const handleSetBalance = (e: React.FormEvent) => {
    e.preventDefault()
    const newBalance = parseFloat(balanceInput) || 0
    setBalance(newBalance)
    // Update first transaction as initial balance
    if (transactions.length > 0 && transactions[0].description === "Initial Balance") {
      setTransactions([{ ...transactions[0], amount: newBalance }, ...transactions.slice(1)])
    } else {
      setTransactions([{ id: Date.now(), description: "Initial Balance", amount: newBalance, date: new Date().toLocaleDateString(), type: "income", category: "Balance" }, ...transactions])
    }
    setShowBalanceForm(false)
    setBalanceInput("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <WalletIcon className="w-6 h-6 text-white" />
          </div>
          Wallet
        </h1>
        <p className="text-muted-foreground">View your balance and transactions</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 mb-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <span className="text-muted-foreground">Current Balance</span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
        <h2 className="text-5xl font-bold mb-8">
          {showBalance ? `$${balance.toLocaleString()}` : "••••••"}
        </h2>
        <button
          onClick={() => setShowBalanceForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Set Balance
        </button>
      </div>

      {/* Set Balance Form */}
      {showBalanceForm && (
        <div className="bg-white rounded-2xl p-6 border border-border mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Set Your Balance</h3>
          <form onSubmit={handleSetBalance} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Current Balance ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                placeholder="Enter your current balance"
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all font-medium"
              >
                Save Balance
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBalanceForm(false)
                  setBalanceInput("")
                }}
                className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions List */}
      <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300">
        <h3 className="text-xl font-semibold text-foreground mb-4">Transactions</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No transactions yet. Set your balance to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ${
                      tx.type === "income"
                        ? "bg-emerald-500"
                        : tx.type === "transfer"
                        ? "bg-blue-500"
                        : "bg-slate-400"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {tx.category} • {tx.date}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold ${tx.type === "income" ? "text-emerald-600" : "text-foreground"}`}>
                  {tx.type === "income" ? "+" : "-"}${Math.abs(tx.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
