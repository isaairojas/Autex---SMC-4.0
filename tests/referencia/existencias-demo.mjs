// Capturas de existencias en la demo: resultados sin productos no disponibles, filtro para verlos, etiqueta "+100",
// "Disponibilidad" en el detalle y panel de tiendas sin costo logístico.
// Uso: node tests/referencia/existencias-demo.mjs <carpeta-salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-existencias';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errores = [];
const p = await browser.newPage({ viewport: { width: 1920, height: 1300 } });
p.on('pageerror', (e) => errores.push(e.message));
await p.goto('http://localhost:5179/busqueda');
await p.getByRole('button', { name: 'No permitir nunca' }).click();
await p.evaluate(() => document.fonts.ready);
console.log('tarjetas sin no disponibles:', await p.getByRole('button', { name: /Agregar a lista/ }).count());
await p.screenshot({ path: `${OUT}/1-busqueda.png`, fullPage: true });
await p.getByText(/Mostrar productos no disponibles/).click();
console.log('tarjetas con no disponibles:', await p.getByRole('button', { name: /Agregar a lista/ }).count());
await p.screenshot({ path: `${OUT}/2-busqueda-todos.png`, fullPage: true });
await p.getByRole('button', { name: 'Alternador 12V 120A Tecnofuel' }).first().click();
await p.waitForURL('**/producto/**');
await p.getByLabel('Disponibilidad').scrollIntoViewIfNeeded();
await p.screenshot({ path: `${OUT}/3-detalle.png`, fullPage: true });
await p.getByRole('button', { name: 'Buscar en otra tienda' }).click();
await p.getByRole('dialog', { name: 'Selecciona una tienda' }).waitFor();
await p.screenshot({ path: `${OUT}/4-tiendas.png` });
await browser.close();
if (errores.length) console.log('ERRORES', errores);
console.log('ok', OUT);
