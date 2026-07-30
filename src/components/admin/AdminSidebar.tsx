"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  CalendarDays, 
  Anchor, 
  Users, 
  CreditCard,
  Settings, 
  LogOut,
  MessageSquare,
  BarChart3,
  CalendarClock,
  Tags,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { name: "Fleet", href: "/admin/fleet", icon: Anchor },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "CRM", href: "/admin/crm", icon: MessageSquare, badge: 5 },
  { name: "Pricing", href: "/admin/pricing", icon: Tags },
  { name: "Calendar", href: "/admin/calendar", icon: CalendarClock },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
]

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-[280px] md:w-64 h-full flex flex-col bg-slate-950 text-slate-400 py-6 border-r border-slate-900 shadow-2xl md:shadow-none">
      
      {/* Brand Header */}
      <div className="px-6 mb-8 flex items-center justify-between gap-3">
        <Link href="/" className="font-bold text-xl tracking-tighter text-white">
          CY<span className="text-primary">.</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-bold tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded-full">Admin</span>
          {onClose && (
            <button onClick={onClose} className="md:hidden p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-1 px-4 overflow-y-auto scrollbar-hide">
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href)
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 group relative text-sm",
                  isActive 
                    ? "bg-slate-800 text-white" 
                    : "hover:bg-slate-900 hover:text-slate-200"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300")} />
                {item.name}
                
                {item.badge && (
                  <span className={cn(
                    "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full",
                    isActive ? "bg-primary text-primary-foreground" : "bg-slate-800 text-white group-hover:bg-slate-700"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-1 mt-auto px-4 border-t border-slate-800/50 pt-4 pb-2">
        <Link
          href="/admin/settings"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-sm group",
            pathname.startsWith("/admin/settings") ? "bg-slate-800 text-white" : "hover:bg-slate-900 hover:text-slate-200"
          )}
        >
          <Settings className={cn("h-4 w-4", pathname.startsWith("/admin/settings") ? "text-primary" : "text-slate-500 group-hover:text-slate-300")} />
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium hover:bg-red-950/30 hover:text-red-400 transition-all text-left w-full text-sm group"
        >
          <LogOut className="h-4 w-4 text-slate-500 group-hover:text-red-400" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
