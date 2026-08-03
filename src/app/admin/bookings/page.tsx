import { bookingRepository } from "@/server/repositories/booking.repository"
import { BookingsTable } from "@/components/admin/BookingsTable"

export default async function BookingsPage() {
  const bookings = await bookingRepository.getAllBookings()
  
  // Map Prisma models to the UI types expected by BookingsTable
  const mappedBookings = bookings.map(b => ({
    id: b.id,
    customer: `${b.customer.firstName} ${b.customer.lastName}`,
    email: b.customer.email,
    yacht: b.yacht.name,
    date: b.startDateTime.toISOString(),
    timeSlot: "CUSTOM",
    guests: b.guestCount,
    totalAmount: Number(b.totalAmount),
    status: b.bookingStatus as any,
    paymentStatus: b.paymentStatus,
    createdAt: b.createdAt.toISOString()
  }));

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <BookingsTable initialBookings={mappedBookings as any} />
    </div>
  )
}
