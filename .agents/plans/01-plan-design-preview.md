# Luxury Duo Cleaning LLC — Design-Preview Plan (LOCKED)

Status: planning/proposal stage. No implementation until signal.
Last updated: 2026-09-15

## 1. Business context
- Company: Luxury Duo Cleaning LLC, Orlando FL, serving entire Orlando area.
- Status: operating, not yet well known — site must build credibility fast.
- Positioning: efficient, reliable, meticulous. Premium + precise.
- Audience (priority): 1) contractors/construction, 2) commercial, 3) Airbnb hosts, 4) residential.
- Services: residential, commercial, Airbnb/vacation rental, move-in/move-out, deep, pre/post-construction (flagship).
- Goals: 1) quote requests, 2) phone calls, 3) bookings.
- Contact: info@luxuryduocleaning.com (placeholder). Phone TBD.
- Assets: logo exists but not shared (CSS-var swap). ~2 real photos only — use commercial/construction stock as clearly-marked placeholders, zero-layout-change swap later.

## 2. Locked decisions
- Stack: Astro 5 + Tailwind v4 + TypeScript, static output.
- Preview host: GitHub Pages project URL (`<user>.github.io/LLC/`).
- Production host (later): GoDaddy (static `dist/` upload).
- Forms (preview): Formspree STUB mode (fake success + DRAFT note). Live ID only after sign-off.
- Scope: "all of it" — style tile + all 5 pages + component gallery, rebuilt in Astro now (preview code = production code).
- IA v1: keep 5 pages (index, about, services with anchors, contact, quote). No per-service SEO split until v2.

## 3. Tech stack details
- Astro `output: 'static'`, `site: 'https://<user>.github.io'`, `base: '/LLC/'`.
- Tailwind v4 `@theme` maps existing tokens: primary #16324F, primary-light #1d4168, accent #3E7CB1, silver #C7CDD4/#E8EAED, bg #FFF / bg-alt #F5F7F9, text #1A1A2E / muted #5A6270, Inter/system-ui.
- `astro:assets` for build-time WebP/AVIF + responsive + CLS-safe dimensions (matters on GH Pages + GoDaddy: no edge image CDN).
- Islands only for nav/carousels/forms. Kill prototype SPA fetch-transitions (broke carousel re-init, hurt LCP).
- Env: `PUBLIC_FORMSPREE_ID` (stub in preview, live post-signoff).

## 4. Architecture
```
src/
  layouts/BaseLayout.astro
  components/Nav, Footer, Logo, Hero, PageHero, SectionHeader, Button,
    TrustBar, CtaBand, ServiceCard, TestimonialCard, ValueProp,
    LinearCarousel, RoundCarousel, ServiceSection, Stat,
    ContactInfoCard, FormField, QuoteForm, ContactForm,
    ImageSlot, MapPlaceholder
  content/config.ts (services, testimonials, suburbs — ready for v2 split)
  pages/index, about, services, contact, quote, 404, design
  styles/global.css | assets/img/draft/ (local stock, no picsum hotlinks)
public/logo.svg, favicon.svg, robots.txt
.github/workflows/deploy.yml (build dist/ -> deploy-pages)
```

## 5. GitHub Pages preview specifics
- Actions: push to `main` builds + deploys. `preview/*` branches for local iteration, merge to publish. Keep client URL frozen.
- Never hardcode `/img/...`; use `import.meta.env.BASE_URL` / asset imports.
- `src/pages/404.astro` included. No `.htaccess` on GH Pages.
- All 5 pages + `/design/` must work under `/LLC/` subpath (audit nav/footer/CTA links).

## 6. Draft-marking contract
- Logo: `LD` monogram fallback + DRAFT LOGO badge; real SVG -> `public/logo.svg`.
- ImageSlot: fixed aspect-ratio + object-fit cover, dashed border + `DRAFT PHOTO — construction stock` label.
- Testimonials: `Sample copy — will use Google reviews` badge.
- Phone/email/hours/map/Instagram/Formspree: DRAFT pill + entry in swap table (see todo file Template D).

## 7. Improvements packed into preview
- Credibility: Google-review-ready cards, license/insured microcopy, suburb list text, before/after ImageSlot pair on #construction, FAQ stub.
- Conversion: sticky mobile Call bar (draft number), quote-first CTAs with `?service=` auto-select, required fields minimized, 24hr-response microcopy, sq-ft + completion-date conditional kept.
- A11y/perf: keyboard carousels + aria-live, focus states, prefers-reduced-motion, self-host Inter, hero fetchpriority high / rest lazy. Fix `表面` stray char + `value=" scheduling"` bug.

## 8. Deliberately DEFERRED (post-signoff)
Final SEO (sitemap/canonical/JSON-LD CleaningService+FAQ+Review), real Formspree, analytics, per-service SEO pages (`/post-construction-cleaning-orlando/` etc.), GoDaddy deploy (`base:'/'`, `.htaccess`, 404, SSL), Lighthouse 95+ gate.

## 9. Feedback questions for client meeting
Contractor-first hero? Construction flagship distinct enough? Wrong-feeling stock? Missing trust proof? Extra quote fields (blueprints, site access)? Logo constraints, real NAP/hours/cities?

## 10. GoDaddy migration (later, no rewrite)
Rebuild with `base:'/'`, `site:'https://luxuryduocleaning.com'`, upload `dist/`, add `.htaccess` + live Formspree ID + real assets.
