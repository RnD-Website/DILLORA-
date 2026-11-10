import { useEffect, useState } from 'react';
import { ScrollTrigger } from '../lib/smoothScroll.js';
import { useSeo } from '../lib/useSeo.js';
import { FLAVORS } from '../data/flavors.js';
import { jarImage } from '../data/images.js';
import Loader from '../components/Loader.jsx';
import HeroIntro from '../components/HeroIntro.jsx';
import Screen2 from '../components/Screen2.jsx';
import Advantages from '../components/Advantages.jsx';
import AboutBrand from '../components/AboutBrand.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';

let loadedOnce = false;

export default function HomePage() {
  const [ready, setReady] = useState(loadedOnce);
  useSeo({
    title: 'DILLORA — Premium Cucumber Dill Pickles in 5 Bold Flavors',
    description:
      'DILLORA — crisp cucumbers, aromatic dill and a perfectly balanced brine. Classic Dill, Garlic Dill, Spicy Dill, Bread & Butter and Lemon Dill.',
    path: '/',
  });

  useEffect(() => {
    // pins are created top-to-bottom; refresh once everything has laid out
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    if (location.hash) {
      setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 600);
    }
    return () => {
      clearTimeout(t);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <div className="homepage">
      {!loadedOnce && (
        <Loader
          assets={FLAVORS.slice(0, 3).map((f) => jarImage(f.slug))}
          onDone={() => {
            loadedOnce = true;
            setReady(true);
          }}
        />
      )}
      <HeroIntro ready={ready} />
      <Screen2 />
      <Advantages />
      <AboutBrand>
        <Contact />
      </AboutBrand>
      <Footer />
    </div>
  );
}
