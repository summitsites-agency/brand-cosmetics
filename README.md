# BRAND Cosmetics — luxury skincare storefront

A mossimo Studios demo, built from the supplied brand identity sheet, page comps
and motion frames. Vite 6 + React 19 + React Router 7, design-token CSS, no UI
framework.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm test           # Vitest
npm run prepare-media   # regenerate public/ from assets/ (needs the raw uploads)
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Split hero (video plate), the Our Story scroll narrative, the four-product ritual grid, story teaser, ingredient band, set CTA |
| `/shop` | Full catalogue, category filter synced to `?c=`, sort, front→back image crossfade on hover |
| `/skincare` | AM/PM routine builder, concern finder, ingredient science accordions |
| `/collection` | The Radiance Ritual as an ordered walkthrough, steps 01–04, closing on the boxed set |
| `/product/:slug` | Product page matching the e-commerce comps — image field, size picker, Add to Bag, Ingredients / How to Use / Reviews |
| `/story` | Brand values, the alpine spring, closing CTA (the scroll narrative that used to open this page now opens the homepage) |
| `/contact` | Enquiry form, details, quick answers |

Plus a persistent bag (drawer + `localStorage`) and a 404.

## Design decisions worth flagging

**Colours are sampled, not guessed.** Every surface value in
`src/styles/tokens.css` was read out of the comps: paper `#F2F1F6`, the pale
blue bands `#CFE1ED`, the product-page panel `#D0EBF2`, the Add to Bag fill
`#78A3C5`, the hero pill `#1B1A4A`. The four identity-sheet swatches are kept
verbatim alongside them as `--id-*`. Where the artwork and the identity sheet
disagreed the artwork won — its pale blues are noticeably deeper than the
sheet's Soft Pale Blue.

**Typefaces are substitutes.** The identity sheet specifies Chronos Serif and
Avenir Next, neither of which is licensed for web use here. Ranade carries the
body, UI and headlines; Cormorant Garamond stands in for the display serif on
the accents (stat numerals, pull-quotes, page-head titles).

Ranade is self-hosted rather than installed from npm: the download from
Fontshare lives in `fonts/`, and the six woff2 cuts the site actually sets are
copied into `public/fonts` and declared in `src/styles/fonts.css`. It is free
for personal and commercial use under ITF's Free Font License, a copy of which
ships at `public/fonts/Ranade-FFL.txt`. Ranade sets about 20% wider than DM Sans
did at the same size, so `--fs-hero` and `--fs-display` are tuned to it — the
hero size tracks the copy column rather than capping early, which is what keeps
the hero's longest line on one line between 1200 and 1500px. Both hero lines are
18 characters; anything much past 20 will wrap at those widths.

**Prices.** The collection grid gives four distinct prices ($95 / $110 / $65 /
$80); every product-page comp reused a single $89.00 placeholder. The per-product
prices win, and the boxed set is priced at the sum less the $45 it advertises —
there's a test for that.

**Every sentence is written once.** The comps supplied one product blurb reused
across all six SKUs, one review quote reused on every product page, and the
alpine-water paragraph four times over. The rewrite gives each surface its own
angle on the same brand: the hero makes the claim, `/story` tells the sourcing
story, the homepage proof band gives the mechanism, and the `/skincare` science
accordion gives the formulation reasoning. `/collection` is about the *order*,
so its per-step copy (`ritualNote`) is separate from the product-page paragraph
(`description`) a visitor reads immediately afterwards.

`scripts/copy-audit.mjs` enforces this: it walks all thirteen routes, opens every
accordion, strips the nav/footer/bag chrome, and fails if any sentence of six
words or more appears on two different routes.

```bash
npm run dev                                  # in one shell
node scripts/copy-audit.mjs http://localhost:5173
```

**Ritual order.** The comp's grid runs Serum, Cream, Toner, Radiance, which is
not the order you'd use them in. The homepage keeps the comp's order and labels
each card with its role only; `/collection` sorts by `step` and numbers them.

