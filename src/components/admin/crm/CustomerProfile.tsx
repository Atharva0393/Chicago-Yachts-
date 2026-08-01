"use client"

import { useState } from "react"
import { Customer, Booking } from "@/types"
import { SlideOver } from "@/components/ui/slide-over"
import { Mail, Phone, Calendar, Clock, MapPin, Anchor, MessageSquare, Plus, Activity } from "lucide-react"
import { addCustomerNote, updateCustomerStatus } from "@/actions/crm"

interface CustomerProfileProps {
  customer: Customer | null
  bookings: Booking[]
  isOpen: boolean
  onClose: () => void
}

const STATUS_COLORS = {
  LEAD: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-purple-100 text-purple-700",
  QUALIFIED: "bg-orange-100 text-orange-700",
  CONVERTED: "bg-emerald-100 text-emerald-700",
  LOST: "bg-red-100 text-red-700",
}

export function CustomerProfile({ customer, bookings, isOpen, onClose }: CustomerProfileProps) {
  const [newNote, setNewNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!customer) return null

  // Calculate LTV (Lifetime Value) - sum of COMPLETED bookings
  const ltv = bookings
    .filter(b => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.totalPrice, 0)

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setIsSubmitting(true)
    try {
      await addCustomerNote(customer.id, newNote)
      setNewNote("")
    } catch (e) {
      console.error(e)
      alert("Failed to add note")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Customer["status"]
    try {
      await updateCustomerStatus(customer.id, newStatus)
    } catch (error) {
      console.error(error)
      alert("Failed to update status")
    }
  }

  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title="Customer Profile">
      <div className="flex flex-col h-full bg-slate-50">
        
        {/* Header Section */}
        <div className="bg-white p-6 border-b border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{customer.name}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {customer.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {customer.phone}</span>
              </div>
            </div>
            
            {/* Status Dropdown */}
            <select
              value={customer.status || "LEAD"}
              onChange={handleStatusChange}
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full outline-none cursor-pointer border ${STATUS_COLORS[customer.status || "LEAD"]}`}
            >
              <option value="LEAD">Lead</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="CONVERTED">Converted</option>
              <option value="LOST">Lost</option>
            </select>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-xs font-medium text-slate-500 uppercase mb-1">Lifetime Value</div>
              <div className="text-xl font-bold text-slate-900">${ltv.toLocaleString()}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-xs font-medium text-slate-500 uppercase mb-1">Total Bookings</div>
              <div className="text-xl font-bold text-slate-900">{bookings.length}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-xs font-medium text-slate-500 uppercase mb-1">Member Since</div>
              <div className="text-xl font-bold text-slate-900">{new Date(customer.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* LEFT: Booking History */}
          <div className="p-6 border-r border-slate-200 overflow-y-auto">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Anchor className="w-4 h-4 text-primary" /> Booking History
            </h3>
            
            {bookings.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No bookings found for this customer.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{booking.yacht?.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                        booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 space-y-1">
                      <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(booking.date).toLocaleDateString()}</div>
                      <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {booking.timeSlot}</div>
                      <div className="flex items-center gap-2 text-slate-900 font-medium mt-2 pt-2 border-t border-slate-100">
                        ${booking.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Notes & Activity */}
          <div className="p-6 overflow-y-auto bg-slate-50">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Notes & Activity
            </h3>
            
            {/* Add Note Input */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
              <textarea 
                className="w-full text-sm outline-none resize-none bg-transparent placeholder:text-slate-400"
                rows={3}
                placeholder="Add a note about this customer..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
              />
              <div className="flex justify-end mt-2 pt-2 border-t border-slate-100">
                <button 
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || isSubmitting}
                  className="bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> {isSubmitting ? "Saving..." : "Add Note"}
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              
              {/* Combine notes and activities and sort chronologically */}
              {[...(customer.notes || []).map(n => ({ ...n, _type: 'note' })), 
                ...(customer.activities || []).map(a => ({ ...a, _type: 'activity' }))]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(item => (
                  <div key={item.id} className="relative flex items-start gap-4">
                    <div className="absolute left-0 w-10 h-10 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shrink-0 shadow-sm z-10 ${item._type === 'note' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                        {item._type === 'note' ? <MessageSquare className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                      </div>
                    </div>
                    <div className="ml-12 bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-900">
                          {item._type === 'note' ? (item as any).author : (item as any).type}
                        </span>
                        <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-600">
                        {item._type === 'note' ? (item as any).content : (item as any).description}
                      </p>
                    </div>
                  </div>
                ))}
                
              {(!customer.notes?.length && !customer.activities?.length) && (
                <div className="text-center text-sm text-slate-400 py-4 italic">No notes or activities yet.</div>
              )}
            </div>

          </div>
        </div>
      </div>
    </SlideOver>
  )
}
