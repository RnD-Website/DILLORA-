# Typography

| Role | Reference font | Shipped (open-source) | CSS variable |
|---|---|---|---|
| Display / headings / wordmark | Soledago | Kalnia 700 (`@fontsource/kalnia`, SIL OFL) | `--font-display` |
| UI / body / pills | Bounded Medium | Unbounded 500 (`@fontsource-variable/unbounded`, SIL OFL) | `--font-ui` |

Soledago is a custom font served by the reference site and its license is unclear, so it is not included here. Kalnia was chosen after rendering candidates side by side: it has the same high-contrast, flared, retro-display feel. Unbounded is the closest open match to Bounded's wide geometric shapes.

## Using the originals
1. Buy or obtain a web license for Soledago and Bounded Medium.
2. Put `Soledago.woff2` and `Bounded-Medium.woff2` in `public/fonts/`.
3. Uncomment the two `@font-face` rules in `src/styles/fonts.css`.

The variables already list the originals first, so nothing else needs to change. If the new fonts have different widths, the wordmarks re-fit automatically: they are measured in `src/lib/useFitText.js`.
