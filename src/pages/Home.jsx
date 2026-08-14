import { Link } from 'react-router-dom'
import Pill from '../components/Pill'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import ProductCard from '../components/ProductCard'
import SplitText from '../components/SplitText'
import Stagger from '../components/Stagger'
import Parallax from '../components/Parallax'
import StoryNarrative from '../components/StoryNarrative'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { featured, money } from '../data/products'
import './home.css'

const PROOF = [
  {
    k: 'alpine',
    label: 'Alpine Water',
    body: 'One protected aquifer, drawn at 1,800 metres. It arrives so low in minerals that we can push actives higher without anything stinging.',
  },
  {
    k: 'botanic',
    label: 'Botanical Actives',
    body: 'Cold-pressed, and traceable to the grower who harvested them. If we cannot name the farm, it does not go in.',
  },
  {
    k: 'marine',
    label: 'Marine Minerals',
    body: 'Magnesium and zinc from Brittany seawater — the two your barrier spends the night rebuilding itself with.',
  },
]

const HERO_ALT =
  'BRAND Revitalizing Serum bottles resting on rippling water, rated 4.9 from over 300 verified reviews'

export default function Home() {
  const products = featured()
  // Matches the $bp-hero breakpoint in home.css.
  const showVideo = useMediaQuery('(min-width: 900px)')

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <div className="hero__copy-inner">
            <p className="hero__badge">
              <span className="hero__badge-dot" aria-hidden="true" />
              Award-winning formula
            </p>
            <h1 className="hero__title" id="hero-title">
              {/* Each SplitText is a block (see .hero__title .split), so the
                  line break is structural — no <br> needed. */}
              <SplitText text="Water is the first" stagger={40} delay={180} />
              <SplitText text="active ingredient." stagger={40} delay={300} />
            </h1>
            <p className="hero__lede">
              Every formula we make begins with spring water drawn at 1,800 metres, then adds only
              what skin can use. Nothing for texture, nothing for the photograph.
            </p>
            <div className="hero__actions">
              <Pill to="/shop" variant="dark" arrow size="lg">
                Shop Now
              </Pill>
              <p className="hero__loved">
                <span>4.9 from 1,228 reviews</span>
                <span className="hero__faces" aria-hidden="true">
                  <img src="/images/face-1.jpg" alt="" width="120" height="120" />
                  <img src="/images/face-2.jpg" alt="" width="120" height="120" />
                  <img src="/images/face-3.jpg" alt="" width="120" height="120" />
                </span>
              </p>
            </div>
          </div>
        </div>

        {/*
          The right half of the supplied hero clip. The review cards are
          composited into the artwork itself, so the layout doesn't repeat them
          in markup. Below 900px the poster still frame is used instead — the
          video element is never mounted, so nothing downloads on mobile.
        */}
        <div className="hero__media">
          {showVideo ? (
            <video
              className="hero__video"
              src="/videos/hero-brand.mp4"
              poster="/videos/hero-brand-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              aria-label={HERO_ALT}
            />
          ) : (
            <img
              className="hero__video"
              src="/videos/hero-brand-poster.jpg"
              alt={HERO_ALT}
              width="952"
              height="1080"
              fetchPriority="high"
            />
          )}
        </div>
      </section>

      {/* ---------------- Our story ---------------- */}
      <StoryNarrative />

      {/* ---------------- The ritual grid ---------------- */}
      <section className="ritual section" aria-labelledby="ritual-title">
        <div className="shell">
          <Reveal className="ritual__head">
            <h2 className="ritual__title" id="ritual-title">
              <SplitText text="Explore the Full Radiance Ritual" stagger={38} />
            </h2>
            <p className="ritual__sub">
              Four formulas built to be layered. Each one does a job the other three cannot.
            </p>
          </Reveal>

          {/* Deliberately unanimated: these cards blend onto the section's
              water plate, and any transform/opacity on a cell would create a
              stacking context and isolate the blend. */}
          <div className="ritual__grid">
            {products.map((p, i) => (
              <div className="ritual__cell" key={p.slug}>
                <ProductCard product={p} eager={i < 2} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Story teaser ---------------- */}
      <section className="teaser" aria-labelledby="teaser-title">
        <div className="shell teaser__grid">
          <Parallax
            className="teaser__media"
            src="/images/garden-dropper.jpg"
            alt="A BRAND Cosmetics dropper bottle held in golden evening light"
            width="1376"
            height="768"
            distance={54}
          />
          <Reveal className="teaser__copy" delay={120}>
            <p className="label">Our Story</p>
            <h2 className="teaser__title display" id="teaser-title">
              <SplitText text="We buy a mountain’s worth of patience." stagger={30} />
            </h2>
            <p className="lede">
              Snow falls on one valley in the Savoie, goes into the rock, and takes the better part
              of two decades to come out the other side. By the time it reaches us it needs almost
              nothing doing to it. That is the expensive part, and it is the whole idea.
            </p>
            <Pill to="/story" variant="ghost" arrow>
              Read our story
            </Pill>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Proof band ---------------- */}
      <section className="proof" aria-labelledby="proof-title">
        <div className="shell">
          <Reveal>
            <p className="label proof__label">What&rsquo;s inside</p>
            <h2 className="proof__title display" id="proof-title">
              <SplitText text="Three sources. Nothing else." stagger={46} />
            </h2>
            <p className="lede proof__lede">
              Short ingredient lists are easy to print and hard to formulate. Here is where the
              three that carry the weight come from.
            </p>
          </Reveal>
          <Stagger as="ul" className="proof__list" step={110}>
            {PROOF.map((p, i) => (
              <li className="proof__item" key={p.k}>
                <span className="proof__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="proof__item-title">{p.label}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </Stagger>

          <Stagger className="proof__stats" step={130}>
            <div className="stat">
              <p className="stat__n">
                <CountUp to={98} suffix="%" />
              </p>
              <p className="stat__c">said skin felt more hydrated after seven days</p>
            </div>
            <div className="stat">
              <p className="stat__n">
                <CountUp to={24} suffix="h" />
              </p>
              <p className="stat__c">of measured hydration from a single application</p>
            </div>
            <div className="stat">
              <p className="stat__n stat__n--word">Zero</p>
              <p className="stat__c">parabens, sulphates, drying alcohol or animal testing</p>
            </div>
          </Stagger>
        </div>
      </section>

      {/* ---------------- In use ---------------- */}
      <section className="inuse" aria-labelledby="inuse-title">
        <div className="shell inuse__grid">
          <Reveal className="inuse__copy">
            <p className="label">Morning and night</p>
            <h2 className="inuse__title display" id="inuse-title">
              <SplitText text="Four steps. Two minutes." stagger={40} />
            </h2>
            <p className="lede">
              Mist, treat, brighten, seal. It takes less time than making coffee, and unlike the
              coffee it is still working at four in the afternoon.
            </p>
            <Pill to="/skincare" variant="dark" arrow>
              Build your routine
            </Pill>
          </Reveal>
          <div className="inuse__plates">
            <Parallax
              className="inuse__plate inuse__plate--a"
              src="/images/ritual-mist.jpg"
              alt="Mist applied to the face in a sunlit garden"
              width="1376"
              height="768"
              distance={70}
            />
            <Parallax
              className="inuse__plate inuse__plate--b"
              src="/images/ritual-pour.jpg"
              alt="Serum poured into an open palm"
              width="1376"
              height="768"
              distance={34}
            />
          </div>
        </div>
      </section>

      {/* ---------------- Set CTA ---------------- */}
      <section className="setcta">
        <div className="shell setcta__inner">
          <Reveal className="setcta__copy">
            <p className="label">Everything, boxed</p>
            <h2 className="setcta__title display">
              <SplitText text="The Radiance Ritual Set" stagger={48} />
            </h2>
            <p className="lede">
              All four full sizes, with a card in the lid that tells you which bottle goes when.
              It comes to {money(45)} under the price of buying them one at a time.
            </p>
            <div className="setcta__actions">
              <Pill to="/product/the-radiance-ritual-set" variant="light" arrow size="lg">
                Shop the set — {money(305)}
              </Pill>
              <Link to="/shop" className="setcta__link">
                or browse everything
              </Link>
            </div>
          </Reveal>
          <Parallax
            className="setcta__media"
            src="/images/hold-cream.jpg"
            alt="The Night Repair Cream held in hand"
            width="900"
            height="1125"
            distance={48}
          />
        </div>
      </section>
    </>
  )
}
