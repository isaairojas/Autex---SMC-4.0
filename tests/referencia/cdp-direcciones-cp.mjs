// Solo lectura: en el formulario "Nueva dirección" de autex.com.mx escribe un C.P. para ver cómo se llenan colonia,
// ciudad y estado. NO pulsa "Guardar". También abre el menú de la cuenta. Capturas fuera del repositorio.
// Uso: node tests/referencia/cdp-direcciones-cp.mjs <carpeta-salida> [cp]
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2];
const CP = process.argv[3] ?? '45138';
if (!OUT) throw new Error('Indica una carpeta de salida fuera del repositorio');
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.connectOverCDP('http://localhost:9222');
const p = await browser.contexts()[0].newPage();
await p.setViewportSize({ width: 1665, height: 975 });
const foto = async (n, completa = false) => {
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}/${n}.png`, fullPage: completa });
  console.log('captura', n);
};
await p.goto('https://www.autex.com.mx/configuracion/direcciones/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await p.getByText('Nueva dirección', { exact: true }).first().click();
await p.locator('input[name=codigoPostal]').fill(CP);
await p.locator('input[name=codigoPostal]').blur();
await p.waitForTimeout(3000);
await foto('4-cp-escrito', true);
await p.getByPlaceholder(/colonia/i).click().catch(() => {});
await foto('5-colonias', true);
const opciones = await p.$$eval('[role=option], [role=listbox] li, .MuiAutocomplete-option', (o) => o.map((x) => x.textContent.trim()));
fs.writeFileSync(`${OUT}/5-colonias.txt`, opciones.join('\n'));
console.log('colonias', opciones.length, opciones.slice(0, 5));
const valores = await p.$$eval('input', (i) => i.filter((x) => x.offsetParent).map((x) => `${x.placeholder}: ${x.value} ${x.disabled ? '(deshabilitado)' : ''}`));
fs.writeFileSync(`${OUT}/5-valores.txt`, valores.join('\n'));
// Validaciones visibles: tocar "Guardar" NO: solo se leen los mensajes al salir de los campos vacíos
await p.locator('input[name=nombreDireccion]').focus();
await p.locator('input[name=calle]').focus();
await p.keyboard.press('Escape');
await foto('6-validaciones', true);
// Menú de la cuenta
await p.goto('https://www.autex.com.mx/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await p.getByText('Hola', { exact: true }).first().click().catch(() => {});
await foto('7-menu-cuenta');
fs.writeFileSync(`${OUT}/7-menu-cuenta.txt`, await p.evaluate(() => document.body.innerText.slice(0, 1500)));
// Sucursales con sesión (selector de tienda del encabezado)
await p.keyboard.press('Escape');
await p.getByText('Sucursales', { exact: true }).first().click().catch(() => {});
await foto('8-sucursales-encabezado');
await p.close();
process.exit(0);
