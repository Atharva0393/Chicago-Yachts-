export interface Yacht {
  id: string;
  name: string;
  slug: string;
  manufacturer: string;
  model: string;
  year: number;
  length: number;
  capacity: number;
  cabins: number;
  bathrooms: number;
  description: string;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  location: string;
  images: string[];
  amenities: string[];
  availabilityStatus: "Available Today" | "Few Dates Left" | "Fully Booked";
  isActive?: boolean;
  isFeatured?: boolean;
  instantBook?: boolean;
}

export interface CompanySocials {
  instagram: string;
  facebook: string;
  youtube: string;
}

export interface CompanyPolicies {
  privacy: string;
  terms: string;
  cancellation: string;
}

export interface CompanyStat {
  value: string;
  label: string;
}

export interface CompanyInfo {
  name: string;
  description: string;
  phone: string;
  email: string;
  socials: CompanySocials;
  operatingHours: string;
  policies: CompanyPolicies;
  stats: CompanyStat[];
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  icon: any; // Will be mapped to LucideIcon
  image: string;
  colSpan?: string;
  guests: string;
  duration: string;
  price: number;
  yachts: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  trip: string;
  rating: number;
}

export interface CustomerNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface CustomerActivity {
  id: string;
  type: "EMAIL" | "CALL" | "NOTE" | "BOOKING" | "STATUS_CHANGE";
  description: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status?: "LEAD" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
  notes?: CustomerNote[];
  activities?: CustomerActivity[];
  tags?: string[];
  createdAt: string;
}

export interface Booking {
  id: string;
  yachtId: string;
  customerId: string;
  customer?: Customer; // Joined
  yacht?: Yacht; // Joined
  date: string;
  timeSlot: string;
  duration: number;
  guests: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "CANCELLED" | "COMPLETED";
  paymentStatus?: string;
  remainingAmount?: number;
  createdAt: string;
}
