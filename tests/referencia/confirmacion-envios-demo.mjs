// D54: Confirmación separada por envíos y "Recoger en tienda" (columna izquierda y resumen), sin "Acerca del pedido"
// y con "Facturación". Uso: node tests/referencia/confirmacion-envios-demo.mjs <salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-confirmacion-envios';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errores = [];
const ok = (t) => console.log('✓', t);
const INYECTOR = 'Inyector de combustible Tecnofuel AI3922';
const CINTA = 'Cinta aislante de vinil negra 19 mm x 18 m TUK 320';

const p = await browser.newPage({ viewport: { width: 1920, height: 1200 } });
p.on('pageerror', (e) => errores.push(e.message));
await p.goto('http://localhost:5179/busqueda');
await p.getByRole('button', { name: 'No permitir nunca' }).click();
await p.getByRole('button', { name: 'Ingresar' }).click();
await p.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
await p.getByRole('dialog', { name: 'Iniciar sesión' }).getByRole('button', { name: 'Iniciar sesión' }).click();
/* D57: al iniciar sesión se regresa a la página principal; la lupa del buscador abre el catálogo. */
await p.waitForURL('http://localhost:5179/');
await p.getByRole('search').getByRole('button', { name: 'Buscar' }).click();
await p.waitForURL('**/busqueda**');
await p.getByRole('status', { name: 'Cargando productos…' }).waitFor({ state: 'detached' }).catch(() => {});
for (const [nombre, n] of [[INYECTOR, 100], [CINTA, 2]]) {
  const c = p.getByLabel(`Cantidad de ${nombre}`);
  await c.fill(String(n));
  await c.press('Enter');
  await c.locator('xpath=ancestor::*[.//button[normalize-space()="Agregar al carrito"]][1]').getByRole('button', { name: 'Agregar al carrito' }).click();
  await p.getByRole('dialog', { name: 'Mi carrito' }).getByRole('button', { name: nombre === CINTA ? 'Ver todos los productos' : 'Cerrar' }).click();
}
await p.waitForURL('**/carrito');
const tarjeta = (nombre) => p.locator('div', { has: p.getByText(nombre, { exact: true }) }).filter({ has: p.getByRole('group', { name: 'Entrega del artículo' }) }).last();
await tarjeta(CINTA).getByRole('button', { name: 'Recoger en tienda' }).click();
await p.getByRole('status', { name: 'Calculando disponibilidad en tienda' }).waitFor({ state: 'detached' });
await p.getByRole('button', { name: 'Proceder al pago' }).first().click();
await p.waitForURL('**/checkout/envio');
await p.getByRole('button', { name: 'Continuar' }).click();
await p.waitForURL('**/checkout/pago');
await p.getByRole('button', { name: 'Continuar' }).click();
await p.waitForURL('**/checkout/confirmacion');
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: `${OUT}/1-confirmacion.png`, fullPage: true });

if (await p.getByText('Acerca del pedido').count()) throw new Error('Confirmación no debe tener "Acerca del pedido"');
await p.getByText('Régimen fiscal', { exact: true }).waitFor();
/* Los envíos se ven compactos: una fila por envío que se despliega para ver la sucursal y los artículos. */
const filasEnvio = p.getByRole('button', { name: /^Envío \d+/ });
const envios = await filasEnvio.count();
if (await p.getByText(/^Sale de /).count()) throw new Error('Los envíos deben empezar plegados');
await filasEnvio.first().click();
await p.getByText(/Sale de/).first().waitFor();
await p.getByRole('button', { name: /Ver artículos/ }).click();
await p.screenshot({ path: `${OUT}/2-desplegado.png`, fullPage: true });
if (envios < 2) throw new Error(`Debe separar los envíos (hay ${envios})`);
await p.getByText('Recoger en tienda', { exact: true }).first().waitFor();
ok(`Confirmación: ${envios} envíos separados con su sucursal y artículos, "Recoger en tienda" aparte, "Facturación" y sin "Acerca del pedido"`);
const grupos = await p.locator('aside section').evaluateAll((s) => s.map((x) => x.getAttribute('aria-label')));
if (!grupos.includes('Recoger en tienda') || grupos.filter((g) => g.startsWith('Envío')).length < 2) throw new Error(`El resumen debe separar envíos y recoger: ${grupos}`);
ok(`Resumen de productos: ${grupos.join(' · ')}`);
await browser.close();
if (errores.length) console.log('ERRORES', errores);
