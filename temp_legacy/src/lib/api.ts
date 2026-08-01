import type { Booking, BookingStatus, CharterPackage, Destination, Review, Yacht } from "./types";

// ---------------------------------------------------------------------------
// Typed client for the real BookLuxuryYacht API (../api). Every function here
// normalizes the API's JSON shape into the same frontend types the components
// already use (src/lib/types.ts) so pages/components don't need to change —
// this file is the only thing that talks to the network.
// ---------------------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = Array.isArray(body.message) ? body.message.join(", ") : body.message;
    throw new ApiError(message ?? res.statusText, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ---- normalizers: API response shape -> frontend types ----

interface ApiDestination {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  heroImage: string;
  currency: string;
  featured: boolean;
  _count?: { yachts: number };
}

function normalizeDestination(d: ApiDestination): Destination {
  return {
    slug: d.slug,
    name: d.name,
    country: d.country,
    tagline: d.tagline,
    description: d.description,
    image: d.heroImage,
    yachtCount: d._count?.yachts ?? 0,
    currency: d.currency,
    featured: d.featured,
  };
}

interface ApiYacht {
  id: string;
  slug: string;
  title: string;
  type: string;
  marina: string;
  lengthFt: number;
  capacity: number;
  cabins: number;
  crew: number;
  withCaptain: boolean;
  instantBook: boolean;
  description: string;
  pricePerHour: number;
  minHours: number;
  currency: string;
  status: string;
  rating: number;
  reviewCount: number;
  bookingsCount: number;
  destination: { slug: string; name: string };
  media?: { url: string }[];
  amenities?: { amenity: { name: string } }[];
  packages?: { id: string; name: string; hours: number; price: number; includes: string }[];
  owner?: {
    name: string;
    createdAt: string;
    ownerProfile?: { verificationStatus: string } | null;
  };
  reviews?: {
    id: string;
    ratingOverall: number;
    comment: string;
    createdAt: string;
    author?: { name: string };
  }[];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function normalizeYacht(y: ApiYacht): Yacht {
  const packages: CharterPackage[] = (y.packages ?? []).map((p) => ({
    name: p.name,
    hours: p.hours,
    price: p.price,
    includes: JSON.parse(p.includes) as string[],
  }));

  const reviews: Review[] = (y.reviews ?? []).map((r) => ({
    id: r.id,
    author: r.author?.name ?? "Guest",
    avatarInitials: initials(r.author?.name ?? "Guest"),
    rating: r.ratingOverall,
    date: new Date(r.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    comment: r.comment,
    trip: y.title,
  }));

  return {
    id: y.id,
    slug: y.slug,
    title: y.title,
    type: y.type as Yacht["type"],
    destination: y.destination.slug,
    destinationName: y.destination.name,
    marina: y.marina,
    lengthFt: y.lengthFt,
    capacity: y.capacity,
    cabins: y.cabins,
    crew: y.crew,
    withCaptain: y.withCaptain,
    instantBook: y.instantBook,
    pricePerHour: y.pricePerHour,
    minHours: y.minHours,
    currency: y.currency,
    rating: y.rating,
    reviewCount: y.reviewCount,
    bookings: y.bookingsCount,
    images: (y.media ?? []).map((m) => m.url),
    amenities: (y.amenities ?? []).map((a) => a.amenity.name),
    description: y.description,
    ownerName: y.owner?.name ?? "",
    ownerSince: y.owner?.createdAt ? new Date(y.owner.createdAt).getFullYear() : new Date().getFullYear(),
    superOwner: y.owner?.ownerProfile?.verificationStatus === "verified",
    packages,
    reviews,
    featured: false,
    status: y.status as Yacht["status"],
  };
}

interface ApiBooking {
  id: string;
  code: string;
  date: string;
  startTime: string;
  hours: number;
  guests: number;
  total: number;
  currency: string;
  status: string;
  yacht: { title: string; slug: string; destination?: { name: string }; media?: { url: string }[] };
  customer?: { name: string };
}

function normalizeBooking(b: ApiBooking): Booking {
  return {
    id: b.id,
    code: b.code,
    yachtSlug: b.yacht.slug,
    yachtTitle: b.yacht.title,
    destination: b.yacht.destination?.name ?? "",
    customer: b.customer?.name ?? "",
    date: b.date.slice(0, 10),
    startTime: b.startTime,
    hours: b.hours,
    guests: b.guests,
    total: b.total,
    currency: b.currency,
    status: b.status as BookingStatus,
    yachtImage: b.yacht.media?.[0]?.url,
  };
}

// ---- destinations ----

export async function fetchDestinations(): Promise<Destination[]> {
  const { data } = await request<{ data: ApiDestination[] }>("/destinations");
  return data.map(normalizeDestination);
}

export async function fetchDestination(slug: string): Promise<Destination | null> {
  try {
    const { data } = await request<{ data: ApiDestination }>(`/destinations/${slug}`);
    return normalizeDestination(data);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

// ---- yachts ----

export interface YachtQuery {
  destination?: string;
  type?: string;
  maxPrice?: number;
  guests?: number;
  captainOnly?: boolean;
  instantOnly?: boolean;
  sort?: string;
}

export async function fetchYachts(query: YachtQuery = {}): Promise<Yacht[]> {
  const params = new URLSearchParams();
  if (query.destination) params.set("destination", query.destination);
  if (query.type) params.set("type", query.type);
  if (query.maxPrice) params.set("maxPrice", String(query.maxPrice));
  if (query.guests) params.set("guests", String(query.guests));
  if (query.captainOnly) params.set("captainOnly", "true");
  if (query.instantOnly) params.set("instantOnly", "true");
  if (query.sort) params.set("sort", query.sort);

  const qs = params.toString();
  const { data } = await request<{ data: ApiYacht[] }>(`/yachts${qs ? `?${qs}` : ""}`);
  return data.map(normalizeYacht);
}

export async function fetchYacht(slug: string): Promise<Yacht | null> {
  try {
    const { data } = await request<{ data: ApiYacht }>(`/yachts/${slug}`);
    return normalizeYacht(data);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function fetchYachtsIn(destinationSlug: string): Promise<Yacht[]> {
  return fetchYachts({ destination: destinationSlug });
}

// The API doesn't have a `featured` column — approximate the same "one
// flagship yacht per destination" set the original mock data used by taking
// the first (highest-bookingsCount) yacht per destination.
export async function fetchFeaturedYachts(): Promise<Yacht[]> {
  const all = await fetchYachts({ sort: "recommended" });
  const seen = new Set<string>();
  const featured: Yacht[] = [];
  for (const y of all) {
    if (seen.has(y.destination)) continue;
    seen.add(y.destination);
    featured.push({ ...y, featured: true });
  }
  return featured;
}

export async function fetchMyYachts(token: string): Promise<Yacht[]> {
  const { data } = await request<{ data: ApiYacht[] }>("/yachts/mine", { token });
  return data.map(normalizeYacht);
}

export interface CreateYachtInput {
  title: string;
  type: string;
  destinationSlug: string;
  marina: string;
  lengthFt: number;
  capacity: number;
  cabins?: number;
  crew?: number;
  withCaptain?: boolean;
  instantBook?: boolean;
  description: string;
  pricePerHour: number;
  minHours?: number;
  currency: string;
  images: string[];
  amenities?: string[];
}

export async function createYacht(token: string, input: CreateYachtInput): Promise<Yacht> {
  const { data } = await request<{ data: ApiYacht }>("/yachts", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
  return normalizeYacht(data);
}

// ---- bookings ----

export interface CreateBookingInput {
  yachtSlug: string;
  date: string;
  startTime: string;
  hours: number;
  guests: number;
}

export async function createBooking(token: string, input: CreateBookingInput): Promise<Booking> {
  const { data } = await request<{ data: ApiBooking }>("/bookings", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
  return normalizeBooking(data);
}

export async function fetchMyBookings(token: string): Promise<Booking[]> {
  const { data } = await request<{ data: ApiBooking[] }>("/bookings/mine", { token });
  return data.map(normalizeBooking);
}

export async function fetchOwnerBookings(token: string): Promise<Booking[]> {
  const { data } = await request<{ data: ApiBooking[] }>("/bookings/owner", { token });
  return data.map(normalizeBooking);
}

export async function approveBooking(token: string, id: string): Promise<Booking> {
  const { data } = await request<{ data: ApiBooking }>(`/bookings/${id}/approve`, {
    method: "PATCH",
    token,
  });
  return normalizeBooking(data);
}

export async function rejectBooking(token: string, id: string): Promise<Booking> {
  const { data } = await request<{ data: ApiBooking }>(`/bookings/${id}/reject`, {
    method: "PATCH",
    token,
  });
  return normalizeBooking(data);
}

export async function cancelBooking(token: string, id: string): Promise<Booking> {
  const { data } = await request<{ data: ApiBooking }>(`/bookings/${id}/cancel`, {
    method: "PATCH",
    token,
  });
  return normalizeBooking(data);
}

// ---- reviews ----

export async function createReview(
  token: string,
  input: { bookingId: string; ratingOverall: number; comment: string },
) {
  return request(`/reviews`, { method: "POST", token, body: JSON.stringify(input) });
}

// ---- auth ----

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export async function register(input: {
  email: string;
  password: string;
  name: string;
  role?: "customer" | "owner";
}): Promise<AuthResponse> {
  return request("/auth/register", { method: "POST", body: JSON.stringify(input) });
}

export async function login(input: { email: string; password: string }): Promise<AuthResponse> {
  return request("/auth/login", { method: "POST", body: JSON.stringify(input) });
}

export async function fetchMe(token: string): Promise<AuthUser> {
  return request("/auth/me", { token });
}

// ---- admin ----

export interface AdminOverview {
  users: number;
  yachts: number;
  liveYachts: number;
  pendingYachts: number;
  bookings: number;
  gmv: number;
}

export async function fetchAdminOverview(token: string): Promise<AdminOverview> {
  const { data } = await request<{ data: AdminOverview }>("/admin/overview", { token });
  return data;
}

export async function fetchPendingListings(token: string): Promise<Yacht[]> {
  const { data } = await request<{ data: ApiYacht[] }>("/admin/listings/pending", { token });
  return data.map(normalizeYacht);
}

export async function approveListing(token: string, slug: string): Promise<void> {
  await request(`/admin/listings/${slug}/approve`, { method: "PATCH", token });
}

export async function rejectListing(token: string, slug: string): Promise<void> {
  await request(`/admin/listings/${slug}/reject`, { method: "PATCH", token });
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  _count: { bookings: number; yachts: number };
}

export async function fetchAdminUsers(token: string): Promise<AdminUser[]> {
  const { data } = await request<{ data: AdminUser[] }>("/admin/users", { token });
  return data;
}

export async function setUserStatus(
  token: string,
  id: string,
  status: "active" | "suspended" | "flagged",
): Promise<void> {
  await request(`/admin/users/${id}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });
}

export async function fetchAdminBookings(token: string): Promise<Booking[]> {
  const { data } = await request<{ data: ApiBooking[] }>("/admin/bookings", { token });
  return data.map(normalizeBooking);
}

export interface AdminTicket {
  id: string;
  subject: string;
  priority: string;
  status: string;
  user: { name: string; email: string };
  assignee?: { name: string } | null;
  booking?: { code: string } | null;
}

export async function fetchSupportTickets(token: string): Promise<AdminTicket[]> {
  const { data } = await request<{ data: AdminTicket[] }>("/admin/support-tickets", { token });
  return data;
}
