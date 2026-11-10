/** Outline triangle arrow used by the flavor slider (reference style). */
export default function ArrowIcon({ dir = 'right', color = '#fff' }) {
  const d = dir === 'right' ? 'M16 10 L42 28 L16 46 Z' : 'M40 10 L14 28 L40 46 Z';
  return (
    <svg className="arrow-icon" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path d={d} stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}
