import { lerp, easeInOut } from './layout.js';

/*
 * Pose engine for the five real jar photos in the intro.
 * Three states blended by scroll, mirroring the reference's can sequence:
 *   hero     → products tilted around the giant wordmark
 *   carousel → five-up slider ("5 Flavors. 1 Crunch.")
 *   detail   → active jar oversized on the right, copy on the left
 * Units: x in vw, y in vh, rotation in degrees, s = multiple of the base jar
 * height (36% of the viewport height — the centre jar in the slider).
 */

const HERO_DESKTOP = [
  { x: -0.035, y: -0.36, r: 152, s: 1.45 }, // top centre, flipped
  { x: -0.44, y: 0.27, r: 28, s: 1.75 }, // bottom left
  { x: 0.47, y: -0.03, r: -146, s: 1.35 }, // right edge
  { x: 0.2, y: 0.95, r: -20, s: 1.2 }, // waits below
  { x: -0.15, y: 1.0, r: 18, s: 1.2 }, // waits below
];

const HERO_MOBILE = [
  { x: 0.1, y: -0.02, r: 160, s: 1.0 },
  { x: -0.4, y: 0.12, r: 26, s: 1.05 },
  { x: 0.44, y: 0.17, r: -150, s: 0.9 },
  { x: 0.2, y: 0.95, r: -20, s: 1 },
  { x: -0.2, y: 1.0, r: 18, s: 1 },
];

// carousel slot by relative index (-2..2)
function carouselSlot(k, mobile) {
  const ak = Math.abs(k);
  const spacing = mobile ? 0.52 : 0.215;
  const x = k * spacing + Math.sign(k) * Math.max(0, ak - 1) * (mobile ? 0.25 : 0.02);
  const s = (ak < 1 ? lerp(1, 0.8, ak) : 0.8 - Math.max(0, ak - 1) * 0.05) * (mobile ? 1.15 : 1.42);
  const y = mobile ? -0.02 : 0.023;
  return { x, y, r: 0, s };
}

function detailSlot(k, mobile) {
  if (Math.abs(k) < 0.5) {
    return mobile
      ? { x: 0, y: 0.02, r: 10, s: 1.15 }
      : { x: 0.205, y: 0.16, r: 14, s: 2.75 };
  }
  // others leave the stage in the direction they were sitting
  const dir = Math.sign(k) || 1;
  return { x: dir * (mobile ? 1.2 : 0.9), y: mobile ? 0.1 : 0.35, r: dir * 25, s: 1.2 };
}

export function wrapIndex(v, n) {
  // relative position in [-n/2, n/2)
  const half = n / 2;
  return ((((v + half) % n) + n) % n) - half;
}

/**
 * @param {number} i         jar index
 * @param {object} st        { h2g, detail, active (float), entrance[i], t (seconds) }
 * @param {object} view      { vw, vh, mobile }
 */
export function jarTransform(i, st, view) {
  const n = 5;
  const mobile = view.mobile;
  const hero = (mobile ? HERO_MOBILE : HERO_DESKTOP)[i];
  const k = wrapIndex(i - st.active, n);
  const car = carouselSlot(k, mobile);
  const det = detailSlot(k, mobile);

  const h = easeInOut(st.h2g);
  const d = easeInOut(st.detail);

  // idle float only while resting in the hero
  const idle = 1 - h;
  const fx = Math.sin(st.t * 0.6 + i * 1.7) * 0.004 * idle;
  const fy = Math.cos(st.t * 0.8 + i * 1.3) * 0.008 * idle;
  const fr = Math.sin(st.t * 0.5 + i) * 2.2 * idle;

  // carousel: centre jar gently sways
  const sway = k === 0 || Math.abs(k) < 0.5 ? Math.sin(st.t * 0.9) * 2 * h * (1 - d) : 0;

  let x = lerp(hero.x, car.x, h) + fx;
  let y = lerp(hero.y, car.y, h) + fy;
  let r = lerp(hero.r, car.r, h) + fr + sway;
  let s = lerp(hero.s, car.s, h);

  x = lerp(x, det.x, d);
  y = lerp(y, det.y, d);
  r = lerp(r, det.r, d);
  s = lerp(s, det.s, d);

  // entrance: rise from below with a spin
  const e = st.entrance[i];
  const eInv = 1 - e;
  y += eInv * 1.1;
  r += eInv * (i % 2 ? -40 : 40);

  return {
    x: x * view.vw,
    y: y * view.vh,
    r,
    s,
    opacity: Math.min(1, e * 1.5),
    z: Math.round(100 - Math.abs(k) * 10),
  };
}
