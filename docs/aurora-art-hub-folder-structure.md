# Aurora Art Hub Recommended Folder Structure

This structure keeps the app simple while making the boundaries between routing, reusable UI, data access, validation, and auth explicit.

## Goals

- Keep `app/` focused on routes, layouts, server components, and route-local UI.
- Keep `components/` for shared UI used across multiple routes.
- Keep Supabase access out of UI components by using `lib/queries/`.
- Keep auth-sensitive logic on the server.
- Separate read logic from write logic before forms and mutations spread across the app.

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
      ArtCard.tsx                     # Shared art preview card
      ArtGrid.tsx                     # Shared list/grid renderer for art

    artist/
      ArtistForm.tsx                  # Shared artist edit form
      ArtistProfile.tsx               # Shared public artist profile UI

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
      art.ts                          # Read operations for art
      artists.ts                      # Read operations for artists
      errors.ts

    supabase/
      client.ts
      middleware.ts
      proxy.ts
      server.ts

    validation/                       # Recommended: Zod or similar schemas for forms
      art.ts
      artist.ts
      auth.ts

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

Use `app/` for route definitions, layouts, pages, route handlers.

- Prefer server components by default.
- Add client components only when interactivity actually requires them.

### `components/`

- `components/ui/` should contain low-level primitives.
- `components/art/` and `components/artist/`.

### `lib/queries/`

Use `lib/queries/` as the read layer for Supabase data access.

- Pages and server components should consume query helpers instead of querying tables directly.
- Keep query logic centralized so sorting, filtering, and error handling stay consistent.

### `app/**/actions.ts` or a future `lib/actions/`

Use server actions for create, update, and delete flows.

- For this app, colocated `actions.ts` files near the route are the simplest choice.
- If write logic becomes heavily shared across routes, then introduce a `lib/actions/` layer later.

### `lib/validation/`

Use `lib/validation/` for form schemas and request validation.

- This keeps validation rules out of page files and components.
- It also makes server actions easier to test and reuse.

## Naming Notes

- Keeping the public route as `artist/` is reasonable because it reads well in URLs.
- Keeping the query file as `artists.ts` is also fine because it represents collection-oriented data access.
- The important part is consistency: route naming and data-layer naming can differ slightly as long as the intent stays clear.

## Practical Guidance For This Repo

- `app/profile/page.tsx` should remain the authenticated owner-edit page.
- `app/artist/[artistSlug]/page.tsx` should remain the public artist profile page.
- Shared cards, grids, and profile display components belong in `components/`.
- Page-specific composition and auth-aware orchestration belong in `app/`.
- Reads belong in `lib/queries/`.
- Validation should move into `lib/validation/` as forms expand.
- Writes should be handled by server actions rather than inline page logic.
