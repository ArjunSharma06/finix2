"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import MainContent from "@/components/main-content"
import RightSidebar from "@/components/right-sidebar"
import { Menu, LogOut } from "lucide-react"
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
          <MainContent />
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
