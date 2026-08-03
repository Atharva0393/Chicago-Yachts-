import React from "react";
import { Calendar, MessageSquare, PhoneCall, Search, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { companyInfo } from "@/lib/constants/company";

export function InstantBooking() {
  
  const options = [
    {
      icon: <Search className="w-5 h-5" />,
      title: "Browse Fleet",
      desc: "View our curated collection and book directly online.",
      btnText: "Explore Yachts",
      href: "/fleet",
      primary: true
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Chat on WhatsApp",
      desc: "Instant replies for quick availability checks.",
      btnText: "Start Chat",
      href: "#whatsapp",
      primary: false
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Concierge",
      desc: "Speak directly with our booking specialists.",
      btnText: companyInfo.phone,
      href: `tel:${companyInfo.phone.replace(/[^0-9+]/g, '')}`,
      primary: false
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Schedule Consultation",
      desc: "Plan a complex event? Let's talk through the details.",
      btnText: "Book Time",
      href: "#calendar",
      primary: false
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-medium text-slate-900 mb-2">Instant Booking Options</h3>
      
      {options.map((opt, index) => (
        <div key={index} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-slate-200 transition-colors">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${opt.primary ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-200'}`}>
              {opt.icon}
            </div>
            <div>
              <h4 className="font-medium text-slate-900">{opt.title}</h4>
              <p className="text-xs text-slate-500 hidden sm:block mt-0.5">{opt.desc}</p>
            </div>
          </div>
          <Link href={opt.href}>
            <button className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${opt.primary ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50'}`}>
              {opt.btnText}
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}
