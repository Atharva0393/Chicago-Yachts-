"use client"

import React, { useEffect, useState, useRef } from "react";

const stats = [
  { label: "Luxury Yachts", value: 25, suffix: "+" },
  { label: "Happy Guests", value: 10, suffix: "k+" },
  { label: "Years Experience", value: 12, suffix: "" },
  { label: "5-Star Reviews", value: 1500, suffix: "+" }
];

export function FleetStats() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-slate-900 text-white" ref={ref}>
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 text-center divide-x divide-slate-800/50">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center">
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-4xl md:text-6xl font-light tracking-tight transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                  {stat.value}
                </span>
                <span className={`text-2xl md:text-4xl font-light text-slate-400 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: `${index * 150 + 100}ms` }}>
                  {stat.suffix}
                </span>
              </div>
              <span className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-slate-400 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${index * 150 + 300}ms` }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
