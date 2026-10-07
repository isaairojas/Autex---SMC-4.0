// Captura de referencia del sitio real autex.com.mx (solo lectura: no inicia sesión ni compra).
// Uso: CANAL=chrome node tests/referencia/capturar-autex.mjs <carpeta-salida>
import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT = process.argv[2] ?? 'docs/autex-real';
fs.mkdirSync(OUT, { recursive: true });
const RUTAS = [
  ['catalogo', '/catalogo/'],
  ['busqueda-marca', '/busqueda-marca/'],
  ['ofertas', '/ofertas/'],
  ['busqueda-automotriz', '/busqueda/Catalogos/?Especialidades=Automotriz'],
  ['sucursales', '/sucursales/'],
  ['como-comprar', '/como-comprar/'],
  ['carrito', '/carrito/'],
];

const browser = await chromium.launch({ channel: process.env.CANAL || undefined });
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  locale: 'es-MX',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
});
const p = await ctx.newPage();
const resumen = {};
for (const [nombre, ruta] of RUTAS) {
  try {
    await p.goto('https://www.autex.com.mx' + ruta, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    console.log(nombre, 'timeout', e.message.slice(0, 80));
  }
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${OUT}/${nombre}.png`, fullPage: true });
  const texto = await p.evaluate(() => document.body.innerText.replace(/\n{2,}/g, '\n').slice(0, 3000));
  const enlaces = await p.$$eval('main a, a', (as) =>
    [...new Set(as.map((a) => a.getAttribute('href')).filter((h) => h && h.startsWith('/') && !h.startsWith('//')))].slice(0, 80),
  );
  resumen[nombre] = { url: p.url(), titulo: await p.title(), enlaces };
  fs.writeFileSync(`${OUT}/${nombre}.txt`, texto);
  console.log('✓', nombre, p.url());
}
fs.writeFileSync(`${OUT}/resumen.json`, JSON.stringify(resumen, null, 2));
await browser.close();
