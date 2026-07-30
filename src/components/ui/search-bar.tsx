import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export function SearchBar({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex w-full max-w-sm items-center", className)}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Search yachts..." className="pl-9 rounded-full bg-muted/50" />
    </div>
  )
}
