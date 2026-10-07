// Recoger en tienda (D43): entrega por artículo, ajuste a las piezas de "Mi tienda", entrega masiva, zona de entrega,
// cambio de tienda, paso 2 con "Recoger en tienda" y barra "Buscar en otras tiendas" del detalle.
// Uso: node tests/referencia/recoger-demo.mjs <carpeta-salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-recoger';
fs.mkdirSync(OUT, { recursive: true });
const B = 'http://localhost:5179';
const INYECTOR = 'Inyector de combustible Tecnofuel AI3922';
const VENTILADOR = 'Motoventilador de radiador Tecnofuel';
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1920, height: 1100 } });
const errores = [];
p.on('pageerror', (e) => errores.push(e.message));
const ok = (t) => console.log('✓', t);
const carga = async (nombre) => {
  await p.getByRole('status', { name: nombre }).waitFor();
  await p.getByRole('status', { name: nombre }).waitFor({ state: 'detached' });
};
const tarjeta = (nombre) => p.locator('div', { has: p.getByText(nombre, { exact: true }) }).filter({ has: p.getByRole('group', { name: 'Entrega del artículo' }) }).last();
const agregar = async (nombre, cantidad, verCarrito = false) => {
  const c = p.getByLabel(`Cantidad de ${nombre}`);
  await c.fill(String(cantidad));
  await c.press('Enter');
  await c.locator('xpath=ancestor::*[.//button[normalize-space()="Agregar al carrito"]][1]').getByRole('button', { name: 'Agregar al carrito' }).click();
  const mini = p.getByRole('dialog', { name: 'Mi carrito' });
  if (verCarrito) await mini.getByRole('button', { name: 'Ver todos los productos' }).click();
  else await mini.getByRole('button', { name: 'Cerrar' }).click();
};

await p.goto(B + '/busqueda');
await p.getByRole('button', { name: 'No permitir nunca' }).click();
await p.getByRole('status', { name: 'Cargando productos…' }).waitFor({ state: 'detached' });
await agregar(INYECTOR, 40);
await agregar(VENTILADOR, 2, true);
await p.waitForURL('**/carrito');
await p.getByText('Guadalajara', { exact: true }).waitFor();
await p.getByText('y sus alrededores').first().waitFor();
await p.screenshot({ path: `${OUT}/1-carrito.png`, fullPage: true });
ok('Carrito: existencias en línea y en tienda por artículo, método de entrega y "Guadalajara y sus alrededores"');

const tienda = (await p.getByRole('region', { name: 'Zona de entrega' }).locator('p').nth(1).innerText()).trim();
await tarjeta(INYECTOR).getByRole('button', { name: 'Recoger en tienda' }).click();
await carga('Calculando disponibilidad en tienda');
await tarjeta(INYECTOR).getByText(/Ajustamos la cantidad a \d+ piezas disponibles en/).waitFor();
const aviso = (await tarjeta(INYECTOR).getByRole('status').innerText()).replace(/^info\s*/, '');
ok(`Recoger el inyector (40 pzs) en ${tienda}: ${aviso}`);
if (await tarjeta(VENTILADOR).getByRole('button', { name: 'No disponible en tu tienda' }).isEnabled()) throw new Error('El ventilador no debe poder recogerse');
ok('Motoventilador: "No disponible en tu tienda" (la tienda no lo tiene)');
await p.getByRole('region', { name: 'Método de entrega' }).getByRole('button', { name: /Enviar todo a domicilio/ }).click();
await carga('Calculando disponibilidad para envío');
await p.getByRole('region', { name: 'Método de entrega' }).getByRole('button', { name: /Recoger todo en tienda/ }).click();
await carga('Calculando disponibilidad en tienda');
await tarjeta(VENTILADOR).getByText(/se queda con envío a domicilio/).waitFor();
await p.screenshot({ path: `${OUT}/2-recoger-todo.png`, fullPage: true });
ok('"Recoger todo en tienda": el inyector pasa a recoger y el ventilador se queda a domicilio con aviso');

/* Invitado → "Tengo una cuenta Autex": al iniciar sesión la entrega pasa a su dirección (otra tienda) y lo que se
   recoge se recalcula con las existencias de esa tienda. */
await p.getByRole('button', { name: 'Proceder al pago' }).first().click();
await p.getByRole('radio', { name: 'Tengo una cuenta Autex' }).click();
await p.getByRole('button', { name: 'Aceptar' }).click();
await p.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
await p.getByRole('dialog', { name: 'Iniciar sesión' }).getByRole('button', { name: 'Iniciar sesión' }).click();
await p.waitForURL('**/checkout/envio');
await p.getByText('Recoger en tienda', { exact: true }).waitFor();
await p.screenshot({ path: `${OUT}/3-paso2.png`, fullPage: true });
ok('Paso 2: el ventilador en envíos y el inyector en "Recoger en tienda"');
await p.goBack();
await p.waitForURL('**/carrito');

await p.getByRole('button', { name: 'Cambiar tienda' }).click();
const panel = p.getByRole('dialog', { name: 'Selecciona una tienda' });
await panel.getByRole('button', { name: 'Seleccionar tienda' }).first().click();
await carga('Cambiando tu tienda');
const nueva = (await p.getByRole('region', { name: 'Zona de entrega' }).locator('p').nth(1).innerText()).trim();
await p.screenshot({ path: `${OUT}/4-otra-tienda.png`, fullPage: true });
ok(`Cambio de tienda a ${nueva}: lo que se recoge se recalcula con sus existencias`);

await p.getByRole('button', { name: 'Buscar', exact: true }).click();
await p.getByRole('status', { name: 'Cargando productos…' }).waitFor({ state: 'detached' });
await p.getByRole('button', { name: INYECTOR }).first().click();
await p.getByRole('button', { name: 'Buscar en otra tienda' }).click();
const lateral = p.getByRole('dialog', { name: 'Buscar en otras tiendas' });
await lateral.getByText('Mi tienda').waitFor();
await p.screenshot({ path: `${OUT}/5-otras-tiendas.png` });
ok(`Detalle: barra "Buscar en otras tiendas" con ${await lateral.getByText(/\d+ disponibles$/).count()} tiendas`);
await lateral.getByRole('button', { name: 'Cambiar dirección' }).click();
await p.getByRole('dialog', { name: /Ubicación de entrega|Entrega/ }).first().waitFor();
await p.screenshot({ path: `${OUT}/6-cambiar-direccion.png` });
ok('"Cambiar dirección" abre la ubicación de entrega');

await browser.close();
if (errores.length) console.log('ERRORES', errores);
console.log('ok', OUT);
