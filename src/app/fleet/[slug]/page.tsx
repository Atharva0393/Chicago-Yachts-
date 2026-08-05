import { Metadata } from "next";
import { notFound } from "next/navigation";
import { YachtGallery } from "@/components/yacht/YachtGallery";
import { YachtHeader } from "@/components/yacht/YachtHeader";
import { YachtOverview } from "@/components/yacht/YachtOverview";
import { YachtSpecs } from "@/components/yacht/YachtSpecs";
import { YachtAmenities } from "@/components/yacht/YachtAmenities";
import { BookingPanel } from "@/components/yacht/BookingPanel";
import { LuxuryAddons } from "@/components/yacht/LuxuryAddons";
import { AvailabilityCalendar } from "@/components/yacht/AvailabilityCalendar";
import { LocationMap } from "@/components/yacht/LocationMap";
import { YachtReviews } from "@/components/yacht/YachtReviews";
import { YachtFAQ } from "@/components/yacht/YachtFAQ";
import { SimilarYachts } from "@/components/yacht/SimilarYachts";
import { YachtCTA } from "@/components/yacht/YachtCTA";
import { MobileBookingBar } from "@/components/yacht/MobileBookingBar";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'; // Prevent any stale caching for booking-critical pages

import { yachtRepository } from "@/server/repositories/yacht.repository";
import { BookingProvider } from "@/lib/contexts/BookingContext";

// Fetch from centralized fleet data via Prisma
const getYachtBySlug = async (slug: string) => {
  const yacht = await yachtRepository.getYachtBySlug(slug);
  if (!yacht) return null;

  return {
    id: yacht.id,
    slug: yacht.slug,
    name: yacht.name,
    manufacturer: yacht.manufacturer,
    rating: yacht.rating,
    reviews: yacht.reviewCount,
    location: yacht.location,
    price: yacht.pricePerHour * 4,
    isLuxury: yacht.pricePerHour > 500,
    verified: true,
    description: yacht.description,
    images: yacht.images,
    specs: {
      year: yacht.year.toString(),
      length: `${yacht.length} ft`,
      beam: "16 ft", // Placeholder until added to DB
      cabins: yacht.cabins,
      bathrooms: yacht.bathrooms,
      sleepingCapacity: Math.floor(yacht.capacity / 2),
      maxGuests: yacht.capacity,
      cruisingSpeed: "20 knots" // Placeholder
    },
    amenities: yacht.amenities
  };
};

const getSimilarYachts = async (currentId: string) => {
  const yachts = await yachtRepository.getAllYachts();
  return yachts.filter(y => y.id !== currentId).slice(0, 4).map(y => ({
     id: y.id,
     slug: y.slug,
     name: y.name,
     manufacturer: y.manufacturer,
     price: y.pricePerHour * 4,
     length: `${y.length} ft`,
     capacity: y.capacity,
     rating: y.rating,
     reviews: y.reviewCount,
     location: y.location,
     image: y.images[0],
     isLuxury: y.pricePerHour > 500
  }));
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  if (!slug) return { title: "Yacht Not Found | Chicago Yachts" };

  const yacht = await getYachtBySlug(slug);
  if (!yacht) return { title: "Yacht Not Found | Chicago Yachts" };
  
  return {
    title: `${yacht.name} Charter | Chicago Yachts`,
    description: yacht.description,
  };
}

export default async function YachtDetailPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    notFound();
  }

  const yacht = await getYachtBySlug(slug);

  if (!yacht) {
    notFound();
  }

  const similarYachts = await getSimilarYachts(yacht.id);

  // Enforce canonical slug routing
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
    redirect(`/fleet/${yacht.slug}`);
  }

  return (
    <div className="flex flex-col w-full bg-white min-h-screen pt-20">
      <YachtGallery images={yacht.images} yachtName={yacht.name} />

      <div className="container mx-auto px-4 md:px-8 py-6">
        <BookingProvider initialMaxGuests={yacht.specs.maxGuests} yachtId={yacht.id}>
          <div className="flex flex-col lg:flex-row gap-12 relative">
            
            {/* Main Content Column */}
            <div className="flex-1 min-w-0">
              <YachtHeader 
                id={yacht.id}
                name={yacht.name}
                manufacturer={yacht.manufacturer}
                rating={yacht.rating}
                reviews={yacht.reviews}
                location={yacht.location}
                isLuxury={yacht.isLuxury}
                verified={yacht.verified}
              />
              <YachtOverview name={yacht.name} description={yacht.description} />
              <YachtSpecs specs={yacht.specs} />
              <YachtAmenities amenities={yacht.amenities} />
              <LuxuryAddons />
              <AvailabilityCalendar />
              <LocationMap location={yacht.location} />
              <YachtReviews rating={yacht.rating} reviews={yacht.reviews} />
              <YachtFAQ />
            </div>

            {/* Sticky Sidebar Column */}
            <div className="w-full lg:w-[400px] shrink-0 mt-8 lg:mt-0 hidden lg:block">
              <BookingPanel />
            </div>

            <MobileBookingBar />

          </div>
        </BookingProvider>
      </div>

      <SimilarYachts yachts={similarYachts} />
      <YachtCTA />
    </div>
  );
}
