"use client"

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AvailabilityCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  
  const daysInMonth = 31;
  const firstDay = 3; // Wednesday start for mock data
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  // Mock availability: 1 = Available, 2 = Booked, 3 = Pending
  const getStatus = (day: number) => {
    if (day % 7 === 0 || day % 5 === 0) return 'booked';
    if (day % 11 === 0) return 'pending';
    return 'available';
  };

  return (
    <section className="py-10 border-b border-slate-100">
      <h2 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">Availability</h2>
      <p className="text-slate-500 font-light mb-8">Minimum 4-hour charter duration required.</p>
      
      <div className="max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-slate-900">August 2026</span>
          <button className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-y-4 text-center mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {blanks.map(b => (
            <div key={`blank-${b}`} className="h-10 w-10 mx-auto" />
          ))}
          {days.map(d => {
            const status = getStatus(d);
            return (
              <button 
                key={d} 
                className={`
                  h-10 w-10 mx-auto rounded-full text-sm font-medium transition-colors flex items-center justify-center
                  ${status === 'available' ? 'text-slate-900 hover:bg-slate-100' : ''}
                  ${status === 'booked' ? 'text-slate-300 line-through cursor-not-allowed' : ''}
                  ${status === 'pending' ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : ''}
                `}
                disabled={status === 'booked'}
              >
                {d}
              </button>
            )
          })}
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-900" /> Available</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-200" /> Booked</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Pending</div>
        </div>
      </div>
    </section>
  );
}
