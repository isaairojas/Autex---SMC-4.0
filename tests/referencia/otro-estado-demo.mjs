// Tienda de otro estado (D47): al elegirla, la entrega pasa al C.P. predeterminado de ese estado (también para el
// cliente registrado, que deja de usar su dirección guardada). Uso: node tests/referencia/otro-estado-demo.mjs <salida>
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
const entrega = (p) => p.getByRole('button', { name: 'Entrega en' }).innerText();
const elegirEn = async (p, estado, captura) => {
  await p.getByRole('button', { name: 'Mi tienda' }).click();
  const panel = p.getByRole('dialog', { name: 'Selecciona una tienda' });
  await panel.getByLabel('Estado').selectOption(estado);
  const aviso = (await panel.getByText(/Al elegirla, tu entrega cambia a C\.P\./).first().innerText()).trim();
  if (captura) await p.screenshot({ path: `${OUT}/${captura}` });
  await panel.getByRole('button', { name: 'Seleccionar tienda' }).first().click();
  await p.getByRole('status', { name: 'Cambiando tu tienda y tu C.P. de entrega' }).waitFor();
  await p.getByRole('status', { name: 'Cambiando tu tienda y tu C.P. de entrega' }).waitFor({ state: 'detached' });
  return aviso;
};

let p = await pagina();
const antes = await entrega(p);
const aviso = await elegirEn(p, 'Nuevo León', '1-aviso-otro-estado.png');
if (!(await entrega(p)).includes('64000')) throw new Error(`La entrega debía pasar a 64000 (está en ${await entrega(p)})`);
const tienda = (await p.getByRole('button', { name: 'Mi tienda' }).innerText()).match(/Autex[^\n]*/)?.[0];
await p.screenshot({ path: `${OUT}/2-monterrey.png` });
ok(`Invitado: "${aviso}" → entrega ${antes.replace(/\s+/g, ' ')} → 64000, ${tienda}`);
await p.getByRole('button', { name: 'Mi tienda' }).click();
const panel = p.getByRole('dialog', { name: 'Selecciona una tienda' });
await panel.getByRole('button', { name: 'Seleccionar tienda' }).first().click();
await p.getByRole('status', { name: 'Cambiando tu tienda' }).waitFor({ state: 'detached' });
if (!(await entrega(p)).includes('64000')) throw new Error('Una tienda del mismo estado no debe cambiar el C.P.');
ok('Tienda del mismo estado: el C.P. de entrega no cambia');
await p.close();

p = await pagina();
await p.getByRole('button', { name: 'Ingresar' }).click();
await p.getByPlaceholder('Ingresa tu correo electrónico').fill('ernesto@empresa.com.mx');
await p.getByPlaceholder('Ingresa tu contraseña').fill('demo1234');
await p.getByRole('button', { name: 'Iniciar sesión' }).click();
await p.getByRole('button', { name: 'Entrega en' }).getByText('Taller Chapalita').waitFor();
await elegirEn(p, 'Guanajuato');
const e = await entrega(p);
if (!e.includes('37530') || e.includes('Taller Chapalita')) throw new Error(`Registrado: la entrega debía pasar a 37530 sin la dirección guardada (está en ${e})`);
await p.screenshot({ path: `${OUT}/3-registrado-leon.png` });
ok(`Registrado: de "Taller Chapalita" (45040) a ${e.replace(/\s+/g, ' ')} al elegir una tienda de Guanajuato`);

await browser.close();
if (errores.length) console.log('ERRORES', errores);
console.log('ok', OUT);
