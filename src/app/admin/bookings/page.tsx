import { dataService } from "@/services/data.service"
import { BookingsTable } from "@/components/admin/BookingsTable"

export default async function BookingsPage() {
  const bookings = await dataService.getBookings()
  
  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <BookingsTable initialBookings={bookings} />
    </div>
  )
}
