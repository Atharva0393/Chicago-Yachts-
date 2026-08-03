"use client"

import { useState } from "react"
import { Booking } from "@/types"
import { SlideOver } from "@/components/ui/slide-over"
import { BookingDetails } from "@/components/admin/BookingDetails"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { toZonedTime, format } from "date-fns-tz"
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns"
import { updateBookingStatus } from "@/actions/bookings"

interface CalendarClientProps {
  initialBookings: any[] // Mapped bookings
}

export function CalendarClient({ initialBookings }: CalendarClientProps) {
  const TIMEZONE = "America/Chicago"
  
  const [currentDate, setCurrentDate] = useState(() => {
    return toZonedTime(new Date(), TIMEZONE)
  })
  
  const [bookings, setBookings] = useState<any[]>(initialBookings)
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(toZonedTime(new Date(), TIMEZONE))

  const handleStatusUpdate = async (id: string, status: any) => {
    setLoadingId(id)
    try {
      const res = await updateBookingStatus(id, status)
      if (res.success && res.booking) {
        const updatedBookings = bookings.map(b => b.id === id ? { ...b, status: res.booking!.bookingStatus } : b)
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

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking)
    setIsSlideOverOpen(true)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-full min-h-[700px]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-slate-500" />
          {format(currentDate, 'MMMM yyyy', { timeZone: TIMEZONE })}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={goToToday} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
            Today
          </button>
          <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
            <button onClick={prevMonth} className="p-1.5 hover:bg-slate-50 transition-colors">
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div className="w-px h-5 bg-slate-200"></div>
            <button onClick={nextMonth} className="p-1.5 hover:bg-slate-50 transition-colors">
              <ChevronRight className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1">
        {calendarDays.map((day: Date, idx: number) => {
          const dayString = format(day, 'yyyy-MM-dd', { timeZone: TIMEZONE })
          const dayBookings = bookings.filter(b => {
            const bDateZoned = toZonedTime(b.date, TIMEZONE)
            return format(bDateZoned, 'yyyy-MM-dd', { timeZone: TIMEZONE }) === dayString
          })
          
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isTodayDate = isToday(day)

          return (
            <div 
              key={dayString} 
              className={`min-h-[120px] p-2 border-r border-b border-slate-100 flex flex-col gap-1 transition-colors ${!isCurrentMonth ? 'bg-slate-50/50' : 'bg-white'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isTodayDate ? 'bg-slate-900 text-white' : (isCurrentMonth ? 'text-slate-700' : 'text-slate-400')}`}>
                  {format(day, 'd', { timeZone: TIMEZONE })}
                </span>
                {dayBookings.length > 0 && (
                  <span className="text-xs font-semibold text-slate-400">{dayBookings.length}</span>
                )}
              </div>
              
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[100px] no-scrollbar">
                {dayBookings.map(b => (
                  <button
                    key={b.id}
                    onClick={() => handleViewDetails(b)}
                    className={`text-left text-xs px-2 py-1 rounded w-full truncate border ${
                      b.status === 'COMPLETED' ? 'bg-slate-100 border-slate-200 text-slate-600' :
                      b.status === 'CANCELLED' ? 'bg-red-50 border-red-100 text-red-600' :
                      b.status === 'IN_PROGRESS' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                      'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}
                  >
                    <span className="font-semibold">{b.timeSlot}</span> - {b.yacht}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
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
