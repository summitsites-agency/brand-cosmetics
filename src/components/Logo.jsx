/** The four-point sparkle + wordmark lockup used in every comp. */
export default function Logo({ compact = false }) {
  return (
    <span className="logo">
      <svg
        className="logo__mark"
        viewBox="0 0 24 24"
        width="19"
        height="19"
        aria-hidden="true"
        fill="currentColor"
      >
        <path d="M12 0c.5 6.2 5.3 11 11.5 11.5v1C17.3 13 12.5 17.8 12 24h-1C10.5 17.8 5.7 13 -.5 12.5v-1C5.7 11 10.5 6.2 11 0h1Z" />
      </svg>
      <span className="logo__word">
        <b>BRAND</b>
        {!compact && <span> Cosmetics</span>}
      </span>
    </span>
  )
}
