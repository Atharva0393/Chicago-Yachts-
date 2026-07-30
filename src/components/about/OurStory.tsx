import React from "react";
import Image from "next/image";

export function OurStory() {
  return (
    <section className="py-24 bg-white relative z-20">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="flex-1 order-2 lg:order-1">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Our Story</h2>
            <h3 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight leading-tight mb-8">
              Redefining Luxury on Lake Michigan.
            </h3>
            
            <div className="prose prose-lg prose-slate text-slate-600 font-light leading-relaxed">
              <p>
                Founded with a vision to bring world-class hospitality to the waters of Chicago, we set out to create an experience that transcends a typical boat rental. Chicago Yachts was born from a passion for the water and an uncompromising dedication to premium service.
              </p>
              <p>
                We believe that true luxury is seamless. From the moment you browse our curated fleet to the second you step off the dock after a breathtaking sunset cruise, every detail is meticulously managed by our professional team. Our USCG-licensed captains, dedicated concierges, and pristine vessels ensure your time on the water is nothing short of extraordinary.
              </p>
            </div>
          </div>
          
          <div className="flex-1 order-1 lg:order-2 w-full">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none rounded-[2rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1559599238-308793637427?q=80&w=2070&auto=format&fit=crop"
                alt="Luxury yacht interior"
                fill
                className="object-cover transition-transform duration-[3000ms] hover:scale-105"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
