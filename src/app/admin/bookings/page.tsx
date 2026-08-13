import { bookingRepository } from "@/server/repositories/booking.repository"
import { BookingsTable } from "@/components/admin/BookingsTable"
import { requireAdmin } from "@/lib/auth-server"

export default async function BookingsPage() {
  await requireAdmin();
  const bookings = await bookingRepository.getAllBookings();
  
  // Map Prisma models to serializable UI objects expected by BookingsTable
  const mappedBookings = bookings.map(b => ({
    id: b.id,
    bookingReference: b.bookingReference || b.id,
    customer: {
      id: b.customer?.id || "",
      name: b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : "Customer",
      email: b.customer?.email || "",
      phone: b.customer?.phone || ""
    },
    yacht: {
      id: b.yacht?.id || "",
      name: b.yacht?.name || "Yacht"
    },
    date: b.startDateTime ? new Date(b.startDateTime).toISOString() : new Date().toISOString(),
    timeSlot: "CUSTOM",
    duration: Math.round((new Date(b.endDateTime).getTime() - new Date(b.startDateTime).getTime()) / (1000 * 3600)) || 4,
    guests: b.guestCount,
    totalPrice: Number(b.totalAmount || 0),
    totalAmount: Number(b.totalAmount || 0),
    depositAmount: Number(b.depositAmount || 0),
    remainingAmount: Number(b.remainingAmount || 0),
    status: b.bookingStatus as any,
    paymentStatus: b.paymentStatus,
    createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : new Date().toISOString()
  }));

  // Ensure plain JSON objects (no Prisma Decimal/Date prototypes) cross the RSC boundary
  const plainBookings = JSON.parse(JSON.stringify(mappedBookings));

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <BookingsTable initialBookings={plainBookings} />
    </div>
  )
}
