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

// Mock Data fetching function (Future Prisma integration)
const getYachtBySlug = async (slug: string) => {
  // In a real app, this would be: await prisma.yacht.findUnique({ where: { slug } })
  const mockDB: Record<string, any> = {
    "azimut-60": {
      id: "1",
      name: "The Azimut 60",
      manufacturer: "Azimut",
      rating: 4.9,
      reviews: 128,
      location: "Navy Pier, Chicago",
      price: 1200,
      isLuxury: true,
      verified: true,
      description: "Experience unparalleled luxury aboard The Azimut 60. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need. With its sleek Italian design, it stands out in any harbor.",
      images: [
        "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2074&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1577977464038-09099c2ea557?q=80&w=2000&auto=format&fit=crop"
      ],
      specs: {
        year: "2023",
        length: "60 ft",
        beam: "16.5 ft",
        cabins: 3,
        bathrooms: 2,
        sleepingCapacity: 6,
        maxGuests: 12,
        cruisingSpeed: "22 knots"
      },
      amenities: [
        "Premium Audio System", "High-Speed WiFi", "Bluetooth Connectivity",
        "Outdoor Dining Area", "Indoor Lounge", "Sun Deck",
        "Swim Platform", "Air Conditioning", "Fully Equipped Kitchen",
        "Floating Mat"
      ]
    },
    "sunseeker-manhattan": {
      id: "2",
      name: "Sunseeker Manhattan",
      manufacturer: "Sunseeker",
      rating: 4.8,
      reviews: 94,
      location: "Burnham Harbor",
      price: 1800,
      isLuxury: true,
      verified: true,
      description: "The Sunseeker Manhattan provides a masterful combination of space and light. With panoramic hull and saloon windows, it's the perfect vessel for entertaining large groups against the Chicago skyline.",
      images: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1621277227092-28c0b25e79ba?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2074&auto=format&fit=crop"
      ],
      specs: {
        year: "2024",
        length: "68 ft",
        beam: "17 ft",
        cabins: 4,
        bathrooms: 3,
        sleepingCapacity: 8,
        maxGuests: 15,
        cruisingSpeed: "24 knots"
      },
      amenities: [
        "Jacuzzi", "Premium Audio System", "High-Speed WiFi", 
        "Outdoor Dining Area", "Sun Deck",
        "Swim Platform", "Air Conditioning", "Fully Equipped Kitchen",
        "Water Toys"
      ]
    }
  };

  return mockDB[slug] || mockDB["azimut-60"]; // Fallback to azimut-60 for demo purposes
};

const getSimilarYachts = async () => {
  return [
    { id: "3", name: "Riva Corsaro", manufacturer: "Riva", price: 4500, length: "100 ft", capacity: 20, rating: 5.0, reviews: 42, location: "DuSable Harbor", image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2074&auto=format&fit=crop", isLuxury: true },
    { id: "4", name: "Princess 72", manufacturer: "Princess", price: 2100, length: "72 ft", capacity: 14, rating: 4.7, reviews: 86, location: "Belmont Harbor", image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop", instantBook: true },
    { id: "5", name: "Sea Ray L650", manufacturer: "Sea Ray", price: 1500, length: "65 ft", capacity: 12, rating: 4.9, reviews: 210, location: "Navy Pier, Chicago", image: "https://images.unsplash.com/photo-1577977464038-09099c2ea557?q=80&w=2000&auto=format&fit=crop", verified: true },
    { id: "6", name: "Galeon 500 Fly", manufacturer: "Galeon", price: 950, length: "50 ft", capacity: 10, rating: 4.6, reviews: 112, location: "Burnham Harbor", image: "https://images.unsplash.com/photo-1621277227092-28c0b25e79ba?q=80&w=2070&auto=format&fit=crop" }
  ];
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
  const similarYachts = await getSimilarYachts();

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
