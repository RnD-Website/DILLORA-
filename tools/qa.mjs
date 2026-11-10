// Visual QA: node tools/qa.mjs <width> <height> <outdir> [positions as vh multiples...]
import { chromium } from 'playwright';
import { preview } from 'vite';
const [w, h, out, ...pos] = process.argv.slice(2);
const server = await preview({ preview: { port: 4199 }, logLevel: 'error' });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && !m.text().includes('ERR_TUNNEL') && !m.text().includes('Failed to load resource') && errs.push(m.text()));
await p.goto('http://localhost:4199/');
await p.waitForTimeout(4500);
for (const v of pos) {
  const y = Math.round(parseFloat(v) * +h);
  await p.evaluate((y) => (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y)), y);
  await p.waitForTimeout(1400);
  await p.screenshot({ path: `${out}/s-${w}-${v}.png` });
}
console.log('docH', await p.evaluate(() => document.documentElement.scrollHeight / innerHeight));
console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no errors');
await b.close();
server.httpServer.close();
