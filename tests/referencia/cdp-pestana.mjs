// Solo lectura: captura la pestaña abierta del usuario (Chrome con depuración, puerto 9222) cuya URL contiene el
// texto indicado, sin navegar ni hacer clic. Guarda captura, texto y controles visibles.
// Uso: node tests/referencia/cdp-pestana.mjs <carpeta-salida> <texto-url>
import { chromium } from 'playwright';
import fs from 'node:fs';
const [OUT, FILTRO = 'autex.com.mx'] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.connectOverCDP('http://localhost:9222');
const pagina = browser.contexts().flatMap((c) => c.pages()).find((pg) => pg.url().includes(FILTRO));
if (!pagina) throw new Error('No encontré la pestaña');
await pagina.screenshot({ path: `${OUT}/pestana.png` });
await pagina.screenshot({ path: `${OUT}/pestana-completa.png`, fullPage: true }).catch(() => {});
fs.writeFileSync(`${OUT}/texto.txt`, await pagina.evaluate(() => document.body.innerText));
const dialogos = await pagina.evaluate(() =>
  [...document.querySelectorAll('[role=dialog], .ant-modal, [class*=modal], [class*=Modal]')]
    .filter((e) => e.offsetParent !== null || getComputedStyle(e).position === 'fixed')
    .map((e) => e.innerText.replace(/\s+/g, ' ').slice(0, 600)),
);
fs.writeFileSync(`${OUT}/dialogos.txt`, dialogos.join('\n---\n'));
console.log('URL', pagina.url());
console.log('DIALOGOS:\n' + dialogos.join('\n---\n'));
process.exit(0); // solo se desconecta
