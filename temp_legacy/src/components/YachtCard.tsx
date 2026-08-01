import Link from "next/link";
import { Star, Users, Ruler, Zap, BadgeCheck } from "lucide-react";
import type { Yacht } from "@/lib/types";
import { fmtMoney } from "@/lib/data";

export default function YachtCard({ yacht }: { yacht: Yacht }) {
  return (
    <Link
      href={`/yacht/${yacht.slug}`}
      className="card-lift group block overflow-hidden rounded-2xl bg-white shadow-md shadow-navy-900/5 ring-1 ring-navy-900/5"
    >
      <div className="relative h-56 overflow-hidden bg-navy-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={yacht.images[0]}
          alt={yacht.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          {yacht.instantBook && (
            <span className="flex items-center gap-1 rounded-full bg-sea-500 px-2.5 py-1 text-[11px] font-semibold text-white">
              <Zap size={11} /> Instant Book
            </span>
          )}
          {yacht.superOwner && (
            <span className="flex items-center gap-1 rounded-full bg-gold-400 px-2.5 py-1 text-[11px] font-semibold text-navy-950">
              <BadgeCheck size={11} /> Super Owner
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 text-xs font-medium uppercase tracking-wider text-ivory-100/90">
          {yacht.destinationName} · {yacht.type}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug text-navy-900 transition-colors group-hover:text-gold-600">
            {yacht.title}
          </h3>
          <span className="mt-0.5 flex shrink-0 items-center gap-1 text-sm font-semibold text-navy-900">
            <Star size={14} className="fill-gold-400 text-gold-400" />
            {yacht.rating}
            <span className="font-normal text-navy-900/50">({yacht.reviewCount})</span>
          </span>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-navy-900/60">
          <span className="flex items-center gap-1.5">
            <Ruler size={13} /> {yacht.lengthFt} ft
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} /> Up to {yacht.capacity} guests
          </span>
          {yacht.withCaptain && <span className="hidden sm:inline">With captain</span>}
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-navy-900/8 pt-4">
          <p>
            <span className="font-display text-xl font-semibold text-navy-900">
              {fmtMoney(yacht.pricePerHour, yacht.currency)}
            </span>
            <span className="text-sm text-navy-900/50"> / hour</span>
          </p>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
