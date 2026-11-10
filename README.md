# DILLORA — premium cucumber pickle website

A section-by-section recreation of the yaas-energy.com experience, rebranded as **DILLORA**. It uses your real jar photo as the hero product and real photography throughout.

**Stack:** React 18 · React Router 6 · GSAP 3 + ScrollTrigger · Lenis 1.3.26 · Vite · PWA (vite-plugin-pwa) · Nginx

## Run it
```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # production build in /dist
npm run preview
```
All photos are DILLORA brand shots stored in `public/images/scenes/` — nothing to download.

## Where to change things
| What | File |
|---|---|
| All copy (hero, sections, FAQ, contact, address) | `src/data/content.js` |
| The 5 flavors (name, colour, description, story) | `src/data/flavors.js` |
| Photo list and sources | `src/data/images.js` |
| Product jar images (one per flavor) | `public/images/jars/<slug>.webp` (+ `-md`, `-thumb`) |
| Colours, fonts, spacing tokens | `src/styles/base.css` |
| Hero/slider/detail jar positions | `src/lib/jarChoreography.js` |

### Swapping in real per-flavor jar photos
The 5 jars are currently your one product photo with a different brine tone per flavor (the lid is untouched). To use real photos, replace `public/images/jars/<slug>.webp` with a transparent PNG/WebP cutout (720×1074 works best), plus `-md` (640px tall) and `-thumb` (240px tall).

## Analytics (GA4 / GTM)
Nothing loads until you add real IDs. No IDs have been invented. Create `.env.production`:
```
VITE_GA4_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX
```
The cookie banner only appears once an ID is set. Analytics only loads after the visitor accepts.

## Deploy (Ubuntu + Nginx 1.24)
```bash
npm ci && npm run build
sudo rsync -a --delete dist/ /var/www/dillora/
sudo cp deploy/nginx.conf /etc/nginx/sites-available/dillora
sudo ln -sf /etc/nginx/sites-available/dillora /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## Docs
- `docs/REFERENCE_ANALYSIS.md`: what was measured on the reference and how it maps
- `docs/TYPOGRAPHY.md`: fonts and how to use the licensed originals
- `docs/IMAGE_CREDITS.md`: photo sources and license
