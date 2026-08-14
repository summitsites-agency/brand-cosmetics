import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useCart } from '../cart/CartContext'
import './nav.css'

const LINKS = [
  { to: '/shop', label: 'Shop All' },
  { to: '/skincare', label: 'Skincare' },
  { to: '/collection', label: 'Collection' },
  { to: '/story', label: 'Our Story' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, openBag } = useCart()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav__row">
        <Link to="/" className="nav__brand" aria-label="BRAND Cosmetics — home">
          <Logo />
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__end">
          <button
            type="button"
            className="nav__bag"
            onClick={openBag}
            aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}
          >
            Bag
            <span className={`nav__count ${count ? 'is-full' : ''}`}>{count}</span>
          </button>
          <button
            type="button"
            className="nav__burger"
            aria-expanded={menuOpen}
            aria-controls="nav-sheet"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className={`nav__burger-ico ${menuOpen ? 'is-open' : ''}`} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div id="nav-sheet" className={`nav__sheet ${menuOpen ? 'is-open' : ''}`} hidden={!menuOpen}>
        {[...LINKS, { to: '/contact', label: 'Contact' }].map((l, i) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `nav__sheet-link ${isActive ? 'is-active' : ''}`}
            style={{ '--i': i }}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </header>
  )
}
