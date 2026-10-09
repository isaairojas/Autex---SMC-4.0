// D50: "Cambiar dirección de entrega" en el paso 2 pide confirmación (precios y disponibilidad), recalcula las
// existencias de cada artículo con su opción de entrega y muestra la leyenda amarilla si no se completan o si la nueva
// ubicación no arroja existencias. Uso: node tests/referencia/cambio-direccion-demo.mjs <salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-cambio-direccion';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errores = [];
const ok = (t) => console.log('✓', t);
const INYECTOR = 'Inyector de combustible Tecnofuel AI3922';
const MARCHA = 'Motor de arranque (marcha) Tecnofuel';

/** Sesión de Ernesto (Taller Chapalita, Zapopan) con productos en el carrito y en el paso 2. */
async function paso2(productos) {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1200 } });
  p.on('pageerror', (e) => errores.push(e.message));
  await p.goto('http://localhost:5179/busqueda');
  await p.getByRole('button', { name: 'No permitir nunca' }).click();
  await p.getByRole('button', { name: 'Ingresar' }).click();
  await p.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
  await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
  await p.getByRole('dialog', { name: 'Iniciar sesión' }).getByRole('button', { name: 'Iniciar sesión' }).click();
  await p.getByRole('status', { name: 'Cargando productos…' }).waitFor({ state: 'detached' }).catch(() => {});
  for (const [nombre, n] of productos) {
    const c = p.getByLabel(`Cantidad de ${nombre}`);
    await c.fill(String(n));
    await c.press('Enter');
    await p.getByRole('status', { name: 'Validando existencias' }).waitFor({ state: 'detached' });
    await c.locator('xpath=ancestor::*[.//button[normalize-space()="Agregar al carrito"]][1]').getByRole('button', { name: 'Agregar al carrito' }).click();
    await p.getByRole('dialog', { name: 'Mi carrito' }).getByRole('button', { name: 'Cerrar' }).click();
  }
  await p.getByRole('button', { name: /carrito/i }).last().click();
  await p.getByRole('button', { name: 'Ver todos los productos' }).click();
  /* La cuenta trae un chaleco guardado en el carrito: se quita para dejar solo lo de cada caso. */
  const chaleco = p.locator('div').filter({ hasText: /^Chaleco de seguridad/ }).first();
  const tarjeta = p.locator('div').filter({ has: chaleco }).filter({ has: p.getByRole('button', { name: 'Eliminar' }) }).last();
  if (await chaleco.count()) await tarjeta.getByRole('button', { name: 'Eliminar' }).click();
  await p.getByRole('button', { name: 'Proceder al pago' }).first().click();
  /* D52: con un solo envío el registrado entra directo a Confirmación; se regresa al paso 2 con el indicador. */
  await p.waitForURL(/checkout\/(envio|confirmacion)/);
  if (p.url().includes('confirmacion')) await p.getByRole('button', { name: /Método de envío/ }).click();
  await p.waitForURL('**/checkout/envio');
  return p;
}
async function cambiarA(p, nombre, captura) {
  await p.getByRole('button', { name: 'Cambiar dirección de entrega' }).click();
  await p.getByText(nombre, { exact: true }).click();
  await p.getByRole('button', { name: 'Usar esta dirección' }).click();
  await p.getByText('los precios y la disponibilidad de tus productos podrían cambiar, ¿desea continuar?').waitFor();
  if (captura) await p.screenshot({ path: `${OUT}/${captura}` });
  await p.getByRole('button', { name: 'Sí, continuar' }).click();
  await p.getByRole('status', { name: 'Actualizando tu dirección de entrega' }).waitFor({ state: 'detached' });
}
const continuar = (p) => p.getByRole('button', { name: 'Continuar' });

// 1. Parcial: inyectores de más y la marcha (sin piezas en Monterrey)
let p = await paso2([[INYECTOR, 9999], [MARCHA, 1]]);
await p.getByRole('button', { name: 'Cambiar dirección de entrega' }).click();
await p.getByText('Cliente Monterrey', { exact: true }).click();
await p.getByRole('button', { name: 'Usar esta dirección' }).click();
await p.getByRole('button', { name: 'Cancelar' }).click();
if (!(await p.getByText('Taller Chapalita').first().isVisible())) throw new Error('"Cancelar" no debe cambiar la dirección');
ok('Confirmación: "Cancelar" conserva Taller Chapalita');
await cambiarA(p, 'Cliente Monterrey', '1-confirmacion.png');
await p.getByText('La totalidad de los productos no está disponible para la nueva ubicación seleccionada.').waitFor();
const lista = (await p.getByRole('alert').filter({ hasText: 'La totalidad' }).innerText()).replace(/\s+/g, ' ');
await p.screenshot({ path: `${OUT}/2-parcial.png`, fullPage: true });
if (!(await continuar(p).isDisabled())) throw new Error('Con productos sin existencia no se puede continuar');
ok(`Parcial: ${lista}`);
await p.getByRole('button', { name: 'Quitar productos sin existencia' }).click();
if (await continuar(p).isDisabled()) throw new Error('Al quitar lo que no tiene existencia se debe poder continuar');
await p.screenshot({ path: `${OUT}/3-sin-marcha.png`, fullPage: true });
ok('Parcial: "Quitar productos sin existencia" habilita "Continuar"');
await p.close();

// 2. Nada: solo la marcha
p = await paso2([[MARCHA, 1]]);
await cambiarA(p, 'Cliente Monterrey');
await p.getByText('La nueva ubicación no arroja existencias para los productos de tu pedido.').waitFor();
await p.screenshot({ path: `${OUT}/4-sin-existencias.png`, fullPage: true });
if (!(await continuar(p).isDisabled())) throw new Error('Sin existencias no se puede continuar');
ok('Sin existencias: "La nueva ubicación no arroja existencias…" con "Elegir otra dirección" y "Regresar al carrito"');
await p.close();

// 3. Todo disponible
p = await paso2([[INYECTOR, 2]]);
await cambiarA(p, 'Casa');
await p.getByText('todos tus productos siguen disponibles').waitFor();
await p.screenshot({ path: `${OUT}/5-todo-disponible.png`, fullPage: true });
ok('Todo disponible: nota "todos tus productos siguen disponibles"');

await browser.close();
if (errores.length) console.log('ERRORES', errores);
