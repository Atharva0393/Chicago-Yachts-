import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BookingProvider } from "@/lib/contexts/BookingContext";
import { BookingWizard } from "@/components/booking/BookingWizard";

// Fetch from centralized fleet data safely matching slug OR id
const getYachtBySlugOrId = async (slugOrId: string) => {
  if (!slugOrId) return null;
  
  try {
    const y = await db.yacht.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId }
        ]
      },
      include: { images: { orderBy: { sortOrder: 'asc' } } }
    });
    
    if (!y) return null;
    
    return {
      id: y.id,
      name: y.name,
      slug: y.slug || y.id,
      manufacturer: y.manufacturer,
      rating: 4.8,
      reviews: 12,
      location: y.location,
      price: 1000,
      isLuxury: true,
      verified: true,
      description: y.description,
      images: y.images && y.images.length > 0 ? y.images.map(img => img.url) : ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"],
      specs: {
        year: (y.year || 2020).toString(),
        length: `${y.length} ft`,
        beam: "16 ft",
        cabins: y.cabins,
        bathrooms: y.bathrooms,
        sleepingCapacity: Math.floor(y.capacity / 2),
        maxGuests: y.capacity,
        cruisingSpeed: "20 knots"
      },
      amenities: []
    };
  } catch (error) {
    console.error("Error in getYachtBySlugOrId:", error);
    return null;
  }
};

export async function generateMetadata({ params }: { params: Promise<{ yachtId: string }> | { yachtId: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const yacht = await getYachtBySlugOrId(resolvedParams?.yachtId);
  return {
    title: `Book ${yacht?.name || 'Charter'} | Chicago Yachts`,
  };
}

export default async function BookingPage({ params }: { params: Promise<{ yachtId: string }> | { yachtId: string } }) {
  const resolvedParams = await params;
  const yacht = await getYachtBySlugOrId(resolvedParams?.yachtId);

  if (!yacht) {
    notFound();
  }

  return (
    <BookingProvider initialMaxGuests={yacht.specs.maxGuests} yachtId={yacht.id}>
      <BookingWizard yacht={yacht} />
    </BookingProvider>
  );
}
