import { ShieldCheck, Anchor, Map, CalendarCheck } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-accent" />,
      title: "Luxury Experience",
      description: "Impeccable service and attention to detail from the moment you step aboard."
    },
    {
      icon: <Anchor className="h-8 w-8 text-accent" />,
      title: "Professional Crew",
      description: "Licensed captains and highly trained staff dedicated to your safety and enjoyment."
    },
    {
      icon: <Map className="h-8 w-8 text-accent" />,
      title: "Premium Destinations",
      description: "Curated itineraries offering the most breathtaking views of the Chicago skyline."
    },
    {
      icon: <CalendarCheck className="h-8 w-8 text-accent" />,
      title: "Easy Booking",
      description: "Seamless reservation process with transparent pricing and flexible scheduling."
    }
  ];

  return (
    <section className="w-full py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent mb-4">The Standard</h2>
          <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-6">
            Why Choose Chicago Yachts
          </h3>
          <p className="text-lg text-muted-foreground font-light">
            We redefine maritime hospitality, blending world-class vessels with exceptional service to create unforgettable moments on the water.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-[var(--shadow-premium)] flex items-center justify-center mb-8 hover-lift">
                {feature.icon}
              </div>
              <h4 className="text-xl font-medium text-foreground mb-4">{feature.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
