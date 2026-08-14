/**
 * Copy audit.
 *
 * Walks every route, pulls the visible text, and reports sentences that appear
 * more than once across the site. Chrome/footer text is expected to repeat, so
 * anything inside <header>/<footer> is excluded before comparing.
 *
 *   node scripts/copy-audit.mjs [baseURL]
 *
 * Needs a Chromium — set CHROME_PATH to reuse one you already have.
 */
import { chromium } from 'playwright'

const BASE = process.argv[2] || 'http://localhost:5173'

const ROUTES = [
  '/',
  '/shop',
  '/skincare',
  '/collection',
  '/story',
  '/contact',
  '/product/advanced-revitalizing-serum',
  '/product/night-repair-cream',
  '/product/skin-balancing-toner',
  '/product/radiance-boosting-serum',
  '/product/hydrating-serum-duo',
  '/product/the-radiance-ritual-set',
  '/nope-404',
]

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

/** sentence -> Set of routes it appeared on */
const seen = new Map()

for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: 'networkidle' })

  // Open every accordion so collapsed copy is in the sample too.
  await page.evaluate(() => {
    for (const b of document.querySelectorAll('button[aria-expanded="false"]')) b.click()
  })
  await page.waitForTimeout(120)

  const text = await page.evaluate(() => {
    const doc = document.cloneNode(true)
    // Chrome that is mounted on every route and so repeats by design: the nav,
    // the footer and the bag drawer. Plus the SR-only mirror of the scroll
    // narrative, which is deliberately the same words as the visual stage.
    for (const el of doc.querySelectorAll('header.nav, footer.foot, aside.bag, .story-flat')) {
      el.remove()
    }
    return doc.body.innerText
  })

  for (const raw of text.split(/(?<=[.?!])\s+|\n+/)) {
    const s = raw.replace(/\s+/g, ' ').trim()
    // Ignore short fragments: labels, prices, button text, nav crumbs.
    if (s.split(' ').length < 6) continue
    if (!seen.has(s)) seen.set(s, new Set())
    seen.get(s).add(route)
  }
}

await browser.close()

const dupes = [...seen.entries()].filter(([, routes]) => routes.size > 1)

if (!dupes.length) {
  console.log(`✓ no sentence appears on more than one route (${ROUTES.length} routes checked)`)
  process.exit(0)
}

console.log(`✗ ${dupes.length} sentence(s) repeat across routes:\n`)
for (const [sentence, routes] of dupes.sort((a, b) => b[1].size - a[1].size)) {
  console.log(`  [${routes.size}×] ${sentence}`)
  console.log(`        ${[...routes].join(', ')}\n`)
}
process.exit(1)
