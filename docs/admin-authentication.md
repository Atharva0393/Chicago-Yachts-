# Admin Authentication & Authorization

This document outlines the security architecture for the Admin portal of Chicago Yachts.

## Authentication Architecture

The system uses NextAuth (v4) configured with a custom CredentialsProvider, connected to Prisma PostgreSQL. 

- **Session Strategy:** JWT
- **Password Hashing:** `bcryptjs`
- **Database Model:** `AdminUser`

### AdminUser Flow

1. **Bootstrap**: The first `AdminUser` is created securely via `scripts/create-admin.ts`.
2. **Login**: Admins authenticate at `/login`.
3. **Session**: On successful authentication, NextAuth creates a JWT session including the user's ID, Email, Name, and Role.
4. **Expiration**: Sessions are configured to expire after 30 days.

## Route Protection & Authorization

### Middleware

Next.js middleware (`src/middleware.ts`) protects all routes starting with `/admin/`. Unauthenticated users are redirected to `/login`.

### Server-Side Layout Protection

As a defense-in-depth measure, the root Admin layout (`src/app/admin/layout.tsx`) is a Server Component that also fetches the session using `getServerSession()`. If the session is missing or the user role is not authorized (`SUPER_ADMIN`, `ADMIN`, or `MANAGER`), they are redirected to `/login`.

### Centralized Authorization Helper

A reusable server-only helper function is located at `src/lib/auth-server.ts`:

```typescript
import { requireAdmin } from "@/lib/auth-server";

// Inside a Server Action or API Route
const session = await requireAdmin();
```

## Fleet Mutation Protection

All sensitive fleet mutations in `src/actions/fleet.ts` invoke `await requireAdmin();` before interacting with Prisma. This guarantees that no unauthenticated or unauthorized users can create, update, or delete yachts.

### Role Foundation

Current active roles:
- `SUPER_ADMIN`
- `ADMIN`
- `MANAGER`

Currently, all three roles have write access to the Fleet. Future iteration may restrict deletion or specific updates to `SUPER_ADMIN` and `ADMIN` only.

## Security Practices

- **No Hardcoded Credentials**: Mock credentials (`admin@chicagoyachts.com`) have been fully purged from the application logic.
- **CSRF & Cookie Security**: NextAuth handles secure cookies and CSRF validation automatically.
- **Error Disclosure**: Login failures throw generic "Invalid email or password" to prevent user enumeration.
- **Password Constraints**: The bootstrap script enforces a minimum 12-character length for new admin passwords.

## Deployment Environment Variables

The following environment variables are strictly required in the production environment:

- `NEXTAUTH_URL`: The canonical URL of the application.
- `NEXTAUTH_SECRET`: A secure, randomly generated string for JWT signing and session encryption.
- `DATABASE_URL`: Prisma connection string for the Supabase PostgreSQL instance.
- `DIRECT_URL`: Prisma direct connection string for migrations.
