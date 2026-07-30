"use client"

import { EmptyState } from "@/components/shared/EmptyState"
import { CalendarDays, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BookingsPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight mb-2">Bookings & Invoices</h1>
        <p className="text-muted-foreground">Manage your past, present, and future charters.</p>
      </div>

      <div className="bg-background border border-border/50 rounded-3xl overflow-hidden shadow-sm">
        <EmptyState 
          icon={CalendarDays}
          title="No Past Bookings"
          description="You don't have any past bookings yet. Your upcoming charter history and invoices will appear here once completed."
          action={
            <Link 
              href="/fleet" 
              className="mt-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-colors flex items-center gap-2 group"
            >
              Book a Charter <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          }
        />
      </div>
    </div>
  )
}
