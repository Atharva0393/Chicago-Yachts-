import { Booking } from "@/types"
import { CheckCircle2, XCircle, Clock, Loader2, Calendar, User, Anchor, DollarSign, MapPin, Phone, Mail, Activity } from "lucide-react"
import Image from "next/image"

interface BookingDetailsProps {
  booking: Booking
  onUpdateStatus: (id: string, status: Booking["status"]) => Promise<void>
  isLoading: boolean
}

export function BookingDetails({ booking, onUpdateStatus, isLoading }: BookingDetailsProps) {
  
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
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Approve
              </button>
              <button 
                onClick={() => onUpdateStatus(booking.id, "CANCELLED")}
                disabled={isLoading}
                className="flex-1 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shadow-sm"
              >
                Cancel
              </button>
            </>
          )}
          {booking.status === "CONFIRMED" && (
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
                <Image src={booking.yacht.images[0]} alt={booking.yacht.name} fill className="object-cover" />
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
          <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2"><DollarSign className="h-4 w-4 text-slate-400" /> Payment Summary</h4>
          
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Charter Rate ({booking.duration} hours)</span>
              <span className="font-medium text-slate-900">${(booking.yacht?.pricePerHour || 0) * booking.duration}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Taxes & Fees</span>
              <span className="font-medium text-slate-900">${(booking.totalPrice - ((booking.yacht?.pricePerHour || 0) * booking.duration))}</span>
            </div>
            <div className="flex justify-between items-center py-2 mt-2">
              <span className="font-bold text-slate-900 text-base">Total Processed</span>
              <span className="font-bold text-emerald-600 text-lg">${booking.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-slate-400" /> Timeline</h4>
          
          <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-slate-100 ml-2">
            
            <div className="relative">
              <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-slate-300 border-2 border-white"></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-slate-900">Booking Created</span>
                <span className="text-xs text-slate-500">{new Date(booking.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {booking.status !== "PENDING" && (
              <div className="relative mt-2">
                <div className={`absolute -left-[23px] top-1 h-3 w-3 rounded-full border-2 border-white ${booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-slate-900">
                    {booking.status === 'CONFIRMED' ? 'Approved by Admin' : booking.status === 'CANCELLED' ? 'Cancelled by Admin' : 'Marked Completed'}
                  </span>
                  <span className="text-xs text-slate-500">System generated</span>
                </div>
              </div>
            )}
            
            {booking.status === "COMPLETED" && (
              <div className="relative mt-2">
                <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white"></div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-slate-900">Charter Completed</span>
                  <span className="text-xs text-slate-500">Thank you message sent</span>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}
