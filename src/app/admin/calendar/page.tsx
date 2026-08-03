import { db } from "@/lib/db"
import { CalendarClient } from "@/components/admin/CalendarClient"
import { requireAdmin } from "@/lib/auth-server"

export default async function CalendarPage() {
  await requireAdmin();
  
  // Fetch all bookings for the calendar (could optimize by date range if needed)
  const bookings = await db.booking.findMany({
    include: {
      customer: true,
      yacht: true
    },
    orderBy: {
      startDateTime: 'asc'
    }
  });

  const mappedBookings = bookings.map((b: any) => ({
    id: b.id,
    customer: {
      name: `${b.customer.firstName} ${b.customer.lastName}`,
      email: b.customer.email,
      phone: b.customer.phone
    },
    yacht: b.yacht.name,
    date: b.startDateTime.toISOString(),
    timeSlot: "CUSTOM",
    guests: b.guestCount,
    totalPrice: Number(b.totalAmount),
    remainingAmount: Number(b.remainingAmount),
    status: b.bookingStatus,
    paymentStatus: b.paymentStatus,
    createdAt: b.createdAt.toISOString()
  }));

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <CalendarClient initialBookings={mappedBookings} />
    </div>
  )
}
