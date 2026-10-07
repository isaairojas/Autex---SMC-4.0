// Extrae la lista pública de sucursales de autex.com.mx (solo lectura). Uso: CANAL=chrome node tests/referencia/sucursales-autex.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: process.env.CANAL || undefined });
const ctx = await browser.newContext({ locale: 'es-MX', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
const p = await ctx.newPage();
await p.goto('https://www.autex.com.mx/sucursales/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await p.waitForTimeout(3000);
const t = await p.evaluate(() => document.body.innerText);
console.log(t);
await browser.close();
