"use client"

import { BookingData } from "./BookingWizard"
import { ArrowRight, ArrowLeft, Sun, Sunset, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  onNext: () => void;
  onBack: () => void;
}

const TIME_SLOTS = [
  { id: "Morning (9:00 AM - 1:00 PM)", label: "Morning", time: "9:00 AM - 1:00 PM", icon: Sun, surcharge: 0 },
  { id: "Afternoon (1:30 PM - 5:30 PM)", label: "Afternoon", time: "1:30 PM - 5:30 PM", icon: Sun, surcharge: 0 },
  { id: "Sunset (4:00 PM - 8:00 PM)", label: "Sunset Premium", time: "4:00 PM - 8:00 PM", icon: Sunset, surcharge: 15 },
  { id: "Night (8:30 PM - 12:30 AM)", label: "City Lights", time: "8:30 PM - 12:30 AM", icon: Moon, surcharge: 0 },
];

export function StepTime({ bookingData, setBookingData, onNext, onBack }: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-medium tracking-tight mb-2">Select your time slot</h2>
        <p className="text-muted-foreground">All charters are booked in 4-hour increments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
        {TIME_SLOTS.map((slot) => {
          const Icon = slot.icon;
          const isSelected = bookingData.timeSlot === slot.id;
          
          return (
            <button
              key={slot.id}
              onClick={() => setBookingData(prev => ({ ...prev, timeSlot: slot.id }))}
              className={cn(
                "flex items-center p-4 rounded-2xl border transition-all text-left group hover:border-primary/50 relative overflow-hidden",
                isSelected ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm" : "border-border bg-background"
              )}
            >
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center shrink-0 mr-4 transition-colors",
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}>
                <Icon className="h-6 w-6" />
              </div>
              
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-lg tracking-tight">{slot.label}</span>
                <span className="text-sm text-muted-foreground">{slot.time}</span>
              </div>
              
              {slot.surcharge > 0 && (
                <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                  +15% Premium
                </div>
              )}
            </button>
          )
        })}
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
          disabled={!bookingData.timeSlot}
          className="group flex items-center justify-center gap-2 bg-foreground text-background px-8 h-14 rounded-full font-medium hover:bg-foreground/90 transition-all shadow-[var(--shadow-premium)] disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
        >
          Continue to Guests
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
