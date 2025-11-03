"use client"

import { PieChart, Wallet, Users, Plane, Lightbulb, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Sidebar() {
  const pathname = usePathname()
  const isDetailPage = pathname !== "/dashboard"
  const [isHovered, setIsHovered] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isDetailPage)

  const navItems = [
    { icon: PieChart, label: "Overview", href: "/dashboard" },
    { icon: PieChart, label: "Expenses", href: "/dashboard/expenses" },
    { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
    { icon: Users, label: "FairShare", href: "/dashboard/fairshare" },
    { icon: Plane, label: "Travel", href: "/dashboard/travel" },
    { icon: Lightbulb, label: "Smart Suggestions", href: "/dashboard/suggestions" },
  ]

  const shouldShow = !isCollapsed || isHovered

  return (
    <div
      className={`h-full flex flex-col ${shouldShow ? "p-6 w-64" : "p-3 w-20"} bg-white transition-all duration-300 ease-in-out`}
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-md flex items-center justify-center hover:shadow-md transition-all duration-200 flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {shouldShow && <span className="font-bold text-lg text-foreground">FINIX</span>}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={idx}
              href={item.href}
              onClick={() => setIsCollapsed(true)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "text-foreground hover:bg-muted/80"
              } ${!shouldShow ? "justify-center px-3" : ""}`}
              title={!shouldShow ? item.label : ""}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {shouldShow && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

    </div>
  )
}
