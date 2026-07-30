"use client"

import { Yacht } from "@/lib/constants/demo-data";
import { BookingData } from "./BookingWizard";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, Clock, Users, ShieldCheck } from "lucide-react";

interface Props {
  yacht: Yacht;
  bookingData: BookingData;
}

export function BookingSummary({ yacht, bookingData }: Props) {
  const totalGuests = bookingData.guests.adults + bookingData.guests.children;
  
  // Base price calculation (4 hours)
  const duration = 4;
  const basePrice = yacht.pricePerHour * duration;
  
  // Premium time slot surcharge (e.g. sunset is +15%)
  const timeSurcharge = bookingData.timeSlot === "Sunset (4:00 PM - 8:00 PM)" ? basePrice * 0.15 : 0;
  
  const subtotal = basePrice + timeSurcharge;
  const taxes = subtotal * 0.09; // 9% tax
  const total = subtotal + taxes;

  return (
    <div className="bg-muted/30 rounded-3xl p-6 border border-border/50 sticky top-28 shadow-sm">
      <h3 className="text-xl font-medium tracking-tight mb-6">Booking Summary</h3>
      
      {/* Yacht Mini Card */}
      <div className="flex gap-4 items-center mb-8 pb-8 border-b border-border/50">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
          <Image src={yacht.images[0]} alt={yacht.name} fill className="object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">{yacht.name}</span>
          <span className="text-sm text-muted-foreground">{yacht.length} ft • Up to {yacht.capacity} Guests</span>
        </div>
      </div>

      {/* Selected Details */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">Date</span>
            <span className="font-medium">{bookingData.date ? format(bookingData.date, "EEEE, MMMM do, yyyy") : "Select a date"}</span>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">Time ({duration} Hours)</span>
            <span className="font-medium">{bookingData.timeSlot || "Select a time"}</span>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">Guests</span>
            <span className="font-medium">{totalGuests > 0 ? `${totalGuests} Guests` : "Select guests"}</span>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="flex flex-col gap-3 pb-6 border-b border-border/50 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">${yacht.pricePerHour.toLocaleString()} x {duration} hrs</span>
          <span>${basePrice.toLocaleString()}</span>
        </div>
        {timeSurcharge > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Premium Slot Surcharge</span>
            <span>${timeSurcharge.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Taxes & Fees</span>
          <span>${taxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="font-medium">Total</span>
        <span className="text-2xl font-semibold">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background p-3 rounded-lg border border-border/50">
        <ShieldCheck className="h-4 w-4 text-success" />
        <span>Fully refundable within 48 hours of booking.</span>
      </div>
    </div>
  )
}
