# Production Readiness & Mock Dependency Audit

## Executive Summary
The Chicago Yachts application has a comprehensive, polished frontend (UI/UX) across both the public-facing booking portal and the Admin Dashboard. However, the backend is currently running entirely on transient mock data (in-memory singletons, localStorage, and hardcoded values). 

**Do not deploy to production in its current state.** A massive data layer migration (Phase 4) is required.

---

## 1. Module Matrix

| Module | Current Implementation | Production Status | Current Data Source | Required Data Source | Problems | Recommended Fix | Priority |
|---|---|---|---|---|---|---|---|
| **Public website** | Next.js Server Components | PARTIALLY FUNCTIONAL | Static JSON / dataService | PostgreSQL (Prisma) | Relies on hardcoded mock data | Hook up Prisma `findMany` | High |
| **Fleet** | Dynamic catalog grid | PARTIALLY FUNCTIONAL | dataService (Memory) | PostgreSQL | Data resets on server restart | Fetch from Prisma `Yacht` | High |
| **Dynamic yacht pages** | Page generation | PARTIALLY FUNCTIONAL | dataService (Memory) | PostgreSQL | Same as above | Fetch from Prisma `Yacht` | High |
| **Search and filters** | Client-side array filtering | MOCK IMPLEMENTATION | Local React State | API / Server Actions | Doesn't scale to large fleets | Move to Server Actions with DB queries | Medium |
| **Wishlist** | React Context | MOCK IMPLEMENTATION | localStorage | PostgreSQL | Lost if user changes devices | Create `User` model, link favorites | Low |
| **Compare** | React Context | MOCK IMPLEMENTATION | localStorage | Session / PostgreSQL | Lost if user changes devices | Keep in session or move to DB | Low |
| **Booking calendar** | Calendar UI component | MOCK IMPLEMENTATION | Hardcoded available slots | PostgreSQL | Dates don't reflect actual DB bookings | Fetch `TimeSlot` availability | Critical |
| **Availability** | Overlap check mechanism | MOCK IMPLEMENTATION | dataService (Memory) | PostgreSQL | Can double-book after restart | Server-side validation against `Booking` | Critical |
| **Dynamic pricing** | Client-side math formula | MOCK IMPLEMENTATION | Hardcoded in React | PostgreSQL (`Pricing` rules) | Vulnerable to client-side manipulation | Move pricing engine to Server Action | Critical |
| **Booking flow** | Multistep Wizard Form | PARTIALLY FUNCTIONAL | React State | React State / Redis | State lost on accidental page refresh | Use URL search params or Session | Medium |
| **Checkout** | Stripe Checkout API | PLACEHOLDER | API Route (Mock calculation) | Stripe API / PostgreSQL | Accepts client pricing, insecure webhooks | Secure webhook, validate price on server | Critical |
| **Authentication** | NextAuth | PLACEHOLDER | Hardcoded credentials | PostgreSQL | Admin login uses hardcoded `test@admin.com` | Connect NextAuth Prisma Adapter | Critical |
| **Admin dashboard** | Layout & KPI Stats | PARTIALLY FUNCTIONAL | dataService (Memory) | PostgreSQL | Stats are fake random numbers | Aggregate real DB metrics | Medium |
| **Fleet management** | CRUD Forms | MOCK IMPLEMENTATION | dataService (Memory) | PostgreSQL / S3 | Images aren't actually uploaded | Prisma CRUD + S3 Image upload | High |
| **Booking management**| CRUD SlideOvers | MOCK IMPLEMENTATION | dataService (Memory) | PostgreSQL | Status changes revert on restart | Prisma CRUD | High |
| **CRM** | Kanban Board | MOCK IMPLEMENTATION | dataService (Memory) | PostgreSQL | No CRM schema in Prisma yet | Add CRM fields to `Customer` | High |
| **Customers** | Profile viewer SlideOver | MOCK IMPLEMENTATION | dataService (Memory) | PostgreSQL | Notes & activities are transient | Update Prisma schema for Notes/Activities| High |
| **Payments** | `/admin/payments` | NOT IMPLEMENTED | None | Stripe / PostgreSQL | Missing UI and API | Build Payments view | Medium |
| **Analytics** | `/admin/analytics` | NOT IMPLEMENTED | None | Vercel Analytics / DB | Missing UI | Build Analytics view | Low |
| **AI Concierge** | Floating Widget | PLACEHOLDER | `setTimeout` simulation | OpenAI API | Hardcoded answers | Integrate LangChain/OpenAI API | Low |
| **WhatsApp** | `wa.me` Link | PLACEHOLDER | Static URL | Twilio API | Just a dumb link | Twilio integration if needed | Low |
| **Notifications** | Missing | NOT IMPLEMENTED | None | Resend / Twilio | No confirmation emails sent | Implement Resend email webhooks | High |

