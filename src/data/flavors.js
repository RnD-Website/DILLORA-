/*
 * Five DILLORA jars replace the five YAAS cans 1:1 so every carousel,
 * switcher and gallery keeps its original rhythm.
 * `color` drives the section background (YAAS: per-flavor background).
 * Jar images: /public/images/jars/<slug>.webp (real product photo, brine tone per flavor).
 */
export const FLAVORS = [
  {
    slug: 'classic-dill',
    name: 'Classic Dill',
    short: 'Classic',
    color: '#657344',
    accent: '#3f4a26',
    brine: '#e6eaa0',
    extras: [],
    description:
      'The one that started it all. Crisp cucumber slices, fresh dill and whole mustard seeds in a bright, balanced brine — clean, sharp and seriously crunchy.',
    badges: 'Cucumber · Dill · Mustard Seed',
    story: [
      { kicker: 'Crisp first.', line: 'Thick-cut cucumber slices packed by hand so every bite snaps.' },
      { kicker: 'Dill, a lot.', line: 'Whole fronds, not dust. You can see it, you can smell it.' },
      { kicker: 'Balanced brine', line: 'Tangy, savory, never harsh. Built to be sipped straight from the jar. (We won’t tell.)' },
      { kicker: 'Classic. Just louder.', line: '' },
    ],
  },
  {
    slug: 'garlic-dill',
    name: 'Garlic Dill',
    short: 'Garlic',
    color: '#34452A',
    accent: '#1f2a18',
    brine: '#ecebbf',
    extras: ['garlic'],
    description:
      'Classic dill with whole garlic cloves steeped right in the jar. Savory, punchy and exactly what your sandwich has been missing.',
    badges: 'Cucumber · Garlic · Dill',
    story: [
      { kicker: 'Whole cloves.', line: 'Real garlic, steeped in the brine until it means business.' },
      { kicker: 'Savory hit', line: 'Deep, rounded flavor that sticks around in the best way.' },
      { kicker: 'Sandwich upgrade', line: 'Layer it, stack it, or eat it standing at the fridge.' },
      { kicker: 'Bold on purpose.', line: '' },
    ],
  },
  {
    slug: 'spicy-dill',
    name: 'Spicy Dill',
    short: 'Spicy',
    color: '#B4532A',
    accent: '#7a3218',
    brine: '#f0d39a',
    extras: ['chili'],
    description:
      'Chili flakes and a whole red pepper turn up the heat without drowning the dill. Crunch first, warmth right after.',
    badges: 'Cucumber · Chili · Dill',
    story: [
      { kicker: 'Heat, balanced.', line: 'Chili warmth that builds slowly and lets the dill talk.' },
      { kicker: 'Red on green', line: 'Whole peppers in the jar. It looks as loud as it tastes.' },
      { kicker: 'Taco night ready', line: 'Chop it into salsa or pile it on anything grilled.' },
      { kicker: 'Turn it up.', line: '' },
    ],
  },
  {
    slug: 'bread-and-butter',
    name: 'Bread & Butter',
    short: 'Sweet',
    color: '#D6B44C',
    accent: '#8a6f1d',
    brine: '#f2d98a',
    extras: ['extraMustard'],
    description:
      'The sweet-tangy one. A golden brine with extra mustard seed and a gentle sweetness that plays perfectly with cheese and burgers.',
    badges: 'Cucumber · Mustard Seed · Golden Brine',
    story: [
      { kicker: 'Sweet meets tang', line: 'A golden brine with a gentle sweetness and a tangy finish.' },
      { kicker: 'Extra mustard', line: 'Twice the seeds for that little pop in every bite.' },
      { kicker: 'Burger’s best friend', line: 'Stack it on a cheeseburger and never look back.' },
      { kicker: 'Golden hour.', line: '' },
    ],
  },
  {
    slug: 'lemon-dill',
    name: 'Lemon Dill',
    short: 'Lemon',
    color: '#A8B76A',
    accent: '#5d6a2c',
    brine: '#f0efb4',
    extras: ['lemon'],
    description:
      'Bright lemon slices and fresh dill for a zesty, lighter take. Fresh enough for salads, bold enough for a snack board.',
    badges: 'Cucumber · Lemon · Dill',
    story: [
      { kicker: 'Zest mode.', line: 'Real lemon slices for a bright, clean finish.' },
      { kicker: 'Fresh dill', line: 'Herby, green and right up front.' },
      { kicker: 'Board ready', line: 'Next to cheese, smoked fish or straight on a salad.' },
      { kicker: 'Bright side up.', line: '' },
    ],
  },
];

export const DEFAULT_FLAVOR_INDEX = 0;

export const flavorBySlug = (slug) => FLAVORS.find((f) => f.slug === slug);
