import { useScrollStage } from '../hooks/useScrollStage'
import './story-narrative.css'

/**
 * The four About comps read as one continuous statement, so they're built as a
 * pinned water plate with the lines crossfading through it as you scroll.
 * The comps set the opening line in the display serif and the rest in the sans;
 * unified on the sans so the section reads in a single voice.
 *
 * This is the site's manifesto moment and the only place the tagline appears
 * outside the footer lockup. It deliberately carries no sourcing facts — the
 * spring is told once, on /story — so the two don't read as the same paragraph
 * twice.
 *
 * Background is the empty water frame from the comps
 * (assets/design-images/Copy_of_BRAND_Cosmetics_About_202608112140.jpeg,
 * shipped as /images/water-plate.jpg).
 */
export const STORY_FRAMES = [
  { text: ['We make four things.', 'That is the entire line.'] },
  { text: ['Each one does something', 'the other three cannot.'] },
  { text: ['Use them in order, twice a day,', 'and give it six weeks.'] },
  { text: ['Pure radiance,', 'delivered by nature.'] },
]

export default function StoryNarrative({ frames = STORY_FRAMES }) {
  const [stageRef, progress] = useScrollStage()

  // Map 0..1 across the frames, holding each roughly a screen at a time.
  const pos = progress * frames.length

  return (
    <>
      {/* Purely visual — only ever one or two lines are on screen, so assistive
          tech reads the .story-flat stack below, which is always in the tree. */}
      <section className="story-stage" ref={stageRef} aria-hidden="true">
        <div className="story-pin">
          <img
            className="story-plate"
            src="/images/water-plate.jpg"
            alt=""
            style={{
              transform: `scale(${(1.06 + progress * 0.09).toFixed(3)}) translate3d(0, ${(
                progress * -3
              ).toFixed(2)}%, 0)`,
            }}
          />

          {frames.map((frame, i) => {
            // Triangular fade: fully lit as `pos` passes the frame's centre.
            const d = Math.abs(pos - (i + 0.5))
            const opacity = Math.max(0, Math.min(1, 1.7 - d * 2.4))
            const lift = (pos - (i + 0.5)) * -26

            return (
              <p
                key={i}
                className={`story-line ${frame.serif ? 'story-line--serif' : ''}`}
                style={{
                  opacity,
                  transform: `translate3d(0, ${lift}px, 0)`,
                  visibility: opacity <= 0.01 ? 'hidden' : 'visible',
                }}
              >
                {frame.text.map((line, j) => (
                  <span key={j}>{line}</span>
                ))}
              </p>
            )
          })}

          <div className="story-progress" aria-hidden="true">
            {frames.map((_, i) => (
              <i key={i} className={pos > i + 0.35 ? 'is-on' : ''} />
            ))}
          </div>
        </div>
      </section>

      {/* Same words as the stage. Screen-reader-only while the stage runs; the
          visible article once motion is reduced. */}
      <section className="story-flat" aria-label="Our story">
        {frames.map((frame, i) => (
          <p key={i} className={frame.serif ? 'story-line--serif' : ''}>
            {frame.text.join(' ')}
          </p>
        ))}
      </section>
    </>
  )
}
