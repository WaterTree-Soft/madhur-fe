# Madhur Sweet — Storefront

E-commerce storefront for Madhur Sweet, an Indian sweets and namkeen brand. Built with Next.js 16 (App Router) and powered by a Strapi v5 headless CMS for all content, auth, and orders.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2.2 (App Router, Turbopack) |
| UI runtime | React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4.2.2 |
| Animations | Framer Motion 12 |
| State | Zustand 5 (with persist) |
| Validation | Zod 4 |
| Icons | Lucide React |
| CMS / Backend | Strapi v5 (separate repo: `../strapi-cms/`) |
| Database | SQLite (dev) / Postgres (prod, via Strapi) |
| Auth | Strapi Users & Permissions (JWT) |
| Payments | Razorpay |
| SEO | Native Next.js metadata + `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, JSON-LD |

---

## Project Layout

```
madhur-sweets/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (header, footer, banner, auth init, global metadata)
│   ├── page.tsx                  # Homepage (hero, categories, products, testimonials, CTA)
│   ├── globals.css               # Tailwind base + theme variables + animations
│   ├── sitemap.ts                # Dynamic XML sitemap (static + product/category routes)
│   ├── robots.ts                 # robots.txt (allow public, disallow /admin, /api, /checkout, etc.)
│   ├── manifest.ts               # PWA web manifest
│   ├── about/  careers/  contact/
│   ├── privacy-policy/  terms/  cookies-policy/
│   ├── products/                 # Listing + [slug] detail with JSON-LD Product schema
│   ├── categories/               # Listing + [slug] detail
│   ├── cart/  checkout/          # Cart, address selection, Razorpay payment flow
│   ├── login/  register/  profile/
│   ├── admin/                    # Protected admin panel
│   │   ├── layout.tsx            # Sidebar + role guard
│   │   ├── page.tsx              # Dashboard (stats)
│   │   ├── products/  categories/  orders/  users/
│   │   ├── feedback/  pages/
│   │   └── utility/              # Site settings + testimonials CRUD
│   └── api/                      # Server-side API (proxies Strapi, holds tokens)
│       ├── auth/  cart/  addresses/  feedback/
│       ├── orders/  settings/
│       ├── razorpay/             # create-order + verify-payment
│       └── admin/                # Admin-only routes (products, categories, orders,
│                                 # banners, users, settings, stats, testimonials, upload)
├── components/
│   ├── layout/                   # Header, Footer, Banner, WhatsAppButton, SiteSettingsProvider
│   └── ui/                       # Reusable primitives (Button, Card, Dialog, Sheet, Input,
│                                 # TestimonialsCarousel, Mandala, Motion wrappers, etc.)
├── features/                     # Feature modules
│   ├── auth/                     # Store, hooks, login/register forms, schema, types
│   ├── cart/                     # Store, cart sheet, cart page, add-to-cart button
│   ├── products/  categories/    # Listing/detail components, server actions
│   ├── feedback/                 # Reviews, rating display, feedback form
│   ├── account/                  # Address store, address manager, order history
│   ├── testimonials/             # Public fetcher + fallback for homepage carousel
│   └── admin/                    # CRUD dialogs (product, category, testimonial, delete confirm)
├── lib/
│   ├── strapi.ts                 # Strapi REST client + data normalizers
│   ├── api-auth.ts               # Server-side JWT user resolution
│   ├── constants.ts              # SITE_NAME, SITE_URL, NAV_LINKS, STRAPI_URL, ROLES…
│   ├── invoice.ts                # PDF invoice generation
│   ├── utils.ts                  # cn, formatPrice, helpers
│   ├── mock-data.ts              # Fallback seed data
│   └── hooks/                    # use-site-settings, etc.
├── types/index.ts                # Shared TypeScript types
├── public/images/                # Static images, placeholders
├── proxy.ts                      # Next.js 16 proxy (replaces middleware.ts) — admin route guard
├── next.config.ts                # Image patterns, Turbopack root
├── eslint.config.mjs
├── postcss.config.mjs
├── tsconfig.json
├── .env.local                    # Local env vars (not committed)
└── .env.example                  # Env var template
```

---

## Getting Started

### 1. Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18.18+ (20 LTS recommended) |
| npm / pnpm / yarn | latest |
| Git | any recent |

You will run **two services in parallel**:

1. **Strapi backend** at `http://localhost:1337` — handles all content, auth, orders, file uploads
2. **Next.js frontend** at `http://localhost:3000` — what users see

