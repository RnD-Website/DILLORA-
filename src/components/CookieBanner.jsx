import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { COOKIE } from '../data/content.js';
import { getConsent, setConsent, loadAnalytics, analyticsConfigured } from '../lib/analytics.js';

export default function CookieBanner() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const c = getConsent();
    if (c === 'granted') loadAnalytics();
    if (!c && analyticsConfigured) {
      const t = setTimeout(() => setShown(true), 2500);
      return () => clearTimeout(t);
    }
  }, []);

  if (!analyticsConfigured) return null;

  const choose = (v) => {
    setConsent(v);
    setShown(false);
  };

  return (
    <div className={`cookie-banner ${shown ? 'is-shown' : ''}`} role="dialog" aria-live="polite" aria-label="Cookie consent" hidden={!shown && getConsent() !== null}>
      <p className="cookie-banner-title">{COOKIE.title}</p>
      <p className="cookie-banner-text">
        {COOKIE.text}{' '}
        <Link to="/privacy" className="cookie-banner-link">Privacy Policy</Link>
      </p>
      <div className="cookie-banner-actions">
        <button className="cookie-banner-btn cookie-banner-btn-accept" onClick={() => choose('granted')}>
          {COOKIE.accept}
        </button>
        <button className="cookie-banner-btn cookie-banner-btn-decline" onClick={() => choose('denied')}>
          {COOKIE.decline}
        </button>
      </div>
    </div>
  );
}
