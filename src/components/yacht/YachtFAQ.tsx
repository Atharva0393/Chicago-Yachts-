"use client"

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What happens if the weather is bad?",
    a: "Safety is our priority. If the captain deems the weather unsafe for cruising, you will receive the option to reschedule your charter or receive a full refund."
  },
  {
    q: "Is a captain included in the price?",
    a: "Unless specifically stated otherwise in the pricing breakdown, a USCG-licensed captain is required and calculated as an additional fee based on the duration of your charter."
  },
  {
    q: "Can we bring our own food and alcohol?",
    a: "Yes! You are welcome to bring your own food and beverages. We also provide coolers and ice. If you prefer a seamless experience, you can select our Premium Open Bar or Private Chef add-ons."
  },
  {
    q: "Are pets allowed onboard?",
    a: "We love animals, but to maintain the pristine condition of our luxury vessels, pets are generally not permitted. Exceptions can occasionally be made for certified service animals."
  }
];

export function YachtFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-10 border-b border-slate-100">
      <h2 className="text-2xl font-medium text-slate-900 tracking-tight mb-8">Things To Know</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-slate-100 pb-4">
            <button 
              className="w-full flex items-center justify-between text-left focus:outline-none py-2"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium text-slate-900">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
            </button>
            <div 
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: openIndex === index ? '200px' : '0px', opacity: openIndex === index ? 1 : 0 }}
            >
              <p className="text-slate-600 font-light text-sm mt-2 leading-relaxed pb-2">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
