import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSeo } from '../lib/useSeo.js';
import { jarImage } from '../data/images.js';

export default function NotFoundPage() {
  const [visible, setVisible] = useState(false);
  useSeo({ title: 'Page not found — DILLORA', description: 'This page rolled under the fridge.', path: '/404' });
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="page not-found-page">
      <section className="not-found">
        <div className="hero-gradient-wrap" aria-hidden="true">
          <div className="gradient-field" />
        </div>
        <div className={`not-found-content ${visible ? 'is-visible' : ''}`}>
          <h1 className="not-found-title">
            <span className="not-found-four">4</span>
            <img className="not-found-jar" src={jarImage('classic-dill', 'md')} alt="" width="429" height="640" />
            <span className="not-found-four">4</span>
          </h1>
          <p className="hero-subhead not-found-description">This page rolled under the fridge. Let’s get you back to the crunch.</p>
          <Link to="/" className="hero-cta not-found-cta">Back home <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
