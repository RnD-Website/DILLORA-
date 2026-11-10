import { useEffect, useRef } from 'react';
import { gsap } from '../lib/smoothScroll.js';
import { SCREEN2, SCENARIOS } from '../data/content.js';
import Photo from './Photo.jsx';

/*
 * White panel that rises over the intro with an arched top.
 * Phase A  arc gallery: scenario photos travel along an arc under the headline.
 * Phase B  the centre card expands to a full-bleed card (FLIP).
 * Phase C  stacked full-bleed scenario cards slide up one after another.
 */
const ARC_CARDS = [...SCENARIOS, ...SCENARIOS]; // two loops keep the arc full
const ZOOM_INDEX = SCENARIOS.length + 2; // arc card that expands (scenario #2: your picnic shot)
const START_OFFSET = ZOOM_INDEX - 3;
const STACK = SCENARIOS.map((_, i) => SCENARIOS[(i + (ZOOM_INDEX % SCENARIOS.length)) % SCENARIOS.length]);

export default function Screen2() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const stageRef = useRef(null);
  const targetRef = useRef(null);
  const cardsRef = useRef([]);
  const stackRef = useRef([]);
  const zoomRef = useRef(null);
  const stackLayerRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const st = { offset: START_OFFSET, zoom: 0 };
    const zoomCard = zoomRef.current;

    const geom = () => {
      const stage = stageRef.current.getBoundingClientRect();
      const pin = pinRef.current.getBoundingClientRect();
      const target = targetRef.current.getBoundingClientRect();
            // untransformed card size is the CSS width (transform is scale-free on the centre slot)
      const w = cardsRef.current[0].offsetWidth;
      const h = cardsRef.current[0].offsetHeight;
      const top = parseFloat(getComputedStyle(cardsRef.current[0]).top) || stage.height / 2;
      return {
        cx: stage.left - pin.left + stage.width / 2,
        cy: stage.top - pin.top + top,
        w,
        h,
        tx: target.left - pin.left,
        ty: target.top - pin.top,
        tw: target.width,
        th: target.height,
        R: Math.max(window.innerWidth * 1.15, 1100),
      };
    };
    let g = null;

    const render = () => {
      if (!g) g = geom();
      const step = (g.w * 1.06) / g.R; // radians between cards
      const z = st.zoom;
      cardsRef.current.forEach((el, i) => {
        const k = i - st.offset;
        const a = k * step;
        const x = Math.sin(a) * g.R;
        const y = (1 - Math.cos(a)) * g.R * 0.55;
        const centre = Math.abs(k) < 0.5;
        const fade = Math.abs(k) > 4.5 ? 0 : 1;
        el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(a * 57.2958 * 0.9).toFixed(2)}deg)`;
        el.style.opacity = String(fade * (1 - z * (centre ? 1 : 1.4)));
      });
      // zoom card: from the centre slot to the full-bleed target
      const zx = g.cx - g.w / 2;
      const zy = g.cy - g.h / 2;
      const ez = z < 0.001 ? 0 : z;
      zoomCard.style.left = `${zx + (g.tx - zx) * ez}px`;
      zoomCard.style.top = `${zy + (g.ty - zy) * ez}px`;
      zoomCard.style.width = `${g.w + (g.tw - g.w) * ez}px`;
      zoomCard.style.height = `${g.h + (g.th - g.h) * ez}px`;
      zoomCard.style.visibility = z > 0.001 ? 'visible' : 'hidden';
      zoomCard.style.setProperty('--copy', String(Math.max(0, (z - 0.7) / 0.3)));
    };

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // arched top while rising (desktop only, as in the reference)
      mm.add('(min-width: 1200px)', () => {
        gsap.fromTo(
          section,
          { '--rise-x': '50%', '--rise-y': '42vh' },
          {
            '--rise-x': '0%',
            '--rise-y': '0vh',
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true },
          }
        );
      });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'screen2',
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * (3 + (SCENARIOS.length - 1) * 0.9 + 0.6)}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: () => {
            g = geom();
            render();
          },
        },
      });
      tl.to(st, { offset: ZOOM_INDEX, duration: 2, ease: 'power1.inOut' }, 0);
      tl.to('.screen2-headline, .screen2-subline', { opacity: 0, y: -20, duration: 0.4 }, 2);
      tl.to(st, { zoom: 1, duration: 1, ease: 'power2.inOut' }, 2);
      /* ---------- full-bleed deck ---------- */
      const cards = stackRef.current;
      const N = cards.length;
      const STEP = 0.9; // scroll (in viewport heights) per card
      const counter = counterRef.current;
      const bar = barRef.current;
      // resting state: card 0 in place, card 1 peeking, the rest waiting below
      gsap.set(cards, { yPercent: 120, rotation: 3, transformOrigin: '50% 0%' });
      gsap.set(cards[0], { yPercent: 0, rotation: 0 });
      gsap.set(cards[1], { yPercent: 99, rotation: 1.2 });
      gsap.set(stackLayerRef.current, { autoAlpha: 0 });
      cards.forEach((c, i) => {
        if (i === 0) return;
        gsap.set(c.querySelector('.scenario-card-img'), { scale: 1.22 });
        gsap.set(c.querySelectorAll('.scenario-card-copy > *'), { y: 40, opacity: 0 });
      });

      tl.set(stackLayerRef.current, { autoAlpha: 1 }, 3);
      tl.set(zoomCard, { autoAlpha: 0 }, 3);
      for (let i = 1; i < N; i++) {
        const at = 3 + (i - 1) * STEP;
        // incoming card slides up and straightens; its photo settles from a zoom
        tl.to(cards[i], { yPercent: 0, rotation: 0, duration: STEP, ease: 'power2.inOut' }, at);
        tl.to(cards[i].querySelector('.scenario-card-img'), { scale: 1, duration: STEP * 1.1, ease: 'power2.out' }, at);
        tl.to(cards[i].querySelectorAll('.scenario-card-copy > *'), { y: 0, opacity: 1, duration: STEP * 0.45, stagger: 0.08, ease: 'power3.out' }, at + STEP * 0.55);
        // the next one peeks in from below
        if (cards[i + 1]) tl.to(cards[i + 1], { yPercent: 99, rotation: 1.2, duration: STEP, ease: 'power2.inOut' }, at);
        // everything already played steps back into the deck
        for (let j = 0; j < i; j++) {
          const d = i - j;
          tl.to(cards[j], { scale: 1 - Math.min(d, 4) * 0.045, y: -Math.min(d, 4) * 16, duration: STEP, ease: 'power2.inOut' }, at);
          tl.to(cards[j].querySelector('.scenario-card-dim'), { opacity: Math.min(0.2 + d * 0.15, 0.7), duration: STEP }, at);
        }
      }
      // counter + progress bar follow the deck
      const deckStart = 3;
      const deckEnd = 3 + (N - 1) * STEP;
      tl.eventCallback('onUpdate', () => {
        render();
        const t = tl.time();
        const p = Math.min(1, Math.max(0, (t - deckStart) / (deckEnd - deckStart)));
        const idx = Math.min(N, 1 + Math.round(p * (N - 1)));
        if (counter) counter.textContent = `${String(idx).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
        if (bar) bar.style.transform = `scaleX(${(idx / N).toFixed(3)})`;
      });
      tl.to({}, { duration: 0.3 });
    }, section);

    const onResize = () => {
      g = null;
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="screen2">
      <div className="screen2-bg-fixed" aria-hidden="true" />
      <div ref={pinRef} className="screen2-pin">
        <div ref={targetRef} className="screen2-arc-target" aria-hidden="true" />
        <div className="screen2-arc-inner">
          <div className="screen2-headline">
            <h2 className="screen2-h2">
              <span className="screen2-h2-ink">{SCREEN2.headlineInk}</span>{' '}
              <span className="screen2-h2-accent">{SCREEN2.headlineAccent}</span>
            </h2>
          </div>
          <div ref={stageRef} className="screen2-arc-stage">
            {ARC_CARDS.map((s, i) => (
              <div key={`${s.id}-${i}`} ref={(el) => (cardsRef.current[i] = el)} className="screen2-arc-card">
                <Photo image={s.image} alt={s.alt} className="scenario-card-img" width={800} />
              </div>
            ))}
          </div>
          <p className="screen2-subline">{SCREEN2.subline}</p>
        </div>

        {/* expanding card (FLIP) */}
        <div ref={zoomRef} className="scenario-zoom" aria-hidden="true">
          <Photo image={STACK[0].image} alt="" className="scenario-card-img" />
          <div className="scenario-card-shade" />
          <div className="scenario-card-copy">
            <h3 className="scenario-card-title">{STACK[0].title}</h3>
            <p className="scenario-card-caption">{STACK[0].caption}</p>
          </div>
        </div>

        {/* full-bleed stack */}
        <div ref={stackLayerRef} className="scenario-stack">
          <div className="scenario-deck-meta" aria-hidden="true">
            <span ref={counterRef} className="scenario-deck-count">01 / {String(STACK.length).padStart(2, '0')}</span>
            <span className="scenario-deck-bar"><span ref={barRef} /></span>
          </div>
          {STACK.map((s, i) => (
            <article
              key={s.id}
              ref={(el) => (stackRef.current[i] = el)}
              className="scenario-card-iso"
              style={{ zIndex: i + 1 }}
              aria-hidden={false}
            >
              <Photo image={s.image} alt={s.alt} className={`scenario-card-img scenario-card-img-${s.id}`} />
              <div className="scenario-card-shade" />
              <div className="scenario-card-dim" />
              <div className="scenario-card-copy">
                <h3 className="scenario-card-title">{s.title}</h3>
                <p className="scenario-card-caption">{s.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
