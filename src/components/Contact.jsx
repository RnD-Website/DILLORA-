import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/smoothScroll.js';
import { CONTACT, BRAND } from '../data/content.js';
import { FLAVORS } from '../data/flavors.js';
import { jarImage } from '../data/images.js';

/* Gradient contact panel with real jar photos floating past on scroll. */
const JARS = [
  { flavor: 0, left: '2%', top: '6%', h: '38%', r: -18, speed: -120 },
  { flavor: 2, left: '13%', top: '62%', h: '30%', r: 14, speed: 90 },
  { flavor: 3, left: '84%', top: '2%', h: '34%', r: 16, speed: -80 },
  { flavor: 4, left: '76%', top: '58%', h: '40%', r: -12, speed: 130 },
];

export default function Contact() {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.contact-can').forEach((el, i) => {
        const j = JARS[i];
        gsap.fromTo(
          el,
          { y: -j.speed, rotate: j.r - 10 },
          {
            y: j.speed,
            rotate: j.r + 10,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
      gsap.from('.contact-heading, .contact-actions', {
        y: 30,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BRAND.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${BRAND.email}`;
    }
  };

  return (
    <section id="contact" ref={ref} className="contact">
      <div className="contact-frame">
        <div className="contact-panel">
          <div className="hero-gradient-wrap is-static" aria-hidden="true">
            <div className="gradient-field" />
          </div>
          <div className="contact-content">
            <h2 className="contact-heading">{CONTACT.heading}</h2>
            <div className="contact-actions">
              <a className="hero-pill contact-pill" href={`mailto:${BRAND.email}`}>
                {BRAND.email}
              </a>
              <button className="hero-pill contact-pill" onClick={copy} aria-label="Copy email address">
                <span className="contact-pill-arrow" aria-hidden="true">{copied ? '✓' : '→'}</span>
                {copied ? 'Copied' : ''}
              </button>
            </div>
          </div>
        </div>
        <div className="contact-cans" aria-hidden="true">
          {JARS.map((j, i) => (
            <img
              key={i}
              className="contact-can"
              src={jarImage(FLAVORS[j.flavor].slug, 'md')}
              alt=""
              loading="lazy"
              style={{ left: j.left, top: j.top, height: j.h }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
