import { Hero } from "@/components/home/Hero";
import { FeaturedFleet } from "@/components/home/FeaturedFleet";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { HomeCTA } from "@/components/home/HomeCTA";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <FeaturedFleet />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <HomeCTA />
    </div>
  );
}
