// Captura una ruta a 1920 px de ancho: node tests/visual/shot.mjs <ruta> <salida> [alto]
import { chromium } from 'playwright';
const [, , ruta, out, alto = '1200'] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: +alto } });
await p.goto(`${process.env.BASE ?? 'http://localhost:5179'}/${ruta.replace(/^\//, '')}`, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(400);
await p.screenshot({ path: out, fullPage: true });
await b.close();
