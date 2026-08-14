import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { products } from '../data/products'

const CartContext = createContext(null)
const STORAGE_KEY = 'brand-cosmetics:bag'

/** Lines are stored as { slug, size, qty } so the same product in two sizes stays separate. */
const lineId = (slug, size) => `${slug}__${size}`

function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const { slug, size, qty = 1 } = action
      const id = lineId(slug, size)
      const existing = lines.find((l) => lineId(l.slug, l.size) === id)
      if (existing) {
        return lines.map((l) =>
          lineId(l.slug, l.size) === id ? { ...l, qty: Math.min(99, l.qty + qty) } : l
        )
      }
      return [...lines, { slug, size, qty }]
    }
    case 'setQty': {
      const id = lineId(action.slug, action.size)
      if (action.qty <= 0) return lines.filter((l) => lineId(l.slug, l.size) !== id)
      return lines.map((l) =>
        lineId(l.slug, l.size) === id ? { ...l, qty: Math.min(99, action.qty) } : l
      )
    }
    case 'remove':
      return lines.filter((l) => lineId(l.slug, l.size) !== lineId(action.slug, action.size))
    case 'clear':
      return []
    case 'hydrate':
      return action.lines
    default:
      return lines
  }
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Drop anything that no longer matches the catalogue.
    return parsed.filter(
      (l) => l && typeof l.slug === 'string' && products.some((p) => p.slug === l.slug)
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, [])
  const [open, setOpen] = useState(false)
  const [flash, setFlash] = useState(null)

  useEffect(() => {
    const stored = readStored()
    if (stored.length) dispatch({ type: 'hydrate', lines: stored })
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* private mode — the bag just won't persist */
    }
  }, [lines])

  const add = useCallback((product, size, qty = 1) => {
    dispatch({ type: 'add', slug: product.slug, size: size || product.size, qty })
    setFlash(product.name)
    setOpen(true)
  }, [])

  // Clear the "just added" toast a beat after it appears.
  useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(null), 2600)
    return () => clearTimeout(t)
  }, [flash])

  const detailed = useMemo(
    () =>
      lines
        .map((l) => {
          const product = products.find((p) => p.slug === l.slug)
          return product ? { ...l, product } : null
        })
        .filter(Boolean),
    [lines]
  )

  const count = useMemo(() => detailed.reduce((n, l) => n + l.qty, 0), [detailed])
  const subtotal = useMemo(
    () => detailed.reduce((n, l) => n + l.product.price * l.qty, 0),
    [detailed]
  )

  const value = useMemo(
    () => ({
      lines: detailed,
      count,
      subtotal,
      open,
      flash,
      add,
      setQty: (slug, size, qty) => dispatch({ type: 'setQty', slug, size, qty }),
      remove: (slug, size) => dispatch({ type: 'remove', slug, size }),
      clear: () => dispatch({ type: 'clear' }),
      openBag: () => setOpen(true),
      closeBag: () => setOpen(false),
    }),
    [detailed, count, subtotal, open, flash, add]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
