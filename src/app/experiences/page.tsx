import { Metadata } from "next";
import { ExperiencesHero } from "@/components/experiences/ExperiencesHero";
import { FeaturedExperiences } from "@/components/experiences/FeaturedExperiences";
import { ExperienceCategories } from "@/components/experiences/ExperienceCategories";
import { ExperienceYachts } from "@/components/experiences/ExperienceYachts";
import { HowItWorks } from "@/components/experiences/HowItWorks";
import { LuxuryAddons } from "@/components/experiences/LuxuryAddons";
import { ClientStories } from "@/components/experiences/ClientStories";
import { ExperienceFAQ } from "@/components/experiences/ExperienceFAQ";
import { ExperiencesCTA } from "@/components/experiences/ExperiencesCTA";

export const metadata: Metadata = {
  title: "Experiences | Chicago Yachts",
  description: "Celebrate life's greatest moments aboard Chicago's most luxurious yacht fleet. Discover curated journeys on the water.",
};

export default function ExperiencesPage() {
  return (
    <div className="flex flex-col w-full bg-background">
      <ExperiencesHero />
      <FeaturedExperiences />
      <ExperienceCategories />
      <ExperienceYachts />
      <HowItWorks />
      <LuxuryAddons />
      <ClientStories />
      <ExperienceFAQ />
      <ExperiencesCTA />
    </div>
  );
}
