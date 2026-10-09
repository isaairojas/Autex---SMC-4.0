// D57: revisión del flujo (2026-10-09): recoger en tienda, tope de piezas, toast al cambiar ubicación, fechas de entrega,
// facturación opcional, franja de envío gratis, año del pie e inicio de sesión que regresa a la página principal.
// Requiere el servidor en el puerto 5179 (npx vite --port 5179).
import { chromium } from 'playwright';
const B = 'http://localhost:5179';
const browser = await chromium.launch();
const errores = [];
async function nueva() {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1200 } });
  p.on('pageerror', (e) => errores.push(e.message));
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  return p;
}
const paso = (t) => console.log('✓', t);
const falla = (t) => {
  throw new Error(t);
};
async function cerrarAviso(p) {
  await p.getByRole('button', { name: 'Cerrar aviso de ubicación' }).click();
  const aviso = p.getByRole('dialog', { name: 'Elige una tienda' });
  await aviso.waitFor();
  await aviso.getByRole('button', { name: 'Cerrar' }).click();
}
const sinCarga = (p) => p.locator('[role=status]').filter({ hasText: /Calculando|Cambiando|Actualizando|Preparando|Revisando|Validando|Iniciando/ }).waitFor({ state: 'detached' }).catch(() => {});
const alCarrito = async (p) => {
  await p.getByRole('button', { name: 'Ver todos los productos' }).click();
  await p.waitForURL('**/carrito');
};
const comoInvitado = async (p) => {
  await p.getByRole('button', { name: 'Proceder al pago' }).first().click();
  const como = p.getByRole('dialog', { name: '¿Cómo deseas continuar?' });
  await como.getByRole('radio', { name: 'Usuario invitado' }).click();
  await como.getByRole('button', { name: 'Aceptar' }).click();
  await p.waitForURL('**/checkout/datos');
};

// 1) Franja, pie y recoger en tienda
let p = await nueva();
await p.goto(B + '/producto/cinta-aislante');
await cerrarAviso(p);
await p.getByText('SIN MÍNIMO DE COMPRA POR APERTURA').waitFor();
await p.getByText('(Aplica restricciones)').waitFor();
if (await p.getByText('COMPRAS MAYORES A $499 MXN').count()) falla('La franja aún dice $499');
await p.getByText(`AUTEX ${new Date().getFullYear()}`).waitFor();
paso('Franja "Sin mínimo de compra por apertura (Aplica restricciones)" y pie con el año actual');
await p.getByRole('button', { name: 'Añadir al carrito', exact: true }).click();
await p.getByRole('button', { name: 'Agregado al carrito' }).waitFor();
paso('Detalle: "Añadir al carrito" confirma con "Agregado al carrito"');
await alCarrito(p);
await p.getByRole('button', { name: 'Recoger en tienda', exact: true }).click();
await sinCarga(p);
const textoTienda = await p.getByText(/disponibles en Autex/).first().innerText();
const enTienda = Number(textoTienda.match(/(\d+)/)[1]);
await p.getByRole('button', { name: 'Ver Cinta aislante de vinil negra 19 mm x 18 m TUK 320' }).first().click();
await p.waitForURL('**/producto/cinta-aislante');
const cant = p.getByLabel('Cantidad de Cinta aislante de vinil negra 19 mm x 18 m TUK 320');
await cant.fill('999');
await cant.press('Enter');
await p.getByRole('status', { name: 'Validando existencias' }).waitFor({ state: 'detached' });
if (Number(await cant.inputValue()) !== enTienda - 1) falla(`Al recoger, el tope debe ser ${enTienda - 1} (piezas de la tienda menos 1 del carrito)`);
await p.getByText(/para recoger en Autex/).waitFor();
paso(`Recoger en tienda: el detalle no deja pasar de las ${enTienda} piezas de la tienda`);
await p.getByRole('button', { name: 'Añadir al carrito', exact: true }).click();
await alCarrito(p);
if (Number(await p.getByLabel('Cantidad de Cinta aislante de vinil negra 19 mm x 18 m TUK 320').inputValue()) !== enTienda) falla('El carrito debe quedar con las piezas de la tienda');
if (await p.getByText('Sin existencia en tu tienda').count()) falla('No debe quedar sin existencia');
paso('Recoger en tienda: el carrito queda con las piezas de la tienda (no sin existencia)');

