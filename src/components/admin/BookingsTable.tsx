"use client"

import { useState, useMemo } from "react"
import { Booking } from "@/types"
import { updateBookingStatus } from "@/actions/bookings"
import { CheckCircle2, XCircle, Clock, Calendar, Search, Filter, Eye } from "lucide-react"
import { SlideOver } from "@/components/ui/slide-over"
import { BookingDetails } from "@/components/admin/BookingDetails"
import { Input } from "@/components/ui/input"
import { toZonedTime, format } from "date-fns-tz"
import { isBefore, startOfDay } from "date-fns"

export function BookingsTable({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  
  // SlideOver State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)

  const handleStatusUpdate = async (id: string, status: Booking["status"]) => {
    setLoadingId(id)
    try {
      const res = await updateBookingStatus(id, status)
      if (res.success && res.booking) {
        const updatedBookings = bookings.map(b => b.id === id ? { ...b, bookingStatus: res.booking!.bookingStatus } : b)
        setBookings(updatedBookings)
        if (selectedBooking?.id === id) {
          setSelectedBooking(updatedBookings.find(b => b.id === id) || null)
        }
      } else {
        alert(res.error || "Failed to update booking")
      }
    } catch (err) {
      alert("An unexpected error occurred.")
    } finally {
      setLoadingId(null)
    }
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsSlideOverOpen(true)
  }

  // Derived filtered data
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // 1. Status Filter
      if (statusFilter !== "ALL") {
        if (statusFilter === "PENDING" && booking.status !== "PENDING") return false;
        if (statusFilter === "CONFIRMED" && booking.status !== "CONFIRMED") return false;
        if (statusFilter === "COMPLETED" && booking.status !== "COMPLETED") return false;
        if (statusFilter === "CANCELLED" && booking.status !== "CANCELLED") return false;

        // Financial Filters
        if (statusFilter === "PAID" && booking.paymentStatus !== "PAID") return false;
        
        if (statusFilter === "ALL_OUTSTANDING" && (booking.paymentStatus === "PAID" || (booking as any).remainingAmount <= 0)) return false;

        const isOutstanding = booking.paymentStatus !== "PAID" && (booking as any).remainingAmount > 0;
        
        if (statusFilter === "DUE_TODAY" || statusFilter === "UPCOMING" || statusFilter === "OVERDUE") {
          if (!isOutstanding) return false;
          
          const TIMEZONE = "America/Chicago";
          const dueZoned = toZonedTime(new Date(booking.date), TIMEZONE);
          const nowZoned = toZonedTime(new Date(), TIMEZONE);
          const todayString = format(nowZoned, 'yyyy-MM-dd', { timeZone: TIMEZONE });
          const dueString = format(dueZoned, 'yyyy-MM-dd', { timeZone: TIMEZONE });
          
          const isToday = dueString === todayString;
          const isOverdue = isBefore(dueZoned, startOfDay(nowZoned)); // Past days

          if (statusFilter === "DUE_TODAY" && !isToday) return false;
          if (statusFilter === "OVERDUE" && (isToday || !isOverdue)) return false;
          if (statusFilter === "UPCOMING" && (isToday || isOverdue)) return false;
        }
      }

      // 2. Search Filter (ID, Customer Name, Customer Email)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesId = booking.id.toLowerCase().includes(query);
        const matchesName = booking.customer?.name.toLowerCase().includes(query);
        const matchesEmail = booking.customer?.email.toLowerCase().includes(query);
        if (!matchesId && !matchesName && !matchesEmail) return false;
      }
      
      return true
    })
  }, [bookings, statusFilter, searchQuery])

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
    <div className="flex flex-col gap-6">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 shrink-0">Manage Bookings</h2>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search bookings, customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-[280px]"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full sm:w-[160px] rounded-md border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="ALL_OUTSTANDING">All Outstanding</option>
              <option value="DUE_TODAY">Due Today</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="OVERDUE">Overdue</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900">
              <tr>
                <th className="px-6 py-4 font-semibold">Booking ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Yacht</th>
                <th className="px-6 py-4 font-semibold">Schedule</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Calendar className="h-8 w-8 text-slate-300 mb-3" />
                      <p>No bookings found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredBookings.map(booking => (
                <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs font-medium text-slate-500">{booking.id}</div>
                    <div className="text-xs text-slate-400 mt-1">{new Date(booking.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{booking.customer?.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{booking.customer?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 line-clamp-1">{booking.yacht?.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{booking.guests} Guests</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{new Date(booking.date).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-500 mt-1">{booking.timeSlot}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    ${booking.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      {getStatusBadge(booking.status)}
                      {booking.paymentStatus === "PAID" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">PAID IN FULL</span>
                      ) : booking.paymentStatus === "PARTIAL" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-200 w-fit">PARTIAL / BALANCE DUE</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 w-fit">{booking.paymentStatus}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleViewDetails(booking)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlideOver 
        isOpen={isSlideOverOpen} 
        onClose={() => setIsSlideOverOpen(false)}
        title="Booking Details"
      >
        {selectedBooking && (
          <BookingDetails 
            booking={selectedBooking} 
            onUpdateStatus={handleStatusUpdate}
            isLoading={loadingId === selectedBooking.id}
          />
        )}
      </SlideOver>

    </div>
  )
}
