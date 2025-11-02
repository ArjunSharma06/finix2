"use client"

import type React from "react"
import { WalletIcon, Eye, EyeOff, Plus, Minus } from "lucide-react"
import { useState } from "react"
import { useFinixData } from "@/lib/data-context"

export default function WalletPage() {
  const { balance, setBalance, transactions, addTransaction, removeTransaction } = useFinixData()
  const [showBalance, setShowBalance] = useState(true)
  const [showBalanceForm, setShowBalanceForm] = useState(false)
  const [balanceInput, setBalanceInput] = useState<string>("")
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [transactionForm, setTransactionForm] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  })

  const handleSetBalance = (e: React.FormEvent) => {
    e.preventDefault()
    const newBalance = parseFloat(balanceInput) || 0
    setBalance(newBalance)
    setShowBalanceForm(false)
    setBalanceInput("")
  }

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(transactionForm.amount)
    if (isNaN(amount) || amount <= 0 || !transactionForm.category) {
      return
    }

    addTransaction({
      amount: amount,
      category: transactionForm.category,
      date: transactionForm.date,
      description: transactionForm.description || undefined,
      currency: "USD",
    })

    setTransactionForm({
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    })
    setShowTransactionForm(false)
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

      {/* Add Transaction Form */}
      <div className="bg-white rounded-2xl p-6 border border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground">Transactions</h3>
          <button
            onClick={() => setShowTransactionForm(!showTransactionForm)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
          >
            {showTransactionForm ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showTransactionForm ? "Cancel" : "Add Transaction"}
          </button>
        </div>

        {showTransactionForm && (
          <form onSubmit={handleAddTransaction} className="space-y-4 mb-6 pb-6 border-b border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                  placeholder="0.00"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  value={transactionForm.category}
                  onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                  placeholder="e.g., Food, Transport, Entertainment"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={transactionForm.date}
                  onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                  placeholder="e.g., Starbucks coffee"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all font-medium"
            >
              Add Transaction
            </button>
          </form>
        )}

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No transactions yet. Add a transaction to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white bg-slate-500">
                    $
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tx.description || tx.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {tx.category} • {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-foreground">
                    -${tx.amount.toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeTransaction(tx.id!)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                    title="Remove transaction"
                  >
                    <Minus className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
