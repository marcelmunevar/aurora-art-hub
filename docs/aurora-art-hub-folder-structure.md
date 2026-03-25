# Aurora Art Hub Recommended Folder Structure

This structure keeps the app simple by centralizing data access in `lib/queries/`, using route-local component folders for domain pages, and reserving `components/` for shared auth and UI building blocks.

## Goals

- Keep `app/` focused on routes, layouts, pages, and route-local domain components.
- Keep domain-specific components close to the routes that use them.
- Keep `components/` dedicated to shared auth components and reusable UI primitives.
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
      _components/                    # Art-only route components
      add/
        page.tsx                      # Add new art page
      [artSlug]/
        page.tsx                      # Public art detail page
        edit/
          page.tsx                    # Edit art page

    artist/
      page.tsx                        # All artists page
      _components/                    # Artist-only route components
      [artistSlug]/
        page.tsx                      # Public artist profile page

    profile/
      page.tsx                        # Logged-in user's artist profile editor
      _components/                    # Profile-only route components

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
    auth-button.tsx
    env-var-warning.tsx
    forgot-password-form.tsx
    login-form.tsx
    logout-button.tsx
    sign-up-form.tsx
    theme-switcher.tsx
    update-password-form.tsx

    ui/                               # Reusable design-system primitives
      badge.tsx
      breadcrumbs.tsx
      button.tsx
      card.tsx
      checkbox.tsx
      dropdown-menu.tsx
      input.tsx
      label.tsx

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

Use `app/` for route definitions, layouts, pages, route handlers, and route-local domain components.

- Prefer server components by default.
- Add client components only when interactivity actually requires them.
- Put feature-specific UI in nearby `_components/` folders when it is only used by a single route area such as `art/`, `artist/`, or `profile/`.

### `components/`

Use `components/` only for shared auth-related components and reusable UI pieces.

- `components/ui/` should contain low-level primitives.
- Shared auth flows such as login, sign-up, logout, and password reset forms belong here.
- Avoid placing art-, artist-, or profile-specific page components here if they are only used in one route group.

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
- Route-specific art, artist, and profile UI should live in local `_components/` folders under `app/`.
- Shared auth and design-system components should live in `components/`.
- Routing and page orchestration belong in `app/`.
- Reads and writes belong in `lib/queries/`.
- Validation belongs in `lib/validation/`.
