# Aurora Art Hub Recommended Folder Structure

This structure keeps the app simple by centralizing data access in `lib/queries/`, keeping `app/` focused on routes, and reserving `components/` for shared UI and domain building blocks.

## Goals

- Keep `app/` focused on routes, layouts, pages, and route handlers.
- Keep domain-specific UI components in `components/` instead of route-local folders.
- Keep `components/` dedicated to shared auth components, reusable UI primitives, and domain components.
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
      edit/
        page.tsx                      # Logged-in artist profile editor
      [artistSlug]/
        page.tsx                      # Public artist profile page

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

Use `app/` for route definitions, layouts, pages, and route handlers.

- Prefer server components by default.
- Add client components only when interactivity actually requires them.
- Avoid placing local component folders inside `app/`; keep feature UI in `components/` instead.

### `components/`

Use `components/` for shared auth-related components, reusable UI pieces, and domain-specific view components.

- `components/ui/` should contain low-level primitives.
- Shared auth flows such as login, sign-up, logout, and password reset forms belong here.
- Domain-specific components such as art cards, artist details, and link previews should also live here in clear subfolders.

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

- `app/artist/edit/page.tsx` should remain the authenticated owner-edit page.
- `app/artist/[artistSlug]/page.tsx` should remain the public artist profile page.
- Route-specific art and artist pages should import their UI from `components/`.
- Shared auth and design-system components should live in `components/`.
- Routing and page orchestration belong in `app/`.
- Reads and writes belong in `lib/queries/`.
- Validation belongs in `lib/validation/`.
