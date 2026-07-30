"use client"

import { EmptyState } from "@/components/shared/EmptyState"
import { ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl max-w-md w-full">
        <EmptyState 
          icon={ShieldAlert}
          title="Unauthorized Access"
          description="Your current session does not have the required administrative privileges to view this area."
          action={
            <Link 
              href="/"
              className="mt-2 bg-slate-950 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-md inline-block"
            >
              Return Home
            </Link>
          }
        />
      </div>
    </div>
  )
}
