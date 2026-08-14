/**
 * Turns the raw uploads in `assets/` into web-ready media under `public/`.
 *
 * Every source photo is 1376x768 landscape, but the layouts want tall product
 * plates — so the studio shots (subject dead-centre on seamless grey) get a
 * centre crop to 4:5 portrait, while the garden/hand shots stay landscape and
 * are only re-compressed.
 *
 * The hero video ships as the RIGHT HALF of the source clip: the source is a
 * split frame (flat off-white on the left, rippling water on the right) with a
 * hard seam at x=640. Cropping past the seam guarantees it can never show.
 *
 *   npm run prepare-media
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpegPath from 'ffmpeg-static'

const run = promisify(execFile)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_PRODUCT = path.join(root, 'assets', 'product-images')
const SRC_DESIGN = path.join(root, 'assets', 'design-images')
const OUT_IMG = path.join(root, 'public', 'images')
const OUT_VID = path.join(root, 'public', 'videos')

/** Studio shots: subject centred on seamless grey -> centre-crop to 4:5. */
const PORTRAIT = [
  ['Copy_of_Product_image_floating_202608112135.jpeg', 'serum-revitalizing'],
  ['Blue_cosmetic_bottle_with_label_202608112135.jpeg', 'serum-revitalizing-back'],
  ['Smallest_product_floating_center_202608112135.jpeg', 'cream-night-repair'],
  ['Blue_frosted_glass_jar_label_202608112135.jpeg', 'cream-night-repair-back'],
  ['Product_image_floating_center_202608112135.jpeg', 'toner-balancing'],
  ['Generate_cosmetic_bottle_back_202608112135.jpeg', 'toner-balancing-back'],
  ['Bottle_with_blue_gradient_202608112135.jpeg', 'serum-radiance'],
  ['Frosted_blue_glass_dropper_bottle_202608112135.jpeg', 'serum-radiance-back'],
]

/** Hand-on-white shots: subject sits right of centre -> crop a 4:5 window there. */
const PORTRAIT_RIGHT = [
  ['Hands_holding_blue_cosmetic_bottle_202608112136.jpeg', 'hold-serum'],
  ['Hands_holding_blue_cosmetic_bottle_202608112136 (1).jpeg', 'hold-toner'],
  ['Hand_holding_blue_glass_jar_202608112136.jpeg', 'hold-cream'],
  ['Hand_holding_blue_glass_bottle_202608112136.jpeg', 'hold-dropper'],
]

/** Editorial / lifestyle: keep the full 16:9 frame. */
const LANDSCAPE = [
  ['Person_applying_face_cream_202608112136.jpeg', 'ritual-cream'],
  ['Person_massaging_serum_outdoors_202608112136.jpeg', 'ritual-massage'],
  ['Person_spraying_mist_on_face_202608112136.jpeg', 'ritual-mist'],
  ['Serum_applied_to_hand_202608112136.jpeg', 'ritual-pour'],
  ['Blue_frosted_bottle_held_hands_202608112136.jpeg', 'garden-serum'],
  ['Blue_serum_bottle_held_hand_202608112136.jpeg', 'garden-dropper'],
  ['BRAND_Cosmetics_blue_bottle_202608112136.jpeg', 'garden-toner'],
  ['Frosted_blue_jar_held_by_202608112136.jpeg', 'garden-cream'],
]

/** The empty water plate doubles as a section background. */
const PLATE = ['Copy_of_BRAND_Cosmetics_About_202608112140.jpeg', 'water-plate']

/**
 * Faces lifted out of the garden shots for the hero's "Loved by thousands"
 * avatar stack — [source, name, centre x, centre y, box] in 1376x768 space.
 */
const FACES = [
  ['Person_applying_face_cream_202608112136.jpeg', 'face-1', 1010, 210, 470],
  ['Person_massaging_serum_outdoors_202608112136.jpeg', 'face-2', 785, 280, 360],
  ['Person_spraying_mist_on_face_202608112136.jpeg', 'face-3', 1090, 250, 470],
]

const ff = (args) => run(ffmpegPath, ['-v', 'error', '-y', ...args])

/*
 * The studio shots sit on a seamless grey that measures 219–232. Left alone it
 * shows up as a grey rectangle wherever the layouts blend a product onto the
 * pale-blue field. This LUT is the identity below 184 — so the drop shadows
 * (which bottom out at 74–151) survive untouched — then ramps 184→219 up to
 * pure white. With the backdrop at a true 255, `mix-blend-mode: multiply`
 * knocks it out completely against any background.
 */
