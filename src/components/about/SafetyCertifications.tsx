import React from "react";
import { CheckCircle2, Shield, Anchor, LifeBuoy, Wrench, Clock } from "lucide-react";

const certifications = [
  { icon: <Shield className="w-5 h-5 text-slate-900" />, title: "Fully Insured", desc: "Comprehensive maritime commercial liability coverage." },
  { icon: <Anchor className="w-5 h-5 text-slate-900" />, title: "Licensed Captains", desc: "Every captain holds an active USCG Master License." },
  { icon: <CheckCircle2 className="w-5 h-5 text-slate-900" />, title: "USCG Compliant", desc: "Vessels pass rigorous and frequent safety inspections." },
  { icon: <LifeBuoy className="w-5 h-5 text-slate-900" />, title: "Safety Equipment", desc: "Top-tier life-saving appliances onboard all vessels." },
  { icon: <Wrench className="w-5 h-5 text-slate-900" />, title: "Professional Maintenance", desc: "Strict adherence to preventative maintenance schedules." },
  { icon: <Clock className="w-5 h-5 text-slate-900" />, title: "24/7 Support", desc: "Round-the-clock operational support during charters." }
];

export function SafetyCertifications() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Peace of Mind</h2>
            <h3 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight leading-tight mb-6">
              Safety & Certifications
            </h3>
            <p className="text-slate-600 font-light leading-relaxed text-lg max-w-xl mx-auto lg:mx-0">
              Luxury means nothing without safety. We adhere strictly to United States Coast Guard regulations, employing only fully licensed Master Captains and maintaining comprehensive commercial insurance on every vessel in our fleet.
            </p>
          </div>
          
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="shrink-0 mt-1">
                    {cert.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">{cert.title}</h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">{cert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
