// Captura de interacciones del sitio real (solo lectura): Mis vehículos, Ingresar, menú y especialidades.
// Uso: CANAL=chrome node tests/referencia/interacciones-autex.mjs <carpeta-salida>
import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT = process.argv[2] ?? 'docs/autex-real';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: process.env.CANAL || undefined });
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  locale: 'es-MX',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
});
const p = await ctx.newPage();

async function inicio() {
  await p.goto('https://www.autex.com.mx/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(2000);
}

const PASOS = [
  ['mis-vehiculos', () => p.getByText('Mis vehiculos', { exact: false }).first().click()],
  ['ingresar', () => p.getByText('Ingresar', { exact: true }).first().click()],
  ['menu', () => p.locator('header button, header [class*=menu], header svg').first().click()],
  ['especialidades', () => p.getByText('Todas las especialidades').first().click()],
  ['carrito-icono', () => p.getByText('Carrito', { exact: true }).first().click()],
];

for (const [nombre, accion] of PASOS) {
  await inicio();
  try {
    await accion();
    await p.waitForTimeout(2000);
  } catch (e) {
    console.log('✗', nombre, e.message.slice(0, 100));
  }
  await p.screenshot({ path: `${OUT}/int-${nombre}.png` });
  const texto = await p.evaluate(() => {
    const d = document.querySelector('[role=dialog], .modal.show, .modal[style*="block"], [class*=drawer], [class*=offcanvas].show');
    return (d ? d.innerText : document.body.innerText.slice(0, 1500)).replace(/\n{2,}/g, '\n');
  });
  fs.writeFileSync(`${OUT}/int-${nombre}.txt`, texto);
  console.log('✓', nombre, p.url());
}
await browser.close();
