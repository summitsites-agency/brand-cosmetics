import Pill from '../components/Pill'
import './not-found.css'

export default function NotFound() {
  return (
    <section className="nf">
      <img className="nf__plate" src="/images/water-plate.jpg" alt="" aria-hidden="true" />
      <div className="shell nf__inner">
        <p className="label">404</p>
        <h1 className="display nf__title">This page has evaporated.</h1>
        <p className="lede">
          Old link, most likely. There are only six products, so whatever you were after is
          probably one tap away.
        </p>
        <div className="nf__actions">
          <Pill to="/shop" variant="dark" arrow size="lg">
            Shop All
          </Pill>
          <Pill to="/" variant="ghost">
            Back to home
          </Pill>
        </div>
      </div>
    </section>
  )
}
