# Media

Everything under `public/images` and `public/videos` is generated from the raw
uploads in `assets/` by `npm run prepare-media`. The raw folder is **not**
committed (see `.gitignore`); the derivatives are, so the repo runs after a
plain `git clone && npm install && npm run dev`.

## What the pipeline does

| Group | Source | Output |
| --- | --- | --- |
| Studio products | 8 bottle/jar shots on seamless grey | Centre-cropped to 4:5 at 900×1125 (+ 440×550 `@sm`), **backdrop knocked out to pure white** |
| In-hand | 4 hand-on-white shots | 4:5 crop offset right to follow the subject |
| Editorial | 8 garden / in-use frames | Full 16:9, recompressed at 1376px (+ 760px `@sm`) |
| Faces | 3 crops from the garden frames | 120×120, for the hero's "Loved by thousands" stack |
| Plate | The empty water frame | `water-plate.jpg` (page heads, the Our Story narrative) and `water-plate-180.jpg`, the same frame rotated 180° for the ritual grid |
| Hero clip | `Untitled design.mp4` | Right half only, 952×1080 H.264 + poster — the homepage hero |
| Alternate clip | `Animate_right_half_…2139.mp4` | Right half only, 760×866 H.264 + poster |

## Two things worth knowing

**The knockout.** Studio backdrops measure 219–232, so blending a product onto
a coloured band left a visible grey rectangle. The pipeline applies a LUT that
is the identity below 184 — preserving the drop shadows, which bottom out at
74 — and ramps 184→219 up to 255. With a true-white backdrop,
`mix-blend-mode: multiply` erases it against any band colour. Only the eight
studio plates get this; it would blow out skin tones on the hand shots, so
those are flagged `knockout: false` in `src/data/products.js`.

**The hero clips.** Both sources are split frames with a hard seam at the
midpoint — a flat panel on the left, product-on-water on the right. The pipeline
crops a few pixels past the seam so no re-encode ringing can bleed the left
panel into view, and the site overlays its own copy on the left, which is what
the comp shows. `Untitled design.mp4` additionally carries lorem-ipsum headlines
on its left half, so shipping only the right half is the only usable option; its
review cards are composited into the artwork, which is why the layout doesn't
repeat them in markup.

## Source material

Client-supplied product renders, design comps and motion frames for the
*BRAND Cosmetics* concept. This is a **mossimo Studios demo** — a fictional brand.
No orders are processed and the checkout button is deliberately inert.
