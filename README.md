# brilleklaus

One-pager for Brilleklaus.

**Stack**

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Contentful (CMS) — wired up with in-code fallback content
- Netlify — hosting + Forms (contact form)

## Getting started

```bash
nvm use
npm install
npm run dev
```

Open <http://localhost:3000>.

## Project structure

```
src/
  app/            # routes, layout, globals.css
  modules/        # page content modules (hero.tsx, etc.) — composed in app/page.tsx
  components/     # shared UI primitives (footer, sticky CTA, etc.)
  lib/            # utilities, data fetchers, Contentful client (later)
public/
  __forms.html    # static form Netlify scans at build time (see "Contact form")
netlify.toml      # Netlify build config
.env.example      # copy to .env.local and fill in
```

## Contact form (Netlify Forms)

Netlify only detects forms in **static HTML** at build time, so `public/__forms.html`
contains a hidden definition of the `contact` form with its expected fields.

The real form in the React app must:

1. POST to `/` with `Content-Type: application/x-www-form-urlencoded`
2. Include a `form-name=contact` field
3. Use the same field names as `public/__forms.html`
4. Include the `bot-field` honeypot input (hidden from users)

When fields change, update `public/__forms.html` to match.

Submissions appear in the Netlify dashboard under **Forms**. Configure email
notifications there (Site settings → Forms → Notifications).

## Contentful

The site fetches every text and image from Contentful at request time via
typed Server-Component fetchers in `src/lib/contentful.ts`. If env vars are
missing — or any request fails — each module silently falls back to the
hard-coded content in that file, so the site keeps working in local dev
before the CMS is wired up.

### Setup

1. Copy `.env.example` to `.env.local`
2. Fill in `CONTENTFUL_SPACE_ID` and `CONTENTFUL_DELIVERY_TOKEN` (Settings →
   API keys in Contentful)
3. Restart `npm run dev`

### Content models

Create one entry per content type. The fetchers grab the first published
entry of each type (`limit: 1`).

Every image slot is a **list of media** (`Many files`). On the front end each
slot crossfades through its array every 7 seconds via the `<RotatingImage>`
client component (`src/components/rotating-image.tsx`). One asset = static
image; multiple = rotation.

| Content type ID    | Field ID           | Type            | Notes                                    |
| ------------------ | ------------------ | --------------- | ---------------------------------------- |
| `heroSection`      | `tagline`          | Symbol          | e.g. "optiker"                           |
|                    | `backgroundImages` | Media, many     | Full-screen hero background(s)           |
| `manifestoSection` | `leftLine1`        | Symbol          | e.g. "Not just glasses"                  |
|                    | `leftLine2`        | Symbol          | e.g. "Experience"                        |
|                    | `rightLine1`       | Symbol          | e.g. "Into a new world of glasses"       |
|                    | `rightLine2`       | Symbol          | e.g. "Klaus Berthelsen"                  |
|                    | `images`           | Media, many     | Portrait                                 |
| `aboutSection`     | `heading`          | Symbol          |                                          |
|                    | `body`             | Text            | Long-form paragraph (newlines respected) |
|                    | `primaryImages`    | Media, many     | Landscape, fills right column            |
|                    | `secondaryImages`  | Media, many     | Portrait, sits at 1/3 width              |
| `processSection`   | `heading`          | Symbol          |                                          |
|                    | `body`             | Text            |                                          |
|                    | `images1`          | Media, many     | Square, ~5/7 width                       |
|                    | `images2`          | Media, many     | 2:1, ~3/7 width                          |
|                    | `images3`          | Media, many     | 3:4, ~3/7 width                          |
| `footerSection`    | `heading`          | Symbol          | e.g. "Get in touch"                      |

In Contentful, configure each Media field as **"Many files"** and the
"Accept only specified file types" → Image. Asset `title` is used as the
`alt` text (asset `description` is the secondary fallback).

### Adding a new section

1. Add an `EntryFieldTypes` skeleton and matching public content type
2. Add fallback content
3. Export a cached fetcher (`cache(async () => …)`)
4. Consume it from your module as an `async` Server Component

## Deploy

Push to the connected Git repo — Netlify auto-detects Next.js and installs the
`@netlify/plugin-nextjs` adapter. No extra config required.
