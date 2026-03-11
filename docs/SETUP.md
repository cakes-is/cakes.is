# BeibíCakes — Setup Guide

This guide walks you through setting up all the external services the website needs. You'll be setting up four things: Google Sheets (the CMS), Cloudinary (image hosting), Resend (email), and Vercel (deployment). Each section is self-contained, so you can do them in any order, but the sequence below is the most natural.

By the end you'll have a fully working local development environment and a live production site.

---

## What You Need Before Starting

- A Google account (for Google Sheets and Google Cloud)
- Node.js 25 or later installed on your computer (check with `node --version`)
- The cakes.is repository cloned to your machine

---

## Section 1: Google Cloud Project and Service Account

The website reads and writes to a Google Sheet to get cake listings and save orders. To do this securely, it uses a "service account" — think of it as a robot Google account that has permission to access only your specific sheet.

### 1.1 Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Sign in with your Google account.
3. In the top bar, click the project selector (it usually shows "Select a project" or your last project name).
4. A dialog opens showing your existing projects. Click **New Project** in the top-right corner of the dialog.
5. Give the project a name, something like `beibi-cakes`. The Project ID is auto-generated and you can leave it as-is.
6. Click **Create**. After a few seconds you'll see a notification that the project was created. Make sure it's selected in the top bar before continuing.

### 1.2 Enable the Google Sheets API

1. From the left sidebar, go to **APIs & Services > Library**.
2. In the search box, type `Google Sheets API`.
3. Click on the result (it shows a blue Google Sheets icon).
4. Click the blue **Enable** button. The page will refresh and show the API is enabled.

### 1.3 Create a Service Account

1. From the left sidebar, go to **APIs & Services > Credentials**.
2. At the top, click **+ Create Credentials** and choose **Service account**.
3. Fill in the **Service account name** field, e.g. `beibi-cakes-sheets`. The Service account ID fills in automatically.
4. Click **Create and continue**.
5. On the "Grant this service account access to project" step, you can skip this (click **Continue**).
6. On the "Grant users access to this service account" step, also skip (click **Done**).
7. You'll be back on the Credentials page. Your new service account appears in the "Service Accounts" section at the bottom. Note down the email address shown there — it looks like `beibi-cakes-sheets@your-project-id.iam.gserviceaccount.com`. This is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`.

### 1.4 Download the JSON Key

1. Click on the service account email address in the list to open its details.
2. Go to the **Keys** tab.
3. Click **Add Key > Create new key**.
4. Select **JSON** and click **Create**.
5. A JSON file downloads to your computer automatically. Keep it somewhere safe — you only get to download it once.

### 1.5 Extract the Values You Need

Open the downloaded JSON file in a text editor. It contains many fields. You need two of them:

