"use client"

import React from "react";
import { Star, MapPin, Share, Heart, CheckCircle2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/contexts/WishlistContext";

interface YachtHeaderProps {
  id: string;
  name: string;
  manufacturer: string;
  rating: number;
  reviews: number;
  location: string;
  isLuxury?: boolean;
  verified?: boolean;
}

export function YachtHeader({ id, name, manufacturer, rating, reviews, location, isLuxury, verified }: YachtHeaderProps) {
  const { isSaved, toggleWishlist } = useWishlist();
  const isWishlisted = isSaved(id);

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 py-10 border-b border-slate-100">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          {isLuxury && (
            <span className="bg-slate-900 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <Crown className="w-3 h-3" /> Luxe Tier
            </span>
          )}
          {verified && (
            <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-green-600" /> Verified
            </span>
          )}
          {manufacturer && (
            <span className="text-xs text-slate-500 font-medium tracking-wide uppercase px-2">
              {manufacturer}
            </span>
          )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-normal text-slate-900 tracking-tight mb-4">
          {name}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-slate-900">{rating}</span>
            <span className="text-slate-400 underline decoration-slate-200 hover:decoration-slate-400 transition-colors cursor-pointer">
              {reviews} reviews
            </span>
          </div>
          <span className="text-slate-200">•</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="underline decoration-slate-200 hover:decoration-slate-400 transition-colors cursor-pointer">
              {location}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button 
          variant="outline" 
          className="rounded-full h-11 px-5 border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium"
        >
          <Share className="w-4 h-4" />
          Share
        </Button>
        <Button 
          variant="outline" 
          onClick={() => toggleWishlist(id)}
          className={`rounded-full h-11 px-5 border-slate-200 transition-colors flex items-center gap-2 font-medium ${isWishlisted ? 'text-red-500 hover:bg-red-50 hover:text-red-600' : 'text-slate-700 hover:bg-slate-50'}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
          {isWishlisted ? 'Saved' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
