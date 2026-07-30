import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutCTA() {
  return (
    <section className="py-32 bg-white text-center">
      <div className="container px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-normal tracking-tight mb-8 text-slate-900 leading-tight">
          Experience Chicago <br/>Like Never Before.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link href="/fleet" className="w-full sm:w-auto">
            <Button className="w-full rounded-full px-10 h-14 bg-slate-900 text-white hover:bg-slate-800 text-base font-medium transition-luxury hover-lift shadow-lg shadow-slate-900/20">
              Browse Fleet
            </Button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full rounded-full px-10 h-14 border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-base font-medium transition-luxury hover-lift">
              Contact Concierge
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
