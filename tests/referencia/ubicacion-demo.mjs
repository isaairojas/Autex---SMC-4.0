// Capturas del flujo de ubicación y vehículo de la demo (aviso simulado del navegador → "Elige una tienda" → C.P. →
// tiendas del estado; permitir ubicación; "Mis vehículos").
// Uso: node tests/referencia/ubicacion-demo.mjs <carpeta-salida>
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'capturas-ubicacion';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const errores = [];
const nueva = async () => {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
  p.on('pageerror', (e) => errores.push(e.message));
  await p.goto('http://localhost:5179/');
  await p.getByRole('dialog', { name: 'www.autex.com.mx quiere' }).waitFor();
  await p.evaluate(() => document.fonts.ready);
  return p;
};

// 1) Cerrar el aviso (X) → aviso de Autex → elegir manualmente (C.P. primero) → tiendas del estado
let p = await nueva();
await p.screenshot({ path: `${OUT}/1-permiso-navegador.png` });
await p.getByRole('button', { name: 'Cerrar aviso de ubicación' }).click();
await p.getByRole('dialog', { name: 'Elige una tienda' }).waitFor();
await p.screenshot({ path: `${OUT}/2-aviso-autex.png` });
await p.getByRole('button', { name: 'Elegir tienda manualmente' }).click();
await p.getByRole('dialog', { name: 'Ubicación de entrega' }).waitFor();
await p.screenshot({ path: `${OUT}/3-entrega.png` });
await p.getByPlaceholder('Ingresa un código postal mexicano').fill('64000');
await p.getByRole('button', { name: 'Actualizar ubicación' }).click();
await p.getByRole('dialog', { name: 'Selecciona una tienda' }).waitFor();
await p.screenshot({ path: `${OUT}/4-tiendas-64000.png` });
await p.close();

// 2) Permitir esta vez → Mi tienda más cercana, sin aviso de Autex
p = await nueva();
await p.getByRole('button', { name: 'Permitir esta vez' }).click();
await p.waitForTimeout(500);
console.log('aviso tras permitir:', await p.getByRole('dialog', { name: 'Elige una tienda' }).count(), '| tienda:', (await p.getByRole('button', { name: 'Mi tienda' }).innerText()).replace(/\n/g, ' '));
await p.screenshot({ path: `${OUT}/5-permitido.png`, clip: { x: 0, y: 0, width: 1920, height: 240 } });

// 3) Mis vehículos
await p.getByRole('button', { name: 'Mis vehículos' }).click();
await p.getByRole('dialog', { name: 'Mis vehículos' }).waitFor();
await p.screenshot({ path: `${OUT}/6-mis-vehiculos.png` });
await p.getByLabel('Año', { exact: true }).last().selectOption('2014');
await p.getByLabel('Marca', { exact: true }).last().selectOption('Chevrolet');
await p.getByLabel('Modelo', { exact: true }).last().selectOption('Aveo');
await p.getByRole('button', { name: 'Agregar vehículo a la lista' }).click();
await p.screenshot({ path: `${OUT}/7-vehiculo-agregado.png` });
await browser.close();
if (errores.length) console.log('ERRORES', errores);
console.log('ok', OUT);
