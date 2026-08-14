"use client"
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBooking } from "@/lib/contexts/BookingContext";

function getInitialChicagoDate() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric' });
  const parts = formatter.formatToParts(now);
  let month = now.getMonth();
  let year = now.getFullYear();
  for (const p of parts) {
    if (p.type === 'month') month = parseInt(p.value, 10) - 1;
    if (p.type === 'year') year = parseInt(p.value, 10);
  }
  return { month, year };
}

export function AvailabilityCalendar() {
  const { 
    yachtId, selectedDate, setSelectedDate, duration, availableSlots, isLoadingAvailability, fetchAvailability 
  } = useBooking();
  const initial = getInitialChicagoDate();
  const [currentMonth, setCurrentMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);
  
  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const firstDay = new Date(year, currentMonth, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const handlePrevMonth = () => {
    let newM = currentMonth - 1;
    let newY = year;
    if (newM < 0) {
      newM = 11;
      newY = year - 1;
    }
    setCurrentMonth(newM);
    setYear(newY);
    fetchAvailability(yachtId, newM, newY);
  };

  const handleNextMonth = () => {
    let newM = currentMonth + 1;
    let newY = year;
    if (newM > 11) {
      newM = 0;
      newY = year + 1;
    }
    setCurrentMonth(newM);
    setYear(newY);
    fetchAvailability(yachtId, newM, newY);
  };

  const monthLabel = new Date(year, currentMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  // Status reading from availableSlots service data
  const getStatus = (day: number) => {
    const dateStr = `${year}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Check if day is in the past using Chicago timezone
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric' });
    const parts = formatter.formatToParts(now);
    let cY = now.getFullYear(), cM = now.getMonth() + 1, cD = now.getDate();
    for (const p of parts) {
      if (p.type === 'year') cY = parseInt(p.value, 10);
      if (p.type === 'month') cM = parseInt(p.value, 10);
      if (p.type === 'day') cD = parseInt(p.value, 10);
    }
    const todayStr = `${cY}-${String(cM).padStart(2, '0')}-${String(cD).padStart(2, '0')}`;
    if (dateStr < todayStr) return 'booked';

    const dayData = availableSlots[dateStr];
    
    if (isLoadingAvailability) return 'loading';
    if (!dayData) return 'booked'; // Default to booked if no data
    
    // Check if ANY slot is available or pending
    const hasAvailable = Object.values(dayData.slots).some(s => s === 'available');
    const hasPending = Object.values(dayData.slots).some(s => s === 'pending');

    if (!hasAvailable && !hasPending) return 'booked';
    if (!hasAvailable && hasPending) return 'pending';
    
    return 'available';
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(year, currentMonth, day);
    
    if (selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentMonth && 
        selectedDate.getFullYear() === year) {
      setSelectedDate(null);
    } else {
      setSelectedDate(newDate);
    }
  };

  return (
    <section className="py-10 border-b border-slate-100">
      <h2 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">Availability</h2>
      <p className="text-slate-500 font-light mb-8">Minimum {duration}-hour charter duration required.</p>
      
      <div className="max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-slate-900">{monthLabel}</span>
          <button 
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Next Month"
          >
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
            const isSelected = selectedDate?.getDate() === d && selectedDate?.getMonth() === currentMonth;
            
            return (
              <button 
                key={d} 
                onClick={() => handleDayClick(d)}
                className={`
                  h-10 w-10 mx-auto rounded-full text-sm font-medium transition-colors flex items-center justify-center
                  ${isSelected ? 'bg-slate-900 text-white shadow-md hover:bg-slate-800' : ''}
                  ${!isSelected && status === 'available' ? 'text-slate-900 hover:bg-slate-100' : ''}
                  ${!isSelected && status === 'booked' ? 'text-slate-300 line-through cursor-not-allowed' : ''}
                  ${!isSelected && status === 'pending' ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : ''}
                  ${!isSelected && status === 'loading' ? 'text-slate-300 animate-pulse' : ''}
                `}
                disabled={status === 'booked' || status === 'loading'}
              >
                {d}
              </button>
            )
          })}
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-900" /> Selected</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full border border-slate-300" /> Available</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-200" /> Booked</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Pending</div>
        </div>
      </div>
    </section>
  );
}
