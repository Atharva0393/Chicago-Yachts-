"use client";

import { useState } from "react";
import { AdminDayAvailability, SetDayAvailabilityData, setDayAvailability } from "@/actions/availability";

interface DayAvailabilityEditorProps {
  yachtId: string;
  dateStr: string; // YYYY-MM-DD
  initialData?: AdminDayAvailability;
  onClose: () => void;
  onSaved: () => void;
}

export function DayAvailabilityEditor({ yachtId, dateStr, initialData, onClose, onSaved }: DayAvailabilityEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // if no id, it's not configured
  const [isConfigured, setIsConfigured] = useState(!!initialData?.id);
  const [isBlocked, setIsBlocked] = useState(initialData?.isBlocked || false);
  const [notes, setNotes] = useState(initialData?.notes || "");
  
  const [slots, setSlots] = useState({
    Morning: initialData?.slotsConfig?.Morning?.exists || false,
    Afternoon: initialData?.slotsConfig?.Afternoon?.exists || false,
    Evening: initialData?.slotsConfig?.Evening?.exists || false,
  });

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const payload: SetDayAvailabilityData = {
        isConfigured,
        isBlocked,
        notes,
        slots
      };
      
      const res = await setDayAvailability(yachtId, dateStr, payload);
      if (res.success) {
        onSaved();
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save availability");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">Availability for {dateStr}</h3>
          <p className="text-sm text-slate-500">Configure whether this yacht can be booked on this date.</p>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input 
              type="radio" 
              name="status"
              className="h-4 w-4 text-slate-900 focus:ring-slate-900"
              checked={!isConfigured}
              onChange={() => setIsConfigured(false)}
            />
            <div>
              <div className="font-medium text-slate-900">Not Configured (Unavailable)</div>
              <div className="text-xs text-slate-500">The yacht will not appear as bookable for this date.</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input 
              type="radio" 
              name="status"
              className="h-4 w-4 text-red-600 focus:ring-red-600"
              checked={isConfigured && isBlocked}
              onChange={() => {
                setIsConfigured(true);
                setIsBlocked(true);
              }}
            />
            <div>
              <div className="font-medium text-slate-900">Blocked (Maintenance / Internal)</div>
              <div className="text-xs text-slate-500">Actively blocked for the entire day.</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input 
              type="radio" 
              name="status"
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-600"
              checked={isConfigured && !isBlocked}
              onChange={() => {
                setIsConfigured(true);
                setIsBlocked(false);
              }}
            />
            <div>
              <div className="font-medium text-slate-900">Open for Booking</div>
              <div className="text-xs text-slate-500">Select specific time slots below.</div>
            </div>
          </label>
        </div>

        {isConfigured && !isBlocked && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <h4 className="font-medium text-slate-900">Available Time Slots</h4>
            
            <div className="space-y-3">
              {(["Morning", "Afternoon", "Evening"] as const).map(slot => (
                <label key={slot} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${slots[slot] ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-600 rounded border-slate-300"
                      checked={slots[slot]}
                      onChange={(e) => setSlots({ ...slots, [slot]: e.target.checked })}
                    />
                    <div className="font-medium text-slate-900">{slot}</div>
                  </div>
                  
                  {initialData?.slotsConfig[slot]?.isBlocked && (
                     <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">Booked / Pending</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {isConfigured && (
          <div className="space-y-2 animate-in fade-in duration-300">
            <label className="text-sm font-medium text-slate-700">Internal Notes (Optional)</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none resize-none"
              rows={3}
              placeholder="e.g., Routine maintenance, VIP hold..."
            />
          </div>
        )}
      </div>
      
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
        <button 
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Availability"}
        </button>
      </div>
    </div>
  );
}
