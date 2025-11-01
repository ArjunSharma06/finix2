"use client"

import { useState } from "react"
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

export default function TransactionTable() {
  const allTransactions = [
    {
      description: "Monthly Rent",
      date: "Aug 1, 2024",
      category: "Housing",
      amount: 1200,
      icon: Home,
      type: "debit",
    },
    {
      description: "Whole Foods Market",
      date: "Aug 15, 2024",
      category: "Groceries",
      amount: 156.32,
      icon: ShoppingBag,
      type: "debit",
    },
    {
      description: "Spotify Premium",
      date: "Aug 10, 2024",
      category: "Entertainment",
      amount: 12.99,
      icon: Gamepad2,
      type: "debit",
    },
    {
      description: "Electric Bill",
      date: "Aug 8, 2024",
      category: "Utilities",
      amount: 125.47,
      icon: Zap,
      type: "debit",
    },
    {
      description: "Starbucks",
      date: "Aug 14, 2024",
      category: "Dining",
      amount: 8.5,
      icon: Coffee,
      type: "debit",
    },
    {
      description: "iPhone Payment",
      date: "Aug 5, 2024",
      category: "Mobile",
      amount: 35.0,
      icon: Smartphone,
      type: "debit",
    },
    {
      description: "Flight to NYC",
      date: "Jul 28, 2024",
      category: "Travel",
      amount: 324.99,
      icon: Plane,
      type: "debit",
    },
    {
      description: "Restaurant - The Grill",
      date: "Aug 12, 2024",
      category: "Dining",
      amount: 67.85,
      icon: Utensils,
      type: "debit",
    },
    {
      description: "Amazon Purchase",
      date: "Aug 11, 2024",
      category: "Shopping",
      amount: 89.99,
      icon: ShoppingBag,
      type: "debit",
    },
    {
      description: "Gas Station",
      date: "Aug 9, 2024",
      category: "Transportation",
      amount: 52.3,
      icon: Smartphone,
      type: "debit",
    },
    {
      description: "Netflix Subscription",
      date: "Aug 7, 2024",
      category: "Entertainment",
      amount: 15.99,
      icon: Gamepad2,
      type: "debit",
    },
    {
      description: "Grocery Store",
      date: "Aug 6, 2024",
      category: "Groceries",
      amount: 67.43,
      icon: ShoppingBag,
      type: "debit",
    },
    {
      description: "Water Bill",
      date: "Aug 4, 2024",
      category: "Utilities",
      amount: 45.2,
      icon: Zap,
      type: "debit",
    },
    {
      description: "Coffee Shop",
      date: "Aug 3, 2024",
      category: "Dining",
      amount: 6.75,
      icon: Coffee,
      type: "debit",
    },
    {
      description: "Gym Membership",
      date: "Aug 2, 2024",
      category: "Entertainment",
      amount: 50.0,
      icon: Gamepad2,
      type: "debit",
    },
    {
      description: "Uber Ride",
      date: "Jul 31, 2024",
      category: "Transportation",
      amount: 24.5,
      icon: Smartphone,
      type: "debit",
    },
    {
      description: "Dinner at Olive Garden",
      date: "Jul 30, 2024",
      category: "Dining",
      amount: 45.99,
      icon: Utensils,
      type: "debit",
    },
    {
      description: "Best Buy Electronics",
      date: "Jul 29, 2024",
      category: "Shopping",
      amount: 299.99,
      icon: ShoppingBag,
      type: "debit",
    },
    {
      description: "Electricity Bill",
      date: "Jul 27, 2024",
      category: "Utilities",
      amount: 142.65,
      icon: Zap,
      type: "debit",
    },
    {
      description: "Hotel Stay",
      date: "Jul 26, 2024",
      category: "Travel",
      amount: 185.0,
      icon: Plane,
      type: "debit",
    },
    {
      description: "Lunch Break",
      date: "Jul 25, 2024",
      category: "Dining",
      amount: 12.5,
      icon: Coffee,
      type: "debit",
    },
    {
      description: "Phone Bill",
      date: "Jul 24, 2024",
      category: "Mobile",
      amount: 85.0,
      icon: Smartphone,
      type: "debit",
    },
    {
      description: "Target Shopping",
      date: "Jul 23, 2024",
      category: "Shopping",
      amount: 73.21,
      icon: ShoppingBag,
      type: "debit",
    },
    {
      description: "Gas Fill-up",
      date: "Jul 22, 2024",
      category: "Transportation",
      amount: 58.4,
      icon: Smartphone,
      type: "debit",
    },
    {
      description: "Movie Tickets",
      date: "Jul 21, 2024",
      category: "Entertainment",
      amount: 32.0,
      icon: Gamepad2,
      type: "debit",
    },
    {
      description: "Whole Foods",
      date: "Jul 20, 2024",
      category: "Groceries",
      amount: 123.45,
      icon: ShoppingBag,
      type: "debit",
    },
    {
      description: "Internet Bill",
      date: "Jul 19, 2024",
      category: "Utilities",
      amount: 79.99,
      icon: Zap,
      type: "debit",
    },
    {
      description: "Train Ticket",
      date: "Jul 18, 2024",
      category: "Transportation",
      amount: 42.0,
      icon: Smartphone,
      type: "debit",
    },
    {
      description: "Dinner - Italian",
      date: "Jul 17, 2024",
      category: "Dining",
      amount: 78.5,
      icon: Utensils,
      type: "debit",
    },
    {
      description: "Gaming Console",
      date: "Jul 16, 2024",
      category: "Entertainment",
      amount: 499.99,
      icon: Gamepad2,
      type: "debit",
    },
    {
      description: "Shoes Purchase",
      date: "Jul 15, 2024",
      category: "Shopping",
      amount: 125.0,
      icon: ShoppingBag,
      type: "debit",
    },
    {
      description: "Parking Fee",
      date: "Jul 14, 2024",
      category: "Transportation",
      amount: 15.0,
      icon: Smartphone,
      type: "debit",
    },
    {
      description: "Breakfast",
      date: "Jul 13, 2024",
      category: "Dining",
      amount: 11.3,
      icon: Coffee,
      type: "debit",
    },
    {
      description: "Disney+ Subscription",
      date: "Jul 12, 2024",
      category: "Entertainment",
      amount: 10.99,
      icon: Gamepad2,
      type: "debit",
    },
    {
      description: "Grocery Delivery",
      date: "Jul 11, 2024",
      category: "Groceries",
      amount: 45.67,
      icon: ShoppingBag,
      type: "debit",
    },
    {
      description: "Water Bill",
      date: "Jul 10, 2024",
      category: "Utilities",
      amount: 38.5,
      icon: Zap,
      type: "debit",
    },
    {
      description: "Taxi Ride",
      date: "Jul 9, 2024",
      category: "Transportation",
      amount: 31.2,
      icon: Smartphone,
      type: "debit",
    },
    {
      description: "Restaurant",
      date: "Jul 8, 2024",
      category: "Dining",
      amount: 56.78,
      icon: Utensils,
      type: "debit",
    },
    {
      description: "Books Purchase",
      date: "Jul 7, 2024",
      category: "Shopping",
      amount: 42.99,
      icon: ShoppingBag,
      type: "debit",
    },
    {
      description: "Concert Tickets",
      date: "Jul 6, 2024",
      category: "Entertainment",
      amount: 150.0,
      icon: Gamepad2,
      type: "debit",
    },
    {
      description: "Fuel",
      date: "Jul 5, 2024",
      category: "Transportation",
      amount: 62.1,
      icon: Smartphone,
      type: "debit",
    },
    {
      description: "Lunch",
      date: "Jul 4, 2024",
      category: "Dining",
      amount: 14.99,
      icon: Coffee,
      type: "debit",
    },
    {
      description: "Rent Payment",
      date: "Jul 1, 2024",
      category: "Housing",
      amount: 1200,
      icon: Home,
      type: "debit",
    },
  ]

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

  return (
    <div className="bg-white rounded-xl border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
        <a href="#" className="text-xs font-medium text-primary hover:underline">
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
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-200">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{tx.description}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-md">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">{tx.date}</td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-foreground">-${tx.amount.toFixed(2)}</span>
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
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
