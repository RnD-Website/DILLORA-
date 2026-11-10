import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSeo } from '../lib/useSeo.js';
import { BRAND } from '../data/content.js';
import Footer from '../components/Footer.jsx';

const SECTIONS = [
  {
    q: 'What we collect',
    a: [
      'If you accept analytics cookies, Google Analytics collects anonymous usage data: pages viewed, time on page, device type and approximate region. We do not collect your name, address or payment details on this website.',
      'If you email us, we receive your email address and whatever you choose to write.',
    ],
  },
  {
    q: 'Cookies',
    a: [
      'We only set analytics cookies after you click “Cool, got it”. Choosing “No thanks” keeps them off. Your choice is stored in your browser so we don’t ask again.',
    ],
  },
  { q: 'How we use it', a: ['To understand which pages work, fix problems and improve the site. No ads, and we never sell your data.'] },
  { q: 'Your choices', a: [`You can clear your browser storage at any time to reset your cookie choice, or email ${BRAND.email} to ask about any data we hold.`] },
  {
    q: 'Image credits',
    a: ['Lifestyle and ingredient photography by Freepik (freepik.com), used under the Freepik free license.'],
  },
];

export default function PrivacyPage() {
  const [open, setOpen] = useState(0);
  useSeo({ title: 'Privacy Policy — DILLORA', description: 'How DILLORA handles cookies and data.', path: '/privacy' });
  return (
    <div className="page page-policy">
      <section className="faq privacy-policy">
        <div className="hero-gradient-wrap is-static" aria-hidden="true">
          <div className="gradient-field" />
        </div>
        <nav className="flavor-nav policy-nav">
          <Link to="/" className="hero-pill">← Home</Link>
        </nav>
        <div className="section-heading-grid faq-heading-grid">
          <h1 className="faq-heading">Privacy Policy</h1>
        </div>
        <div className="site-container faq-container">
          <div className="faq-list policy-list">
            {SECTIONS.map((s, i) => (
              <div key={s.q} className={`faq-item ${open === i ? 'is-open' : ''}`}>
                <button className="faq-question" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                  <span className="faq-question-text">{s.q}</span>
                  <span className="faq-toggle" aria-hidden="true">
                    <span className="faq-toggle-line faq-toggle-line-h" />
                    <span className="faq-toggle-line faq-toggle-line-v" />
                  </span>
                </button>
                <div className="faq-answer-wrap">
                  <div className="faq-answer-inner">
                    <div className="faq-answer policy-body">
                      {s.a.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer reveal={false} />
    </div>
  );
}
