// D58: vista de celular (entrega 1: marco y navegación), copiada de autex.com.mx en celular (docs/autex-real/movil).
// Encabezado, menú, cuenta, Mis vehículos, inicio de sesión, pie y WhatsApp a 390 px; sin desplazamiento horizontal
// a 360, 390 y 414 px; en escritorio sigue el encabezado de Figma.
// Requiere el servidor en el puerto 5179 (npx vite --port 5179). Uso: node tests/referencia/movil-demo.mjs [salida]
import { chromium } from 'playwright';
import fs from 'node:fs';
const B = 'http://localhost:5179';
const OUT = process.argv[2] ?? 'capturas-movil';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errores = [];
const paso = (t) => console.log('✓', t);
const falla = (t) => {
  throw new Error(t);
};
async function celular(ancho = 390) {
  const ctx = await browser.newContext({ viewport: { width: ancho, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-MX' });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errores.push(e.message));
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  await p.goto(B + '/');
  await p.getByRole('button', { name: 'No permitir nunca' }).click();
  return p;
}
const desborde = (p) => p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

// 1) Encabezado de invitado
let p = await celular();
const encabezado = p.locator('header').first();
for (const t of ['Mis vehículos', 'Ingresar']) await encabezado.getByText(t, { exact: true }).waitFor();
await encabezado.getByText('ENVÍO GRATIS EN TUS PRIMERAS COMPRAS').waitFor();
await p.getByRole('search').getByRole('button', { name: 'Especialidades' }).waitFor();
if (await p.getByRole('link', { name: 'Inicio', exact: true }).count()) falla('En celular no va la barra de enlaces de escritorio');
await p.getByRole('link', { name: 'WhatsApp' }).waitFor();
await p.screenshot({ path: `${OUT}/1-inicio.png` });
paso('Encabezado de celular: franja, menú, logo, "Mis vehículos", "Ingresar", carrito, buscador y WhatsApp flotante');

// 2) Menú
await p.getByRole('button', { name: 'Menú' }).click();
const menu = p.getByRole('dialog', { name: 'Menú' });
for (const t of ['Ingresar', 'Marcas', 'Promociones', 'Empresa', 'Sucursales', 'Ayuda', '¿Cómo comprar en Autex?']) await menu.getByText(t, { exact: true }).waitFor();
await p.screenshot({ path: `${OUT}/2-menu.png` });
await menu.getByRole('button', { name: 'Sucursales' }).click();
await p.waitForURL('**/sucursales');
paso('Menú: Ingresar, Marcas, Promociones, Empresa y Ayuda; sus enlaces navegan (Sucursales)');

// 3) Pie: secciones plegables, "Contáctanos" abierta
const pie = p.locator('footer').last();
await pie.getByText('Localiza tu tienda').waitFor();
if (await pie.getByText('Términos y condiciones').count()) falla('"Acerca de Autex" debe empezar cerrada');
await pie.getByRole('button', { name: 'Acerca de Autex' }).click();
await pie.getByText('Términos y condiciones').waitFor();
await pie.getByRole('button', { name: 'Contáctanos' }).click();
if (await pie.getByText('Localiza tu tienda').count()) falla('"Contáctanos" debe cerrarse');
paso('Pie: secciones plegables con "Contáctanos" abierta al cargar');

// 4) Mis vehículos
await p.getByRole('button', { name: 'Mis vehículos' }).click();
const mv = p.getByRole('dialog', { name: 'Mis vehículos' });
await mv.getByRole('button', { name: 'Iniciar sesión' }).waitFor();
await mv.getByText('Navegando sin vehículo').waitFor();
if (await mv.getByLabel('Año').count()) falla('"Agregar nuevo vehículo" empieza plegado');
await mv.getByRole('button', { name: 'Agregar nuevo vehículo' }).click();
await mv.getByLabel('Año').waitFor();
await p.screenshot({ path: `${OUT}/3-mis-vehiculos.png` });
await mv.getByRole('button', { name: 'Cerrar' }).click();
paso('Mis vehículos: "Iniciar sesión", "Agregar nuevo vehículo" plegado y "Navegando sin vehículo"');

// 5) Inicio de sesión a pantalla completa → registrado
await p.getByRole('button', { name: 'Ingresar' }).first().click();
const login = p.getByRole('dialog', { name: 'Iniciar sesión' });
const caja = await login.boundingBox();
if (Math.round(caja.width) !== 390) falla(`El inicio de sesión ocupa todo el ancho (mide ${caja.width})`);
await p.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
await login.getByRole('button', { name: 'Iniciar sesión' }).click();
await p.waitForURL(B + '/');
await p.getByRole('button', { name: 'Mi cuenta' }).waitFor();
await p.getByLabel('Notificaciones').waitFor();
paso('Inicio de sesión a todo el ancho; con sesión, ícono de cuenta y campana');

// 6) Cuenta con sesión
await p.getByRole('button', { name: 'Mi cuenta' }).click();
const cuenta = p.getByRole('list', { name: 'Opciones de la cuenta' });
for (const t of ['Mi perfil', 'Mis pedidos', 'Salir']) await cuenta.getByRole('button', { name: t }).waitFor();
await p.screenshot({ path: `${OUT}/4-cuenta.png` });
await cuenta.getByRole('button', { name: 'Mis pedidos' }).click();
await p.waitForURL('**/configuracion/pedidos');
await p.getByRole('button', { name: 'Menú' }).click();
await menu.getByText('Ernesto Quiñonez').waitFor();
await menu.getByText('Mis Pedidos', { exact: true }).waitFor();
await p.screenshot({ path: `${OUT}/5-menu-sesion.png` });
await menu.getByRole('button', { name: 'Cerrar sesión' }).click();
await p.waitForURL(B + '/');
await p.getByRole('button', { name: 'Ingresar' }).first().waitFor();
paso('Cuenta: Mi perfil, Mis pedidos y Salir; el menú saluda al cliente y "Cerrar sesión" sale');

// 7) Carrito: en celular se abre su página (no hay mini-carrito)
await p.getByRole('button', { name: /^Carrito/ }).click();
await p.waitForURL('**/carrito');
paso('El carrito del encabezado abre la página del carrito');
await p.context().close();

// 8) Sin desplazamiento horizontal en anchos comunes; en escritorio, el encabezado de Figma
for (const ancho of [360, 390, 414]) {
  p = await celular(ancho);
  for (const ruta of ['/', '/busqueda', '/carrito']) {
    await p.goto(B + ruta);
    await p.waitForTimeout(800);
    const d = await desborde(p);
    if (d > 0) falla(`${ancho} px ${ruta}: desplazamiento horizontal de ${d} px`);
  }
  await p.context().close();
}
paso('Sin desplazamiento horizontal a 360, 390 y 414 px');
const escritorio = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await escritorio.goto(B + '/');
await escritorio.getByRole('link', { name: 'Inicio', exact: true }).waitFor();
if (await escritorio.getByRole('button', { name: 'Menú' }).count()) falla('En escritorio no va el encabezado de celular');
paso('Escritorio sin cambios: encabezado de Figma con su barra de enlaces');

await browser.close();
if (errores.length) {
  console.log('Errores de consola:', errores);
  process.exit(1);
}
console.log('Vista de celular sin errores');
