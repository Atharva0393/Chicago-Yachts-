"use client"

import { useState } from "react";
import { 
  respondVerificationAvailableAction, 
  respondVerificationUnavailableAction,
  findAlternativeYachtsAction
} from "@/actions/owner-verification";
import { CheckCircle2, XCircle, Clock, Loader2, Anchor, Calendar, User, Sparkles } from "lucide-react";

interface VerificationItem {
  id: string;
  requestedDate: string | Date;
  requestedTimeSlot: string;
  status: string;
  notes?: string | null;
  yacht: {
    id: string;
    name: string;
  };
  booking: {
    id: string;
    bookingReference: string;
    guestCount: number;
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string | null;
    };
  };
}

export function OwnerVerificationList({ initialVerifications }: { initialVerifications: VerificationItem[] }) {
  const [verifications, setVerifications] = useState<VerificationItem[]>(initialVerifications);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  
  // Alternatives modal state
  const [alternatives, setAlternatives] = useState<any[] | null>(null);
  const [activeYachtName, setActiveYachtName] = useState<string>("");

  const handleAvailable = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await respondVerificationAvailableAction(id);
      if (res.success) {
        setVerifications(prev => prev.filter(v => v.id !== id));
        alert("Owner availability confirmed! Booking is now CONFIRMED.");
      } else {
        alert(res.error || "Failed to confirm availability");
      }
    } catch (e: any) {
      alert("Unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnavailable = async (id: string) => {
    if (!declineReason.trim()) {
      alert("Please provide a reason for unavailability.");
      return;
    }
    setLoadingId(id);
    try {
      const res = await respondVerificationUnavailableAction(id, declineReason);
      if (res.success) {
        const item = verifications.find(v => v.id === id);
        if (item) {
          // Fetch alternative yachts for this date & capacity
          const altRes = await findAlternativeYachtsAction(item.yacht.id, new Date(item.requestedDate).toISOString(), item.booking.guestCount);
          if (altRes.success && altRes.alternatives) {
            setAlternatives(altRes.alternatives);
            setActiveYachtName(item.yacht.name);
          }
        }
        setVerifications(prev => prev.filter(v => v.id !== id));
        setDecliningId(null);
        setDeclineReason("");
      } else {
        alert(res.error || "Failed to update status");
      }
    } catch (e: any) {
      alert("Unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  if (verifications.length === 0 && !alternatives) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center py-8">
        <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-900">All Owner Verifications Clear</h4>
        <p className="text-xs text-slate-500 mt-1">No pending owner availability requests requiring action.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Alternatives Modal / Drawer Notification */}
      {alternatives && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl animate-in fade-in duration-300">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-amber-600" /> Alternative Yachts Found for {activeYachtName}
              </span>
              <p className="text-sm text-amber-900 mt-1">The following active yachts are available for the requested date and capacity:</p>
            </div>
            <button onClick={() => setAlternatives(null)} className="text-xs font-medium text-amber-800 hover:underline">Dismiss</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {alternatives.length === 0 ? (
              <span className="text-xs text-amber-700 col-span-2">No direct match available on this date for the guest capacity.</span>
            ) : (
              alternatives.map((y: any) => (
                <div key={y.id} className="bg-white p-3 rounded-xl border border-amber-200 flex justify-between items-center text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{y.name}</span>
                    <span className="text-slate-500">Up to {y.capacity} guests</span>
                  </div>
                  <span className="font-bold text-slate-900">${(Number(y.pricePerHour || 0) * 4).toLocaleString()} / 4h</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {verifications.map((item) => (
        <div key={item.id} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                <Clock className="h-3 w-3" /> PENDING OWNER CONFIRMATION
              </span>
              <span className="text-xs font-mono text-slate-400">Ref: {item.booking.bookingReference || item.booking.id}</span>
            </div>
            <h4 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Anchor className="h-4 w-4 text-slate-400" /> {item.yacht.name}
            </h4>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-400" /> {new Date(item.requestedDate).toLocaleDateString()}</span>
              <span>Time Slot: {item.requestedTimeSlot}</span>
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-slate-400" /> Customer: {item.booking.customer.firstName} {item.booking.customer.lastName}</span>
              <span>{item.booking.guestCount} Guests</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {decliningId === item.id ? (
              <div className="flex flex-col gap-2 w-full md:w-80">
                <input 
                  type="text" 
                  placeholder="Reason for unavailability..." 
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setDecliningId(null)} className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1">Cancel</button>
                  <button onClick={() => handleUnavailable(item.id)} disabled={loadingId === item.id} className="bg-red-600 text-white text-xs px-3 py-1 rounded-lg font-semibold flex items-center gap-1">
                    {loadingId === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />} Submit Unavailable
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleAvailable(item.id)}
                  disabled={loadingId === item.id}
                  className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {loadingId === item.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} AVAILABLE
                </button>
                <button
                  onClick={() => setDecliningId(item.id)}
                  disabled={loadingId === item.id}
                  className="flex-1 md:flex-none px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <XCircle className="h-3.5 w-3.5" /> UNAVAILABLE
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
