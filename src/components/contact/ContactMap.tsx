import React from "react";
import { Navigation, Car, MapPin } from "lucide-react";

export function ContactMap() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Location</h2>
          <h3 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight leading-tight">
            Departure Points
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Map Placeholder */}
          <div className="lg:w-2/3">
            <div className="w-full h-[400px] md:h-[600px] bg-slate-100 rounded-[2rem] border border-slate-200 overflow-hidden relative group">
              {/* This is a placeholder for Google Maps */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
              <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-[2px]"></div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl mb-4 animate-bounce">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-xl font-medium text-slate-900">
                  Interactive Map Integration
                </div>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-sm mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 mb-2">Chicago Harbor Marina</h4>
              <p className="text-sm font-light text-slate-500 leading-relaxed mb-4">
                Our primary departure point, located just south of Navy Pier. Exact slip numbers are provided upon booking confirmation.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-sm mb-4">
                <Car className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 mb-2">Parking Information</h4>
              <p className="text-sm font-light text-slate-500 leading-relaxed mb-4">
                Paid parking is available at the Millennium Park Garage. We highly recommend using rideshare services during peak summer weekends.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-sm mb-4">
                <Navigation className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 mb-2">Alternate Harbors</h4>
              <p className="text-sm font-light text-slate-500 leading-relaxed mb-4">
                Departures from Burnham Harbor or Monroe Harbor can be arranged upon request for an additional repositioning fee.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
