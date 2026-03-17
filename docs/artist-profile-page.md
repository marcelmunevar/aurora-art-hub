# Artist Profile Page Documentation

## Purpose
Displays an individual artist’s profile, their bio, social links, and a list of their artworks. If the logged-in user is the artist, provides art management tools (add, edit, delete).

## Route
`/artist/[artistSlug]`

## Features

### 1. Artist Information
- Profile Picture (optional for MVP)
- Name
- Bio/About Section
- Social Links
  - Instagram
  - Etsy
  - Other (optional)

### 2. Artworks List
- Uses `ArtistArtList` and `ArtCard` components
- Grid or list layout of all artworks by the artist
- Each artwork card shows:
  - Image
  - Title
  - Tags
  - Link to artwork detail page

### 3. Art Management (if owner)
- Add Art Button
  - Opens `AddArtModal` with `ArtForm`
- Edit Art Button (on each artwork card)
  - Opens `EditArtModal` with pre-filled `ArtForm`
- Delete Art Button (on each artwork card)
  - Confirmation modal before deletion

### 4. Responsive Design
- Works on desktop and mobile
- Grid adapts to screen size

### 5. Error Handling
- If artist not found: show error message or 404
- If no artworks: show “No artworks yet” message

### 6. Loading States
- Show loader while fetching artist or artworks

## Components Used
- `ArtistProfile` (main profile info)
- `ArtistArtList` (artworks grid)
- `AddArtButton`, `AddArtModal`, `EditArtModal`, `DeleteArtButton`
- `ArtForm`, `ArtCard`
- `TagBadge` (for tags)
- `Navbar`, `Footer`, `Container`

## Data Fetching
- Fetch artist info and artworks from Supabase
- Check if logged-in user matches artist for management tools

## Example Layout

-------------------------------------------------
| Navbar                                        |
-------------------------------------------------
| Profile Picture | Name | Bio | Social Links    |
-------------------------------------------------
| [Add Art Button] (if owner)                   |
-------------------------------------------------
| Artworks Grid                                |
| [ArtCard] [Edit] [Delete] (if owner)         |
-------------------------------------------------
| Footer                                        |
-------------------------------------------------

---

This page is central for artists to showcase their work and manage their portfolio. All management actions are gated by ownership checks.
