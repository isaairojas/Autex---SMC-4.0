// Compara las capturas de Figma de CACHE (por defecto docs/figma-2026/cache/<nodo>.png) contra /figma/<nodo>.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const only = process.argv.slice(2);
const CACHE = process.env.CACHE ?? 'docs/figma-2026/cache';
const files = fs.readdirSync(CACHE).filter((f) => /^\d+-\d+\.png$/.test(f)).filter((f) => !only.length || only.includes(f.replace('.png', '')));
const browser = await chromium.launch();
const results = [];
for (const f of files) {
  const nodo = f.replace('.png', '');
  const expected = PNG.sync.read(fs.readFileSync(`${CACHE}/${f}`));
  const page = await browser.newPage({ viewport: { width: 1920, height: expected.height }, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:5179/figma/${nodo}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: expected.width, height: expected.height }, fullPage: true });
  await page.close();
  const actual = PNG.sync.read(buf);
  const diff = new PNG({ width: expected.width, height: expected.height });
  const n = pixelmatch(expected.data, actual.data, diff.data, expected.width, expected.height, { threshold: 0.1 });
  fs.writeFileSync(`tests/visual/__diff__/${nodo}.actual.png`, buf);
  fs.writeFileSync(`tests/visual/__diff__/${nodo}.diff.png`, PNG.sync.write(diff));
  const pct = (n / (expected.width * expected.height)) * 100;
  results.push({ nodo, pct: +pct.toFixed(2) });
  console.log(`${nodo}: ${pct.toFixed(2)}%`);
}
await browser.close();
fs.writeFileSync('tests/visual/resultados.json', JSON.stringify(results, null, 2));
