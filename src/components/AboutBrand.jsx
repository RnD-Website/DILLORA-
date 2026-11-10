import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/smoothScroll.js';
import { ABOUT, BRAND } from '../data/content.js';
import Photo from './Photo.jsx';

/*
 * Pinned brand story: two-line heading → photo deck flies in and stacks,
 * copy fades in either side. After the pin the deck can be swiped
 * (front card drags off and goes to the back).
 */
const ROT = [-7, 5, -3, 2];

export default function AboutBrand({ children }) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const deckRef = useRef(null);
  const cardRefs = useRef([]);
  const [order, setOrder] = useState(ABOUT.cards.map((_, i) => i));
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'about',
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 3}`,
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => setInteractive(self.progress > 0.85),
        },
      });
      tl.from('.about-brand-heading-line-1', { yPercent: 60, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0)
        .from('.about-brand-heading-line-2', { yPercent: 40, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.1)
        .to('.about-brand-heading', { scale: 0.82, opacity: 0.12, duration: 0.8, ease: 'power2.inOut' }, 0.9);
      cardRefs.current.forEach((el, i) => {
        tl.fromTo(
          el,
          { y: () => window.innerHeight * 1.1, rotate: ROT[i] * 4, scale: 0.9 },
          { y: 0, rotate: ROT[i], scale: 1, duration: 0.9, ease: 'power3.out' },
          0.9 + i * 0.28
        );
      });
      tl.from('.about-brand-text-lead, .about-brand-aside', { opacity: 0, y: 30, duration: 0.6, stagger: 0.15 }, 1.9);
      tl.to({}, { duration: 0.4 });

      mm.add('(min-width: 1200px)', () => {
        gsap.fromTo(
          section,
          { '--fall-radius': '0px' },
          {
            '--fall-radius': '120px',
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'bottom bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    }, section);
    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  /* swipeable deck */
  const drag = useRef(null);
  const onDown = (e, idx) => {
    if (!interactive || idx !== order[0]) return;
    const el = cardRefs.current[idx];
    el.setPointerCapture(e.pointerId);
    drag.current = { idx, x0: e.clientX, y0: e.clientY, el };
    el.classList.add('is-dragging');
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    gsap.set(d.el, { x: dx, y: dy * 0.3, rotate: ROT[d.idx] + dx * 0.05 });
  };
  const onUp = (e) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    d.el.classList.remove('is-dragging');
    const dx = e.clientX - d.x0;
    if (Math.abs(dx) > 80) {
      gsap.to(d.el, {
        x: Math.sign(dx) * window.innerWidth * 0.35,
        rotate: ROT[d.idx] + Math.sign(dx) * 18,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          setOrder((o) => [...o.slice(1), o[0]]);
          gsap.to(d.el, { x: 0, y: 0, rotate: ROT[d.idx], duration: 0.6, ease: 'power3.out' });
        },
      });
    } else {
      gsap.to(d.el, { x: 0, y: 0, rotate: ROT[d.idx], duration: 0.5, ease: 'power3.out' });
    }
  };

  return (
    <section id="about" ref={sectionRef} className="about-brand">
      <div className="about-brand-watermark" aria-hidden="true">
        {BRAND.wordmark}
      </div>
      <div ref={pinRef} className="about-brand-pin">
        <div className="about-brand-heading-slot">
          <h2 className="about-brand-heading">
            <span className="about-brand-heading-line-1">{ABOUT.line1}</span>
            <span className="about-brand-heading-line-2">{ABOUT.line2}</span>
          </h2>
        </div>
        <div className="about-brand-stage">
          <p className="about-brand-text about-brand-text-lead">{ABOUT.lead}</p>
          <div ref={deckRef} className={`about-brand-deck ${interactive ? 'is-interactive' : ''}`}>
            {ABOUT.cards.map((c, i) => {
              const depth = order.indexOf(i);
              return (
                <div
                  key={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className={`about-brand-card ${depth === 0 ? 'is-front' : ''}`}
                  style={{ zIndex: ABOUT.cards.length - depth }}
                  onPointerDown={(e) => onDown(e, i)}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={onUp}
                >
                  <div className="about-brand-card-face">
                    <Photo image={c.image} alt={c.alt} width={1200} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="about-brand-aside">
            <p className="about-brand-text">{ABOUT.aside}</p>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
