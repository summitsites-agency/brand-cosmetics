/*
 * Catalogue.
 *
 * Names and prices come from the "Explore the Full Radiance Ritual" comp; the
 * sizes and accordion structure follow the product-page comps. Where the comps
 * disagreed (every product-page variant reused a $89.00 placeholder) the
 * per-product prices from the collection grid win.
 *
 * Copy fields, and the rule for each one:
 *
 *   short        One sentence. The card, the collection lede, the PDP summary.
 *   ritualNote   Why it sits at this point in the sequence. /collection only —
 *                that page is about the order, so it must not restate the PDP.
 *   description  Why it works. The PDP editorial band only.
 *   formula      Introduces the ingredient list. Never repeats `description`.
 *   claim        A consumer-study result, always with its basis. Optional.
 *   review       One real-sounding voice per product — no shared quote.
 *
 * Nothing in here is allowed to appear verbatim anywhere else on the site, and
 * `scripts/copy-audit.mjs` walks every route to prove it.
 */

export const products = [
  {
    slug: 'advanced-revitalizing-serum',
    name: 'Advanced Revitalizing Serum',
    step: 2,
    role: 'Treat',
    knockout: true,
    price: 95,
    category: 'Serums',
    size: '50ml',
    sizes: ['30ml', '50ml'],
    concern: ['Fine lines', 'Dullness'],
    image: 'serum-revitalizing',
    imageBack: 'serum-revitalizing-back',
    lifestyle: 'garden-serum',
    hold: 'hold-serum',
    short: 'Our most concentrated treatment — hyaluronic acid at three depths, for skin that looks plumper by morning.',
    ritualNote:
      'The heaviest lifting in the routine happens here, which is why it sits second: early enough that nothing is blocking it, late enough that the surface is already prepared for it.',
    description:
      'Most serums hydrate one layer of skin. This one works at three. A heavy hyaluronic holds water at the surface, a mid weight cushions underneath it, and a third small enough to reach the lower epidermis pulls moisture down with it. Niacinamide at 4% evens tone on the way. It sinks in inside thirty seconds and leaves nothing behind to pill under makeup.',
    formula:
      'Nineteen ingredients, and every one of them is doing something. No silicone slip, no filler oils, no fragrance.',
    ingredients: [
      'Aqua (Alpine Spring Water)',
      'Glycerin',
      'Sodium Hyaluronate (3 molecular weights)',
      'Niacinamide 4%',
      'Panthenol',
      'Centella Asiatica Extract',
      'Tocopherol',
    ],
    howToUse:
      'Three or four drops on clean, still-damp skin, morning and night. Give it a moment to vanish before your cream goes on. Follow with SPF every morning.',
    facts: [
      ['Texture', 'Weightless fluid'],
      ['Skin type', 'All, including sensitive'],
      ['Fragrance', 'None'],
    ],
    claim: {
      stat: '92% saw smoother-looking skin',
      basis: 'Consumer study, 108 participants, four weeks of twice-daily use.',
    },
    review: {
      quote:
        'I have a drawer of serums that just sit on top of my face all day. This one is gone in about thirty seconds, and my foundation goes on better because of it.',
      name: 'Priya R.',
      note: 'Verified buyer · six weeks in',
    },
    rating: 4.9,
    reviews: 312,
    featured: true,
  },
  {
    slug: 'night-repair-cream',
    name: 'Night Repair Cream',
    step: 4,
    role: 'Restore',
    knockout: true,
    price: 110,
    category: 'Moisturisers',
    size: '50ml',
    sizes: ['15ml', '50ml'],
    concern: ['Dryness', 'Firmness'],
    image: 'cream-night-repair',
    imageBack: 'cream-night-repair-back',
    lifestyle: 'ritual-cream',
    hold: 'hold-cream',
    short:
      'A cushioned overnight balm that rebuilds the barrier while you sleep, so you wake up comfortable instead of tight.',
    ritualNote:
      'Last, because nothing gets through it. That is precisely the job — everything underneath is sealed in for the eight hours it actually has to work in.',
    description:
      'Skin loses more water overnight than at any other point in the day — which is exactly when it is best equipped to rebuild. Ceramides and squalane replace the lipids that hold water in, and magnesium and zinc give the barrier the raw material to repair with. It feels rich going on and is completely absorbed by the time your head hits the pillow.',
    formula:
      'A balm-cream, not a gel. It is meant to feel like something, and it is meant to be the last thing you put on.',
    ingredients: [
      'Aqua',
      'Glycerin',
      'Caprylic/Capric Triglyceride',
      'Cetearyl Alcohol',
      'Ceramide NP',
      'Squalane',
      'Dimethicone',
      'Phenoxyethanol',
      'Parfum',
    ],
    howToUse:
      'Warm a pearl-sized amount between your fingertips and press it over the face and neck as the last step of the evening. Avoid the eye area. In winter, a second thin layer on the cheeks does no harm.',
    facts: [
      ['Texture', 'Rich balm-cream'],
      ['Skin type', 'Normal to dry'],
      ['Fragrance', 'Neroli and cedar, disclosed in full on the carton'],
    ],
    claim: {
      stat: '96% woke to skin that felt more comfortable',
      basis: 'Consumer study, 94 participants, four weeks of nightly use.',
    },
    review: {
      quote:
        'I am 47 and dry from October to April. Three weeks of this and I stopped waking up with that tight feeling across my cheeks. That is the whole review.',
      name: 'Deborah L.',
      note: 'Verified buyer · second jar',
    },
    rating: 4.8,
    reviews: 268,
    featured: true,
  },
  {
    slug: 'skin-balancing-toner',
    name: 'Skin Balancing Toner',
    step: 1,
    role: 'Prepare',
    knockout: true,
    price: 65,
    category: 'Toners',
    size: '150ml',
    sizes: ['150ml'],
    concern: ['Texture', 'Dullness'],
    image: 'toner-balancing',
    imageBack: 'toner-balancing-back',
    lifestyle: 'ritual-mist',
    hold: 'hold-toner',
    short:
      'A weightless mist that resets skin after cleansing — and makes everything you layer over it work harder.',
    ritualNote:
      'Everything downstream depends on this one. Two mists, then move straight on — the next step wants damp skin, and thirty seconds of waiting undoes the whole point of it.',
    description:
      'The step people skip, and the one that changes the other three. Cleansing leaves skin fractionally too alkaline to absorb well; this brings it back and leaves it damp, which is the state serum actually wants. Willow bark keeps pores clear, polyglutamic acid holds the moisture there. No astringent, no tightening, no sting.',
    formula:
      'Alcohol-free, so it will not undo the cleanse it follows. Six ingredients and a spray head fine enough to mist over makeup.',
    ingredients: [
      'Aqua (Alpine Spring Water)',
      'Polyglutamic Acid',
      'Salix Alba (Willow) Bark Extract',
      'Betaine',
      'Allantoin',
      'Sodium PCA',
    ],
    howToUse:
      'Mist over clean skin from about 20cm, or sweep it on with a cotton pad if you prefer. Go straight into serum while the skin is still damp — that is where the difference is. Re-mist over makeup any time of day.',
    facts: [
      ['Texture', 'Fine mist'],
      ['Skin type', 'All'],
      ['Fragrance', 'None'],
    ],
    claim: {
      stat: '9 in 10 said their serum absorbed faster',
      basis: 'Consumer study, 76 participants, two weeks of twice-daily use.',
    },
    review: {
      quote:
        'I honestly thought a toner was a step you could skip. Then I ran out for a week and everything I put on afterwards just sat there. Ordered two this time.',
      name: 'Marguerite D.',
      note: 'Verified buyer · subscribes',
    },
    rating: 4.7,
    reviews: 184,
    featured: true,
  },
  {
    slug: 'radiance-boosting-serum',
    name: 'Radiance Boosting Serum',
    step: 3,
    role: 'Brighten',
    knockout: true,
    price: 80,
    category: 'Serums',
    size: '30ml',
    sizes: ['30ml'],
    concern: ['Dullness', 'Uneven tone'],
    image: 'serum-radiance',
    imageBack: 'serum-radiance-back',
    lifestyle: 'ritual-massage',
    hold: 'hold-dropper',
    short: 'A morning vitamin C that fades dark patches over weeks, without the sting or the orange oxidation.',
    ritualNote:
      'A morning-only step, and the one people are most tempted to move. It goes after the treatment serum and always, without exception, underneath sunscreen.',
    description:
      'Uneven tone is what makes skin read as tired, because light catches on it instead of bouncing off cleanly. Ascorbyl glucoside at 10% converts to pure vitamin C once it is on the skin, so it works where it matters rather than dying in the bottle. Ferulic acid holds it stable. It is slower than L-ascorbic acid and it is far kinder — most people see it at week six.',
    formula:
      'A stabilised vitamin C that stays clear in a clear bottle. If it ever turns amber, we will replace it.',
    ingredients: [
      'Aqua',
      'Ascorbyl Glucoside 10%',
      'Ferulic Acid',
      'Algae Extract',
      'Glycerin',
      'Sodium Hyaluronate',
      'Tocopherol',
    ],
    howToUse:
      'Two or three drops every morning, on damp skin, before your cream. Always follow with SPF 30 or higher — vitamin C and sunscreen do more together than either does alone. Build up to daily over a fortnight if your skin is new to it.',
    facts: [
      ['Texture', 'Light fluid'],
      ['Skin type', 'All — patch test if sensitive'],
      ['Fragrance', 'None'],
    ],
    claim: {
      stat: '89% said dark patches looked lighter',
      basis: 'Consumer study, 112 participants, six weeks of daily morning use.',
    },
    review: {
      quote:
        'Slow, but the good kind of slow. Nothing at all for a month and I nearly gave up. Week six, the patches on my cheekbones had genuinely faded. Stick with it.',
      name: 'Ayesha K.',
      note: 'Verified buyer · four months in',
    },
    rating: 4.8,
    reviews: 226,
    featured: true,
  },
  {
    slug: 'hydrating-serum-duo',
    name: 'The Hydration Duo',
    step: 5,
    role: 'Morning + night',
    knockout: true,
    price: 89,
    category: 'Sets',
    size: '30ml + 50ml',
    sizes: ['30ml + 50ml'],
    concern: ['Dryness', 'Dullness'],
    image: 'serum-radiance',
    imageBack: 'serum-radiance-back',
    lifestyle: 'garden-dropper',
    hold: 'hold-dropper',
    short:
      'The same hydrating core in two weights — a light fluid for daylight, a richer one for night.',
    description:
      'One formula, two textures, because skin does not want the same thing at 7am that it wants at 11pm. The 30ml is thin enough to disappear under SPF and makeup. The 50ml carries more squalane and takes its time. Buying them together is the cheapest way into the line, and the 30ml is exactly the size that clears airport security.',
    formula:
      'Both bottles share the same hydrating base. The night weight simply carries more squalane and a little more panthenol.',
    ingredients: [
      'Aqua (Alpine Spring Water)',
      'Sodium Hyaluronate',
      'Glycerin',
      'Panthenol',
      'Squalane',
      'Tocopherol',
    ],
    howToUse:
      'The 30ml every morning under SPF, the 50ml at night before your cream. Three or four drops either way. If you only take one travelling, take the 30ml.',
    facts: [
      ['Texture', 'Fluid by day, richer by night'],
      ['Skin type', 'All'],
      ['Cabin bag', '30ml, under the 100ml limit'],
    ],
    claim: {
      stat: '95% said skin felt hydrated all day',
      basis: 'Consumer study, 88 participants, two weeks of twice-daily use.',
    },
    review: {
      quote:
        'The small one lives permanently in my gym bag and has never once leaked. Same feel as the big bottle, which is the bit I was sceptical about.',
      name: 'Tom H.',
      note: 'Verified buyer · repeat customer',
    },
    rating: 4.9,
    reviews: 141,
    featured: false,
  },
  {
    slug: 'the-radiance-ritual-set',
    name: 'The Radiance Ritual Set',
    step: 6,
    role: 'All four steps',
    knockout: false,
    price: 305,
    compareAt: 350,
    category: 'Sets',
    size: 'Full size ×4',
    sizes: ['Full size ×4'],
    concern: ['Complete routine'],
    image: 'hold-cream',
    imageBack: 'hold-serum',
    lifestyle: 'ritual-pour',
    hold: 'hold-cream',
    short: 'The whole four-step routine in one box, at $45 under the price of the parts.',
    ritualNote:
      'The four steps above, in one box, in that order. The card in the lid repeats it in fewer words for the first fortnight, after which nobody needs it.',
    description:
      'Everything we make, in the order it was designed to be layered, with a card in the lid that tells you which bottle goes when. It is how most people start, and — going by what they reorder — how most of them stay. Full sizes throughout: there is no travel-size version of this box, because six weeks is what the formulas need.',
    formula:
      'Four full-size products, boxed. Nothing in here is a miniature and nothing is exclusive to the set.',
    ingredients: [
      'Skin Balancing Toner 150ml',
      'Radiance Boosting Serum 30ml',
      'Advanced Revitalizing Serum 50ml',
      'Night Repair Cream 50ml',
    ],
    howToUse:
      'Toner first, always. Radiance Serum in the morning, Revitalizing Serum at night, then the Night Repair Cream to seal. The card in the lid says the same thing in fewer words.',
    facts: [
      ['Contains', 'Four full-size products'],
      ['Value', '$45 below the parts'],
      ['Best for', 'Starting from scratch'],
    ],
    review: {
      quote:
        'Bought it for my sister and had to order a second one for myself within the week. The card in the lid is a small thing but it meant I actually used them in the right order.',
      name: 'Camille B.',
      note: 'Verified buyer · gifted twice',
    },
    rating: 5.0,
    reviews: 97,
    featured: false,
  },
]

export const categories = ['All', 'Serums', 'Moisturisers', 'Toners', 'Sets']

export const getProduct = (slug) => products.find((p) => p.slug === slug)

export const featured = () => products.filter((p) => p.featured)

/** The four ritual steps, in the order they're meant to be used. */
export const ritual = () =>
  products.filter((p) => p.featured).sort((a, b) => a.step - b.step)

export const money = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
