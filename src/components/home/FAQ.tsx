import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "What is included in the charter price?",
      answer: "Our standard charter includes the yacht, a licensed captain, professional crew, fuel for local cruising, basic non-alcoholic beverages, and all necessary safety equipment. Premium catering and bespoke additions are billed separately."
    },
    {
      question: "Can we bring our own food and beverages?",
      answer: "Yes, you are welcome to bring your own provisions. However, we highly recommend utilizing our premium catering partners for a truly seamless luxury experience on the water."
    },
    {
      question: "What happens in case of inclement weather?",
      answer: "Your safety is our priority. If the captain determines conditions are unsafe for departure, we will work with you to reschedule your charter or provide a full refund according to our weather policy."
    },
    {
      question: "How far in advance should we book?",
      answer: "For weekend dates and peak summer season (June-August), we recommend booking at least 4-6 weeks in advance. However, we always try to accommodate last-minute requests when availability permits."
    },
    {
      question: "Is there a minimum charter duration?",
      answer: "Our standard minimum charter duration is 4 hours, which provides the perfect amount of time to enjoy the Chicago skyline, the playpen, or a scenic river cruise."
    }
  ];

  return (
    <section className="w-full py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent mb-4">Information</h2>
          <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-6">
            Frequently Asked Questions
          </h3>
          <p className="text-muted-foreground font-light mb-8">
            Everything you need to know about preparing for your luxury yacht experience with Chicago Yachts.
          </p>
          <button className="text-sm font-medium text-accent hover:text-accent/80 transition-luxury flex items-center gap-2 group">
            Contact Concierge
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
        
        <div className="lg:w-2/3">
          <Accordion className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50 py-2">
                <AccordionTrigger className="text-lg font-medium hover:no-underline hover:text-accent transition-luxury text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
