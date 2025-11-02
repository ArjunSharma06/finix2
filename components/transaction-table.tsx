"use client"

import { useState, useMemo } from "react"
import {
  Coffee,
  Home,
  Zap,
  Smartphone,
  Utensils,
  Gamepad2,
  Plane,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useFinixData } from "@/lib/data-context"

// Icon mapping based on category
const categoryIcons: Record<string, typeof Coffee> = {
  Food: Utensils,
  Dining: Utensils,
  Groceries: ShoppingBag,
  Shopping: ShoppingBag,
  Housing: Home,
  Rent: Home,
  Utilities: Zap,
  Transport: Smartphone,
  Transportation: Smartphone,
  Entertainment: Gamepad2,
  Travel: Plane,
  Mobile: Smartphone,
  Coffee: Coffee,
  Default: ShoppingBag,
}

export default function TransactionTable() {
  const { transactions } = useFinixData()

  // Convert context transactions to display format
  const allTransactions = useMemo(() => {
    return transactions.map((tx) => {
      const Icon = categoryIcons[tx.category] || categoryIcons.Default
      return {
        description: tx.description || tx.category,
        date: new Date(tx.date).toLocaleDateString(),
        category: tx.category,
        amount: tx.amount,
        icon: Icon,
        type: "debit" as const,
      }
    })
  }, [transactions])
  const [currentPage, setCurrentPage] = useState(1)
  const transactionsPerPage = 20
  const totalPages = Math.ceil(allTransactions.length / transactionsPerPage)

  const startIndex = (currentPage - 1) * transactionsPerPage
  const endIndex = startIndex + transactionsPerPage
  const displayedTransactions = allTransactions.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  if (allTransactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:shadow-lg transition-all duration-300">
        <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
        <div className="text-center py-12 text-muted-foreground">
          <p>No transactions yet. Add some transactions on the Wallet or Expenses page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
        <a href="/dashboard/wallet" className="text-xs font-medium text-purple-600 hover:underline">
          View All
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                Description
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                Category
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                Date
              </th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedTransactions.map((tx, idx) => {
              const Icon = tx.icon
              return (
                <tr
                  key={idx}
                  className="border-b border-border hover:bg-muted/50 transition-all duration-200 group cursor-pointer"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/10 to-indigo-600/10 flex items-center justify-center group-hover:from-purple-600/20 group-hover:to-indigo-600/20 transition-all duration-200">
                        <Icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-foreground">{tx.description}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{tx.date}</td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-foreground">-₹{tx.amount.toFixed(2)}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, allTransactions.length)} of {allTransactions.length}{" "}
          transactions
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200 ${
                  page === currentPage
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
