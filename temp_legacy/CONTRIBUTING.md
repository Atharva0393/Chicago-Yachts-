# Contributing — BookLuxuryYacht 2.0

## Branch strategy

We use a lightweight **GitHub Flow**, chosen specifically because it pairs well with
Vercel's automatic per-PR preview deployments — no long-lived `develop` branch needed.

| Branch | Purpose | Deploys to |
|---|---|---|
| `main` | Production. Protected — no direct pushes. | Vercel **Production** (frontend) + production API |
| `staging` | Pre-prod integration branch. Merge here first. | Staging Vercel environment + staging API |
| `feature/<short-name>` | New functionality | Automatic Vercel **Preview** URL per PR |
| `fix/<short-name>` | Bug fixes | Automatic Vercel **Preview** URL per PR |

### Day-to-day flow

1. Branch off `staging`:
   ```bash
   git checkout staging
   git pull
   git checkout -b feature/your-thing
   ```
2. Commit, push, open a PR **into `staging`**. Vercel comments the PR with a live
   preview URL — use it to review the actual change, not just the diff.
3. Once `staging` has accumulated verified changes, open a PR **`staging` → `main`**.
   Merging to `main` triggers the production deploy.

### Branch protection (set on GitHub → Settings → Branches)

- `main`: require a PR + 1 approval, require the build/lint check to pass, no force-push,
  no direct pushes.
- `staging`: require the build check to pass; direct pushes are fine for a small team.

## Running the project locally

Both halves must run together — the frontend has no mock data left.

```bash
# terminal 1 — api/
cd api
npm install
npx prisma migrate dev
npm run seed
npm run start:dev          # http://localhost:4000

# terminal 2 — repo root
npm install
npm run dev                 # http://localhost:3000
```

Copy `.env.example` → `.env.local` (root) and `api/.env.example` → `api/.env` before
starting — see each file for what's required.

## Before opening a PR

```bash
npm run lint && npm run build          # repo root
cd api && npm run build                # api/
```

## Commit style

Short, imperative subject line (`Add owner listing edit form`, not `Added` or `Adding`).
Body explains *why* when it's not obvious from the diff.
