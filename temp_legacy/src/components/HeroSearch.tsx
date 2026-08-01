"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Search } from "lucide-react";
import type { Destination } from "@/lib/types";

export default function HeroSearch({ destinations }: { destinations: Destination[] }) {
  const router = useRouter();
  const [dest, setDest] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dest) params.set("destination", dest);
    if (date) params.set("date", date);
    if (guests) params.set("guests", guests);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-10 flex w-full max-w-3xl flex-col gap-2 rounded-2xl bg-white/95 p-2 shadow-2xl shadow-navy-950/40 backdrop-blur sm:flex-row sm:items-center sm:rounded-full"
    >
      <label className="flex flex-1 items-center gap-3 rounded-full px-5 py-3 transition-colors hover:bg-ivory-100">
        <MapPin size={18} className="shrink-0 text-gold-500" />
        <select
          value={dest}
          onChange={(e) => setDest(e.target.value)}
          className="w-full bg-transparent text-sm text-navy-900 outline-none"
        >
          <option value="">Where to?</option>
          {destinations.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}, {d.country}
            </option>
          ))}
        </select>
      </label>

      <div className="hidden h-8 w-px bg-navy-900/10 sm:block" />

      <label className="flex flex-1 items-center gap-3 rounded-full px-5 py-3 transition-colors hover:bg-ivory-100">
        <Calendar size={18} className="shrink-0 text-gold-500" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-transparent text-sm text-navy-900 outline-none"
        />
      </label>

      <div className="hidden h-8 w-px bg-navy-900/10 sm:block" />

      <label className="flex flex-1 items-center gap-3 rounded-full px-5 py-3 transition-colors hover:bg-ivory-100">
        <Users size={18} className="shrink-0 text-gold-500" />
        <input
          type="number"
          min={1}
          max={50}
          placeholder="Guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full bg-transparent text-sm text-navy-900 outline-none placeholder:text-navy-900/50"
        />
      </label>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3.5 text-sm font-semibold text-navy-950 transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/30"
      >
        <Search size={16} strokeWidth={2.5} />
        Search
      </button>
    </motion.form>
  );
}
