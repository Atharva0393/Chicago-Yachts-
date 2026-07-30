import { EmptyState } from "@/components/shared/EmptyState"
import { MessageSquare, ExternalLink } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="animate-in fade-in duration-500 min-h-[600px] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-medium tracking-tight mb-2">Messages</h1>
        <p className="text-muted-foreground">Communicate with your assigned captains and concierge.</p>
      </div>

      <div className="bg-background border border-border/50 rounded-3xl flex-1 flex flex-col justify-center overflow-hidden shadow-sm">
        <EmptyState 
          icon={MessageSquare}
          title="No Messages"
          description="Your inbox is completely empty. Once you book a charter, you'll be able to communicate directly with your captain here."
          action={
            <button className="mt-2 text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:opacity-80 transition-opacity">
              Contact General Support <ExternalLink className="h-4 w-4" />
            </button>
          }
        />
      </div>
    </div>
  )
}
