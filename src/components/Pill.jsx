import { Link } from 'react-router-dom'
import './pill.css'

/**
 * The comps lean on one shape for every call to action: a pill.
 * Variants map to the ones that actually appear in the artwork —
 *   dark   = hero "Shop Now" (deep indigo, leading arrow disc)
 *   slate  = product page "Add to Bag"
 *   ghost  = collection grid "Shop Now" (hairline outline)
 *   light  = frosted pill on imagery
 */
export default function Pill({
  to,
  href,
  variant = 'dark',
  size = 'md',
  arrow = false,
  className = '',
  children,
  ...rest
}) {
  const cls = `pill pill--${variant} pill--${size} ${arrow ? 'pill--arrow' : ''} ${className}`
  const inner = (
    <>
      {arrow && (
        <span className="pill__disc" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
            <path
              d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      <span className="pill__label">{children}</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {inner}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" className={cls} {...rest}>
      {inner}
    </button>
  )
}
