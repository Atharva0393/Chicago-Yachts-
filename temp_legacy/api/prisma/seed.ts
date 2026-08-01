import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Mirrors the demo fleet from the Next.js frontend (src/lib/data.ts) so both
// layers show the same yachts once the frontend switches over to this API.
const destinations = [
  {
    slug: 'miami',
    name: 'Miami',
    country: 'United States',
    tagline: 'Neon nights, turquoise days',
    description:
      'Cruise past the Art Deco skyline of South Beach, anchor at Haulover sandbar and watch the sunset from Biscayne Bay.',
    heroImage: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=1600&q=80',
    currency: 'USD',
    featured: true,
  },
  {
    slug: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    tagline: 'Skyline of superlatives',
    description:
      'Glide past the Burj Al Arab, Atlantis and the Palm Jumeirah on the calm waters of the Arabian Gulf.',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    currency: 'AED',
    featured: true,
  },
  {
    slug: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    tagline: 'Skyline sails on Lake Ontario',
    description: 'Charter from the Harbourfront and drift past the Toronto Islands with the CN Tower behind you.',
    heroImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80',
    currency: 'CAD',
    featured: true,
  },
  {
    slug: 'chicago',
    name: 'Chicago',
    country: 'United States',
    tagline: 'Architecture from the lake',
    description: 'Lake Michigan serves the most dramatic skyline view in America.',
    heroImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80',
    currency: 'USD',
    featured: true,
  },
  {
    slug: 'cancun',
    name: 'Cancún',
    country: 'Mexico',
    tagline: 'Caribbean blue, all year',
    description: 'Isla Mujeres day trips and sunset sails over impossibly clear Caribbean water.',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    currency: 'USD',
    featured: true,
  },
  {
    slug: 'ibiza',
    name: 'Ibiza',
    country: 'Spain',
    tagline: 'Balearic gold standard',
    description: "Formentera's white sand and Es Vedrà sunsets — the Mediterranean's most iconic playground.",
    heroImage: 'https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?auto=format&fit=crop&w=1600&q=80',
    currency: 'EUR',
    featured: true,
  },
];

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;
const IMG = {
  speedboatAerial: u('photo-1544551763-46a013bb70d5'),
  yachtSea: u('photo-1567899378494-47b22a2ae96a'),
  yachtBow: u('photo-1540946485063-a40da27545f8'),
  sailSunset: u('photo-1500930287596-c1ecaa373bb2'),
  yachtAerial: u('photo-1548574505-5e239809ee19'),
  yachtSunset: u('photo-1569263979104-865ab7cd8d13'),
  dubaiMarina: u('photo-1512453979798-5ea266f8880c'),
  chicago: u('photo-1477959858617-67f85cf4f1df'),
  toronto: u('photo-1486325212027-8081e485255e'),
  miami: u('photo-1535498730771-e735b998cd64'),
  beach: u('photo-1507525428034-b723cf961d3e'),
  cabin: u('photo-1578683010236-d716f9a3f461'),
};

interface OwnerSeed {
  email: string;
  name: string;
  company: string;
}

interface YachtSeed {
  slug: string;
  title: string;
  type: string;
  destination: string;
  ownerEmail: string;
  marina: string;
  lengthFt: number;
  capacity: number;
  cabins: number;
  crew: number;
  withCaptain: boolean;
  instantBook: boolean;
  pricePerHour: number;
  minHours: number;
  currency: string;
  rating: number;
  reviewCount: number;
  bookingsCount: number;
  images: string[];
  amenities: string[];
  description: string;
  featured: boolean;
  status: 'live' | 'pending';
  packages?: { name: string; hours: number; price: number; includes: string[] }[];
}

const owners: OwnerSeed[] = [
  { email: 'andres@miamivip.com', name: 'Andres', company: 'Miami VIP Yachts' },
  { email: 'ops@rashidmarine.ae', name: 'Rashid Marine LLC', company: 'Rashid Marine LLC' },
  { email: 'hello@lakeshorecharters.ca', name: 'Lakeshore Charters', company: 'Lakeshore Charters' },
  { email: 'book@windycityyachting.com', name: 'Windy City Yachting', company: 'Windy City Yachting' },
  { email: 'reservas@caribecharters.mx', name: 'Caribe Charters MX', company: 'Caribe Charters MX' },
  { email: 'info@balearicsailing.es', name: 'Balearic Sailing Co.', company: 'Balearic Sailing Co.' },
  { email: 'marco@seaisle.com', name: 'Marco', company: 'Sea Isle Rentals' },
  { email: 'events@gulfprestige.ae', name: 'Gulf Prestige Yachts', company: 'Gulf Prestige Yachts' },
  { email: 'stays@harborstays.com', name: 'Harbor Stays', company: 'Harbor Stays' },
];

