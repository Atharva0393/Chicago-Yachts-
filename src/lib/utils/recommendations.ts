import { dataService } from "@/services/data.service";
import { Yacht } from "@/types";

/**
 * Mocks an AI recommendation engine. 
 * Calculates similarity based on capacity, budget, and amenities overlap.
 * 
 * @param currentYachtId The ID of the yacht currently being viewed
 * @param limit Number of recommendations to return
 * @returns Array of recommended yachts
 */
export async function getRecommendations(currentYachtId: string, limit: number = 4): Promise<Yacht[]> {
  // Simulate network delay for realistic async behavior (prepping for real AI endpoint)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const yachts = await dataService.getYachts();

  const currentYacht = yachts.find(y => y.id === currentYachtId);
  if (!currentYacht) return yachts.slice(0, limit);

  const scoredYachts = yachts
    .filter(y => y.id !== currentYachtId)
    .map(yacht => {
      let score = 0;

      // 1. Capacity Proximity (Highest weight)
      // If capacity is within 2, huge boost
      const capacityDiff = Math.abs(yacht.capacity - currentYacht.capacity);
      if (capacityDiff === 0) score += 30;
      else if (capacityDiff <= 2) score += 20;
      else if (capacityDiff <= 4) score += 10;

      // 2. Budget Proximity (High weight)
      // Calculate percentage difference in price
      const priceRatio = Math.max(yacht.pricePerHour, currentYacht.pricePerHour) / Math.min(yacht.pricePerHour, currentYacht.pricePerHour);
      if (priceRatio <= 1.1) score += 25; // within 10%
      else if (priceRatio <= 1.3) score += 15; // within 30%

      // 3. Amenities Overlap (Medium weight)
      // Count how many amenities match
      const matchingAmenities = yacht.amenities.filter(a => currentYacht.amenities.includes(a));
      score += (matchingAmenities.length * 2); // 2 points per matching amenity

      // 4. Popularity (Low weight - break ties)
      score += (yacht.rating * 2);

      return { yacht, score };
    });

  // Sort by score descending and return the top N
  return scoredYachts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.yacht);
}
