import React from "react";
import { Ship, ShieldCheck, Star, Clock, Anchor, HandPlatter } from "lucide-react";

const reasons = [
  {
    icon: <Ship className="w-6 h-6 stroke-[1.5]" />,
    title: "Luxury Fleet",
    desc: "A meticulously curated collection of Chicago's finest yachts, maintained to the highest standards."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 stroke-[1.5]" />,
    title: "Professional Crew",
    desc: "Fully licensed USCG captains and trained hospitality staff dedicated to your safety and comfort."
  },
  {
    icon: <HandPlatter className="w-6 h-6 stroke-[1.5]" />,
    title: "Premium Service",
    desc: "From bespoke itineraries to private chefs, we handle every detail so you can simply relax."
  },
  {
    icon: <Clock className="w-6 h-6 stroke-[1.5]" />,
    title: "Flexible Experiences",
    desc: "Whether it's a 2-hour sunset cruise or a full-day corporate retreat, we adapt to your schedule."
  },
  {
    icon: <Anchor className="w-6 h-6 stroke-[1.5]" />,
    title: "Safety First",
    desc: "Uncompromising safety protocols, modern navigation equipment, and fully insured operations."
  },
  {
    icon: <Star className="w-6 h-6 stroke-[1.5]" />,
    title: "Transparent Pricing",
    desc: "No hidden fees. Clear breakdowns of charter costs, captain fees, and optional luxury add-ons."
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">The Standard</h2>
          <h3 className="text-3xl md:text-4xl font-normal text-slate-900 tracking-tight">
            Why Choose Chicago Yachts
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 mb-6">
                {reason.icon}
              </div>
              <h4 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">{reason.title}</h4>
              <p className="text-slate-500 font-light leading-relaxed text-sm">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
