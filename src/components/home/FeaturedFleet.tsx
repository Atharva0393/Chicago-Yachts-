import Link from "next/link";
import { Anchor, Users, Ruler } from "lucide-react";
import { yachts as allYachts } from "@/lib/constants/demo-data";

export function FeaturedFleet() {
  const yachts = [...allYachts].sort((a, b) => b.length - a.length).slice(0, 3).map(y => ({
    id: y.id,
    name: y.name,
    capacity: y.capacity,
    length: `${y.length} ft`,
    price: `$${y.pricePerHour * 4}`,
    image: y.images?.[0] || "",
  }));

  return (
    <section className="w-full py-24 md:py-32 bg-muted/20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Our Collection</h2>
            <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
              Featured Fleet
            </h3>
          </div>
          <Link href="/fleet" className="text-sm font-medium tracking-wide text-foreground hover:text-primary transition-colors flex items-center gap-2 group border-b border-border hover:border-primary pb-1">
            Explore All Yachts
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {yachts.map((yacht) => (
            <div key={yacht.id} className="bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-xl hover-lift flex flex-col group cursor-pointer transition-luxury">
              <div className="relative h-72 w-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105"
                  style={{ backgroundImage: `url('${yacht.image}')` }}
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-2xl font-medium tracking-tight">{yacht.name}</h4>
                </div>
                <div className="flex gap-6 mb-8 text-sm text-muted-foreground font-medium border-b border-border/40 pb-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{yacht.capacity} Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    <span>{yacht.length}</span>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Starting at</span>
                    <span className="text-xl font-medium text-foreground">{yacht.price} <span className="text-sm text-muted-foreground font-normal">/ 4hrs</span></span>
                  </div>
                  <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-luxury">
                    <Anchor className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
