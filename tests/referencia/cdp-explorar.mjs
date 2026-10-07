// Solo lectura: se conecta al Chrome del usuario (puerto 9222) y lista los enlaces de la cuenta en autex.com.mx.
// Uso: node tests/referencia/cdp-explorar.mjs <carpeta-salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'docs/autex-real/sesion';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0];
const p = await ctx.newPage();
await p.setViewportSize({ width: 1665, height: 975 });
await p.goto('https://www.autex.com.mx/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await p.screenshot({ path: `${OUT}/home-sesion.png` });
const enlaces = await p.$$eval('a', (as) => [...new Set(as.map((a) => `${a.innerText.trim().replace(/\s+/g, ' ')} | ${a.href}`))]);
fs.writeFileSync(`${OUT}/enlaces.txt`, enlaces.join('\n'));
const header = await p.$eval('header', (h) => h.innerText).catch(() => '(sin header)');
console.log('HEADER:\n' + header);
console.log('ENLACES:\n' + enlaces.filter((e) => e.includes('autex.com.mx')).join('\n'));
await p.close();
process.exit(0); // solo desconecta; no cierra el Chrome del usuario
