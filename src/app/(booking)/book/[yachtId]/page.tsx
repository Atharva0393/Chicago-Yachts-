import { Metadata } from "next";
import { notFound } from "next/navigation";
import { dataService } from "@/services/data.service";
import { BookingProvider } from "@/lib/contexts/BookingContext";
import { BookingWizard } from "@/components/booking/BookingWizard";

// Fetch from centralized fleet data
const getYachtBySlug = async (slug: string) => {
  const yachts = await dataService.getYachts();
  const y = yachts.find(y => y.id === slug) || yachts[0];
  if (!y) return null;
  
  return {
    id: y.id,
    name: y.name,
    slug: y.id,
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

export async function generateMetadata({ params }: { params: { yachtId: string } }): Promise<Metadata> {
  const yacht = await getYachtBySlug(params.yachtId);
  return {
    title: `Book ${yacht?.name || 'Charter'} | Chicago Yachts`,
  };
}

export default async function BookingPage({ params }: { params: { yachtId: string } }) {
  const yacht = await getYachtBySlug(params.yachtId);

  if (!yacht) {
    notFound();
  }

  return (
    <BookingProvider initialMaxGuests={yacht.specs.maxGuests} yachtId={yacht.id}>
      <BookingWizard yacht={yacht} />
    </BookingProvider>
  );
}
