"use client"

import { PieChart, Wallet, Users, Plane, Lightbulb, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { icon: PieChart, label: "Overview", href: "/dashboard" },
    { icon: PieChart, label: "Expenses", href: "/dashboard/expenses" },
    { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
    { icon: Users, label: "FairShare", href: "/dashboard/fairshare" },
    { icon: Plane, label: "Travel", href: "/dashboard/travel" },
    { icon: Lightbulb, label: "Smart Suggestions", href: "/dashboard/suggestions" },
  ]

  return (
    <div className="h-full flex flex-col p-6 bg-white">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md flex items-center justify-center hover:shadow-md transition-all duration-200">
          <span className="text-white font-bold text-lg">$</span>
        </div>
        <span className="font-bold text-lg text-foreground">FINIX</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                  : "text-foreground hover:bg-muted/80"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border pt-6">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
