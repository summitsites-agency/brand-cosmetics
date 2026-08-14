import { useLocation } from 'react-router-dom'

/**
 * Re-keys on every navigation so the enter animation replays. Fades only —
 * a transform here would become the containing block for the sticky rails on
 * Skincare and the pinned narrative on Our Story, and break both.
 */
export default function PageTransition({ children }) {
  const { pathname } = useLocation()
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  )
}
