import { useReveal } from '../hooks/useReveal'

/**
 * Cascades its direct children in when the group scrolls into view. One
 * keyframe plus an nth-child index drives the whole list, so adding an item
 * costs nothing — see .stagger in styles/motion.css.
 */
export default function Stagger({
  as: Tag = 'div',
  step = 70,
  threshold = 0.14,
  className = '',
  children,
  ...rest
}) {
  const [ref, shown] = useReveal({ threshold })
  return (
    <Tag
      ref={ref}
      className={`stagger ${shown ? 'is-shown' : ''} ${className}`}
      style={{ '--stagger': `${step}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
