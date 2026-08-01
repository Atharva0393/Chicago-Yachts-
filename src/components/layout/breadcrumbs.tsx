import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function Breadcrumbs({ items, className }: { items: { label: string, href?: string }[], className?: string }) {
  return (
    <nav className={cn("flex text-sm text-muted-foreground", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground transition-colors">{item.label}</Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
