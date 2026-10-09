// Capturas del flujo de cliente no registrado: "¿Cómo deseas continuar?", formulario de invitado y "Tengo una
// cuenta Autex" (inicio de sesión → paso 2). Uso: node tests/referencia/invitado-demo.mjs <carpeta-salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-invitado';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errores = [];
const alCarrito = async () => {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1100 } });
  p.on('pageerror', (e) => errores.push(e.message));
  await p.goto('http://localhost:5179/busqueda');
  await p.getByRole('button', { name: 'No permitir nunca' }).click();
  await p.getByRole('button', { name: 'Agregar al carrito' }).first().click();
  await p.getByRole('button', { name: 'Ver todos los productos' }).click();
  await p.getByRole('button', { name: 'Proceder al pago' }).first().click();
  await p.getByRole('dialog', { name: '¿Cómo deseas continuar?' }).waitFor();
  await p.evaluate(() => document.fonts.ready);
  return p;
};
let p = await alCarrito();
await p.screenshot({ path: `${OUT}/1-como-continuar.png` });
await p.getByRole('radio', { name: 'Usuario invitado' }).click();
await p.getByRole('button', { name: 'Aceptar' }).click();
await p.waitForURL('**/checkout/datos');
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/2-formulario-invitado.png`, fullPage: true });
await p.close();

p = await alCarrito();
await p.getByRole('radio', { name: 'Tengo una cuenta Autex' }).click();
await p.getByRole('button', { name: 'Aceptar' }).click();
await p.getByRole('dialog', { name: 'Iniciar sesión' }).waitFor();
await p.screenshot({ path: `${OUT}/3-tengo-cuenta.png` });
await p.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
await p.getByRole('dialog', { name: 'Iniciar sesión' }).getByRole('button', { name: 'Iniciar sesión' }).click();
/* D57: al iniciar sesión se regresa a la página principal, también desde el carrito. */
await p.waitForURL('http://localhost:5179/');
console.log('Tengo una cuenta → ', p.url());
await browser.close();
if (errores.length) console.log('ERRORES', errores);
console.log('ok', OUT);
