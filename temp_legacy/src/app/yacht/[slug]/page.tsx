import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Users,
  Ruler,
  BedDouble,
  Anchor,
  MapPin,
  BadgeCheck,
  ShieldCheck,
  Check,
  Zap,
} from "lucide-react";
import { fmtMoney } from "@/lib/data";
import { fetchDestination, fetchYacht, fetchYachtsIn } from "@/lib/api";
import BookingWidget from "./BookingWidget";
import Gallery from "./Gallery";
import YachtCard from "@/components/YachtCard";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const yacht = await fetchYacht(slug);
  if (!yacht) return {};
  return {
    title: yacht.title,
    description: yacht.description.slice(0, 160),
  };
}

export default async function YachtPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const yacht = await fetchYacht(slug);
  if (!yacht) notFound();
  const dest = await fetchDestination(yacht.destination);
  const allInDest = await fetchYachtsIn(yacht.destination);
  const similar = allInDest.filter((y) => y.slug !== yacht.slug).slice(0, 3);

  const specs = [
    { icon: Ruler, label: "Length", value: `${yacht.lengthFt} ft` },
    { icon: Users, label: "Capacity", value: `${yacht.capacity} guests` },
    { icon: BedDouble, label: "Cabins", value: `${yacht.cabins}` },
    { icon: Anchor, label: "Crew", value: `${yacht.crew}` },
  ];

  return (
    <div className="min-h-screen bg-ivory-50 pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-2 pt-4 text-xs text-navy-900/50">
          <Link href="/" className="hover:text-gold-600">Home</Link>
          <span>/</span>
          <Link href={`/destinations/${dest?.slug}`} className="hover:text-gold-600">
            {dest?.name}
          </Link>
          <span>/</span>
          <span className="text-navy-900/80">{yacht.title}</span>
        </nav>

        <Gallery images={yacht.images} title={yacht.title} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* ---- left column ---- */}
          <div>
            <FadeIn y={16}>
              <div className="flex flex-wrap items-center gap-2">
                {yacht.instantBook && (
                  <span className="flex items-center gap-1 rounded-full bg-sea-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                    <Zap size={11} /> Instant Book
                  </span>
                )}
                {yacht.superOwner && (
                  <span className="flex items-center gap-1 rounded-full bg-gold-400 px-2.5 py-1 text-[11px] font-semibold text-navy-950">
                    <BadgeCheck size={11} /> Super Owner
                  </span>
                )}
                <span className="rounded-full bg-navy-900 px-2.5 py-1 text-[11px] font-semibold text-ivory-100">
                  {yacht.type}
                </span>
              </div>

              <h1 className="mt-4 font-display text-3xl leading-tight text-navy-900 sm:text-4xl">
                {yacht.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy-900/60">
                <span className="flex items-center gap-1.5">
                  <Star size={15} className="fill-gold-400 text-gold-400" />
                  <strong className="text-navy-900">{yacht.rating}</strong>
                  ({yacht.reviewCount} reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-gold-500" />
                  {yacht.marina}, {dest?.name}
                </span>
                <span>{yacht.bookings} bookings</span>
              </div>
            </FadeIn>

            {/* specs */}
            <FadeIn y={20} delay={0.1}>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl bg-white p-4 text-center ring-1 ring-navy-900/5"
                  >
                    <s.icon size={20} className="mx-auto text-gold-500" />
                    <p className="mt-2 font-display text-lg text-navy-900">{s.value}</p>
                    <p className="text-xs uppercase tracking-wider text-navy-900/50">{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* description */}
            <FadeIn y={20}>
              <section className="mt-10">
                <h2 className="font-display text-2xl text-navy-900">About This Yacht</h2>
                <div className="gold-rule mt-3" />
                <p className="mt-5 leading-relaxed text-navy-900/70">{yacht.description}</p>
                <div className="mt-5 flex items-center gap-4 rounded-xl bg-ivory-100 p-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-navy-900 font-display text-lg text-gold-400">
                    {yacht.ownerName[0]}
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900">
                      Hosted by {yacht.ownerName}
                      {yacht.superOwner && (
                        <BadgeCheck size={15} className="ml-1.5 inline text-gold-500" />
                      )}
                    </p>
                    <p className="text-xs text-navy-900/50">
                      Owner since {yacht.ownerSince} · Verified identity & insurance
                    </p>
                  </div>
                </div>
              </section>
            </FadeIn>

            {/* amenities */}
            <FadeIn y={20}>
              <section className="mt-10">
                <h2 className="font-display text-2xl text-navy-900">Amenities & Features</h2>
                <div className="gold-rule mt-3" />
                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {yacht.amenities.map((a) => (
                    <li key={a} className="flex items-center gap-3 text-sm text-navy-900/75">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-600">
                        <Check size={13} strokeWidth={3} />
                      </span>
                      {a}
                    </li>
                  ))}
                </ul>
              </section>
            </FadeIn>

            {/* packages */}
            {yacht.packages.length > 0 && (
              <FadeIn y={20}>
                <section className="mt-10">
                  <h2 className="font-display text-2xl text-navy-900">Charter Packages</h2>
                  <div className="gold-rule mt-3" />
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {yacht.packages.map((p) => (
                      <div
                        key={p.name}
                        className="card-lift rounded-2xl border border-gold-400/30 bg-white p-6"
                      >
                        <div className="flex items-baseline justify-between">
                          <h3 className="font-display text-lg text-navy-900">{p.name}</h3>
                          <span className="text-xs text-navy-900/50">{p.hours}h</span>
                        </div>
                        <p className="mt-1 font-display text-2xl text-gold-600">
                          {fmtMoney(p.price, yacht.currency)}
                        </p>
                        <ul className="mt-4 space-y-2">
                          {p.includes.map((inc) => (
                            <li key={inc} className="flex items-center gap-2 text-xs text-navy-900/65">
                              <Check size={12} className="text-sea-500" strokeWidth={3} /> {inc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeIn>
            )}

            {/* reviews */}
            <FadeIn y={20}>
              <section className="mt-10">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl text-navy-900">Guest Reviews</h2>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Star size={16} className="fill-gold-400 text-gold-400" />
                    <strong>{yacht.rating}</strong> · {yacht.reviewCount} reviews
                  </span>
                </div>
                <div className="gold-rule mt-3" />
                <div className="mt-5 space-y-4">
                  {yacht.reviews.map((r) => (
                    <article key={r.id} className="rounded-2xl bg-white p-6 ring-1 ring-navy-900/5">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-full bg-navy-900 text-sm font-semibold text-gold-400">
                          {r.avatarInitials}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-navy-900">{r.author}</p>
                          <p className="text-xs text-navy-900/50">{r.date} · {r.trip}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} size={13} className="fill-gold-400 text-gold-400" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-navy-900/70">{r.comment}</p>
                    </article>
                  ))}
                </div>
              </section>
            </FadeIn>
          </div>

          {/* ---- right column: booking widget ---- */}
          <div>
            <BookingWidget yacht={yacht} />
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-ivory-100 p-4 text-xs text-navy-900/60">
              <ShieldCheck size={26} className="shrink-0 text-sea-500" />
              <p>
                <strong className="text-navy-900">Book with confidence.</strong> Payments are held
                securely until your charter is confirmed. Free cancellation up to 5 days before
                your trip on this listing.
              </p>
            </div>
          </div>
        </div>

        {/* similar */}
        {similar.length > 0 && (
          <section className="mt-20">
            <FadeIn>
              <h2 className="font-display text-2xl text-navy-900">
                More Yachts in {dest?.name}
              </h2>
              <div className="gold-rule mt-3" />
            </FadeIn>
            <Stagger className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((y) => (
                <StaggerItem key={y.id}>
                  <YachtCard yacht={y} />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}
      </div>
    </div>
  );
}
