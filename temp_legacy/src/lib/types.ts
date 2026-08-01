// Shared domain types — mirror the future API contracts (packages/schemas in the monorepo).

export type YachtType =
  | "Motor Yacht"
  | "Mega Yacht"
  | "Sailing Yacht"
  | "Catamaran"
  | "Speedboat"
  | "Houseboat";

export interface Destination {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  image: string;
  yachtCount: number;
  currency: string;
  featured: boolean;
}

export interface CharterPackage {
  name: string;
  hours: number;
  price: number;
  includes: string[];
}

export interface Review {
  id: string;
  author: string;
  avatarInitials: string;
  rating: number;
  date: string;
  comment: string;
  trip: string;
}

export interface Yacht {
  id: string;
  slug: string;
  title: string;
  type: YachtType;
  destination: string; // destination slug
  destinationName: string;
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
  bookings: number;
  images: string[];
  amenities: string[];
  description: string;
  ownerName: string;
  ownerSince: number;
  superOwner: boolean;
  packages: CharterPackage[];
  reviews: Review[];
  featured: boolean;
  status: "live" | "pending" | "paused";
}

export type BookingStatus =
  | "pending"
  | "approved"
  | "paid"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "refunded"
  | "disputed";

export interface Booking {
  id: string;
  code: string;
  yachtSlug: string;
  yachtTitle: string;
  destination: string;
  customer: string;
  date: string;
  startTime: string;
  hours: number;
  guests: number;
  total: number;
  currency: string;
  status: BookingStatus;
  yachtImage?: string;
}