// 2) Todo se recoge: paso 1 sin dirección, quién recoge; sin factura; pago en 7-Eleven
await comoInvitado(p);
await p.getByText('¿Quién recoge el pedido?').waitFor();
if (await p.getByText('Dirección de envío', { exact: true }).count()) falla('Si todo se recoge no se pide dirección');
if (await p.locator('select[name=regimen]').count()) falla('Sin "Requiero factura" no se piden datos fiscales');
if (await p.getByText('Requiero factura').count()) falla('Un pedido solo para recoger no lleva la parte fiscal');
for (const [n, v] of [['nombre', 'Ana'], ['apellido', 'López'], ['correo', 'ana@correo.com'], ['telefono', '3312345678'], ['recoge', 'Luis López']]) await p.locator(`input[name=${n}]`).fill(v);
if (await p.getByRole('button', { name: 'Continuar' }).isEnabled()) falla('El teléfono de quien recoge es obligatorio');
await p.locator('input[name=telefonoRecoge]').fill('3398765432');
await p.getByRole('button', { name: 'Continuar' }).click();
await p.waitForURL('**/checkout/envio');
await p.getByText('Recoger en tienda').first().waitFor();
paso('Todo para recoger: el paso 1 pide quién recoge y su teléfono (obligatorios), sin dirección ni datos fiscales');
await p.getByRole('button', { name: 'Continuar' }).click();
await p.waitForURL('**/checkout/pago');
await p.getByRole('button', { name: 'Otras formas de pago' }).click();
await p.getByRole('button', { name: /7-Eleven/ }).first().click();
await p.getByRole('button', { name: 'Confirmar' }).click();
await p.getByRole('button', { name: 'Continuar' }).click();
await p.waitForURL('**/checkout/confirmacion');
await p.getByText('Revisa tu pedido y confírmalo').waitFor();
await p.getByText(/Recoge: Luis López, tel\. 3398765432/).waitFor();
await p.getByText('Tienda de autoservicio').waitFor();
if (await p.getByText('Régimen fiscal').count()) falla('Sin "Requiero factura" no hay bloque de facturación');
paso('Confirmación: quién recoge, "Tienda de autoservicio" y sin bloque de facturación');
await p.getByRole('button', { name: 'Confirmar el pedido' }).click();
await p.waitForURL('**/checkout/gracias');
await p.getByText(/realizarlo en 7-Eleven/).waitFor();
if (await p.getByText(/Tu auto está por estrenar/).count()) falla('Gracias aún dice "Tu auto está por estrenar"');
paso('Gracias: nombra la tienda elegida (7-Eleven) y ya no dice "Tu auto está por estrenar"');

// 3) Invitado con C.P. sin existencias en el paso 1 → regresa al carrito con leyenda; fechas en el paso 2
p = await nueva();
await p.goto(B + '/producto/marcha');
await cerrarAviso(p);
await p.getByRole('button', { name: 'Añadir al carrito', exact: true }).click();
await alCarrito(p);
await comoInvitado(p);
await p.getByText('Requiero factura').click();
await p.locator('select[name=regimen]').waitFor();
for (const [n, v] of [['nombre', 'Ana'], ['apellido', 'López'], ['correo', 'ana@correo.com'], ['telefono', '3312345678'], ['calle', 'Av. Constitución'], ['numeroExterior', '100'], ['entreCalle1', 'A'], ['entreCalle2', 'B'], ['codigoPostal', '64000']])
  await p.locator(`input[name=${n}]`).fill(v);
