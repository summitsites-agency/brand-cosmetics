import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'

/**
 * Mounts Lenis once for the whole app and resets scroll on navigation.
 * Skipped entirely under prefers-reduced-motion, where native scrolling is
 * both cheaper and what the user asked for.
 */
export default function SmoothScroll({ children }) {
  const { pathname } = useLocation()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    window.lenis = lenis

    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      delete window.lenis
    }
  }, [])

  // New route, new page: always start at the top.
  useEffect(() => {
    if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])

  return children
}
