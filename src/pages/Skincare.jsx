import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import Accordion from '../components/Accordion'
import Pill from '../components/Pill'
import Reveal from '../components/Reveal'
import SplitText from '../components/SplitText'
import Stagger from '../components/Stagger'
import { getProduct, money } from '../data/products'
import './skincare.css'

const ROUTINES = {
  AM: {
    label: 'Morning',
    note: 'About a minute, before coffee. Whatever else you skip, do not skip the SPF.',
    image: 'ritual-mist',
    alt: 'Facial mist applied in a sunlit garden',
    steps: [
      {
        slug: 'skin-balancing-toner',
        do: 'Two mists over clean skin. Move on while it is still damp — that is the whole trick.',
      },
      {
        slug: 'radiance-boosting-serum',
        do: 'Two or three drops. Press it in, do not rub it in.',
      },
      {
        slug: 'night-repair-cream',
        do: 'A thin pass only. The generous layer is an evening thing.',
      },
    ],
  },
  PM: {
    label: 'Evening',
    note: 'Skin repairs hardest between 11pm and 4am. This is you loading the shelves before it does.',
    image: 'ritual-cream',
    alt: 'Night Repair Cream applied to the cheek',
    steps: [
      {
        slug: 'skin-balancing-toner',
        do: 'Sweep it on with a pad to take the day off properly.',
      },
      {
        slug: 'advanced-revitalizing-serum',
        do: 'Three or four drops, face and neck. Give it a minute to disappear.',
      },
      {
        slug: 'night-repair-cream',
        do: 'A pearl-sized amount, pressed in to seal everything underneath it.',
      },
    ],
  },
}

const CONCERNS = [
  {
    name: 'It looks tired',
    body: 'Usually uneven tone, not anything structural — light catches on the patches instead of bouncing off cleanly. Vitamin C every morning, and expect week six before you notice, not week one.',
    pick: 'radiance-boosting-serum',
  },
  {
    name: 'It feels tight',
    body: 'Almost always a barrier problem, not a thirst problem, which is why drinking more water changes nothing. Put the lipids back and the moisture stays where you put it.',
    pick: 'night-repair-cream',
  },
  {
    name: 'Lines are settling in',
    body: 'Two separate jobs: hydration to plump what is there now, actives to work on what is underneath. Our most concentrated serum is the one product doing both at once.',
    pick: 'advanced-revitalizing-serum',
  },
  {
    name: 'Nothing seems to absorb',
    body: 'Nine times out of ten you are applying to skin that is too dry and too alkaline straight after cleansing. Fix the surface first and the expensive steps start earning their keep.',
    pick: 'skin-balancing-toner',
  },
]

const SCIENCE = [
  {
    title: 'Why the water matters',
    content: (
      <p>
        Municipal water carries chlorination by-products and a mineral load that quietly destabilises
        actives, so most brands have to formulate defensively around it. Ours does not have that
        problem, which buys us headroom: higher concentrations, fewer buffering agents, and a
        shorter ingredient list at the end of it.
      </p>
    ),
  },
  {
    title: 'Three weights of hyaluronic acid',
    content: (
      <p>
        Sodium hyaluronate is sold at a range of molecular weights, and each one only reaches one
        depth. A heavy weight holds water at the surface and does nothing below it. A low weight
        travels but leaves the surface unprotected. We pay for all three and layer them, which is
        the difference between skin that looks hydrated and skin that is.
      </p>
    ),
  },
  {
    title: 'Vitamin C that survives the bottle',
    content: (
      <p>
        L-ascorbic acid is the fastest form and the least stable — it oxidises in weeks and turns
        amber, at which point you are rubbing in something that no longer works. We use ascorbyl
        glucoside at 10%, which converts once it is on the skin. The honest trade-off: it is slower,
        and you should not expect to see much before week six.
      </p>
    ),
  },
  {
    title: 'What we leave out, and why',
    content: (
      <p>
        No parabens, no sulphates, no drying alcohol, no synthetic dye, and no animal testing at any
        point in the chain, our suppliers included. Fragrance appears in exactly one product, the
        Night Repair Cream, and it is broken out ingredient by ingredient on the carton rather than
        hidden behind the word <em>parfum</em>.
      </p>
    ),
  },
]

