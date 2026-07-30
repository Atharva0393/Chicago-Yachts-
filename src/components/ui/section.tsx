import * as React from "react"
import { cn } from "@/lib/utils"

export function Section({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("py-16 md:py-24 lg:py-32", className)} {...props}>
      <div className="container">
        {children}
      </div>
    </section>
  )
}
