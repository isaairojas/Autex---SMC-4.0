// Capturas de referencia de autex.com.mx en celular (390×844, Chrome con emulación móvil), cliente invitado.
// Público: no inicia sesión ni compra; agrega 1 producto disponible al carrito (carrito anónimo).
// PAGO=1: además avanza como invitado con datos ficticios hasta el paso 3 (Método de pago) y se detiene ahí: el sitio
// genera un número de pedido al entrar al pago (queda sin pagar) y para invitado solo ofrece tarjeta, que no se llena.
// Requiere Chrome instalado (el sitio bloquea el Chromium de Playwright).
// Uso: node tests/referencia/capturar-autex-movil.mjs [salida]   ·   con pago: PAGO=1 node tests/referencia/capturar-autex-movil.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT = process.argv[2] ?? 'docs/autex-real/movil';
fs.mkdirSync(OUT, { recursive: true });
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
const espera = (ms = 2000) => p.waitForTimeout(ms);
const foto = async (n, completa = false) => {
  await espera(1200);
  await p.screenshot({ path: `${OUT}/${n}.png`, fullPage: completa });
  console.log('📷', n, p.url());
};
const texto = async (n) => fs.writeFileSync(`${OUT}/${n}.txt`, await p.evaluate(() => document.body.innerText.replace(/\n{2,}/g, '\n')));
/** Captura de la pantalla, de la página completa y su texto visible. */
const pagina = async (n) => {
  await foto(n);
  await foto(`${n}-completa`, true);
  await texto(n);
};
const ir = async (ruta) => {
  await p.goto('https://www.autex.com.mx' + ruta, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => console.log('timeout', ruta));
  await espera(2500);
};
const paso = async (n, f) => {
  try {
    await f();
    return true;
  } catch (e) {
    console.log('✗', n, e.message.split('\n')[0].slice(0, 160));
    await foto(`error-${n}`).catch(() => {});
    return false;
  }
};

// 1) Encabezado, menú y paneles
await ir('/');
await pagina('01-inicio');
await paso('menu', async () => {
  /* El menú (hamburguesa) no es <button>: es el primer elemento a la izquierda del logo. */
  const logo = await p.locator('a[href="/"]').first().boundingBox();
  await p.mouse.click(29, logo.y + logo.height / 2);
  await foto('02-menu');
});
await ir('/');
await paso('especialidades', async () => {
  await p.getByRole('button', { name: 'Especialidades' }).first().click();
  await foto('03-especialidades');
});
await ir('/');
await paso('vehiculo', async () => {
  await p.getByText('Búsqueda por vehículo').first().click();
  await foto('04-busqueda-vehiculo');
});
await ir('/');
await paso('mis-vehiculos', async () => {
  await p.getByText('Mis vehículos').first().click();
  await foto('05-mis-vehiculos');
  await texto('05-mis-vehiculos');
});
await ir('/');
await paso('ingresar', async () => {
  await p.getByText('Ingresar', { exact: true }).first().click();
  await espera(2500);
  await pagina('06-ingresar');
});

// 2) Páginas del sitio
for (const [n, ruta] of [
  ['07-carrito-vacio', '/carrito/'],
  ['08-catalogo', '/catalogo/'],
  ['09-marcas', '/busqueda-marca/'],
  ['10-promociones', '/promociones/'],
  ['11-sucursales', '/sucursales/'],
  ['12-como-comprar', '/como-comprar/'],
]) {
  await ir(ruta);
  await pagina(n);
}

