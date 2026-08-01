"use client"
import React from "react";
import { Calendar as CalendarIcon, Clock, Users, ChevronDown, CheckCircle2, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/lib/contexts/BookingContext";
import { useParams, useRouter } from "next/navigation";

export function PricingBreakdown() {
  const { quote, quoteStatus } = useBooking();

  if (quoteStatus === "LOADING") {
    return <div className="flex justify-center items-center h-24 mt-4"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  if (quoteStatus === "UNAVAILABLE") {
    return <div className="text-red-500 text-sm mt-4 text-center">The selected time slot is unavailable.</div>;
  }

  if (quoteStatus === "PRICING_NOT_CONFIGURED" || !quote) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 mt-4 animate-in fade-in">
      <div className="flex justify-between text-slate-600 font-light text-sm">
        <span className="underline decoration-slate-200">Base Charter ({quote.duration} hrs)</span>
        <span>${parseFloat(quote.baseCharter).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      
      {parseFloat(quote.addons) > 0 && (
        <div className="flex justify-between text-slate-600 font-light text-sm">
          <span className="underline decoration-slate-200">Luxury Add-ons</span>
          <span>+${parseFloat(quote.addons).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      )}

      {parseFloat(quote.taxAmount) > 0 && (
        <div className="flex justify-between text-slate-600 font-light text-sm">
          <span className="underline decoration-slate-200">Taxes</span>
          <span>${parseFloat(quote.taxAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      )}
      
      {parseFloat(quote.serviceFee) > 0 && (
        <div className="flex justify-between text-slate-600 font-light text-sm">
          <span className="underline decoration-slate-200">Service Fee</span>
          <span>${parseFloat(quote.serviceFee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      )}
      
      <div className="border-t border-slate-100 my-2" />
      
      <div className="flex justify-between text-slate-900 font-medium">
        <span>Estimated Total</span>
        <span>${parseFloat(quote.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}

export function BookingPanel() {
  const { quote, quoteStatus } = useBooking();
  const params = useParams();
  const router = useRouter();
  
  const slug = params?.slug as string;

  const handleStartBooking = () => {
    if (slug) {
      router.push(`/book/${slug}`);
    }
  };

  const isBookable = quoteStatus === "SUCCESS" && quote;

  return (
    <div className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-3xl p-6 sticky top-28">
      
      {/* Price Header */}
      <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-100">
        <span className="text-3xl font-semibold text-slate-900">
          {quote ? `$${parseFloat(quote.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Select Dates'}
        </span>
        {quote && <span className="text-sm font-light text-slate-500">total</span>}
      </div>

      <Button 
        onClick={handleStartBooking}
        disabled={!isBookable}
        className="w-full h-14 rounded-full font-medium transition-all duration-300 shadow-premium mb-4 text-lg bg-slate-900 hover:bg-slate-800 text-white hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isBookable ? "Book Now" : (quoteStatus === "LOADING" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Select a Time")}
      </Button>

      <p className="text-center text-xs text-slate-500 font-light mb-6">You won't be charged yet</p>

      <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          <span className="text-slate-900">Free cancellation</span> up to 7 days before your experience.
        </p>
      </div>

    </div>
  );
}
