"use client"

import { useState } from "react"
import { Customer, Booking } from "@/types"
import { CustomerProfile } from "./CustomerProfile"
import { Search, Filter, MoreHorizontal, Mail, Phone, Calendar } from "lucide-react"
import { updateCustomerStatus } from "@/actions/crm"

interface KanbanBoardProps {
  customers: Customer[]
  bookings: Booking[]
}

const COLUMNS: { id: Customer["status"]; label: string; color: string }[] = [
  { id: "LEAD", label: "Lead", color: "bg-blue-500" },
  { id: "CONTACTED", label: "Contacted", color: "bg-purple-500" },
  { id: "QUALIFIED", label: "Qualified", color: "bg-orange-500" },
  { id: "CONVERTED", label: "Converted", color: "bg-emerald-500" },
  { id: "LOST", label: "Lost", color: "bg-red-500" },
]

export function KanbanBoard({ customers, bookings }: KanbanBoardProps) {
  const [search, setSearch] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  const handleDragStart = (e: React.DragEvent, customerId: string) => {
    e.dataTransfer.setData("customerId", customerId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, status: Customer["status"]) => {
    e.preventDefault()
    const customerId = e.dataTransfer.getData("customerId")
    if (customerId && status) {
      // Optimistic update could go here if we used a local state, 
      // but Server Actions with revalidatePath will handle it quickly enough for this mock.
      await updateCustomerStatus(customerId, status)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lead Pipeline</h1>
          <p className="text-sm text-slate-500">Drag and drop customers to update their status.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or tag..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 h-full min-w-max pb-4">
          
          {COLUMNS.map(col => {
            const colCustomers = filteredCustomers.filter(c => (c.status || "LEAD") === col.id)
            
            return (
              <div 
                key={col.id} 
                className="w-80 flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.color}`} />
                    <h3 className="font-semibold text-slate-900">{col.label}</h3>
                  </div>
                  <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                    {colCustomers.length}
                  </span>
                </div>

                {/* Column Content */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {colCustomers.map(customer => {
                    const ltv = bookings.filter(b => b.customerId === customer.id && b.status === "COMPLETED").reduce((sum, b) => sum + b.totalPrice, 0)
                    
                    return (
                      <div 
                        key={customer.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, customer.id)}
                        onClick={() => setSelectedCustomer(customer)}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-slate-900 group-hover:text-primary transition-colors">{customer.name}</h4>
                          <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-1.5 text-xs text-slate-500 mb-3">
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 truncate">
                            <Phone className="h-3.5 w-3.5 shrink-0" /> <span>{customer.phone}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-1">
                            {customer.tags?.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                                {tag}
                              </span>
                            ))}
                            {(customer.tags?.length || 0) > 2 && (
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                                +{(customer.tags?.length || 0) - 2}
                              </span>
                            )}
                          </div>
                          {ltv > 0 && (
                            <span className="text-xs font-medium text-slate-900">${ltv.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Drop Zone Indicator (invisible until drag) */}
                  <div className="h-20 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 hidden opacity-0 transition-opacity"></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Customer Profile SlideOver */}
      <CustomerProfile 
        customer={selectedCustomer} 
        bookings={selectedCustomer ? bookings.filter(b => b.customerId === selectedCustomer.id) : []}
        isOpen={!!selectedCustomer} 
        onClose={() => setSelectedCustomer(null)} 
      />

    </div>
  )
}
