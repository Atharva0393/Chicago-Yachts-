"use client"

import { BookingData } from "./BookingWizard"
import { ArrowLeft, Lock } from "lucide-react"

interface Props {
  bookingData: BookingData;
  onNext: () => void;
  onBack: () => void;
  totalPrice: number;
}

export function StepPayment({ bookingData, onNext, onBack, totalPrice }: Props) {
  
  const handleSimulatedPayment = () => {
    // In Phase 2, this is where Stripe Elements submission would happen
    onNext();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-medium tracking-tight mb-2">Secure Payment</h2>
        <p className="text-muted-foreground">Complete your booking securely via Stripe.</p>
      </div>

      {/* Stripe Placeholder UI */}
      <div className="w-full flex flex-col gap-6 mb-10 bg-background border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
        
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-success bg-success/10 py-2 px-4 rounded-full w-fit mx-auto mb-2">
          <Lock className="h-4 w-4" /> 256-bit Secure Encryption
        </div>
        
        <div className="flex flex-col gap-4 border-y border-border/50 py-8 my-4 relative">
          <div className="absolute inset-0 bg-muted/20 z-0 flex items-center justify-center">
             {/* This watermark makes it clear it's a placeholder for Phase 2 */}
             <span className="text-2xl font-bold text-muted-foreground/20 rotate-[-15deg] pointer-events-none select-none">STRIPE INTEGRATION IN PHASE 2</span>
          </div>
          
          <div className="flex flex-col gap-2 relative z-10 opacity-60 pointer-events-none">
            <label className="text-sm font-medium">Card Number</label>
            <div className="h-12 w-full bg-background border border-border rounded-xl px-4 flex items-center text-muted-foreground">
              •••• •••• •••• ••••
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 relative z-10 opacity-60 pointer-events-none">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Expiry</label>
              <div className="h-12 w-full bg-background border border-border rounded-xl px-4 flex items-center text-muted-foreground">
                MM / YY
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">CVC</label>
              <div className="h-12 w-full bg-background border border-border rounded-xl px-4 flex items-center text-muted-foreground">
                •••
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          By confirming this booking, you agree to our Terms of Service and Cancellation Policy. Your card will be charged ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.
        </p>

      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto md:justify-center">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 text-muted-foreground font-medium hover:text-foreground transition-colors h-14 px-8 w-full md:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={handleSimulatedPayment}
          className="group flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 h-14 rounded-full font-medium hover:bg-primary/90 transition-all shadow-[var(--shadow-premium)] w-full md:w-auto"
        >
          Confirm & Pay ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </button>
      </div>
    </div>
  )
}
