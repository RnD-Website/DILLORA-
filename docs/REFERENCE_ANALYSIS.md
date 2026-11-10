# YAAS Energy → DILLORA: reference analysis

I inspected the reference live at 1440×900 and 838px in a real browser: DOM structure, computed styles, the production CSS bundle and the JS bundles (motion values). This file records what was measured and how each piece maps to DILLORA.

## 1. Stack detected
- React SPA, code-split pages (`HomePage`, `Footer`, `Scene`, `useSeo`, `heroLayout`), React Router
- GSAP + ScrollTrigger (pins, `scrub`, `power3.out` / `power2.inOut` / `sine.inOut`)
- Lenis (`html.lenis`, `lenis-smooth`, `lenis-stopped`)
- Three.js (`Scene-*.js`, `can.glb` preloaded, render-on-demand), with poster images (`hero-poster-can img`) as fallback
- PWA manifest, Open Graph/Twitter, JSON-LD (Organization, WebSite, Breadcrumb, FAQPage), consent-gated GA4

**DILLORA change, at your request:** no 3D and no illustrated renders. The product is your real jar photo (a transparent cutout), animated with GSAP in the same choreography. Three.js was removed from the stack.

## 2. Section order (homepage, 1440×900, ~23 viewport heights in total)
| # | Reference | Height | DILLORA |
|---|---|---|---|
| 1 | `intro-wrap` hero → flavor slider → flavor detail, one sticky pin | 300vh | same, 400vh (gives the slider a scroll "hold") |
| 2 | `screen2`: white panel rises over the intro with an arched top; arc photo gallery; card zooms to full-bleed; stacked scenario cards | ~860vh | same: 6 "pickle moments" with real photos |
| 3 | `advantages`: gradient backdrop, 5 white cards dealt along an arc (pinned) | ~440vh | same: 5 reasons |
| 4 | `faq` on the same backdrop, 2-column accordion | auto | same: 8 questions |
| 5 | `about-brand`: 2-line heading (small + large accent), photo deck flies in, copy on either side, draggable deck | ~490vh | same: 4 real photos |
| 6 | `contact`: rounded gradient panel, cans floating with scroll | ~100vh | same, with real jar photos |
| 7 | Reveal footer: giant wordmark, nav pills, address, bottom row | 100vh | same |

## 3. Typography
| Role | Reference | DILLORA |
|---|---|---|
| Display | **Soledago** 400 (custom/licensed) | `Soledago` first in the stack, then **Kalnia 700** (OFL, bundled). Soledago's license is unclear, so it is not shipped |
| UI / body | **Bounded Medium 500** | `Bounded` first, then **Unbounded 500** (OFL, bundled) |
| Block heading | `clamp(30px, 4.17vw, 80px)`, lh 1.1, ls −0.025em | identical |
| Body | 16px (14px under 1200px), lh 1.4–1.55 | identical |
| Hero wordmark | 539px in a 1200px artboard | fitted to 1200px by measuring the text |
| Slider heading | `clamp(32px, 6.2vw, 80px)`, nowrap | identical |
| Detail title | `clamp(38px, 5.6vw, 64px)`, uppercase | identical |
| Pills | 16px / 500, padding 8×20, radius 100px, 1px white border | identical |

See `docs/TYPOGRAPHY.md` for switching to the licensed originals.

## 4. Layout system
- Hero artboard is 1200×650, scaled by `--hero-scale` to fit the viewport (≈1.043 at 1440×900, 94px side margin). The margin feeds `--content-inline` from 1200px up.
- Gutter: 30px at 1200px and up, 10px below. Block gap: 120px (80px below 1200px). Heading gap: 50px.
- Breakpoints: 640 / 960 / 1200 (same as the reference).
- Card radius 20px, pill radius 100px, about-deck cards 10px.
- 12-column heading grid, 20px column gap.

## 5. Colour logic (kept; only the palette changes)
| Reference | DILLORA |
|---|---|
| Multi-colour blurred hero gradient | cream → cucumber → olive → mustard gradient (animated drift) |
| Per-flavor solid background in slider/detail (pink for strawberry…) | per-flavor: Olive `#657344`, Deep green `#34452A`, Chili `#B4532A`, Mustard `#D6B44C`, Cucumber `#A8B76A` |
| White panels for screen 2 and About | white |
| Pink accent text on white `#E53A6B` | Olive `#657344` |
| Pink/peach advantages gradient | cucumber/mustard gradient |
| `#212121` dark ink | `#20251C` |

## 6. Motion (measured, then reproduced)
- Entrance: wordmark letters drop in (yPercent −70 → 0, blur 14px → 0, 0.75s `power3.out`, 0.06s stagger). Products rise and spin into place (1.15s `power3.out`, staggered). Copy fades in (0.65s `cubic-bezier(.22,1,.36,1)`, 0.12s/0.24s delays).
- Hero → slider (`--h2g`): hero stage opacity `1 − 2h`, blur `14px × h`; background colour opacity `h`; UI fades in from h = 0.7. Background colour change takes 0.9s.
- Slider: arrows at ±10.5vw (±37vw on mobile, ±14vw at 960–1199px); flavor-name keyframe 0.48s. Changing jars takes 0.6s `power3.out`.
- Detail: copy slides 14px up in 0.55s; switcher thumbs at ±6° rotate to 0 and lift 4px on hover.
- Screen 2 rises with its top corners rounding from 50%/42vh to 0. Arc gallery → FLIP zoom → stacked cards (each new card slides up, the previous one scales to 0.92 and dims).
- Advantages: cards travel along an arc (radius ≈ 1.4 × viewport width), rotating with their angle, fading at the edges.
- About: heading lines rise, then shrink and fade; deck cards fly up with rotations −7/5/−3/2°; copy fades in. After the pin the deck can be swiped.
- Contact: jars drift ±80–130px with scroll. Footer: content parallax while being revealed.
- All scrubbed timelines use `scrub: 0.6`. Lenis runs on the GSAP ticker (`lagSmoothing(0)`), so Lenis and ScrollTrigger share one clock.

## 7. Responsive behaviour reproduced
- Under 960px: mobile banner wordmark at the top, nav pills spread evenly, hero copy at the bottom, mobile jar poses, slider spacing for the ±37vw arrows, detail layout stacked and centred, FAQ in one column, About deck in normal flow, contact jars kept inside the panel.
- Under 1200px: the overlapping rise/reveal panels flatten into normal flow (as in the reference).
