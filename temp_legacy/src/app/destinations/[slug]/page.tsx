import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Anchor, Star } from "lucide-react";
import { fetchDestination, fetchDestinations, fetchYachtsIn } from "@/lib/api";
import YachtCard from "@/components/YachtCard";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dest = await fetchDestination(slug);
  if (!dest) return {};
  return {
    title: `Yacht Rental ${dest.name} — Luxury Charters`,
    description: dest.description,
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = await fetchDestination(slug);
  if (!dest) notFound();
  const [fleet, destinations] = await Promise.all([
    fetchYachtsIn(slug),
    fetchDestinations().catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* hero */}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dest.image}
            alt={`${dest.name} skyline`}
            className="animate-kenburns h-full w-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-40 lg:px-8">
          <FadeIn>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">
              <MapPin size={14} /> {dest.country}
            </p>
            <h1 className="mt-3 font-display text-4xl text-ivory-50 sm:text-6xl">
              Yacht Charters in <span className="text-gold-shimmer italic">{dest.name}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-ivory-100/80">{dest.description}</p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-ivory-100/70">
              <span className="flex items-center gap-2">
                <Anchor size={15} className="text-gold-300" /> {dest.yachtCount} yachts available
              </span>
              <span className="flex items-center gap-2">
                <Star size={15} className="text-gold-300" /> {dest.tagline}
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* fleet */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-navy-900">
              Our {dest.name} Fleet
            </h2>
            <Link
              href={`/search?destination=${dest.slug}`}
              className="text-sm font-semibold text-gold-600 hover:text-gold-500"
            >
              Search with filters →
            </Link>
          </div>
          <div className="gold-rule mt-4" />
        </FadeIn>

        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fleet.map((y) => (
            <StaggerItem key={y.id}>
              <YachtCard yacht={y} />
            </StaggerItem>
          ))}
        </Stagger>

        {/* other destinations */}
        <FadeIn>
          <div className="mt-20 rounded-2xl bg-navy-950 p-10">
            <h3 className="font-display text-2xl text-ivory-50">Explore Other Destinations</h3>
            <div className="mt-6 flex flex-wrap gap-3">
              {destinations
                .filter((d) => d.slug !== slug)
                .map((d) => (
                  <Link
                    key={d.slug}
                    href={`/destinations/${d.slug}`}
                    className="rounded-full border border-ivory-100/20 px-5 py-2 text-sm text-ivory-100 transition-all hover:border-gold-400 hover:text-gold-300"
                  >
                    {d.name}
                  </Link>
                ))}
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
