// Solo lectura: captura el flujo "Mis vehículos" y el buscador por vehículo de autex.com.mx (sin sesión).
// Uso: node tests/referencia/vehiculos-autex.mjs <carpeta-salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'docs/autex-real/vehiculos';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({
  viewport: { width: 1665, height: 975 },
  locale: 'es-MX',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
});
const p = await ctx.newPage();
const texto = async (n) => fs.writeFileSync(`${OUT}/${n}.txt`, await p.evaluate(() => document.body.innerText));
const foto = async (n) => {
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${OUT}/${n}.png` });
  console.log('captura', n);
};
await p.goto('https://www.autex.com.mx/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await p.waitForTimeout(2000);
await foto('0-inicio');

// 1) Mis vehículos (encabezado)
await p.getByText(/Mis veh[ií]culos/).first().click();
await foto('1-mis-vehiculos');
await texto('1-mis-vehiculos');
// Lista de controles visibles del diálogo
const controles = await p.evaluate(() =>
  [...document.querySelectorAll('[role=dialog] *, .modal *, [class*=Modal] *, [class*=drawer] *, [class*=Drawer] *')]
    .filter((e) => e.children.length === 0 && e.textContent.trim())
    .map((e) => `${e.tagName} ${e.className?.toString().slice(0, 60)} :: ${e.textContent.trim().slice(0, 80)}`)
    .slice(0, 120),
);
fs.writeFileSync(`${OUT}/1-controles.txt`, controles.join('\n'));
await p.keyboard.press('Escape');
await p.waitForTimeout(800);

// 2) Buscador por vehículo de la página de inicio: año → marca → modelo → motor
await p.goto('https://www.autex.com.mx/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await p.waitForTimeout(2000);
const selects = await p.$$('select');
console.log('selects', selects.length);
const opciones = async (i) => p.$$eval('select', (s, i) => [...s[i].options].map((o) => o.textContent.trim()), i);
fs.writeFileSync(`${OUT}/2-anios.txt`, (await opciones(0)).join('\n'));
await p.locator('select').nth(0).selectOption({ label: '2014' });
await p.waitForTimeout(2500);
fs.writeFileSync(`${OUT}/2-marcas.txt`, (await opciones(1)).join('\n'));
await foto('2-anio');
const marcas = await opciones(1);
const marca = marcas.find((m) => /chevrolet/i.test(m)) ?? marcas[1];
await p.locator('select').nth(1).selectOption({ label: marca });
await p.waitForTimeout(2500);
fs.writeFileSync(`${OUT}/2-modelos.txt`, (await opciones(2)).join('\n'));
const modelos = await opciones(2);
await p.locator('select').nth(2).selectOption({ label: modelos.find((m) => /aveo/i.test(m)) ?? modelos[1] });
await p.waitForTimeout(2500);
fs.writeFileSync(`${OUT}/2-motores.txt`, (await opciones(3)).join('\n'));
await foto('3-modelo');
await p.locator('header, body').first().screenshot({ path: `${OUT}/3-encabezado.png`, clip: { x: 0, y: 0, width: 1665, height: 240 } }).catch(() => {});
// Buscar
await p.locator('button:has(svg), button').filter({ hasText: '' }).first();
const botones = await p.$$eval('button', (b) => b.map((x) => x.getAttribute('aria-label') || x.textContent.trim()).filter(Boolean).slice(0, 60));
fs.writeFileSync(`${OUT}/3-botones.txt`, botones.join('\n'));
await p.evaluate(() => {
  const s = document.querySelectorAll('select')[3];
  const b = s?.closest('div')?.parentElement?.parentElement?.querySelector('button');
  b?.click();
});
await p.waitForTimeout(4000);
await foto('4-resultado');
await texto('4-resultado');
console.log('url', p.url());

// 3) Mis vehículos después de buscar
await p.getByText(/Mis veh[ií]culos|Buscando para/).first().click().catch(() => {});
await foto('5-mis-vehiculos-despues');
await texto('5-mis-vehiculos-despues');
await browser.close();
