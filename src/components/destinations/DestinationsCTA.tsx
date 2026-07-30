import React from "react";
import { Button } from "@/components/ui/button";

export function DestinationsCTA() {
  return (
    <section className="py-32 bg-white text-center">
      <div className="container px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-normal text-slate-900 tracking-tight mb-8">
          Find Your Perfect <br className="hidden md:block" /> Charter Destination
        </h2>
        <p className="text-lg text-slate-500 font-light mb-12 max-w-2xl mx-auto">
          Ready to experience Chicago from a completely new perspective? Our fleet is standing by at a harbor near you.
        </p>
        <Button className="rounded-full px-10 h-14 bg-slate-900 hover:bg-slate-800 text-white text-base font-medium transition-luxury hover-lift hover:shadow-premium">
          Browse Our Fleet
        </Button>
      </div>
    </section>
  );
}
