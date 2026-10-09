// D49: la red de búsqueda de una entrega son las tiendas Local y Local Extendido más una sola sucursal foránea (la
// más cercana, parametrizable). Agrega el inyector Tecnofuel AI3922 con todas sus piezas en línea y revisa que el
// paso 2 tenga cuando mucho un envío foráneo. Uso: node tests/referencia/foranea-unica-demo.mjs <salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-foranea-unica';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errores = [];
const ok = (t) => console.log('✓', t);
const p = await browser.newPage({ viewport: { width: 1920, height: 1200 } });
p.on('pageerror', (e) => errores.push(e.message));
await p.goto('http://localhost:5179/busqueda');
await p.getByRole('button', { name: 'No permitir nunca' }).click();
await p.getByRole('button', { name: 'Ingresar' }).click();
await p.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
await p.getByRole('dialog', { name: 'Iniciar sesión' }).getByRole('button', { name: 'Iniciar sesión' }).click();
await p.getByRole('status', { name: 'Cargando productos…' }).waitFor({ state: 'detached' }).catch(() => {});

const nombre = 'Inyector de combustible Tecnofuel AI3922';
await p.getByRole('button', { name: nombre }).first().click();
const cant = p.getByLabel(`Cantidad de ${nombre}`);
await cant.fill('9999');
await cant.press('Enter');
await p.getByRole('status', { name: 'Validando existencias' }).waitFor({ state: 'detached' });
const piezas = await cant.inputValue();
await p.getByRole('button', { name: 'Añadir al carrito' }).click();
ok(`Detalle: ${piezas} piezas para compra en línea al carrito`);

await p.getByRole('button', { name: 'Ver todos los productos' }).click();
await p.getByRole('button', { name: 'Proceder al pago' }).first().click();
await p.waitForURL('**/checkout/envio');
await p.evaluate(() => document.fonts.ready);
for (const b of await p.getByRole('button', { name: /Envío \d+/ }).all()) await b.click();
const texto = await p.locator('body').innerText();
const envios = [...texto.matchAll(/Envío \d+/g)].length;
const foraneos = [...texto.matchAll(/sucursal foránea/g)].length;
await p.screenshot({ path: `${OUT}/1-envios.png`, fullPage: true });
console.log(texto.split('\n').filter((l) => /Envío \d|Autex|foránea|Entrega/.test(l)).join('\n'));
if (foraneos > 1) throw new Error(`Debe haber cuando mucho 1 envío foráneo (hay ${foraneos})`);
ok(`Paso 2: ${envios} envíos, ${foraneos} foráneo(s)`);
await browser.close();
if (errores.length) console.log('ERRORES', errores);
