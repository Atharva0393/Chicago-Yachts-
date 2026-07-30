"use client"

import { usePathname } from "next/navigation"
import { Bell, Search, User, Menu, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminTopNavProps {
  onMenuClick: () => void;
}

export function AdminTopNav({ onMenuClick }: AdminTopNavProps) {
  const pathname = usePathname()
  
  // Generate breadcrumbs from pathname
  const paths = pathname.split('/').filter(Boolean)
  
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 h-16 flex items-center px-4 md:px-8 justify-between">
      
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1.5 text-sm font-medium">
          {paths.map((path, index) => {
            const isLast = index === paths.length - 1
            const label = path.charAt(0).toUpperCase() + path.slice(1)
            
            return (
              <div key={path} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-4 w-4 text-slate-400" />}
                <span className={cn(
                  "capitalize",
                  isLast ? "text-slate-900" : "text-slate-500"
                )}>
                  {label}
                </span>
              </div>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="h-10 w-64 bg-slate-100/50 border border-slate-200 rounded-full pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
        
        {/* Mobile Search Icon */}
        <button className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 bg-slate-950 rounded-full flex items-center justify-center text-white text-xs font-bold border border-slate-200">
            A
          </div>
        </button>
      </div>
      
    </header>
  )
}
