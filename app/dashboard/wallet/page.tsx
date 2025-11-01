"use client"

import { WalletIcon, CreditCard, Plus, Send, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

const accounts = [
  {
    id: 1,
    name: "Checking Account",
    bank: "Chase",
    balance: 8405.0,
    type: "checking",
    accountNumber: "****5482",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "Savings Account",
    bank: "Ally",
    balance: 15230.5,
    type: "savings",
    accountNumber: "****2891",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: 3,
    name: "Emergency Fund",
    bank: "Vanguard",
    balance: 25000.0,
    type: "investment",
    accountNumber: "****4521",
    color: "from-purple-500 to-pink-600",
  },
]

const cards = [
  {
    id: 1,
    name: "Primary Card",
    bank: "Visa",
    number: "****1234",
    expiry: "12/26",
    limit: 5000,
    used: 2458,
    color: "from-slate-800 to-slate-900",
  },
  {
    id: 2,
    name: "Travel Card",
    bank: "Amex",
    number: "****5678",
    expiry: "08/25",
    limit: 10000,
    used: 3200,
    color: "from-amber-500 to-yellow-600",
  },
]

const transactions = [
  { id: 1, description: "Apple Store", amount: -29.99, date: "Nov 2", type: "expense", category: "Shopping" },
  { id: 2, description: "Salary Deposit", amount: 5000, date: "Nov 1", type: "income", category: "Income" },
  {
    id: 3,
    description: "Netflix Subscription",
    amount: -15.99,
    date: "Oct 31",
    type: "expense",
    category: "Subscriptions",
  },
  { id: 4, description: "Transfer to Savings", amount: -1000, date: "Oct 30", type: "transfer", category: "Transfer" },
]

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true)
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

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
        <p className="text-muted-foreground">Manage all your accounts and cards</p>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 mb-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <span className="text-muted">Total Balance</span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
        <h2 className="text-5xl font-bold mb-8">
          {showBalance ? `$${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "••••••"}
        </h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add Money
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium">
            <Send className="w-4 h-4" />
            Send Money
          </button>
        </div>
      </div>

      {/* Accounts Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-foreground mb-4">Bank Accounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`bg-gradient-to-br ${account.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-8">
                <CreditCard className="w-6 h-6" />
                <span className="text-sm opacity-80">{account.type}</span>
              </div>
              <p className="text-sm opacity-80 mb-1">{account.bank}</p>
              <h4 className="text-lg font-semibold mb-6">{account.name}</h4>
              <div className="border-t border-white/20 pt-4">
                <p className="text-sm opacity-80 mb-1">Balance</p>
                <p className="text-2xl font-bold">
                  ${account.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              <p className="text-xs opacity-60 mt-4">{account.accountNumber}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cards Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-foreground mb-4">Payment Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`bg-gradient-to-br ${card.color} rounded-lg p-6 text-white mb-4 h-40 flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{card.bank}</span>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm opacity-80 mb-1">{card.name}</p>
                  <p className="text-2xl font-mono tracking-wider">{card.number}</p>
                  <p className="text-xs opacity-80 mt-2">Expires {card.expiry}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Credit Limit</p>
                <p className="font-semibold text-foreground mb-4">
                  ${card.limit.toLocaleString()} / ${card.used.toLocaleString()} Used
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                    style={{ width: `${(card.used / card.limit) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300">
        <h3 className="text-xl font-semibold text-foreground mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ${
                    tx.type === "income" ? "bg-emerald-500" : tx.type === "transfer" ? "bg-blue-500" : "bg-slate-400"
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
                {tx.type === "income" ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