- `client_email` — this is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`. It's the same email you noted in step 1.3.
- `private_key` — this is your `GOOGLE_PRIVATE_KEY`. It's a long string that starts with `-----BEGIN RSA PRIVATE KEY-----` and ends with `-----END RSA PRIVATE KEY-----\n`.

**Important about the private key:** The key contains literal `\n` characters to represent line breaks. When you paste it into `.env.local`, keep it on a single line with those `\n` sequences intact, wrapped in double quotes:

```
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEo...\n-----END RSA PRIVATE KEY-----\n"
```

---

## Section 2: Google Sheet Setup

### 2.1 Create the Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and click the **+** button to create a blank spreadsheet.
2. Click "Untitled spreadsheet" at the top and rename it to something like `BeibíCakes CMS`.

### 2.2 Create the Three Tabs

The website expects exactly three tabs with exact names. By default Google Sheets creates one tab called "Sheet1".

1. Double-click on the "Sheet1" tab at the bottom and rename it to `Cakes` (capital C, exactly).
2. Click the **+** button at the bottom left to add a second tab. Rename it to `Orders` (capital O, exactly).
3. Click **+** again to add a third tab. Rename it to `About` (capital A, exactly).

The tab names are case-sensitive. If they're named wrong, the website won't find the data.

### 2.3 Set Up the Header Rows

Click on each tab and add the headers in row 1, exactly as shown. Type each header into its own cell starting from column A.

**Cakes tab** (row 1, columns A through G):

| A    | B           | C     | D         | E        | F        | G         |
|------|-------------|-------|-----------|----------|----------|-----------|
| name | description | price | image_url | category | featured | published |

**Orders tab** (row 1, columns A through H):

| A    | B    | C     | D     | E          | F         | G       | H      |
|------|------|-------|-------|------------|-----------|---------|--------|
| date | name | email | phone | event_date | cake_type | message | status |

You don't need to add any data to the Orders tab yourself. When someone submits an order form on the website, a new row gets added here automatically.

**About tab** (row 1, columns A and B):

| A   | B     |
|-----|-------|
| key | value |

Then add these rows below the headers:

| A       | B                    |
|---------|----------------------|
| story   | Your story here...   |
| mission | Your mission here... |
| values  | Your values here...  |

Replace the placeholder text with the actual content for the About page.

### 2.4 Share the Sheet with the Service Account

1. Click the **Share** button in the top-right corner of the sheet.
2. In the "Add people and groups" field, paste the service account email from Section 1 (the one ending in `.iam.gserviceaccount.com`).
3. Make sure the permission level is set to **Editor** (not Viewer). The website needs Editor access to write new orders to the Orders tab.
4. Uncheck the "Notify people" checkbox — the service account is a robot and doesn't read emails.
5. Click **Share**.

### 2.5 Find the Sheet ID

Look at the URL in your browser while the sheet is open. It looks like this:

```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit
```

The long string between `/d/` and `/edit` is your Sheet ID. Copy it — this is your `GOOGLE_SHEET_ID`.

---

## Section 3: Cloudinary Setup

Cloudinary hosts the cake photos. The website uses the image URLs stored in the Google Sheet to display them. Cloudinary's free tier gives you 25GB of storage and 25GB of bandwidth per month, which is plenty for a small bakery site.

### 3.1 Create an Account

1. Go to [cloudinary.com](https://cloudinary.com) and click **Sign Up for Free**.
2. Fill in the form. You can sign up with Google if you prefer.
3. After confirming your email, you'll land on the Cloudinary dashboard.

### 3.2 Find Your Cloud Name

1. On the dashboard, look at the top of the page or the "Account Details" card. You'll see a field labeled **Cloud name**.
2. It's usually something auto-generated like `dxyz1234a` or you might have chosen it during signup.
3. Copy this value. This is your `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.

### 3.3 Upload Images

1. From the Cloudinary dashboard, go to **Media Library** in the left sidebar.
2. Click the **Upload** button.
3. Drag your cake photos in, or click to select files from your computer. JPG or WebP at 1200px wide is a good target size.
4. Once uploaded, click on any image to open it.
5. Look for the **Copy URL** option or click the image URL shown below the preview. It looks like:
   ```
   https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/your-image.jpg
   ```
6. This full URL goes into the `image_url` column in your Google Sheet.

### 3.4 Free Tier Limits

The free plan includes 25GB storage and 25GB bandwidth per month. A high-quality cake photo is usually 200-500KB, so you can store thousands of images before hitting the limit. If you ever need more, Cloudinary's paid plans are reasonable.

---

## Section 4: Resend Setup

Resend handles the email notifications. When someone submits an order on the website, Resend sends an email to the orders inbox at cakes.is.

### 4.1 Create an Account

