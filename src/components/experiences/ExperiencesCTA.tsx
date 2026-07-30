import React from "react";
import { Button } from "@/components/ui/button";

export function ExperiencesCTA() {
  return (
    <section className="py-32 bg-white text-center border-t border-slate-100">
      <div className="container px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-normal text-slate-900 tracking-tight mb-6">
          Let's Create Your Perfect <br className="hidden md:block" /> Day On The Water
        </h2>
        <p className="text-lg text-slate-500 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
          Our concierge team will help you plan every detail, ensuring your experience is completely flawless from dock to dock.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="rounded-full px-10 h-14 bg-slate-900 hover:bg-slate-800 text-white text-base font-medium transition-luxury hover-lift w-full sm:w-auto">
            Browse Our Fleet
          </Button>
          <Button variant="outline" className="rounded-full px-10 h-14 border-slate-200 text-slate-900 hover:bg-slate-50 text-base font-medium transition-luxury hover-lift w-full sm:w-auto">
            Contact Concierge
          </Button>
        </div>
      </div>
    </section>
  );
}
