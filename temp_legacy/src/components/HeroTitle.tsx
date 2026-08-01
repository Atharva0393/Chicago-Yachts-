"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroTitle() {
  return (
    <div className="text-center">
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease }}
        className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-300"
      >
        Captained charters · 6 world-class destinations
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease }}
        className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-tight text-ivory-50 sm:text-6xl lg:text-7xl"
      >
        The Water Is Waiting.
        <br />
        <span className="text-gold-shimmer italic">Arrive in Style.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease }}
        className="mx-auto mt-6 max-w-2xl text-base text-ivory-100/80 sm:text-lg"
      >
        Charter the world&apos;s finest yachts in Miami, Dubai, Toronto, Chicago, Cancún and
        Ibiza — verified owners, five-star crews, seamless booking.
      </motion.p>
    </div>
  );
}
