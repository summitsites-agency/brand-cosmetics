import { describe, it, expect } from 'vitest'
import { products, categories, getProduct, featured, ritual, money } from './products'

describe('catalogue', () => {
  it('has unique slugs', () => {
    const slugs = products.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('only uses categories the filter bar offers', () => {
    for (const p of products) {
      expect(categories).toContain(p.category)
    }
  })

  it('gives every product a default size that is one of its sizes', () => {
    for (const p of products) {
      expect(p.sizes.length).toBeGreaterThan(0)
      expect(p.sizes).toContain(p.size)
    }
  })

  it('resolves products by slug and nothing for unknown ones', () => {
    expect(getProduct('night-repair-cream')?.name).toBe('Night Repair Cream')
    expect(getProduct('does-not-exist')).toBeUndefined()
  })

  it('features exactly the four ritual steps, in order', () => {
    expect(featured()).toHaveLength(4)
    expect(ritual().map((p) => p.step)).toEqual([1, 2, 3, 4])
  })

  it('prices the set below the sum of its parts, by the amount it advertises', () => {
    const set = getProduct('the-radiance-ritual-set')
    const apart = ritual().reduce((n, p) => n + p.price, 0)
    expect(set.compareAt).toBe(apart)
    expect(apart - set.price).toBe(45)
  })

  it('only marks a product knocked out when both studio shots were prepared', () => {
    // The knockout LUT runs on the eight studio plates only — see
    // scripts/prepare-media.mjs. Blending a hand shot would wreck the skin tones.
    const studio = new Set([
      'serum-revitalizing',
      'serum-revitalizing-back',
      'cream-night-repair',
      'cream-night-repair-back',
      'toner-balancing',
      'toner-balancing-back',
      'serum-radiance',
      'serum-radiance-back',
    ])
    for (const p of products.filter((p) => p.knockout)) {
      expect(studio.has(p.image), `${p.slug} front`).toBe(true)
      expect(studio.has(p.imageBack), `${p.slug} back`).toBe(true)
    }
  })
})

describe('money', () => {
  it('formats to two decimals in USD', () => {
    expect(money(95)).toBe('$95.00')
    expect(money(305)).toBe('$305.00')
  })
})
