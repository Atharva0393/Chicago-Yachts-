import React from "react";
import Image from "next/image";
import { ArrowRight, Users, Clock } from "lucide-react";
import Link from "next/link";

import { dataService } from "@/services/data.service";
export async function FeaturedExperiences() {
  const experiences = await dataService.getExperiences();
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight">
              Featured Experiences
            </h2>
            <p className="mt-4 text-slate-500 text-lg font-light leading-relaxed">
              Curated journeys designed perfectly for their unique waterfront environments.
            </p>
          </div>
          <Link href="#categories" className="text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors flex items-center gap-2 group">
            View All Experiences
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {experiences.map((exp, index) => (
            <div 
              key={exp.id} 
              id={exp.id}
              className={`group flex flex-col bg-white rounded-[24px] overflow-hidden border border-slate-100 hover:shadow-premium transition-luxury ${index % 2 === 1 ? 'md:translate-y-12' : ''}`}
            >
              <div className="relative h-[300px] w-full overflow-hidden">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-medium text-slate-900 mb-3">{exp.title}</h3>
                <p className="text-slate-500 text-sm font-light leading-relaxed mb-8 flex-1">
                  {exp.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{exp.guests}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{exp.duration}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Recommended Yachts</span>
                      <span className="text-sm text-slate-700 font-medium">{exp.yachts}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-semibold text-slate-900">From ${exp.price}/hour</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Link href="/contact" className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                      Contact Us
                    </Link>
                    <Link href="https://wa.me/1234567890" target="_blank" className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      WhatsApp
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