export default function Skincare() {
  const [when, setWhen] = useState('AM')
  const routine = ROUTINES[when]

  return (
    <>
      <PageHead
        eyebrow="Skincare"
        title="Build your ritual"
        lede="The same four formulas, sequenced two ways. Order matters more than quantity — thinnest to richest, every time, and no more product than that."
      />

      {/* ---- routine builder ---- */}
      <section className="skin section">
        <div className="shell">
          <Reveal className="skin__switch-wrap">
            <div className="skin__switch" role="tablist" aria-label="Routine">
              {Object.entries(ROUTINES).map(([key, r]) => (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  id={`tab-${key}`}
                  aria-selected={when === key}
                  aria-controls={`panel-${key}`}
                  className={`skin__tab ${when === key ? 'is-on' : ''}`}
                  onClick={() => setWhen(key)}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <p className="skin__note muted">{routine.note}</p>
          </Reveal>

          <div
            className="skin__routine swap"
            key={when}
            role="tabpanel"
            id={`panel-${when}`}
            aria-labelledby={`tab-${when}`}
          >
            <ol className="skin__steps skin__steps--in">
              {routine.steps.map((step, i) => {
                const p = getProduct(step.slug)
                if (!p) return null
                return (
                  <li className="skin__step" key={`${when}-${step.slug}`} style={{ '--i': i }}>
                    <span className="skin__step-n">{String(i + 1).padStart(2, '0')}</span>
                    <img
                      className="skin__step-img"
                      src={`/images/${p.image}@sm.jpg`}
                      alt=""
                      width="440"
                      height="550"
                      loading="lazy"
                    />
                    <div className="skin__step-body">
                      <h3>{p.name}</h3>
                      <p>{step.do}</p>
                      <Link className="skin__step-link" to={`/product/${p.slug}`}>
                        {money(p.price)} · {p.size}
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ol>

            <figure className="skin__figure">
              <img
                src={`/images/${routine.image}.jpg`}
                alt={routine.alt}
                width="1376"
                height="768"
                loading="lazy"
              />
              <figcaption>{routine.label} ritual</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ---- concerns ---- */}
      <section className="skin__concerns section">
        <div className="shell">
          <Reveal>
            <p className="label">Start where it matters</p>
            <h2 className="display skin__h2">
              <SplitText text="What are you actually trying to fix?" stagger={38} />
            </h2>
          </Reveal>
          <Stagger className="skin__concern-grid" step={90}>
            {CONCERNS.map((c) => {
              const p = getProduct(c.pick)
              return (
                <div className="skin__concern" key={c.name}>
                  <h3>{c.name}</h3>
                  <p>{c.body}</p>
                  {p && (
                    <Link className="skin__concern-link" to={`/product/${p.slug}`}>
                      {p.name}
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
                        <path
                          d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              )
            })}
          </Stagger>
        </div>
      </section>

      {/* ---- science ---- */}
      <section className="skin__science section" id="science">
        <div className="shell skin__science-grid">
          <Reveal className="skin__science-copy">
            <p className="label">The science</p>
            <h2 className="display skin__h2">
              <SplitText text="Four decisions worth explaining." stagger={40} />
            </h2>
            <p className="lede">
              The parts of a formulation that cost the most are rarely the parts that make the
              front of the box. These are the four we would want explained to us.
            </p>
            <Pill to="/collection" variant="dark" arrow>
              See the collection
            </Pill>
          </Reveal>
          <Reveal className="skin__science-acc" delay={120}>
            <Accordion items={SCIENCE} defaultOpen={0} />
          </Reveal>
        </div>
      </section>
    </>
  )
}
