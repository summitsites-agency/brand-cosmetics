/**
 * Screenshot every route at a few widths, and surface any console errors.
 *   node scripts/shots.mjs [baseUrl] [outDir]
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const base = process.argv[2] || 'http://localhost:5174'
const out = process.argv[3] || 'shots'

const ROUTES = [
  ['home', '/'],
  ['shop', '/shop'],
  ['skincare', '/skincare'],
  ['collection', '/collection'],
  ['story', '/story'],
  ['contact', '/contact'],
  ['product', '/product/advanced-revitalizing-serum'],
  ['notfound', '/nope'],
]

const SIZES = [
  ['desk', 1440, 900],
  ['mob', 390, 844],
]

await mkdir(out, { recursive: true })
// This machine already has browsers from another Playwright install; reuse one
// rather than downloading a second copy.
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
)
const problems = []

for (const [sizeName, width, height] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()

  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`[${sizeName}] console: ${m.text()}`)
  })
  page.on('pageerror', (e) => problems.push(`[${sizeName}] pageerror: ${e.message}`))
  page.on('requestfailed', (r) =>
    problems.push(`[${sizeName}] 404/failed: ${r.url()} — ${r.failure()?.errorText}`)
  )
  page.on('response', (r) => {
    if (r.status() >= 400) problems.push(`[${sizeName}] HTTP ${r.status()}: ${r.url()}`)
  })

  for (const [name, path] of ROUTES) {
    await page.goto(base + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(700)
    await page.screenshot({ path: `${out}/${name}-${sizeName}.png` })

    // Also grab a mid-scroll frame for the pinned narrative.
    if (name === 'story') {
      await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2.4))
      await page.waitForTimeout(600)
      await page.screenshot({ path: `${out}/${name}-${sizeName}-mid.png` })
    }
    if (name === 'home' && sizeName === 'desk') {
      await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.15))
      await page.waitForTimeout(700)
      await page.screenshot({ path: `${out}/home-ritual-desk.png` })
    }
  }
  await ctx.close()
}

await browser.close()

if (problems.length) {
  console.log('PROBLEMS:')
  for (const p of [...new Set(problems)]) console.log('  ' + p)
} else {
  console.log('No console errors or failed requests.')
}
