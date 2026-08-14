import { useEffect, useState } from 'react'

/**
 * Subscribes to a media query. Used to keep the hero video out of the DOM
 * entirely on small screens — a CSS `display: none` would still download and
 * decode the file, which is the cost we're trying to avoid.
 *
 * Starts false so the first paint is the lightweight branch; the effect
 * corrects it before the browser has anything to show.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const onChange = (e) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