await p.locator('select[name=colonia]').selectOption({ index: 1 });
if (await p.getByRole('button', { name: 'Continuar' }).isEnabled()) falla('Con "Requiero factura", régimen y uso del CFDI son obligatorios');
await p.locator('select[name=regimen]').selectOption({ index: 1 });
await p.locator('select[name=cfdi]').selectOption({ index: 1 });
await p.getByRole('button', { name: 'Continuar' }).click();
await p.waitForURL('**/carrito');
await p.getByRole('alert').filter({ hasText: /no tiene existencia para tu dirección de entrega/ }).waitFor();
paso('Invitado: un C.P. sin existencias en el paso 1 regresa al carrito con leyenda temporal (no se queda atorado)');
await p.getByRole('alert').filter({ hasText: /no tiene existencia/ }).waitFor({ state: 'detached', timeout: 12000 });
paso('La leyenda temporal se quita sola');
if (await p.getByRole('button', { name: 'Proceder al pago' }).first().isEnabled()) falla('Con artículos sin existencia no se puede pagar');
paso('Carrito: sin existencia bloquea el pago');

// 4) Cambio de C.P. desde la barra superior ajusta el carrito con leyenda; fechas del paso 2; login regresa al inicio
p = await nueva();
await p.goto(B + '/producto/marcha');
await cerrarAviso(p);
await p.getByRole('button', { name: 'Añadir al carrito', exact: true }).click();
await alCarrito(p);
await p.getByRole('button', { name: 'Entrega en' }).click();
await p.getByPlaceholder('Ingresa un código postal mexicano').fill('64000');
await p.getByRole('button', { name: 'Actualizar ubicación' }).click();
await p.getByRole('dialog', { name: 'Selecciona una tienda' }).waitFor();
await p.getByRole('alert').filter({ hasText: /Actualizamos tu carrito.*1 sin existencia/ }).waitFor();
paso('Barra superior: cambiar el C.P. ajusta el carrito y lo avisa con leyenda temporal');
await p.getByRole('dialog', { name: 'Selecciona una tienda' }).getByRole('button', { name: 'Cerrar' }).click();
await p.getByRole('button', { name: 'Entrega en' }).click();
await p.getByPlaceholder('Ingresa un código postal mexicano').fill('45138');
await p.getByRole('button', { name: 'Actualizar ubicación' }).click();
await p.getByRole('dialog', { name: 'Selecciona una tienda' }).getByRole('button', { name: 'Cerrar' }).click();
await comoInvitado(p);
for (const [n, v] of [['nombre', 'Ana'], ['apellido', 'López'], ['correo', 'ana@correo.com'], ['telefono', '3312345678'], ['calle', 'Av. Juárez'], ['numeroExterior', '120'], ['entreCalle1', 'A'], ['entreCalle2', 'B'], ['codigoPostal', '45138']])
  await p.locator(`input[name=${n}]`).fill(v);
await p.locator('select[name=colonia]').selectOption({ index: 1 });
await p.getByRole('button', { name: 'Continuar' }).click();
await p.waitForURL('**/checkout/envio');
const tiempos = await p.locator('p').filter({ hasText: /^Entrega (hoy|mañana|el |entre )/ }).allInnerTexts();
if (!tiempos.length) falla('Los encabezados de envío deben dar fechas');
console.log('   encabezados:', tiempos.join(' | '));
paso('Paso 2: los envíos dan fechas en días hábiles');
await p.getByRole('button', { name: 'Volver al carrito' }).click();
await p.waitForURL('**/carrito');
await p.getByRole('button', { name: 'Ingresar' }).click();
await p.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
await p.getByRole('button', { name: 'Iniciar sesión' }).click();
await p.waitForURL(B + '/');
paso('Iniciar sesión desde el carrito regresa a la página principal');

await browser.close();
if (errores.length) {
  console.log('Errores de consola:', errores);
  process.exit(1);
}
console.log('Revisión del flujo sin errores');
