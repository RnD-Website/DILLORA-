import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap, scrollToTarget } from '../lib/smoothScroll.js';
import { useFitText } from '../lib/useFitText.js';
import { BRAND, FOOTER_NAV } from '../data/content.js';

/* Reveal footer: sits under the white panel, wordmark fitted to the row. */
export default function Footer({ reveal = true }) {
  const ref = useRef(null);
  const spacerRef = useRef(null);
  const rowRef = useRef(null);
  const loc = useLocation();
  const size = useFitText(BRAND.wordmark, () => rowRef.current?.offsetWidth || window.innerWidth - 60);

  useEffect(() => {
    if (!reveal) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1200px)', () => {
      // fixed footer under the page; the spacer scrolls the white panel away
      gsap.fromTo(
        ref.current.querySelector('.site-footer-inner'),
        { yPercent: 30 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: spacerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      );
    });
    return () => mm.revert();
  }, [reveal]);

  const onNav = (e, href) => {
    const hash = href.replace('/', '');
    if (loc.pathname === '/' && hash.startsWith('#')) {
      e.preventDefault();
      scrollToTarget(hash);
    }
  };

  return (
    <>
    {reveal && <div ref={spacerRef} className="footer-spacer" aria-hidden="true" />}
    <footer ref={ref} className={`site-footer ${reveal ? 'is-reveal' : ''}`}>
      <div className="hero-gradient-wrap is-static" aria-hidden="true">
        <div className="gradient-field" />
      </div>
      <div className="site-footer-inner">
        <div ref={rowRef} className="site-footer-logo-row">
          <Link to="/" className="site-footer-logo-link" aria-label="DILLORA home">
            <span className="logo-text site-footer-logo-giant" style={size ? { fontSize: `${size}px` } : undefined}>
              {BRAND.wordmark}
            </span>
          </Link>
        </div>
        <div className="site-footer-nav-row">
          <nav className="site-footer-nav" aria-label="Footer">
            {FOOTER_NAV.map((n) => (
              <a key={n.href} href={n.href} className="hero-pill site-footer-pill" onClick={(e) => onNav(e, n.href)}>
                {n.label}
              </a>
            ))}
          </nav>
          <p className="site-footer-address site-footer-address-desktop">{BRAND.address}</p>
        </div>
        <div className="site-footer-bottom">
          <p className="site-footer-address site-footer-address-mobile">{BRAND.address}</p>
          <span>© {new Date().getFullYear()} DILLORA. All rights reserved.</span>
          <Link to="/privacy" className="site-footer-credit">Privacy Policy</Link>
          <a className="site-footer-credit" href="https://www.freepik.com" target="_blank" rel="noopener noreferrer">
            Lifestyle photos: Freepik
          </a>
        </div>
      </div>
    </footer>
    </>
  );
}
