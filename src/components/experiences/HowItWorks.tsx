import React from "react";
import { MousePointerClick, Ship, CalendarCheck, Settings2, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: MousePointerClick, title: "Step 1", desc: "Choose Experience" },
  { icon: Ship, title: "Step 2", desc: "Select Yacht" },
  { icon: CalendarCheck, title: "Step 3", desc: "Choose Date" },
  { icon: Settings2, title: "Step 4", desc: "Customize Your Trip" },
  { icon: CheckCircle2, title: "Step 5", desc: "Instant Confirmation" }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background overflow-hidden relative">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight">
            Seamless Booking
          </h2>
          <p className="mt-4 text-slate-500 text-lg font-light leading-relaxed">
            Planning your luxury experience should be as effortless as the journey itself.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-8 left-12 right-12 h-[1px] bg-slate-200" />
          
          <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-4 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex flex-col items-center text-center group cursor-default">
                  <div className="w-16 h-16 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6 group-hover:shadow-premium group-hover:-translate-y-1 group-hover:border-slate-300 transition-all duration-300 relative">
                    <Icon className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
                    <div className="absolute inset-0 rounded-full bg-slate-900/5 scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                    {step.title}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 max-w-[120px]">
                    {step.desc}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