const yachts: YachtSeed[] = [
  {
    slug: 'azimut-75-super-yacht-miami',
    title: 'Exclusive 75ft Azimut Super Yacht + 2 Jet Skis',
    type: 'Mega Yacht',
    destination: 'miami',
    ownerEmail: 'andres@miamivip.com',
    marina: 'Miami Beach Marina',
    lengthFt: 75,
    capacity: 13,
    cabins: 4,
    crew: 3,
    withCaptain: true,
    instantBook: true,
    pricePerHour: 359,
    minHours: 2,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 132,
    bookingsCount: 421,
    images: [IMG.yachtSea, IMG.yachtAerial, IMG.cabin, IMG.miami],
    amenities: ['Full VIP crew', '2 Jet Skis included', 'Premium sound system', 'Air conditioning', 'Swim platform', 'Champagne welcome'],
    description:
      'Step aboard our flagship 75ft Azimut and experience Miami at the highest level of luxury. Ideal for upscale lounging and celebrating, paired with two jet skis for guests who want the adrenaline as well.',
    featured: true,
    status: 'live',
    packages: [
      { name: 'Golden Hour Cruise', hours: 3, price: 1190, includes: ['Champagne welcome', 'Sunset route', 'Bluetooth DJ setup'] },
      { name: 'Full-Day VIP Charter', hours: 8, price: 2690, includes: ['Jet skis + fuel', 'Catering for 12', 'Sandbar anchorage'] },
    ],
  },
  {
    slug: 'sunseeker-88-dubai-marina',
    title: 'Sunseeker 88 Flybridge — Burj Al Arab Route',
    type: 'Mega Yacht',
    destination: 'dubai',
    ownerEmail: 'ops@rashidmarine.ae',
    marina: 'Dubai Harbour Marina',
    lengthFt: 88,
    capacity: 25,
    cabins: 4,
    crew: 4,
    withCaptain: true,
    instantBook: false,
    pricePerHour: 1899,
    minHours: 2,
    currency: 'AED',
    rating: 4.8,
    reviewCount: 97,
    bookingsCount: 310,
    images: [IMG.dubaiMarina, IMG.yachtBow, IMG.cabin, IMG.yachtSunset],
    amenities: ['Professional crew of 4', 'Flybridge lounge', 'BBQ on board', 'Shisha setup', 'Air conditioning', 'Swimming stop at Palm'],
    description:
      "Dubai's skyline demands a yacht that matches it. This Sunseeker 88 hosts up to 25 guests across a flybridge lounge, shaded aft deck and four designer cabins.",
    featured: true,
    status: 'live',
    packages: [{ name: 'Palm Sunset Cruise', hours: 3, price: 5390, includes: ['Soft drinks & water', 'Shisha', 'Swim stop'] }],
  },
  {
    slug: 'sea-ray-52-toronto-harbourfront',
    title: 'Sea Ray 52 Sundancer — CN Tower Skyline Cruise',
    type: 'Motor Yacht',
    destination: 'toronto',
    ownerEmail: 'hello@lakeshorecharters.ca',
    marina: 'Harbourfront Centre Marina',
    lengthFt: 52,
    capacity: 12,
    cabins: 2,
    crew: 2,
    withCaptain: true,
    instantBook: true,
    pricePerHour: 449,
    minHours: 3,
    currency: 'CAD',
    rating: 4.9,
    reviewCount: 64,
    bookingsCount: 188,
    images: [IMG.toronto, IMG.yachtSea, IMG.cabin, IMG.speedboatAerial],
    amenities: ['Licensed captain', 'Heated cabin', 'Premium audio', 'Paddleboard', 'Cooler & ice'],
    description:
      'The definitive Toronto experience: depart Harbourfront, loop the Toronto Islands and anchor with the CN Tower filling the horizon.',
    featured: true,
    status: 'live',
    packages: [{ name: 'Island Sunset Loop', hours: 3, price: 1290, includes: ['Captain & fuel', 'Anchorage swim stop', 'Bluetooth audio'] }],
  },
  {
    slug: 'prestige-68-chicago-playpen',
    title: 'Prestige 68 — Chicago Skyline & Playpen Charter',
    type: 'Motor Yacht',
    destination: 'chicago',
    ownerEmail: 'book@windycityyachting.com',
    marina: 'Burnham Harbor',
    lengthFt: 68,
    capacity: 13,
    cabins: 3,
    crew: 2,
    withCaptain: true,
    instantBook: false,
    pricePerHour: 525,
    minHours: 4,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 51,
    bookingsCount: 143,
    images: [IMG.chicago, IMG.yachtBow, IMG.cabin, IMG.yachtAerial],
    amenities: ['USCG licensed captain', 'Hydraulic swim platform', 'Grill', 'Two lounges', 'Playpen anchoring'],
    description:
      "Lake Michigan's most dramatic view of the Loop, from a three-cabin Prestige 68. Book the Wednesday/Saturday fireworks route or a full playpen Saturday.",
    featured: true,
    status: 'live',
    packages: [{ name: 'Fireworks Night', hours: 4, price: 2290, includes: ['Front-row anchorage', 'Welcome prosecco', 'Blankets'] }],
  },
  {
    slug: 'lagoon-46-catamaran-cancun',
    title: 'Lagoon 46 Catamaran — Isla Mujeres All-Inclusive',
    type: 'Catamaran',
    destination: 'cancun',
    ownerEmail: 'reservas@caribecharters.mx',
    marina: 'Marina Aquatours, Zona Hotelera',
    lengthFt: 46,
    capacity: 20,
    cabins: 4,
    crew: 3,
    withCaptain: true,
    instantBook: true,
    pricePerHour: 289,
    minHours: 4,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 118,
    bookingsCount: 356,
    images: [IMG.beach, IMG.sailSunset, IMG.yachtSea, IMG.cabin],
    amenities: ['Open bar', 'Snorkel gear', 'Ceviche lunch', 'Trampoline nets', 'MUSA reef stop'],
    description:
      'The classic Cancún day: sail to Isla Mujeres with open bar and fresh ceviche, snorkel the MUSA underwater museum and come home with the sunset behind you.',
    featured: true,
    status: 'live',
    packages: [{ name: 'Isla Mujeres Day Trip', hours: 6, price: 1590, includes: ['Open bar', 'Lunch', 'Snorkel tour', 'Beach club access'] }],
  },
  {
    slug: 'beneteau-oceanis-51-ibiza',
    title: 'Beneteau Oceanis 51.1 — Formentera Under Sail',
    type: 'Sailing Yacht',
    destination: 'ibiza',
    ownerEmail: 'info@balearicsailing.es',
    marina: 'Marina Botafoch',
    lengthFt: 51,
    capacity: 10,
    cabins: 3,
    crew: 2,
    withCaptain: true,
    instantBook: false,
    pricePerHour: 240,
    minHours: 4,
    currency: 'EUR',
    rating: 4.9,
    reviewCount: 73,
    bookingsCount: 201,
    images: [IMG.sailSunset, IMG.yachtAerial, IMG.cabin, IMG.yachtSea],
    amenities: ['Skipper included', 'Paddleboard & snorkel', 'Sunset Es Vedrà route', 'Formentera anchorage'],
    description:
      'Sail — properly sail — from Ibiza Town to the caribbean-blue shallows of Formentera. Anchor for lunch at Illetes, swim, and return past Es Vedrà as the sun drops.',
    featured: true,
    status: 'live',
    packages: [{ name: 'Formentera Full Day', hours: 8, price: 1750, includes: ['Skipper & fuel', 'Paella lunch order', 'Snorkel gear'] }],
  },
  {
    slug: 'yamaha-jetboat-miami-duo',
    title: 'Yamaha 27 Jet Boat — Sandbar & Skyline Duo',
    type: 'Speedboat',
    destination: 'miami',
    ownerEmail: 'marco@seaisle.com',
    marina: 'Sea Isle Marina',
    lengthFt: 27,
    capacity: 8,
    cabins: 0,
    crew: 1,
    withCaptain: true,
    instantBook: true,
    pricePerHour: 129,
    minHours: 2,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 88,
    bookingsCount: 264,
    images: [IMG.speedboatAerial, IMG.miami, IMG.yachtSea],
    amenities: ['Captain included', 'Cooler & ice', 'Bluetooth speakers', 'Tube ride add-on'],
    description:
      'Fast, fun and affordable — buzz the Miami skyline, stop at the sandbar and tube on the way home. The best value on Biscayne Bay for small groups.',
    featured: false,
    status: 'live',
  },
  {
    slug: 'majesty-101-dubai-events',
    title: 'Majesty 101 — Private Events Superyacht',
    type: 'Mega Yacht',
    destination: 'dubai',
    ownerEmail: 'events@gulfprestige.ae',
    marina: 'Dubai Marina Yacht Club',
    lengthFt: 101,
    capacity: 50,
    cabins: 5,
    crew: 6,
    withCaptain: true,
    instantBook: false,
    pricePerHour: 3499,
    minHours: 3,
    currency: 'AED',
    rating: 4.9,
    reviewCount: 42,
    bookingsCount: 96,
    images: [IMG.yachtSunset, IMG.dubaiMarina, IMG.cabin, IMG.yachtBow],
    amenities: ['Event styling team', 'Full galley & chef', 'Sky lounge', 'Jacuzzi', 'DJ booth', 'LED lighting rig'],
    description:
      'A 101ft Majesty configured for weddings, product launches and VIP parties of up to 50 guests. In-house event team, chef-led menus and a jacuzzi deck.',
    featured: false,
    status: 'live',
    packages: [{ name: 'Event Evening', hours: 4, price: 15990, includes: ['Event stylist', 'Canapé menu', 'DJ + sound', 'Photography'] }],
  },
  {
    slug: 'azimut-55-toronto',
    title: 'Azimut 55 — Private Lake Ontario Escape',
    type: 'Motor Yacht',
    destination: 'toronto',
    ownerEmail: 'hello@lakeshorecharters.ca',
    marina: 'Ontario Place Marina',
    lengthFt: 55,
    capacity: 10,
    cabins: 3,
    crew: 2,
    withCaptain: true,
    instantBook: false,
    pricePerHour: 519,
    minHours: 3,
    currency: 'CAD',
    rating: 4.8,
    reviewCount: 37,
    bookingsCount: 92,
    images: [IMG.yachtBow, IMG.toronto, IMG.cabin],
    amenities: ['Captain & host', 'Heated deck', 'Charcuterie service', 'Island route'],
    description:
      'An intimate Azimut 55 for small groups who want the lake to themselves — charcuterie, blankets for the evening breeze and the skyline from Centre Island.',
    featured: false,
    status: 'live',
  },
  {
    slug: 'houseboat-lake-michigan-weekender',
    title: '60ft Luxury Houseboat — Skyline Weekender',
    type: 'Houseboat',
    destination: 'chicago',
    ownerEmail: 'stays@harborstays.com',
    marina: '31st Street Harbor',
    lengthFt: 60,
    capacity: 12,
    cabins: 5,
    crew: 1,
    withCaptain: false,
    instantBook: true,
    pricePerHour: 179,
    minHours: 12,
    currency: 'USD',
    rating: 4.5,
    reviewCount: 29,
    bookingsCount: 61,
    images: [IMG.cabin, IMG.chicago, IMG.yachtAerial],
    amenities: ['5 cabins', 'Full kitchen', 'Rooftop deck', 'Overnight stays', 'Dockside power'],
    description:
      'Sleep on the water with the Chicago skyline out the window. A five-cabin houseboat for weekend stays, bachelor(ette) bases and slow mornings on the rooftop deck.',
    featured: false,
    status: 'live',
  },
  {
    slug: 'sea-ray-40-cancun-sunset',
    title: 'Sea Ray 40 Flybridge — Private Sunset Cruise',
    type: 'Motor Yacht',
    destination: 'cancun',
    ownerEmail: 'reservas@caribecharters.mx',
    marina: 'Puerto Cancún Marina',
    lengthFt: 40,
    capacity: 12,
    cabins: 2,
    crew: 2,
    withCaptain: true,
    instantBook: true,
    pricePerHour: 219,
    minHours: 3,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 56,
    bookingsCount: 149,
    images: [IMG.yachtSea, IMG.beach, IMG.cabin],
    amenities: ['Captain & deckhand', 'Open bar add-on', 'Snorkel stop', 'Bluetooth audio'],
    description: "A private flybridge cruiser for Cancún's lagoon and coastline — snorkel stop included, open bar optional, sunset guaranteed.",
    featured: false,
    status: 'live',
  },
  {
    slug: 'pershing-62-ibiza-vip',
    title: 'Pershing 62 — Balearic VIP Day Charter',
    type: 'Motor Yacht',
    destination: 'ibiza',
    ownerEmail: 'info@balearicsailing.es',
    marina: 'Marina Ibiza',
    lengthFt: 62,
    capacity: 11,
    cabins: 3,
    crew: 2,
    withCaptain: true,
    instantBook: false,
    pricePerHour: 690,
    minHours: 4,
    currency: 'EUR',
    rating: 4.9,
    reviewCount: 48,
    bookingsCount: 117,
    images: [IMG.yachtAerial, IMG.sailSunset, IMG.cabin, IMG.yachtSea],
    amenities: ['38-knot cruising', 'Seabob included', 'Beach club drop-off', 'Premium rosé service'],
    description: 'The Pershing 62 is Ibiza distilled: 38 knots to Formentera, seabob in the shallows, and a beach-club drop-off as the evening starts.',
    featured: false,
    status: 'live',
  },
  // A freshly-submitted listing sitting in the admin moderation queue.
  {
    slug: 'ferretti-72-golden-coast',
    title: 'Ferretti 72 — Golden Coast Charter',
    type: 'Mega Yacht',
    destination: 'dubai',
    ownerEmail: 'ops@rashidmarine.ae',
    marina: 'Dubai Harbour Marina',
    lengthFt: 72,
    capacity: 18,
    cabins: 3,
    crew: 3,
    withCaptain: true,
    instantBook: false,
    pricePerHour: 1450,
    minHours: 3,
    currency: 'AED',
    rating: 0,
    reviewCount: 0,
    bookingsCount: 0,
    images: [IMG.yachtAerial],
    amenities: ['Insurance verified', 'Registration verified'],
    description: 'A recently listed Ferretti 72 awaiting admin review before going live.',
    featured: false,
    status: 'pending',
  },
];

