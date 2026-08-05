import React, { useEffect } from "react";
import { X, Users, Ruler, Star, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  yacht: any;
}

export function QuickViewModal({ isOpen, onClose, yacht }: QuickViewModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen || !yacht) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition-colors border border-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Gallery (Simplified for Quick View) */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-slate-100">
          <Image 
            src={yacht.image} 
            alt={yacht.name} 
            fill 
            className="object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {yacht.isLuxury && (
              <span className="bg-slate-900/90 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-md">
                Luxe Tier
              </span>
            )}
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{yacht.rating}</span>
              <span className="text-slate-400 text-sm">({yacht.reviews} reviews)</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium text-slate-900 tracking-tight">{yacht.name}</h2>
            {yacht.manufacturer && (
              <p className="text-sm text-slate-500 font-medium tracking-wide uppercase mt-1">{yacht.manufacturer}</p>
            )}
          </div>

          <div className="flex gap-6 mb-8 border-y border-slate-100 py-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Capacity</span>
              <div className="flex items-center gap-2 text-slate-900 font-medium"><Users className="w-4 h-4" /> {yacht.capacity} Guests</div>
            </div>
            <div className="w-px bg-slate-100" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Length</span>
              <div className="flex items-center gap-2 text-slate-900 font-medium"><Ruler className="w-4 h-4" /> {yacht.length}</div>
            </div>
          </div>

          <p className="text-slate-600 font-light leading-relaxed mb-8 text-sm">
            Experience unparalleled luxury aboard {yacht.name}. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.
          </p>

          <div className="mb-8">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Included Amenities</h4>
            <div className="grid grid-cols-2 gap-3">
              {["Licensed Captain", "Premium Audio", "Sunpad Deck", "Coolers & Ice"].map(am => (
                <div key={am} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-green-500" /> {am}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <span className="text-slate-500 font-medium text-sm">Starting Price</span>
              <div className="text-right">
                <span className="text-2xl font-semibold text-slate-900">${yacht.price.toLocaleString()}</span>
                <span className="text-slate-400 text-sm"> / 4hrs</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/fleet/${yacht.slug || yacht.id}`} className="flex-1">
                <Button variant="outline" className="w-full rounded-full h-12 border-slate-200 hover:bg-slate-50 text-slate-900 font-medium">
                  Full Details
                </Button>
              </Link>
              <Link href={`/fleet/${yacht.slug || yacht.id}/book`} className="flex-1">
                <Button className="w-full rounded-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium hover-lift">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
