// Captura de tarjetas con las imágenes nuevas y el aviso al superar la existencia en línea.
// Uso: node tests/referencia/cantidad-demo.mjs <salida.png>
import { chromium } from 'playwright';
const OUT = process.argv[2] ?? 'cantidad.png';
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
await p.goto('http://localhost:5179/busqueda');
await p.getByRole('button', { name: 'No permitir nunca' }).click();
await p.getByRole('status', { name: 'Cargando productos…' }).waitFor({ state: 'detached' });
const cant = p.getByLabel('Cantidad de Alternador 12V 150A alto rendimiento Tecnofuel');
await cant.fill('50');
await cant.press('Enter');
await p.evaluate(() => document.fonts.ready);
await p.getByRole('button', { name: 'Cinta aislante de vinil negra 19 mm x 18 m TUK 320' }).first().scrollIntoViewIfNeeded();
await p.screenshot({ path: OUT, fullPage: true });
await browser.close();
console.log('ok', OUT);
