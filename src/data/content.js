import { STOCK } from './images.js';

/*
 * All copy, mapped 1:1 onto the YAAS section hierarchy and approximate lengths.
 * No health, nutrition or certification claims.
 */

export const BRAND = {
  name: 'DILLORA',
  wordmark: 'Dillora',
  tagline: 'CRUNCH INTO SOMETHING DIFFERENT.',
  email: 'hello@dillora.com',
  address: 'DILLORA Foods, 214 Orchard Lane, Studio 3, Portland, OR 97209, USA',
};

export const NAV = [
  { label: 'Flavors', href: '#flavors' },
  { label: 'About us', href: '#about' },
  { label: 'FAQ', href: '#faq' },
];

export const FOOTER_NAV = [
  { label: 'Flavors', href: '/#flavors' },
  { label: 'Why DILLORA', href: '/#why-dillora' },
  { label: 'About Us', href: '/#about' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contacts', href: '/#contact' },
];

export const HERO = {
  srTitle: 'DILLORA. Crunch into something different.',
  subhead:
    'Fresh cucumbers. Aromatic dill. Perfectly balanced flavor. Discover a new kind of crunch with DILLORA.',
  cta: 'Discover the Crunch',
  sliderHeading: '5 Flavors. 1 Crunch.',
  chooseLabel: 'Choose your jar',
  learnMore: 'Learn more',
};

export const PRODUCT_DESCRIPTION =
  'A delicious combination of crisp cucumbers, fragrant dill, mustard seeds, and carefully balanced pickle brine.';

export const SCREEN2 = {
  headlineInk: 'This isn’t just a pickle.',
  headlineAccent: 'It’s the crunch that makes every bite better.',
  subline: 'You don’t save DILLORA for special occasions — you open it whenever a meal needs that extra snap.',
};

/* Scenario cards (YAAS: six "when you need it" moments) */
export const SCENARIOS = [
  {
    id: 'board',
    title: 'Snack board o’clock',
    caption: 'When the cheese is out and the board needs something sharp',
    image: STOCK.board,
    alt: 'A DILLORA jar of sliced cucumber pickles with fresh cucumbers, dill, garlic and mustard seeds',
  },
  {
    id: 'burger',
    title: 'Straight from the jar',
    caption: 'When the forks come out and nobody waits for the sandwiches',
    image: STOCK.burger,
    alt: 'Three friends on a picnic blanket eating DILLORA cucumber pickles straight from the jars',
  },
  {
    id: 'picnic',
    title: 'Picnic in the park',
    caption: 'When the blanket’s down and the sandwiches need backup',
    image: STOCK.picnic,
    alt: 'Three friends at a sunny park picnic with DILLORA jars, fresh cucumber and a bread basket',
  },
  {
    id: 'fridge',
    title: 'Midnight fridge raid',
    caption: 'When it’s late, the kitchen’s quiet and the jar is calling',
    image: STOCK.fridge,
    alt: 'An open DILLORA clip jar of pickles beside a plate of pickle slices and a fork',
  },
  {
    id: 'tacos',
    title: 'Taco Tuesday',
    caption: 'When the salsa needs crunch and a little extra heat',
    image: STOCK.tacos,
    alt: 'A clip jar of whole pickles with chili, garlic and bay leaf',
  },
  {
    id: 'brunch',
    title: 'Slow Sunday brunch',
    caption: 'When the bagels are toasted and nobody’s in a hurry',
    image: STOCK.brunch,
    alt: 'Friends passing a DILLORA jar of cucumber dill pickles on a board across a dinner table',
  },
  {
    id: 'sandwich',
    title: 'Sandwich stacker',
    caption: 'When the deli order needs one last crunchy layer',
    image: STOCK.jarBoard,
    alt: 'A DILLORA clip jar of sliced pickles with garlic, dill and chili on a cutting board',
  },
];

export const ADVANTAGES = {
  title: 'Why DILLORA Beats Whatever’s Sitting in Your Fridge Right Now',
  items: [
    { n: '01', title: 'Serious Crunch', text: 'Thick-cut slices packed to stay crisp. You’ll hear the first bite.', color: '#657344' },
    { n: '02', title: 'Real Ingredients', text: 'Cucumbers, dill, mustard seeds, garlic and spices. Things you recognise.', color: '#34452A' },
    { n: '03', title: 'Balanced Brine', text: 'Tangy and savory without being harsh. Good enough to sip.', color: '#B4532A' },
    { n: '04', title: 'Whole Dill Fronds', text: 'Fresh, fragrant fronds you can actually see through the glass.', color: '#8a9a4a' },
    { n: '05', title: 'Glass Jar, Twist Lid', text: 'Clear glass, easy-open lid, and it looks good on the table.', color: '#C29A2E' },
  ],
};

export const FAQ = {
  title: 'Questions You’re Gonna Ask Anyway',
  items: [
    { q: 'What’s actually in the jar?', a: 'Cucumber slices, fresh dill, mustard seeds and brine, plus garlic, chili or lemon depending on the flavor. The full ingredient list is printed on every jar.' },
    { q: 'How crunchy are they, really?', a: 'Very. We cut them thick and pack them tight so they keep their snap. Chill the jar before opening for maximum crunch.' },
    { q: 'Which flavor should I start with?', a: 'Classic Dill if you want the benchmark. Garlic Dill for sandwiches, Spicy Dill for tacos, Bread & Butter for burgers, Lemon Dill for salads and boards.' },
    { q: 'How should I store an opened jar?', a: 'Keep it in the fridge with the slices covered by brine, and always use a clean fork. Check the jar for the recommended time to enjoy after opening.' },
    { q: 'Can I reuse the brine?', a: 'Plenty of people splash it into dressings, marinades and potato salad. Keep it chilled and use it up within the time printed on the jar.' },
    { q: 'Is the jar recyclable?', a: 'The glass jar and the metal lid can go into most household recycling streams. Check your local rules to be sure.' },
    { q: 'Where can I buy DILLORA?', a: 'The list of stores and online retailers is dropping here soon — follow us on social so you don’t miss it.' },
    { q: 'Do you do partnerships or food service?', a: 'Yes. Restaurants, delis, caterers and collaborations — drop us a line and we’ll figure it out together.' },
  ],
};

export const ABOUT = {
  line1: 'Not Just Pickles.',
  line2: 'For Crunch People.',
  lead:
    'DILLORA was started by people who were done with soggy, sad pickles hiding at the back of the fridge.',
  aside:
    'We’re about crisp cucumbers, real dill and a brine that’s balanced, not brutal. No shortcuts, no gimmicks — just a jar you’ll actually want to finish.',
  cards: [
    { image: STOCK.jarBoard, alt: 'A DILLORA clip jar of sliced pickles with garlic, dill and chili on a cutting board' },
    { image: STOCK.board, alt: 'A DILLORA jar of sliced cucumber pickles with fresh cucumbers and dill' },
    { image: STOCK.tacos, alt: 'A clip jar of whole pickles with chili, garlic and bay leaf' },
    { image: STOCK.fridge, alt: 'A DILLORA jar beside a plate of pickle slices' },
  ],
};

export const CONTACT = {
  heading: 'Questions, recipes, partnerships — hit us up, we’ll figure it out',
};

export const COOKIE = {
  title: 'Yes, we use cookies. Dill-flavored.',
  text: 'Analytics cookies show us how the site performs. No ads, no selling your data.',
  accept: 'Cool, got it',
  decline: 'No thanks',
};
