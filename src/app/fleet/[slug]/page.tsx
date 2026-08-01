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

import { yachts } from "@/lib/constants/demo-data";

// Fetch from centralized fleet data
const getYachtBySlug = async (slug: string) => {
  const y = yachts.find(y => y.id === slug) || yachts[0];
  return {
    id: y.id,
    name: y.name,
    manufacturer: y.manufacturer,
    rating: y.rating,
    reviews: y.reviewCount,
    location: y.location,
    price: y.pricePerHour * 4,
    isLuxury: y.pricePerHour > 500,
    verified: true,
    description: y.description,
    images: y.images,
    specs: {
      year: y.year.toString(),
      length: `${y.length} ft`,
      beam: "16 ft", // Placeholder
      cabins: y.cabins,
      bathrooms: y.bathrooms,
      sleepingCapacity: Math.floor(y.capacity / 2),
      maxGuests: y.capacity,
      cruisingSpeed: "20 knots" // Placeholder
    },
    amenities: y.amenities
  };
};

const getSimilarYachts = async (currentId: string) => {
  return yachts.filter(y => y.id !== currentId).slice(0, 4).map(y => ({
     id: y.id,
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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const yacht = await getYachtBySlug(params.slug);
  return {
    title: `${yacht.name} Charter | Chicago Yachts`,
    description: yacht.description,
  };
}

export default async function YachtDetailPage({ params }: { params: { slug: string } }) {
  const yacht = await getYachtBySlug(params.slug);
  const similarYachts = await getSimilarYachts(params.slug);

  if (!yacht) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full bg-white min-h-screen pt-20">
      <YachtGallery images={yacht.images} yachtName={yacht.name} />

      <div className="container mx-auto px-4 md:px-8 py-6">
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
            <BookingPanel 
              basePrice={yacht.price} 
              pricePerHour={yacht.price / 4} 
            />
          </div>

          {/* Mobile Booking Panel - stays at bottom on small screens */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 lg:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.08)]">
             <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-semibold text-slate-900">${yacht.price.toLocaleString()}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">/ 4hrs</span>
                </div>
                <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium shadow-md">
                  Reserve Now
                </button>
             </div>
          </div>

        </div>
      </div>

      <SimilarYachts yachts={similarYachts} />
      <YachtCTA />
    </div>
  );
}
