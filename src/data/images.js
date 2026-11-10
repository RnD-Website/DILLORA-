/*
 * Real photography manifest.
 * - Product: the DILLORA jar photo (public/images/jars, baked per flavor).
 * - Lifestyle / ingredient photos: Freepik free-license stock (attribution
 *   required, see footer credit + docs/IMAGE_CREDITS.md).
 *
 * Stock photos load ONLY from licensed, unwatermarked originals in
 * /public/images/licensed/<key>.jpg. Watermarked previews are never used:
 * until a licensed file is present, <Photo> shows the DILLORA jar instead.
 */
/** Public-folder path that works at any base URL (site root or a sub-path). */
export const asset = (p) => `${import.meta.env?.BASE_URL ?? "/"}${p.replace(/^\//, '')}`;

export const STOCK = {
  board: {
    local: asset('/images/licensed/board.jpg'),
    remote: null, // licensed original (Freepik ID 5429976); previews are watermarked, never used
    id: 5429976,
  },
  // DILLORA brand shot (supplied)
  burger: {
    local: asset('/images/scenes/burger.webp'),
    small: asset('/images/scenes/burger-sm.webp'),
    remote: null,
  },
  // DILLORA brand shot (supplied)
  picnic: {
    local: asset('/images/scenes/picnic.webp'),
    small: asset('/images/scenes/picnic-sm.webp'),
    remote: null,
  },
  fridge: {
    local: asset('/images/licensed/fridge.jpg'),
    remote: null, // licensed original (Freepik ID 15365830); previews are watermarked, never used
    id: 15365830,
  },
  tacos: {
    local: asset('/images/licensed/tacos.jpg'),
    remote: null, // licensed original (Freepik ID 10685667); previews are watermarked, never used
    id: 10685667,
  },
  // DILLORA brand shot (supplied) — shipped with the project, no download needed
  brunch: {
    local: asset('/images/scenes/brunch.webp'),
    small: asset('/images/scenes/brunch-sm.webp'),
    remote: null,
  },
  slices: {
    local: asset('/images/licensed/slices.jpg'),
    remote: null, // licensed original (Freepik ID 7167908); previews are watermarked, never used
    id: 7167908,
  },
  ingredients: {
    local: asset('/images/licensed/ingredients.jpg'),
    remote: null, // licensed original (Freepik ID 10685669); previews are watermarked, never used
    id: 10685669,
  },
  jarBoard: {
    local: asset('/images/licensed/jarBoard.jpg'),
    remote: null, // licensed original (Freepik ID 10685680); previews are watermarked, never used
    id: 10685680,
  },
  jarHand: {
    local: asset('/images/licensed/jarHand.jpg'),
    remote: null, // licensed original (Freepik ID 17186892); previews are watermarked, never used
    id: 17186892,
  },
};

export const jarImage = (slug, size = '') => asset(`images/jars/${slug}${size ? `-${size}` : ''}.webp`);
