import { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { OurStory } from "@/components/about/OurStory";
import { WhyChooseUs } from "@/components/about/WhyChooseUs";
import { FleetStats } from "@/components/about/FleetStats";
import { OurValues } from "@/components/about/OurValues";
import { MeetTheTeam } from "@/components/about/MeetTheTeam";
import { SafetyCertifications } from "@/components/about/SafetyCertifications";
import { AboutTestimonials } from "@/components/about/AboutTestimonials";
import { AboutCTA } from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About Us | Chicago Yachts",
  description: "Delivering exceptional luxury yacht experiences on the waters of Chicago with professionalism, safety and unforgettable service.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <AboutHero />
      <OurStory />
      <WhyChooseUs />
      <FleetStats />
      <OurValues />
      <MeetTheTeam />
      <SafetyCertifications />
      <AboutTestimonials />
      <AboutCTA />
    </div>
  );
}
