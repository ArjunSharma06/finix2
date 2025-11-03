"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import MainContent from "@/components/main-content"
import RightSidebar from "@/components/right-sidebar"
import { Menu, LogOut, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  const handleLogout = () => {
    router.push("/landing")
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 to-blue-50">
      {/* Left Sidebar */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden bg-white border-r border-slate-200 shadow-sm`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-slate-900" />
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 text-slate-900" />
            <span className="font-medium text-slate-900">Logout</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto flex gap-6 bg-gradient-to-br from-blue-100 to-blue-50 p-6">
            <div className="flex-1 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-semibold text-foreground">Quick Insights</h2>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-muted/50 to-transparent rounded-lg border border-border/50">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-primary">Subscription Overlap</span>
                      <span className="text-xs font-semibold text-emerald-600">Save ₹299/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Consolidate streaming services to optimize spending</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-muted/50 to-transparent rounded-lg border border-border/50">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-primary">Food Delivery</span>
                      <span className="text-xs font-semibold text-emerald-600">Save ₹450/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Switch to subscription plans for better value</p>
                  </div>
                </div>
              </div>
              {/* Main Content Component */}
              <MainContent />
            </div>
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
