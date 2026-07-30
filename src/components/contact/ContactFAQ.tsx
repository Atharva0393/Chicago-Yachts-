"use client"

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do I reserve a yacht?",
    answer: "You can begin the reservation process by filling out our enquiry form, calling our concierge, or using WhatsApp for instant assistance. A 50% deposit is required to secure your date."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), bank wires, and ACH transfers. Final payment is due 7 days prior to departure."
  },
  {
    question: "What happens in bad weather?",
    answer: "Safety is our priority. If the Captain determines conditions are unsafe, we will attempt to reschedule your charter or issue a full refund or credit, depending on the circumstances."
  },
  {
    question: "Can I customize my charter itinerary?",
    answer: "Absolutely. Our concierge team works with you to design bespoke itineraries, including specific routes, anchorages, and architectural tours along the Chicago River."
  },
  {
    question: "Can I bring outside food and beverages?",
    answer: "Yes, you are welcome to bring your own food and beverages. We also offer premium catering packages and private chef services which can be added to your charter."
  },
  {
    question: "Can I decorate the yacht for a special occasion?",
    answer: "Yes, we allow decorations like balloons and flowers. However, confetti, glitter, and open flames (other than birthday candles) are strictly prohibited for safety and maintenance reasons."
  },
  {
    question: "What is your cancellation policy?",
    answer: "Cancellations made 14 days prior to departure receive a full refund minus a 10% processing fee. Cancellations within 14 days forfeit the deposit, and cancellations within 72 hours forfeit the full amount."
  }
];

export function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-50">
      <div className="container px-4 md:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Support</h2>
          <h3 className="text-3xl md:text-4xl font-normal text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`bg-white border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'border-slate-300 shadow-sm' : 'border-slate-100'}`}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`font-medium pr-8 transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-700'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-slate-500 font-light text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
