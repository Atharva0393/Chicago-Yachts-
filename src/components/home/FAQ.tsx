import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faqs";

export function FAQ() {
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
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2 pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
