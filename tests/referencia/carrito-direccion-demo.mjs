// D55: en el carrito, el registrado con dirección de entrega guardada la ve en lugar de "Zona de entrega" (el invitado
// sigue viendo la zona por C.P.), y la cantidad se escribe con "Validando existencias".
// Uso: node tests/referencia/carrito-direccion-demo.mjs <salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-carrito-direccion';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errores = [];
const ok = (t) => console.log('✓', t);
const INYECTOR = 'Inyector de combustible Tecnofuel AI3922';

async function carrito(registrado) {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1200 } });
  p.on('pageerror', (e) => errores.push(e.message));
  await p.goto('http://localhost:5179/busqueda');
  await p.getByRole('button', { name: 'No permitir nunca' }).click();
  if (registrado) {
    await p.getByRole('button', { name: 'Ingresar' }).click();
    await p.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
    await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
    await p.getByRole('dialog', { name: 'Iniciar sesión' }).getByRole('button', { name: 'Iniciar sesión' }).click();
  }
  await p.getByRole('status', { name: 'Cargando productos…' }).waitFor({ state: 'detached' }).catch(() => {});
  const c = p.getByLabel(`Cantidad de ${INYECTOR}`);
  await c.locator('xpath=ancestor::*[.//button[normalize-space()="Agregar al carrito"]][1]').getByRole('button', { name: 'Agregar al carrito' }).click();
  await p.getByRole('button', { name: 'Ver todos los productos' }).click();
  await p.waitForURL('**/carrito');
  return p;
}

let p = await carrito(false);
await p.getByRole('region', { name: 'Zona de entrega' }).waitFor();
if (await p.getByRole('region', { name: 'Dirección de entrega' }).count()) throw new Error('El invitado no tiene dirección guardada');
ok(`Invitado: "Zona de entrega" por C.P. (${(await p.getByRole('region', { name: 'Zona de entrega' }).innerText()).replace(/\s+/g, ' ')})`);
await p.close();

p = await carrito(true);
const dir = p.getByRole('region', { name: 'Dirección de entrega' });
await dir.getByText('Taller Chapalita').waitFor();
if (await p.getByRole('region', { name: 'Zona de entrega' }).count()) throw new Error('Con dirección guardada no debe verse "Zona de entrega"');
ok(`Registrado: ${(await dir.innerText()).replace(/\s+/g, ' ')}`);

const cant = p.getByLabel(`Cantidad de ${INYECTOR}`);
await cant.fill('5');
await cant.press('Enter');
await p.waitForFunction((n) => document.querySelector(`input[aria-label="Cantidad de ${n}"]`)?.value === '5', INYECTOR);
ok('Carrito: cantidad escrita 5 sin carga');
await cant.fill('9999');
await cant.press('Enter');
const carga = p.getByRole('status', { name: 'Validando existencias' });
await carga.waitFor();
await p.screenshot({ path: `${OUT}/1-validando.png` });
await carga.waitFor({ state: 'detached' });
const ajustada = await cant.inputValue();
if (Number(ajustada) >= 9999) throw new Error('La cantidad debía ajustarse a la existencia');
await p.getByText(/Solo hay \d+ piezas disponibles para compra en línea/).waitFor();
await p.screenshot({ path: `${OUT}/2-carrito.png`, fullPage: true });
ok(`Carrito: 9999 → "Validando existencias" → ${ajustada} con aviso`);
/* D56: la imagen o el nombre abren el detalle del producto */
await p.getByRole('button', { name: INYECTOR, exact: true }).click();
await p.waitForURL('**/producto/inyector-ai3922');
await p.getByText(INYECTOR).first().waitFor();
ok('Carrito: clic en el nombre abre el detalle del producto');
await browser.close();
if (errores.length) console.log('ERRORES', errores);
