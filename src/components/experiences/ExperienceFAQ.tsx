"use client"

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Can we customize our itinerary?",
    answer: "Absolutely. While we offer curated experiences, every charter can be fully tailored to your specific preferences, from the exact route to specific anchorages."
  },
  {
    question: "Can we bring our own food?",
    answer: "Yes, you are welcome to bring your own food and beverages. Alternatively, you can upgrade your experience with our private chef and premium catering options."
  },
  {
    question: "Are decorations included?",
    answer: "Standard charters do not include decorations, but we offer bespoke luxury decoration packages for birthdays, proposals, and corporate events as an add-on."
  },
  {
    question: "Can experiences be personalized?",
    answer: "Yes. Our concierge team works closely with you prior to departure to personalize the music, ambiance, dining, and overall flow of the event to match your exact vision."
  },
  {
    question: "What happens in bad weather?",
    answer: "Your safety is our absolute priority. If the captain determines the conditions are unsafe, we will seamlessly reschedule your experience for another date or offer a full refund."
  }
];

export function ExperienceFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-slate-200 rounded-[20px] bg-white overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-slate-900">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              
              <div 
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{ maxHeight: openIndex === index ? '500px' : '0px', opacity: openIndex === index ? 1 : 0 }}
              >
                <div className="px-8 pb-6 text-slate-500 font-light leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
