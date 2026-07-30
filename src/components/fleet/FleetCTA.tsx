import React from "react";
import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FleetCTA() {
  return (
    <section className="py-24 bg-slate-950 text-white text-center">
      <div className="container px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-6">
          Need Help Choosing The Perfect Yacht?
        </h2>
        <p className="text-lg text-slate-400 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
          Our concierge team can help you select the ideal yacht based on your group size, budget, and desired experience.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="rounded-full px-8 h-14 bg-white text-slate-900 hover:bg-slate-100 text-base font-medium transition-luxury hover-lift w-full sm:w-auto flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Talk To Concierge
          </Button>
          <Button variant="outline" className="rounded-full px-8 h-14 border-white/20 bg-white/5 hover:bg-white/10 text-white text-base font-medium transition-luxury hover-lift w-full sm:w-auto flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            WhatsApp Us
          </Button>
        </div>
      </div>
    </section>
  );
}
