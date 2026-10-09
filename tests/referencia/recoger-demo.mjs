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
await p.getByRole('region', { name: 'Zona de entrega' }).getByText('Guadalajara', { exact: true }).waitFor();
if (await p.getByRole('region', { name: 'Recoger en tienda' }).count()) throw new Error('Sin artículos para recoger no debe verse la sección "Recoger en tienda"');
await p.screenshot({ path: `${OUT}/1-carrito.png`, fullPage: true });
ok('Carrito (todo a domicilio): existencias en línea y en tienda por artículo; solo "Zona de entrega: Guadalajara y sus alrededores"');

await tarjeta(INYECTOR).getByRole('button', { name: 'Recoger en tienda' }).click();
await carga('Calculando disponibilidad en tienda');
await tarjeta(INYECTOR).getByText(/Ajustamos la cantidad a \d+ piezas disponibles en/).waitFor();
const aviso = (await tarjeta(INYECTOR).getByRole('status').innerText()).replace(/^info\s*/, '');
const tienda = (await p.getByRole('region', { name: 'Recoger en tienda' }).locator('p').nth(1).innerText()).trim();
await p.getByRole('region', { name: 'Zona de entrega' }).waitFor();
ok(`Recoger el inyector (40 pzs) en ${tienda}: ${aviso} · pedido mixto: "Zona de entrega" y "Recoger en tienda" por separado`);
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
await p.getByText('Recoger en tienda', { exact: true }).first().waitFor();
await p.screenshot({ path: `${OUT}/3-paso2.png`, fullPage: true });
ok('Paso 2: el ventilador en envíos y el inyector en "Recoger en tienda"');
await p.goBack();
await p.waitForURL('**/carrito');

await p.getByRole('button', { name: 'Cambiar tienda' }).click();
const panel = p.getByRole('dialog', { name: 'Selecciona una tienda' });
await panel.getByRole('button', { name: 'Seleccionar tienda' }).first().click();
await carga('Cambiando tu tienda');
const nueva = await p.getByRole('button', { name: 'Mi tienda' }).innerText().then((t) => t.match(/Autex[^\n]*/)?.[0] ?? t);
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

/* D44: bajo pedido por sucursal foránea (sesión nueva, invitado, C.P. 45138). */
const q = await browser.newPage({ viewport: { width: 1920, height: 1100 } });
q.on('pageerror', (e) => errores.push(e.message));
await q.goto(B + '/busqueda');
await q.getByRole('button', { name: 'No permitir nunca' }).click();
await q.getByRole('status', { name: 'Cargando productos…' }).waitFor({ state: 'detached' });
const MARCHA = 'Motor de arranque (marcha) Tecnofuel';
const CLUTCH = 'Kit de clutch Sachs 3000 990 492';
const tarjetaCatalogo = (nombre) => q.getByLabel(`Cantidad de ${nombre}`).locator('xpath=ancestor::*[.//button[normalize-space()="Agregar al carrito"]][1]');
await q.getByLabel(`Cantidad de ${MARCHA}`).locator('xpath=ancestor::*[contains(., "Disponible bajo pedido")][1]').waitFor();
ok('Catálogo: la marcha (sin piezas en la zona, solo en sucursales foráneas) aparece "Disponible bajo pedido" desde la primera pieza');
/* D46: el filtro de aire tiene 1 pieza en Tesistán: con 1 está disponible y al pedir 2 pasa a bajo pedido. */
const FILTRO = 'Filtro de aire de motor Tecnofuel';
const tarjetaFiltro = q.getByLabel(`Cantidad de ${FILTRO}`).locator('xpath=ancestor::*[contains(., "pzs")][1]');
if (await tarjetaFiltro.getByText('Disponible bajo pedido').count()) throw new Error('Con 1 pieza el filtro debe estar disponible');
await q.getByLabel(`Cantidad de ${FILTRO}`).fill('2');
await q.getByLabel(`Cantidad de ${FILTRO}`).press('Enter');
await tarjetaFiltro.getByText('Disponible bajo pedido').waitFor();
await q.screenshot({ path: `${OUT}/9-filtro-2-piezas.png` });
ok('Catálogo: filtro de aire (1 pieza en Tesistán) disponible con 1 y "bajo pedido" al pedir 2');
await q.getByLabel(`Cantidad de ${FILTRO}`).fill('1');
await q.getByLabel(`Cantidad de ${FILTRO}`).press('Enter');
for (const [nombre, n] of [[MARCHA, 1], [CLUTCH, 9]]) {
  const c = q.getByLabel(`Cantidad de ${nombre}`);
  await c.fill(String(n));
  await c.press('Enter');
  await tarjetaCatalogo(nombre).getByRole('button', { name: 'Agregar al carrito' }).click();
  await q.getByRole('dialog', { name: 'Mi carrito' }).getByRole('button', { name: nombre === CLUTCH ? 'Ver todos los productos' : 'Cerrar' }).click();
}
await q.waitForURL('**/carrito');
await q.getByText('Productos bajo pedido (2)').waitFor();
if ((await q.getByText(/Existencia en otra región: se envía como pedido foráneo/).count()) !== 2) throw new Error('Falta la leyenda de sucursal foránea');
await q.screenshot({ path: `${OUT}/7-carrito-foranea.png`, fullPage: true });
ok('Carrito: marcha y 9 kits de clutch (la zona no los completa) separados en "Productos bajo pedido" con la leyenda');
await q.getByRole('button', { name: 'Proceder al pago' }).first().click();
await q.getByRole('radio', { name: 'Tengo una cuenta Autex' }).click();
await q.getByRole('button', { name: 'Aceptar' }).click();
await q.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
await q.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
await q.getByRole('dialog', { name: 'Iniciar sesión' }).getByRole('button', { name: 'Iniciar sesión' }).click();
await q.waitForURL('**/checkout/envio');
for (const b of await q.getByRole('button', { name: /Envío \d+/ }).all()) await b.click();
await q.getByText(/\(sucursal foránea\)/).first().waitFor();
/* D49: solo la foránea más cercana (Zamora): cuando mucho un envío foráneo. */
if ((await q.getByText(/\(sucursal foránea\)/).count()) !== 1) throw new Error('Debe haber un solo envío foráneo');
await q.screenshot({ path: `${OUT}/8-envio-foranea.png`, fullPage: true });
ok('Paso 2: el envío bajo pedido sale de la sucursal foránea más cercana (Zamora), un solo envío foráneo');

await browser.close();
if (errores.length) console.log('ERRORES', errores);
console.log('ok', OUT);
