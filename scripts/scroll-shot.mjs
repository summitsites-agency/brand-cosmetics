/** Screenshot a route at given scroll offsets: node scripts/scroll-shot.mjs <route> <out> <y1,y2,...> */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
const base = process.env.BASE || 'http://localhost:5174'
const route = process.argv[2] || '/'
const out = process.argv[3] || 'C:/tmp/scroll'
const ys = (process.argv[4] || '0').split(',').map(Number)
const w = Number(process.argv[5] || 1440)
const h = Number(process.argv[6] || 900)
await mkdir(out, { recursive: true })
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
const p = await b.newPage({ viewport: { width: w, height: h } })
await p.goto(base + route, { waitUntil: 'networkidle' })
for (const y of ys) {
  await p.evaluate((y) => window.scrollTo(0, y), y)
  await p.waitForTimeout(750)
  await p.screenshot({ path: `${out}/y${y}.png` })
}
await b.close()
console.log('ok', ys.join(' '))
