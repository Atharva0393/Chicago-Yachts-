import { yachtRepository } from "@/server/repositories/yacht.repository";
import { notFound } from "next/navigation";
import { AdminAvailabilityCalendar } from "@/components/admin/AdminAvailabilityCalendar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function YachtAvailabilityPage({ params }: { params: { id: string } }) {
  const yacht = await yachtRepository.getYachtById(params.id);

  if (!yacht) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 h-full max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/fleet"
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Manage Availability</h2>
          <p className="text-sm text-slate-500">Configure bookable dates for {yacht.name}</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <AdminAvailabilityCalendar yacht={yacht} />
      </div>
    </div>
  );
}
