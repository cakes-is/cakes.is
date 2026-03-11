# Implementation Plan — BeibíCakes Website

**Design:** [2026-03-11-website-design.md](./2026-03-11-website-design.md)

## Phase 1: Project Scaffold

### 1.1 Initialize Next.js project

- `create-next-app` with App Router, TypeScript, Tailwind, ESLint
- Remove boilerplate (default page, icons, styles)
- Configure `next.config.ts` (image domains: Cloudinary)
- Add `.env.example` with all required env vars documented

### 1.2 Configure tooling

- `.nvmrc` with Node version
- Prettier config (consistent formatting)
- ESLint config (extend Next.js defaults)
- `.gitignore` (ensure `.env.local` excluded)

### 1.3 Configure Tailwind theme

- Define color palette (warm, bakery-appropriate)
- Define typography scale (serif headings, clean body)
- Add custom fonts (Google Fonts — something elegant)

**Commit:** `feat: initialize Next.js project with tooling`

## Phase 2: Google Sheets Integration

### 2.1 Sheets client library

- `lib/sheets.ts` — service account auth, sheet reading
- `lib/types.ts` — Cake, Order, AboutContent types
- Helper to filter by `published === true`
- Error handling for API failures (graceful fallback)

### 2.2 Order submission

- `lib/orders.ts` — append row to Orders sheet
- Server Action for form submission
- Input validation (Zod schema)

**Commit:** `feat: add Google Sheets integration layer`

## Phase 3: Email Integration

### 3.1 Resend setup

- `lib/email.ts` — send order notification
- Email template (plain text + simple HTML)
- Send to `orders@cakes.is` with customer details

**Commit:** `feat: add Resend email integration`

## Phase 4: Layout & Shared Components

### 4.1 Root layout

- `app/layout.tsx` — HTML lang="is", meta tags, fonts
- Navigation header (logo, links)
- Footer (Instagram link, copyright, contact info)

### 4.2 Shared components

- `CakeCard` — image, name, price, description preview
- `SectionHeading` — consistent heading style
- `Container` — max-width wrapper
- `Button` — primary/secondary variants

**Commit:** `feat: add layout and shared components`

## Phase 5: Pages

### 5.1 Homepage (`/`)

- Hero section with tagline and CTA
- Featured cakes grid (from sheet, `featured === true`)
- Brief about section
- CTA to order

### 5.2 Gallery (`/cakes`)

- Full cake grid with category filter
- Click to expand (modal or detail view)
- ISR with 5-minute revalidation

### 5.3 Order form (`/order`)

- Form fields: name, email, phone, event date, cake type, message
- Client-side validation
- Server Action: validate → email + sheet write → response
- Success/error states

### 5.4 About (`/about`)

- Content pulled from "About" sheet
- Simple, warm layout

**Commit per page:** `feat: add homepage`, `feat: add gallery page`, etc.

## Phase 6: Polish & SEO

### 6.1 SEO

- `metadata` exports on each page (title, description, OG image)
- `robots.txt`, `sitemap.xml` (Next.js built-in)
- Structured data (LocalBusiness schema)

### 6.2 Performance

- Optimize images with `next/image` + Cloudinary loader
- Verify Core Web Vitals locally

### 6.3 Responsive design

- Mobile-first layouts
- Test all breakpoints

**Commit:** `feat: add SEO and performance optimizations`

## Phase 7: Deploy Prep

### 7.1 Vercel configuration

- `vercel.json` if needed (likely not)
- Document env var setup for Vercel dashboard
- Add `README.md` with setup instructions

### 7.2 Tag release

- `git tag v1.0.0`
- Document in README how to deploy

**Commit:** `chore: add deployment docs and tag v1.0.0`

## Execution Order

Phases 1-3 are foundational and sequential. Phases 4-5 are the bulk of the work. Phase 6-7 are finishing touches.

Total estimated tasks: ~12 commits, 7 phases.
