import { useReveal } from '../hooks/useReveal'

/**
 * Splits a string into words and staggers them in once the heading scrolls
 * into view. Words stay inline-block so lines still wrap naturally, and each
 * carries its own index so one keyframe drives the whole cascade.
 *
 * Text only — pass plain strings, not markup.
 */
export default function SplitText({
  text,
  as: Tag = 'span',
  stagger = 34,
  delay = 0,
  className = '',
}) {
  const [ref, shown] = useReveal({ threshold: 0.25 })
  const words = String(text).split(' ')

  return (
    <Tag
      ref={ref}
      className={`split ${shown ? 'is-shown' : ''} ${className}`}
      style={{ '--stagger': `${stagger}ms`, '--split-delay': `${delay}ms` }}
    >
      {words.map((word, i) => (
        <span className="split__w" style={{ '--i': i }} key={`${word}-${i}`}>
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
