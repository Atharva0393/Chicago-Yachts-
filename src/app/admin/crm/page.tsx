import { customerRepository } from "@/server/repositories/customer.repository"
import { bookingRepository } from "@/server/repositories/booking.repository"
import { KanbanBoard } from "@/components/admin/crm/KanbanBoard"

export default async function CRMPage() {
  const customers = await customerRepository.getAllCustomers();
  const bookings = await bookingRepository.getAllBookings();

  // Map to UI types
  const mappedCustomers = customers.map(c => ({
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    status: c.leadStatus,
    source: c.source,
    createdAt: c.createdAt.toISOString(),
    lifetimeValue: Number(c.lifetimeValue),
    notes: c.notes.map(n => ({
      id: n.id,
      content: n.content,
      author: n.authorId,
      createdAt: n.createdAt.toISOString()
    })),
    activities: c.activities.map(a => ({
      id: a.id,
      type: a.type,
      description: a.description,
      createdAt: a.createdAt.toISOString()
    }))
  }));

  const mappedBookings = bookings.map(b => ({
    id: b.id,
    customerId: b.customerId,
    yacht: b.yacht.name,
    date: b.startDateTime.toISOString().split('T')[0],
    totalAmount: Number(b.totalAmount),
    status: b.bookingStatus
  }));

  return (
    <div className="h-full">
      <KanbanBoard customers={mappedCustomers as any} bookings={mappedBookings as any} />
    </div>
  )
}
