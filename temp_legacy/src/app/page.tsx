import Link from "next/link";
import {
  Anchor,
  ShieldCheck,
  Sparkles,
  LifeBuoy,
  Search,
  CalendarCheck,
  Sailboat,
  Star,
  PartyPopper,
  Heart,
  Briefcase,
  Sunset,
} from "lucide-react";
import HeroTitle from "@/components/HeroTitle";
import HeroSearch from "@/components/HeroSearch";
import YachtCard from "@/components/YachtCard";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { testimonials } from "@/lib/data";
import { fetchDestinations, fetchFeaturedYachts } from "@/lib/api";

const heroImage =
  "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=2400&q=80";

const stats = [
  { value: "9,400+", label: "Charters completed" },
  { value: "480+", label: "Verified luxury yachts" },
  { value: "6", label: "Iconic destinations" },
  { value: "4.9★", label: "Average trip rating" },
];

const experiences = [
  {
    icon: PartyPopper,
    title: "Celebrations & Parties",
    text: "Birthdays, bachelorettes and milestone nights with DJ setups, catering and crew who know how to host.",
  },
  {
    icon: Heart,
    title: "Romantic Escapes",
    text: "Private sunset cruises, proposals at anchor and champagne service for two.",
  },
  {
    icon: Briefcase,
    title: "Corporate Charters",
    text: "Client entertainment and team offsites with AV, catering and white-glove logistics.",
  },
  {
    icon: Sunset,
    title: "Sunset & Skyline Cruises",
    text: "Golden-hour routes past the world's greatest skylines — Miami, Dubai, Chicago, Toronto.",
  },
];

const steps = [
  {
    icon: Search,
    title: "Discover",
    text: "Search by destination, date and group size. Every yacht is verified, photographed and reviewed by real guests.",
  },
  {
    icon: CalendarCheck,
    title: "Book Securely",
    text: "Instant book or request-to-book. Transparent pricing, secure payment and free cancellation windows.",
  },
  {
    icon: Sailboat,
    title: "Set Sail",
    text: "Meet your captain at the marina and enjoy a five-star day on the water. Rate your trip afterwards.",
  },
];

const faqs = [
  {
    q: "How much does it cost to rent a luxury yacht?",
    a: "Charters start around $129/hour for captained speedboats and range to $3,500+/hour for event superyachts. Most guests spend $800–$2,500 for a 4-hour private charter. Every listing shows transparent hourly pricing with no hidden fees.",
  },
  {
    q: "Is a captain and crew included?",
    a: "Most listings are captained charters — a licensed captain and professional crew are included in the price. Listings marked 'no captain' are bareboat rentals that require boating credentials.",
  },
  {
    q: "Can I cancel or reschedule my booking?",
    a: "Yes. Each listing shows its cancellation policy (flexible, moderate or strict) before you book. Weather cancellations initiated by the captain are always fully refundable or reschedulable.",
  },
  {
    q: "How do I list my own yacht on the platform?",
    a: "Create an owner account, upload photos and documents (registration and insurance), set your pricing and availability, and our team reviews your listing within 48 hours. You keep control of your calendar, pricing and approval of every booking.",
  },
  {
    q: "Which destinations do you operate in?",
    a: "Miami, Dubai, Toronto, Chicago, Cancún and Ibiza today — with new destinations added every season. Join the newsletter to hear about new marinas first.",
  },
];

