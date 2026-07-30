import React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const socials = [
  { name: "Instagram", icon: <Instagram className="w-6 h-6 stroke-[1.5]" />, href: "#instagram" },
  { name: "Facebook", icon: <Facebook className="w-6 h-6 stroke-[1.5]" />, href: "#facebook" },
  { name: "LinkedIn", icon: <Linkedin className="w-6 h-6 stroke-[1.5]" />, href: "#linkedin" },
  { name: "YouTube", icon: <Youtube className="w-6 h-6 stroke-[1.5]" />, href: "#youtube" }
];

export function SocialCards() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Community</h2>
          <h3 className="text-3xl md:text-4xl font-normal text-white tracking-tight">
            Follow Our Journey
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {socials.map((social, index) => (
            <Link 
              key={index} 
              href={social.href}
              className="group bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]"
            >
              <div className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                {social.icon}
              </div>
              <div className="flex items-center gap-1 text-white font-medium text-sm">
                {social.name}
                <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
