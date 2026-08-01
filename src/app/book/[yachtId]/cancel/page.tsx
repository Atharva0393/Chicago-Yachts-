"use client"

import { XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { use } from "react"

export default function CancelPage({ params }: { params: Promise<{ yachtId: string }> }) {
  const { yachtId } = use(params)

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="mx-auto w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Cancelled</h1>
        <p className="text-slate-500 mb-8">
          Your payment was cancelled and no charges were made. If you experienced an issue, you can try again.
        </p>

        <Link 
          href={`/book/${yachtId}`}
          className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-medium hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Return to Booking
        </Link>
      </div>
    </div>
  )
}
