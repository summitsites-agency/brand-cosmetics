import { useEffect, useRef, useState } from 'react'

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Reports how far a tall element has been scrolled through, as 0..1.
 *
 * Used by the Our Story narrative, where a stack of statements crossfades over
 * a pinned water plate. Reads are batched into rAF and the value is quantised
 * to 1/200ths so React only re-renders on a visible change.
 */
export function useScrollStage() {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || REDUCED) return

    let frame = 0
    const measure = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      if (travel <= 0) {
        setProgress(0)
        return
      }
      const raw = -rect.top / travel
      const clamped = Math.max(0, Math.min(1, raw))
      setProgress((prev) => {
        const next = Math.round(clamped * 200) / 200
        return next === prev ? prev : next
      })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return [ref, progress]
}
