import { useEffect, useRef, useState } from 'react'

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Reveals an element once it enters the viewport. Returns [ref, shown].
 * With reduced motion the element starts shown, so nothing ever animates in.
 */
export function useReveal({ threshold = 0.16, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(REDUCED)

  useEffect(() => {
    if (REDUCED) return
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin])

  return [ref, shown]
}
