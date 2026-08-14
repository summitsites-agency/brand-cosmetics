import { useState } from 'react'
import PageHead from '../components/PageHead'
import Pill from '../components/Pill'
import Reveal from '../components/Reveal'
import Parallax from '../components/Parallax'
import './contact.css'

/**
 * Front-end only. Posts to a Formspree endpoint when VITE_FORM_ENDPOINT is set,
 * otherwise hands off to the visitor's mail client so the demo still works.
 */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT
const MAILTO = 'hello@brandcosmetics.com'

const TOPICS = [
  'Which product is right for me',
  'An order I’ve placed',
  'Stockists & wholesale',
  'Press & partnerships',
  'Something else',
]

const DETAILS = [
  { k: 'Email', v: MAILTO, href: `mailto:${MAILTO}` },
  { k: 'Telephone', v: '+33 1 84 88 40 12', href: 'tel:+33184884012' },
  { k: 'Atelier', v: '18 rue des Sources, 75008 Paris' },
  { k: 'Hours', v: 'Mon–Fri, 9h–18h CET' },
]

export default function Contact() {
  const [status, setStatus] = useState('idle')
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    if (!ENDPOINT) {
      const body = encodeURIComponent(
        `${form.message}\n\n— ${form.name}\nRegarding: ${form.topic}`
      )
      window.location.href = `mailto:${MAILTO}?subject=${encodeURIComponent(
        `[${form.topic}] from ${form.name || 'the website'}`
      )}&body=${body}`
      setStatus('mailto')
      return
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      setForm({ name: '', email: '', topic: TOPICS[0], message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <PageHead
        eyebrow="Contact"
        title="Talk to us"
        lede="Tell us what you're working with — skin type, what you've already tried, what keeps happening. Someone who actually formulates these will write back, usually inside a working day."
      />

      <section className="contact section">
        <div className="shell contact__grid">
          <Reveal className="contact__form-wrap">
            <form className="contact__form contact__form--in" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="c-name">Name</label>
                <input
                  id="c-name"
                  required
                  value={form.name}
                  onChange={set('name')}
                  autoComplete="name"
                />
              </div>

              <div className="field">
                <label htmlFor="c-email">Email</label>
                <input
                  id="c-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label htmlFor="c-topic">This is about</label>
                <div className="field__select">
                  <select id="c-topic" value={form.topic} onChange={set('topic')}>
                    {TOPICS.map((t) => (
                      <option key={t}>{t}</option>
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
                </div>
              </div>

              <div className="field field--wide">
                <label htmlFor="c-msg">Message</label>
                <textarea
                  id="c-msg"
                  rows="6"
                  required
                  value={form.message}
                  onChange={set('message')}
                  placeholder="“Combination, mid-thirties, everything I put on my cheeks pills by lunchtime…”"
                />
              </div>

              <div className="contact__submit">
                <Pill variant="slate" size="lg" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </Pill>
                <p className="contact__status" role="status">
                  {status === 'sent' && 'Got it. You’ll hear from a person, not a template.'}
                  {status === 'mailto' && 'Opening your mail app…'}
                  {status === 'error' && 'That didn’t send — email us directly and we’ll pick it up.'}
                  {status === 'idle' && 'Every message gets read. Most get answered the same day.'}
                </p>
              </div>
            </form>
          </Reveal>

          <Reveal className="contact__aside" delay={120}>
            <dl className="contact__details">
              {DETAILS.map((d) => (
                <div key={d.k}>
                  <dt className="label">{d.k}</dt>
                  <dd>{d.href ? <a href={d.href}>{d.v}</a> : d.v}</dd>
                </div>
              ))}
            </dl>

            <Parallax
              as="figure"
              className="contact__figure"
              src="/images/garden-toner.jpg"
              alt="A BRAND Cosmetics bottle held against evening light in a rose garden"
              width="1376"
              height="768"
              distance={44}
            />

            <div className="contact__faqs">
              <h2 className="label">Quick answers</h2>
              <p>
                <strong>Shipping</strong> — complimentary over $120. Two to four working days
                across Europe and North America, tracked from the workshop door.
              </p>
              <p>
                <strong>Returns</strong> — 30 days, opened or not. Skincare is a trial, not a
                gamble, and you cannot tell from a sealed box.
              </p>
              <p>
                <strong>Samples</strong> — say the word and two go in with your next order. Say
                which concern and we&rsquo;ll pick them for you.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
