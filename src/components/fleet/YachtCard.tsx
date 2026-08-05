"use client"

import { Star, Users, Ruler, MapPin, Zap, Heart, Scale, Eye, CheckCircle2, Crown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCompare } from "@/lib/contexts/CompareContext";
import { useWishlist } from "@/lib/contexts/WishlistContext";
import { cn } from "@/lib/utils";

interface YachtCardProps {
  id: string | number;
  slug?: string;
  name: string;
  manufacturer?: string;
  image: string;
  price: number;
  capacity: number;
  length: string;
  location: string;
  rating: number;
  reviews: number;
  verified?: boolean;
  isLuxury?: boolean;
  instantBook?: boolean;
  onQuickView?: (id: string | number) => void;
}

export function YachtCard({
  id,
  slug,
  name,
  manufacturer,
  image,
  price,
  capacity,
  length,
  location,
  rating,
  reviews,
  verified,
  isLuxury,
  instantBook,
  onQuickView,
}: YachtCardProps) {
  const { selectedYachts, addYacht, removeYacht } = useCompare();
  const { isSaved, toggleWishlist } = useWishlist();
  
  const isCompared = selectedYachts.some(y => y.id === String(id));
  const isWishlisted = isSaved(String(id));
  
  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (isCompared) {
      removeYacht(String(id));
    } else {
      addYacht(String(id));
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(String(id));
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(id);
  };

  return (
    <div className="group relative flex flex-col gap-4 active:scale-[0.99] transition-transform duration-300 h-full bg-white rounded-3xl p-4 border border-slate-100 hover:shadow-premium hover:-translate-y-1">
      <Link href={`/fleet/${slug || id}`} className="absolute inset-0 z-0" aria-label={`View details for ${name}`} />
      
      <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-slate-100 shadow-sm pointer-events-none">
        <Image 
          src={image}
          alt={`Luxury yacht ${name}`}
          fill
          className="object-cover transition-transform duration-[2000ms] ease-out lg:group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {verified && (
            <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-900 flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="h-3 w-3 text-green-500 fill-green-50" /> Verified
            </div>
          )}
          {isLuxury && (
            <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1 shadow-sm">
              <Crown className="h-3 w-3" /> Luxe Tier
            </div>
          )}
          {instantBook && (
            <div className="bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white flex items-center gap-1 shadow-sm">
              <Zap className="h-3 w-3 fill-white" /> Instant Book
            </div>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-auto gap-3">
          <button 
            onClick={handleQuickView}
            className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Absolute Actions (Wishlist & Compare) top right outside the image bounds */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 pointer-events-auto">
        <button 
          onClick={handleWishlistToggle}
          className="p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 bg-white/90 hover:bg-white text-slate-400 border border-slate-200 group/heart"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4 transition-all duration-300", isWishlisted ? "fill-red-500 text-red-500 scale-110" : "group-hover/heart:text-red-500")} />
        </button>
        <button 
          onClick={handleCompareToggle}
          className={cn(
            "p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-300",
            isCompared ? "bg-slate-900 text-white border-transparent" : "bg-white/90 hover:bg-white text-slate-400 border border-slate-200"
          )}
          title="Compare"
        >
          <Scale className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col flex-1 pointer-events-none mt-1">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-medium text-slate-900 text-lg tracking-tight line-clamp-1">{name}</h3>
            {manufacturer && <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">{manufacturer}</p>}
          </div>
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-slate-900">{rating}</span>
            </div>
            <span className="text-[10px] text-slate-400 underline">({reviews} reviews)</span>
          </div>
        </div>
        
        <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4 font-light mt-1">
          <MapPin className="h-3.5 w-3.5" />
          {location}
        </p>
        
        {/* Quick Specs */}
        <div className="flex items-center gap-4 text-sm text-slate-600 mb-6 bg-slate-50 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 font-medium"><Users className="h-4 w-4 text-slate-400" /> {capacity}</div>
          <span className="w-px h-4 bg-slate-200"></span>
          <div className="flex items-center gap-1.5 font-medium"><Ruler className="h-4 w-4 text-slate-400" /> {length}</div>
        </div>
        
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-baseline justify-between border-t border-slate-100 pt-4">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Starting</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-medium tracking-tight text-slate-900">${price.toLocaleString()}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">/ 4hrs</span>
            </div>
          </div>
          
          <div className="flex gap-2 pointer-events-auto">
            <Link 
              href={`/fleet/${slug || id}`}
              className="flex-1 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors text-center"
            >
              Details
            </Link>
            <Link 
              href={`/fleet/${slug || id}/book`}
              className="flex-1 bg-slate-900 text-white hover:bg-slate-800 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors text-center shadow-md"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
