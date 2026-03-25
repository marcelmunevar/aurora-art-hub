# Aurora Art Hub Recommended Folder Structure

This structure keeps the app simple by centralizing data access in `lib/queries/` and keeping all reusable UI in `components/`.

## Goals

- Keep `app/` focused on routes, layouts, and pages.
- Keep all components in `components/`, including shared domain components and page-level UI components.
- Keep Supabase access out of UI components by using `lib/queries/`.
- Keep auth-sensitive logic on the server.
- Keep both read and write operations in the `lib/queries/` layer for consistency.

## Recommended Structure

```text
aurora-art-hub/
  app/
    layout.tsx                        # Root layout
    page.tsx                          # Homepage
    globals.css

    art/
      page.tsx                        # All art page
      add/
        page.tsx                      # Add new art page
      [artSlug]/
        page.tsx                      # Public art detail page
        edit/
          page.tsx                    # Edit art page

    artist/
      page.tsx                        # All artists page
      [artistSlug]/
        page.tsx                      # Public artist profile page

    profile/
      page.tsx                        # Logged-in user's artist profile editor

    auth/
      confirm/
        route.ts
      error/
        page.tsx
      forgot-password/
        page.tsx
      login/
        page.tsx
      sign-up/
        page.tsx
      sign-up-success/
        page.tsx
      update-password/
        page.tsx

    protected/
      page.tsx                        # Example protected page

  components/
    art/
      ArtCard.tsx                     # Art preview card
      ArtGrid.tsx                     # Art list/grid renderer

    artist/
      ArtistForm.tsx                  # Artist edit form
      ArtistProfile.tsx               # Artist profile UI

    ui/                               # Reusable design-system primitives
      badge.tsx
      breadcrumbs.tsx
      button.tsx
      card.tsx
      checkbox.tsx
      dropdown-menu.tsx
      input.tsx
      label.tsx

    auth-button.tsx
    forgot-password-form.tsx
    login-form.tsx
    logout-button.tsx
    sign-up-form.tsx
    theme-switcher.tsx
    update-password-form.tsx

  lib/
    queries/
      art.ts                          # Read and write operations for art
      artist.ts                       # Read and write operations for artists
      errors.ts

    supabase/
      client.ts
      middleware.ts
      proxy.ts
      server.ts

    validation/                       # Optional: form/request validation schemas
      art.ts
      artist.ts

    utils.ts

  types/
    art.ts
    artist.ts
    user.ts

  docs/
    art-table.sql
    artist-profile-page.md
    artist-table.sql
    aurora-art-hub-folder-structure.md
```

## Boundary Rules

### `app/`

Use `app/` for route definitions, layouts, pages, and route handlers.

- Prefer server components by default.
- Add client components only when interactivity actually requires them.

### `components/`

Use `components/` for all components in the app.

- `components/ui/` should contain low-level primitives.
- `components/art/` and `components/artist/` should contain domain-specific components.
- Page-specific components can also live in `components/`.

### `lib/queries/`

Use `lib/queries/` as the server-side data layer for Supabase access.

- Pages and server components should consume query helpers instead of querying tables directly.
- Keep both reads and writes centralized so auth checks, error handling, and data rules stay consistent.
- UI components should not perform direct Supabase queries.

### `lib/validation/`

Use `lib/validation/` for form schemas and request validation.

- This keeps validation rules out of page files and components.
- This layer is optional, but useful as forms become more complex.

## Practical Guidance For This Repo

- `app/profile/page.tsx` should remain the authenticated owner-edit page.
- `app/artist/[artistSlug]/page.tsx` should remain the public artist profile page.
- All components belong in `components/`.
- Routing and page orchestration belong in `app/`.
- Reads and writes belong in `lib/queries/`.
- Validation belongs in `lib/validation/`.
