"use client"

import { Anchor, Check, MapPin, Ruler, Users, Ship, ShieldCheck, Waves, Scale, Heart } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCompare } from "@/lib/contexts/CompareContext";
import { useWishlist } from "@/lib/contexts/WishlistContext";
import { cn } from "@/lib/utils";

interface YachtInfoProps {
  id: string;
  name: string;
  capacity: number;
  length: string;
  location: string;
  rating: number;
  reviews: number;
}

export function YachtInfo({ id, name, capacity, length, location, rating, reviews }: YachtInfoProps) {
  const { selectedYachts, addYacht, removeYacht } = useCompare();
  const { isSaved, toggleWishlist } = useWishlist();
  
  const isCompared = selectedYachts.some(y => y.id === id);
  const isWishlisted = isSaved(id);
  
  const handleCompareToggle = () => {
    if (isCompared) {
      removeYacht(id);
    } else {
      addYacht(id);
    }
  };

  const amenities = [
    "Licensed Captain & Crew", "Bluetooth Sound System", "Floating Lily Pad", 
    "Coolers with Ice", "Bottled Water", "Luxury Restrooms", 
    "Sundeck", "Climate Controlled Cabin", "Swim Platform", "Kitchenette"
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* Header Info */}
      <div className="flex flex-col gap-4 border-b border-border/50 pb-8">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">{name}</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => toggleWishlist(id)}
              className={cn(
                "shrink-0 flex items-center justify-center h-10 w-10 rounded-full border transition-all duration-300 group/heart",
                isWishlisted
                  ? "bg-primary/10 border-primary"
                  : "bg-background border-border hover:bg-muted"
              )}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart 
                className={cn(
                  "h-4 w-4 transition-all duration-300", 
                  isWishlisted ? "fill-primary text-primary scale-110" : "text-foreground group-hover/heart:scale-110"
                )} 
              />
            </button>
            <button 
              onClick={handleCompareToggle}
              className={cn(
                "shrink-0 flex items-center gap-2 h-10 px-4 rounded-full border transition-colors text-sm font-medium",
                isCompared
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-background border-border text-foreground hover:bg-muted"
              )}
            >
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">{isCompared ? "Remove" : "Compare"}</span>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground font-medium">
          <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-accent text-accent" /> {rating} · {reviews} reviews</span>
          <span className="text-muted-foreground">•</span>
          <span className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4" /> {location}</span>
        </div>
        
        <div className="flex flex-wrap gap-6 mt-4">
          <div className="flex items-center gap-3 bg-muted/50 px-4 py-3 rounded-[16px]">
            <Users className="h-5 w-5 text-accent" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Capacity</span>
              <span className="text-sm font-medium">Up to {capacity} guests</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-muted/50 px-4 py-3 rounded-[16px]">
            <Ruler className="h-5 w-5 text-accent" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Length</span>
              <span className="text-sm font-medium">{length}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-accent/10 px-4 py-3 rounded-[16px]">
            <Anchor className="h-5 w-5 text-accent" />
            <div className="flex flex-col">
              <span className="text-xs text-accent uppercase tracking-wider font-semibold">Crew</span>
              <span className="text-sm font-medium text-accent">Captain Included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-4 border-b border-border/50 pb-8">
        <h3 className="text-2xl font-medium">About this yacht</h3>
        <p className="text-muted-foreground leading-relaxed">
          Experience unparalleled luxury aboard the {name}. Designed for those who demand the finest on the water, this vessel offers a perfect blend of performance, comfort, and style. Whether you're planning an intimate sunset cruise, a vibrant celebration, or a corporate outing, the spacious sundeck and meticulously appointed cabin provide the ultimate setting.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-2">
          Your charter includes a highly experienced, USCG-licensed captain and dedicated crew to ensure your journey through the Chicago River or Lake Michigan is safe, seamless, and entirely unforgettable.
        </p>
      </div>

      {/* Amenities */}
      <div className="flex flex-col gap-6 border-b border-border/50 pb-8">
        <h3 className="text-2xl font-medium">What this yacht offers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {amenities.map((amenity, idx) => (
            <div key={idx} className="flex items-center gap-3 text-muted-foreground">
              <Check className="h-5 w-5 text-foreground" />
              <span className="text-foreground">{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div className="flex flex-col gap-6 border-b border-border/50 pb-8">
        <h3 className="text-2xl font-medium">Specifications</h3>
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Make / Model</span>
            <span className="font-medium flex items-center gap-2"><Ship className="h-4 w-4" /> {name.split(" ")[0]}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Year Refitted</span>
            <span className="font-medium">2023</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Cruising Speed</span>
            <span className="font-medium flex items-center gap-2"><Waves className="h-4 w-4" /> 22 Knots</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Staterooms / Bathrooms</span>
            <span className="font-medium">3 / 2</span>
          </div>
        </div>
      </div>

      {/* Policies & FAQ */}
      <div className="flex flex-col gap-6 pb-8">
        <h3 className="text-2xl font-medium">Things to know</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="policy">
            <AccordionTrigger className="text-lg font-medium hover:no-underline">Cancellation Policy</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Full refund for cancellations up to 7 days before the charter date. 50% refund for cancellations up to 48 hours before. No refunds for cancellations within 48 hours. In case of severe weather determined by the captain, you will receive a full refund or the option to reschedule.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="rules">
            <AccordionTrigger className="text-lg font-medium hover:no-underline">Yacht Rules</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              No red wine or staining foods. No smoking inside the cabin (designated outdoor smoking areas only). Guests must remain seated while docking. No illegal substances allowed aboard under any circumstances (Zero Tolerance Policy).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="arrival">
            <AccordionTrigger className="text-lg font-medium hover:no-underline">Boarding & Arrival</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Please arrive 15 minutes prior to your scheduled departure time. The captain will meet you at the designated dock at {location}. Bring a valid photo ID for the primary charter guest.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

// Internal Star component to avoid double importing in the parent
function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
