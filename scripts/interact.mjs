/** Drives the interactive bits and screenshots each state. */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const base = process.env.BASE || 'http://localhost:5174'
const out = process.env.OUT || 'C:/tmp/interact'
await mkdir(out, { recursive: true })

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
)
const problems = []
const watch = (page, tag) => {
  page.on('console', (m) => m.type() === 'error' && problems.push(`${tag} console: ${m.text()}`))
  page.on('pageerror', (e) => problems.push(`${tag} pageerror: ${e.message}`))
}

/* ---- desktop: PDP -> add to bag -> drawer -> qty -> accordion ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  watch(page, '[desk]')
  await page.goto(`${base}/product/night-repair-cream`, { waitUntil: 'networkidle' })

  await page.getByRole('button', { name: 'Add to Bag' }).click()
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${out}/bag-open.png` })

  const count = await page.locator('.nav__count').innerText()
  if (count.trim() !== '1') problems.push(`bag count expected 1, got "${count.trim()}"`)

  // Bump quantity, confirm subtotal follows.
  await page.locator('.qty button', { hasText: '+' }).click()
  await page.waitForTimeout(300)
  const subtotal = await page.locator('.bag__total strong').innerText()
  if (!subtotal.includes('220')) problems.push(`subtotal expected $220.00, got "${subtotal}"`)
  await page.screenshot({ path: `${out}/bag-qty.png` })

  // Persistence across a reload.
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const after = await page.locator('.nav__count').innerText()
  if (after.trim() !== '2') problems.push(`bag did not persist, got "${after.trim()}"`)

  // Accordion opens.
  await page.getByRole('button', { name: 'Ingredients' }).click()
  await page.waitForTimeout(600)
  const expanded = await page
    .getByRole('button', { name: 'Ingredients' })
    .getAttribute('aria-expanded')
  if (expanded !== 'true') problems.push(`accordion aria-expanded = ${expanded}`)
  await page.screenshot({ path: `${out}/accordion.png` })

  await page.close()
}

/* ---- desktop: shop filters ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  watch(page, '[shop]')
  await page.goto(`${base}/shop`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Serums', exact: true }).click()
  await page.waitForTimeout(500)
  const n = await page.locator('.pcard').count()
  if (n !== 2) problems.push(`Serums filter expected 2 cards, got ${n}`)
  if (!page.url().includes('c=Serums')) problems.push(`filter did not sync to URL: ${page.url()}`)
  await page.screenshot({ path: `${out}/shop-filter.png` })
  await page.close()
}

/* ---- mobile: burger menu ---- */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  watch(page, '[mob]')
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.locator('.nav__burger').click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${out}/mob-menu.png` })

  await page.locator('#nav-sheet').getByRole('link', { name: 'Our Story' }).click()
  await page.waitForTimeout(900)
  if (!page.url().endsWith('/story')) problems.push(`menu nav failed: ${page.url()}`)
  const stillOpen = await page.locator('.nav__sheet.is-open').count()
  if (stillOpen) problems.push('mobile menu stayed open after navigating')
  await page.screenshot({ path: `${out}/mob-story.png` })
  await page.close()
}

/* ---- reduced motion: the story stack must still be readable.
       The narrative now opens the homepage, not /story. ---- */
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  const page = await ctx.newPage()
  watch(page, '[rm]')
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  const flat = await page.locator('.story-flat').isVisible()
  if (!flat) problems.push('reduced-motion fallback for the story narrative is not visible')
  await page.screenshot({ path: `${out}/reduced-story.png`, fullPage: false })
  await ctx.close()
}

await browser.close()
if (problems.length) {
  console.log('PROBLEMS:')
  for (const p of problems) console.log('  ' + p)
  process.exitCode = 1
} else {
  console.log('All interaction checks passed.')
}
