import { EmptyState } from "@/components/shared/EmptyState"
import { Star } from "lucide-react"

export function ReviewsEmptyState() {
  return (
    <div className="bg-background border border-border/50 rounded-3xl overflow-hidden shadow-sm">
      <EmptyState 
        icon={Star}
        title="No Reviews Yet"
        description="This vessel doesn't have any reviews yet. Be the first to book a charter and share your luxury experience with others."
      />
    </div>
  )
}
