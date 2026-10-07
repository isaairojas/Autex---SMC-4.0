// Solo lectura: en una pestaña nueva del Chrome del usuario (misma sesión/carrito) abre /carrito, pulsa "Proceder
// al pago" y recorre las dos opciones de "¿Cómo deseas continuar?" sin llenar ni enviar formularios.
// Uso: node tests/referencia/cdp-invitado.mjs <carpeta-salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.connectOverCDP('http://localhost:9222');
const p = await browser.contexts()[0].newPage();
await p.setViewportSize({ width: 1665, height: 975 });
const foto = async (n, completa = false) => {
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${OUT}/${n}.png`, fullPage: completa });
  fs.writeFileSync(`${OUT}/${n}.txt`, await p.evaluate(() => document.body.innerText));
  const controles = await p.evaluate(() =>
    [...document.querySelectorAll('input, select, textarea, button')]
      .filter((e) => e.offsetParent !== null)
      .map((e) => [e.tagName, e.getAttribute('type') ?? '', e.getAttribute('name') ?? '', e.getAttribute('placeholder') ?? '', (e.innerText || '').trim().slice(0, 50)].join(' | ')),
  );
  fs.writeFileSync(`${OUT}/${n}-controles.txt`, controles.join('\n'));
  console.log('captura', n, p.url());
};
const abrirModal = async () => {
  await p.goto('https://www.autex.com.mx/carrito/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(2000);
  await p.getByRole('button', { name: 'Proceder al pago' }).first().click();
  await p.getByText('¿Cómo deseas continuar?').first().waitFor();
};
try {
  // 1) Usuario invitado → Aceptar
  await abrirModal();
  await foto('1-modal');
  await p.getByText('Usuario invitado', { exact: true }).first().click();
  await foto('2-invitado-elegido');
  await p.getByRole('button', { name: 'Aceptar' }).first().click();
  await foto('3-invitado-siguiente', true);
  // 2) Tengo una cuenta Autex → Aceptar
  await abrirModal();
  await p.getByText('Tengo una cuenta Autex', { exact: true }).first().click();
  await p.getByRole('button', { name: 'Aceptar' }).first().click();
  await foto('4-cuenta-siguiente', true);
} catch (e) {
  console.log('ERROR', e.message);
  await p.screenshot({ path: `${OUT}/error.png` }).catch(() => {});
}
await p.close();
process.exit(0); // solo se desconecta; no cierra el Chrome del usuario
