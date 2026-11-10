import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { asset } from './data/images.js';

// open-source font matches (see docs/TYPOGRAPHY.md for licensed originals)
import '@fontsource/kalnia/700.css';
import '@fontsource-variable/unbounded/wght.css';
import './styles/fonts.css';
import './styles/base.css';
import './styles/hero.css';
import './styles/screen2.css';
import './styles/advantages.css';
import './styles/sections.css';
import './styles/pages.css';

import { initSmoothScroll } from './lib/smoothScroll.js';
import App from './App.jsx';

document.documentElement.style.setProperty('--asset-bg-texture', `url(${asset('images/textures/waves.svg')})`);
// embedded previews (sub-path hosting) route in memory; the real site uses clean URLs
const Router = import.meta.env.MODE === 'artifact' ? MemoryRouter : BrowserRouter;

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
initSmoothScroll();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
