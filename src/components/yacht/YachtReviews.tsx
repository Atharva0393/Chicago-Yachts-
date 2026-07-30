import React from "react";
import { Star, CheckCircle2 } from "lucide-react";

interface YachtReviewsProps {
  rating: number;
  reviews: number;
}

const mockReviews = [
  {
    name: "Sarah L.",
    date: "August 2026",
    rating: 5,
    text: "Absolutely incredible experience! The yacht was pristine, exactly as pictured. The captain was incredibly professional and navigated us to the perfect spot for sunset photos.",
    verified: true,
  },
  {
    name: "Michael R.",
    date: "July 2026",
    rating: 5,
    text: "We booked this for a corporate offsite. The luxury add-ons (private chef and premium bar) made it seamless. Highly recommend this vessel for groups.",
    verified: true,
  },
  {
    name: "Elena P.",
    date: "June 2026",
    rating: 4,
    text: "Beautiful boat and great amenities. The sound system was fantastic. Deducted one star just because the pickup location was slightly confusing to find at the marina, but the crew helped us out.",
    verified: true,
  }
];

export function YachtReviews({ rating, reviews }: YachtReviewsProps) {
  return (
    <section className="py-10 border-b border-slate-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-xl">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-2xl font-medium text-slate-900">{rating}</span>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight">Guest Reviews</h2>
          <span className="text-slate-500 font-light text-sm">Based on {reviews} verified charters</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockReviews.map((review, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium">
                  {review.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900">{review.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{review.date}</span>
                </div>
              </div>
              {review.verified && (
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-600">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </div>
              )}
            </div>
            
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className={`w-3.5 h-3.5 ${idx < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
              ))}
            </div>
            
            <p className="text-slate-600 font-light text-sm leading-relaxed">
              "{review.text}"
            </p>
          </div>
        ))}
      </div>
      
      {reviews > 3 && (
        <button className="mt-8 px-6 py-3 border border-slate-200 rounded-full text-slate-900 font-medium hover:bg-slate-50 transition-colors text-sm">
          Show all {reviews} reviews
        </button>
      )}
    </section>
  );
}
