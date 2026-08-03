import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BookingProvider } from "@/lib/contexts/BookingContext";
import { BookingWizard } from "@/components/booking/BookingWizard";

// Fetch from centralized fleet data
const getYachtBySlug = async (slug: string) => {
  const y = await db.yacht.findUnique({
    where: { slug },
    include: { images: true }
  }) || await db.yacht.findFirst({ include: { images: true } });
  
  if (!y) return null;
  
  return {
    id: y.id,
    name: y.name,
    slug: y.id,
    manufacturer: y.manufacturer,
    rating: 4.8,
    reviews: 12,
    location: y.location,
    price: 1000,
    isLuxury: true,
    verified: true,
    description: y.description,
    images: y.images,
    specs: {
      year: (y.year || 2020).toString(),
      length: `${y.length} ft`,
      beam: "16 ft", // Placeholder
      cabins: y.cabins,
      bathrooms: y.bathrooms,
      sleepingCapacity: Math.floor(y.capacity / 2),
      maxGuests: y.capacity,
      cruisingSpeed: "20 knots" // Placeholder
    },
    amenities: []
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
