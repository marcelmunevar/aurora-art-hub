# Aurora Art Hub 🎨

A modern React platform for digital artists to showcase their work and drive sales on platforms like **Redbubble** (now) and **Amazon Merch on Demand** (later).

It starts as a beautiful gallery for your wife’s art and is designed to scale into a **multi-artist platform** with profiles, analytics, and product links.

---

## ✨ Features (MVP)

- 🖼 **Artwork Gallery** – Responsive grid of digital art
- 👩‍🎨 **Artist Profile Page** – Bio, avatar, links, and featured work
- 🔗 **Redbubble Integration (manual)**
  - Attach one or more Redbubble product links to each artwork
  - Show “Buy on Redbubble” buttons under each piece
- ⭐ **Favorites** – Local favorites using Zustand
- 🔎 **Filters & Categories** – Browse by category/tag (portraits, fantasy, etc.)
- 🌗 **Modern UI** – Tailwind + shadcn/ui components for a clean, accessible design
- 📄 **Static JSON Content (MVP)** – Art and artist data stored in `src/data` for fast start
- ☁️ **Cloud Image Hosting** – Artwork stored in Cloudinary or Supabase Storage

Planned later:

- 👥 Multi-artist support (public profiles, sign-up, dashboards)
- 🛒 Amazon Merch on Demand product links
- 📈 Analytics (views, outbound click tracking)
- 💳 Monetization (Stripe, etc.)
- 📝 Optional CMS integration for blogs or marketing content

---

## 🧱 Tech Stack

**Frontend**

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Router](https://tanstack.com/router/latest) – App routing
- [TanStack Query](https://tanstack.com/query/latest) – Server state & caching
- [Zustand](https://zustand-demo.pmnd.rs/) – Client state (favorites, UI)
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) – Headless + Tailwind-based UI components
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) – Forms & schema validation

**Backend (future)**

- Start simple (static JSON or Supabase), then move toward:
  - Supabase / Postgres for data (artists, artworks, product links)
  - Cloudinary / Supabase Storage for image hosting

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/aurora-art-hub.git
cd aurora-art-hub
```
