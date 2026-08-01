// Small utilities and content that isn't backed by the database.
//
// Live entities (destinations, yachts, bookings, users) come from the real
// API — see src/lib/api.ts. That file also carries the previous mock data's
// role as "the one place that talks to the network" per CLAUDE.md.

export const testimonials = [
  {
    quote:
      "Captain Pete made the experience of touring Miami so memorable. I would book through BookLuxuryYacht again with no worries.",
    author: "Linda C.",
    trip: "Motor yacht charter — Miami",
    rating: 5,
  },
  {
    quote:
      "We had the best day on the water. Captain Jake was great at sharing fun facts along the drive, and the boat was clean and spacious for a group of 15.",
    author: "Courtney R.",
    trip: "Party charter — Dubai Marina",
    rating: 5,
  },
  {
    quote:
      "Kevin and Nico were amazing. They were very accommodating and my 3-year-old had an amazing first-time boating experience.",
    author: "Serena T.",
    trip: "Family cruise — Cancún",
    rating: 5,
  },
];

export const fmtMoney = (n: number, ccy: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: ccy, maximumFractionDigits: 0 }).format(n);
