import { EmptyState } from "@/components/shared/EmptyState"
import { Bell } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="animate-in fade-in duration-500 min-h-[600px] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-medium tracking-tight mb-2">Notifications</h1>
        <p className="text-muted-foreground">Alerts regarding your bookings, payments, and account.</p>
      </div>

      <div className="bg-background border border-border/50 rounded-3xl flex-1 flex flex-col justify-center overflow-hidden shadow-sm">
        <EmptyState 
          icon={Bell}
          title="You're all caught up"
          description="You don't have any unread notifications at this time. We will alert you here if there are any updates regarding your charters."
        />
      </div>
    </div>
  )
}
