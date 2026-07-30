"use client"

import { useEffect } from "react"
import { useRecentlyViewed } from "@/lib/contexts/RecentlyViewedContext"

export function RecentlyViewedTracker({ yachtId }: { yachtId: string }) {
  const { addRecentYacht } = useRecentlyViewed()

  useEffect(() => {
    // Small timeout to ensure it doesn't block critical rendering path
    const timer = setTimeout(() => {
      addRecentYacht(yachtId)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [yachtId, addRecentYacht])

  return null
}
