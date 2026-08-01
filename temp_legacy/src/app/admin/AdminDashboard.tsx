"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Ship,
  CalendarDays,
  LifeBuoy,
  DollarSign,
  TrendingUp,
  Check,
  X,
  ShieldAlert,
} from "lucide-react";
import clsx from "clsx";
import { fmtMoney } from "@/lib/data";
import * as api from "@/lib/api";
import type { Booking, Yacht } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import RequireAuth from "@/components/RequireAuth";
import StatusBadge from "@/components/StatusBadge";

const tabs = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "moderation", label: "Listing Approvals", icon: Ship },
  { key: "users", label: "Users & Owners", icon: Users },
  { key: "bookings", label: "Bookings", icon: CalendarDays },
  { key: "support", label: "Support", icon: LifeBuoy },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function AdminDashboard() {
  return (
    <RequireAuth role={["admin", "manager", "support"]} dark>
      <AdminDashboardInner />
    </RequireAuth>
  );
}

function AdminDashboardInner() {
  const { user, accessToken } = useAuth();
  const [tab, setTab] = useState<TabKey>("overview");
  const [overview, setOverview] = useState<api.AdminOverview | null>(null);
  const [queue, setQueue] = useState<Yacht[]>([]);
  const [users, setUsers] = useState<api.AdminUser[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<api.AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!accessToken) return;
    setLoading(true);
    Promise.all([
      api.fetchAdminOverview(accessToken),
      api.fetchPendingListings(accessToken),
      api.fetchAdminUsers(accessToken),
      api.fetchAdminBookings(accessToken),
      api.fetchSupportTickets(accessToken),
    ])
      .then(([ov, pending, us, bk, tk]) => {
        setOverview(ov);
        setQueue(pending);
        setUsers(us);
        setAllBookings(bk);
        setTickets(tk);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [accessToken]);

  const decideListing = async (slug: string, action: "approve" | "reject") => {
    if (!accessToken) return;
    if (action === "approve") await api.approveListing(accessToken, slug);
    else await api.rejectListing(accessToken, slug);
    setQueue((q) => q.filter((y) => y.slug !== slug));
    setOverview((o) =>
      o ? { ...o, pendingYachts: o.pendingYachts - 1, liveYachts: action === "approve" ? o.liveYachts + 1 : o.liveYachts } : o,
    );
  };

  const toggleUserStatus = async (id: string, current: string) => {
    if (!accessToken) return;
    const next = current === "flagged" ? "active" : "suspended";
    await api.setUserStatus(accessToken, id, next);
    setUsers((us) => us.map((u) => (u.id === id ? { ...u, status: next } : u)));
  };

  const kpis = overview
    ? [
        { label: "GMV (paid+)", value: fmtMoney(overview.gmv, "USD"), icon: DollarSign, delta: `${overview.bookings} bookings total` },
        { label: "Total bookings", value: String(overview.bookings), icon: CalendarDays, delta: "All-time" },
        { label: "Live listings", value: String(overview.liveYachts), icon: Ship, delta: `${overview.pendingYachts} pending review` },
        { label: "Registered users", value: String(overview.users), icon: Users, delta: "Customers + owners" },
      ]
    : [];

  const destinationShares = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of allBookings) counts.set(b.destination, (counts.get(b.destination) ?? 0) + 1);
    const total = allBookings.length || 1;
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, share: Math.round((count / total) * 100) }))
      .sort((a, b) => b.share - a.share);
  }, [allBookings]);

  const disputedCount = allBookings.filter((b) => b.status === "disputed").length;
  const highPriorityTickets = tickets.filter((t) => t.priority === "high" && t.status !== "resolved").length;
  const flaggedUsers = users.filter((u) => u.status === "flagged").length;

  const attentionItems = [
    queue.length > 0 && { text: `${queue.length} listing${queue.length === 1 ? "" : "s"} pending approval`, tone: "text-gold-300" },
    disputedCount > 0 && { text: `${disputedCount} booking dispute${disputedCount === 1 ? "" : "s"} open`, tone: "text-orange-400" },
    highPriorityTickets > 0 && { text: `${highPriorityTickets} high-priority support ticket${highPriorityTickets === 1 ? "" : "s"}`, tone: "text-orange-400" },
    flaggedUsers > 0 && { text: `${flaggedUsers} flagged user account${flaggedUsers === 1 ? "" : "s"} for review`, tone: "text-red-400" },
  ].filter(Boolean) as { text: string; tone: string }[];

  return (
    <div className="min-h-screen bg-navy-950 pb-16 pt-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
              Admin Console
            </p>
            <h1 className="mt-2 font-display text-3xl text-ivory-50">Platform Control Center</h1>
            <p className="mt-1 text-sm text-ivory-100/50">
              Signed in as {user?.name} · Role: {user?.role}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                tab === t.key
                  ? "bg-gold-400 text-navy-950 shadow-lg shadow-gold-400/20"
                  : "bg-navy-800 text-ivory-100/60 ring-1 ring-ivory-100/8 hover:text-ivory-100"
              )}
            >
              <t.icon size={15} /> {t.label}
              {t.key === "moderation" && queue.length > 0 && (
                <span className={clsx(
                  "grid size-5 place-items-center rounded-full text-[10px] font-bold",
                  tab === t.key ? "bg-navy-950 text-gold-300" : "bg-gold-400 text-navy-950"
                )}>
                  {queue.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-navy-800 ring-1 ring-ivory-100/8" />
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
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {kpis.map((k) => (
                      <div key={k.label} className="rounded-2xl bg-navy-800 p-6 ring-1 ring-ivory-100/8">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wider text-ivory-100/40">
                            {k.label}
                          </span>
                          <k.icon size={16} className="text-gold-400" />
                        </div>
                        <p className="mt-3 font-display text-3xl text-ivory-50">{k.value}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-sea-400">
                          <TrendingUp size={12} /> {k.delta}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl bg-navy-800 p-6 ring-1 ring-ivory-100/8">
                      <h3 className="font-display text-lg text-ivory-50">Bookings by destination</h3>
                      {destinationShares.length === 0 ? (
                        <p className="mt-5 text-sm text-ivory-100/40">No bookings yet.</p>
                      ) : (
                        <div className="mt-5 space-y-4">
                          {destinationShares.map((d, i) => (
                            <div key={d.name}>
                              <div className="flex justify-between text-xs text-ivory-100/60">
                                <span>{d.name}</span>
                                <span>{d.share}%</span>
                              </div>
                              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-navy-950">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${d.share}%` }}
                                  transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                  className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl bg-navy-800 p-6 ring-1 ring-ivory-100/8">
                      <h3 className="flex items-center gap-2 font-display text-lg text-ivory-50">
                        <ShieldAlert size={18} className="text-gold-400" /> Needs attention
                      </h3>
                      {attentionItems.length === 0 ? (
                        <p className="mt-5 text-sm text-ivory-100/40">Nothing needs attention right now. 🎉</p>
                      ) : (
                        <ul className="mt-5 space-y-3">
                          {attentionItems.map((a) => (
                            <li
                              key={a.text}
                              className="flex items-center gap-3 rounded-xl bg-navy-950/60 px-4 py-3 text-sm"
                            >
                              <span className={clsx("size-1.5 rounded-full bg-current", a.tone)} />
                              <span className="text-ivory-100/80">{a.text}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {tab === "moderation" && (
                <div className="space-y-4">
                  <AnimatePresence>
                    {queue.length === 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-2xl bg-navy-800 p-10 text-center text-ivory-100/60"
                      >
                        Queue clear — no listings waiting for review. 🎉
                      </motion.p>
                    )}
                    {queue.map((y) => (
                      <motion.div
                        key={y.id}
                        layout
                        exit={{ opacity: 0, x: 60 }}
                        transition={{ duration: 0.35 }}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-navy-800 p-6 ring-1 ring-ivory-100/8"
                      >
                        <div>
                          <h3 className="font-display text-lg text-ivory-50">{y.title}</h3>
                          <p className="mt-1 text-xs text-ivory-100/50">
                            {y.ownerName} · {y.marina} · {fmtMoney(y.pricePerHour, y.currency)}/hr
                          </p>
                          <p className="mt-2 text-xs text-ivory-100/70">
                            {y.amenities.length} amenities listed · {y.images.length} photos
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => decideListing(y.slug, "approve")}
                            className="flex items-center gap-2 rounded-full bg-sea-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                          >
                            <Check size={15} /> Approve
                          </button>
                          <button
                            onClick={() => decideListing(y.slug, "reject")}
                            className="flex items-center gap-2 rounded-full bg-red-500/15 px-5 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500 hover:text-white"
                          >
                            <X size={15} /> Reject
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {tab === "users" && (
                <div className="overflow-hidden rounded-2xl bg-navy-800 ring-1 ring-ivory-100/8">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead className="bg-navy-950/60 text-xs uppercase tracking-wider text-ivory-100/40">
                        <tr>
                          <th className="px-5 py-3.5">User</th>
                          <th className="px-5 py-3.5">Role</th>
                          <th className="px-5 py-3.5">Bookings / Listings</th>
                          <th className="px-5 py-3.5">Status</th>
                          <th className="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ivory-100/5">
                        {users.map((u) => (
                          <tr key={u.id} className="transition-colors hover:bg-navy-950/40">
                            <td className="px-5 py-4">
                              <p className="font-medium text-ivory-50">{u.name}</p>
                              <p className="text-xs text-ivory-100/40">{u.email}</p>
                            </td>
                            <td className="px-5 py-4 capitalize text-ivory-100/70">{u.role}</td>
                            <td className="px-5 py-4 text-ivory-100/70">
                              {u._count.bookings} / {u._count.yachts}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={clsx(
                                  "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
                                  u.status === "active"
                                    ? "bg-sea-500/15 text-sea-400"
                                    : "bg-red-500/15 text-red-400"
                                )}
                              >
                                {u.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button
                                onClick={() => toggleUserStatus(u.id, u.status)}
                                className="rounded-full bg-navy-950 px-4 py-1.5 text-xs text-ivory-100/70 transition-colors hover:text-gold-300"
                              >
                                {u.status === "flagged" ? "Reinstate" : u.status === "suspended" ? "Reinstate" : "Suspend"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === "bookings" && (
                <div className="overflow-hidden rounded-2xl bg-navy-800 ring-1 ring-ivory-100/8">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead className="bg-navy-950/60 text-xs uppercase tracking-wider text-ivory-100/40">
                        <tr>
                          <th className="px-5 py-3.5">Code</th>
                          <th className="px-5 py-3.5">Yacht</th>
                          <th className="px-5 py-3.5">Customer</th>
                          <th className="px-5 py-3.5">Date</th>
                          <th className="px-5 py-3.5">Total</th>
                          <th className="px-5 py-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ivory-100/5">
                        {allBookings.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-5 py-10 text-center text-ivory-100/40">
                              No bookings yet.
                            </td>
                          </tr>
                        )}
                        {allBookings.map((b) => (
                          <tr key={b.id} className="transition-colors hover:bg-navy-950/40">
                            <td className="px-5 py-4 font-mono text-xs text-gold-300">{b.code}</td>
                            <td className="px-5 py-4">
                              <p className="font-medium text-ivory-50">{b.yachtTitle}</p>
                              <p className="text-xs text-ivory-100/40">{b.destination}</p>
                            </td>
                            <td className="px-5 py-4 text-ivory-100/70">{b.customer}</td>
                            <td className="px-5 py-4 text-ivory-100/70">
                              {b.date} · {b.startTime}
                            </td>
                            <td className="px-5 py-4 font-medium text-ivory-50">
                              {fmtMoney(b.total, b.currency)}
                            </td>
                            <td className="px-5 py-4">
                              <StatusBadge status={b.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === "support" && (
                <div className="space-y-4">
                  {tickets.length === 0 && (
                    <p className="rounded-2xl bg-navy-800 p-10 text-center text-ivory-100/60">
                      No support tickets right now.
                    </p>
                  )}
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-navy-800 p-6 ring-1 ring-ivory-100/8"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-gold-300">{t.id.slice(0, 8)}</span>
                          <span
                            className={clsx(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                              t.priority === "high"
                                ? "bg-red-500/15 text-red-400"
                                : "bg-gold-400/15 text-gold-300"
                            )}
                          >
                            {t.priority}
                          </span>
                          <span className="rounded-full bg-navy-950 px-2 py-0.5 text-[10px] capitalize text-ivory-100/50">
                            {t.status}
                          </span>
                        </div>
                        <h3 className="mt-2 font-medium text-ivory-50">{t.subject}</h3>
                        <p className="mt-1 text-xs text-ivory-100/45">
                          From {t.user.name} · {t.assignee ? `Assigned to ${t.assignee.name}` : "Unassigned"}
                        </p>
                      </div>
                      <button className="rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-all hover:bg-gold-300">
                        Open Ticket
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