**The homepage hero clip.** `Untitled design.mp4` is a 1920x1080 split banner —
a teal panel carrying lorem-ipsum headlines on the left, the product-on-water
shot on the right. Only the right half ships; the site supplies its own copy on
the left. Because the review cards are composited into that artwork, the layout
doesn't repeat them in markup — and the plate is sized from its own width
against the clip's 952:1080 ratio rather than filling the column, so the frame
is never cropped horizontally. Filling the column magnified it and shaved 15px
off the right at 16:10 window shapes and 44px at 4:3, which clipped the cards.
Any vertical crop is taken off the top, where there is only water. Below 900px
the poster still is used and no video element is mounted, so nothing downloads
on mobile.

**The two water bands.** The Our Story narrative and the ritual grid share the
same water plate, the second rotated 180°, so they read as one continuous field
rather than a repeat. The ritual cards deliberately carry no entrance animation:
they blend onto that background with `mix-blend-mode`, and a transform or opacity
on a card would create a stacking context and isolate the blend.

**Hero sizing.** The hero is exactly one viewport from 360x740 up to 1920x1080 —
`scripts/fit.mjs` measures it at ten sizes. Both grid columns carry
`min-height: 0` so the video's intrinsic height can't push the row past the
viewport, and the stacked layout bounds the plate as a share of `svh`.

Media handling — the backdrop knockout and the hero clip crop — is documented in
[`public/CREDITS.md`](public/CREDITS.md).

## Motion

`src/styles/motion.css` holds the shared layer; four components and two hooks
drive it.

| Piece | What it does |
| --- | --- |
| `PageTransition` | Re-keys on navigation so every route fades in |
| `SplitText` | Splits a heading into words and cascades them in on scroll |
| `Stagger` | Cascades a group's direct children — one keyframe, `nth-child` index |
| `Parallax` | Media plate that drifts across the viewport and settles out of an over-scale |
| `useMediaQuery` | Keeps the hero video out of the DOM on small screens, rather than hiding it in CSS |
| `useParallax` | rAF-batched, writes `transform` straight to the node — a scroll never re-renders React |

Per page, on top of the shared reveals: the hero headline cascades word by word
and the proof cards float up behind it; the shop grid staggers, keyed on
filter+sort so it replays on every change; the
Skincare AM/PM panel crossfades and its steps slide in; Collection plates settle
out of a scale with the step numeral trailing; the product page cascades its
right-hand column per product and the bottle idles on a slow float; Our Story
drifts and slowly zooms the pinned plate as the narrative advances; Contact
cascades its fields.

Two constraints the whole layer is built around:

- **Only `opacity` and `transform`.** No filters, no animated shadows, nothing
  that triggers layout or paint on scroll. `will-change` is dropped as soon as
  an element finishes.
- **Never put a transform between a knocked-out product and its band.** A
  transform creates a stacking context, which isolates `mix-blend-mode` and
  brings the white plate back. That's why `PageTransition` fades rather than
  slides, why the product page floats the image rather than its stage, and why
  the ritual grid — which blends onto a photographic background — is the one
  grid with no entrance animation. Sections over a flat colour instead set
  `--plate` to that colour, which is immune to the whole problem.

## Accessibility & motion

- Skip link, labelled landmarks, visible focus rings.
- `prefers-reduced-motion` collapses every effect above — Lenis, the page
  transition, all reveals, staggers, parallax and the pinned narrative; the Our
  Story text becomes a plain readable stack.
- The scroll narrative is `aria-hidden` and the same copy is always present as
  screen-reader text, so the full story is read in order either way.
- Collapsed accordion panels are `inert`, so they stay out of the tab order.

## Scripts

`scripts/prepare-media.mjs` is the only one needed to build the site.
`shots.mjs`, `shot-full.mjs`, `scroll-shot.mjs`, `interact.mjs`, `fit.mjs`,
`probe.mjs` and `copy-audit.mjs` are Playwright helpers used while building —
they screenshot every route, drive the bag and menu, measure hero fit across ten
viewports, dump computed geometry, and check no sentence is used on two routes.
They need a Chromium; set `CHROME_PATH` to reuse one you already have.

## Demo notice

Fictional brand. Checkout is disabled, the contact form falls back to `mailto:`
unless `VITE_FORM_ENDPOINT` is set, and no orders are processed.
