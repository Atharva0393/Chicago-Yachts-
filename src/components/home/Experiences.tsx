import Link from "next/link";
import { experiences } from "@/data/experiences";

export function Experiences() {

  return (
    <section className="w-full py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Curated Journeys</h2>
            <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
              Unforgettable Experiences
            </h3>
          </div>
          <Link href="/experiences" className="text-sm font-medium tracking-wide text-foreground hover:text-primary transition-colors flex items-center gap-2 group border-b border-border hover:border-primary pb-1">
            View All Experiences
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[800px] md:h-[600px]">
          {experiences.slice(0, 4).map((exp, index) => (
            <Link href={`/experiences#${exp.id}`} key={index} className={`relative rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-luxury block ${exp.colSpan}`}>
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${exp.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-700" />
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <h4 className="text-2xl md:text-3xl font-medium text-white mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">{exp.title}</h4>
                <p className="text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  Discover More <span>→</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
