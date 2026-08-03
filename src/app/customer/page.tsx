import { db } from "@/lib/db";
import { RecentlyViewedCarousel } from "@/components/shared/RecentlyViewedCarousel";
import { Anchor, CalendarDays, MapPin, MessageSquare, ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function CustomerDashboardOverview() {
  const nextTrip = await db.yacht.findFirst({
    include: { images: true }
  }); // Mock next trip

  const stats = [
    { label: "Total Charters", value: "3", icon: Anchor },
    { label: "Upcoming Trips", value: "1", icon: CalendarDays },
    { label: "Unread Messages", value: "2", icon: MessageSquare },
  ];

  if (!nextTrip) {
    return <div className="p-8 text-center text-muted-foreground">No upcoming trips. Start browsing our fleet!</div>;
  }

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500">
      
      {/* Header Greeting (Desktop only, mobile handled in layout) */}
      <div className="hidden md:flex justify-between items-end mb-2">
        <div>
          <h1 className="text-4xl font-medium tracking-tight mb-2">Welcome back, James</h1>
          <p className="text-muted-foreground text-lg">Manage your bookings, messages, and preferences.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-background border border-border/50 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
              <div className="h-10 w-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Next Trip Luxury Card */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-medium tracking-tight">Your Next Charter</h2>
          <Link href="/customer/bookings" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group">
            All Bookings <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="bg-background border border-border/50 rounded-3xl overflow-hidden shadow-[var(--shadow-premium)] group">
          <div className="flex flex-col md:flex-row h-full">
            
            {/* Image Section */}
            <div className="w-full md:w-[40%] relative aspect-video md:aspect-auto overflow-hidden">
              <Image 
                src={nextTrip.images[0]?.url || '/placeholder.jpg'} 
                alt={nextTrip.name} 
                fill 
                className="object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
              />
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" /> Confirmed
              </div>
            </div>
            
            {/* Details Section */}
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight mb-1">{nextTrip.name}</h3>
                  <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <MapPin className="h-4 w-4" /> Burnham Harbor, Chicago
                  </div>
                </div>
                <div className="flex flex-col bg-muted/30 px-4 py-2 rounded-2xl border border-border/50 md:items-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Booking Ref</span>
                  <span className="font-mono font-semibold">CY-8X92M</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8 bg-muted/10 p-6 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Date</span>
                  <span className="font-medium">Saturday, Aug 12</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Time</span>
                  <span className="font-medium">4:00 PM - 8:00 PM</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Guests</span>
                  <span className="font-medium">6 Adults, 2 Children</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Captain</span>
                  <span className="font-medium">Assigned</span>
                </div>
              </div>
              
              <div className="mt-auto flex flex-col sm:flex-row gap-3">
                <button className="bg-foreground text-background px-6 py-3 rounded-full font-medium text-sm hover:bg-foreground/90 transition-all flex items-center justify-center gap-2">
                  Contact Captain
                </button>
                <button className="bg-muted text-foreground px-6 py-3 rounded-full font-medium text-sm hover:bg-muted/80 transition-all flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" /> Itinerary
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Global Recently Viewed (No padding to keep it flush) */}
      <div className="mt-4 -mx-4 md:-mx-8">
        <RecentlyViewedCarousel />
      </div>

    </div>
  )
}
