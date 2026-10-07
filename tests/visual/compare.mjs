// Verificación visual (FIGMA_REPLICA.md §9): renderiza una ruta a 1920 px y la compara con el PNG de Figma.
// Uso: node tests/visual/compare.mjs <ruta> <nodeId> [selectorOverlayEspera]
import { chromium } from 'playwright';
import fs from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const [, , route, nodeId] = process.argv;
const ref = `docs/figma/cache/${nodeId.replace(':', '-')}.png`;
const out = `tests/visual/__diff__/${nodeId.replace(':', '-')}`;
const expected = PNG.sync.read(fs.readFileSync(ref));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: expected.width, height: expected.height }, deviceScaleFactor: 1 });
await page.goto(`http://localhost:5179/${route.replace(/^\//, '')}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const buf = await page.screenshot({ clip: { x: 0, y: 0, width: expected.width, height: expected.height } });
await browser.close();

const actual = PNG.sync.read(buf);
const diff = new PNG({ width: expected.width, height: expected.height });
const n = pixelmatch(expected.data, actual.data, diff.data, expected.width, expected.height, { threshold: 0.1 });
fs.writeFileSync(`${out}.actual.png`, buf);
fs.writeFileSync(`${out}.diff.png`, PNG.sync.write(diff));
const pct = ((n / (expected.width * expected.height)) * 100).toFixed(2);
console.log(`${nodeId} ${route}: ${pct}% píxeles distintos`);
