"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CalendarDays, Heart, MessageSquare, Settings, LifeBuoy, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { name: "Overview", href: "/customer", icon: LayoutDashboard },
  { name: "Bookings & Invoices", href: "/customer/bookings", icon: CalendarDays },
  { name: "Wishlist", href: "/customer/saved", icon: Heart },
  { name: "Messages", href: "/customer/messages", icon: MessageSquare, badge: 2 },
  { name: "Profile Settings", href: "/customer/settings", icon: Settings },
]

export function CustomerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full md:w-64 shrink-0 flex flex-col gap-8 md:sticky md:top-28 md:h-[calc(100vh-8rem)]">
      
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-4 mb-2">Dashboard</span>
        <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide gap-1 md:gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            // Exact match for overview, prefix match for others to keep active state on sub-pages
            const isActive = item.href === "/customer" ? pathname === item.href : pathname.startsWith(item.href)
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap shrink-0 group relative",
                  isActive 
                    ? "bg-foreground text-background shadow-md" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-background" : "text-muted-foreground group-hover:text-foreground")} />
                {item.name}
                
                {item.badge && (
                  <span className={cn(
                    "ml-auto text-xs font-bold px-2 py-0.5 rounded-full",
                    isActive ? "bg-background/20 text-background" : "bg-primary text-primary-foreground"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="hidden md:flex flex-col gap-1 mt-auto pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-4 mb-2">Support</span>
        <Link
          href="/support"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <LifeBuoy className="h-5 w-5" />
          Help Center
        </Link>
        <button
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all text-left w-full"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
