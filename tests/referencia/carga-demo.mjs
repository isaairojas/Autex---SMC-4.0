// Captura de una ventana de carga del sitio (cambio de C.P.). Uso: node tests/referencia/carga-demo.mjs <salida.png>
import { chromium } from 'playwright';
const OUT = process.argv[2] ?? 'carga.png';
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
await p.goto('http://localhost:5179/');
await p.getByRole('button', { name: 'Cerrar aviso de ubicación' }).click();
await p.getByRole('button', { name: 'Elegir tienda manualmente' }).click();
await p.getByPlaceholder('Ingresa un código postal mexicano').fill('64000');
await p.getByRole('button', { name: 'Actualizar ubicación' }).click();
await p.getByRole('status', { name: 'Actualizando tu ubicación' }).waitFor();
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: OUT });
await browser.close();
console.log('ok', OUT);
