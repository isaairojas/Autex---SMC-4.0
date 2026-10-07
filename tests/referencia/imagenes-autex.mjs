// Solo lectura: busca productos en autex.com.mx y guarda la imagen (400×328) y el texto de los primeros resultados.
// Las imágenes del sitio son blob:, así que se captura cada <img>. Uso:
// node tests/referencia/imagenes-autex.mjs <carpeta-salida> "término 1" "término 2" ...
import { chromium } from 'playwright';
import fs from 'node:fs';
const [OUT, ...TERMINOS] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({
  viewport: { width: 1665, height: 975 },
  locale: 'es-MX',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
});
const p = await ctx.newPage();
for (const t of TERMINOS) {
  await p.goto('https://www.autex.com.mx/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  const campo = p.locator('input[placeholder^="Buscar año"]:visible').first();
  await campo.click();
  await campo.pressSequentially(t, { delay: 40 });
  await campo.press('Enter');
  await p.waitForTimeout(8000);
  const imgs = p.locator('img[src^="blob:"]');
  const n = await imgs.count();
  let k = 0;
  for (let i = 0; i < n && k < 4; i++) {
    const img = imgs.nth(i);
    if ((await img.evaluate((e) => e.naturalWidth)) < 300) continue;
    const texto = await img.evaluate((e) => {
      let c = e.parentElement;
      for (let j = 0; j < 8 && c && !/SKU #/.test(c.innerText); j++) c = c.parentElement;
      return (c?.innerText ?? '').replace(/\s+/g, ' ').slice(0, 120);
    });
    const archivo = `${OUT}/${t.replace(/\W+/g, '-')}-${++k}.png`;
    await img.screenshot({ path: archivo });
    console.log(archivo.split('/').pop(), '|', texto);
  }
}
await browser.close();
