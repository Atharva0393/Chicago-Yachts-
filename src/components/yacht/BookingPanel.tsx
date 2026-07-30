import React from "react";
import { Calendar as CalendarIcon, Clock, Users, ChevronDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingBreakdownProps {
  basePrice: number;
  captainFee: number;
  cleaningFee: number;
}

export function PricingBreakdown({ basePrice, captainFee, cleaningFee }: PricingBreakdownProps) {
  const taxes = (basePrice + captainFee + cleaningFee) * 0.11; // 11% mock tax
  const total = basePrice + captainFee + cleaningFee + taxes;

  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="flex justify-between text-slate-600 font-light">
        <span className="underline decoration-slate-200">Base Charter (4 hrs)</span>
        <span>${basePrice.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-slate-600 font-light">
        <span className="underline decoration-slate-200">Captain & Crew</span>
        <span>${captainFee.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-slate-600 font-light">
        <span className="underline decoration-slate-200">Cleaning Fee</span>
        <span>${cleaningFee.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-slate-600 font-light">
        <span className="underline decoration-slate-200">Taxes & Fees</span>
        <span>${taxes.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
      </div>
      
      <div className="border-t border-slate-100 my-2" />
      
      <div className="flex justify-between text-slate-900 font-medium">
        <span>Estimated Total</span>
        <span>${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
      </div>
    </div>
  );
}

interface BookingPanelProps {
  pricePerHour: number;
  basePrice: number;
}

export function BookingPanel({ pricePerHour, basePrice }: BookingPanelProps) {
  return (
    <div className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-3xl p-6 sticky top-28">
      
      {/* Price Header */}
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-2xl font-semibold text-slate-900">${basePrice.toLocaleString()}</span>
        <span className="text-sm font-light text-slate-500">/ 4 hours</span>
      </div>

      {/* Inputs */}
      <div className="border border-slate-300 rounded-2xl overflow-hidden mb-6">
        
        {/* Date Row */}
        <div className="flex border-b border-slate-300">
          <div className="flex-1 p-3 cursor-pointer hover:bg-slate-50 transition-colors border-r border-slate-300">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 block mb-1">Check-in Date</span>
            <div className="text-sm text-slate-500">Select date</div>
          </div>
          <div className="flex-1 p-3 cursor-pointer hover:bg-slate-50 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 block mb-1">Duration</span>
            <div className="text-sm text-slate-500 flex items-center justify-between">
              4 hours <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Time & Guests Row */}
        <div className="flex">
          <div className="flex-1 p-3 cursor-pointer hover:bg-slate-50 transition-colors border-r border-slate-300">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 block mb-1">Time Slot</span>
            <div className="text-sm text-slate-500 flex items-center justify-between">
              Afternoon <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex-1 p-3 cursor-pointer hover:bg-slate-50 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 block mb-1">Guests</span>
            <div className="text-sm text-slate-500 flex items-center justify-between">
              12 Guests <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium transition-luxury hover-lift shadow-md mb-4 text-base">
        Reserve Now
      </Button>

      <p className="text-center text-xs text-slate-500 font-light mb-6">You won't be charged yet</p>

      <PricingBreakdown basePrice={basePrice} captainFee={250} cleaningFee={150} />

      <div className="mt-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            <span className="text-slate-900">Free cancellation</span> up to 7 days before your experience.
          </p>
        </div>
      </div>

    </div>
  );
}
