/** Dump computed geometry for a selector: node scripts/probe.mjs /skincare ".skin__step-img" */
import { chromium } from 'playwright'

const base = process.env.BASE || 'http://localhost:5174'
const route = process.argv[2] || '/'
const sel = process.argv[3] || 'body'

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
)
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(base + route, { waitUntil: 'networkidle' })
const out = await page.$$eval(sel, (els) =>
  els.slice(0, 6).map((el) => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return {
      tag: el.tagName,
      cls: el.className,
      box: `${Math.round(r.width)}x${Math.round(r.height)}`,
      aspectRatio: cs.aspectRatio,
      objectFit: cs.objectFit,
      width: cs.width,
      height: cs.height,
      alignSelf: cs.alignSelf,
      gridColumn: cs.gridColumnStart + '/' + cs.gridColumnEnd,
    }
  })
)
console.log(JSON.stringify(out, null, 2))
await browser.close()
