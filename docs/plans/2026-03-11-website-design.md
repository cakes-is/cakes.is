# BeibíCakes Website Design

**Date:** 2026-03-11
**Domain:** cakes.is
**Status:** Approved

## Overview

A website for BeibíCakes, a custom cake business in Iceland. The site showcases cakes in a gallery, accepts orders via a contact form, and is managed entirely through Google Sheets by a non-technical user.

## Architecture

```
Sister (Google Sheets) ──→ Google Sheets API ──→ Next.js (Vercel) ──→ Visitors
                                                       │
                                                       ├─ Order form → Resend (email) + Google Sheets (log)
                                                       └─ Images → Cloudinary CDN
```

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **CMS:** Google Sheets via `google-spreadsheet` npm package
- **Image hosting:** Cloudinary (free tier — 25GB storage, 25GB bandwidth)
- **Email:** Resend (free tier — 100 emails/day)
- **Hosting:** Vercel (free tier — 100GB bandwidth/mo)
- **Language:** Icelandic content, English code/routes
- **i18n:** `next-intl` ready for future English support

**Monthly cost: $0** (domain is the only cost)

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Hero, featured cakes, CTA |
| `/cakes` | Gallery grid — filterable by category |
| `/order` | Order/contact form |
| `/about` | About the baker (sheet-driven) |

All routes use English paths. All visible content is Icelandic.

## Data Model — Google Sheets

### Sheet: "Cakes"

| Column | Type | Description |
|--------|------|-------------|
| name | string | Cake name (Icelandic) |
| description | string | Short description |
| price | string | Price range in ISK, e.g. "8.000 - 12.000 kr." |
| image_url | string | Cloudinary URL |
| category | string | e.g. Afmæli, Brúðkaup, Skírn, Annað |
| featured | boolean | Show on homepage |
| published | boolean | Visible on site (draft toggle) |

### Sheet: "Orders"

Auto-populated by form submissions.

| Column | Type | Description |
|--------|------|-------------|
| date | datetime | Submission timestamp |
| name | string | Customer name |
| email | string | Customer email |
| phone | string | Customer phone |
| event_date | string | When they need the cake |
| cake_type | string | What kind of cake |
| message | string | Free text details |
| status | string | Manual: Nýtt / Samþykkt / Tilbúið |

### Sheet: "About"

Simple key-value sheet for about page content.

| Column | Type | Description |
|--------|------|-------------|
| key | string | Content identifier |
| value | string | Content text |

## Data Flow

### Gallery (read)
1. Visitor requests `/cakes`
2. Next.js ISR serves cached page (revalidates every 5 minutes)
3. On revalidation: server reads "Cakes" sheet via service account
4. Filters by `published === true`, renders grid

### Order form (write)
1. Visitor fills form on `/order`
2. Next.js Server Action validates input
3. Parallel: sends email via Resend to `orders@cakes.is` AND appends row to "Orders" sheet
4. Returns success/error to visitor

## External Services Setup

### Google Cloud (free)
- Create project in Google Cloud Console
- Enable Google Sheets API
- Create service account, download JSON key
- Share sheets with service account email (Editor for Orders, Viewer for Cakes)

### Cloudinary (free tier)
- Create account at cloudinary.com
- Sister uploads images via web UI
- Copy URL into Google Sheet

### Resend (free tier)
- Create account, verify `cakes.is` domain
- Generate API key
- Sends from `orders@cakes.is` (or `noreply@cakes.is`)

### Vercel (free tier)
- Connect GitHub repo
- Set environment variables
- Auto-deploys on push to `main`

## Environment Variables

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
RESEND_API_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

## Release Strategy

- **Conventional Commits:** `feat:`, `fix:`, `chore:`, `docs:`
- **Git tags** for releases: `v1.0.0`, `v1.1.0`, etc.
- Vercel auto-deploys from `main` — push = live
- No CI/CD pipeline needed beyond Vercel's built-in

## Future Extensibility

- **i18n:** Add English locale with `next-intl` (routes already English)
- **Instagram feed:** Pull recent posts via Instagram Basic Display API
- **Reviews/testimonials:** New sheet tab, new page
- **Online payment:** Integrate with local payment provider (e.g. Valitor, Rapyd)
- **Blog:** New sheet tab for posts, `/blog` route