### 2. Start Strapi (CMS — required first)

The frontend depends on Strapi. Start it in a dedicated terminal and leave it running.

```powershell
cd ../strapi-cms
npm install
npm run develop
```

On first run:

1. Open `http://localhost:1337/admin`
2. Create the **first admin user** (one-time setup screen)
3. Generate an API token: **Settings → API Tokens → Create new API Token**
   - Name: `nextjs-server`
   - Token type: **Full access**
   - Duration: **Unlimited**
   - Copy the token — you'll need it in `.env.local` below
4. Optional: seed some categories and products from the admin UI, or skip — the storefront has a mock-data fallback for empty state

### 3. Configure env vars

Inside this folder (`madhur-sweets/`):

```powershell
copy .env.example .env.local
```

Fill in the values:

```env
# Public site URL (used for canonical URLs, OG tags, sitemap)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Strapi backend
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=<paste the API token from step 2.3>

# Razorpay test credentials — get from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

`.env.local` is gitignored — never commit it.

### 4. Run the frontend

In a second terminal:

```powershell
cd madhur-sweets
npm install
npm run dev
```

Open `http://localhost:3000`. The site should now load with content from Strapi (or fallback mock data if Strapi is empty).

### 5. Become an admin

By default, registered users have the role `user`. To access `/admin`:

1. Register an account at `http://localhost:3000/register`
2. In Strapi admin → **Content Manager → User** → open your user
3. Set the `role` field to `super_admin` (or `admin`) → **Save**
4. Refresh your storefront — you'll now see the **Admin** link in the user menu

### 6. (Optional) Set up the Testimonial content type

The homepage carousel is backend-driven. The schema files are already in `strapi-cms/src/api/testimonial/`, so on first Strapi start the content type exists. You still need to grant public read access:

1. Strapi admin → **Settings → Roles → Public**
2. Find the **Testimonial** section → enable `find` and `findOne`
3. Save
4. Add testimonials in the Next.js app at `/admin/utility` → **Homepage Testimonials**

---

## Available Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the Next.js dev server with Turbopack at `:3000` |
| `npm run build` | Production build |
| `npm run start` | Start the production server (run after `build`) |
| `npm run lint` | Run ESLint across the codebase |

---

## Common Commands

```powershell
# Start fresh (clear Next.js cache if something feels stale)
Remove-Item -Recurse -Force .next ; npm run dev

# Type-check only (no emit)
npx tsc --noEmit

# Inspect the generated sitemap
curl http://localhost:3000/sitemap.xml

# Inspect robots.txt
curl http://localhost:3000/robots.txt
```

---

## Production Notes

- **Site URL**: set `NEXT_PUBLIC_SITE_URL` to your real domain. Canonical URLs, JSON-LD `@id`s, sitemap entries, and OG tags all read from it.
- **Strapi DB**: SQLite is dev-only. For production, switch to Postgres in `strapi-cms/config/database.ts` (Supabase / Railway / Render all work).
- **Strapi token**: regenerate the API token for production. Use a separate token from dev.
- **Razorpay**: swap test keys (`rzp_test_*`) for live keys (`rzp_live_*`) only after activating your Razorpay account.
- **Submit sitemap**: after deploying, add the production URL to [Google Search Console](https://search.google.com/search-console) and submit `https://yourdomain.com/sitemap.xml`.

---

## Troubleshooting

| Symptom | Likely cause |
|---------|--------------|
| Storefront shows mock products instead of Strapi data | Strapi not running, or Public role missing `find`/`findOne` permissions for products/categories |
| `Strapi API error [401]` in terminal | Bad / missing `STRAPI_TOKEN` — regenerate in Strapi → Settings → API Tokens |
| Razorpay returns 500 / "Authentication failed" | `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` are wrong or revoked. Generate fresh keys in [Razorpay dashboard](https://dashboard.razorpay.com/app/keys) (test mode toggle on) |
| Admin link doesn't appear after login | User role is still `user` in Strapi. Set it to `super_admin` or `admin` in Content Manager |
| `/api/admin/testimonials` returns 404 | Restart Strapi after adding the testimonial schema files. Then enable Public `find`/`findOne` for Testimonial |
| Hot reload fails / route handler edits ignored | Restart dev server (`Ctrl+C` then `npm run dev`) — env var and route changes don't always hot-reload cleanly |

---

## Related

- Strapi backend: `../strapi-cms/`
- Original HTML mockup: `../madhurhtml/`
#   m a d h u r - f e  
 