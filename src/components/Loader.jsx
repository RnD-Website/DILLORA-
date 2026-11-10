import { useEffect, useState } from 'react';
import { BRAND } from '../data/content.js';

/* Preloads fonts + the first jar photos, fills the wordmark, then hands off. */
export default function Loader({ assets = [], onDone }) {
  const [p, setP] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const total = assets.length + 1;
    const bump = () => setP(++loaded / total);
    const imgs = assets.map(
      (src) =>
        new Promise((res) => {
          const im = new Image();
          im.onload = im.onerror = () => {
            bump();
            res();
          };
          im.src = src;
        })
    );
    const fonts = (document.fonts?.ready || Promise.resolve()).then(bump);
    const minTime = new Promise((r) => setTimeout(r, 900));
    const cap = new Promise((r) => setTimeout(r, 6000));
    Promise.race([Promise.all([...imgs, fonts, minTime]), cap]).then(() => {
      setP(1);
      setTimeout(() => {
        setDone(true);
        onDone?.();
      }, 350);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`page-loader ${done ? 'is-done' : ''}`} aria-hidden={done} role="status">
      <div className="page-loader-mark" style={{ '--p': p }}>
        {BRAND.wordmark}
        <span>{BRAND.wordmark}</span>
      </div>
      <div className="page-loader-count">{Math.round(p * 100)}%</div>
    </div>
  );
}