const KNOCKOUT_LO = 184
const KNOCKOUT_HI = 219
const knockoutExpr = `if(lt(val,${KNOCKOUT_LO}),val,if(gt(val,${KNOCKOUT_HI}),255,${KNOCKOUT_LO}+(val-${KNOCKOUT_LO})*${(255 - KNOCKOUT_LO) / (KNOCKOUT_HI - KNOCKOUT_LO)}))`
const KNOCKOUT = `lutrgb=r='${knockoutExpr}':g='${knockoutExpr}':b='${knockoutExpr}'`

/** 1376x768 -> 4:5 window of width `w` whose centre sits at `cx` (0..1). */
function cropFilter({ w = 614, cx = 0.5 } = {}) {
  const h = Math.round((w * 5) / 4)
  const x = Math.round(1376 * cx - w / 2)
  return `crop=${w}:${Math.min(h, 768)}:${Math.max(0, Math.min(1376 - w, x))}:${Math.max(0, Math.round((768 - h) / 2))}`
}

async function portrait(file, name, cx, { knockout = false } = {}) {
  const src = path.join(SRC_PRODUCT, file)
  const prep = knockout ? `${KNOCKOUT},` : ''
  // Source is only 768px tall, so the 4:5 window is 614x768. Upscale modestly
  // to 900x1125 with lanczos so browsers downscale rather than blow it up.
  await ff([
    '-i', src,
    '-vf', `${prep}${cropFilter({ cx })},scale=900:1125:flags=lanczos`,
    '-q:v', '3',
    path.join(OUT_IMG, `${name}.jpg`),
  ])
  await ff([
    '-i', src,
    '-vf', `${prep}${cropFilter({ cx })},scale=440:550:flags=lanczos`,
    '-q:v', '4',
    path.join(OUT_IMG, `${name}@sm.jpg`),
  ])
  console.log(`  portrait  ${name}${knockout ? '  (knocked out)' : ''}`)
}

async function face(file, name, cx, cy, box) {
  const x = Math.max(0, Math.min(1376 - box, Math.round(cx - box / 2)))
  const y = Math.max(0, Math.min(768 - box, Math.round(cy - box / 2)))
  await ff([
    '-i', path.join(SRC_PRODUCT, file),
    '-vf', `crop=${box}:${box}:${x}:${y},scale=120:120:flags=lanczos`,
    '-q:v', '3',
    path.join(OUT_IMG, `${name}.jpg`),
  ])
  console.log(`  face      ${name}`)
}

async function landscape(file, name, { dir = SRC_PRODUCT, width = 1376 } = {}) {
  await ff([
    '-i', path.join(dir, file),
    '-vf', `scale=${width}:-2:flags=lanczos`,
    '-q:v', '4',
    path.join(OUT_IMG, `${name}.jpg`),
  ])
  await ff([
    '-i', path.join(dir, file),
    '-vf', 'scale=760:-2:flags=lanczos',
    '-q:v', '5',
    path.join(OUT_IMG, `${name}@sm.jpg`),
  ])
  console.log(`  landscape ${name}`)
}

/*
 * Both hero clips are soft: they are generated renders finished at 1080p, but
 * the detail is not there to match. Halving the resolution and putting it back
 * costs the hero source only 0.006 SSIM (Y 0.9942), where the still photos in
 * `product-images/` lose four times as much (Y 0.9747) — i.e. the clips carry
 * roughly half-resolution detail in a full-resolution container.
 *
 * Nothing recovers that, so the encode does the two things that still help:
 * `hqdn3d` strips the generation noise sitting in the flat water, which would
 * otherwise be amplified into frame-to-frame shimmer, and a radius-5 `unsharp`
 * puts an edge back on the bottle rims and the composited review-card text.
 * Luma only — chroma is half-resolution again under 4:2:0 and sharpening it
 * just fringes. Amount is held at 0.8; by 1.4 the bottle silhouettes halo.
 */
const RESTORE = 'hqdn3d=1.5:1.5:6:6,unsharp=5:5:0.8:5:5:0.0'

