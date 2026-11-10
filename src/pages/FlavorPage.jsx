import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../lib/smoothScroll.js';
import { useSeo } from '../lib/useSeo.js';
import { FLAVORS, flavorBySlug } from '../data/flavors.js';
import { PRODUCT_DESCRIPTION, NAV } from '../data/content.js';
import { jarImage } from '../data/images.js';
import Footer from '../components/Footer.jsx';
import ArrowIcon from '../components/ArrowIcon.jsx';

const LAYOUTS = ['center', 'split', 'caption', 'finale'];
// jar pose per story block: x (vw), y (vh), rotate, scale
const POSES = [
  { x: 0, y: 0.04, r: 0, s: 1 },
  { x: 0.18, y: 0.06, r: 12, s: 1.08 },
  { x: 0.2, y: 0.02, r: -10, s: 1.15 },
  { x: 0, y: 0.08, r: 0, s: 0.92 },
];

export default function FlavorPage() {
  const { slug } = useParams();
  const flavor = flavorBySlug(slug);
  const wrapRef = useRef(null);
  const jarRef = useRef(null);
  const blocksRef = useRef([]);
  const trackRef = useRef(null);
  const [pinned, setPinned] = useState(false);

  useSeo({
    title: flavor ? `${flavor.name} — DILLORA Cucumber Pickles` : 'DILLORA',
    description: flavor ? `${flavor.description} ${PRODUCT_DESCRIPTION}` : '',
    path: `/flavors/${slug}`,
  });

  useEffect(() => {
    if (!flavor) return;
    window.scrollTo(0, 0);
    document.documentElement.style.setProperty('--flavor-color', flavor.color);
    const ctx = gsap.context(() => {
      const blocks = blocksRef.current;
      gsap.set(blocks, { autoAlpha: 0 });
      gsap.set(blocks[0], { autoAlpha: 1 });
      gsap.from(jarRef.current, { yPercent: 60, rotate: 20, opacity: 0, duration: 1.15, ease: 'power3.out' });
      gsap.from('.flavor-hero-row > *', { y: 30, opacity: 0, duration: 0.65, stagger: 0.12, ease: 'power3.out', delay: 0.3 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * POSES.length}`,
          pin: true,
          scrub: 0.6,
          onToggle: (self) => setPinned(true),
        },
      });
      const vw = () => window.innerWidth;
      const vh = () => window.innerHeight;
      POSES.forEach((p, i) => {
        if (i === 0) return;
        tl.to(
          jarRef.current,
          { x: () => p.x * vw(), y: () => p.y * vh(), rotate: p.r, scale: p.s, duration: 1, ease: 'power2.inOut' },
          i - 1
        );
        tl.to(blocks[i - 1], { autoAlpha: 0, y: -30, duration: 0.4 }, i - 1);
        tl.fromTo(blocks[i], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5 }, i - 0.6);
        if (i === 1) tl.to('.flavor-hero-row', { autoAlpha: 0, duration: 0.3 }, 0);
      });
      tl.to({}, { duration: 0.5 });
    }, wrapRef);
    setPinned(true);
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [flavor]);

  if (!flavor) return <Navigate to="/404" replace />;

  const others = FLAVORS.filter((f) => f.slug !== flavor.slug);
  const scrollGallery = (dir) => {
    const el = trackRef.current;
    el.scrollBy({ left: dir * (el.clientWidth / 3 + 20), behavior: 'smooth' });
  };

  return (
    <div className={`page flavor-detail-page ${pinned ? 'is-story-pinned' : ''}`}>
      <section ref={wrapRef} className="flavor-story-wrap">
        <div className="flavor-story-sticky" style={{ '--flavor-color': flavor.color }}>
          <div className="background-layer" style={{ backgroundColor: flavor.color, opacity: 1 }}>
            <div className="background-texture" />
          </div>
          <nav className="flavor-nav" aria-label="Primary">
            <div className="hero-nav-left">
              <Link to="/" className="hero-pill">← Home</Link>
              {NAV.map((n) => (
                <Link key={n.href} to={`/${n.href}`} className="hero-pill flavor-nav-extra">
                  {n.label}
                </Link>
              ))}
            </div>
            <Link to="/#contact" className="hero-pill">Contacts</Link>
          </nav>
          <div className="flavor-hero-wordmark-layer" aria-hidden="true">
            <span className="flavor-hero-wordmark">{flavor.short}</span>
          </div>
          <div className="flavor-story-canvas-layer">
            <img
              ref={jarRef}
              className="flavor-story-jar"
              src={jarImage(flavor.slug)}
              alt={`${flavor.name} — DILLORA cucumber pickles in a glass jar`}
              width="720"
              height="1074"
              fetchpriority="high"
            />
          </div>
          <div className="flavor-hero-copy-layer">
            <div className="flavor-hero-row">
              <h1 className="flavor-hero-name">{flavor.name}</h1>
              <p className="flavor-hero-badges">{flavor.badges}</p>
            </div>
            {flavor.story.map((b, i) => (
              <div
                key={i}
                ref={(el) => (blocksRef.current[i] = el)}
                className={`flavor-rotation-block is-layout-${LAYOUTS[i]}`}
              >
                <p className="flavor-rotation-kicker">{b.kicker}</p>
                {b.line && <p className="flavor-rotation-line">{b.line}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flavor-gallery">
        <div className="site-container">
          <h2 className="flavor-gallery-heading">Try the rest of the lineup</h2>
          <div className="flavor-gallery-viewport">
            <button className="arrow-gallery arrow-gallery-prev" onClick={() => scrollGallery(-1)} aria-label="Previous">
              <ArrowIcon dir="left" color="#20251C" />
            </button>
            <div ref={trackRef} className="flavor-gallery-track">
              {others.map((f) => (
                <Link key={f.slug} to={`/flavors/${f.slug}`} className="flavor-gallery-card" style={{ '--card-color': f.color }}>
                  <div className="background-texture" />
                  <h3 className="flavor-gallery-card-title">{f.name}</h3>
                  <div className="flavor-gallery-glow" />
                  <img className="flavor-gallery-can" src={jarImage(f.slug, 'md')} alt="" loading="lazy" width="429" height="640" />
                </Link>
              ))}
            </div>
            <button className="arrow-gallery arrow-gallery-next" onClick={() => scrollGallery(1)} aria-label="Next">
              <ArrowIcon dir="right" color="#20251C" />
            </button>
          </div>
        </div>
      </section>
      <Footer reveal={false} />
    </div>
  );
}
