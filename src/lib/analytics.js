/*
 * GA4 + Google Tag Manager, consent-gated.
 * IDs come ONLY from env vars — nothing is invented:
 *   VITE_GA4_ID=G-XXXXXXX   VITE_GTM_ID=GTM-XXXXXXX   (.env.production)
 * If either is missing, that integration simply doesn't load.
 */
const GA4_ID = import.meta.env.VITE_GA4_ID;
const GTM_ID = import.meta.env.VITE_GTM_ID;
const CONSENT_KEY = 'dillora-consent';

function readConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function getConsent() {
  return readConsent();
}

export function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage blocked — consent applies to this page view only */
  }
  if (value === 'granted') loadAnalytics();
}

let loaded = false;
export function loadAnalytics() {
  if (loaded || typeof window === 'undefined') return;
  if (!GA4_ID && !GTM_ID) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  if (GTM_ID) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
    document.head.appendChild(s);
  }
  if (GA4_ID) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
    document.head.appendChild(s);
    window.gtag('config', GA4_ID, { anonymize_ip: true });
  }
}

export function trackPageView(path) {
  if (loaded && GA4_ID && window.gtag) window.gtag('event', 'page_view', { page_path: path });
}

export const analyticsConfigured = Boolean(GA4_ID || GTM_ID);
