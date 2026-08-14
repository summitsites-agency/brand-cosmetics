import PageHead from '../components/PageHead'
import Pill from '../components/Pill'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import SplitText from '../components/SplitText'
import Stagger from '../components/Stagger'
import Parallax from '../components/Parallax'
import './story.css'

const VALUES = [
  {
    title: 'Traceable to a name',
    body: 'Every active comes from a named grower or a named spring, and we visit both. If we cannot tell you whose hands it passed through, it does not go in the bottle.',
  },
  {
    title: 'Small batch, dated',
    body: 'Filled four hundred units at a time in the same workshop outside Lyon, and stamped on the base. You can read the fill date without a magnifying glass, which is deliberate.',
  },
  {
    title: 'Claims we can show you',
    body: 'Every percentage on this site comes from a consumer study we commissioned and will send you on request. Where the evidence is thin, we say the evidence is thin.',
  },
]

export default function Story() {
  return (
    <>
      <PageHead
        eyebrow="Our Story"
        title="Why the bottle is blue"
        lede="Because everything inside it starts as snow, on one protected valley in the Savoie — and the whole company is built around not ruining it on the way to you."
      />
      <section className="story-values section" id="sourcing">
        <div className="shell">
          <Reveal>
            <p className="label">How we work</p>
            <h2 className="story-values__title display">
              <SplitText text="Purity is a supply chain, not a claim." stagger={38} />
            </h2>
          </Reveal>
          <Stagger as="ul" className="story-values__list" step={110}>
            {VALUES.map((v, i) => (
              <li key={v.title} className="story-value">
                <span className="story-value__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </li>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="story-source">
        <div className="shell story-source__grid">
          <Parallax
            className="story-source__media"
            src="/images/garden-cream.jpg"
            alt="An open jar of Night Repair Cream held in a rose garden at golden hour"
            width="1376"
            height="768"
            distance={56}
          />
          <Reveal className="story-source__copy" delay={120}>
            <p className="label">The source</p>
            <h2 className="display story-source__title">
              <SplitText text="The water does most of the work." stagger={46} />
            </h2>
            <p className="lede">
              Snowmelt enters the rock at 1,800 metres and spends roughly nineteen years working
              down through limestone and granite before anyone sees it again. What arrives at the
              bottling hall is already close to perfectly clean and unusually low in dissolved
              minerals — which is why our actives can sit at concentrations that would sting in
              ordinary water. Our job is mostly to not get in the way.
            </p>
            <div className="story-source__stats">
              <div>
                <p className="story-source__n">
                  <CountUp to={1800} suffix="m" duration={1600} />
                </p>
                <p className="muted">source elevation</p>
              </div>
              <div>
                <p className="story-source__n">
                  <CountUp to={19} suffix=" yrs" />
                </p>
                <p className="muted">natural filtration</p>
              </div>
              <div>
                <p className="story-source__n">
                  <CountUp to={100} suffix="%" />
                </p>
                <p className="muted">traceable actives</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="story-cta">
        <div className="shell story-cta__inner">
          <Reveal>
            <h2 className="display story-cta__title">
              <SplitText text="Start with the whole set, or start with one bottle." stagger={40} />
            </h2>
            <p className="lede">
              Both are the right answer. The set is cheaper and the toner is where most people
              find out whether we are worth it.
            </p>
            <Pill to="/collection" variant="light" arrow size="lg">
              View the Collection
            </Pill>
          </Reveal>
        </div>
      </section>
    </>
  )
}
