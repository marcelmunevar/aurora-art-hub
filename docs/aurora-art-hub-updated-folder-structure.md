# Aurora Art Hub Updated Folder Structure (MVP + Artwork Management)

Here is an updated Aurora Art Hub folder structure with bullets. It is still MVP-friendly, but includes extra components needed for adding/editing artwork (modal, form, uploader, etc.).

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
        - `page.tsx` (public artwork page)
    - `artist`
      - `[artistSlug]`
        - `page.tsx` (artist profile + artwork management if owner)

    - `about`
      - `page.tsx`

- `components`
  - `artwork`
    - `ArtworkCard.tsx` (art preview card used in grids)
    - `ArtworkGrid.tsx` (list of artworks)
    - `ArtworkPage.tsx` (artwork detail layout)
  - `artist`
    - `ArtistProfile.tsx`
    - `ArtistArtworkList.tsx` (list of artworks on profile page)
  - `artwork-form` (new section for managing artworks)
    - `AddArtworkButton.tsx`
    - `AddArtworkModal.tsx`
    - `EditArtworkModal.tsx`
    - `ArtworkForm.tsx`
    - `ArtworkImageUploader.tsx`
    - `TagSelector.tsx`
    - `DeleteArtworkButton.tsx`
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
    - `artworks.ts`
    - `artists.ts`
    - `tags.ts`
  - `utils.ts`

- `types`
  - `artwork.ts`
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

- `AddArtworkButton`

Click opens:

- `AddArtworkModal`

Inside modal:

- `ArtworkForm`
- `title`
- `description`
- `image uploader`
- `tag selector`
- `Etsy link`
- `Instagram link`

Upload handled by:

- `ArtworkImageUploader`

After submit:

- artwork stored in Supabase
- image stored in Supabase Storage
