"use client"

import { useEffect, useState, use } from "react"
import { CheckCircle2, Home, Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { updateBookingStatus } from "@/actions/bookings"

export default function SuccessPage({ params, searchParams }: { params: Promise<{ yachtId: string }>, searchParams: Promise<{ session_id?: string, bookingId?: string }> }) {
  const { yachtId } = use(params)
  const query = use(searchParams)
  
  const [isConfirming, setIsConfirming] = useState(true)

  useEffect(() => {
    // In a real app, the webhook handles this securely.
    // For this mock without a live webhook, we optimistically confirm the booking on the success page if bookingId is present.
    async function confirmMockBooking() {
      if (query.bookingId) {
        try {
          await updateBookingStatus(query.bookingId, "CONFIRMED")
        } catch (e) {
          console.error("Failed to mock confirm booking", e)
        }
      }
      setIsConfirming(false)
    }

    confirmMockBooking()
  }, [query.bookingId])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="mx-auto w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
        <p className="text-slate-500 mb-8">
          Your deposit has been processed successfully. We've sent a confirmation email with all the details.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 space-y-4 border border-slate-100">
          <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">What's Next?</h3>
          
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Mark your calendar</p>
              <p className="text-xs text-slate-500">Your charter is officially reserved in our system.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Arrival Instructions</p>
              <p className="text-xs text-slate-500">Please arrive 15 minutes before your departure time at Burnham Harbor.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Remaining Balance</p>
              <p className="text-xs text-slate-500">The remaining 70% balance will be collected 48 hours before departure.</p>
            </div>
          </div>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-medium hover:bg-slate-800 transition-colors"
        >
          <Home className="w-5 h-5" /> Return Home
        </Link>
      </div>
    </div>
  )
}
