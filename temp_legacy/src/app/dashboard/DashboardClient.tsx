"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Star, ArrowRight } from "lucide-react";
import { fmtMoney } from "@/lib/data";
import * as api from "@/lib/api";
import type { Booking } from "@/lib/types";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import StatusBadge from "@/components/StatusBadge";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-context";

export default function DashboardClient() {
  return (
    <RequireAuth>
      <TripsInner />
    </RequireAuth>
  );
}

function TripsInner() {
  const { accessToken } = useAuth();
  const [trips, setTrips] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    api
      .fetchMyBookings(accessToken)
      .then(setTrips)
      .finally(() => setLoading(false));
  }, [accessToken]);

  const cancel = async (id: string) => {
    if (!accessToken) return;
    const updated = await api.cancelBooking(accessToken, id);
    setTrips((ts) => ts.map((t) => (t.id === id ? updated : t)));
  };

  return (
    <div className="min-h-screen bg-ivory-100 pb-16 pt-24">
      <div className="mx-auto max-w-5xl px-5">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
            My Account
          </p>
          <h1 className="mt-2 font-display text-3xl text-navy-900">Your Trips</h1>
          <p className="mt-1 text-sm text-navy-900/55">
            Upcoming and past charters, all in one place.
          </p>
        </FadeIn>

        {loading ? (
          <div className="mt-8 space-y-5">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-white ring-1 ring-navy-900/5" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-12 text-center ring-1 ring-navy-900/5">
            <p className="font-display text-lg text-navy-900">No trips booked yet</p>
            <p className="mt-2 text-sm text-navy-900/55">
              Once you book a charter, it will show up here.
            </p>
          </div>
        ) : (
          <Stagger className="mt-8 space-y-5">
            {trips.map((b) => (
              <StaggerItem key={b.id}>
                <div className="card-lift flex flex-col gap-5 overflow-hidden rounded-2xl bg-white ring-1 ring-navy-900/5 sm:flex-row">
                  <div className="h-44 sm:h-auto sm:w-64 shrink-0 bg-navy-800">
                    {b.yachtImage && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={b.yachtImage} alt={b.yachtTitle} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-4 p-5 sm:py-6 sm:pl-0 sm:pr-6">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-xs text-navy-900/40">{b.code}</span>
                        <StatusBadge status={b.status} />
                      </div>
                      <h2 className="mt-2 font-display text-xl text-navy-900">{b.yachtTitle}</h2>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-navy-900/55">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-gold-500" /> {b.destination}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-gold-500" />
                          {b.date} at {b.startTime} · {b.hours} hours · {b.guests} guests
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-display text-lg text-navy-900">
                        {fmtMoney(b.total, b.currency)}
                      </p>
                      <div className="flex gap-2">
                        {b.status === "completed" ? (
                          <button className="flex items-center gap-1.5 rounded-full bg-gold-400 px-4 py-2 text-xs font-semibold text-navy-950 transition-all hover:bg-gold-300">
                            <Star size={13} /> Leave a Review
                          </button>
                        ) : ["pending", "approved", "paid", "confirmed"].includes(b.status) ? (
                          <button
                            onClick={() => cancel(b.id)}
                            className="rounded-full bg-ivory-100 px-4 py-2 text-xs font-semibold text-navy-900 transition-colors hover:bg-ivory-200"
                          >
                            Cancel Booking
                          </button>
                        ) : null}
                        <Link
                          href={`/yacht/${b.yachtSlug}`}
                          className="flex items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2 text-xs font-semibold text-gold-300"
                        >
                          View Yacht <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <FadeIn delay={0.2}>
          <div className="mt-10 rounded-2xl bg-navy-950 p-8 text-center">
            <h3 className="font-display text-xl text-ivory-50">Ready for the next one?</h3>
            <p className="mt-2 text-sm text-ivory-100/60">
              Six destinations. Hundreds of verified yachts. One booking away.
            </p>
            <Link
              href="/search"
              className="mt-5 inline-block rounded-full bg-gold-400 px-7 py-3 text-sm font-semibold text-navy-950 transition-all hover:bg-gold-300"
            >
              Explore the Fleet
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
