"use client"
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useBooking } from "@/lib/contexts/BookingContext";
import { Loader2, Check } from "lucide-react";

export function MobileBookingBar() {
  const params = useParams();
  const router = useRouter();
  
  const { quote, quoteStatus } = useBooking();
  
  const slug = params?.slug as string;

  const handleStartBooking = () => {
    if (slug) {
      router.push(`/book/${slug}`);
    }
  };

  const isBookable = quoteStatus === "SUCCESS" && quote;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-4 pb-safe lg:hidden flex justify-between items-center shadow-[0_-4px_20px_rgb(0,0,0,0.05)]">
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-semibold text-slate-900">
            {quote ? `$${parseFloat(quote.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Select Dates'}
          </span>
          {quote && <span className="text-sm font-light text-slate-500">total</span>}
        </div>
      </div>
      <button 
        onClick={handleStartBooking}
        disabled={!isBookable}
        className="px-8 py-3 rounded-full font-medium shadow-md transition-all duration-300 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isBookable ? "Book Now" : "Select Time"}
      </button>
    </div>
  );
}
