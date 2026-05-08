# Aurora Art Hub

Aurora Art Hub is a Next.js + Supabase application for showcasing artwork and managing artist profiles.

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Supabase (auth + database)
- Tailwind CSS + shadcn/ui patterns
- Zod validation

## Core Features

- Public art browsing and detail pages
- Public artist profiles
- Authenticated artist profile editing
- Authenticated art creation and editing
- Image upload support
- Role-aware public/private art visibility

## Project Structure

- app/: Routes, layouts, and page orchestration
- components/: Reusable UI and domain components
- lib/queries/: Server-side data access
- lib/validation/: Request and form schemas
- types/: Shared domain types
- docs/: SQL and product documentation

See [docs/aurora-art-hub-folder-structure.md](docs/aurora-art-hub-folder-structure.md) for architecture guidance.

## Local Development

1. Install dependencies.

```bash
npm install
```

2. Create `.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

3. Run the app.

```bash
npm run dev
```

4. Open http://localhost:3000.

## Scripts

- `npm run dev`: Start local development server
- `npm run build`: Build production app
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Notes

- SQL setup references live in [docs/art-table.sql](docs/art-table.sql), [docs/artist-table.sql](docs/artist-table.sql), and migration companion files.
- Bucket policy helpers are documented in [docs/bucket-policies.sql](docs/bucket-policies.sql).
