import React from "react";
import { Phone, Mail, MessageCircle, MapPin, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { companyInfo } from "@/data/company";

export function ContactCards() {
  const cards = [
    {
      icon: <Phone className="w-6 h-6 stroke-[1.5]" />,
      title: "Phone",
      description: "Call our concierge team",
      actionText: companyInfo.phone,
      href: `tel:${companyInfo.phone.replace(/[^0-9+]/g, '')}`
    },
    {
      icon: <Mail className="w-6 h-6 stroke-[1.5]" />,
      title: "Email",
      description: "Receive a response within 24 hours",
      actionText: companyInfo.email,
      href: `mailto:${companyInfo.email}`
    },
    {
      icon: <MessageCircle className="w-6 h-6 stroke-[1.5]" />,
      title: "WhatsApp",
      description: "Instant booking assistance",
      actionText: "Chat with us",
      href: "https://wa.me/1234567890"
    },
    {
      icon: <MapPin className="w-6 h-6 stroke-[1.5]" />,
      title: "Location",
      description: "Chicago Harbor Marina",
      actionText: "Get Directions",
      href: "https://maps.google.com/?q=Chicago+Harbor+Marina"
    }
  ];

  return (
    <section id="contact-cards" className="py-24 bg-background relative z-20 -mt-10">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <Link 
              href={card.href} 
              key={index} 
              className="group block bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 mb-8 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                {card.icon}
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-2 tracking-tight">{card.title}</h3>
              <p className="text-slate-500 font-light text-sm mb-8 leading-relaxed h-10">
                {card.description}
              </p>
              <div className="flex items-center text-sm font-medium text-slate-900 group-hover:text-slate-600 transition-colors">
                {card.actionText}
                <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
