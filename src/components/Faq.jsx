import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/smoothScroll.js';
import { FAQ } from '../data/content.js';

export default function Faq() {
  const [open, setOpen] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.faq-item', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.06,
        scrollTrigger: { trigger: '.faq-list', start: 'top 80%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  // two columns, filled left-then-right like the reference
  const half = Math.ceil(FAQ.items.length / 2);
  const cols = [FAQ.items.slice(0, half), FAQ.items.slice(half)];

  return (
    <section id="faq" ref={ref} className="faq">
      <div className="section-heading-grid faq-heading-grid">
        <h2 className="faq-heading">{FAQ.title}</h2>
      </div>
      <div className="site-container faq-container">
        <div className="faq-list">
          {cols.map((col, c) => (
            <div key={c} className="faq-col">
              {col.map((item, j) => {
                const idx = c * half + j;
                const isOpen = open === idx;
                return (
                  <div key={item.q} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                      className="faq-question"
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${idx}`}
                      onClick={() => setOpen(isOpen ? -1 : idx)}
                    >
                      <span className="faq-question-text">{item.q}</span>
                      <span className="faq-toggle" aria-hidden="true">
                        <span className="faq-toggle-line faq-toggle-line-h" />
                        <span className="faq-toggle-line faq-toggle-line-v" />
                      </span>
                    </button>
                    <div className="faq-answer-wrap" id={`faq-a-${idx}`} role="region">
                      <div className="faq-answer-inner">
                        <p className="faq-answer">{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
