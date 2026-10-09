// Tienda de otro estado (D57, reemplaza a D47): elegirla solo cambia dónde se recoge; la entrega no cambia y el
// cliente registrado conserva su dirección guardada. Uso: node tests/referencia/otro-estado-demo.mjs <salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-otro-estado';
fs.mkdirSync(OUT, { recursive: true });
const B = 'http://localhost:5179';
const browser = await chromium.launch();
const errores = [];
const ok = (t) => console.log('✓', t);
const pagina = async () => {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1100 } });
  p.on('pageerror', (e) => errores.push(e.message));
  await p.goto(B + '/busqueda');
  await p.getByRole('button', { name: 'No permitir nunca' }).click();
  await p.getByRole('status', { name: 'Cargando productos…' }).waitFor({ state: 'detached' });
  return p;
};
const entrega = async (p) => (await p.getByRole('button', { name: 'Entrega en' }).innerText()).replace(/\s+/g, ' ');
const miTienda = async (p) => (await p.getByRole('button', { name: 'Mi tienda' }).innerText()).match(/Autex[^\n]*/)?.[0];
const elegirEn = async (p, estado, captura) => {
  await p.getByRole('button', { name: 'Mi tienda' }).click();
  const panel = p.getByRole('dialog', { name: 'Selecciona una tienda' });
  await panel.getByLabel('Estado').selectOption(estado);
  if (await panel.getByText(/tu entrega cambia/).count()) throw new Error('La tienda de otro estado ya no debe avisar que la entrega cambia');
  if (captura) await p.screenshot({ path: `${OUT}/${captura}` });
  await panel.getByRole('button', { name: 'Seleccionar tienda' }).first().click();
  await p.getByRole('status', { name: 'Cambiando tu tienda' }).waitFor({ state: 'detached' });
};

let p = await pagina();
const antes = await entrega(p);
await elegirEn(p, 'Nuevo León', '1-tienda-otro-estado.png');
const despues = await entrega(p);
if (despues !== antes) throw new Error(`La entrega no debe cambiar (antes "${antes}", ahora "${despues}")`);
await p.screenshot({ path: `${OUT}/2-monterrey.png` });
ok(`Invitado: "Mi tienda" pasa a ${await miTienda(p)} y la entrega sigue en "${despues}"`);
await p.close();

p = await pagina();
await p.getByRole('button', { name: 'Ingresar' }).click();
await p.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
await p.getByRole('dialog', { name: 'Iniciar sesión' }).getByRole('button', { name: 'Iniciar sesión' }).click();
/* D57: al iniciar sesión se regresa a la página principal. */
await p.waitForURL(B + '/');
await p.getByRole('button', { name: 'Entrega en' }).getByText('Taller Chapalita').waitFor();
await elegirEn(p, 'Guanajuato');
const e = await entrega(p);
if (!e.includes('Taller Chapalita') || !e.includes('45040')) throw new Error(`Registrado: debe conservar su dirección guardada (está en ${e})`);
await p.screenshot({ path: `${OUT}/3-registrado-leon.png` });
ok(`Registrado: "Mi tienda" pasa a ${await miTienda(p)} y conserva "${e}"`);

await browser.close();
if (errores.length) console.log('ERRORES', errores);
console.log('ok', OUT);
