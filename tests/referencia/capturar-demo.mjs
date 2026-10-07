// Captura las páginas de la demo (puerto 5179). Uso: node tests/referencia/capturar-demo.mjs <salida> home catalogo marcas … (rutas sin / inicial; 'home' = /)
import { chromium } from 'playwright';
const [OUT, ...RUTAS] = process.argv.slice(2);
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errores = [];
p.on('pageerror', (e) => errores.push(e.message));
for (const r0 of RUTAS) {
  const r = r0 === 'home' ? '' : r0;
  await p.goto('http://localhost:5179/' + r, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  const nombre = r.replace(/[^a-z0-9]+/gi, '_') || 'home';
  await p.screenshot({ path: `${OUT}/demo${nombre}.png`, fullPage: true });
  console.log('✓', r);
}
console.log(errores.length ? 'ERRORES: ' + errores.join(' | ') : 'sin errores');
await browser.close();
