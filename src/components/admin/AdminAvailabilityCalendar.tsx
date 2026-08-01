"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { getAdminAvailability, AdminDayAvailability } from "@/actions/availability";
import { SlideOver } from "@/components/ui/slide-over";
import { DayAvailabilityEditor } from "./DayAvailabilityEditor";
import { Yacht } from "@/types";

interface AdminAvailabilityCalendarProps {
  yacht: Yacht;
}

export function AdminAvailabilityCalendar({ yacht }: AdminAvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const [availability, setAvailability] = useState<Record<string, AdminDayAvailability>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminAvailability(yacht.id, currentMonth, currentYear);
      setAvailability(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentMonth, currentYear, yacht.id]);

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Manage Availability</h2>
            <p className="text-sm text-slate-500">Configuring calendar for <span className="font-medium text-slate-900">{yacht.name}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-600">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="w-32 text-center font-semibold text-slate-900">
            {monthName} {currentYear}
          </div>
          <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-600">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-6 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
          </div>
        )}

        <div className="grid grid-cols-7 gap-y-4 text-center mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-xs font-bold uppercase tracking-widest text-slate-400">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-3">
          {blanks.map(b => (
            <div key={`blank-${b}`} className="min-h-[100px]" />
          ))}
          
          {days.map(d => {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayData = availability[dateStr];
            
            const isConfigured = !!dayData?.id;
            const isBlocked = dayData?.isBlocked;

            return (
              <button 
                key={d} 
                onClick={() => setSelectedDateStr(dateStr)}
                className={`
                  min-h-[100px] border rounded-xl p-3 flex flex-col items-start transition-all hover:-translate-y-0.5 hover:shadow-md
                  ${!isConfigured ? 'bg-slate-50 border-dashed border-slate-200' : ''}
                  ${isConfigured && !isBlocked ? 'bg-white border-emerald-200 ring-1 ring-emerald-50' : ''}
                  ${isConfigured && isBlocked ? 'bg-red-50/30 border-red-200' : ''}
                `}
              >
                <span className={`text-sm font-bold mb-2 ${!isConfigured ? 'text-slate-400' : 'text-slate-900'}`}>{d}</span>
                
                <div className="flex-1 w-full flex flex-col gap-1">
                  {!isConfigured && (
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 rounded px-1.5 py-0.5 self-start">
                      Not Configured
                    </span>
                  )}
                  {isConfigured && isBlocked && (
                    <span className="text-[10px] font-medium text-red-600 bg-red-100 rounded px-1.5 py-0.5 self-start">
                      Blocked
                    </span>
                  )}
                  {isConfigured && !isBlocked && (
                    <>
                      {dayData.slotsConfig.Morning.exists && <div className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-left truncate">Morning</div>}
                      {dayData.slotsConfig.Afternoon.exists && <div className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-left truncate">Afternoon</div>}
                      {dayData.slotsConfig.Evening.exists && <div className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-left truncate">Evening</div>}
                      {!dayData.slotsConfig.Morning.exists && !dayData.slotsConfig.Afternoon.exists && !dayData.slotsConfig.Evening.exists && (
                        <span className="text-[10px] text-slate-400">Open (No slots)</span>
                      )}
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Editor SlideOver */}
      <SlideOver 
        isOpen={!!selectedDateStr} 
        onClose={() => setSelectedDateStr(null)}
        title=""
      >
        {selectedDateStr && (
          <DayAvailabilityEditor 
            yachtId={yacht.id}
            dateStr={selectedDateStr}
            initialData={availability[selectedDateStr]}
            onClose={() => setSelectedDateStr(null)}
            onSaved={() => {
              setSelectedDateStr(null);
              loadData();
            }}
          />
        )}
      </SlideOver>

    </div>
  );
}
