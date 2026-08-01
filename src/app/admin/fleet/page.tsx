import { yachtRepository } from "@/server/repositories/yacht.repository"
import { FleetTable } from "@/components/admin/FleetTable"

export default async function FleetPage() {
  const yachts = await yachtRepository.getAllYachts(true)
  
  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <FleetTable initialYachts={yachts} />
    </div>
  )
}
