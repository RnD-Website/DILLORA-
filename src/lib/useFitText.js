import { useLayoutEffect, useState } from 'react';

/**
 * Font size that makes `text` exactly `width` px wide in the display face.
 * (Reference fits its wordmark to the 1200px stage / footer row.)
 */
export function measureFit(text, width, font = '700 100px Kalnia') {
  const c = document.createElement('canvas').getContext('2d');
  c.font = font;
  const w = c.measureText(text).width || 1;
  return (100 * width) / w;
}

export function useFitText(text, getWidth, deps = []) {
  const [size, setSize] = useState(null);
  useLayoutEffect(() => {
    let alive = true;
    const run = () => alive && setSize(measureFit(text, getWidth()));
    run();
    document.fonts?.ready.then(run);
    window.addEventListener('resize', run);
    return () => {
      alive = false;
      window.removeEventListener('resize', run);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return size;
}
