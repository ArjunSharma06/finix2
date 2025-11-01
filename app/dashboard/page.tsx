"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import MainContent from "@/components/main-content"
import RightSidebar from "@/components/right-sidebar"
import { Menu, LogOut } from "lucide-react"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden bg-white border-r border-border`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
            <LogOut className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex gap-6 bg-background">
          <MainContent />
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
