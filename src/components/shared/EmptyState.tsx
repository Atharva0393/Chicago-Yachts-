"use client"

import React from "react"
import { LucideIcon } from "lucide-react"

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Luxury Animated Icon Presentation */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-primary/5 rounded-full scale-[1.8] animate-pulse duration-[3000ms]" />
        <div className="absolute inset-0 bg-primary/10 rounded-full scale-[1.4]" />
        <div className="relative h-24 w-24 bg-background border border-border/50 rounded-full flex items-center justify-center shadow-sm z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
          <Icon className="h-10 w-10 text-primary stroke-[1.5]" />
        </div>
      </div>

      {/* Typography */}
      <div className="text-center max-w-md px-4 mb-8">
        <h3 className="text-2xl font-medium tracking-tight mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground text-base leading-relaxed">
          {description}
        </p>
      </div>

      {/* Optional CTA */}
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
      
    </div>
  )
}
