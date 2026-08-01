# PostgreSQL Database Setup & Provisioning Guide

This guide details how to configure the Chicago Yachts application for a real PostgreSQL database, manage migrations, and prepare for deployment.

## 1. Environment Variables

Your `.env` or `.env.local` file MUST contain the following variables to connect to a real database. 

**CRITICAL RULE:** Never commit `.env`, `.env.local`, or `.env.production` to Git. Only `.env.example` should be committed.

```env
# The pooled connection string for runtime queries (e.g., PgBouncer)
DATABASE_URL="postgres://user:password@host:6543/db?pgbouncer=true"

# The direct connection string for Prisma migrations
DIRECT_URL="postgres://user:password@host:5432/db"
```

## 2. Generating the Prisma Client

Any time the `schema.prisma` is modified, or after cloning the repository, you must generate the Prisma client so TypeScript understands your schema:

```bash
npm run db:generate
```

## 3. Migration Workflow

We use a strict migration workflow. Never use `prisma db push` in production.

### Local Development
When you make a change to `schema.prisma` locally:
```bash
# This creates a migration file, applies it, and regenerates the client
npm run db:migrate 
```

### Production Deployment
When deploying to staging or production, the CI/CD pipeline should run:
```bash
# This applies pending migrations to the database without resetting data
npm run db:deploy
```

## 4. Verifying Database Connectivity

You can safely check if the application is successfully connected to the database by navigating to:
```
GET /api/health/db
```
This server-only endpoint performs a lightweight query and returns `{"database": "connected"}` if successful. It intentionally hides all stack traces and credentials for security.

## 5. Using Prisma Studio Safely

Prisma provides a visual database editor. To use it locally:
```bash
npm run db:studio
```
> [!WARNING]
> Never expose Prisma Studio to the public internet on a production server. Always run it via a secure local tunnel or directly on your local machine pointing to the remote DB.

## 6. Netlify Deployment Strategy

When deploying this Next.js App Router application to Netlify with a PostgreSQL database, keep the following in mind:

1. **Environment Variables:** Both `DATABASE_URL` and `DIRECT_URL` must be added to the Netlify environment variables configuration.
2. **Build Command:** The Netlify build command should ensure Prisma generates the client before Next.js builds the app:
   ```bash
   npm run db:generate && npm run build
   ```
3. **Migration Strategy:** Do NOT run `npm run db:migrate` in the Netlify build. Use `npm run db:deploy` instead, or run it manually from a local machine connected to the production database via `DIRECT_URL`.
4. **Connection Pooling (Serverless):** Netlify edge/serverless functions spin up and down rapidly. If you connect directly to PostgreSQL on every invocation, you will exhaust connections quickly. You MUST use a connection pooler (like Supabase's IPv4 PgBouncer proxy or Neon's connection pooler) for `DATABASE_URL`. Ensure `?pgbouncer=true` is appended to the connection string if using PgBouncer.
