"use client"

import { BookingData } from "./BookingWizard"
import { ArrowRight, ArrowLeft, Plus, Minus } from "lucide-react"

interface Props {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  onNext: () => void;
  onBack: () => void;
  maxCapacity: number;
}

export function StepGuests({ bookingData, setBookingData, onNext, onBack, maxCapacity }: Props) {
  const totalGuests = bookingData.guests.adults + bookingData.guests.children;

  const updateGuests = (type: 'adults' | 'children', increment: number) => {
    setBookingData(prev => {
      const current = prev.guests[type];
      const newAmount = current + increment;
      
      // Validation constraints
      if (newAmount < 0) return prev;
      if (type === 'adults' && newAmount < 1) return prev; // Must have at least 1 adult
      if (increment > 0 && totalGuests >= maxCapacity) return prev; // Cannot exceed capacity

      return {
        ...prev,
        guests: {
          ...prev.guests,
          [type]: newAmount
        }
      };
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-medium tracking-tight mb-2">Who is coming?</h2>
        <p className="text-muted-foreground">This yacht can accommodate up to {maxCapacity} guests.</p>
      </div>

      <div className="w-full flex flex-col gap-6 mb-10 bg-background border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
        
        {/* Adults Counter */}
        <div className="flex items-center justify-between pb-6 border-b border-border/50">
          <div className="flex flex-col">
            <span className="font-semibold text-lg">Adults</span>
            <span className="text-sm text-muted-foreground">Age 13 and above</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => updateGuests('adults', -1)}
              disabled={bookingData.guests.adults <= 1}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center font-semibold text-lg">{bookingData.guests.adults}</span>
            <button 
              onClick={() => updateGuests('adults', 1)}
              disabled={totalGuests >= maxCapacity}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Children Counter */}
        <div className="flex items-center justify-between pb-6 border-b border-border/50">
          <div className="flex flex-col">
            <span className="font-semibold text-lg">Children</span>
            <span className="text-sm text-muted-foreground">Ages 2-12</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => updateGuests('children', -1)}
              disabled={bookingData.guests.children <= 0}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center font-semibold text-lg">{bookingData.guests.children}</span>
            <button 
              onClick={() => updateGuests('children', 1)}
              disabled={totalGuests >= maxCapacity}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Special Requests */}
        <div className="flex flex-col gap-2 pt-2">
          <label htmlFor="requests" className="font-semibold text-lg">Special Requests</label>
          <span className="text-sm text-muted-foreground mb-2">Dietary requirements, celebrations, etc.</span>
          <textarea 
            id="requests"
            rows={3}
            placeholder="Let us know how we can make your trip special..."
            className="w-full rounded-xl border border-border bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            value={bookingData.specialRequests}
            onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
          />
        </div>

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
          onClick={onNext}
          disabled={totalGuests < 1}
          className="group flex items-center justify-center gap-2 bg-foreground text-background px-8 h-14 rounded-full font-medium hover:bg-foreground/90 transition-all shadow-[var(--shadow-premium)] disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
        >
          Continue to Payment
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
