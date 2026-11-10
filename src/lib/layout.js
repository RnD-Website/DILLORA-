/*
 * Hero layout maths (reference: a 1200×650 stage scaled to fit the viewport,
 * with --hero-margin feeding --content-inline on ≥1200px).
 * At 1440×900 this yields scale ≈ 1.043 and a 94px side margin — matching the reference.
 */
export const STAGE_W = 1200;
export const STAGE_H = 650;

export function computeHeroLayout() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.max(0.6, Math.min((vw - 188) / STAGE_W, (vh - 222) / STAGE_H));
  const margin = Math.max(20, (vw - STAGE_W * scale) / 2);
  return { vw, vh, scale, margin, isDesktop: vw >= 960, isWide: vw >= 1200, isMobile: vw < 640 };
}

export function applyHeroLayout() {
  const l = computeHeroLayout();
  const root = document.documentElement;
  root.style.setProperty('--hero-scale', String(l.scale));
  root.style.setProperty('--hero-margin', `${l.margin}px`);
  root.style.setProperty('--vh', `${l.vh * 0.01}px`);
  return l;
}

export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const mapRange = (v, a, b) => clamp01((v - a) / (b - a));
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
