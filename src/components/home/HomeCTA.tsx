import Link from "next/link";

export function HomeCTA() {
  return (
    <section className="relative w-full py-32 flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2940&auto=format&fit=crop')" }}
      />
      
      <div className="absolute inset-0 z-0 bg-primary/80 backdrop-blur-sm" />
      
      <div className="container relative z-10 flex flex-col items-center text-center px-4">
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6 max-w-3xl leading-tight">
          Ready to set sail on a journey of a lifetime?
        </h2>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl font-light">
          Book your yacht today and experience Chicago from the most exclusive vantage point.
        </p>
        
        <Link href="/fleet" className="inline-flex h-16 items-center justify-center rounded-[20px] bg-white px-12 text-lg font-medium text-primary shadow-2xl hover-lift hover:text-accent transition-luxury">
          Reserve Your Yacht
        </Link>
      </div>
    </section>
  );
}
