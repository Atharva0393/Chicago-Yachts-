import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutHero() {
  return (
    <section className="relative min-h-[85vh] w-full flex items-center pt-24 pb-20 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/aboutusbg.png"
          alt="Chicago Yachts flagship cruising"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>
      
      <div className="container relative z-10 px-4 max-w-7xl mx-auto flex flex-col items-center text-center mt-10">
        <div className="animate-fade-up animate-delay-100 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-normal text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            About Chicago Yachts
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl leading-relaxed mb-10 drop-shadow-sm">
            Delivering exceptional luxury yacht experiences on the waters of Chicago with professionalism, safety and unforgettable service.
          </p>
          <Link href="/fleet">
            <Button className="rounded-full px-8 h-14 bg-white text-slate-900 hover:bg-slate-50 text-base font-medium transition-luxury hover-lift shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
              Explore Our Fleet
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Decorative gradient bleed to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
    </section>
  );
}
