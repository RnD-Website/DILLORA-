/*
 * Downloads the LICENSED, unwatermarked stock originals into
 * /public/images/licensed/<key>.jpg.   Run:  npm run fetch:images
 *
 * The links below are signed, time-limited Freepik/Magnific download links
 * (issued 2026-11-10). If they have expired, download the same photos from your
 * Freepik/Magnific account (IDs in docs/IMAGE_CREDITS.md) and save them under
 * public/images/licensed/ with the file names below. Watermarked previews are
 * never used by the site.
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'licensed');

const LICENSED = {
  board: 'https://downloadscdn6.magnific.com/114579/2/1196.jpg?filename=fresh-organic-cucumbers-pickles-jar-white-wooden-table-with-green-red-chili-peppers-fennel-salt-black-peppercorns-garlic-pea-green-tomatoes-close-up-healthy-concept-top-view-flat-lay.jpg&token=exp=1794293273~hmac=61e9c4911c9a359536fc13f5f4f7738e',
  fridge: 'https://downloadscdn6.magnific.com/114579/66/65630.jpg?filename=fresh-vegetables-with-jar-pickle-female-hand-taking-pickle-from-jar.jpg&token=exp=1794293274~hmac=15f96fc0e0dafdd76599355674e40cc0',
  tacos: 'https://downloadscdn6.magnific.com/329181/2/1297.jpg?filename=homemade-pickled-cucumbers-with-chili.jpg&token=exp=1794293276~hmac=a589adfa630fef5e36fc3be465fc65d5',
  slices: 'https://downloadscdn6.magnific.com/176474/2/1004.jpg?filename=top-view-cucumber-sliced-plate-with-dill-with-copy-space-right-brown-stone.jpg&token=exp=1794293277~hmac=10093b87482a6dbe81233ebcc5c52216',
  ingredients: 'https://downloadscdn6.magnific.com/329181/2/1300.jpg?filename=ingredient-pickle-cucumbers-kitchen.jpg&token=exp=1794293278~hmac=67b319f5770fc38fd1d50ce8f1d21f4c',
  jarBoard: 'https://downloadscdn6.magnific.com/329181/2/1308.jpg?filename=pickles-with-garlic-glass-jar-cutting-board.jpg&token=exp=1794293280~hmac=7a1d44c8500a9d5cdd5812ca54b18e81',
  jarHand: 'https://downloadscdn6.magnific.com/114579/89/88552.jpg?filename=female-hand-holding-pickle-jar-air.jpg&token=exp=1794293281~hmac=b67185422c2bb68ee672c728cd6d96ff',
};

await mkdir(root, { recursive: true });
let failed = 0;
for (const [key, url] of Object.entries(LICENSED)) {
  const out = join(root, `${key}.jpg`);
  try {
    await access(out);
    console.log('skip (exists)', `${key}.jpg`);
    continue;
  } catch {}
  const res = await fetch(url);
  if (!res.ok) {
    failed++;
    console.error(`✗ ${key}: HTTP ${res.status} (link expired? see note at top of this file)`);
    continue;
  }
  await writeFile(out, Buffer.from(await res.arrayBuffer()));
  console.log('✓ saved', `public/images/licensed/${key}.jpg`);
}
if (failed) console.log(`\n${failed} photo(s) not downloaded — the site shows the DILLORA jar in those slots.`);
