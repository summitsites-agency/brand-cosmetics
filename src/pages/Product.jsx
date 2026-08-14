import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Accordion from '../components/Accordion'
import Pill from '../components/Pill'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import SplitText from '../components/SplitText'
import Parallax from '../components/Parallax'
import { getProduct, products, money } from '../data/products'
import { useCart } from '../cart/CartContext'
import NotFound from './NotFound'
import './product.css'

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const { add } = useCart()

  const [shot, setShot] = useState(0)
  const [size, setSize] = useState(product?.sizes[0] ?? '')

  // Reset the gallery and size when navigating between products.
  useEffect(() => {
    setShot(0)
    if (product) setSize(product.sizes[0])
  }, [slug, product])

  useEffect(() => {
    if (product) document.title = `${product.name} — BRAND Cosmetics`
    return () => {
      document.title = 'BRAND Cosmetics — Luxury Skincare'
    }
  }, [product])

  if (!product) return <NotFound />

  // Only the studio pair ships with a knocked-out backdrop; the "in hand" shot
  // keeps its own background and must not be blended into the panel.
  const gallery = [
    { img: product.image, knockout: product.knockout, alt: product.name },
    {
      img: product.imageBack,
      knockout: product.knockout,
      alt: `${product.name} — reverse, showing ingredients`,
    },
    { img: product.hold, knockout: false, alt: `${product.name} held in hand` },
  ]
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3)

  return (
    <>
      {/* ---- the comp: image field left, pale panel right ---- */}
      <article className="pdp">
        <div className="pdp__media">
          <div className="pdp__stage">
            {gallery.map((g, i) => (
              <img
                key={g.img}
                className={`pdp__shot ${i === shot ? 'is-on' : ''} ${
                  g.knockout ? 'is-knockout' : ''
                }`}
                src={`/images/${g.img}.jpg`}
                alt={g.alt}
                width="900"
                height="1125"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                aria-hidden={i === shot ? undefined : 'true'}
              />
            ))}
          </div>

          <div className="pdp__thumbs" role="group" aria-label="Product images">
            {gallery.map((g, i) => (
              <button
                key={g.img}
                type="button"
                className={`pdp__thumb ${i === shot ? 'is-on' : ''} ${
                  g.knockout ? 'is-knockout' : ''
                }`}
                aria-pressed={i === shot}
                onClick={() => setShot(i)}
              >
                <span className="sr-only">View image {i + 1}</span>
                <img src={`/images/${g.img}@sm.jpg`} alt="" width="440" height="550" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="pdp__panel">
          {/* Re-keyed per product so the column cascades on every navigation. */}
          <div className="pdp__panel-inner" key={product.slug}>
            <nav className="pdp__crumbs" aria-label="Breadcrumb">
              <Link to="/shop">Shop All</Link>
              <span aria-hidden="true">/</span>
              <Link to={`/shop?c=${product.category}`}>{product.category}</Link>
            </nav>

            <h1 className="pdp__title display">
              <span className="pdp__brand">BRAND</span>
              {product.name}
            </h1>

            <p className="pdp__price">
              {money(product.price)} USD
              {product.compareAt && <s>{money(product.compareAt)}</s>}
            </p>

            <p className="pdp__rating">
              <span className="pdp__stars" aria-hidden="true">★★★★★</span>
              <span>
                {product.rating.toFixed(1)} · {product.reviews} reviews
              </span>
            </p>

            <p className="pdp__short">{product.short}</p>

            {product.sizes.length > 1 && (
              <div className="pdp__sizes" role="group" aria-label="Size">
                <span className="label">Size</span>
                <div className="pdp__size-row">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`chip ${size === s ? 'is-on' : ''}`}
                      aria-pressed={size === s}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Pill
              variant="slate"
              size="lg"
              className="pill--block pdp__add"
              onClick={() => add(product, size)}
            >
              Add to Bag
            </Pill>

            <p className="pdp__ship muted">
              Complimentary shipping over {money(120)} · 30 days to return it, opened or not
            </p>

            <Accordion
              items={[
                {
                  title: 'Ingredients',
                  content: (
                    <>
                      <p>{product.formula}</p>
                      <ul style={{ marginTop: '0.9rem' }}>
                        {product.ingredients.map((ing) => (
                          <li key={ing}>{ing}</li>
                        ))}
                      </ul>
                    </>
                  ),
                },
                { title: 'How to Use', content: <p>{product.howToUse}</p> },
                {
                  title: 'Reviews',
                  content: (
                    <>
                      <p>
                        <strong>{product.rating.toFixed(1)} out of 5</strong> — from{' '}
                        {product.reviews} verified purchases.
                      </p>
                      <blockquote className="pdp__quote">
                        &ldquo;{product.review.quote}&rdquo;
                        <cite>
                          {product.review.name} — {product.review.note}
                        </cite>
                      </blockquote>
                      {product.claim && (
                        <p className="pdp__claim">
                          <strong>{product.claim.stat}.</strong> {product.claim.basis} We&rsquo;ll
                          send the full report if you ask for it.
                        </p>
                      )}
                    </>
                  ),
                },
              ]}
            />

            <dl className="pdp__facts">
              {product.facts.map(([k, v]) => (
                <div className="pdp__fact" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </article>

      {/* ---- editorial band ---- */}
      <section className="pdp__story">
        <div className="shell pdp__story-grid">
          <Parallax
            className="pdp__story-media"
            src={`/images/${product.lifestyle}.jpg`}
            alt={`${product.name} in use`}
            width="1376"
            height="768"
            distance={52}
          />
          <Reveal className="pdp__story-copy" delay={120}>
            <p className="label">{product.role}</p>
            <h2 className="display pdp__story-title">
              <SplitText text="Why it works" stagger={54} />
            </h2>
            <p className="lede">{product.description}</p>
          </Reveal>
        </div>
      </section>

      {/* ---- related ---- */}
      <section className="pdp__more section">
        <div className="shell">
          <Reveal className="pdp__more-head">
            <h2 className="display">Complete the ritual</h2>
            <Link to="/shop" className="pdp__more-link">
              View all
            </Link>
          </Reveal>
          <div className="pdp__more-grid">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
