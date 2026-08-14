import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHead from '../components/PageHead'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../data/products'
import './shop.css'

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'low', label: 'Price, low to high' },
  { key: 'high', label: 'Price, high to low' },
  { key: 'rated', label: 'Best rated' },
]

export default function ShopAll() {
  const [params, setParams] = useSearchParams()
  const active = params.get('c') && categories.includes(params.get('c')) ? params.get('c') : 'All'
  const [sort, setSort] = useState('featured')

  const shown = useMemo(() => {
    const list = active === 'All' ? [...products] : products.filter((p) => p.category === active)
    switch (sort) {
      case 'low':
        return list.sort((a, b) => a.price - b.price)
      case 'high':
        return list.sort((a, b) => b.price - a.price)
      case 'rated':
        return list.sort((a, b) => b.rating - a.rating)
      default:
        return list.sort((a, b) => Number(b.featured) - Number(a.featured))
    }
  }, [active, sort])

  const setCategory = (c) => {
    if (c === 'All') setParams({}, { replace: true })
    else setParams({ c }, { replace: true })
  }

  return (
    <>
      <PageHead
        eyebrow="Shop All"
        title="Everything we make"
        lede="Six products, all made in France. No seasonal drops, no limited editions, and no reformulations you have to learn from scratch."
      />

      <section className="shop section">
        <div className="shell">
          <div className="shop__bar">
            <div className="shop__filters" role="group" aria-label="Filter by category">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`chip ${active === c ? 'is-on' : ''}`}
                  aria-pressed={active === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <label className="shop__sort">
              <span className="sr-only">Sort products</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                <path
                  d="M3.5 6 8 10.5 12.5 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </div>

          <p className="shop__count muted" role="status">
            {shown.length} {shown.length === 1 ? 'product' : 'products'}
          </p>

          {/* Keyed on the filter+sort so the cascade replays on every change. */}
          <div className="shop__grid" key={`${active}-${sort}`}>
            {shown.map((p, i) => (
              <div className="shop__cell" style={{ '--i': i }} key={p.slug}>
                <ProductCard product={p} eager={i < 3} />
              </div>
            ))}
          </div>

          {shown.length === 0 && (
            <p className="shop__empty lede">
              Nothing here yet. We add slowly, on purpose — try another category.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
