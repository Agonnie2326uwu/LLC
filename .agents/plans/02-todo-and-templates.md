# Luxury Duo Cleaning LLC — Todo List + Implementation Templates

Status: planned, NOT started. Waiting for signal to implement.
Source plan: `01-plan-design-preview.md`

## Todo list (in order)
- [ ] 1. (high) Scaffold Astro 5 + Tailwind v4 — static, `base: '/LLC/'`, 404, GH Actions deploy workflow
- [ ] 2. (high) Design tokens + `/design/` style tile (colors, type, buttons, cards, form field)
- [ ] 3. (high) Core components: Logo, Nav, Footer, Hero, SectionHeader, TrustBar, CtaBand, ImageSlot (with DRAFT badges)
- [ ] 4. (high) Cards + carousels: ServiceCard (flagship), TestimonialCard, ValueProp, Linear + Round carousel (keyboard + aria-live + reduced-motion)
- [ ] 5. (high) 5 pages: index, services (construction flagship first), about, contact, quote (conditional sq-ft + date, stub forms)
- [ ] 6. (medium) Picsum -> local draft stock; placeholder swap table + DRAFT pills (logo, photos, phone, reviews, map, Formspree, Instagram)
- [ ] 7. (medium) Preview harden: relative-link audit under /LLC/, mobile + reduced-motion pass, stub form success states, fix `表面` + `scheduling` bugs
- [ ] 8. (high) Deploy to GitHub Pages project URL + verify stable client link + 404
- [ ] 9. (high) Client feedback round: capture decisions (copy, stock, trust proof, quote fields, NAP)
- [ ] 10. (low, deferred) Post-signoff: real Formspree, SEO/JSON-LD, analytics, GoDaddy migration (`base:'/'`, `.htaccess`)

## Template A — Component ticket
```
Component: [e.g. ServiceCard --flagship]
Source ref: reference/index.html:L120-132, styles/main.css:L555-650
Props: [title, desc, imageSlotId, flagship?: boolean, href]
States: [default, flagship tag, mobile stacked, DRAFT badge on]
A11y: [keyboard, focus, aria, contrast, reduced-motion]
Draft marks: [stock label, replace path in src/assets/draft/]
Done when: [renders in /design/, zero layout shift on photo swap, links use BASE_URL]
```

## Template B — Page ticket
```
Page: [e.g. services — flagship #construction first]
Route: [/services/ under base /LLC/]
Sections: [page-hero, construction flagship, 5x ServiceSection, FAQ stub, CTA band]
Copy status: [from reference/ verbatim / needs client rewrite]
CTAs: [all -> /quote/?service=<slug>, tel: draft number]
Done when: [click-through from nav/footer works on GH Pages, mobile + desktop checked]
```

## Template C — Client feedback log
```
Page/section | Client comment | Decision (keep/change/defer) | Owner | Rework cost (S/M/L)
```

## Template D — Asset swap checklist (pre-production)
```
- [ ] public/logo.svg replaces LD monogram (check --logo-width var)
- [ ] ImageSlot hero-commercial, construction-site, office-night, etc. -> real photos
- [ ] Phone tel: link + footer + sticky bar (replace (407) 555-1234)
- [ ] info@luxuryduocleaning.com confirm + Formspree PUBLIC_FORMSPREE_ID live
- [ ] 6 testimonials -> Google reviews + GBP link
- [ ] Map placeholder -> Google embed + suburbs list verify
- [ ] Instagram URL
```

## Preview Definition of Done
All 5 pages + `/design/` live at `https://n3mo1101.github.io/LLC/`, no hardcoded `/` asset paths, no picsum hotlinks, forms show stub success, every placeholder has DRAFT pill, nav/footer/carousels work with keyboard + mobile.

## Execution notes (for build mode)
- Implement in todo order; todos 3+4+5 can parallelize via sub-agents with a coordinator.
- Use best model for code, mid-tier for docs.
- `main` branch = client preview; iterate on `preview/*`, merge to publish.
