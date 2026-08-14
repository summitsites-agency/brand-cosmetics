import { useEffect, useRef } from 'react'

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Drifts an element as it crosses the viewport. Returns [frameRef, innerRef]:
 * the frame is the clipping box, the inner is what actually moves.
 *
 * The transform is written straight to the node — no React state — so a scroll
 * never triggers a render. Work is rAF-batched, and elements off screen are
 * skipped entirely.
 *
 * @param {number} distance total travel in px across a full viewport crossing
 */
export function useParallax(distance = 46) {
  const frame = useRef(null)
  const inner = useRef(null)

  useEffect(() => {
    if (REDUCED) return
    const box = frame.current
    const el = inner.current
    if (!box || !el) return

    let raf = 0
    let visible = true

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
            rootMargin: '80px',
          })
        : null
    io?.observe(box)

    const measure = () => {
      raf = 0
      if (!visible) return
      const rect = box.getBoundingClientRect()
      const vh = window.innerHeight
      // -1 when the box is just below the fold, +1 once it's just above it.
      const t = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2)
      const shift = Math.max(-1, Math.min(1, t)) * (distance / 2)
      el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      io?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [distance])

  return [frame, inner]
}