export default async function Home() {
  const [destinations, featured] = await Promise.all([
    fetchDestinations().catch(() => []),
    fetchFeaturedYachts().catch(() => []),
  ]);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="Luxury yacht cruising at sunset"
            className="animate-kenburns h-full w-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-32">
          <HeroTitle />
          <HeroSearch destinations={destinations} />
          <FadeIn delay={0.8}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-ivory-100/70">
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-gold-300" /> Verified owners & insured fleets
              </span>
              <span className="flex items-center gap-2">
                <Star size={15} className="text-gold-300" /> 9,400+ five-star charters
              </span>
              <span className="flex items-center gap-2">
                <LifeBuoy size={15} className="text-gold-300" /> 24/7 concierge support
              </span>
            </div>
          </FadeIn>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ivory-50 to-transparent" />
      </section>

      {/* ============ STATS ============ */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <Stagger className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <p className="font-display text-4xl text-navy-900">{s.value}</p>
              <p className="mt-1 text-sm uppercase tracking-wider text-navy-900/50">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ============ DESTINATIONS ============ */}
      <section id="destinations" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 lg:px-8">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
            Destinations
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-navy-900 sm:text-4xl">
              One Platform. Every Iconic Harbour.
            </h2>
            <Link
              href="/search"
              className="text-sm font-semibold text-gold-600 transition-colors hover:text-gold-500"
            >
              Browse all yachts →
            </Link>
          </div>
          <div className="gold-rule mt-4" />
        </FadeIn>

        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <StaggerItem key={d.slug}>
              <Link
                href={`/destinations/${d.slug}`}
                className="card-lift group relative block h-80 overflow-hidden rounded-2xl bg-navy-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.image}
                  alt={`Yacht charter in ${d.name}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-gold-300">{d.tagline}</p>
                  <h3 className="mt-1 font-display text-2xl text-ivory-50">{d.name}</h3>
                  <p className="mt-1 text-sm text-ivory-100/70">
                    {d.yachtCount} yachts available
                  </p>
                  <span className="mt-3 inline-block translate-y-2 text-sm font-semibold text-gold-300 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    Explore {d.name} →
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ============ FEATURED YACHTS ============ */}
      <section className="bg-navy-950 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
              The Fleet
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-ivory-50 sm:text-4xl">
                Featured Charters This Season
              </h2>
              <Link
                href="/search"
                className="text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300"
              >
                View all →
              </Link>
            </div>
            <div className="gold-rule mt-4" />
          </FadeIn>

          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((y) => (
              <StaggerItem key={y.id}>
                <YachtCard yacht={y} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ============ EXPERIENCES ============ */}
      <section id="experiences" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 lg:px-8">
        <FadeIn className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
            Experiences
          </p>
          <h2 className="mt-3 font-display text-3xl text-navy-900 sm:text-4xl">
            Adventures of Every Kind
          </h2>
          <div
            className="gold-rule mx-auto mt-4"
            style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }}
          />
        </FadeIn>

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.map((e) => (
            <StaggerItem
              key={e.title}
              className="card-lift rounded-2xl bg-white p-7 shadow-md shadow-navy-900/5 ring-1 ring-navy-900/5"
            >
              <span className="grid size-12 place-items-center rounded-full bg-navy-900 text-gold-400">
                <e.icon size={22} />
              </span>
              <h3 className="mt-5 font-display text-lg text-navy-900">{e.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-900/60">{e.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-ivory-100 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <FadeIn className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
              How It Works
            </p>
            <h2 className="mt-3 font-display text-3xl text-navy-900 sm:text-4xl">
              From Search to Sail in Three Steps
            </h2>
          </FadeIn>

          <Stagger className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((s, i) => (
              <StaggerItem key={s.title} className="relative text-center">
                <div className="relative mx-auto grid size-20 place-items-center rounded-full bg-navy-900 text-gold-400 shadow-xl shadow-navy-900/20">
                  <s.icon size={30} />
                  <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full bg-gold-400 font-display text-sm font-bold text-navy-950">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl text-navy-900">{s.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-navy-900/60">
                  {s.text}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <FadeIn className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
            Guest Stories
          </p>
          <h2 className="mt-3 font-display text-3xl text-navy-900 sm:text-4xl">
            Real Reviews from Happy Charters
          </h2>
        </FadeIn>

        <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem
              key={t.author}
              className="card-lift flex flex-col rounded-2xl bg-white p-7 shadow-md shadow-navy-900/5 ring-1 ring-navy-900/5"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={15} className="fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-navy-900/75">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 border-t border-navy-900/8 pt-4">
                <p className="font-semibold text-navy-900">{t.author}</p>
                <p className="text-xs text-navy-900/50">{t.trip}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ============ OWNER CTA ============ */}
      <section className="relative overflow-hidden bg-navy-950 py-24">
        <div className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-sea-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <FadeIn>
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold-400 text-navy-950">
              <Anchor size={24} />
            </span>
            <h2 className="mt-6 font-display text-3xl text-ivory-50 sm:text-5xl">
              Own a Yacht? <span className="text-gold-shimmer italic">Let It Earn.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-ivory-100/70">
              Join hundreds of owners and operators earning with the lowest marketplace fees in
              the industry. You control pricing, availability and every booking — we bring the
              premium audience, payments and support.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/owner"
                className="rounded-full bg-gold-400 px-8 py-3.5 text-sm font-semibold text-navy-950 transition-all hover:bg-gold-300 hover:shadow-xl hover:shadow-gold-400/25"
              >
                Start Listing Today
              </Link>
              <Link
                href="/owner"
                className="rounded-full border border-ivory-100/25 px-8 py-3.5 text-sm font-semibold text-ivory-50 transition-all hover:border-gold-400 hover:text-gold-300"
              >
                Learn More
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-3xl px-5 py-20">
        <FadeIn className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">FAQ</p>
          <h2 className="mt-3 font-display text-3xl text-navy-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl bg-white p-5 shadow-sm ring-1 ring-navy-900/5 transition-shadow open:shadow-md"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-navy-900 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Sparkles
                    size={16}
                    className="shrink-0 text-gold-500 transition-transform duration-300 group-open:rotate-90"
                  />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-navy-900/65">{f.a}</p>
              </details>
            ))}
          </div>
        </FadeIn>
      </section>
    </>
  );
}
