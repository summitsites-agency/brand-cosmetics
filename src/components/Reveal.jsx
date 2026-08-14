import { useReveal } from '../hooks/useReveal'
import './reveal.css'

/**
 * Fade-and-rise wrapper. `as` keeps the markup semantic, `delay` staggers
 * siblings without needing a keyframe per child.
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  y = 22,
  className = '',
  children,
  ...rest
}) {
  const [ref, shown] = useReveal()
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'is-shown' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms`, '--reveal-y': `${y}px` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
