// Capturas del panel "Ubicación de entrega": invitado (C.P.) y cliente registrado (direcciones guardadas).
// Uso: node tests/referencia/direcciones-demo.mjs <carpeta-salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-direcciones';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errores = [];
const p = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
p.on('pageerror', (e) => errores.push(e.message));
await p.goto('http://localhost:5179/');
await p.getByRole('button', { name: 'No permitir nunca' }).click();
await p.evaluate(() => document.fonts.ready);

// Invitado
await p.getByRole('button', { name: 'Entrega en' }).click();
await p.screenshot({ path: `${OUT}/1-invitado.png` });

// Registrado (inicia sesión desde el panel)
await p.getByRole('button', { name: 'Iniciar sesión' }).click();
await p.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
await p.getByRole('dialog', { name: 'Iniciar sesión' }).getByRole('button', { name: 'Iniciar sesión' }).click();
await p.getByText('Hola', { exact: true }).waitFor();
console.log('chip tras ingresar:', (await p.getByRole('button', { name: 'Entrega en' }).innerText()).replace(/\n/g, ' '));
await p.getByRole('button', { name: 'Entrega en' }).click();
await p.screenshot({ path: `${OUT}/2-registrado.png` });
await p.getByText('Cliente Monterrey').click();
await p.getByRole('dialog', { name: 'Selecciona una tienda' }).waitFor();
console.log('chip tras elegir:', (await p.getByRole('button', { name: 'Entrega en' }).innerText()).replace(/\n/g, ' '));
await p.screenshot({ path: `${OUT}/3-tiendas-direccion.png` });
await p.getByRole('button', { name: 'Entrega en' }).click();
await p.getByRole('button', { name: 'Agregar nueva dirección' }).click();
await p.getByPlaceholder('Nombre de la dirección (p. ej. Casa, Taller)').fill('Refaccionaria Puebla');
await p.getByPlaceholder('Calle y número').fill('Av. Juárez 2915');
await p.getByPlaceholder('Colonia').fill('La Paz');
await p.getByPlaceholder('Código postal', { exact: true }).fill('72160');
await p.screenshot({ path: `${OUT}/4-nueva-direccion.png` });
await p.getByRole('button', { name: 'Guardar dirección' }).click();
await p.getByRole('dialog', { name: 'Selecciona una tienda' }).waitFor();
console.log('chip tras agregar:', (await p.getByRole('button', { name: 'Entrega en' }).innerText()).replace(/\n/g, ' '));
await p.screenshot({ path: `${OUT}/5-tiendas-nueva.png` });
await browser.close();
if (errores.length) console.log('ERRORES', errores);
console.log('ok', OUT);
