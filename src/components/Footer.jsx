import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import './footer.css'

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      ['Shop All', '/shop'],
      ['The Collection', '/collection'],
      ['Serums', '/shop?c=Serums'],
      ['Moisturisers', '/shop?c=Moisturisers'],
      ['Sets', '/shop?c=Sets'],
    ],
  },
  {
    title: 'Discover',
    links: [
      ['Skincare', '/skincare'],
      ['Our Story', '/story'],
      ['Ingredients', '/skincare#science'],
      ['Contact', '/contact'],
    ],
  },
  {
    title: 'Care',
    links: [
      ['Shipping & Returns', '/contact'],
      ['Stockists', '/contact'],
      ['Press', '/contact'],
      ['Sustainability', '/story#sourcing'],
    ],
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
    setEmail('')
  }

  return (
    <footer className="foot">
      <div className="shell">
        <div className="foot__top">
          <div className="foot__brand">
            <Logo />
            <p className="foot__tagline display">Pure Radiance,<br />Delivered by Nature.</p>
            <form className="foot__signup" onSubmit={onSubmit}>
              <label htmlFor="foot-email" className="label">
                Letters from the atelier
              </label>
              <div className="foot__field">
                <input
                  id="foot-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <button type="submit" aria-label="Subscribe">
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                    <path
                      d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <p className="foot__note" role="status">
                {sent
                  ? 'You’re on the list. First letter goes out at the end of the month.'
                  : 'One a month. Formulation notes and restocks — we don’t sell your address.'}
              </p>
            </form>
          </div>

          <div className="foot__cols">
            {COLUMNS.map((col) => (
              <nav className="foot__col" key={col.title} aria-label={col.title}>
                <h2 className="foot__col-title label">{col.title}</h2>
                <ul>
                  {col.links.map(([label, to]) => (
                    <li key={label}>
                      <Link to={to}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="foot__bar">
          <p>© {new Date().getFullYear()} BRAND Cosmetics. All rights reserved.</p>
          <p className="foot__demo">
            A Summit Sites demo — fictional brand, no orders are processed.
          </p>
        </div>
      </div>
    </footer>
  )
}