---

## 2. Database Audit (Prisma Schema)

**Current Status:** ✓ FULLY HARDENED (Phase 4 Ticket 1 Complete)

The `schema.prisma` file has been completely rewritten and successfully validated to support the entire production architecture, including all previously missing capabilities:

- **CRM:** `Customer` model expanded with `leadStatus` and `lifetimeValue`. Added `CustomerNote` and `CustomerActivity`.
- **Payments:** Added `PaymentTransaction` to explicitly track Stripe Intents, Session IDs, and Refund IDs.
- **Add-ons:** Added `AddOn` dictionary and `BookingAddOn` mapping table (freezing historical prices).
- **Concurrency:** Added `BookingHold` to temporarily reserve TimeSlots and prevent double bookings during checkout.
- **Pricing Engine:** Replaced basic pricing with a flexible `PricingRule` engine (Weekday vs Weekend, Hourly vs Flat).
- **Conversations:** Added `Conversation` and `Message` models in preparation for AI Concierge and WhatsApp integration.
- **Security:** Standardized all monetary values to `Decimal(10, 2)` and timestamps to `UTC`.

---

## 3. Security Audit

**Critical Vulnerabilities Identified:**

1. **Missing Route Protection (Edge):** There is no `middleware.ts` protecting `/admin/*` routes. Unauthenticated users who know the URL could potentially bypass the UI and hit the pages (though client components might crash, it's a security hole).
2. **Hardcoded Admin Credentials:** `src/app/api/auth/[...nextauth]/route.ts` contains a hardcoded email and password.
3. **Insecure Webhook Fallback:** In `api/webhooks/stripe/route.ts`, if `STRIPE_WEBHOOK_SECRET` is missing, it parses the JSON body directly without verifying the Stripe signature. This allows anyone to spoof successful payment payloads.
4. **Client-Side Pricing Trust:** The booking checkout flow relies on the client to pass the requested yacht and duration. The API route blindly calculates the price based on mock data. In production, the server MUST recalculate the exact price from the database before generating the Stripe session.

---

## 4. Recommended Implementation Order (Phase 4)

To smoothly transition from mock data to a production-ready system without breaking the UI, follow this sequence:

1. **Database Schema & Migrations**
   - Update `schema.prisma` with missing CRM, Payments, and Add-ons models.
   - Run `prisma db push` (or migrate) and generate the client.
2. **Security & Auth Infrastructure**
   - Implement `middleware.ts` to strictly protect `/admin`.
   - Connect NextAuth to the `AdminUser` Prisma model and remove hardcoded credentials.
3. **Core Data Layer Migration (Read-Only)**
   - Create a Prisma seeder script to populate the database with the current mock yachts.
   - Swap `dataService.getYachts()` and `dataService.getCustomers()` to fetch from Prisma instead of memory.
4. **Admin Dashboard (Write Operations)**
   - Update Server Actions (`createYacht`, `updateBookingStatus`, `updateCustomerStatus`) to mutate the Prisma database.
5. **Booking Engine & Stripe Security**
   - Refactor `/api/checkout` to pull live pricing from Prisma and securely validate amounts.
   - Enforce Stripe webhook signature validation and securely update `Booking` payment statuses in Prisma.
6. **Integrations**
   - Swap AI Concierge `setTimeout` with actual OpenAI API integration.
   - Implement Resend for email notifications on Booking creation.
