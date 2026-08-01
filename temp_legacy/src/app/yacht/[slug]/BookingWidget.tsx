"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, Users, ChevronDown, PartyPopper, LogIn } from "lucide-react";
import type { Yacht } from "@/lib/types";
import { fmtMoney } from "@/lib/data";
import { ApiError, createBooking } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const SERVICE_FEE_RATE = 0.1;

export default function BookingWidget({ yacht }: { yacht: Yacht }) {
  const { user, accessToken } = useAuth();
  const [date, setDate] = useState("");
  const [start, setStart] = useState("14:00");
  const [hours, setHours] = useState(yacht.minHours);
  const [guests, setGuests] = useState(2);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingCode, setBookingCode] = useState<string | null>(null);

  const subtotal = yacht.pricePerHour * hours;
  const fee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + fee;

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const book = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !accessToken) return;
    setSubmitting(true);
    setError(null);
    try {
      const booking = await createBooking(accessToken, {
        yachtSlug: yacht.slug,
        date,
        startTime: start,
        hours,
        guests,
      });
      setBookingCode(booking.code);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-xl shadow-navy-900/10 ring-1 ring-navy-900/5">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="py-8 text-center"
          >
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-sea-500/15 text-sea-500">
              <PartyPopper size={28} />
            </span>
            <h3 className="mt-5 font-display text-xl text-navy-900">
              {yacht.instantBook ? "Booking Confirmed!" : "Request Sent!"}
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-navy-900/60">
              {yacht.instantBook
                ? "Your charter is locked in. Check your email for the confirmation and marina details."
                : `${yacht.ownerName} typically responds within 1 hour. We'll email you the moment it's approved.`}
            </p>
            {bookingCode && (
              <p className="mt-4 rounded-lg bg-ivory-100 px-4 py-2 font-mono text-xs text-navy-900/60">
                Confirmation code: {bookingCode}
              </p>
            )}
            <div className="mt-5 flex justify-center gap-4">
              <Link href="/dashboard" className="text-sm font-semibold text-gold-600 hover:text-gold-500">
                View My Trips
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm font-semibold text-navy-900/50 hover:text-navy-900"
              >
                Book again
              </button>
            </div>
          </motion.div>
        ) : !user ? (
          <motion.div
            key="signin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-6 text-center"
          >
            <p>
              <span className="font-display text-3xl text-navy-900">
                {fmtMoney(yacht.pricePerHour, yacht.currency)}
              </span>
              <span className="text-sm text-navy-900/50"> / hour</span>
            </p>
            <span className="mx-auto mt-4 grid size-14 place-items-center rounded-full bg-navy-900/5 text-navy-900">
              <LogIn size={22} />
            </span>
            <p className="mx-auto mt-3 max-w-[220px] text-sm text-navy-900/60">
              Sign in to request or book this charter.
            </p>
            <Link
              href="/auth/login"
              className="mt-5 inline-block w-full rounded-full bg-gold-400 py-3 text-sm font-semibold text-navy-950 transition-all hover:bg-gold-300"
            >
              Sign In to Book
            </Link>
            <Link
              href="/auth/register"
              className="mt-3 block text-xs font-medium text-navy-900/50 hover:text-navy-900"
            >
              New here? Create an account
            </Link>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={book} exit={{ opacity: 0, scale: 0.97 }}>
            <div className="flex items-baseline justify-between">
              <p>
                <span className="font-display text-3xl text-navy-900">
                  {fmtMoney(yacht.pricePerHour, yacht.currency)}
                </span>
                <span className="text-sm text-navy-900/50"> / hour</span>
              </p>
              <span className="text-xs text-navy-900/50">min {yacht.minHours}h</span>
            </div>

            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-3 rounded-xl border border-navy-900/10 px-4 py-3 transition-colors focus-within:border-gold-400">
                <CalendarDays size={17} className="shrink-0 text-gold-500" />
                <div className="flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-navy-900/40">
                    Date
                  </span>
                  <input
                    type="date"
                    required
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-sm text-navy-900 outline-none"
                  />
                </div>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-3 rounded-xl border border-navy-900/10 px-4 py-3 transition-colors focus-within:border-gold-400">
                  <Clock size={17} className="shrink-0 text-gold-500" />
                  <div className="flex-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-navy-900/40">
                      Start
                    </span>
                    <input
                      type="time"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                      className="w-full bg-transparent text-sm text-navy-900 outline-none"
                    />
                  </div>
                </label>

                <label className="relative flex items-center gap-3 rounded-xl border border-navy-900/10 px-4 py-3 transition-colors focus-within:border-gold-400">
                  <div className="flex-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-navy-900/40">
                      Duration
                    </span>
                    <select
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="w-full appearance-none bg-transparent text-sm text-navy-900 outline-none"
                    >
                      {Array.from({ length: 12 - yacht.minHours + 1 }, (_, i) => yacht.minHours + i).map(
                        (h) => (
                          <option key={h} value={h}>
                            {h} hours
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <ChevronDown size={14} className="text-navy-900/40" />
                </label>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-navy-900/10 px-4 py-3 transition-colors focus-within:border-gold-400">
                <Users size={17} className="shrink-0 text-gold-500" />
                <div className="flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-navy-900/40">
                    Guests (max {yacht.capacity})
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={yacht.capacity}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-transparent text-sm text-navy-900 outline-none"
                  />
                </div>
              </label>
            </div>

            {/* price breakdown */}
            <motion.div layout className="mt-5 space-y-2 rounded-xl bg-ivory-100 p-4 text-sm">
              <div className="flex justify-between text-navy-900/70">
                <span>
                  {fmtMoney(yacht.pricePerHour, yacht.currency)} × {hours} hours
                </span>
                <span>{fmtMoney(subtotal, yacht.currency)}</span>
              </div>
              <div className="flex justify-between text-navy-900/70">
                <span>Service fee</span>
                <span>{fmtMoney(fee, yacht.currency)}</span>
              </div>
              <div className="flex justify-between border-t border-navy-900/10 pt-2 font-semibold text-navy-900">
                <span>Total</span>
                <motion.span
                  key={total}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-base"
                >
                  {fmtMoney(total, yacht.currency)}
                </motion.span>
              </div>
            </motion.div>

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full rounded-full bg-gold-400 py-3.5 text-sm font-semibold text-navy-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/30 disabled:opacity-60"
            >
              {submitting ? "Processing…" : yacht.instantBook ? "Book Instantly" : "Request to Book"}
            </button>
            <p className="mt-3 text-center text-xs text-navy-900/45">
              You won&apos;t be charged until the owner confirms
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
