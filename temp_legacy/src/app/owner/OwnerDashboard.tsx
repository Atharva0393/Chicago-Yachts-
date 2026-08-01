"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Ship,
  CalendarDays,
  Wallet,
  Star,
  TrendingUp,
  Check,
  X,
  Plus,
  Eye,
} from "lucide-react";
import clsx from "clsx";
import { fmtMoney } from "@/lib/data";
import * as api from "@/lib/api";
import type { Booking, Yacht } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import RequireAuth from "@/components/RequireAuth";
import StatusBadge from "@/components/StatusBadge";
import CreateListingModal from "./CreateListingModal";

const tabs = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "listings", label: "My Listings", icon: Ship },
  { key: "bookings", label: "Bookings", icon: CalendarDays },
  { key: "earnings", label: "Earnings", icon: Wallet },
] as const;

type TabKey = (typeof tabs)[number]["key"];

// Payout/earnings history isn't modeled yet (phase 2 — Stripe Connect payouts,
// per docs/ARCHITECTURE.md §5) so this chart illustrates the intended UI with
// representative numbers rather than live data.
const monthlyEarnings = [
  { month: "Feb", amount: 8400 },
  { month: "Mar", amount: 11200 },
  { month: "Apr", amount: 14750 },
  { month: "May", amount: 19300 },
  { month: "Jun", amount: 24800 },
  { month: "Jul", amount: 21450 },
];

export default function OwnerDashboard() {
  return (
    <RequireAuth role="owner">
      <OwnerDashboardInner />
    </RequireAuth>
  );
}

