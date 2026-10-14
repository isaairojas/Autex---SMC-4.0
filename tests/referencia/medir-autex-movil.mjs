// Mide el sitio real en celular (390×844) como invitado: estilos calculados de encabezado, menú, pie de página (con
// cada sección abierta), botón de WhatsApp, "Mis vehículos" e inicio de sesión, y guarda sus imágenes. Es la fuente de
// los valores de la vista móvil (no hay frames móviles en Figma). Solo lectura.
// Uso: node tests/referencia/medir-autex-movil.mjs [salida]
import { chromium } from 'playwright';
import fs from 'node:fs';
import { arbol, imagenes } from './medir-util.mjs';

const OUT = process.argv[2] ?? 'docs/autex-real/movil/medidas';
fs.mkdirSync(`${OUT}/imagenes`, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: 'es-MX',
  userAgent:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
});
const p = await ctx.newPage();
const inicio = async () => {
  await p.goto('https://www.autex.com.mx/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(3000);
};
const resultado = {};
await inicio();

// Encabezado (franja, fila del logo, buscador y "Búsqueda por vehículo")
resultado.encabezado = await arbol(p, { y: 0, alto: 290 });
resultado.imagenesEncabezado = await imagenes(p, OUT, 'encabezado', { y: 0, alto: 290 });

// Botón flotante de WhatsApp (el único elemento fijo de la página)
resultado.whatsapp = await p.evaluate(() => {
  const el = [...document.querySelectorAll('body *')].find((e) => getComputedStyle(e).position === 'fixed');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const svg = el.querySelector('svg');
  return {
    tag: el.tagName,
    caja: [r.left, r.top, r.width, r.height],
    estilos: { right: cs.right, bottom: cs.bottom, 'background-color': cs.backgroundColor, color: cs.color, 'font-size': cs.fontSize, 'border-radius': cs.borderRadius, 'box-shadow': cs.boxShadow, 'z-index': cs.zIndex, padding: cs.padding, display: cs.display },
    icono: svg ? { caja: [svg.getBoundingClientRect().width, svg.getBoundingClientRect().height], viewBox: svg.getAttribute('viewBox') } : null,
  };
});
const iconoWhatsapp = await p.evaluate(() => [...document.querySelectorAll('body *')].find((e) => getComputedStyle(e).position === 'fixed')?.querySelector('svg')?.outerHTML);
if (iconoWhatsapp) fs.writeFileSync(`${OUT}/imagenes/whatsapp-flotante.svg`, iconoWhatsapp);

// Pie de página: como se ve al cargar y con cada sección abierta
await p.locator('footer').scrollIntoViewIfNeeded();
await p.waitForTimeout(800);
resultado.pie = await arbol(p, { selector: 'footer', y: -100000, alto: 200000 });
resultado.imagenesPie = await imagenes(p, OUT, 'pie', { selector: 'footer', y: -100000, alto: 200000 });
await p.locator('footer').screenshot({ path: `${OUT}/pie.png` });
resultado.pieSecciones = {};
for (const seccion of ['Acerca de Autex', 'Ayuda', 'Descargables']) {
  await p.locator('footer').getByText(seccion, { exact: true }).filter({ visible: true }).first().click();
  await p.waitForTimeout(800);
  const n = seccion.toLowerCase().normalize('NFD').replace(/[^a-z]+/g, '-');
  resultado.pieSecciones[seccion] = await arbol(p, { selector: 'footer', y: -100000, alto: 200000 });
  await p.locator('footer').screenshot({ path: `${OUT}/pie-${n}.png` });
}

// Menú (hamburguesa)
await inicio();
const logo = await p.locator('a[href="/"]').first().boundingBox();
await p.mouse.click(29, logo.y + logo.height / 2);
await p.waitForTimeout(1500);
resultado.menu = await arbol(p, { y: 0, alto: 844 });
resultado.imagenesMenu = await imagenes(p, OUT, 'menu', { y: 0, alto: 120 });

// Mis vehículos (ventana)
await inicio();
await p.getByText('Mis vehículos').first().click();
await p.waitForTimeout(1500);
resultado.misVehiculos = await arbol(p, { y: 0, alto: 844 });
resultado.imagenesMisVehiculos = await imagenes(p, OUT, 'mis-vehiculos', { y: 160, alto: 520 });

// Inicio de sesión (en celular es una página)
await p.goto('https://www.autex.com.mx/autenticacion/login/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await p.waitForTimeout(2500);
resultado.login = await arbol(p, { y: 0, alto: 900 });
resultado.imagenesLogin = await imagenes(p, OUT, 'login', { y: 0, alto: 900 });

fs.writeFileSync(`${OUT}/medidas.json`, JSON.stringify(resultado, null, 1));
console.log(
  Object.entries(resultado)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.length : v ? 'ok' : '—'}`)
    .join(' | '),
);
await browser.close();
