// Cantidad escrita a mano en la tarjeta del catálogo y en el detalle: si supera la existencia en línea se muestra la
// carga "Validando existencias" y la cantidad vuelve a la disponible. Uso: node tests/referencia/validar-existencias-demo.mjs <salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-validar-existencias';
fs.mkdirSync(OUT, { recursive: true });
const B = 'http://localhost:5179';
const browser = await chromium.launch();
const errores = [];
const ok = (t) => console.log('✓', t);
const p = await browser.newPage({ viewport: { width: 1920, height: 1100 } });
p.on('pageerror', (e) => errores.push(e.message));
await p.goto(B + '/busqueda');
await p.getByRole('button', { name: 'No permitir nunca' }).click();
await p.getByRole('status', { name: 'Cargando productos…' }).waitFor({ state: 'detached' });
const carga = p.getByRole('status', { name: 'Validando existencias' });

// Catálogo
const nombre = 'Alternador 12V 150A alto rendimiento Tecnofuel';
let cant = p.getByLabel(`Cantidad de ${nombre}`);
await cant.fill('9999');
await cant.press('Enter');
await carga.waitFor();
await p.screenshot({ path: `${OUT}/1-catalogo-validando.png` });
await carga.waitFor({ state: 'detached' });
const enCatalogo = await cant.inputValue();
if (Number(enCatalogo) >= 9999) throw new Error('El catálogo debía ajustar la cantidad');
ok(`Catálogo: 9999 → ${enCatalogo} tras "Validando existencias"`);
await cant.fill('1');
await cant.press('Enter');
if (await carga.isVisible()) throw new Error('Dentro de la existencia no debe validar');
ok('Catálogo: 1 pieza sin carga');

// Detalle
await p.getByRole('button', { name: nombre }).first().click();
cant = p.getByLabel(`Cantidad de ${nombre}`);
await cant.fill('2');
await cant.press('Enter');
if (await carga.isVisible()) throw new Error('Dentro de la existencia no debe validar');
ok(`Detalle: cantidad escrita 2 → ${await cant.inputValue()}`);
await cant.fill('9999');
await p.getByRole('button', { name: 'Añadir al carrito' }).click();
await carga.waitFor();
await p.screenshot({ path: `${OUT}/2-detalle-validando.png` });
await carga.waitFor({ state: 'detached' });
const maximo = await cant.inputValue();
const aviso = await p.getByText(/Solo hay \d+ piezas? disponibles? para compra en línea/).innerText();
await p.screenshot({ path: `${OUT}/3-detalle-ajustado.png` });
ok(`Detalle: 9999 → ${maximo} con "${aviso}" (no se agregó al carrito)`);
await p.getByRole('button', { name: 'Añadir al carrito' }).click();
if (await carga.isVisible()) throw new Error('Con la cantidad ajustada se agrega sin validar');
ok(`Detalle: "Añadir al carrito" con ${maximo} piezas; la cantidad vuelve a ${await cant.inputValue()}`);

await browser.close();
if (errores.length) console.log('ERRORES', errores);
