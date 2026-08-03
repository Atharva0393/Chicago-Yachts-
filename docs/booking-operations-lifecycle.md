# Chicago Yachts - Booking Operations Lifecycle

## 1. Lifecycle Overview

The booking lifecycle in Chicago Yachts is an operational state machine running strictly on PostgreSQL. Transitions are enforced server-side via the `bookingLifecycleService` using Prisma Transactions.

### Valid States (BookingStatus Enum)
- `PENDING`: Initial state when booking is held or awaiting payment.
- `CONFIRMED`: Financial deposit is secured. Core pre-charter state.
- `IN_PROGRESS`: Operational state for the day of the charter.
- `COMPLETED`: Terminal state. Charter finished successfully.
- `CANCELLED`: Terminal state. Charter abandoned or cancelled.

## 2. Server-Side Enforcement (Prisma Transactions)

All lifecycle transitions flow through the `updateBookingStatus` method in the `BookingLifecycleService`.

### Strict Rule Enforcement
- **Terminal States**: Once `COMPLETED` or `CANCELLED`, the booking cannot be reverted or transitioned to another state.
- **Inventory Integrity**:
  - When transitioning to `CANCELLED`, a Prisma Transaction is strictly executed to update the `Booking` state AND release the associated `TimeSlot` (`bookingId = null`, `status = AVAILABLE` if applicable based on `isBlocked`).
  - This ensures that if a booking is cancelled, the inventory is atomically released back into the booking pool.

## 3. CustomerActivity & Audit Trail

The operational integrity of the booking relies on an immutable audit trail.
- We reuse the `CustomerActivity` model.
- New types added: `STATUS_CHANGED`, `BOOKING_COMPLETED`, `NOTE_ADDED`.
- **System or Admin Logging**: When an Admin clicks "Cancel Booking" or "Change to In Progress", a `STATUS_CHANGED` activity is strictly created containing `{ previousStatus, newStatus, reason }`.

## 4. Internal Operational Notes

Staff can add operational notes that are strictly internal (not visible to customers):
- Managed via `addBookingNote` in `BookingLifecycleService`.
- Triggers a `NOTE_ADDED` `CustomerActivity`.
- Rendered in a dedicated Timeline in the Admin Slide-Over.

## 5. Operations Calendar (/admin/calendar)

The Operations Calendar visualizes the operational schedule.
- Fetching strictly relies on PostgreSQL `startDateTime`.
- Timezone operations enforce `America/Chicago` strictly via `date-fns-tz` to ensure multi-time-zone admins see local Chicago operating schedules.
- Clicking an event opens the detailed `BookingDetails` Slide-Over which facilitates lifecycle operations natively.
