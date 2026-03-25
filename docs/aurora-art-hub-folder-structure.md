# Aurora Art Hub Updated Folder Structure

- `aurora-art-hub`
  - `app`
    - `layout.tsx`
    - `page.tsx` (homepage)
    - `search`
      - `page.tsx`
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
    - `ArtistForm.tsx` (for editing artist profile)

- `lib`
  - `supabase`
    - `client.ts`
    - `server.ts`
    - `middleware.ts`
  - `queries`
    - `art.ts`
    - `artists.ts`
  - `utils.ts`

- `types`
  - `art.ts`
  - `artist.ts`
  - `user.ts`
