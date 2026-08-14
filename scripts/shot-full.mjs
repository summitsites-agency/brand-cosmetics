/** Full-page screenshot of one route: node scripts/shot-full.mjs /collection out.png [width] */
import { chromium } from 'playwright'

const base = process.env.BASE || 'http://localhost:5174'
const route = process.argv[2] || '/'
const out = process.argv[3] || 'full.png'
const width = Number(process.argv[4] || 1440)

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
)
const page = await browser.newPage({ viewport: { width, height: 900 } })
await page.goto(base + route, { waitUntil: 'networkidle' })
// Walk the page so every Reveal fires before the capture.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 120))
  }
  window.scrollTo(0, 0)
})
await page.waitForTimeout(800)
await page.screenshot({ path: out, fullPage: true })
await browser.close()
console.log('wrote', out)
