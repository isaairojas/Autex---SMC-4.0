// Capturas del paso 2 "Método de envío" para cliente registrado: dirección de entrega, envíos múltiples,
// tooltip y modal "Cambiar dirección de entrega". Uso: node tests/referencia/envio-demo.mjs <carpeta-salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-envio';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errores = [];
const p = await browser.newPage({ viewport: { width: 1920, height: 1200 } });
p.on('pageerror', (e) => errores.push(e.message));
await p.goto('http://localhost:5179/busqueda');
await p.getByRole('button', { name: 'No permitir nunca' }).click();
await p.getByRole('button', { name: 'Ingresar' }).click();
await p.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
await p.getByRole('dialog', { name: 'Iniciar sesión' }).getByRole('button', { name: 'Iniciar sesión' }).click();
const mini = p.getByRole('dialog', { name: 'Mi carrito' });
for (const i of [0, 1, 4]) {
  await p.getByRole('button', { name: 'Agregar al carrito' }).nth(i).click(); // inyector, cuerpo, alternador
  await mini.getByRole('button', { name: 'Cerrar' }).click();
}
await p.getByRole('button', { name: 'Agregar al carrito' }).nth(0).click();
await p.getByRole('button', { name: 'Ver todos los productos' }).click();
await p.getByRole('button', { name: 'Proceder al pago' }).first().click();
await p.waitForURL('**/checkout/envio');
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: `${OUT}/1-envio.png`, fullPage: true });
await p.getByRole('button', { name: /Envío 1/ }).click();
await p.getByRole('button', { name: /Envío 2/ }).click();
await p.screenshot({ path: `${OUT}/2-envios-abiertos.png`, fullPage: true });
await p.getByRole('button', { name: 'Cambiar dirección de entrega' }).hover();
await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}/3-tooltip.png`, fullPage: true });
await p.getByRole('button', { name: 'Cambiar dirección de entrega' }).click();
await p.screenshot({ path: `${OUT}/4-cambiar.png`, fullPage: true });
await browser.close();
if (errores.length) console.log('ERRORES', errores);
console.log('ok', OUT);
