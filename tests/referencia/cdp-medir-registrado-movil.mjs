// Mide el encabezado y el menú de autex.com.mx en celular con sesión iniciada (ícono de cuenta, campana, burbuja del
// carrito, menú de la cuenta y "Hola, nombre" del menú), en una pestaña nueva del Chrome de depuración del usuario
// (puerto 9222). Solo lectura. Tiene el nombre del cliente: se guarda en docs/autex-real/movil/registrado/medidas
// (ignorada por git). Uso: node tests/referencia/cdp-medir-registrado-movil.mjs [salida]
import { chromium } from 'playwright';
import fs from 'node:fs';
import { arbol, imagenes } from './medir-util.mjs';

const OUT = process.argv[2] ?? 'docs/autex-real/movil/registrado/medidas';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0];
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await cdp.send('Emulation.setUserAgentOverride', {
  userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36',
});
await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
const inicio = async () => {
  await p.goto('https://www.autex.com.mx/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(3000);
};
const tocarEncabezado = async (x) => {
  const logo = await p.locator('a[href="/"]').first().boundingBox();
  await p.mouse.click(x, logo.y + logo.height / 2);
  await p.waitForTimeout(1500);
};
const resultado = {};
await inicio();
if (await p.getByText('Ingresar', { exact: true }).filter({ visible: true }).count()) {
  console.log('Sin sesión: inicia sesión en autex.com.mx en el Chrome de depuración.');
  await p.close();
  process.exit(1);
}
resultado.encabezado = await arbol(p, { y: 0, alto: 230 });
resultado.imagenesEncabezado = await imagenes(p, OUT, 'encabezado', { y: 80, alto: 100 });
await tocarEncabezado(287);
resultado.cuenta = await arbol(p, { y: 100, alto: 200 });
await inicio();
await tocarEncabezado(29);
resultado.menu = await arbol(p, { y: 0, alto: 844 });
resultado.imagenesMenu = await imagenes(p, OUT, 'menu', { y: 0, alto: 140 });
fs.writeFileSync(`${OUT}/medidas.json`, JSON.stringify(resultado, null, 1));
console.log(Object.entries(resultado).map(([k, v]) => `${k}: ${v.length}`).join(' | '));
await p.close();
process.exit(0); // solo se desconecta; no cierra el Chrome del usuario
