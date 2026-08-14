import { describe, it, expect, beforeEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { CartProvider, useCart } from './CartContext'
import { getProduct } from '../data/products'

let cart

function Probe() {
  cart = useCart()
  return <span data-testid="count">{cart.count}</span>
}

const mount = () =>
  render(
    <CartProvider>
      <Probe />
    </CartProvider>
  )

describe('the bag', () => {
  beforeEach(() => {
    localStorage.clear()
    cart = undefined
  })

  it('adds a line and totals it', async () => {
    mount()
    const serum = getProduct('advanced-revitalizing-serum')
    await act(async () => cart.add(serum, '50ml'))

    expect(cart.count).toBe(1)
    expect(cart.subtotal).toBe(95)
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('merges repeat adds of the same size but keeps sizes apart', async () => {
    mount()
    const serum = getProduct('advanced-revitalizing-serum')
    await act(async () => cart.add(serum, '50ml'))
    await act(async () => cart.add(serum, '50ml'))
    expect(cart.lines).toHaveLength(1)
    expect(cart.count).toBe(2)

    await act(async () => cart.add(serum, '30ml'))
    expect(cart.lines).toHaveLength(2)
    expect(cart.count).toBe(3)
    expect(cart.subtotal).toBe(285)
  })

  it('drops a line when its quantity reaches zero', async () => {
    mount()
    const toner = getProduct('skin-balancing-toner')
    await act(async () => cart.add(toner, '150ml'))
    await act(async () => cart.setQty('skin-balancing-toner', '150ml', 0))
    expect(cart.lines).toHaveLength(0)
    expect(cart.subtotal).toBe(0)
  })

  it('restores the bag from storage on the next visit', async () => {
    mount()
    await act(async () => cart.add(getProduct('night-repair-cream'), '50ml'))
    expect(cart.count).toBe(1)

    cart = undefined
    mount()
    await act(async () => {})
    expect(cart.count).toBe(1)
    expect(cart.subtotal).toBe(110)
  })

  it('ignores stored lines for products that no longer exist', async () => {
    localStorage.setItem(
      'brand-cosmetics:bag',
      JSON.stringify([{ slug: 'discontinued-elixir', size: '50ml', qty: 3 }])
    )
    mount()
    await act(async () => {})
    expect(cart.count).toBe(0)
  })

  it('survives corrupt storage', async () => {
    localStorage.setItem('brand-cosmetics:bag', 'not json')
    mount()
    await act(async () => {})
    expect(cart.count).toBe(0)
  })
})
