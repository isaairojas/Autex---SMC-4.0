// Cliente registrado en celular: con la sesión del usuario en el Chrome de depuración (puerto 9222) abre una pestaña
// en vista de celular (390×844) y captura inicio, menú, cuenta, carrito y el pago hasta donde se puede sin pagar:
// avanza con los datos guardados del cliente y se detiene antes de cualquier dato de tarjeta y del botón final.
// Si el carrito está vacío agrega 1 producto disponible y lo quita al terminar. No compra ni guarda cambios de la cuenta.
// Las capturas tienen datos reales del cliente: van a docs/autex-real/movil/registrado/ (ignorada por git).
// Uso: node tests/referencia/cdp-registrado-movil.mjs [salida]
import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT = process.argv[2] ?? 'docs/autex-real/movil/registrado';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.connectOverCDP('http://localhost:9222');
const ctx = browser.contexts()[0];
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await cdp.send('Emulation.setUserAgentOverride', {
  userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36',
});
await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
const salir = async (codigo = 0) => {
  await p.close().catch(() => {});
  process.exit(codigo); // solo se desconecta; no cierra el Chrome del usuario
};

const espera = (ms = 2000) => p.waitForTimeout(ms);
const foto = async (n, completa = false) => {
  await espera(1200);
  await p.screenshot({ path: `${OUT}/${n}.png`, fullPage: completa });
  console.log('📷', n, p.url());
};
const texto = async (n) => fs.writeFileSync(`${OUT}/${n}.txt`, await p.evaluate(() => document.body.innerText.replace(/\n{2,}/g, '\n')));
const pagina = async (n) => {
  await foto(n);
  await foto(`${n}-completa`, true);
  await texto(n);
};
const ir = async (ruta) => {
  await p.goto(ruta.startsWith('http') ? ruta : 'https://www.autex.com.mx' + ruta, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => console.log('timeout', ruta));
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
/** Clic en el elemento que está en (x, y) de la fila del logo del encabezado. */
const tocarEncabezado = async (x) => {
  const logo = await p.locator('a[href="/"]').first().boundingBox();
  await p.mouse.click(x, logo.y + logo.height / 2);
  await espera(2000);
};
const enlaces = () =>
  p.evaluate(() =>
    [...document.querySelectorAll('a[href]')]
      .filter((a) => a.offsetParent !== null)
      .map((a) => [a.innerText.trim().replace(/\s+/g, ' '), a.getAttribute('href')]),
  );

// 0) ¿Hay sesión?
await ir('/');
if (await p.getByText('Ingresar', { exact: true }).filter({ visible: true }).count()) {
  console.log('Sin sesión: inicia sesión en autex.com.mx en el Chrome de depuración y vuelve a correr el script.');
  await salir(1);
}

// 1) Inicio, menú y cuenta
await pagina('01-inicio');
await paso('menu', async () => {
  await tocarEncabezado(29);
  await foto('02-menu');
  await texto('02-menu');
  fs.writeFileSync(`${OUT}/02-menu-enlaces.txt`, (await enlaces()).map((e) => e.join(' | ')).join('\n'));
});
await ir('/');
await paso('cuenta', async () => {
  /* Con sesión, "Ingresar" se vuelve un ícono de cuenta y aparece una campana, ambos a la izquierda del carrito. */
  await tocarEncabezado(287);
  await foto('03-cuenta');
  await texto('03-cuenta');
  fs.writeFileSync(`${OUT}/03-cuenta-enlaces.txt`, (await enlaces()).map((e) => e.join(' | ')).join('\n'));
});
/* Opciones del menú de la cuenta (Mi perfil, Mis pedidos): son botones, no enlaces. */
for (const [opcion, n] of [
  ['Mi perfil', '03c-mi-perfil'],
  ['Mis pedidos', '03d-mis-pedidos'],
]) {
  await ir('/');
  await paso(n, async () => {
    await tocarEncabezado(287);
    await p.getByText(opcion, { exact: true }).filter({ visible: true }).first().click();
    await espera(4000);
    await pagina(n);
  });
}
await ir('/');
await paso('notificaciones', async () => {
  await tocarEncabezado(327);
  await foto('03b-notificaciones');
  await texto('03b-notificaciones');
});
await ir('/');
await paso('mis-vehiculos', async () => {
  await p.getByText('Mis vehículos').first().click();
  await foto('04-mis-vehiculos');
  await texto('04-mis-vehiculos');
});

// 2) Páginas de la cuenta (las que enlazan el menú y la cuenta)
const deCuenta = new Map();
for (const archivo of ['02-menu-enlaces.txt', '03-cuenta-enlaces.txt']) {
  if (!fs.existsSync(`${OUT}/${archivo}`)) continue;
  for (const linea of fs.readFileSync(`${OUT}/${archivo}`, 'utf8').split('\n')) {
    const [nombre, href] = linea.split(' | ');
    if (href && /configuracion|cuenta|perfil|pedido|direccion|favorito|lista/i.test(href)) deCuenta.set(href, nombre);
  }
}
let k = 5;
/** Número de captura con dos dígitos (05, 06, …). */
const num = () => String(k++).padStart(2, '0');
const actual = () => String(k - 1).padStart(2, '0');
for (const [href, nombre] of deCuenta) {
  const n = `${num()}-cuenta-${(nombre || href).toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  await paso(n, async () => {
    await ir(href);
    await pagina(n);
  });
}

// 3) Carrito: si está vacío se agrega 1 producto disponible (y se quita al final)
await ir('/carrito/');
let agregado = false;
if (await p.getByRole('button', { name: 'Proceder al pago' }).count()) console.log('El carrito ya tiene productos; se usan esos.');
else {
  await paso('agregar', async () => {
    await ir('/');
    const campo = p.locator('input[placeholder^="Buscar año"]:visible').first();
    await campo.click();
    await campo.pressSequentially('bujia', { delay: 60 });
    await campo.press('Enter');
    await espera(9000);
    await p.getByRole('button', { name: 'Añadir al carrito' }).first().click({ timeout: 15000 });
    await espera(3000);
    agregado = true;
  });
  await ir('/carrito/');
}
await pagina(`${num()}-carrito`);

// 4) Pago con los datos guardados del cliente, sin datos de tarjeta y sin el botón final
const continuar = async () => {
  await p.getByRole('button', { name: 'Continuar', exact: true }).last().click({ timeout: 10000 });
  await espera(6000);
};
const ok1 = await paso('proceder', async () => {
  await p.getByRole('button', { name: 'Proceder al pago' }).first().click();
  await espera(6000);
  await pagina(`${num()}-pago-paso1`);
});
const ok2 =
  ok1 &&
  (await paso('paso1', async () => {
    /* El registrado elige una de sus direcciones guardadas; sin elegirla, "Continuar" no se habilita. */
    fs.writeFileSync(
      `${OUT}/${actual()}-pago-paso1-controles.txt`,
      (await p.evaluate(() =>
        [...document.querySelectorAll('input, button, label, [role=radio]')]
          .filter((e) => e.getBoundingClientRect().width > 0)
          .map((e) => `${e.tagName} type="${e.getAttribute('type') ?? ''}" checked=${e.checked ?? ''} disabled=${e.disabled ?? ''} :: ${(e.innerText || e.value || '').trim().replace(/\s+/g, ' ').slice(0, 40)}`),
      )).join('\n'),
    );
    const habilitado = () => p.getByRole('button', { name: 'Continuar', exact: true }).last().isEnabled();
    const radio = p.locator('input[type=radio]').first();
    if (!(await habilitado()) && (await radio.count())) await radio.check({ force: true }).catch(() => radio.click({ force: true }));
    if (!(await habilitado())) await p.getByText('Selecciona una dirección').locator('xpath=following::*[normalize-space()][1]').click().catch(() => {});
    await espera(1500);
    await foto(`${actual()}-pago-paso1-direccion`);
    await continuar();
    await pagina(`${num()}-pago-paso2`);
  }));
const ok3 =
  ok2 &&
  (await paso('paso2', async () => {
    await continuar();
    await pagina(`${num()}-pago-paso3`);
  }));
if (ok3)
  await paso('paso3', async () => {
    /* Solo se avanza a Confirmación con una forma de pago que no pida datos de tarjeta. */
    const sinTarjeta = p.getByText(/pago en tienda|efectivo|oxxo|7-eleven|paynet|transferencia|cr[eé]dito apymsa/i).filter({ visible: true }).first();
    if (!(await sinTarjeta.count())) return console.log('Paso 3: solo hay tarjeta; aquí se detiene.');
    console.log('Paso 3: forma de pago sin tarjeta:', await sinTarjeta.innerText());
    await sinTarjeta.click();
    await espera(2500);
    await pagina(`${num()}-pago-paso3-sin-tarjeta`);
    await continuar();
    await pagina(`${num()}-pago-paso4`); // Confirmación: no se pulsa el botón final
  });

// 5) Quitar el producto agregado por el script
if (agregado)
  await paso('quitar', async () => {
    await ir('/carrito/');
    await p.getByText('Eliminar', { exact: true }).filter({ visible: true }).first().click({ timeout: 10000 });
    await espera(3000);
    console.log('Carrito restaurado:', (await p.getByRole('button', { name: 'Proceder al pago' }).count()) ? 'aún tiene productos' : 'vacío');
  });
await salir();
