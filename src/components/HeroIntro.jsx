import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger, scrollToTarget, getLenis } from '../lib/smoothScroll.js';
import { applyHeroLayout } from '../lib/layout.js';
import { jarTransform } from '../lib/jarChoreography.js';
import { useFitText } from '../lib/useFitText.js';
import { FLAVORS } from '../data/flavors.js';
import { HERO, NAV, BRAND } from '../data/content.js';
import { jarImage } from '../data/images.js';
import DropText from './DropText.jsx';
import ArrowIcon from './ArrowIcon.jsx';

const N = FLAVORS.length;

export default function HeroIntro({ ready }) {
  const wrapRef = useRef(null);
  const pinRef = useRef(null);
  const jarRefs = useRef([]);
  const logoRef = useRef(null);
  const mobileLogoRef = useRef(null);
  const state = useRef({ h2g: 0, detail: 0, active: 0, entrance: FLAVORS.map(() => 0), t: 0 });
  const viewRef = useRef({ vw: 1440, vh: 900, mobile: false, base: 320 });

  const [active, setActive] = useState(0);
  const [copyVisible, setCopyVisible] = useState(false);
  const [entranceDone, setEntranceDone] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [sliderVisible, setSliderVisible] = useState(false);

  const flavor = FLAVORS[active];
  const logoSize = useFitText(BRAND.wordmark, () => 1200);
  const mobileLogoSize = useFitText(BRAND.wordmark, () => Math.max(280, window.innerWidth - 20), []);

  /* ---------- layout ---------- */
  useLayoutEffect(() => {
    const onResize = () => {
      const l = applyHeroLayout();
      viewRef.current = { vw: l.vw, vh: l.vh, mobile: !l.isDesktop, base: l.vh * (l.isDesktop ? 0.36 : 0.3) };
      jarRefs.current.forEach((el) => {
        if (el) el.style.height = `${viewRef.current.base}px`;
      });
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ---------- render loop: write transforms, no React re-renders ---------- */
  useEffect(() => {
    let visible = true;
    const pin = pinRef.current;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(wrapRef.current);
    const tick = (time) => {
      if (!visible) return;
      const st = state.current;
      st.t = time;
      const v = viewRef.current;
      pin.style.setProperty('--h2g', st.h2g.toFixed(4));
      pin.style.setProperty('--detail', st.detail.toFixed(4));
      for (let i = 0; i < N; i++) {
        const el = jarRefs.current[i];
        if (!el) continue;
        const p = jarTransform(i, st, v);
        el.style.transform = `translate3d(-50%, -50%, 0) translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) rotate(${p.r.toFixed(2)}deg) scale(${p.s.toFixed(4)})`;
        el.style.opacity = p.opacity;
        el.style.zIndex = p.z;
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
    };
  }, []);

  /* ---------- entrance (after loader) ---------- */
  useEffect(() => {
    if (!ready) return;
    const lenis = getLenis();
    lenis?.stop();
    const st = state.current;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setEntranceDone(true);
          lenis?.start();
        },
      });
      const pieces = [
        ...(logoRef.current?.querySelectorAll('.drop-text-piece') || []),
        ...(mobileLogoRef.current?.querySelectorAll('.drop-text-piece') || []),
      ];
      tl.fromTo(
        pieces,
        { yPercent: -70, opacity: 0, filter: 'blur(14px)' },
        { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out', stagger: 0.06 },
        0
      );
      st.entrance.forEach((_, i) => {
        tl.to(st.entrance, { [i]: 1, duration: 1.15, ease: 'power3.out' }, 0.25 + i * 0.09);
      });
      tl.add(() => setCopyVisible(true), 0.7);
    });
    return () => ctx.revert();
  }, [ready]);

  /* ---------- scroll choreography ---------- */
  useEffect(() => {
    const st = state.current;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'intro',
          trigger: wrapRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            setSliderVisible(p > 0.13 && p < 0.47);
            setDetailVisible(p > 0.5);
          },
        },
      });
      // total = 1 → 300vh of scroll; screen2 rises over the last third
      tl.to(st, { h2g: 1, duration: 0.2, ease: 'power2.inOut' }, 0);
      tl.to(st, { detail: 1, duration: 0.16, ease: 'power2.inOut' }, 0.42);
      tl.to({}, { duration: 0.42 }, 0.58);
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  /* ---------- carousel ---------- */
  const goTo = useCallback((next) => {
    const st = state.current;
    const target = ((next % N) + N) % N;
    setActive(target);
    // shortest path in float space
    let diff = target - (((st.active % N) + N) % N);
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    gsap.to(st, { active: st.active + diff, duration: 0.6, ease: 'power3.out', overwrite: true });
  }, []);
  const prev = () => goTo(active - 1);
  const next = () => goTo(active + 1);

  useEffect(() => {
    document.documentElement.style.setProperty('--flavor-color', flavor.color);
  }, [flavor]);

  // drag / swipe on the slider stage
  const drag = useRef(null);
  const onPointerDown = (e) => (drag.current = e.clientX);
  const onPointerUp = (e) => {
    if (drag.current == null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!sliderVisible && !detailVisible) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const toSlider = (e) => {
    e.preventDefault();
    const st = ScrollTrigger.getById('intro');
    if (!st) return;
    const y = st.start + (st.end - st.start) * 0.3;
    getLenis() ? getLenis().scrollTo(y, { duration: 1.8 }) : window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const onNav = (e, href) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    if (href === '#flavors') return toSlider(e);
    scrollToTarget(href);
  };

  return (
    <section id="flavors" ref={wrapRef} className="intro-wrap">
      <div
        ref={pinRef}
        className={`intro-pin ${entranceDone ? 'is-entrance-done' : 'is-entrance-active'}`}
      >
        <div className="hero-gradient-wrap" aria-hidden="true">
          <div className="gradient-field" />
        </div>

        <div className="app-root">
          <div className="background-layer" style={{ backgroundColor: flavor.color }} aria-hidden="true">
            <div className="background-texture" />
          </div>
          <div className="center-glow is-visible" aria-hidden="true" />

          {/* giant wordmark sits behind the jars */}
          <div className="hero-stage hero-stage-back" aria-hidden="true">
            <div className="hero-logo-giant">
              <DropText
                ref={logoRef}
                text={BRAND.wordmark}
                className="logo-text"
                style={logoSize ? { fontSize: `${logoSize}px` } : undefined}
              />
            </div>
          </div>
          <div className="hero-mobile-banner-logo-row" aria-hidden="true">
            <DropText
              ref={mobileLogoRef}
              text={BRAND.wordmark}
              className="logo-text hero-mobile-banner-logo"
              style={mobileLogoSize ? { fontSize: `${mobileLogoSize}px` } : undefined}
            />
          </div>

          <div className="jar-layer" aria-hidden={!sliderVisible && !detailVisible}>
            {FLAVORS.map((f, i) => (
              <img
                key={f.slug}
                ref={(el) => (jarRefs.current[i] = el)}
                className="hero-jar"
                src={jarImage(f.slug)}
                srcSet={`${jarImage(f.slug, 'md')} 429w, ${jarImage(f.slug)} 720w`}
                sizes="(max-width: 959px) 60vw, 40vw"
                alt={`${f.name} — DILLORA cucumber pickles in a glass jar`}
                width="720"
                height="1074"
                fetchpriority={i < 3 ? 'high' : 'auto'}
                decoding="async"
                draggable="false"
              />
            ))}
          </div>

          <div className="ui-layer">
            {/* slider */}
            <div className={`slider-screen ${sliderVisible ? '' : 'is-hidden'}`}>
              <h2 className="slider-heading">{HERO.sliderHeading}</h2>
              <div
                className="slider-stage"
                data-interactive
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerLeave={() => (drag.current = null)}
              />
              <button className="arrow arrow-left" onClick={prev} aria-label="Previous flavor" data-interactive>
                <ArrowIcon dir="left" />
              </button>
              <button className="arrow arrow-right" onClick={next} aria-label="Next flavor" data-interactive>
                <ArrowIcon dir="right" />
              </button>
              <p key={flavor.slug} className="flavor-name" aria-live="polite">
                {flavor.name}
              </p>
            </div>

            {/* detail */}
            <div className="detail-screen">
              <div className={`detail-copy ${detailVisible ? 'is-visible' : ''}`}>
                <h2 className="detail-title">{flavor.name}</h2>
                <div className="detail-can-space" aria-hidden="true" />
                <p className="detail-description">{flavor.description}</p>
                <Link to={`/flavors/${flavor.slug}`} className="detail-cta" data-interactive>
                  {HERO.learnMore} <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className={`detail-switcher-wrap ${detailVisible ? 'is-visible' : ''}`}>
                <p className="choose-label">{HERO.chooseLabel}</p>
                <div className="flavor-switcher" role="tablist" aria-label="Choose a flavor">
                  {FLAVORS.map((f, i) => (
                    <button
                      key={f.slug}
                      role="tab"
                      aria-selected={i === active}
                      aria-label={f.name}
                      className={`flavor-thumb ${i === active ? 'is-active' : ''}`}
                      onClick={() => goTo(i)}
                      data-interactive
                    >
                      <span className="flavor-thumb-pill" />
                      <img src={jarImage(f.slug, 'thumb')} alt="" loading="lazy" width="161" height="240" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-screen">
          <h1 className="sr-only">{HERO.srTitle}</h1>
          <div className="hero-stage site-header">
            <nav className="hero-nav" aria-label="Primary">
              <div className="hero-nav-left">
                {NAV.map((n) => (
                  <a key={n.href} href={n.href} className="hero-pill" onClick={(e) => onNav(e, n.href)}>
                    {n.label}
                  </a>
                ))}
              </div>
              <div className="hero-nav-right">
                <a href="#contact" className="hero-pill" onClick={(e) => onNav(e, '#contact')}>
                  Contacts
                </a>
              </div>
            </nav>
          </div>
          <div className="hero-stage hero-stage-front">
            <div className={`hero-copy ${copyVisible ? 'is-visible' : ''}`}>
              <div className="hero-copy-row">
                <p className="hero-subhead">{HERO.subhead}</p>
                <a href="#flavors" className="hero-cta" onClick={toSlider}>
                  {HERO.cta} <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
