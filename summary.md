# Luxury Duo Cleaning LLC — Project Summary

Marketing website for a cleaning company in Orlando, FL. Built with plain HTML5, CSS3, and vanilla JavaScript. No frameworks, no build tools, no npm dependencies.

---

## File Structure

```
clean/
├── index.html        — Home page (hero, services carousel, testimonials carousel, trust bar, CTA)
├── about.html        — About page (mission, values, round carousel, team story)
├── services.html     — Full service breakdown (6 services with anchor IDs)
├── contact.html      — Contact form + info cards + map placeholder
├── quote.html        — Detailed quote form with conditional fields
├── styles.css        — Complete design system (CSS custom properties)
├── script.js         — All interactivity (nav, carousels, transitions, forms)
└── prompt.txt        — Original client brief
```

---

## Design System (`styles.css`)

### Palette (CSS Custom Properties — swap in one place)
```css
--color-primary: #16324F;      /* Deep blue — main brand */
--color-accent: #3E7CB1;       /* Bright blue — CTAs, highlights */
--color-silver: #C7CDD4;       /* Silver — borders, dividers */
--color-silver-light: #E8EAED; /* Light silver — backgrounds */
--color-bg: #FFFFFF;           /* Page background */
--color-bg-alt: #F5F7F9;       /* Alternating section background */
--color-text: #1A1A2E;         /* Body text */
--color-text-muted: #5A6270;   /* Secondary text */
```

### Typography
- Font: Inter (via system-ui fallback)
- Headings: 700 weight, tight letter-spacing
- Body: 400 weight, max-width 65ch

### Logo
- Currently a CSS monogram (`LD` in a blue square)
- To swap: replace the `nav__logo-mark` div in each HTML file with an `<img>` tag, or update the CSS

### Breakpoints
- `sm: 640px` | `md: 768px` | `lg: 1024px` | `xl: 1280px`

---

## Page Overview

### index.html (Home)
1. **Nav** — fixed, blurred backdrop, mobile hamburger, "Get a Quote" CTA
2. **Hero** — full-width background image (stock placeholder), headline, two CTAs
3. **Trust Bar** — 4 icon+text badges (Licensed, Background-Checked, Guarantee, Orlando)
4. **Services Carousel** — 6 cards in 2 groups of 3, side arrow navigation, images replace icons
5. **Why Choose Us** — 4 value props in 2x2 grid
6. **Testimonials Carousel** — 6 reviews in 2 groups of 3, side arrow navigation
7. **Service Area** — Map placeholder
8. **CTA Band** — Final call to action
9. **Footer** — 4-column grid with links, contact, social

### about.html
1. **Hero** — mission headline
2. **Mission** — text + stats panel (100% Licensed, 24hr Turnaround, Orlando)
3. **What Sets Us Apart** — 3 pillars (Efficiency, Reliability, Attention to Detail)
4. **Round Carousel** — 3D rotating disc showing 6 services (3 visible at a time: center + 2 neighbors)
5. **Our Story** — company background

### services.html
- 6 service sections with `id` anchors: `#construction`, `#commercial`, `#residential`, `#airbnb`, `#movein`, `#deep`
- Pre/Post-Construction at top with flagship treatment
- Each section: image + description + bullet list + "Get a Quote" CTA

### contact.html
- Two-column layout: form (in card) + info cards (in card)
- Form fields: name, email, phone, subject dropdown, message
- Info cards: phone, email, hours, service area
- Map placeholder below

### quote.html
- Centered card form (800px max)
- Fields: name, phone, email, city, service type, property type, timeline, details
- **Conditional fields**: when "Pre & Post-Construction" is selected, square footage + project completion date fields appear
- Forms wire to Formspree (placeholder `YOUR_FORM_ID`)

---

## JavaScript (`script.js`)

### Mobile Nav
- Hamburger toggle, click-outside-to-close, body scroll lock when open

### Scroll Reveal (Intersection Observer)
- Elements with `data-reveal` fade + slide in on scroll
- Supports `data-reveal="left"`, `"right"`, `"scale"` variants
- Supports `data-reveal-delay="1"` through `"5"` for stagger
- Respects `prefers-reduced-motion`

### Page Transitions (SPA-style)
- Intercepts internal `<a>` clicks
- Fetches destination HTML, fades out content, swaps in new content, fades in
- Updates URL with `history.pushState`
- Works with back/forward buttons
- Falls back to normal navigation if fetch fails