1. Go to [resend.com](https://resend.com) and click **Get Started**.
2. Sign up with your email address.

### 4.2 Add and Verify the cakes.is Domain

For emails to send from an `@cakes.is` address, you need to verify that you own the domain. This involves adding a few DNS records.

1. In the Resend dashboard, go to **Domains** in the left sidebar.
2. Click **Add Domain**.
3. Type `cakes.is` and click **Add**.
4. Resend shows you a list of DNS records to add. There will be a few records, typically:
   - An MX record
   - A couple of TXT records (for SPF and DKIM verification)
5. Log in to wherever the cakes.is domain is registered (likely Namecheap, Cloudflare, or a similar registrar).
6. Go to the DNS settings for cakes.is and add each record exactly as Resend shows. The record type, name, and value all need to match precisely.
7. DNS changes can take a few minutes to a few hours to propagate. Come back to the Resend dashboard and click **Verify** once the records are in place.
8. Once it shows a green "Verified" status, the domain is ready.

### 4.3 Generate an API Key

1. In the Resend dashboard, go to **API Keys** in the left sidebar.
2. Click **Create API Key**.
3. Give it a name like `beibi-cakes-production`.
4. Set the permission to **Full access** (or at minimum, **Sending access**).
5. Click **Add**. The key appears once — copy it immediately and keep it somewhere safe. This is your `RESEND_API_KEY`.

### 4.4 Free Tier Limits

The free plan allows 100 emails per day and 3,000 per month. For an order notification setup on a small bakery site, you'd need to be taking 100+ orders every single day to hit that limit. It's effectively unlimited for this use case.

---

## Section 5: Local Development

### 5.1 Copy the Environment File

In your terminal, from the root of the project:

```bash
cp .env.example .env.local
```

### 5.2 Fill in the Values

Open `.env.local` in a text editor and fill in each variable using the values you collected above:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=beibi-cakes-sheets@your-project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEo...\n-----END RSA PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
RESEND_API_KEY=re_xxxxxxxxxxxx
ORDER_EMAIL=orders@cakes.is
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

A few things to double-check:
- The private key must be wrapped in double quotes and kept on a single line.
- `ORDER_EMAIL` is already set to `orders@cakes.is` in the example. Change it if you want order emails going somewhere else.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` starts with `NEXT_PUBLIC_` because the image component on the front end needs it. Don't remove that prefix.

### 5.3 Install Dependencies and Start the Dev Server

```bash
npm install
npm run dev
```

### 5.4 Verify It Works

1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. The homepage should load. If you've added cakes to your sheet, they should show up on the Cakes page.
3. Try submitting a test order form. If everything is wired up correctly, you should receive a notification email at the `ORDER_EMAIL` address and see a new row appear in the Orders tab of your sheet.

---

## Section 6: Vercel Deployment

### 6.1 Create a Vercel Account

1. Go to [vercel.com](https://vercel.com) and click **Sign Up**.
2. Sign up with your GitHub account — this makes connecting the repository much easier.

### 6.2 Import the GitHub Repository

1. From the Vercel dashboard, click **Add New > Project**.
2. You'll see a list of your GitHub repositories. Find `cakes.is` and click **Import**.
3. Vercel auto-detects that it's a Next.js project and pre-fills the build settings correctly. You don't need to change anything there.

### 6.3 Add Environment Variables

Before deploying, scroll down to the **Environment Variables** section on the project setup page. Add each variable from your `.env.local` file:

| Name | Value |
|------|-------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | your service account email |
| `GOOGLE_PRIVATE_KEY` | the full private key string (with quotes is fine, Vercel handles it) |
| `GOOGLE_SHEET_ID` | your sheet ID |
| `RESEND_API_KEY` | your Resend API key |
| `ORDER_EMAIL` | orders@cakes.is |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | your Cloudinary cloud name |

Add each one by typing the variable name, pasting the value, and clicking **Add**.

### 6.4 Deploy

Click **Deploy**. Vercel builds and deploys the project. This takes about a minute. When it's done, you'll get a URL like `cakes-is.vercel.app` where the live site is running.

From this point on, every push to the `main` branch triggers an automatic redeploy.

### 6.5 Set Up the Custom Domain

1. In your Vercel project, go to **Settings > Domains**.
2. Type `cakes.is` and click **Add**.
3. Also add `www.cakes.is` if you want the www version to work.
4. Vercel shows you DNS records to add. Log in to your domain registrar and add them:
   - If using Vercel's nameservers, point the domain's nameservers to Vercel and it handles everything.
   - If managing DNS yourself, add the A record (or CNAME for www) that Vercel provides.
5. Once DNS propagates, the site is live at cakes.is with HTTPS automatically handled by Vercel.

---

## Section 7: Adding and Managing Content

All content management happens directly in the Google Sheet. No code changes needed.

### 7.1 Add a New Cake

1. Open the Google Sheet and click the **Cakes** tab.
2. Scroll to the first empty row below the existing cakes.
3. Fill in each column:
   - `name`: the name of the cake (e.g. `Súkkulaðikaka`)
   - `description`: a few sentences describing it
   - `price`: the price range as a text string (e.g. `8.000 - 12.000 kr.`)
   - `image_url`: the full Cloudinary URL for the photo (see Section 3.3)
   - `category`: one of `Afmaeli`, `Brudkaup`, `Skirn`, or `Annad`
   - `featured`: `true` or `false`
   - `published`: `true` or `false`

The website refreshes its data every 5 minutes, so new cakes show up on the site shortly after you save the sheet.

### 7.2 Feature a Cake on the Homepage

1. Find the cake row in the **Cakes** tab.
2. Set the `featured` column to `true`.
3. To un-feature it, change it back to `false`.

Featured cakes appear in a highlighted section on the homepage. You can feature as many as you like, but 3-6 looks best visually.

### 7.3 Unpublish a Cake

1. Find the cake row in the **Cakes** tab.
2. Set the `published` column to `false`.

The cake disappears from the website without you having to delete the row. To bring it back, set `published` to `true` again.

### 7.4 Upload Images and Get the URL

1. Log in to [cloudinary.com](https://cloudinary.com).
2. Go to **Media Library** and click **Upload**.
3. Upload the image file. A good size is 1200px wide, saved as JPG or WebP.
4. Once uploaded, click the image to open its detail view.
5. Look for the **Copy URL** button or copy the URL shown in the image details panel. It starts with `https://res.cloudinary.com/`.
6. Paste that URL into the `image_url` column for the cake in your Google Sheet.

---

## Troubleshooting

### The cakes page is empty or shows an error

- Check that the **Cakes** tab name is spelled exactly `Cakes` (capital C, no spaces).
- Check that the header row in the Cakes tab matches exactly: `name`, `description`, `price`, `image_url`, `category`, `featured`, `published`.
- Confirm the sheet is shared with the service account email as **Editor**.
- Double-check the `GOOGLE_SHEET_ID` in your `.env.local` matches the ID in the sheet URL.

### "Error: Could not load the default credentials" or similar Google auth error

- The `GOOGLE_PRIVATE_KEY` is the most common culprit. Make sure it's wrapped in double quotes in `.env.local` and that the `\n` newline characters are preserved as literal `\n` text, not actual line breaks.
- Confirm the `GOOGLE_SERVICE_ACCOUNT_EMAIL` matches the email in the JSON key file exactly.

### Order emails aren't arriving

- Check the Resend dashboard under **Logs** to see if emails are being sent and whether there are any errors.
- Confirm the `cakes.is` domain shows as **Verified** in Resend's Domains section. If it shows as unverified, the DNS records aren't in place yet.
- Check your spam folder.

### Images aren't loading

- Make sure the `image_url` in the sheet is the full URL starting with `https://res.cloudinary.com/`.
- Confirm `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` matches your actual Cloudinary cloud name (visible on the Cloudinary dashboard).

### The site works locally but not on Vercel

- The most common cause is a missing or incorrectly entered environment variable in Vercel. Go to your project's **Settings > Environment Variables** and double-check each one.
- The private key in particular can be tricky. Paste it with the surrounding quotes included, or use Vercel's UI which handles multi-line values well.
- After updating environment variables in Vercel, you need to trigger a new deployment for the changes to take effect. Go to **Deployments** and click **Redeploy** on the latest deployment.

### DNS / domain not working after Vercel setup

- DNS propagation takes time. It can be anywhere from a few minutes to 48 hours depending on your registrar. Check your progress at [dnschecker.org](https://dnschecker.org).
- Make sure you've added both the apex domain (`cakes.is`) and the www version if you want both to work.

### npm run dev fails immediately

- Run `node --version` and confirm you're on Node.js 25 or later. If not, install the correct version (the project includes a `.nvmrc` file if you use nvm: run `nvm use` first).
- Make sure you've run `npm install` before `npm run dev`.
- Make sure `.env.local` exists (not just `.env.example`).
