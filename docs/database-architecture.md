# Database Architecture & Conventions

This document outlines the core architecture of the Chicago Yachts PostgreSQL database (via Prisma).

## 1. Money Convention
**CRITICAL:** All monetary values in the database are stored as `Decimal(10, 2)`.
- Never use `Float` for money.
- Currency is implicitly USD unless explicitly defined otherwise in specific tables (e.g. `PaymentTransaction.currency`).

## 2. Timezone Convention
**CRITICAL:** The database strictly stores all timestamps in **UTC** (`@db.Timestamptz` or `DateTime`).
- Application-level business logic and UI presentation must handle the conversion to/from `America/Chicago`.
- `startDateTime` and `endDateTime` in `Booking` and `BookingHold` are stored as absolute UTC time.

## 3. Core Models & Relationships

### Yacht Fleet
- **`Yacht`**: The central entity representing a vessel. Contains metadata (`capacity`, `length`, `location`) and configuration (`isActive`, `instantBook`). Uses a unique `slug` for URLs.
- **`YachtImage`**: Ordered images belonging to a Yacht (`sortOrder`, `isPrimary`).
- **`Amenity` & `YachtAmenity`**: Normalized architecture for amenities. `Amenity` holds the dictionary of possible features, and `YachtAmenity` maps them to specific yachts.

### Pricing Strategy
- **`PricingRule`**: The server-authoritative pricing engine. Replaces hardcoded frontend logic.
  - Supports combinations of `DayType` (e.g., `WEEKDAY`, `WEEKEND`) and `TimePeriod` (e.g., `MORNING`, `FULL_DAY`).
  - Supports base prices and hourly rates, constrained by `minDuration` and `maxDuration`.
  - Date ranges (`effectiveFrom`, `effectiveTo`) allow for future seasonal pricing without schema changes. Priority field resolves overlapping rules.

### Availability Strategy
- **`Availability`**: Represents a specific Date for a Yacht. Can block out the entire day (`isBlocked: true`).
- **`TimeSlot`**: Granular blocks of time within an `Availability` date. Contains a `startTime` and `endTime` (time-only representation). Can be linked to a `Booking` or a `BookingHold`.

### Booking Lifecycle
- **`BookingHold`**: Resolves the concurrency issue of two users attempting to checkout simultaneously.
  - Lifecycle: `ACTIVE` → `CONVERTED` (if paid) OR `EXPIRED` (if timeout reached).
  - Holds are linked to specific `TimeSlot`s preventing others from booking them.
- **`Booking`**: The final confirmed reservation.
  - Contains detailed financial breakdowns (`subtotal`, `taxAmount`, `serviceFee`, `addOnTotal`, `discountAmount`, `totalAmount`).
  - Has explicit `bookingStatus` and `paymentStatus`.

### Payment Strategy
- **`PaymentTransaction`**: Maintains an immutable ledger of transactions.
  - Supports `StripeSessionId`, `StripePaymentIntentId`, `StripeChargeId`, `StripeRefundId`.
  - Types: `DEPOSIT`, `BALANCE`, `FULL_PAYMENT`, `REFUND`.
  - Links to a single `Booking`.

### CRM Architecture
- **`Customer`**: Enhanced with CRM fields like `leadStatus`, `source`, `lifetimeValue`.
- **`CustomerNote`**: Manual notes written by Admin users.
- **`CustomerActivity`**: System-generated events (`ActivityType`) to build an audit trail and timeline (e.g., `BOOKING_CREATED`, `PAYMENT_RECEIVED`, `WHATSAPP_MESSAGE`).

### Conversations (Future-Proofing)
- **`Conversation`** & **`Message`**: Architected to support multi-channel (`WEBSITE`, `WHATSAPP`) chats between `CUSTOMER`, `ADMIN`, and `AI`.

### Add-Ons
- **`AddOn`**: Master dictionary of available extras (e.g., Jet Ski, Catering).
- **`BookingAddOn`**: Captures the selection for a specific booking and **freezes the `priceAtTime`**, ensuring historical bookings are immune to future price changes.