/**
 * Both source clips are split frames — flat panel on the left, product-on-water
 * on the right — so only the right half is ever shipped. Cropping a few pixels
 * past the seam guarantees no re-encode ringing can bleed the left panel in.
 *
 * The crop ships at its native size. There is no `scale` step on purpose: with
 * a source this soft, scaling up buys weight and no detail, and it is what left
 * the water plate a 1.2x blow-up of its own crop.
 *
 * @param {string} file      source clip
 * @param {string} name      output basename
 * @param {string} crop      ffmpeg crop expression for the right half
 * @param {number} posterAt  seconds to grab the poster from
 */
async function heroClip(file, name, crop, posterAt) {
  const src = path.join(SRC_DESIGN, file)
  if (!existsSync(src)) {
    console.warn(`  ! ${file} missing, skipping`)
    return
  }
  await ff([
    '-i', src,
    '-vf', `${crop},${RESTORE}`,
    '-an',
    // 25 was leaving the sharpened edges to fight quantisation; at 22 the
    // re-encode stops being the limiting factor and the source is.
    '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-crf', '22', '-preset', 'slow',
    '-movflags', '+faststart',
    path.join(OUT_VID, `${name}.mp4`),
  ])
  // Same treatment as the clip, so the poster and the first played frame match.
  await ff([
    '-ss', String(posterAt), '-i', src,
    '-frames:v', '1',
    '-vf', `${crop},${RESTORE}`,
    '-q:v', '3',
    path.join(OUT_VID, `${name}-poster.jpg`),
  ])
  console.log(`  video     ${name}.mp4 + poster`)
}

async function heroVideos() {
  // The homepage hero. 1920x1080 split at x=960; the right half carries the two
  // bottles plus the review cards already composited in, so the layout doesn't
  // repeat them in markup. Ships at its native 952x1080 (~8:9).
  await heroClip('Untitled design.mp4', 'hero-brand', 'crop=952:1080:968:0', 8)
  // Kept as the lighter alternate plate: 1280x720 split at x=640, shipped at
  // its native 632x720.
  await heroClip(
    'Animate_right_half_cosmetic_bottles_202608112139.mp4',
    'hero-water',
    'crop=632:720:648:0',
    2
  )
}

async function main() {
  if (!existsSync(SRC_PRODUCT)) {
    console.error(`Missing ${SRC_PRODUCT}. Raw uploads are not committed — see public/CREDITS.md.`)
    process.exit(1)
  }
  await mkdir(OUT_IMG, { recursive: true })
  await mkdir(OUT_VID, { recursive: true })

  const have = new Set(await readdir(SRC_PRODUCT))
  const missing = []

  for (const [file, name] of PORTRAIT) {
    if (!have.has(file)) { missing.push(file); continue }
    await portrait(file, name, 0.5, { knockout: true })
  }
  for (const [file, name] of PORTRAIT_RIGHT) {
    if (!have.has(file)) { missing.push(file); continue }
    // Hands stay as-is: the LUT would blow out skin tones.
    await portrait(file, name, 0.56)
  }
  for (const [file, name, cx, cy, box] of FACES) {
    if (!have.has(file)) { missing.push(file); continue }
    await face(file, name, cx, cy, box)
  }
  for (const [file, name] of LANDSCAPE) {
    if (!have.has(file)) { missing.push(file); continue }
    await landscape(file, name)
  }

  const [plateFile, plateName] = PLATE
  if (existsSync(path.join(SRC_DESIGN, plateFile))) {
    await landscape(plateFile, plateName, { dir: SRC_DESIGN })
    // Same plate rotated 180° (flipped vertically and mirrored) so consecutive
    // sections can share the artwork without the seam reading as a repeat.
    await ff([
      '-i', path.join(SRC_DESIGN, plateFile),
      '-vf', 'hflip,vflip,scale=1376:-2:flags=lanczos',
      '-q:v', '4',
      path.join(OUT_IMG, `${plateName}-180.jpg`),
    ])
    console.log(`  landscape ${plateName}-180`)
    // Upside down only — top-to-bottom mirror, no left-right flip. Used by the
    // ritual band.
    await ff([
      '-i', path.join(SRC_DESIGN, plateFile),
      '-vf', 'vflip,scale=1376:-2:flags=lanczos',
      '-q:v', '4',
      path.join(OUT_IMG, `${plateName}-flip.jpg`),
    ])
    console.log(`  landscape ${plateName}-flip`)
  } else {
    missing.push(plateFile)
  }

  await heroVideos()

  if (missing.length) {
    console.warn(`\n! ${missing.length} source file(s) not found:`)
    for (const m of missing) console.warn(`    ${m}`)
  }
  console.log('\nMedia ready in public/.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
