import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ContactHero() {
  return (
    <section className="relative min-h-[85vh] w-full flex items-center pt-24 pb-20 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury yacht docked at sunset"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-slate-950/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      </div>
      
      <div className="container relative z-10 px-4 max-w-7xl mx-auto flex flex-col items-center text-center mt-10">
        <div className="animate-fade-up animate-delay-100 flex flex-col items-center">
          <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/80 mb-6">
            At Your Service
          </span>
          <h1 className="text-5xl md:text-7xl font-normal text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            Contact Our Concierge
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl leading-relaxed mb-10 drop-shadow-sm">
            Whether you're planning a sunset cruise, corporate event or unforgettable celebration, our concierge team is here to help create your perfect experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/fleet" className="w-full sm:w-auto">
              <Button className="w-full rounded-full px-8 h-14 bg-white text-slate-900 hover:bg-slate-50 text-base font-medium transition-luxury hover-lift shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                Browse Fleet
              </Button>
            </Link>
            <Link href="#contact-cards" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full rounded-full px-8 h-14 border-white/30 bg-white/5 text-white hover:bg-white/10 text-base font-medium transition-luxury backdrop-blur-sm">
                Call Concierge
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
