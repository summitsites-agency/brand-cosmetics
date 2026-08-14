import { Link } from 'react-router-dom'
import { money } from '../data/products'
import './product-card.css'

/**
 * Catalogue card. Hovering crossfades the front shot to the back-of-pack shot —
 * the reason the media pipeline crops a matching pair for every product.
 */
export default function ProductCard({ product, eager = false }) {
  // Studio shots ship with a pure-white backdrop, so they can be blended into
  // the coloured bands. Hand shots can't — see scripts/prepare-media.mjs.
  const blend = product.knockout ? 'is-knockout' : ''

  return (
    <article className="pcard">
      <Link to={`/product/${product.slug}`} className={`pcard__media ${blend}`}>
        <img
          className="pcard__img pcard__img--front"
          src={`/images/${product.image}.jpg`}
          alt={product.name}
          width="900"
          height="1125"
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
        <img
          className="pcard__img pcard__img--back"
          src={`/images/${product.imageBack}.jpg`}
          alt=""
          width="900"
          height="1125"
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
        {product.compareAt && <span className="pcard__flag">Save {money(product.compareAt - product.price)}</span>}
      </Link>

      <div className="pcard__info">
        <p className="pcard__tag label">{product.role}</p>
        <h3 className="pcard__name">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="pcard__price">
          {money(product.price)}
          {product.compareAt && <s>{money(product.compareAt)}</s>}
        </p>
        <Link to={`/product/${product.slug}`} className="pill pill--ghost pill--sm pcard__cta">
          <span className="pill__label">Shop Now</span>
        </Link>
      </div>
    </article>
  )
}
