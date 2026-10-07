// Comprueba la página adaptativa al zoom: sin scroll horizontal y paneles bajo su chip en varios anchos de ventana
// (1280 ≈ zoom 150 %, 1536 ≈ 125 %, 1920 = 100 %, 2560 ≈ 75 %). Uso: node tests/referencia/zoom-demo.mjs <carpeta>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-zoom';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
let fallas = 0;
for (const ancho of [1280, 1536, 1920, 2560]) {
  const p = await browser.newPage({ viewport: { width: ancho, height: 900 } });
  await p.goto('http://localhost:5179/busqueda');
  await p.getByRole('button', { name: 'No permitir nunca' }).click();
  await p.getByRole('status', { name: 'Cargando productos…' }).waitFor({ state: 'detached' });
  const desborde = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await p.getByRole('button', { name: 'Entrega en' }).click();
  const chip = await p.getByRole('button', { name: 'Entrega en' }).boundingBox();
  const panel = await p.getByRole('dialog', { name: 'Ubicación de entrega' }).boundingBox();
  const bajoChip = panel.y > chip.y + chip.height - 2 && panel.y - (chip.y + chip.height) < 20 && Math.abs(panel.x + panel.width - (chip.x + chip.width)) < panel.width;
  await p.screenshot({ path: `${OUT}/${ancho}.png` });
  console.log(ancho, '| scroll horizontal:', desborde, 'px | panel bajo el chip:', bajoChip);
  if (desborde > 0 || !bajoChip) fallas++;
  await p.close();
}
await browser.close();
console.log(fallas ? `FALLAS: ${fallas}` : 'ok');
