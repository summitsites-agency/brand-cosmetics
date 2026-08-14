import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { money } from '../data/products'
import Pill from './Pill'
import './cart-drawer.css'

const FREE_SHIPPING = 120

export default function CartDrawer() {
  const { lines, count, subtotal, open, closeBag, setQty, remove } = useCart()
  const panelRef = useRef(null)

  // Escape to close, and lock the page behind the drawer.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && closeBag()
    window.addEventListener('keydown', onKey)

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.lenis?.stop()
    panelRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      window.lenis?.start()
    }
  }, [open, closeBag])

  const toGo = Math.max(0, FREE_SHIPPING - subtotal)

  return (
    <>
      <div
        className={`bag-scrim ${open ? 'is-open' : ''}`}
        onClick={closeBag}
        aria-hidden="true"
      />
      <aside
        className={`bag ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        aria-hidden={!open}
        tabIndex={-1}
        ref={panelRef}
      >
        <header className="bag__head">
          <h2 className="bag__title display">Your bag</h2>
          <button type="button" className="bag__close" onClick={closeBag}>
            <span className="sr-only">Close bag</span>
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {count > 0 && (
          <div className="bag__ship">
            {toGo > 0 ? (
              <>
                <span>
                  {money(toGo)} away from complimentary shipping
                </span>
                <div className="bag__ship-track" aria-hidden="true">
                  <i style={{ transform: `scaleX(${Math.min(1, subtotal / FREE_SHIPPING)})` }} />
                </div>
              </>
            ) : (
              <span>Complimentary shipping unlocked</span>
            )}
          </div>
        )}

        <div className="bag__body">
          {count === 0 ? (
            <div className="bag__empty">
              <p className="lede">Nothing in here yet.</p>
              <p className="muted">
                Most people start with the set. The toner is the cheaper way to find out whether
                we&rsquo;re worth it.
              </p>
              <Pill to="/collection" variant="dark" arrow onClick={closeBag}>
                View the Collection
              </Pill>
            </div>
          ) : (
            <ul className="bag__lines">
              {lines.map(({ product, size, qty }) => (
                <li className="bag-line" key={`${product.slug}-${size}`}>
                  <Link
                    to={`/product/${product.slug}`}
                    className="bag-line__media"
                    onClick={closeBag}
                  >
                    <img
                      src={`/images/${product.image}@sm.jpg`}
                      alt=""
                      width="440"
                      height="550"
                      loading="lazy"
                    />
                  </Link>
                  <div className="bag-line__info">
                    <Link
                      to={`/product/${product.slug}`}
                      className="bag-line__name"
                      onClick={closeBag}
                    >
                      {product.name}
                    </Link>
                    <p className="bag-line__meta muted">{size}</p>
                    <div className="bag-line__foot">
                      <div className="qty">
                        <button
                          type="button"
                          onClick={() => setQty(product.slug, size, qty - 1)}
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          −
                        </button>
                        <span aria-live="polite">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(product.slug, size, qty + 1)}
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          +
                        </button>
                      </div>
                      <span className="bag-line__price">{money(product.price * qty)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bag-line__remove"
                    onClick={() => remove(product.slug, size)}
                  >
                    <span className="sr-only">Remove {product.name}</span>
                    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                      <path
                        d="M3 3l10 10M13 3L3 13"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {count > 0 && (
          <footer className="bag__foot">
            <div className="bag__total">
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>
            <p className="bag__note muted">
              Taxes and shipping calculated at checkout.
            </p>
            <Pill variant="slate" size="lg" className="pill--block" disabled>
              Checkout
            </Pill>
            <p className="bag__demo">This is a demo storefront — checkout is disabled.</p>
          </footer>
        )}
      </aside>
    </>
  )
}
