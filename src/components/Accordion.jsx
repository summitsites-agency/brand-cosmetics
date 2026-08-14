import { useId, useRef, useState } from 'react'
import './accordion.css'

/**
 * The Ingredients / How to Use / Reviews rows from the product-page comps:
 * a hairline-separated list with a chevron that rotates open.
 */
export default function Accordion({ items, defaultOpen = -1 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen)
  const baseId = useId()

  return (
    <div className="acc">
      {items.map((item, i) => (
        <Row
          key={item.title}
          id={`${baseId}-${i}`}
          title={item.title}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex((cur) => (cur === i ? -1 : i))}
        >
          {item.content}
        </Row>
      ))}
    </div>
  )
}

function Row({ id, title, isOpen, onToggle, children }) {
  const bodyRef = useRef(null)

  return (
    <div className={`acc__row ${isOpen ? 'is-open' : ''}`}>
      <h3 className="acc__h">
        <button
          type="button"
          className="acc__btn"
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          onClick={onToggle}
        >
          <span>{title}</span>
          <svg className="acc__chev" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
            <path
              d="M3.5 6 8 10.5 12.5 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </h3>
      <div
        className="acc__panel"
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        {/* Collapsed content is hidden from tab order and AT, not just clipped. */}
        <div className="acc__clip" ref={bodyRef} inert={!isOpen}>
          <div className="acc__body">{children}</div>
        </div>
      </div>
    </div>
  )
}
