import { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactCards } from "@/components/contact/ContactCards";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { InstantBooking } from "@/components/contact/InstantBooking";
import { BusinessInfo } from "@/components/contact/BusinessInfo";
import { ContactMap } from "@/components/contact/ContactMap";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { ContactTestimonials } from "@/components/contact/ContactTestimonials";
import { SocialCards } from "@/components/contact/SocialCards";
import { ContactCTA } from "@/components/contact/ContactCTA";

export const metadata: Metadata = {
  title: "Contact Concierge | Chicago Yachts",
  description: "Contact our luxury concierge team to plan your unforgettable Chicago yacht experience.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <ContactHero />
      <ContactCards />
      
      {/* Booking & Info Section */}
      <section className="py-24 bg-background border-t border-slate-100 relative z-10">
        <div className="container px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Left Column: Instant Booking & Info */}
            <div className="lg:w-[40%] flex flex-col gap-12 order-2 lg:order-1">
              <div className="lg:sticky lg:top-32 flex flex-col gap-12">
                <InstantBooking />
                <BusinessInfo />
              </div>
            </div>

            {/* Right Column: Detailed Form */}
            <div className="lg:w-[60%] order-1 lg:order-2">
              <EnquiryForm />
            </div>

          </div>
        </div>
      </section>

      <ContactMap />
      <ContactFAQ />
      <ContactTestimonials />
      <SocialCards />
      <ContactCTA />
    </div>
  );
}
