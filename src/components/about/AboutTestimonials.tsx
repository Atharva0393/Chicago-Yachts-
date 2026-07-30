"use client"

import React, { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    quote: "Our corporate retreat on the Princess 72 was flawless. The Chicago Yachts team handled every detail from catering to route planning. It set a new standard for our executive events.",
    author: "David M.",
    role: "CEO, TechFlow",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    quote: "We chartered a yacht for our 10th anniversary. The luxury, the pristine condition of the vessel, and the professionalism of the captain made it a night we will never forget.",
    author: "Sarah & John T.",
    role: "Private Charter",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1000&auto=format&fit=crop"
  },
  {
    quote: "As an event planner, I require perfection. Chicago Yachts is the only fleet I trust. Their concierges are incredible and the boats are absolute showstoppers.",
    author: "Michelle K.",
    role: "Luxury Event Planner",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop"
  }
];

export function AboutTestimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-900 rounded-full blur-[100px] opacity-50 translate-x-1/2 -translate-y-1/2" />
      
      <div className="container px-4 md:px-8 max-w-5xl mx-auto relative z-10 text-center">
        <Quote className="w-16 h-16 text-slate-800 mx-auto mb-12" />
        
        <div className="relative h-[250px] md:h-[200px]">
          {testimonials.map((test, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-all duration-1000 flex flex-col items-center
                ${index === current ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-10 pointer-events-none'}`}
            >
              <p className="text-xl md:text-3xl font-light text-white leading-relaxed mb-10 max-w-4xl">
                "{test.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  <Image src={test.image} alt={test.author} fill className="object-cover" />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-medium text-sm">{test.author}</h4>
                  <span className="text-slate-400 text-xs">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-16">
          <button onClick={prev} className="w-12 h-12 rounded-full border border-slate-800 text-white flex items-center justify-center hover:bg-slate-800 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrent(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === current ? 'bg-white scale-125' : 'bg-slate-800 hover:bg-slate-700'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-12 h-12 rounded-full border border-slate-800 text-white flex items-center justify-center hover:bg-slate-800 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
