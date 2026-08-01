"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import * as api from "@/lib/api";
import type { Destination } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

const TYPES = ["Motor Yacht", "Mega Yacht", "Sailing Yacht", "Catamaran", "Speedboat", "Houseboat"];

const STOCK_IMAGES = [
  "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=80",
];

const initial = {
  title: "",
  type: TYPES[0],
  destinationSlug: "",
  marina: "",
  lengthFt: 40,
  capacity: 10,
  pricePerHour: 300,
  currency: "USD",
  description: "",
};

export default function CreateListingModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const { accessToken } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.fetchDestinations().then(setDestinations).catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.createYacht(accessToken, {
        ...form,
        images: STOCK_IMAGES,
        withCaptain: true,
        instantBook: false,
      });
      setForm(initial);
      onCreated();
    } catch (err) {
      setError(err instanceof api.ApiError ? err.message : "Could not create listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[85vh] max-w-lg -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-navy-900">List a New Yacht</h2>
              <button onClick={onClose} aria-label="Close">
                <X size={20} className="text-navy-900/50" />
              </button>
            </div>
            <p className="mt-1 text-xs text-navy-900/50">
              New listings enter the admin moderation queue before going live.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <Field label="Listing title">
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 60ft Sunseeker — Sunset Charter"
                  className="w-full rounded-lg border border-navy-900/10 px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Type">
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-lg border border-navy-900/10 px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Destination">
                  <select
                    required
                    value={form.destinationSlug}
                    onChange={(e) => setForm({ ...form, destinationSlug: e.target.value })}
                    className="w-full rounded-lg border border-navy-900/10 px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                  >
                    <option value="">Select…</option>
                    {destinations.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Marina / departure point">
                <input
                  required
                  value={form.marina}
                  onChange={(e) => setForm({ ...form, marina: e.target.value })}
                  className="w-full rounded-lg border border-navy-900/10 px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                />
              </Field>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Length (ft)">
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.lengthFt}
                    onChange={(e) => setForm({ ...form, lengthFt: Number(e.target.value) })}
                    className="w-full rounded-lg border border-navy-900/10 px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                  />
                </Field>
                <Field label="Capacity">
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                    className="w-full rounded-lg border border-navy-900/10 px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                  />
                </Field>
                <Field label="Currency">
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full rounded-lg border border-navy-900/10 px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                  >
                    {["USD", "EUR", "AED", "CAD"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Price per hour">
                <input
                  type="number"
                  required
                  min={1}
                  value={form.pricePerHour}
                  onChange={(e) => setForm({ ...form, pricePerHour: Number(e.target.value) })}
                  className="w-full rounded-lg border border-navy-900/10 px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                />
              </Field>

              <Field label="Description (min 20 characters)">
                <textarea
                  required
                  minLength={20}
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-navy-900/10 px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                />
              </Field>

              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-gold-400 py-3 text-sm font-semibold text-navy-950 transition-all hover:bg-gold-300 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit for Review"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-navy-900/45">
        {label}
      </span>
      {children}
    </label>
  );
}
