// Capturas del catálogo del sitio (5 especialidades, baterías, alternadores, cinta aislante), detalle de batería y
// panel de tiendas con la regla de las 2:00 p.m. Uso: node tests/referencia/catalogo-demo.mjs <carpeta-salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-catalogo';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errores = [];
const p = await browser.newPage({ viewport: { width: 1920, height: 1100 } });
p.on('pageerror', (e) => errores.push(e.message));
await p.goto('http://localhost:5179/busqueda');
await p.getByRole('button', { name: 'No permitir nunca' }).click();
await p.getByRole('status', { name: 'Cargando productos…' }).waitFor({ state: 'detached' });
await p.evaluate(() => document.fonts.ready);
console.log('tarjetas:', await p.getByRole('button', { name: /Agregar a lista/ }).count());
await p.screenshot({ path: `${OUT}/1-catalogo.png`, fullPage: true });
await p.goto('http://localhost:5179/producto/bateria-duralast-platinum');
await p.getByRole('button', { name: 'No permitir nunca' }).click();
await p.screenshot({ path: `${OUT}/2-detalle-bateria.png`, fullPage: true });
await p.getByRole('button', { name: 'Buscar en otra tienda' }).click();
await p.getByRole('dialog', { name: 'Selecciona una tienda' }).waitFor();
await p.screenshot({ path: `${OUT}/3-tiendas.png` });
await browser.close();
if (errores.length) console.log('ERRORES', errores);
console.log('ok', OUT);
