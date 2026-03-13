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
      - `[artSlug]`
        - `page.tsx` (public art page)
    - `artist`
      - `[artistSlug]`
        - `page.tsx` (artist profile + art management if owner)

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
  - `art-form` (new section for managing art)
    - `AddArtButton.tsx`
    - `AddArtModal.tsx`
    - `EditArtModal.tsx`
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

- `public`
  - `images`

- `styles`
  - `globals.css`

## Example Flow With This Structure

Artist goes to:

- `/artist/jane-doe`

If they own the profile, they see:

- `AddArtButton`

Click opens:

- `AddArtModal`

Inside modal:

- `ArtForm`
- `title`
- `description`
- `image uploader`
- `tag selector`
- `Etsy link`
- `Instagram link`

Upload handled by:

- `ArtImageUploader`

After submit:

- art stored in Supabase
- image stored in Supabase Storage
