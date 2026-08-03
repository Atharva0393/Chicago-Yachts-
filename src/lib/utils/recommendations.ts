import { db } from "@/lib/db";
import { Yacht } from "@prisma/client";

interface RecommendationPreferences {
  preferredPrice: number;
  preferredCapacity: number;
  preferredAmenities: string[];
}

export async function getRecommendations(currentYachtId: string, limit: number = 4): Promise<any[]> {
  // Simulate network delay for realistic async behavior (prepping for real AI endpoint)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const yachts = await db.yacht.findMany({
    include: { images: true, amenities: { include: { amenity: true } } }
  });

  const currentYacht = yachts.find(y => y.id === currentYachtId);
  if (!currentYacht) return yachts.slice(0, limit);

  const scoredYachts = yachts
    .filter(y => y.id !== currentYachtId)
    .map(yacht => {
      let score = 0;

      const capacityDiff = Math.abs(yacht.capacity - currentYacht.capacity);
      if (capacityDiff === 0) score += 30;
      else if (capacityDiff <= 2) score += 20;
      else if (capacityDiff <= 4) score += 10;

      const priceRatio = Math.max((yacht as any).pricePerHour || 1000, (currentYacht as any).pricePerHour || 1000) / Math.min((yacht as any).pricePerHour || 1000, (currentYacht as any).pricePerHour || 1000);
      if (priceRatio <= 1.1) score += 25;
      else if (priceRatio <= 1.3) score += 15;

      const matchingAmenities = (yacht as any).amenities?.filter((a: any) => (currentYacht as any).amenities?.includes(a)) || [];
      score += (matchingAmenities.length * 2);

      score += ((yacht as any).rating || 5) * 2;

      return { yacht, score };
    });

  return scoredYachts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.yacht);
}

export function calculateRecommendationScore(yacht: Yacht, preferences: RecommendationPreferences): number {
  let score = 0;

  score += Number((yacht as any).rating || 0) * 10;
  score += Number((yacht as any).reviewCount || 0) * 0.1;

  const priceScore = Math.abs(Number((yacht as any).pricePerHour || 1000) - preferences.preferredPrice);
  score -= priceScore * 0.05;

  if (yacht.capacity >= preferences.preferredCapacity) {
    score += 20;
  } else {
    score -= (preferences.preferredCapacity - yacht.capacity) * 10;
  }

  if ((yacht as any).amenities) {
    const matchedAmenities = (yacht as any).amenities.filter((a: string) => preferences.preferredAmenities.includes(a));
    score += matchedAmenities.length * 5;
  }

  return score;
}

export function sortYachtsByRecommendation(yachts: Yacht[], preferences: RecommendationPreferences): Yacht[] {
  return yachts.sort((a, b) => {
    const scoreA = calculateRecommendationScore(a, preferences);
    const scoreB = calculateRecommendationScore(b, preferences);
    return scoreB - scoreA;
  });
}

export function filterYachtsByAvailability(yachts: Yacht[], date: Date): Yacht[] {
  return yachts.filter(yacht => {
    return true; 
  });
}
