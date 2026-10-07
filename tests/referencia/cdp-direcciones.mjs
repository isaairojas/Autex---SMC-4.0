// Solo lectura: con la sesión del usuario en el Chrome de depuración (puerto 9222) captura la gestión de direcciones
// de autex.com.mx: lista, formulario "Agregar dirección" (sin guardar) y el encabezado con sesión.
// Las capturas tienen datos reales del cliente: guardarlas fuera del repositorio.
// Uso: node tests/referencia/cdp-direcciones.mjs <carpeta-salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2];
if (!OUT) throw new Error('Indica una carpeta de salida fuera del repositorio');
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0];
const p = await ctx.newPage();
await p.setViewportSize({ width: 1665, height: 975 });
const foto = async (n, completa = false) => {
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}/${n}.png`, fullPage: completa });
  fs.writeFileSync(`${OUT}/${n}.txt`, await p.evaluate(() => document.body.innerText));
  console.log('captura', n);
};
const controles = async (n) => {
  const c = await p.evaluate(() =>
    [...document.querySelectorAll('input, select, textarea, button, a[href]')]
      .filter((e) => e.offsetParent !== null)
      .map((e) => [e.tagName, e.getAttribute('type') ?? '', e.getAttribute('name') ?? '', e.getAttribute('placeholder') ?? '', e.getAttribute('aria-label') ?? '', (e.innerText || e.value || '').trim().slice(0, 60)].join(' | ')),
  );
  fs.writeFileSync(`${OUT}/${n}-controles.txt`, c.join('\n'));
};

await p.goto('https://www.autex.com.mx/configuracion/direcciones/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await foto('1-direcciones', true);
await controles('1-direcciones');

// Abrir el formulario de alta (no se guarda nada)
const agregar = p.getByText(/Agregar (nueva )?direcci[oó]n|Nueva direcci[oó]n|Añadir direcci[oó]n/i).first();
if (await agregar.count()) {
  await agregar.click();
  await foto('2-agregar-direccion', true);
  await controles('2-agregar-direccion');
} else console.log('No se encontró el botón de agregar dirección');

// Encabezado con sesión: chip de ubicación / entrega
await p.goto('https://www.autex.com.mx/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await foto('3-inicio-sesion');
await controles('3-inicio-sesion');
await p.close();
process.exit(0); // solo se desconecta; no cierra el Chrome del usuario
