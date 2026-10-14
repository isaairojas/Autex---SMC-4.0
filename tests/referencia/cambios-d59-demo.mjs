// D59 (2026-10-14): franja "en tus primeras compras", sucursal Mercado Libre Adolf Horn oculta, textos de otra región
// y otra zona, la cantidad no baja de 1, monto máximo de $70,000 y vista de celular en todas las páginas del flujo
// (ninguna se ve reducida ni se sale de lado a 390 px).
// Requiere el servidor en el puerto 5179 (npx vite --port 5179).
import { chromium } from 'playwright';
const B = 'http://localhost:5179';
const browser = await chromium.launch();
const errores = [];
const paso = (t) => console.log('✓', t);
const falla = (t) => {
  throw new Error(t);
};
async function nueva(movil = false) {
  const opciones = movil
    ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'es-MX' }
    : { viewport: { width: 1920, height: 1200 }, locale: 'es-MX' };
  const p = await (await browser.newContext(opciones)).newPage();
  p.on('pageerror', (e) => errores.push(e.message));
  await p.goto(B + '/');
  await p.getByRole('button', { name: 'No permitir nunca' }).click();
  return p;
}
const ir = async (p, ruta) => {
  await p.evaluate((u) => {
    history.pushState({}, '', u);
    dispatchEvent(new PopStateEvent('popstate'));
  }, ruta);
  await p.waitForTimeout(900);
};
const agregar = async (p, id) => {
  await ir(p, `/producto/${id}`);
  await p.getByRole('button', { name: 'Añadir al carrito', exact: true }).click();
  await p.waitForTimeout(600);
  /* En escritorio se abre el mini-carrito: se pasa al carrito desde ahí. */
  const mini = p.getByRole('button', { name: 'Ver todos los productos' });
  if (await mini.count()) await mini.click();
};

// 1) Escritorio: franja, sucursal oculta, textos y reglas del carrito
let p = await nueva();
await p.getByText('ENVÍO GRATIS EN TUS PRIMERAS COMPRAS').waitFor();
await p.getByText('(Aplica restricciones)').first().waitFor();
if (await p.getByText(/SIN MÍNIMO DE COMPRA|COMPRAS MAYORES/).count()) falla('La franja aún tiene el mensaje anterior');
paso('Franja: "Envío gratis en tus primeras compras (Aplica restricciones)"');

await ir(p, '/sucursales');
await p.getByText('Tesistan', { exact: true }).first().waitFor();
if (await p.getByText(/Mercado Libre Adolf Horn/).count()) falla('Mercado Libre Adolf Horn no debe aparecer');
paso('Sucursales: Mercado Libre Adolf Horn ya no aparece (configuracion-existencias.json)');

await ir(p, '/producto/marcha');
await p.getByText('No encontramos este producto en las tiendas de tu zona. Lo enviaremos desde otra región y podría tardar más de lo normal.').first().waitFor();
await p.getByText('*Entrega estimada de 2 a 4 días hábiles').first().waitFor();
paso('Detalle (solo en otra región): texto nuevo con entrega estimada de 2 a 4 días hábiles');

await p.getByRole('button', { name: 'Añadir al carrito', exact: true }).click();
await p.getByRole('button', { name: 'Ver todos los productos' }).click();
await p.waitForURL('**/carrito');
await p.getByText('Este producto está disponible en otra zona. El envío puede tardar más de lo normal.').first().waitFor();
paso('Carrito: lo de otra zona dice "Este producto está disponible en otra zona…"');

const cantidad = p.getByLabel('Cantidad de Motor de arranque (marcha) Tecnofuel');
await cantidad.fill('0');
await cantidad.press('Enter');
await p.waitForTimeout(1500);
if (!(await cantidad.count())) falla('Bajar la cantidad de 1 no debe eliminar el producto');
if ((await cantidad.inputValue()) !== '1') falla('La cantidad mínima es 1');
paso('Carrito: bajar de 1 deja la cantidad en 1; solo "Eliminar" quita el producto');

// Monto máximo: 30 cuerpos de aceleración de $2,890 ($86,700) rebasan $70,000; con 1 se puede pagar.
await agregar(p, 'cuerpo-aceleracion');
await ir(p, '/carrito');
const alternador = p.getByLabel('Cantidad de Cuerpo de aceleración electrónico Tecnofuel');
await alternador.fill('30');
await alternador.press('Enter');
await p.waitForTimeout(2500);
await p.getByText(/El total de tu compra no puede superar \$70,000\.00/).first().waitFor();
if (await p.getByRole('button', { name: 'Proceder al pago' }).first().isEnabled()) falla('Arriba de $70,000 no se puede pasar al pago');
paso('Carrito: arriba de $70,000 aparece el aviso y "Proceder al pago" se bloquea');
await alternador.fill('1');
await alternador.press('Enter');
await p.waitForTimeout(2500);
if (!(await p.getByRole('button', { name: 'Proceder al pago' }).first().isEnabled())) falla('Debajo del monto máximo se puede pagar');
paso('Carrito: al bajar del monto máximo se puede continuar');
await p.close();

// 2) Celular: cada página con su vista de celular (sin versión reducida) y sin desplazamiento de lado
p = await nueva(true);
await p.getByRole('button', { name: 'Mi tienda' }).or(p.locator('[data-ancla=tienda]')).first().waitFor();
await p.locator('[data-ancla=entrega]').first().waitFor();
paso('Celular: "Mi tienda" y "Entrega en" bajo el buscador');
const revisar = async (nombre) => {
  if (await p.locator('.vista-escalada').count()) falla(`${nombre}: todavía se ve la versión de escritorio reducida`);
  const lado = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (lado > 0) falla(`${nombre}: se desplaza ${lado} px de lado`);
};
for (const [nombre, ruta] of [
  ['Inicio', '/'],
  ['Búsqueda', '/busqueda'],
  ['Catálogo', '/catalogo'],
  ['Marcas', '/marcas'],
  ['Promociones', '/ofertas'],
  ['Sucursales', '/sucursales'],
  ['Cómo comprar', '/como-comprar'],
  ['Detalle', '/producto/inyector-ai3922'],
]) {
  await ir(p, ruta);
  await revisar(nombre);
}
await p.getByRole('button', { name: 'Añadir al carrito', exact: true }).click();
await ir(p, '/carrito');
await revisar('Carrito');
await p.getByRole('button', { name: 'Proceder al pago' }).first().click();
const como = p.getByRole('dialog', { name: '¿Cómo deseas continuar?' });
await como.getByRole('radio', { name: 'Usuario invitado' }).click();
await como.getByRole('button', { name: 'Aceptar' }).click();
await p.waitForURL('**/checkout/datos');
await p.getByRole('button', { name: 'Volver al carrito' }).waitFor();
await revisar('Paso 1');
paso('Celular: inicio, búsqueda, catálogo, marcas, promociones, sucursales, cómo comprar, detalle, carrito y pago sin versión reducida ni desplazamiento de lado');

await browser.close();
if (errores.length) {
  console.log('ERRORES', errores);
  process.exit(1);
}
console.log('D59 sin errores');
