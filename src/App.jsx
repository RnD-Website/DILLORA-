import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ScrollTrigger, getLenis } from './lib/smoothScroll.js';
import { trackPageView } from './lib/analytics.js';
import HomePage from './pages/HomePage.jsx';
import CookieBanner from './components/CookieBanner.jsx';

const FlavorPage = lazy(() => import('./pages/FlavorPage.jsx'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    // fresh scroll + fresh triggers on every route change
    getLenis()?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    trackPageView(pathname);
    return () => clearTimeout(t);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <Suspense fallback={<div className="page" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flavors/:slug" element={<FlavorPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <CookieBanner />
    </>
  );
}
