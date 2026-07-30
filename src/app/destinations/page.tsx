import { Metadata } from "next";
import { DestinationsHero } from "@/components/destinations/DestinationsHero";
import { FeaturedDestinations } from "@/components/destinations/FeaturedDestinations";
import { MapPlaceholder } from "@/components/destinations/MapPlaceholder";
import { DestinationYachts } from "@/components/destinations/DestinationYachts";
import { DestinationExperiences } from "@/components/destinations/DestinationExperiences";
import { SeasonGuide } from "@/components/destinations/SeasonGuide";
import { DestinationsCTA } from "@/components/destinations/DestinationsCTA";

export const metadata: Metadata = {
  title: "Destinations | Chicago Yachts",
  description: "Explore Chicago's most iconic waterfront destinations through unforgettable luxury yacht experiences.",
};

export default function DestinationsPage() {
  return (
    <div className="flex flex-col w-full bg-background">
      <DestinationsHero />
      <FeaturedDestinations />
      <MapPlaceholder />
      <DestinationYachts />
      <DestinationExperiences />
      <SeasonGuide />
      <DestinationsCTA />
    </div>
  );
}
