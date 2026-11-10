import { useEffect, useRef } from 'react';
import { gsap } from '../lib/smoothScroll.js';
import { ADVANTAGES } from '../data/content.js';
import Faq from './Faq.jsx';

/*
 * Gradient section that rises with rounded corners. Five white cards are
 * dealt along an arc while pinned; the FAQ follows on the same backdrop.
 */
export default function Advantages() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const st = { offset: -1.5 };
    const n = ADVANTAGES.items.length;

    const render = () => {
      const first = cardsRef.current[0];
      if (!first) return;
      const w = first.offsetWidth;
      const R = Math.max(window.innerWidth * 1.4, 1200);
      const step = (w * 1.08) / R;
      cardsRef.current.forEach((el, i) => {
        const k = i - st.offset;
        const a = k * step;
        const x = Math.sin(a) * R;
        const y = (1 - Math.cos(a)) * R * 0.6;
        const vis = Math.abs(k) > 2.6 ? 0 : 1 - Math.max(0, Math.abs(k) - 1.8) / 0.8;
        el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(a * 57.2958).toFixed(2)}deg)`;
        el.style.opacity = String(Math.max(0, vis));
      });
    };

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(min-width: 1200px)', () => {
        gsap.fromTo(
          section,
          { '--rise-radius': '80px' },
          { '--rise-radius': '0px', ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true } }
        );
      });
      gsap.timeline({
        scrollTrigger: {
          id: 'advantages',
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.6}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: render,
        },
        onUpdate: render,
      }).fromTo(st, { offset: -2.2 }, { offset: n - 1 + 0.6, ease: 'none', duration: 1 });
      render();
      // title drop-in
      gsap.from('.advantages-title', {
        y: 40,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 70%' },
      });
    }, section);
    window.addEventListener('resize', render);
    return () => {
      window.removeEventListener('resize', render);
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section id="why-dillora" ref={sectionRef} className="advantages">
      <div className="advantages-bg" aria-hidden="true">
        <div className="hero-gradient-wrap is-static">
          <div className="gradient-field" />
        </div>
      </div>
      <div ref={pinRef} className="advantages-pin">
        <div className="advantages-title-row">
          <h2 className="advantages-title">{ADVANTAGES.title}</h2>
        </div>
        <div className="advantages-content">
          <div className="advantages-arc-cards">
            {ADVANTAGES.items.map((a, i) => (
              <article
                key={a.n}
                ref={(el) => (cardsRef.current[i] = el)}
                className="advantage-card"
                style={{ '--card-color': a.color }}
              >
                <p className="advantage-card-number">{a.n}</p>
                <h3 className="advantage-card-title">{a.title}</h3>
                <p className="advantage-card-description">{a.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Faq />
    </section>
  );
}
