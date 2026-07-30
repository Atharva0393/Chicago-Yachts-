import React from "react";
import Image from "next/image";

const team = [
  {
    name: "James Sterling",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000&auto=format&fit=crop",
    bio: "With over 20 years in luxury hospitality and maritime operations, James founded Chicago Yachts to elevate the standard of chartering."
  },
  {
    name: "Elena Rodriguez",
    role: "Director of Operations",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2000&auto=format&fit=crop",
    bio: "Elena ensures that every vessel in our fleet operates flawlessly, managing our pristine maintenance schedules and crew logistics."
  },
  {
    name: "Capt. Marcus Thorne",
    role: "Head Captain",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop",
    bio: "A master mariner with decades of experience on the Great Lakes, Marcus leads our team of highly skilled USCG-licensed captains."
  },
  {
    name: "Sophia Chen",
    role: "Guest Concierge",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2000&auto=format&fit=crop",
    bio: "Sophia curates bespoke itineraries and coordinates luxury add-ons, ensuring your time onboard is perfectly tailored to your vision."
  }
];

export function MeetTheTeam() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Leadership</h2>
        <h3 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight mb-16">
          Meet Our Team
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {team.map((member, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6 shadow-xl border-4 border-white transition-transform duration-500 group-hover:scale-105">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <h4 className="text-xl font-medium text-slate-900 tracking-tight">{member.name}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 mb-4">{member.role}</p>
              <p className="text-slate-500 font-light text-sm leading-relaxed max-w-xs">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
