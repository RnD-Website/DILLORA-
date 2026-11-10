/*
 * Photography manifest — every photo is a DILLORA brand shot supplied by the client.
 * - Product cutout: public/images/jars (one per flavor, brine tone baked in).
 * - Lifestyle / still-life: public/images/scenes/<key>.webp (+ -sm.webp, 800px).
 */

/** Public-folder path that works at any base URL (site root or a sub-path). */
export const asset = (p) => `${import.meta.env?.BASE_URL ?? '/'}${p.replace(/^\//, '')}`;

const shot = (key) => ({
  local: asset(`/images/scenes/${key}.webp`),
  small: asset(`/images/scenes/${key}-sm.webp`),
  remote: null,
});

export const STOCK = {
  board: shot('board'), // screw-lid jar, cucumbers, dill, garlic
  burger: shot('burger'), // friends eating pickles on a picnic blanket
  picnic: shot('picnic'), // sunny park picnic with jars
  fridge: shot('fridge'), // clip jar + plate of slices with a fork
  tacos: shot('tacos'), // clip jar of whole gherkins with chili
  brunch: shot('brunch'), // dinner table, jar passed on a board
  jarBoard: shot('jarboard'), // clip jar of slices, garlic, chili on a board
};

export const jarImage = (slug, size = '') => asset(`images/jars/${slug}${size ? `-${size}` : ''}.webp`);
