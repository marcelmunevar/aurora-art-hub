# Aurora Art Hub Updated Folder Structure (MVP + Art Management)

Here is an updated Aurora Art Hub folder structure with bullets. It is still MVP-friendly, but includes extra components needed for adding/editing art (modal, form, uploader, etc.).

- `aurora-art-hub`
  - `app`
    - `layout.tsx`
    - `page.tsx` (homepage)
    - `search`
      - `page.tsx`
    - `tags`
      - `page.tsx` (all tags)
      - `[tagSlug]`
        - `page.tsx` (tag results page)
    - `art`
      - `page.tsx` (all art page)
      - `add`
        - `page.tsx` (add new art page)
      - `[artSlug]`
        - `page.tsx` (public art page)
        - `edit`
          - `page.tsx` (edit art page)
    - `artist`
      - `page.tsx` (all artists page)
      - `[artistSlug]`
        - `page.tsx` (artist profile)
    - `profile`
      - `edit`
        - `page.tsx` (edit artist profile page — only accessible by logged-in user)

    - `about`
      - `page.tsx`

- `components`
  - `art`
    - `ArtCard.tsx` (art preview card used in grids)
    - `ArtGrid.tsx` (list of art)
    - `ArtPage.tsx` (art detail layout)
  - `artist`
    - `ArtistProfile.tsx`
    - `ArtistArtList.tsx` (list of art on profile page)
    - `ArtistForm.tsx` (for editing artist profile)
  - `art-form` (new section for managing art)
    - `AddArtButton.tsx` (optional, could link to /art/add)
    - `ArtForm.tsx`
    - `ArtImageUploader.tsx`
    - `TagSelector.tsx`
    - `DeleteArtButton.tsx`
  - `tags`
    - `TagList.tsx`
    - `TagBadge.tsx`
  - `layout`
    - `Navbar.tsx`
    - `Footer.tsx`
    - `Container.tsx`
  - `ui`
    - `Modal.tsx`
    - `Button.tsx`
    - `Input.tsx`
    - `Textarea.tsx`
    - `Loader.tsx`

- `lib`
  - `supabase`
    - `client.ts`
    - `server.ts`
    - `middleware.ts`
  - `queries`
    - `art.ts`
    - `artists.ts`
    - `tags.ts`
  - `utils.ts`

- `types`
  - `art.ts`
  - `artist.ts`
  - `tag.ts`
  - `user.ts`

- `public`
  - `images`

- `styles`
  - `globals.css`

## Example Flow With This Structure

Add art:

- `/art/add/page.tsx` (add new art page)
  - `ArtForm`
  - `slug` (should exist in art table for `/art/[artSlug]` routes)
  - `title` (exists in art table)
  - `description` (exists in art table)
  - `artist profile` (**Note:** art should be tied to `artist_id`, not directly to `user_id`)
  - `image uploader` (**Note:** art table is missing an image field, e.g. `image_url`)
  - `tag selector` (**Note:** art table is missing tags, consider a relation or array)
  - `Etsy link` (**Note:** art table is missing `etsy_link` field)
  - `Instagram link` (**Note:** art table is missing `instagram_link` field)

Edit art:

- `/art/[artSlug]/edit/page.tsx` (edit art page)
  - `ArtForm` (pre-filled)
  - `image uploader`
  - `tag selector`

Artist profile flow:

- `/profile/edit/page.tsx` (edit artist profile page)
  - `ArtistForm` (pre-filled)
  - Example fields:
    - `slug` (should exist in artist table for `/artist/[artistSlug]` routes)
    - `name` (should exist in artist table)
    - `bio` (should exist in artist table)
    - `avatar` (add `avatar_url` field to artist table)
    - `Etsy link` (add `etsy_link` field to artist table)
    - `Instagram link` (add `instagram_link` field to artist table)
    - `website` (add `website` field to artist table)
    - `location` (add `location` field to artist table)
  - **Note:** The artist table stores public profile data and links back to `auth.users` through `user_id`.
  - **Relationship:** one authenticated user maps to one artist profile.

Upload handled by:

- `ArtImageUploader`

After submit:

- art stored in Supabase
- image stored in Supabase Storage
