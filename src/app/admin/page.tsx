import { RevenueChart } from "@/components/admin/RevenueChart"
import { dataService } from "@/services/data.service"
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

export default async function AdminDashboard() {
  const yachts = await dataService.getYachts();
  const bookings = await dataService.getBookings();
  
  // Calculate dynamic metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.status !== "CANCELLED" ? b.totalPrice : 0), 0);
  const pendingPayments = bookings.reduce((sum, b) => sum + (b.status === "PENDING" ? b.totalPrice : 0), 0);
  const todaysBookings = bookings.filter(b => {
    const bDate = new Date(b.date);
    const today = new Date();
    return bDate.getDate() === today.getDate() && bDate.getMonth() === today.getMonth() && bDate.getFullYear() === today.getFullYear();
  }).length;
  const activeYachts = yachts.filter(y => y.availabilityStatus !== "Fully Booked").length;
  const fleetAvailability = Math.round((activeYachts / yachts.length) * 100);

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
              +14.5% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div>
            <div className="text-sm text-slate-500 font-medium mb-1">Total Revenue</div>
            <div className="text-3xl font-semibold tracking-tight text-slate-900">${totalRevenue.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <CalendarDays className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              +4 <ArrowUpRight className="h-3 w-3" />
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
            <div className="text-sm text-slate-500 font-medium mb-1">Pending Payments</div>
            <div className="text-3xl font-semibold tracking-tight text-slate-900">${pendingPayments.toLocaleString()}</div>
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
            <RevenueChart />
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
              {[
                { type: "booking", text: "New booking for Azimut 60", time: "10m ago" },
                { type: "payment", text: "Payment received ($2,400)", time: "1h ago" },
                { type: "lead", text: "New lead from contact form", time: "2h ago" },
              ].map((activity, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Activity className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700">{activity.text}</span>
                    <span className="text-xs text-slate-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
            {yachts.slice(0, 3).map((yacht, i) => (
              <div key={yacht.id} className="flex items-center gap-4">
                <div className="relative h-12 w-16 rounded-lg overflow-hidden shrink-0">
                  <Image src={yacht.images[0]} alt={yacht.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-semibold text-slate-900 line-clamp-1">{yacht.name}</span>
                  <span className="text-xs text-slate-500">{12 - i * 3} bookings this month</span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  ${(yacht.pricePerHour * 12).toLocaleString()}
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
            {[
              { name: "Sarah Jenkins", email: "sarah@example.com", interest: "Corporate Event" },
              { name: "Michael Chang", email: "m.chang@example.com", interest: "Sunset Cruise" },
              { name: "David Miller", email: "david.m@example.com", interest: "Wedding Reception" },
            ].map((lead, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">{lead.name}</span>
                  <span className="text-xs text-slate-500">{lead.interest}</span>
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
            {[
              { yacht: "The Azimut 60", rating: 5, text: "Absolutely incredible experience. The crew was professional." },
              { yacht: "Sea Ray Sundancer", rating: 5, text: "Perfect day out on the water. Highly recommend." },
            ].map((review, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{review.yacht}</span>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="h-3 w-3 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-700 italic">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
