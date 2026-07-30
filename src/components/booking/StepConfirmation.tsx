"use client"

import { BookingData } from "./BookingWizard"
import { CheckCircle2, Copy, ExternalLink, Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Yacht } from "@/lib/constants/demo-data"

interface Props {
  bookingData: BookingData;
  yacht: Yacht;
}

export function StepConfirmation({ bookingData, yacht }: Props) {
  // Generate a mock booking reference
  const bookingRef = "CY-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const totalGuests = bookingData.guests.adults + bookingData.guests.children;

  return (
    <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center w-full max-w-2xl mx-auto">
      
      {/* Success Icon */}
      <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-success/20 rounded-full animate-ping opacity-20 duration-[3000ms]" />
        <CheckCircle2 className="h-12 w-12 text-success" />
      </div>

      <div className="text-center mb-10">
        <h2 className="text-4xl font-medium tracking-tight mb-4">Booking Confirmed</h2>
        <p className="text-muted-foreground text-lg">
          Get ready for an unforgettable experience on the <span className="font-semibold text-foreground">{yacht.name}</span>.
        </p>
      </div>

      <div className="w-full bg-background border border-border/50 rounded-3xl overflow-hidden shadow-sm mb-10">
        
        {/* Reference Header */}
        <div className="bg-muted/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/50">
          <div className="flex flex-col">
            <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-1">Booking Reference</span>
            <span className="text-xl font-mono font-semibold tracking-wider">{bookingRef}</span>
          </div>
          <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 bg-primary/10 px-4 py-2 rounded-full">
            <Copy className="h-3 w-3" /> Copy Ref
          </button>
        </div>

        {/* Itinerary Details */}
        <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-1">Date & Time</span>
              <span className="font-medium text-foreground">{bookingData.date ? format(bookingData.date, "MMMM do, yyyy") : ""}</span>
              <span className="text-muted-foreground">{bookingData.timeSlot}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-1">Departure</span>
              <span className="font-medium text-foreground">{yacht.location}</span>
              <span className="text-muted-foreground text-sm mt-1">Please arrive 15 mins prior.</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-1">Manifest</span>
              <span className="font-medium text-foreground">{totalGuests} Guests</span>
              <span className="text-muted-foreground text-sm mt-1">{bookingData.guests.adults} Adults, {bookingData.guests.children} Children</span>
            </div>
          </div>
        </div>
        
        {/* Next Steps CTA */}
        <div className="bg-primary/5 p-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
           <span className="text-sm font-medium text-muted-foreground">A confirmation email has been sent to you.</span>
           <button className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 hover:text-primary/80 transition-colors">
             View Itinerary <ExternalLink className="h-3 w-3" />
           </button>
        </div>
      </div>

      <Link 
        href="/fleet"
        className="text-muted-foreground font-medium hover:text-foreground transition-colors underline-offset-4 hover:underline"
      >
        Return to Fleet
      </Link>
    </div>
  )
}
