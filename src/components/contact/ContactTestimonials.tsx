"use client"

import React, { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useTestimonials } from "@/hooks/useData";

export function ContactTestimonials() {
  const { testimonials, loading } = useTestimonials();
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  if (loading || testimonials.length === 0) return null;

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container px-4 md:px-8 max-w-4xl mx-auto text-center">
        <Quote className="w-12 h-12 text-slate-200 mx-auto mb-10" />
        
        <div className="relative h-[220px] md:h-[180px]">
          {testimonials.map((test, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-all duration-1000 flex flex-col items-center
                ${index === current ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-10 pointer-events-none'}`}
            >
              <p className="text-xl md:text-2xl font-light text-slate-900 leading-relaxed mb-8 max-w-3xl">
                "{test.quote}"
              </p>
              <div>
                <h4 className="text-slate-900 font-medium text-sm">{test.author}</h4>
                <span className="text-slate-500 text-xs tracking-widest uppercase">{test.trip}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          <button onClick={prev} className="w-10 h-10 rounded-full border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrent(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === current ? 'bg-slate-900 scale-125' : 'bg-slate-200 hover:bg-slate-300'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 rounded-full border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
