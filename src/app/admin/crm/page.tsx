import { dataService } from "@/services/data.service"
import { KanbanBoard } from "@/components/admin/crm/KanbanBoard"

export default async function CRMPage() {
  const customers = await dataService.getCustomers()
  const bookings = await dataService.getBookings()

  return (
    <div className="h-full">
      <KanbanBoard customers={customers} bookings={bookings} />
    </div>
  )
}
