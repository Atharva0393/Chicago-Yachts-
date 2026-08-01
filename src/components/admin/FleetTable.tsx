"use client"

import { useState } from "react"
import { Yacht } from "@/types"
import { createYacht, updateYacht, deleteYacht } from "@/actions/fleet"
import { Edit2, Trash2, Plus, Anchor, CalendarClock, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import { SlideOver } from "@/components/ui/slide-over"
import { YachtForm } from "@/components/admin/YachtForm"
import { YachtFormValues } from "@/lib/validations/yacht"
import Image from "next/image"

export function FleetTable({ initialYachts }: { initialYachts: Yacht[] }) {
  const [yachts, setYachts] = useState<Yacht[]>(initialYachts)
  
  // SlideOver State
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [editingYacht, setEditingYacht] = useState<Yacht | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleAdd = () => {
    setEditingYacht(null)
    setIsSlideOverOpen(true)
  }

  const handleEdit = (yacht: Yacht) => {
    setEditingYacht(yacht)
    setIsSlideOverOpen(true)
  }

  const handleClose = () => {
    setIsSlideOverOpen(false)
    setEditingYacht(null)
  }

  const handleSubmit = async (data: YachtFormValues) => {
    setIsSubmitting(true)
    try {
      if (editingYacht) {
        const res = await updateYacht(editingYacht.id, data)
        if (res.success && res.yacht) {
          setYachts(yachts.map(y => y.id === editingYacht.id ? res.yacht! : y))
          handleClose()
        } else {
          alert(res.error || "Failed to update yacht")
        }
      } else {
        const res = await createYacht(data)
        if (res.success && res.yacht) {
          setYachts([...yachts, res.yacht])
          handleClose()
        } else {
          alert(res.error || "Failed to create yacht")
        }
      }
    } catch (error) {
      alert("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this yacht? It will be removed from the public fleet but historical records will be preserved.")) return

    setDeleteId(id)
    try {
      const res = await deleteYacht(id)
      if (res.success) {
        setYachts(yachts.filter(y => y.id !== id))
      } else {
        alert(res.error || "Failed to delete yacht")
      }
    } catch (err) {
      alert("An unexpected error occurred.")
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Manage Fleet</h2>
        <button
          onClick={handleAdd}
          className="bg-slate-950 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Yacht
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900">
              <tr>
                <th className="px-6 py-4 font-semibold">Yacht</th>
                <th className="px-6 py-4 font-semibold">Specs</th>
                <th className="px-6 py-4 font-semibold">Capacity</th>
                <th className="px-6 py-4 font-semibold">Price/Hr</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {yachts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Anchor className="h-8 w-8 text-slate-300 mb-3" />
                      <p>No yachts found in the fleet.</p>
                    </div>
                  </td>
                </tr>
              )}

              {yachts.map(yacht => (
                <tr key={yacht.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 rounded overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {yacht.images && yacht.images.length > 0 ? (
                          <Image src={yacht.images[0]} alt={yacht.name} fill className="object-cover" />
                        ) : (
                          <Anchor className="h-4 w-4 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{yacht.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{yacht.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{yacht.manufacturer} {yacht.model}</div>
                    <div className="text-xs text-slate-500 mt-1">{yacht.length}ft • {yacht.year}</div>
                  </td>
                  <td className="px-6 py-4">{yacht.capacity} Guests</td>
                  <td className="px-6 py-4 font-medium text-slate-900">${yacht.pricePerHour}/hr</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1">
                      {!yacht.isActive && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          Inactive
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        yacht.availabilityStatus === 'Available Today' ? 'bg-emerald-100 text-emerald-800' :
                        yacht.availabilityStatus === 'Few Dates Left' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {yacht.availabilityStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/fleet/${yacht.id}/availability`}
                        className="p-2 text-slate-400 hover:text-green-600 bg-white hover:bg-green-50 rounded-lg shadow-sm border border-slate-200 transition-colors"
                        title="Manage Availability"
                      >
                        <Calendar className="w-4 h-4" />
                      </Link>
                      
                      <Link 
                        href={`/admin/fleet/${yacht.id}/pricing`}
                        className="p-2 text-slate-400 hover:text-purple-600 bg-white hover:bg-purple-50 rounded-lg shadow-sm border border-slate-200 transition-colors"
                        title="Manage Pricing Rules"
                      >
                        <DollarSign className="w-4 h-4" />
                      </Link>
                      
                      <button 
                        onClick={() => handleEdit(yacht)}
                        className="p-2 text-slate-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-lg shadow-sm border border-slate-200 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(yacht.id)}
                        disabled={deleteId === yacht.id}
                        className="p-2 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-lg shadow-sm border border-slate-200 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlideOver 
        isOpen={isSlideOverOpen} 
        onClose={handleClose}
        title={editingYacht ? "Edit Yacht" : "Add New Yacht"}
      >
        <YachtForm 
          initialData={editingYacht || undefined} 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting} 
        />
        
        {/* Sticky Footer Actions for Form */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 flex justify-end gap-3 z-10">
          <button 
            type="button" 
            onClick={handleClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="yacht-form"
            disabled={isSubmitting}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Yacht"}
          </button>
        </div>
      </SlideOver>

    </div>
  )
}
