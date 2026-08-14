/** Reports hero fit + horizontal overflow across common viewports. */
import { chromium } from 'playwright'

const base = process.env.BASE || 'http://localhost:5174'
const route = process.argv[2] || '/'

const SIZES = [
  [1920, 1080, 'desktop-fhd'],
  [1680, 1050, 'desktop-16:10'],
  [1440, 900, 'laptop-16:10'],
  [1366, 768, 'laptop-hd'],
  [1280, 720, 'laptop-small'],
  [1024, 768, 'tablet-ls'],
  [820, 1180, 'tablet-pt'],
  [430, 932, 'phone-lg'],
  [390, 844, 'phone'],
  [360, 740, 'phone-sm'],
]

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
)

console.log('viewport            hero        fits?  docW  overflowing elements')
for (const [w, h, name] of SIZES) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.goto(base + route, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)

  const r = await page.evaluate(() => {
    const hero = document.querySelector('.hero')
    const heroH = hero ? Math.round(hero.getBoundingClientRect().height) : 0
    const docW = document.documentElement.scrollWidth
    const over = []
    for (const el of document.querySelectorAll('body *')) {
      const b = el.getBoundingClientRect()
      if (b.width === 0) continue
      if (b.right > window.innerWidth + 1 || b.left < -1) {
        over.push(
          `${el.tagName.toLowerCase()}.${String(el.className).split(' ').filter(Boolean)[0] || '?'}` +
            `(${Math.round(b.left)}..${Math.round(b.right)})`
        )
      }
    }
    return { heroH, docW, over: [...new Set(over)].slice(0, 4) }
  })

  const fits = r.heroH <= h + 1 ? 'yes' : `NO (+${r.heroH - h})`
  const scroll = r.docW > w ? `  H-SCROLL docW=${r.docW}` : ''
  console.log(
    `${name.padEnd(16)} ${String(w) + 'x' + h}`.padEnd(32) +
      `${String(r.heroH).padStart(5)}  ${fits.padEnd(10)}${scroll} ${r.over.join(' ')}`
  )
  await page.close()
}
await browser.close()
