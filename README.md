# BeibíCakes — cakes.is

Website for BeibíCakes, a custom cake business in Iceland. Built with Next.js, styled with Tailwind CSS, powered by Google Sheets as a CMS.

## Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **CMS:** Google Sheets (via `google-spreadsheet`)
- **Email:** Resend (order notifications)
- **Images:** Cloudinary
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 25+ (see `.nvmrc`)
- A Google Cloud project with Sheets API enabled
- A Resend account (free tier)
- A Cloudinary account (free tier)

### 1. Clone and install

```bash
git clone <repo-url>
cd cakes.is
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in:

| Variable                            | Where to get it                                                            |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`      | Google Cloud Console > IAM > Service Accounts                              |
| `GOOGLE_PRIVATE_KEY`                | Download service account JSON key, copy `private_key` field                |
| `GOOGLE_SHEET_ID`                   | From the Google Sheet URL: `docs.google.com/spreadsheets/d/{THIS_ID}/edit` |
| `RESEND_API_KEY`                    | Resend dashboard > API Keys                                                |
| `ORDER_EMAIL`                       | Email address for order notifications (default: `orders@cakes.is`)         |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard > Cloud name                                          |

### 3. Set up Google Sheet

Create a Google Sheet with three tabs:

**Tab: "Cakes"** — columns (first row = headers):

| name          | description | price              | image_url                      | category | featured | published |
| ------------- | ----------- | ------------------ | ------------------------------ | -------- | -------- | --------- |
| Sukkuladikaka | Klassisk... | 8.000 - 12.000 kr. | https://res.cloudinary.com/... | Afmaeli  | true     | true      |

**Tab: "Orders"** — columns (first row = headers, data auto-populated):

| date | name | email | phone | event_date | cake_type | message | status |
| ---- | ---- | ----- | ----- | ---------- | --------- | ------- | ------ |

**Tab: "About"** — columns:

| key     | value                |
| ------- | -------------------- |
| story   | Your story here...   |
| mission | Your mission here... |
| values  | Your values here...  |

**Important:** Share the sheet with the service account email address (Editor for Orders writes, Viewer for read-only).

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Upload images

1. Go to [Cloudinary](https://cloudinary.com)
2. Upload cake images
3. Copy the URL and paste into the `image_url` column in Google Sheets

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.example`
4. Deploy — Vercel auto-detects Next.js

Future pushes to `main` auto-deploy.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (header, footer, fonts, SEO)
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Tailwind v4 theme (bakery palette)
│   ├── sitemap.ts          # Auto-generated sitemap
│   ├── robots.ts           # robots.txt
│   ├── cakes/page.tsx      # Gallery page
│   ├── order/
│   │   ├── page.tsx        # Order form page
│   │   ├── OrderForm.tsx   # Client-side form component
│   │   └── actions.ts      # Server action (email + sheet write)
│   └── about/page.tsx      # About page
├── components/             # Shared UI components
└── lib/
    ├── sheets.ts           # Google Sheets read/write
    ├── email.ts            # Resend email sending
    ├── types.ts            # TypeScript types
    └── validation.ts       # Zod schemas
```

## How It Works

- **CMS:** Edit a Google Sheet. The website reads from it via ISR (regenerates every 5 minutes).
- **Orders:** Visitors fill a form > Server Action validates > sends email via Resend + appends row to Orders sheet.
- **Images:** Upload to Cloudinary, paste URL in sheet. Next.js optimizes via `next/image`.
- **Deploy:** Push to `main` > Vercel auto-deploys.

## Categories

Cakes are filterable by category. Default categories:

- **Allt** (All)
- **Afmaeli** (Birthday)
- **Brudkaup** (Wedding)
- **Skirn** (Christening)
- **Annad** (Other)

To add new categories, type a new value in the `category` column and update `src/lib/types.ts` `CATEGORIES` array.

## Releases

Using git tags:

```bash
git tag v1.0.0
git push origin v1.0.0
```

## License

Private — BeibíCakes.
