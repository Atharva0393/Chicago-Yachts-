import { CalendarDays, MessageCircle, Phone, ShieldCheck } from "lucide-react";

interface BookingCardProps {
  price: number;
  maxGuests: number;
}

export function BookingCard({ price, maxGuests }: BookingCardProps) {
  return (
    <div className="sticky top-28 w-full bg-card rounded-3xl shadow-lg border border-border/40 p-6 flex flex-col gap-6">
      {/* Pricing Header */}
      <div className="flex items-end gap-2 pb-6 border-b border-border/40">
        <span className="text-3xl font-semibold tracking-tight text-foreground">${price.toLocaleString()}</span>
        <span className="text-muted-foreground mb-1 text-sm">/ 4 hours</span>
      </div>

      {/* Date & Guest Selectors */}
      <div className="flex flex-col rounded-2xl border border-border/60 overflow-hidden bg-background shadow-sm">
        <div className="grid grid-cols-2 border-b border-border/60">
          <div className="p-4 border-r border-border/60 cursor-pointer hover:bg-muted/50 transition-colors">
            <span className="block text-[10px] uppercase font-bold tracking-[0.2em] text-foreground mb-1">Date</span>
            <span className="text-sm text-muted-foreground">Select date</span>
          </div>
          <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <span className="block text-[10px] uppercase font-bold tracking-[0.2em] text-foreground mb-1">Time</span>
            <span className="text-sm text-muted-foreground">Select time</span>
          </div>
        </div>
        <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors flex justify-between items-center">
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-[0.2em] text-foreground mb-1">Guests</span>
            <span className="text-sm text-muted-foreground">1 guest</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">Max {maxGuests}</span>
        </div>
      </div>

      {/* Calendar Placeholder */}
      <div className="w-full bg-muted/30 rounded-2xl p-4 flex items-center justify-center border border-border/60 border-dashed h-48 transition-luxury hover:bg-muted/50 cursor-pointer">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <CalendarDays className="h-6 w-6 opacity-50" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">Availability Calendar</span>
        </div>
      </div>

      {/* Main CTA */}
      <div className="flex flex-col gap-3 mt-2">
        <button className="w-full h-14 bg-primary text-primary-foreground rounded-2xl text-lg font-semibold tracking-wide shadow-md hover-lift transition-luxury">
          Reserve Now
        </button>
        <p className="text-[11px] font-medium tracking-wide text-center text-muted-foreground uppercase">You won't be charged yet</p>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border/40">
        <button className="flex items-center justify-center gap-2 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] font-medium hover:bg-[#25D366]/20 transition-colors">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">WhatsApp</span>
        </button>
        <button className="flex items-center justify-center gap-2 h-12 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors">
          <Phone className="h-4 w-4" />
          <span className="text-sm">Call Us</span>
        </button>
      </div>

      {/* Trust Badge */}
      <div className="flex items-start gap-3 mt-2 bg-muted/20 p-4 rounded-xl border border-border/30">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground tracking-tight">Premium Protection</span>
          <span className="text-xs text-muted-foreground mt-1 leading-relaxed">Book with confidence. All charters are fully insured with licensed captains.</span>
        </div>
      </div>
    </div>
  );
}
