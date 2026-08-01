import Link from "next/link";
import { Anchor, Instagram, Facebook, Youtube, Mail, Phone } from "lucide-react";
import { fetchDestinations } from "@/lib/api";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Journal", href: "#" },
      { label: "Press & Media", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Find a Yacht", href: "/search" },
      { label: "Mega Yachts", href: "/search?type=Mega+Yacht" },
      { label: "Catamarans", href: "/search?type=Catamaran" },
      { label: "Sailing Yachts", href: "/search?type=Sailing+Yacht" },
      { label: "Event Charters", href: "/search" },
    ],
  },
  {
    title: "For Owners",
    links: [
      { label: "List Your Yacht", href: "/owner" },
      { label: "Owner Dashboard", href: "/owner" },
      { label: "Pricing & Fees", href: "#" },
      { label: "Insurance", href: "#" },
      { label: "Owner Resources", href: "#" },
    ],
  },
];

export default async function Footer() {
  const destinations = await fetchDestinations().catch(() => []);
  return (
    <footer className="bg-navy-950 text-ivory-100">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-full bg-gold-400 text-navy-950">
                <Anchor size={18} strokeWidth={2.4} />
              </span>
              <span className="font-display text-xl tracking-wide">
                Book<span className="text-gold-400">Luxury</span>Yacht
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory-100/60">
              The world&apos;s premium yacht charter marketplace. Verified owners, professional
              crews and unforgettable days on the water — in every destination that matters.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid size-9 place-items-center rounded-full border border-ivory-100/15 transition-all hover:border-gold-400 hover:text-gold-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-sm text-ivory-100/60">
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-gold-400" /> +1 (888) 555-0199 — 24/7 concierge
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-gold-400" /> support@bookluxuryyacht.com
              </p>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm uppercase tracking-[0.2em] text-gold-400">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-ivory-100/60 transition-colors hover:text-gold-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-ivory-100/10 pt-8">
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-gold-400">
            Destinations
          </h3>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {destinations.map((d) => (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                className="text-sm text-ivory-100/60 transition-colors hover:text-gold-300"
              >
                Yacht Rental {d.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ivory-100/10 pt-6 text-xs text-ivory-100/40 sm:flex-row">
          <p>© {new Date().getFullYear()} BookLuxuryYacht. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gold-300">Terms of Use</Link>
            <Link href="#" className="hover:text-gold-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-gold-300">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
