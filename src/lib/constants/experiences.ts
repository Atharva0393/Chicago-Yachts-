import { PartyPopper, Heart, Briefcase, Sunset, Compass, GlassWater, Camera, Ship, Map, Calendar, Anchor, Music, Sparkles } from "lucide-react";

import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: "playpen-chicago",
    title: "Playpen – Chicago's #1 Summer Destination",
    description: "Experience the legendary Chicago Playpen, the ultimate summer hotspot on Lake Michigan. Drop anchor, tie up with other yachts, and enjoy the ultimate day party.",
    icon: PartyPopper,
    image: "/images/events/event_playpen_1785517654704.png",
    colSpan: "md:col-span-2 md:row-span-1",
    guests: "Up to 15 Guests",
    duration: "4 Hours",
    price: 1200,
    yachts: "Sea Ray, Azimut"
  },
  {
    id: "fireworks-navy-pier",
    title: "Fireworks Shows at Navy Pier",
    description: "Witness the spectacular Wednesday and Saturday night fireworks right from the deck of your private yacht with unobstructed views of Navy Pier.",
    icon: Sparkles, // fixed icon
    image: "/images/events/event_fireworks_1785517667272.png",
    colSpan: "md:col-span-1 md:row-span-1",
    guests: "Up to 12 Guests",
    duration: "3 Hours",
    price: 950,
    yachts: "Prestige, Sunseeker"
  },
  {
    id: "architecture-tour",
    title: "Private Yacht Architecture Tour",
    description: "Cruise down the Chicago River and marvel at the historic skyscrapers with a private, captain-guided architecture tour on a luxury vessel.",
    icon: Camera,
    image: "/images/events/event_architecture_1785517679171.png",
    colSpan: "md:col-span-1 md:row-span-1",
    guests: "Up to 20 Guests",
    duration: "2-3 Hours",
    price: 800,
    yachts: "Aquila 44, Rinker"
  },
  {
    id: "sunset-cruises",
    title: "Romantic Sunset Cruises",
    description: "Golden-hour routes past the world's greatest skyline. Perfect for anniversaries, dates, or simply soaking in the mesmerizing Chicago sunsets.",
    icon: Sunset,
    image: "/images/events/event_sunset_1785517691067.png",
    colSpan: "md:col-span-2 md:row-span-2",
    guests: "2-12 Guests",
    duration: "2-4 Hours",
    price: 750,
    yachts: "Sea Ray Horizon, Pardo"
  },
  {
    id: "air-water-show",
    title: "Chicago Air and Water Show",
    description: "Get front-row seats on the water for the world-famous Chicago Air and Water Show. Avoid the crowded beaches and watch the jets fly directly overhead.",
    icon: Ship,
    image: "/images/events/event_airshow_1785517714916.png",
    guests: "Up to 15 Guests",
    duration: "6 Hours",
    price: 2500,
    yachts: "Azimut S6, Legacy"
  },
  {
    id: "navy-pier-skyline",
    title: "Navy Pier Skyline Views",
    description: "Take in the breathtaking Chicago skyline from the calm waters of Lake Michigan, sailing past the iconic Ferris wheel and shoreline.",
    icon: Map,
    image: "/images/events/event_navypier_1785517726730.png",
    guests: "Up to 12 Guests",
    duration: "3 Hours",
    price: 850,
    yachts: "Sea Ray Sundancer"
  },
  {
    id: "sandbars-indiana",
    title: "Sandbars (Indiana Dunes)",
    description: "Escape the city and cruise out to the beautiful Indiana Dunes sandbars for a day of swimming, relaxing, and waterfront adventure.",
    icon: Anchor,
    image: "/images/events/event_sandbars_1785517740138.png",
    guests: "Up to 12 Guests",
    duration: "8 Hours",
    price: 3200,
    yachts: "Prestige, Sunseeker"
  },
  {
    id: "air-show-practice",
    title: "Air and Water Show Practice Day",
    description: "Enjoy all the thrills of the Air and Water Show without the weekend boat traffic by booking a charter during the official practice day.",
    icon: Calendar,
    image: "/images/events/event_airshow_practice_1785517751071.png",
    guests: "Up to 15 Guests",
    duration: "4 Hours",
    price: 1500,
    yachts: "Azimut S6, Pardo"
  },
  {
    id: "corporate-events",
    title: "Corporate & Team-Building Events",
    description: "Impress clients or reward your team with a highly bespoke, fully-catered luxury yacht experience equipped with Wi-Fi and presentation areas.",
    icon: Briefcase,
    image: "/images/events/event_corporate_1785517775443.png",
    guests: "Up to 30 Guests",
    duration: "4-8 Hours",
    price: 2500,
    yachts: "Aquila 44, Sea Ray L650"
  },
  {
    id: "weddings-receptions",
    title: "Weddings & Receptions on the Water",
    description: "The ultimate romantic backdrop. We handle every detail, from catering to decoration, to ensure your special day is flawlessly executed on the water.",
    icon: Heart,
    image: "/images/events/event_wedding_1785517786648.png",
    guests: "Up to 30 Guests",
    duration: "4-6 Hours",
    price: 3500,
    yachts: "Azimut S6, Legacy Luxury"
  },
  {
    id: "bachelorette-parties",
    title: "Bachelorette & Bachelor Parties",
    description: "Celebrate your last sail before the veil with custom decorations, a premium bar, floating mats, and a lively playlist on the Playpen.",
    icon: GlassWater,
    image: "/images/events/event_bachelorette_1785517798338.png",
    guests: "Up to 12 Guests",
    duration: "4 Hours",
    price: 1400,
    yachts: "Sea Ray Monarch, Rinker"
  },
  {
    id: "birthday-celebrations",
    title: "Birthday & Anniversary Celebrations",
    description: "Unforgettable milestone celebrations on the water with private chef options, curated itineraries, and VIP luxury service.",
    icon: Music,
    image: "/images/events/event_birthday_1785517811464.png",
    guests: "2-15 Guests",
    duration: "3-5 Hours",
    price: 1100,
    yachts: "Sea Ray Power Boat, Pardo"
  }
];
