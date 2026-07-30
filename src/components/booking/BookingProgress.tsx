"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  currentStep: number;
}

const STEPS = [
  "Date",
  "Time",
  "Guests",
  "Payment",
  "Confirm"
];

export function BookingProgress({ currentStep }: Props) {
  return (
    <div className="w-full py-8">
      <div className="flex justify-between items-center relative">
        
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-border z-0" />
        
        {/* Progress Fill Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-primary z-0 transition-all duration-700 ease-in-out"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500",
                  isCompleted ? "bg-primary text-primary-foreground scale-100" : 
                  isCurrent ? "bg-primary text-primary-foreground shadow-[0_0_0_4px_var(--primary-10)] scale-110" : 
                  "bg-background border-2 border-border text-muted-foreground scale-100"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <span className={cn(
                "text-[10px] uppercase font-bold tracking-widest absolute -bottom-6 w-max text-center transition-colors duration-300",
                isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
              )}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  )
}
