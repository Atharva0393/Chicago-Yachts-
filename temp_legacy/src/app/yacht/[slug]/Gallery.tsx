"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_280px]">
      <div className="relative h-[320px] overflow-hidden rounded-2xl bg-navy-800 sm:h-[460px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={`${title} — photo ${active + 1}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>
        <span className="absolute bottom-4 right-4 rounded-full bg-navy-950/70 px-3 py-1 text-xs text-ivory-100 backdrop-blur">
          {active + 1} / {images.length}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 lg:grid-cols-1">
        {images.slice(0, 4).map((img, i) => (
          <button
            key={img + i}
            onClick={() => setActive(i)}
            className={clsx(
              "relative h-20 overflow-hidden rounded-xl transition-all duration-300 lg:h-[104px]",
              active === i
                ? "ring-2 ring-gold-400 ring-offset-2 ring-offset-ivory-50"
                : "opacity-80 hover:opacity-100"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
