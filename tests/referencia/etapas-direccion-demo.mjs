// D51: cambio de dirección en todas las etapas del checkout. La ubicación del encabezado queda deshabilitada; en
// método de pago, confirmación y datos del usuario el cambio pide confirmación y regresa a "Método de envío". El
// registrado ve el formulario del paso 1 lleno con su pedido anterior; la dirección se busca con sugerencias.
// Uso: node tests/referencia/etapas-direccion-demo.mjs <salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-etapas-direccion';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errores = [];
const ok = (t) => console.log('✓', t);
const TEXTO = 'Al cambiar la dirección de entrega, los precios y la disponibilidad de tus productos podrían cambiar, ¿desea continuar?';
const INYECTOR = 'Inyector de combustible Tecnofuel AI3922';

const p = await browser.newPage({ viewport: { width: 1920, height: 1200 } });
p.on('pageerror', (e) => errores.push(e.message));
await p.goto('http://localhost:5179/busqueda');
await p.getByRole('button', { name: 'No permitir nunca' }).click();
await p.getByRole('button', { name: 'Ingresar' }).click();
await p.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
await p.getByRole('dialog', { name: 'Iniciar sesión' }).getByRole('button', { name: 'Iniciar sesión' }).click();
await p.getByRole('status', { name: 'Cargando productos…' }).waitFor({ state: 'detached' }).catch(() => {});
const c = p.getByLabel(`Cantidad de ${INYECTOR}`);
await c.locator('xpath=ancestor::*[.//button[normalize-space()="Agregar al carrito"]][1]').getByRole('button', { name: 'Agregar al carrito' }).click();
await p.getByRole('button', { name: 'Ver todos los productos' }).click();
await p.getByRole('button', { name: 'Proceder al pago' }).first().click();
/* D52: información completa y un solo envío → directo a Confirmación, sin el encabezado del sitio */
await p.waitForURL('**/checkout/confirmacion');
await p.getByText('Tu información está completa y tu pedido llega en un solo envío').waitFor();
if (await p.getByText('ENVÍO GRATIS A TODO MÉXICO').count()) throw new Error('La pasarela no debe mostrar la franja superior');
if (await p.getByRole('button', { name: /Mis vehículos|Buscando para/ }).count()) throw new Error('La pasarela no debe mostrar la barra de navegación');
await p.getByRole('button', { name: 'Volver al carrito' }).waitFor();
await p.screenshot({ path: `${OUT}/0-directo-confirmacion.png`, fullPage: true });
ok('Pasarela: sin franja ni barra de navegación, solo "Volver al carrito"; un solo envío → directo a Confirmación');
if (await p.getByText(/#\d{7}/).count()) throw new Error('El checkout no debe mostrar número de pedido');
ok('Sin número de pedido en el checkout (se asigna al pagar)');
/* D53: navegación libre entre los pasos ya visitados */
await p.getByRole('button', { name: /Método de envío/ }).click();
await p.waitForURL('**/checkout/envio');
await p.getByRole('button', { name: 'Regresar' }).click();
await p.waitForURL('**/checkout/datos');
await p.getByRole('button', { name: /Confirmación/ }).click();
await p.waitForURL('**/checkout/confirmacion');
await p.getByRole('button', { name: /Método de envío/ }).click();
await p.waitForURL('**/checkout/envio');
ok('Pasos: Confirmación → Método de envío → "Regresar" a Datos → adelante a Confirmación (ya visitada) → Método de envío');

const confirmar = async (captura) => {
  await p.getByText(TEXTO).waitFor();
  if (captura) await p.screenshot({ path: `${OUT}/${captura}` });
  await p.getByRole('button', { name: 'Sí, continuar' }).click();
  await p.getByRole('status', { name: 'Actualizando tu dirección de entrega' }).waitFor({ state: 'detached' });
  await p.waitForURL('**/checkout/envio');
};
const elegir = async (nombre) => {
  await p.getByRole('dialog', { name: 'Cambiar dirección de entrega' }).getByText(nombre, { exact: true }).click();
  await p.getByRole('button', { name: 'Usar esta dirección' }).click();
};

/* Paso 3: método de pago */
await p.getByRole('button', { name: 'Continuar' }).click();
await p.waitForURL('**/checkout/pago');
await p.getByRole('button', { name: 'Cambiar dirección de entrega' }).click();
await elegir('Casa');
await confirmar('1-confirmacion-pago.png');
await p.getByText('todos tus productos siguen disponibles').waitFor();
await p.locator('p', { hasText: /^Casa$/ }).waitFor();
ok('Método de pago: "Cambiar dirección de entrega" → confirmación → regresa a Método de envío con Casa');

/* Paso 4: confirmación */
await p.getByRole('button', { name: 'Continuar' }).click();
await p.waitForURL('**/checkout/pago');
await p.getByRole('button', { name: 'Continuar' }).click();
await p.waitForURL('**/checkout/confirmacion');
await p.getByRole('button', { name: 'Cambiar' }).first().click();
await elegir('Bodega Tlaquepaque');
await confirmar();
await p.locator('p', { hasText: /^Bodega Tlaquepaque$/ }).waitFor();
ok('Confirmación: "Cambiar" en Envío a domicilio → confirmación → regresa a Método de envío con Bodega Tlaquepaque');

/* Paso 1: formulario lleno y búsqueda de dirección */
await p.getByRole('button', { name: /Datos del usuario/ }).click();
await p.waitForURL('**/checkout/datos');
const valor = (n) => p.locator(`input[name="${n}"]`).inputValue();
const lleno = [await valor('nombre'), await valor('apellido'), await valor('correo'), await valor('telefono'), await valor('calle'), await valor('codigoPostal')];
if (lleno.some((v) => !v)) throw new Error(`El formulario del registrado debe venir lleno: ${lleno}`);
await p.screenshot({ path: `${OUT}/2-datos-lleno.png`, fullPage: true });
ok(`Datos del usuario: formulario lleno con el pedido anterior (${lleno.join(' · ')})`);
const buscar = p.getByRole('combobox', { name: 'Buscar dirección' });
await buscar.pressSequentially('constitucion 400 monterrey', { delay: 20 });
await p.locator('#sugerencias-direccion').getByRole('option').first().waitFor();
await p.screenshot({ path: `${OUT}/3-sugerencias.png` });
const opciones = await p.locator('#sugerencias-direccion').getByRole('option').allInnerTexts();
await p.locator('#sugerencias-direccion').getByRole('option').first().click();
if ((await valor('codigoPostal')) !== '64000' || (await valor('numeroExterior')) !== '400') throw new Error('La sugerencia debe llenar C.P. y número');
ok(`Buscar dirección: "${opciones[0].replace(/\s+/g, ' ')}" llena calle, número 400 y C.P. 64000`);
await p.getByRole('button', { name: 'Continuar' }).click();
await confirmar('4-confirmacion-datos.png');
await p.getByText(/Av\. Constitución 400/).first().waitFor();
await p.screenshot({ path: `${OUT}/5-envio-monterrey.png`, fullPage: true });
ok('Datos del usuario: la nueva dirección pide confirmación y regresa a Método de envío (Monterrey)');

/* D56: el registrado con el mismo C.P. cambia la dirección sin aviso */
await p.getByRole('button', { name: /Datos del usuario/ }).click();
await p.waitForURL('**/checkout/datos');
await p.locator('input[name="numeroExterior"]').fill('410');
await p.getByRole('button', { name: 'Continuar' }).click();
await p.waitForURL('**/checkout/envio');
if (await p.getByText(TEXTO).count()) throw new Error('Con el mismo C.P. no debe pedirse confirmación');
await p.getByText(/Av\. Constitución 410/).first().waitFor();
ok('Datos del usuario: mismo C.P. (64000) con otro número → sin aviso, directo a Método de envío');

await browser.close();
if (errores.length) console.log('ERRORES', errores);