### Linear Carousel (Testimonials + Services)
- Shows 3 cards per group (1 on mobile)
- Side arrow buttons (← →) on left/right of track
- Dot indicators below
- Fade transition between groups
- Wraps around (last group → first)
- Handles multiple carousels on the same page

### Round Carousel (About page — 3D rotating disc)
- 6 items positioned in a circle using CSS 3D transforms
- Shows 3 items at a time: center (highlighted), left neighbor, right neighbor
- Other items hidden
- Prev/next arrows rotate the disc
- Dot indicators
- Respects `prefers-reduced-motion`

### Form Validation
- Required field checking
- Email format validation
- Phone format validation
- Scrolls to first error on submit

### Quote Form Conditional Fields
- Listens to service type dropdown
- Shows/hides square footage + project completion date when "Pre & Post-Construction" is selected

### Smooth Scroll
- Anchor links (#) scroll to target with nav offset

---

## Carousels — How They Work

### Linear Carousel (Home page — services + testimonials)
```
← [ Group of 3 cards ] →
         [ ● ● ]
```
- Track contains groups, only one group visible at a time
- Arrows are absolutely positioned on left/right sides
- Dots map to groups (click to jump)

### Round Carousel (About page — 3D disc)
```
     [ Neighbor ]
    /              \
[ Neighbor ]    [ CENTER ]    [ Neighbor ]
    \              /
     [ Hidden ]
```
- Items positioned with `rotateY(i*60deg) translateZ(200px)`
- Disc rotates on prev/next click
- Center item: opacity 1, full scale
- Neighbors (±1 position): opacity 0.6, scale 0.88
- Others: opacity 0, hidden

---

## Placeholders to Swap Before Launch

| Item | Location | What to replace |
|------|----------|-----------------|
| **Phone number** | All pages (nav, footer, contact) | `(407) 555-1234` |
| **Email** | Footer, contact page | `info@luxuryduocleaning.com` |
| **Form endpoint** | `contact.html`, `quote.html` | `YOUR_FORM_ID` in Formspree URL |
| **Logo** | All pages | `LD` monogram → real logo image |
| **Hero image** | `index.html` | `picsum.photos/seed/luxury-clean-hero/1600/900` |
| **Service images** | `index.html` carousel, `about.html` round carousel, `services.html` | All `picsum.photos` seeds |
| **Testimonials** | `index.html` | 6 placeholder reviews marked `<!-- REPLACE WITH REAL REVIEWS -->` |
| **Google Maps** | `index.html`, `contact.html` | Map placeholder divs |
| **Instagram URL** | All footers | `#` placeholder |
| **Company story** | `about.html` | Placeholder text marked `<!-- REPLACE -->` |

---

## SEO

- Each page has unique `<title>` and `<meta description>` with local SEO phrasing
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`, proper heading hierarchy
- `aria-label` on interactive elements
- `loading="lazy"` on all below-fold images
- Each page is a standalone HTML file (crawlable without JS)
- Page transitions are progressive enhancement (site works with JS disabled)

---

## Accessibility

- `prefers-reduced-motion` respected everywhere (scroll reveal, carousels, transitions)
- Focus states on all interactive elements
- `aria-label` on icon-only buttons
- Form labels properly associated with inputs
- Error messages linked to fields
- Color contrast: WCAG AA on body text, high contrast on CTAs

---

## Known TODOs

1. Swap all placeholder images with real client photos
2. Replace `YOUR_FORM_ID` with actual Formspree endpoint
3. Replace phone number across all pages
4. Replace logo monogram with real logo
5. Replace placeholder testimonials with real reviews
6. Add real Google Maps embed
7. Add Instagram URL when available
8. Fill in real company story on about page
9. Test form submissions end-to-end
10. Run Lighthouse for performance/accessibility audit

---

## How to Preview

No build step needed. Open any `.html` file in a browser. All CSS and JS are local files.

```bash
# If you want a local server (optional):
npx serve .
# Then open http://localhost:3000
```

---

## Tech Notes

- **No `package.json`** — this is a zero-dependency project
- **CSS custom properties** make palette/logo swaps trivial
- **Page transitions** use `fetch()` + `DOMParser` + `history.pushState` — each HTML file is standalone but navigation feels like an SPA
- **Carousels** are vanilla JS with CSS transitions — no animation libraries
- **Round carousel** uses CSS `transform-style: preserve-3d` and `perspective` for the 3D disc effect
