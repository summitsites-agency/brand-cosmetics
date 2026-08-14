import { useParallax } from '../hooks/useParallax'
import { useReveal } from '../hooks/useReveal'

/**
 * A media plate that drifts as it crosses the viewport and settles out of a
 * slight over-scale the first time it's seen.
 */
export default function Parallax({
  as: Tag = 'div',
  src,
  alt = '',
  width,
  height,
  distance = 46,
  className = '',
  loading = 'lazy',
}) {
  const [frame, inner] = useParallax(distance)
  const [revealRef, shown] = useReveal({ threshold: 0.1 })

  return (
    <Tag
      ref={(node) => {
        frame.current = node
        revealRef.current = node
      }}
      className={`par plate-in ${shown ? 'is-shown' : ''} ${className}`}
    >
      <div className="par__inner" ref={inner}>
        <img src={src} alt={alt} width={width} height={height} loading={loading} decoding="async" />
      </div>
    </Tag>
  )
}
