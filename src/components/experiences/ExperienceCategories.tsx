import React from "react";
import { Sparkles, Compass, PartyPopper, Briefcase, Heart, Baby } from "lucide-react";

const categories = [
  { icon: Sparkles, name: "Luxury", description: "Bespoke, high-end VIP charters." },
  { icon: Compass, name: "Adventure", description: "Exploration and water sports." },
  { icon: PartyPopper, name: "Celebration", description: "Birthdays and milestones." },
  { icon: Briefcase, name: "Corporate", description: "Impress clients and team building." },
  { icon: Heart, name: "Romantic", description: "Proposals and anniversaries." },
  { icon: Baby, name: "Family", description: "Safe, relaxing days on the water." }
];

export function ExperienceCategories() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-normal text-slate-900 tracking-tight">
            Curated For Every Occasion
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div 
                key={category.name} 
                className="group bg-white rounded-2xl p-6 text-center border border-slate-100 hover:shadow-premium transition-luxury hover:-translate-y-1 cursor-pointer flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{category.name}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                  {category.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
