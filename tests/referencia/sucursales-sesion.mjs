// Captura /sucursales de la demo con sesión iniciada y ubicación en Guadalajara (C.P. 44400).
// Uso: node tests/referencia/sucursales-sesion.mjs <salida.png>
import { chromium } from 'playwright';
const OUT = process.argv[2] ?? 'sucursales-sesion.png';
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1665, height: 975 } });
await p.goto('http://localhost:5179/busqueda');
await p.getByRole('button', { name: 'Ingresar' }).click();
await p.getByPlaceholder('Ingresa tu correo electrónico').fill('isai@autex.com.mx');
await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
await p.getByRole('button', { name: 'Iniciar sesión' }).click();
await p.getByRole('button', { name: 'Elige tu ubicación' }).click();
await p.getByText('44400 · Guadalajara').click();
await p.getByRole('button', { name: 'Confirmar' }).click();
await p.getByRole('link', { name: 'Localiza tu tienda' }).click();
await p.waitForURL('**/sucursales');
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: OUT });
await browser.close();
console.log('ok', OUT);
