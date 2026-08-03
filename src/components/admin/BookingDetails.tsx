import { Booking } from "@/types"
import { CheckCircle2, XCircle, Clock, Loader2, Calendar, User, Anchor, DollarSign, MapPin, Phone, Mail, Activity } from "lucide-react"
import Image from "next/image"

import { useState, useEffect } from "react"
import { recordManualBalancePayment } from "@/actions/payments"
import { getBookingDetailed } from "@/actions/booking-details"
import { cancelBooking, addBookingNote } from "@/actions/bookings"

interface BookingDetailsProps {
  booking: Booking & { remainingAmount?: number }
  onUpdateStatus: (id: string, status: Booking["status"]) => Promise<void>
  isLoading: boolean
}

export function BookingDetails({ booking: initialBooking, onUpdateStatus, isLoading }: BookingDetailsProps) {
  
  const [detailedBooking, setDetailedBooking] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    getBookingDetailed(initialBooking.id).then(res => {
      if (res.success) {
        setDetailedBooking(res.booking);
        setActivities(res.activities || []);
      }
      setIsFetching(false);
    });
  }, [initialBooking.id]);

  const booking = detailedBooking || initialBooking;
  
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "CONFIRMED":
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle2 className="h-3.5 w-3.5" /> {status}</span>
      case "PENDING":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="h-3.5 w-3.5" /> {status}</span>
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="h-3.5 w-3.5" /> {status}</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status}</span>
    }
  }

  // Derived financial values
  const totalAmount = booking.totalPrice || 0;
  const remainingAmount = (booking as any).remainingAmount ?? 0;
  const totalCollected = totalAmount - remainingAmount;
  const depositPaid = totalCollected > 0 ? (totalCollected > totalAmount * 0.3 ? totalAmount * 0.3 : totalCollected) : 0;
  const depositRequired = totalAmount * 0.3;
  const balanceDueDate = booking.date;

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>(remainingAmount.toString());
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // Cancellation State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Notes State
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Sync paymentAmount if remainingAmount changes
  useEffect(() => {
    setPaymentAmount(remainingAmount.toString());
  }, [remainingAmount]);

  const handleRecordPayment = async () => {
    const amountNum = parseFloat(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Invalid payment amount.");
      return;
    }
    if (amountNum > remainingAmount) {
      alert("Payment amount cannot exceed remaining balance.");
      return;
    }

    setIsPaying(true);
    try {
      const res = await recordManualBalancePayment({
        bookingId: booking.id,
        amount: amountNum,
        method: paymentMethod as any,
        notes: paymentNotes
      });
      if (res.success) {
        alert("Payment recorded successfully.");
        setShowPaymentModal(false);
        // We trigger an update conceptually, or let the parent re-fetch.
        // For simplicity we just reload the page in this demo.
        window.location.reload();
      } else {
        alert((res as any).error || "Failed to record payment.");
      }
    } catch (e: any) {
      alert(e.message || "An error occurred.");
    } finally {
      setIsPaying(false);
    }
  }

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a cancellation reason.");
      return;
    }
    setIsCancelling(true);
    const res = await cancelBooking(booking.id, cancelReason);
    if (res.success) {
      alert("Booking cancelled successfully.");
      window.location.reload();
    } else {
      alert(res.error || "Failed to cancel.");
      setIsCancelling(false);
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsAddingNote(true);
    const res = await addBookingNote(booking.id, newNote);
    if (res.success) {
      setNewNote("");
      // Reload timeline
      getBookingDetailed(booking.id).then(r => {
        if(r.success) { setDetailedBooking(r.booking); setActivities(r.activities || []); }
      });
    } else {
      alert(res.error);
    }
    setIsAddingNote(false);
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      
      {/* Header Actions */}
      <div className="p-6 bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Booking {booking.id}</span>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-slate-900">{booking.customer?.name}</h3>
              {getStatusBadge(booking.status)}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {booking.status === "PENDING" && (
            <>
              <button 
                onClick={() => onUpdateStatus(booking.id, "CONFIRMED")}
                disabled={isLoading}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Confirm
              </button>
              <button 
                onClick={() => setShowCancelModal(true)}
                disabled={isLoading}
                className="flex-1 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shadow-sm"
              >
                Cancel
              </button>
            </>
          )}
          {booking.status === "CONFIRMED" && (
            <>
              <button 
                onClick={() => onUpdateStatus(booking.id, "IN_PROGRESS")}
                disabled={isLoading}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shadow-sm"
              >
                Start Charter
              </button>
              <button 
                onClick={() => setShowCancelModal(true)}
                disabled={isLoading}
                className="flex-1 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shadow-sm"
              >
                Cancel
              </button>
            </>
          )}
          {booking.status === "IN_PROGRESS" && (
            <button 
              onClick={() => onUpdateStatus(booking.id, "COMPLETED")}
              disabled={isLoading}
              className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shadow-sm"
            >
              Mark as Completed
            </button>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto">
        
        {/* Customer Info */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2"><User className="h-4 w-4 text-slate-400" /> Customer Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-900">{booking.customer?.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500">Phone</span>
              <a href={`tel:${booking.customer?.phone}`} className="font-medium text-primary hover:underline flex items-center gap-1">
                <Phone className="h-3 w-3" /> {booking.customer?.phone}
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500">Email</span>
              <a href={`mailto:${booking.customer?.email}`} className="font-medium text-primary hover:underline flex items-center gap-1">
                <Mail className="h-3 w-3" /> {booking.customer?.email}
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500">Customer Since</span>
              <span className="font-medium text-slate-900">{booking.customer ? new Date(booking.customer.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Yacht & Schedule */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2"><Anchor className="h-4 w-4 text-slate-400" /> Charter Details</h4>
          
          <div className="flex items-center gap-4 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-slate-200 shrink-0">
              {booking.yacht?.images?.[0] && (
                <Image src={booking.yacht.images?.[0]} alt={booking.yacht.name} fill className="object-cover" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900">{booking.yacht?.name}</span>
              <span className="text-xs text-slate-500">{booking.yacht?.manufacturer} {booking.yacht?.model} • {booking.yacht?.length}ft</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Date</span>
              <span className="font-medium text-slate-900">{new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Time Slot</span>
              <span className="font-medium text-slate-900">{booking.timeSlot} ({booking.duration}h)</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 flex items-center gap-1"><User className="h-3.5 w-3.5" /> Guests</span>
              <span className="font-medium text-slate-900">{booking.guests} People</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Departure</span>
              <span className="font-medium text-slate-900">{booking.yacht?.location || "Burnham Harbor"}</span>
            </div>
          </div>
        </div>

        {/* Financials */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          {booking.status === 'CANCELLED' && totalCollected > 0 && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-between">
              <span>REFUND REVIEW REQUIRED</span>
              <span>Collected: ${totalCollected.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2"><DollarSign className="h-4 w-4 text-slate-400" /> Receivables Summary</h4>
            {remainingAmount > 0 && booking.status !== "CANCELLED" && (
              <button 
                onClick={() => setShowPaymentModal(!showPaymentModal)}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Record Payment
              </button>
            )}
          </div>

          {showPaymentModal && (
            <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3">
              <h5 className="text-sm font-medium text-slate-900">Record Manual Payment</h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-500">Amount to Collect ($)</label>
                  <input type="number" step="0.01" max={remainingAmount} value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-500">Payment Method</label>
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="ZELLE">Zelle</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-500">Optional Notes</label>
                <input type="text" placeholder="e.g. Received from John" value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)} className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
                <button onClick={handleRecordPayment} disabled={isPaying} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
                  {isPaying ? "Recording..." : "Confirm Payment"}
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Charter Price</span>
              <span className="font-medium text-slate-900">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Deposit Paid (Required: ${depositRequired.toLocaleString(undefined, { minimumFractionDigits: 2 })})</span>
              <span className="font-medium text-slate-900">${depositPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Collected</span>
              <span className="font-medium text-emerald-600">${totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center py-2 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-base">Remaining Balance</span>
                <span className="text-xs text-slate-500">Due {new Date(balanceDueDate).toLocaleDateString()}</span>
              </div>
              <span className={`font-bold text-lg ${remainingAmount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                ${remainingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-slate-400" /> Timeline</h4>
          
          <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-slate-100 ml-2 mt-4">
            {isFetching ? (
              <span className="text-sm text-slate-400">Loading timeline...</span>
            ) : activities.length > 0 ? (
              activities.map((act: any) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-slate-300 border-2 border-white"></div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-slate-900">{act.description}</span>
                    <span className="text-xs text-slate-500">{new Date(act.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-sm text-slate-400">No activity recorded.</span>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">Internal Notes</h4>
          {detailedBooking?.customerNotes && (
            <div className="mb-4 bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-800 text-sm">
              <strong>Customer Requests:</strong> {detailedBooking.customerNotes}
            </div>
          )}
          {detailedBooking?.internalNotes && (
            <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 text-sm">
              <strong>Internal:</strong> {detailedBooking.internalNotes}
            </div>
          )}
          
          <div className="flex flex-col gap-3 mb-4">
            {detailedBooking?.notes?.map((n: any) => (
              <div key={n.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm flex flex-col gap-1">
                <span className="text-slate-700">{n.content}</span>
                <span className="text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col gap-2">
            <textarea 
              className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900" 
              placeholder="Add an internal note..." 
              rows={2}
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
            />
            <button onClick={handleAddNote} disabled={isAddingNote} className="self-end px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-medium transition-colors">
              {isAddingNote ? "Adding..." : "Add Note"}
            </button>
          </div>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-red-600 flex items-center gap-2"><XCircle className="h-5 w-5" /> Cancel Booking</h3>
              <p className="text-sm text-slate-600">Are you sure you want to cancel Booking {booking.id}? This will release the TimeSlots back into inventory.</p>
              {totalCollected > 0 && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium">
                  Warning: ${totalCollected.toLocaleString()} has been collected. You must manually handle the refund.
                </div>
              )}
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-sm font-medium text-slate-700">Cancellation Reason <span className="text-red-500">*</span></label>
                <textarea 
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="e.g. Weather conditions, customer requested..."
                  className="w-full h-24 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Go Back</button>
                <button onClick={handleCancelBooking} disabled={isCancelling} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
                  {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
