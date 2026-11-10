import { forwardRef } from 'react';

/** Splits text into letter (or word) pieces for GSAP drop-in reveals. */
const DropText = forwardRef(function DropText({ text, by = 'char', as: Tag = 'span', className = '', ...rest }, ref) {
  const parts = by === 'word' ? text.split(/(\s+)/) : Array.from(text);
  return (
    <Tag ref={ref} className={className} aria-label={text} {...rest}>
      {parts.map((p, i) =>
        /^\s+$/.test(p) ? (
          <span key={i} aria-hidden="true">{p === ' ' ? ' ' : p}</span>
        ) : (
          <span key={i} className="drop-text-piece" aria-hidden="true">
            {p}
          </span>
        )
      )}
    </Tag>
  );
});

export default DropText;