// 3) Búsqueda, filtros, agregar, detalle y carrito
const buscar = async () => {
  await ir('/');
  const campo = p.locator('input[placeholder^="Buscar año"]:visible').first();
  await campo.click();
  await campo.pressSequentially('bujia', { delay: 60 });
  await campo.press('Enter');
  await espera(9000);
};
await buscar();
await pagina('13-resultados');
await paso('filtros', async () => {
  await p.getByText('Filtros', { exact: true }).first().click();
  await foto('14-filtros');
  await texto('14-filtros');
});
await buscar();
await paso('vista-lista', async () => {
  const r = await p.getByText('Relevancia').first().boundingBox();
  await p.mouse.click(373, r.y + r.height / 2);
  await foto('15-vista-lista');
});
await buscar();
/* Tarjeta del primer producto disponible: la que tiene "Añadir al carrito". */
const tarjeta = () => p.getByRole('button', { name: 'Añadir al carrito' }).first().locator('xpath=ancestor::*[.//img][1]');
await paso('agregar', async () => {
  await p.getByRole('button', { name: 'Añadir al carrito' }).first().click({ timeout: 15000 });
  await foto('16-agregado');
  await texto('16-agregado');
});
await buscar();
await paso('detalle', async () => {
  /* Las imágenes cargan tarde (blob:); si la de la tarjeta no aparece, se abre con el nombre del producto. */
  const imagen = tarjeta().locator('img').first();
  if (await imagen.waitFor({ state: 'visible', timeout: 25000 }).then(() => true, () => false)) await imagen.click();
  else {
    const nombre = await p.getByRole('button', { name: 'Añadir al carrito' }).first().evaluate((b) => {
      let c = b;
      for (let k = 0; k < 8 && c && !/SKU #/.test(c.innerText); k++) c = c.parentElement;
      const lineas = (c?.innerText ?? '').split('\n').map((s) => s.trim()).filter(Boolean);
      return lineas[lineas.findIndex((l) => /^SKU #/.test(l)) + 1];
    });
    await p.getByText(nombre, { exact: true }).filter({ visible: true }).first().click();
  }
  await p.waitForURL((u) => !u.pathname.startsWith('/busqueda'), { timeout: 20000 });
  await espera(5000);
  await pagina('17-detalle');
});
await ir('/carrito/');
await espera(2000);
await pagina('18-carrito');
await paso('como-continuar', async () => {
  await p.getByRole('button', { name: 'Proceder al pago' }).first().click();
  await espera(2000);
  await foto('19-como-continuar');
  await texto('19-como-continuar');
});

// 4) PAGO=1: invitado con datos ficticios hasta el paso 3 (sin tarjeta, sin pagar)
if (process.env.PAGO === '1') {
  const continuar = async () => {
    await p.getByRole('button', { name: 'Continuar', exact: true }).last().click({ timeout: 10000 });
    await espera(6000);
  };
  const ok1 = await paso('paso1', async () => {
    await p.getByText('Usuario invitado', { exact: true }).click();
    await p.getByRole('button', { name: 'Aceptar', exact: true }).click();
    await espera(6000);
    await pagina('20-paso1-vacio');
    const ficticios = {
      nombre: 'Prueba',
      apellido: 'Demo Autex',
      correoElectronico: 'prueba.demo@example.com',
      telefono: '3312345678',
      calle: 'Av. Prueba',
      numeroExterior: '100',
      referencia1: 'Calle A',
      referencia2: 'Calle B',
      codigoPostal: '45138',
    };
    for (const [campo, valor] of Object.entries(ficticios)) {
      const el = p.locator(`input[name="${campo}"]`);
      await el.click();
      await el.pressSequentially(valor, { delay: 25 });
    }
    await p.locator('input[name="codigoPostal"]').press('Tab');
    await espera(4000);
    await p.locator('input[placeholder*="colonia" i]').first().click();
    await espera(1500);
    await p.getByRole('option').first().click({ timeout: 8000 });
    await espera(2500);
    await pagina('21-paso1-lleno');
    await continuar();
  });
  const ok2 =
    ok1 &&
    (await paso('paso2', async () => {
      await pagina('22-paso2');
      await continuar();
    }));
  /* Paso 3: para invitado solo hay tarjeta; aquí se detiene (no se escriben datos de tarjeta ni se paga). */
  if (ok2) await paso('paso3', () => pagina('23-paso3'));
}
await browser.close();
