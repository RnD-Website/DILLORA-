import { useState } from 'react';
import { jarImage } from '../data/images.js';

/**
 * Real-photo <img>: serves the local copy from /public/images
 * (`npm run fetch:images`), falls back to the licensed CDN original, and as a
 * last resort shows the real DILLORA jar photo on a brand background.
 */
export default function Photo({ image, alt, className = '', width = 1800, eager = false, sizes, ...rest }) {
  const [src, setSrc] = useState(image.local);
  const [stage, setStage] = useState(0);
  return (
    <img
      className={`${className}${stage === 2 ? ' is-photo-fallback' : ''}`}
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      srcSet={image.small && stage === 0 ? `${image.small} 800w, ${image.local} 1536w` : undefined}
      sizes={sizes || (image.small ? '(max-width: 800px) 100vw, 1536px' : undefined)}
      onError={() => {
        if (stage === 0 && image.remote) {
          setStage(1);
          setSrc(`${image.remote}?w=${width}`);
        } else if (stage < 2) {
          setStage(2);
          setSrc(jarImage('classic-dill', 'md'));
        }
      }}
      draggable="false"
      {...rest}
    />
  );
}
