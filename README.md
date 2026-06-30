# SimpleGhar Telugu — Bio Link Page

A simple, fast bio-link/product page that loads its product grid live from a
published Google Sheet — no rebuild needed when you add products.

## How it works

- Your Google Sheet has columns: `Product Name`, `Price`, `Image URL`,
  `Affiliate Link`, `Category`, `Description`.
- The sheet is published to the web (so it has a public URL).
- On every page load, the browser fetches that sheet as CSV and renders the
  product grid from it.
- Update the sheet → refresh the page → new products appear (Google caches
  published sheets for a few minutes, so it's not instant, usually live
  within 1–5 minutes).

## 1. Set up the Google Sheet

Columns, in this exact order, with these exact header names in row 1:

| Product Name | Price | Image URL | Affiliate Link | Category | Description |
|---|---|---|---|---|---|

Then: **File → Share → Publish to web** → select the tab → format **CSV**
→ Publish. Copy the link it gives you.

## 2. Configure the project

Copy `.env.local.example` to `.env.local` and paste your published sheet
link as `NEXT_PUBLIC_SHEET_CSV_URL`. You can paste either the `pubhtml` link
Google gives you, or a direct `output=csv` link — both work.

```bash
cp .env.local.example .env.local
```

## 3. Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 4. Deploy to Vercel

1. Push this project to a GitHub repository.
2. Go to https://vercel.com → "Add New" → "Project" → import the repo.
3. In the import screen (or later in Project Settings → Environment
   Variables), add:
   - `NEXT_PUBLIC_SHEET_CSV_URL` = your published sheet link
4. Click Deploy. Vercel auto-detects Next.js and builds it.
5. Every time you push to your main branch, Vercel redeploys automatically.
   You generally won't even need to redeploy for new products — just edit
   the sheet, since the data loads at runtime in the browser.

## Notes

- Rows missing a `Product Name` or `Affiliate Link` are skipped automatically.
- If you add new `Category` values, filter pills for them appear automatically
  once there are 3+ categories.
- Affiliate links open with `rel="nofollow sponsored"` as recommended for
  affiliate/sponsored links.
