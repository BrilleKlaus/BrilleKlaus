# brilleklaus

One-pager for Brilleklaus.

**Stack**

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Contentful (CMS) — _planned, not wired up yet_
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

## Contentful (later)

Env vars are stubbed in `.env.example`. When wiring up:

1. `npm install contentful`
2. Add a typed client in `src/lib/contentful.ts`
3. Fetch in Server Components / `generateMetadata`

## Deploy

Push to the connected Git repo — Netlify auto-detects Next.js and installs the
`@netlify/plugin-nextjs` adapter. No extra config required.
