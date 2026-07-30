"use client"

import { BookingData } from "./BookingWizard"
import { Calendar } from "@/components/ui/calendar"
import { ArrowRight } from "lucide-react"
import { addDays, isBefore, startOfDay } from "date-fns"

interface Props {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  onNext: () => void;
}

export function StepDate({ bookingData, setBookingData, onNext }: Props) {
  const today = startOfDay(new Date());
  const maxDate = addDays(today, 90); // Can book up to 90 days in advance

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setBookingData(prev => ({ ...prev, date }));
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-medium tracking-tight mb-2">When would you like to sail?</h2>
        <p className="text-muted-foreground">Select an available date for your charter.</p>
      </div>

      <div className="bg-background rounded-3xl border border-border/50 p-4 md:p-8 shadow-sm mb-8 w-full max-w-md">
        <Calendar
          mode="single"
          selected={bookingData.date || undefined}
          onSelect={handleSelect}
          disabled={(date) => isBefore(date, today) || date > maxDate}
          className="mx-auto"
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
          }}
        />
      </div>

      <button
        onClick={onNext}
        disabled={!bookingData.date}
        className="group flex items-center gap-2 bg-foreground text-background px-8 h-14 rounded-full font-medium hover:bg-foreground/90 transition-all shadow-[var(--shadow-premium)] disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center"
      >
        Continue to Time
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