function OwnerDashboardInner() {
  const { user, accessToken } = useAuth();
  const [tab, setTab] = useState<TabKey>("overview");
  const [myYachts, setMyYachts] = useState<Yacht[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = () => {
    if (!accessToken) return;
    setLoading(true);
    Promise.all([api.fetchMyYachts(accessToken), api.fetchOwnerBookings(accessToken)])
      .then(([yachts, bookings]) => {
        setMyYachts(yachts);
        setMyBookings(bookings);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [accessToken]);

  const decide = async (id: string, action: "approve" | "reject") => {
    if (!accessToken) return;
    const updated =
      action === "approve" ? await api.approveBooking(accessToken, id) : await api.rejectBooking(accessToken, id);
    setMyBookings((rs) => rs.map((r) => (r.id === id ? updated : r)));
  };

  const maxEarning = Math.max(...monthlyEarnings.map((m) => m.amount));
  const liveYachts = myYachts.filter((y) => y.status === "live");
  const avgRating = liveYachts.length
    ? (liveYachts.reduce((s, y) => s + y.rating, 0) / liveYachts.length).toFixed(2)
    : "—";
  const totalReviews = liveYachts.reduce((s, y) => s + y.reviewCount, 0);
  const pendingCount = myBookings.filter((b) => b.status === "pending").length;

  const kpis = [
    {
      label: "Total earnings (YTD)",
      value: fmtMoney(
        myBookings.filter((b) => ["paid", "confirmed", "completed"].includes(b.status)).reduce((s, b) => s + b.total, 0),
        myYachts[0]?.currency ?? "USD",
      ),
      icon: Wallet,
      delta: `${myBookings.length} bookings total`,
    },
    { label: "Pending requests", value: String(pendingCount), icon: CalendarDays, delta: "Awaiting your response" },
    { label: "Fleet rating", value: avgRating, icon: Star, delta: `${totalReviews} reviews` },
    { label: "Live listings", value: String(liveYachts.length), icon: Eye, delta: `${myYachts.length} total` },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 pb-16 pt-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
              Owner Portal
            </p>
            <h1 className="mt-2 font-display text-3xl text-navy-900">
              Welcome back, {user?.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-1 text-sm text-navy-900/55">{user?.email}</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-gold-300 transition-all hover:shadow-lg"
          >
            <Plus size={16} /> Add New Listing
          </button>
        </div>

        {/* tabs */}
        <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                tab === t.key
                  ? "bg-navy-900 text-gold-300 shadow-lg shadow-navy-900/15"
                  : "bg-white text-navy-900/60 ring-1 ring-navy-900/8 hover:text-navy-900"
              )}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-navy-900/5" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              {tab === "overview" && (
                <div className="space-y-8">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {kpis.map((k) => (
                      <div key={k.label} className="rounded-2xl bg-white p-6 ring-1 ring-navy-900/5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wider text-navy-900/45">
                            {k.label}
                          </span>
                          <k.icon size={16} className="text-gold-500" />
                        </div>
                        <p className="mt-3 font-display text-3xl text-navy-900">{k.value}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-sea-500">
                          <TrendingUp size={12} /> {k.delta}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-white p-6 ring-1 ring-navy-900/5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg text-navy-900">Earnings — last 6 months</h3>
                      <span className="text-xs text-navy-900/40">Illustrative — payouts arrive in phase 2</span>
                    </div>
                    <div className="mt-6 flex h-48 items-end gap-4">
                      {monthlyEarnings.map((m, i) => (
                        <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(m.amount / maxEarning) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-14 rounded-t-lg bg-gradient-to-t from-navy-900 to-navy-700 relative group"
                          >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-navy-900 px-2 py-0.5 text-[10px] text-gold-300 opacity-0 transition-opacity group-hover:opacity-100">
                              ${(m.amount / 1000).toFixed(1)}k
                            </span>
                          </motion.div>
                          <span className="text-xs text-navy-900/50">{m.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "listings" && (
                <div className="grid gap-6 md:grid-cols-2">
                  {myYachts.map((y) => (
                    <div key={y.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-navy-900/5">
                      <div className="relative h-44 bg-navy-800">
                        {y.images[0] && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={y.images[0]} alt={y.title} className="h-full w-full object-cover" />
                        )}
                        <span
                          className={clsx(
                            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize text-white",
                            y.status === "live" ? "bg-sea-500" : y.status === "pending" ? "bg-gold-500" : "bg-navy-900/70"
                          )}
                        >
                          {y.status}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-lg text-navy-900">{y.title}</h3>
                        <div className="mt-2 flex items-center gap-4 text-xs text-navy-900/55">
                          <span className="flex items-center gap-1">
                            <Star size={12} className="fill-gold-400 text-gold-400" /> {y.rating} ({y.reviewCount})
                          </span>
                          <span>{y.bookings} bookings</span>
                          <span>{fmtMoney(y.pricePerHour, y.currency)}/hr</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Link
                            href={`/yacht/${y.slug}`}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-navy-900 py-2 text-xs font-semibold text-gold-300"
                          >
                            <Eye size={13} /> View Listing
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowCreate(true)}
                    className="grid min-h-64 place-items-center rounded-2xl border-2 border-dashed border-navy-900/15 text-navy-900/40 transition-all hover:border-gold-400 hover:text-gold-600"
                  >
                    <span className="flex flex-col items-center gap-2">
                      <Plus size={28} />
                      <span className="text-sm font-medium">List another yacht</span>
                    </span>
                  </button>
                </div>
              )}

              {tab === "bookings" && (
                <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-navy-900/5">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead className="bg-ivory-100 text-xs uppercase tracking-wider text-navy-900/50">
                        <tr>
                          <th className="px-5 py-3.5">Booking</th>
                          <th className="px-5 py-3.5">Date</th>
                          <th className="px-5 py-3.5">Guests</th>
                          <th className="px-5 py-3.5">Total</th>
                          <th className="px-5 py-3.5">Status</th>
                          <th className="px-5 py-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-900/5">
                        {myBookings.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-5 py-10 text-center text-navy-900/40">
                              No bookings yet.
                            </td>
                          </tr>
                        )}
                        {myBookings.map((b) => (
                          <tr key={b.id} className="transition-colors hover:bg-ivory-50">
                            <td className="px-5 py-4">
                              <p className="font-medium text-navy-900">{b.yachtTitle}</p>
                              <p className="text-xs text-navy-900/45">{b.code} · {b.customer}</p>
                            </td>
                            <td className="px-5 py-4 text-navy-900/70">
                              {b.date} · {b.startTime} ({b.hours}h)
                            </td>
                            <td className="px-5 py-4 text-navy-900/70">{b.guests}</td>
                            <td className="px-5 py-4 font-medium text-navy-900">
                              {fmtMoney(b.total, b.currency)}
                            </td>
                            <td className="px-5 py-4">
                              <StatusBadge status={b.status} />
                            </td>
                            <td className="px-5 py-4 text-right">
                              {b.status === "pending" ? (
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => decide(b.id, "approve")}
                                    className="grid size-8 place-items-center rounded-full bg-sea-500/15 text-sea-500 transition-all hover:bg-sea-500 hover:text-white"
                                    aria-label="Approve"
                                  >
                                    <Check size={15} />
                                  </button>
                                  <button
                                    onClick={() => decide(b.id, "reject")}
                                    className="grid size-8 place-items-center rounded-full bg-red-500/10 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                                    aria-label="Decline"
                                  >
                                    <X size={15} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-navy-900/35">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === "earnings" && (
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="rounded-2xl bg-navy-950 p-7 text-ivory-50">
                    <p className="text-xs uppercase tracking-wider text-ivory-100/50">
                      Available for payout
                    </p>
                    <p className="mt-3 font-display text-4xl text-gold-300">
                      {fmtMoney(
                        myBookings.filter((b) => b.status === "completed").reduce((s, b) => s + b.total, 0),
                        myYachts[0]?.currency ?? "USD",
                      )}
                    </p>
                    <button
                      disabled
                      title="Stripe Connect payouts arrive in phase 2"
                      className="mt-6 w-full cursor-not-allowed rounded-full bg-gold-400/50 py-3 text-sm font-semibold text-navy-950/50"
                    >
                      Withdraw to Bank
                    </button>
                    <p className="mt-3 text-center text-xs text-ivory-100/40">
                      Payouts via Stripe · coming in phase 2
                    </p>
                  </div>
                  <div className="space-y-4 lg:col-span-2">
                    {myBookings
                      .filter((b) => ["paid", "confirmed", "completed"].includes(b.status))
                      .map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between rounded-2xl bg-white p-5 ring-1 ring-navy-900/5"
                        >
                          <div>
                            <p className="font-medium text-navy-900">{b.yachtTitle}</p>
                            <p className="text-xs text-navy-900/45">{b.code} · {b.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-display text-lg text-navy-900">{fmtMoney(b.total, b.currency)}</p>
                            <StatusBadge status={b.status} />
                          </div>
                        </div>
                      ))}
                    {myBookings.filter((b) => ["paid", "confirmed", "completed"].includes(b.status)).length === 0 && (
                      <div className="rounded-2xl bg-white p-10 text-center text-sm text-navy-900/40 ring-1 ring-navy-900/5">
                        No completed transactions yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <CreateListingModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => {
          setShowCreate(false);
          load();
        }}
      />
    </div>
  );
}
