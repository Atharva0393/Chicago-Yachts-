import { RevenueChart } from "@/components/admin/RevenueChart"
import { db } from "@/lib/db"
import { 
  DollarSign, 
  CalendarDays, 
  Clock, 
  Anchor, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Users,
  Star,
  Activity,
  MessageSquare
} from "lucide-react"
import Image from "next/image"
import { toZonedTime, format } from "date-fns-tz"

import Link from "next/link"
import { requireAdmin } from "@/lib/auth-server"

export default async function AdminDashboard() {
  await requireAdmin();

  const yachts = await db.yacht.findMany();
  const bookings = await db.booking.findMany({
    include: { yacht: true, customer: true }
  });
  
  // Calculate dynamic metrics
  const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.bookingStatus !== "CANCELLED" ? Number(b.totalAmount) : 0), 0);
  const outstandingReceivables = bookings.reduce((sum: number, b: any) => sum + (b.bookingStatus !== "CANCELLED" && b.paymentStatus !== "PAID" ? Number(b.remainingAmount || 0) : 0), 0);
  
  const TIMEZONE = "America/Chicago";
  const todayZoned = toZonedTime(new Date(), TIMEZONE);
  const todayZonedString = format(todayZoned, 'yyyy-MM-dd', { timeZone: TIMEZONE });
  
  const todaysBookings = bookings.filter((b: any) => {
    if (b.bookingStatus === "CANCELLED") return false;
    const bookingZoned = toZonedTime(b.startDateTime, TIMEZONE);
    return format(bookingZoned, 'yyyy-MM-dd', { timeZone: TIMEZONE }) === todayZonedString;
  }).length;
  
  const activeYachts = yachts.filter((y: any) => y.isActive).length;
  const fleetAvailability = yachts.length > 0 ? Math.round((activeYachts / yachts.length) * 100) : 0;

  // Bookings requiring attention (Pending Confirmation or Overdue)
  const pendingConfirmationBookings = bookings.filter((b: any) => b.bookingStatus === "PENDING");
  const upcomingBookings = bookings
    .filter((b: any) => b.bookingStatus !== "CANCELLED" && b.bookingStatus !== "EXPIRED" && new Date(b.startDateTime) >= new Date())
    .sort((a: any, b: any) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
    .slice(0, 5);

  const recentBookings = await db.booking.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { yacht: true, customer: true }
  });

  // Fetch New Leads
  const newLeads = await db.customer.findMany({
    where: { leadStatus: 'NEW' },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  // Calculate Chart Data (Revenue by Date for the last 7 days as an example)
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayRevenue = bookings
      .filter((b: any) => b.bookingStatus !== "CANCELLED" && b.createdAt.toDateString() === d.toDateString())
      .reduce((sum: number, b: any) => sum + Number(b.totalAmount), 0);
    chartData.push({ name: dateStr, revenue: dayRevenue });
  }

  // Calculate Popular Yachts
  const yachtBookingsCount = bookings.reduce((acc: any, b: any) => {
    acc[b.yachtId] = (acc[b.yachtId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const popularYachts = yachts
    .map((y: any) => ({ ...y, bookingCount: yachtBookingsCount[y.id] || 0 }))
    .sort((a: any, b: any) => b.bookingCount - a.bookingCount)
    .slice(0, 3);

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-medium tracking-tight mb-2 text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Overview of your fleet operations and sales.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            Download Report
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Booking
          </button>
        </div>
      </div>

      {/* Top Row: KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              +0.0% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium mb-1">Total Revenue</div>
            <div className="text-3xl font-semibold tracking-tight text-slate-900">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <CalendarDays className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              +0 <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium mb-1">Today's Bookings</div>
            <div className="text-3xl font-semibold tracking-tight text-slate-900">{todaysBookings}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
              Live
            </span>
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium mb-1">Outstanding Receivables</div>
            <div className="text-3xl font-semibold tracking-tight text-slate-900">${outstandingReceivables.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <Anchor className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
              Real-time
            </span>
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium mb-1">Fleet Availability</div>
            <div className="text-3xl font-semibold tracking-tight text-slate-900">{fleetAvailability}%</div>
          </div>
        </div>

      </div>

      {/* Needs Your Attention Section */}
      {pendingConfirmationBookings.length > 0 && (
        <div className="mb-8 p-5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold text-lg">
              !
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 text-base">
                Needs Your Attention: {pendingConfirmationBookings.length} Pending Reservation{pendingConfirmationBookings.length > 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-amber-700">
                You have bookings waiting for owner confirmation. Review customer details and confirm availability.
              </p>
            </div>
          </div>
          <Link 
            href="/admin/bookings"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-xl transition-colors shrink-0"
          >
            Review Bookings
          </Link>
        </div>
      )}

      {/* Middle Row: Analytics & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900">Revenue Overview</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px]">
            <RevenueChart data={chartData} />
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-medium transition-colors flex flex-col items-center gap-2">
                <CalendarDays className="h-5 w-5 text-slate-500" /> Dispatch
              </button>
              <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-medium transition-colors flex flex-col items-center gap-2">
                <Users className="h-5 w-5 text-slate-500" /> New Lead
              </button>
              <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-medium transition-colors flex flex-col items-center gap-2">
                <Anchor className="h-5 w-5 text-slate-500" /> Maintenance
              </button>
              <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-medium transition-colors flex flex-col items-center gap-2">
                <DollarSign className="h-5 w-5 text-slate-500" /> Invoice
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-900">Recent Activity</h3>
              <button className="text-xs text-primary font-medium hover:underline">View All</button>
            </div>
            <div className="flex flex-col gap-4">
              {recentBookings.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-4">No recent activity.</div>
              ) : recentBookings.map((activity: any, i: number) => (
                <div key={activity.id} className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Activity className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700">New booking for {activity.yacht.name}</span>
                    <span className="text-xs text-slate-400">{activity.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Upcoming Bookings Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-semibold text-slate-900 text-lg">Upcoming Charters</h3>
            <p className="text-xs text-slate-500 font-light">Sorted by nearest charter departure date</p>
          </div>
          <Link href="/admin/bookings" className="text-xs text-primary font-semibold hover:underline">
            View All Bookings
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-8">
            No upcoming charters scheduled.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Charter Date</th>
                  <th className="px-4 py-3">Yacht</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Guests</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Deposit</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {new Date(b.startDateTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">{b.yacht.name}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{b.customer.firstName} {b.customer.lastName}</div>
                      <div className="text-xs text-slate-500">{b.customer.email}</div>
                    </td>
                    <td className="px-4 py-3">{b.guestCount} Guests</td>
                    <td className="px-4 py-3 font-medium text-slate-900">${Number(b.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 font-medium text-emerald-700">${Number(b.depositAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        b.bookingStatus === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                        b.bookingStatus === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Row: Popular Yachts & CRM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Popular Yachts Leaderboard */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900">Popular Yachts</h3>
            <button className="text-xs text-primary font-medium hover:underline">Full Fleet</button>
          </div>
          <div className="flex flex-col gap-4">
            {popularYachts.length === 0 ? (
              <div className="text-sm text-slate-500 text-center py-4">No yachts available.</div>
            ) : popularYachts.map((yacht: any, i: number) => (
              <div key={yacht.id} className="flex items-center gap-4">
                <div className="relative h-12 w-16 rounded-lg overflow-hidden shrink-0">
                  <Image src={yacht.images?.[0] || '/images/placeholder.jpg'} alt={yacht.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-semibold text-slate-900 line-clamp-1">{yacht.name}</span>
                  <span className="text-xs text-slate-500">{yacht.bookingCount} bookings</span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  ${(Number(yacht.pricePerHour) * 12).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Leads & Enquiries */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900">New Leads</h3>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">3 New</span>
          </div>
          <div className="flex flex-col gap-4">
            {newLeads.length === 0 ? (
              <div className="text-sm text-slate-500 text-center py-4">No new leads.</div>
            ) : newLeads.map((lead: any, i: number) => (
              <div key={lead.id} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">{lead.firstName} {lead.lastName}</span>
                  <span className="text-xs text-slate-500">{lead.email}</span>
                </div>
                <button className="h-8 w-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-colors">
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Reviews */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900">Latest Reviews</h3>
            <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" /> 4.9
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="text-sm text-slate-500 text-center py-4">
              Review system pending integration.
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
