import React from "react";

const values = [
  {
    title: "Luxury Hospitality",
    desc: "We anticipate needs before they arise, providing white-glove service from the first point of contact."
  },
  {
    title: "Uncompromising Safety",
    desc: "Safety is our absolute foundation. We strictly adhere to USCG regulations without exception."
  },
  {
    title: "Total Reliability",
    desc: "When you book with us, your vessel will be ready, pristine, and fully staffed on time."
  },
  {
    title: "Personalized Experiences",
    desc: "Every charter is unique. We tailor the itinerary, catering, and ambiance to your exact desires."
  },
  {
    title: "Attention To Detail",
    desc: "From the fold of the towels to the temperature of the champagne, the little things matter."
  },
  {
    title: "Customer First",
    desc: "Your satisfaction is our only metric of success. We are dedicated to exceeding your expectations."
  }
];

export function OurValues() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          
          <div className="md:w-1/3">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Core Principles</h2>
            <h3 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight leading-tight sticky top-32">
              Our Values.
            </h3>
          </div>
          
          <div className="md:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {values.map((value, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-medium mb-2">
                    {index + 1}
                  </div>
                  <h4 className="text-xl font-medium text-slate-900 tracking-tight">{value.title}</h4>
                  <p className="text-slate-500 font-light leading-relaxed text-sm">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
