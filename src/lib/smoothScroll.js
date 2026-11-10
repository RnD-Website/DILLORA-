import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let tickerFn = null;

/**
 * Lenis 1.3.26 driven by GSAP's ticker so Lenis and ScrollTrigger share one
 * clock (no double rAF, no drift between scroll position and pinned scenes).
 */
export function initSmoothScroll() {
  if (lenis) return lenis;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reduce,
    syncTouch: false,
    touchMultiplier: 1.2,
    autoRaf: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  tickerFn = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
  return lenis;
}

export function getLenis() {
  return lenis;
}

export function destroySmoothScroll() {
  if (!lenis) return;
  gsap.ticker.remove(tickerFn);
  lenis.destroy();
  lenis = null;
  window.__lenis = null;
}

/** Smooth-scroll to a hash target (`#faq`) or element. */
export function scrollToTarget(target, opts = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, offset: 0, ...opts });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export { gsap, ScrollTrigger };
