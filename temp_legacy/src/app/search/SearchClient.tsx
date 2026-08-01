"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import YachtCard from "@/components/YachtCard";
import { fetchYachts } from "@/lib/api";
import type { Destination, Yacht, YachtType } from "@/lib/types";
import clsx from "clsx";

const types: YachtType[] = [
  "Motor Yacht",
  "Mega Yacht",
  "Sailing Yacht",
  "Catamaran",
  "Speedboat",
  "Houseboat",
];

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

export default function SearchClient({ destinations }: { destinations: Destination[] }) {
  const params = useSearchParams();
  const [dest, setDest] = useState(params.get("destination") ?? "");
  const [type, setType] = useState(params.get("type") ?? "");
  const [maxPrice, setMaxPrice] = useState(4000);
  const [minGuests, setMinGuests] = useState(Number(params.get("guests")) || 0);
  const [captainOnly, setCaptainOnly] = useState(false);
  const [instantOnly, setInstantOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [results, setResults] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const handle = setTimeout(() => {
      fetchYachts({
        destination: dest || undefined,
        type: type || undefined,
        maxPrice,
        guests: minGuests || undefined,
        captainOnly,
        instantOnly,
        sort,
      })
        .then((data) => {
          if (!cancelled) setResults(data);
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [dest, type, maxPrice, minGuests, captainOnly, instantOnly, sort]);

  const activeFilters = [dest, type, captainOnly, instantOnly, minGuests > 0].filter(
    Boolean
  ).length;

  const filterPanel = (
    <div className="space-y-7">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-navy-900/50">
          Destination
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setDest("")}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
              !dest ? "bg-navy-900 text-gold-300" : "bg-white text-navy-900/70 ring-1 ring-navy-900/10 hover:ring-gold-400"
            )}
          >
            All
          </button>
          {destinations.map((d) => (
            <button
              key={d.slug}
              onClick={() => setDest(dest === d.slug ? "" : d.slug)}
              className={clsx(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                dest === d.slug
                  ? "bg-navy-900 text-gold-300"
                  : "bg-white text-navy-900/70 ring-1 ring-navy-900/10 hover:ring-gold-400"
              )}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-navy-900/50">
          Yacht Type
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(type === t ? "" : t)}
              className={clsx(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                type === t
                  ? "bg-navy-900 text-gold-300"
                  : "bg-white text-navy-900/70 ring-1 ring-navy-900/10 hover:ring-gold-400"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-navy-900/50">
          Max price / hour: <span className="text-gold-600">${maxPrice.toLocaleString()}</span>
        </h3>
        <input
          type="range"
          min={100}
          max={4000}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-3 w-full accent-gold-500"
        />
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-navy-900/50">
          Minimum guests: <span className="text-gold-600">{minGuests || "Any"}</span>
        </h3>
        <input
          type="range"
          min={0}
          max={50}
          step={1}
          value={minGuests}
          onChange={(e) => setMinGuests(Number(e.target.value))}
          className="mt-3 w-full accent-gold-500"
        />
      </div>

      <div className="space-y-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-navy-900/80">
          <input
            type="checkbox"
            checked={captainOnly}
            onChange={(e) => setCaptainOnly(e.target.checked)}
            className="size-4 accent-gold-500"
          />
          With captain only
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-navy-900/80">
          <input
            type="checkbox"
            checked={instantOnly}
            onChange={(e) => setInstantOnly(e.target.checked)}
            className="size-4 accent-gold-500"
          />
          Instant book only
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory-50 pt-24">
      {/* header band */}
      <div className="bg-navy-950 pb-10 pt-10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-3xl text-ivory-50 sm:text-4xl"
          >
            {dest
              ? `Yacht Charters in ${destinations.find((d) => d.slug === dest)?.name}`
              : "Find Your Perfect Charter"}
          </motion.h1>
          <p className="mt-2 text-sm text-ivory-100/60">
            {results.length} luxury {results.length === 1 ? "yacht" : "yachts"} available
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="flex items-center justify-between gap-4 lg:hidden">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-medium text-ivory-50"
          >
            <SlidersHorizontal size={15} /> Filters
            {activeFilters > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-gold-400 text-[11px] font-bold text-navy-950">
                {activeFilters}
              </span>
            )}
          </button>
          <SortSelect sort={sort} setSort={setSort} />
        </div>

        <div className="mt-6 grid gap-10 lg:mt-0 lg:grid-cols-[280px_1fr]">
          {/* desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl bg-ivory-100 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-lg text-navy-900">Filters</h2>
                <SortSelect sort={sort} setSort={setSort} />
              </div>
              {filterPanel}
            </div>
          </aside>

          {/* results */}
          <div>
            <AnimatePresence mode="popLayout">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-96 animate-pulse rounded-2xl bg-white ring-1 ring-navy-900/5" />
                  ))}
                </motion.div>
              ) : results.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl bg-white p-16 text-center ring-1 ring-navy-900/5"
                >
                  <p className="font-display text-xl text-navy-900">No yachts match those filters</p>
                  <p className="mt-2 text-sm text-navy-900/60">
                    Try widening your price range or removing a filter.
                  </p>
                </motion.div>
              ) : (
                <motion.div layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((y, i) => (
                    <motion.div
                      key={y.id}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <YachtCard yacht={y} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* mobile filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto bg-ivory-50 p-6 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-lg text-navy-900">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                  <X size={22} className="text-navy-900" />
                </button>
              </div>
              {filterPanel}
              <button
                onClick={() => setFiltersOpen(false)}
                className="mt-8 w-full rounded-full bg-gold-400 py-3 text-sm font-semibold text-navy-950"
              >
                Show {results.length} yachts
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SortSelect({ sort, setSort }: { sort: SortKey; setSort: (s: SortKey) => void }) {
  return (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value as SortKey)}
      className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-navy-900 ring-1 ring-navy-900/10 outline-none"
    >
      <option value="recommended">Recommended</option>
      <option value="price-asc">Price: low → high</option>
      <option value="price-desc">Price: high → low</option>
      <option value="rating">Top rated</option>
    </select>
  );
}
