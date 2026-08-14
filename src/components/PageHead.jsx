import { useParallax } from '../hooks/useParallax'
import SplitText from './SplitText'
import './page-head.css'

/**
 * Shared inner-page masthead. Sits on the water plate so every non-home route
 * opens on the same rippling field the comps use behind the Our Story frames.
 *
 * On arrival: the plate drifts, the eyebrow and lede rise, and the title
 * cascades in word by word.
 */
export default function PageHead({ eyebrow, title, lede, serif = true, plate = true }) {
  const [frame, inner] = useParallax(60)

  return (
    <header className={`phead ${plate ? 'phead--plate' : ''}`} ref={frame}>
      {plate && (
        <div className="phead__plate-frame" ref={inner} aria-hidden="true">
          <img className="phead__plate" src="/images/water-plate.jpg" alt="" />
        </div>
      )}
      <div className="shell phead__inner">
        {eyebrow && <p className="label phead__eyebrow">{eyebrow}</p>}
        <h1 className={`phead__title ${serif ? 'display' : ''}`}>
          <SplitText text={title} stagger={42} delay={120} />
        </h1>
        {lede && <p className="lede phead__lede">{lede}</p>}
      </div>
    </header>
  )
}
