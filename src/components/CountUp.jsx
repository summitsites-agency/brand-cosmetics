import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Counts to `to` once scrolled into view. Lands exactly on the target value. */
export default function CountUp({ to, decimals = 0, duration = 1400, suffix = '', prefix = '' }) {
  const [ref, shown] = useReveal({ threshold: 0.4 })
  const [value, setValue] = useState(REDUCED ? to : 0)
  const raf = useRef(0)

  useEffect(() => {
    if (!shown || REDUCED) return
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(to * eased)
      if (t < 1) raf.current = requestAnimationFrame(tick)
      else setValue(to)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [shown, to, duration])

  return (
    <span ref={ref}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  )
}
