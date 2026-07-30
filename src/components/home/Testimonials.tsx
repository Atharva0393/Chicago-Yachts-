import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "James Wentworth",
      role: "Corporate Executive",
      content: "The attention to detail and level of service exceeded all expectations. The Riva Corsaro provided the perfect setting for our board retreat.",
      rating: 5,
    },
    {
      name: "Sarah & Michael",
      role: "Anniversary Celebration",
      content: "Our sunset cruise was nothing short of magical. The crew was discrete yet attentive, and the yacht was immaculate. An unforgettable evening.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "Private Event Host",
      content: "From the seamless booking process to the stunning views of the Chicago skyline, everything was handled with absolute professionalism and grace.",
      rating: 5,
    }
  ];

  return (
    <section className="w-full py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent mb-4">Client Stories</h2>
          <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
            Voices of Experience
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-10 rounded-[20px] shadow-[var(--shadow-premium)] hover-lift flex flex-col h-full border border-border/50">
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-1 italic">
                "{testimonial.content}"
              </p>
              <div>
                <h5 className="font-medium text-foreground">{testimonial.name}</h5>
                <p className="text-sm text-accent">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
