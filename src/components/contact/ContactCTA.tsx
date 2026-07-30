import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ContactCTA() {
  return (
    <section className="py-32 bg-white text-center">
      <div className="container px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-normal tracking-tight mb-8 text-slate-900 leading-tight">
          Let's Plan Your Perfect Day <br/>On The Water.
        </h2>
        <p className="text-lg md:text-xl text-slate-500 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          From intimate celebrations to unforgettable corporate events, our concierge team is ready to create a truly exceptional experience.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/fleet" className="w-full sm:w-auto">
            <Button className="w-full rounded-full px-10 h-14 bg-slate-900 text-white hover:bg-slate-800 text-base font-medium transition-luxury hover-lift shadow-lg shadow-slate-900/20">
              Browse Our Fleet
            </Button>
          </Link>
          <Link href="#whatsapp" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full rounded-full px-10 h-14 border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-base font-medium transition-luxury hover-lift">
              Chat on WhatsApp
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
