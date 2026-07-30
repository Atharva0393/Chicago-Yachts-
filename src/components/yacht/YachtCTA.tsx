import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function YachtCTA() {
  return (
    <section className="py-24 bg-white text-center border-t border-slate-100">
      <div className="container px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-6 text-slate-900">
          Ready To Experience Chicago From The Water?
        </h2>
        <p className="text-lg text-slate-500 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
          Reserve your luxury yacht today or speak with our concierge team to plan a bespoke experience.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="rounded-full px-8 h-14 bg-slate-900 text-white hover:bg-slate-800 text-base font-medium transition-luxury hover-lift w-full sm:w-auto">
            Reserve Now
          </Button>
          <Button variant="outline" className="rounded-full px-8 h-14 border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-base font-medium transition-luxury hover-lift w-full sm:w-auto flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}
