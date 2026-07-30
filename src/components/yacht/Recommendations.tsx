import { getRecommendations } from "@/lib/utils/recommendations";
import { YachtCard } from "@/components/fleet/YachtCard";

interface Props {
  currentYachtId: string;
}

export async function Recommendations({ currentYachtId }: Props) {
  const recommendedYachts = await getRecommendations(currentYachtId, 4);

  if (!recommendedYachts || recommendedYachts.length === 0) return null;

  return (
    <div className="w-full py-16 border-t border-border/40 mt-12 bg-muted/20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">You May Also Like</h2>
          <p className="text-muted-foreground text-lg">
            Based on your interest, we recommend exploring these comparable vessels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {recommendedYachts.map((yacht, index) => (
            <div 
              key={yacht.id}
              className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <YachtCard 
                id={yacht.id}
                name={yacht.name}
                image={yacht.images[0]}
                price={yacht.pricePerHour}
                capacity={yacht.capacity}
                length={`${yacht.length} ft`}
                location={yacht.location}
                rating={yacht.rating}
                reviews={yacht.reviewCount}
                instantBook={yacht.amenities.includes("Instant Book")}
                availableToday={yacht.availabilityStatus === "Available Today"}
                showBookNow={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
