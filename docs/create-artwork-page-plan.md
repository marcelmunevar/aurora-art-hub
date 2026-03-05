## Plan: Create Artwork Submission Page

Add a protected create-artwork flow at `/protected/artworks/create` using the project’s existing client-form + Supabase pattern, then redirect successful submissions to `/protected/artworks`. The page will enforce auth on the server, submit from a client form, and respect current RLS by inserting `user_id` for the signed-in user.

**Steps**

1. Build a protected route wrapper page at `app/protected/artworks/create/page.tsx` that verifies session/claims with `createClient()` from `@/lib/supabase/server` and redirects unauthenticated users to `/auth/login`.
2. Create a reusable client form component at `components/create-artwork-form.tsx` with fields for `title`, `description`, and `is_public`, matching existing form conventions (`useState`, local error/loading states, submit handler).
3. In the form submit handler, use `createClient()` from `@/lib/supabase/client`, get authenticated user id (`auth.getUser()` or claims equivalent), and insert into `artworks` with `{ user_id, title, description, is_public }`.
4. Add robust UX states in the form: inline validation for required title, disabled submit while pending, Supabase error display, and success redirect to `/protected/artworks`.
5. Compose the wrapper page UI using existing `Card`/heading patterns and render `CreateArtworkForm` within the protected layout style.
6. Verify behavior against RLS expectations (owner-only insert, auth required) and route navigation.

**Relevant files**

- `c:\Users\Marce\Documents\git\aurora-art-hub\app\protected\artworks\create\page.tsx` — new protected route page with server-side auth guard and form mounting.
- `c:\Users\Marce\Documents\git\aurora-art-hub\components\create-artwork-form.tsx` — new client submit form and Supabase insert logic.
- `c:\Users\Marce\Documents\git\aurora-art-hub\lib\supabase\server.ts` — reuse existing server client pattern for auth guard.
- `c:\Users\Marce\Documents\git\aurora-art-hub\lib\supabase\client.ts` — reuse browser client for form submission.
- `c:\Users\Marce\Documents\git\aurora-art-hub\components\ui\input.tsx` — title/description inputs.
- `c:\Users\Marce\Documents\git\aurora-art-hub\components\ui\checkbox.tsx` — `is_public` toggle.
- `c:\Users\Marce\Documents\git\aurora-art-hub\components\ui\button.tsx` — submit action.
- `c:\Users\Marce\Documents\git\aurora-art-hub\components\ui\card.tsx` — form container styling consistent with app.

**Verification**

1. Open `/protected/artworks/create` while signed out: confirm redirect to `/auth/login`.
2. Open while signed in: confirm form renders with title, description, and visibility toggle.
3. Submit with empty title: confirm validation error and no insert call.
4. Submit valid artwork (private/public variants): confirm row inserted in Supabase with correct `user_id` and `is_public` value.
5. Confirm success redirects to `/protected/artworks`.
6. Run `npm run lint` and fix any TS/ESLint issues.

**Decisions**

- Included: route path `/protected/artworks/create`.
- Included: successful submit redirect to `/protected/artworks`.
- Included: client-side submit pattern to match existing repository forms.
- Excluded: implementing `/protected/artworks` list page itself (assumed existing or separate task).
- Excluded: schema or policy SQL changes.

**Further Considerations**

1. Description input style: Option A single-line `Input` (fast parity), Option B multiline `textarea` (better UX for art descriptions, recommended).
2. Insert security hardening: Option A rely on `user_id` from client user session (standard), Option B add server action later for stricter trust boundary.
3. Draft support: Option A publish-on-create only, Option B add `status` column in future for draft workflow.