async function main() {
  console.log('Seeding…');
  const passwordHash = await bcrypt.hash('password123', 12);

  // --- Destinations ---
  const destMap = new Map<string, string>();
  for (const d of destinations) {
    const rec = await prisma.destination.upsert({ where: { slug: d.slug }, update: d, create: d });
    destMap.set(d.slug, rec.id);
  }

  // --- Users: admin, customer, all owners ---
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bookluxuryyacht.com' },
    update: {},
    create: { email: 'admin@bookluxuryyacht.com', passwordHash, name: 'Platform Admin', role: 'admin' },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'shankss.verma@gmail.com' },
    update: {},
    create: { email: 'shankss.verma@gmail.com', passwordHash, name: 'Shanks Verma', role: 'customer' },
  });

  const ownerMap = new Map<string, string>();
  for (const o of owners) {
    const rec = await prisma.user.upsert({
      where: { email: o.email },
      update: {},
      create: {
        email: o.email,
        passwordHash,
        name: o.name,
        role: 'owner',
        ownerProfile: { create: { company: o.company, verificationStatus: 'verified' } },
      },
    });
    ownerMap.set(o.email, rec.id);
  }

  // --- Amenities (deduped across all yachts) ---
  const amenityNames = Array.from(new Set(yachts.flatMap((y) => y.amenities)));
  const amenityMap = new Map<string, string>();
  for (const name of amenityNames) {
    const rec = await prisma.amenity.upsert({ where: { name }, update: {}, create: { name } });
    amenityMap.set(name, rec.id);
  }

  // --- Yachts ---
  for (const y of yachts) {
    const existing = await prisma.yacht.findUnique({ where: { slug: y.slug } });
    if (existing) continue;

    await prisma.yacht.create({
      data: {
        slug: y.slug,
        ownerId: ownerMap.get(y.ownerEmail)!,
        destinationId: destMap.get(y.destination)!,
        title: y.title,
        type: y.type,
        marina: y.marina,
        lengthFt: y.lengthFt,
        capacity: y.capacity,
        cabins: y.cabins,
        crew: y.crew,
        withCaptain: y.withCaptain,
        instantBook: y.instantBook,
        description: y.description,
        pricePerHour: y.pricePerHour,
        minHours: y.minHours,
        currency: y.currency,
        status: y.status,
        rating: y.rating,
        reviewCount: y.reviewCount,
        bookingsCount: y.bookingsCount,
        media: { create: y.images.map((url, i) => ({ url, sortOrder: i })) },
        amenities: { create: y.amenities.map((name) => ({ amenityId: amenityMap.get(name)! })) },
        ...(y.packages?.length
          ? {
              packages: {
                create: y.packages.map((p) => ({
                  name: p.name,
                  hours: p.hours,
                  price: p.price,
                  includes: JSON.stringify(p.includes),
                })),
              },
            }
          : {}),
      },
    });
  }

  console.log('Seed complete.');
  console.log({
    admin: admin.email,
    customer: customer.email,
    owners: owners.map((o) => o.email),
    yachts: yachts.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
