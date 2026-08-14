import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import Pill from '../components/Pill'
import Reveal from '../components/Reveal'
import SplitText from '../components/SplitText'
import Stagger from '../components/Stagger'
import Parallax from '../components/Parallax'
import { ritual, getProduct, money } from '../data/products'
import { useCart } from '../cart/CartContext'
import './collection.css'

/**
 * The Radiance Ritual, told as an ordered set rather than a catalogue grid:
 * four numbered steps in alternating bands, closing on the boxed set.
 */
export default function Collection() {
  const steps = ritual()
  const set = getProduct('the-radiance-ritual-set')
  const { add } = useCart()

  const apart = steps.reduce((n, p) => n + p.price, 0)

  return (
    <>
      <PageHead
        eyebrow="The Collection"
        title="The Radiance Ritual"
        lede="Read it top to bottom. That is also how you wear it — the numbers are not decorative, and skipping one costs you more than it saves."
      />

      <section className="coll">
        {steps.map((p, i) => (
          <div className={`coll__step ${i % 2 ? 'is-flipped' : ''}`} key={p.slug}>
            <div className="shell coll__grid">
              <Reveal className="coll__media" y={34}>
                <img
                  src={`/images/${p.image}.jpg`}
                  alt={p.name}
                  width="900"
                  height="1125"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
                <span className="coll__step-n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </Reveal>

              <Stagger className="coll__copy" step={80}>
                <p className="label">Step {String(p.step).padStart(2, '0')} — {p.role}</p>
                <h2 className="coll__name display">
                  <SplitText text={p.name} stagger={44} delay={120} />
                </h2>
                <p className="lede">{p.short}</p>
                {/* Why it sits at this point in the sequence — deliberately not
                    the PDP paragraph, which the visitor reads next. */}
                <p className="coll__desc">{p.ritualNote}</p>

                <ul className="coll__keys">
                  {p.ingredients.slice(0, 3).map((ing) => (
                    <li key={ing}>{ing}</li>
                  ))}
                </ul>

                <div className="coll__actions">
                  <Pill to={`/product/${p.slug}`} variant="dark" arrow>
                    {money(p.price)} — View
                  </Pill>
                  <button type="button" className="coll__quick" onClick={() => add(p, p.size)}>
                    Add to bag
                  </button>
                </div>
              </Stagger>
            </div>
          </div>
        ))}
      </section>

      {set && (
        <section className="coll__set">
          <div className="shell coll__set-grid">
            <Stagger className="coll__set-copy" step={90}>
              <p className="label">All four, in one box</p>
              <h2 className="display coll__set-title">
                <SplitText text={set.name} stagger={46} />
              </h2>
              <p className="lede">{set.ritualNote}</p>
              <p className="coll__set-price">
                <strong>{money(set.price)}</strong>
                <s>{money(apart)}</s>
                <span className="coll__set-save">Save {money(apart - set.price)}</span>
              </p>
              <div className="coll__actions">
                <Pill variant="light" size="lg" arrow onClick={() => add(set, set.size)}>
                  Add the set to bag
                </Pill>
                <Link to={`/product/${set.slug}`} className="coll__set-link">
                  See what&rsquo;s inside
                </Link>
              </div>
            </Stagger>
            <Parallax
              className="coll__set-media"
              src="/images/ritual-pour.jpg"
              alt="Serum poured into an open palm in a sunlit garden"
              width="1376"
              height="768"
              distance={50}
            />
          </div>
        </section>
      )}
    </>
  )
}
