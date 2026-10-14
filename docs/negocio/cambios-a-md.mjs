// Genera cambios-demo-vs-autex.md (para las specs) desde cambios-demo-vs-autex.html, que es la fuente.
// Uso: node docs/negocio/cambios-a-md.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(dir, 'cambios-demo-vs-autex.html'), 'utf8').replace(/\r\n/g, '\n');

/* Los datos son JavaScript del propio archivo: T (temas), PC (por confirmar) y CAMBIOS. */
const bloque = html.slice(html.indexOf('const T = {'), html.indexOf('\nconst filas'));
const { T, CAMBIOS } = new Function(`${bloque}\nreturn { T, CAMBIOS };`)();
const TIPO = { nuevo: 'Nuevo', ajuste: 'Ajuste', regla: 'Regla' };

const corte = /Corte: <strong>([^<]+)<\/strong>/.exec(html)[1];
const texto = (s) =>
  s
    .replace(/<code>([^<]*)<\/code>/g, '`$1`')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

const lineas = [
  '# Cambios de la demo frente a autex.com.mx',
  '',
  `Corte: ${corte}. ${CAMBIOS.length} cambios. Se genera desde \`cambios-demo-vs-autex.html\` (la fuente): no editar a mano;`,
  'para actualizarlo, editar el HTML y correr `node docs/negocio/cambios-a-md.mjs`.',
  '',
  'Tipos: **Nuevo** (no existe en el sitio actual) · **Ajuste** (existe en el sitio, pero cambia) · **Regla** (regla de',
  'existencias, tiendas o envíos que decide el cálculo, no una pantalla). "Origen" es la decisión de la demo en',
  '`docs/figma/discrepancias.md`.',
  '',
  '## Índice',
  '',
  '| ID | Cambio | Tipo | Tema |',
  '|---|---|---|---|',
  ...CAMBIOS.map(([id, tema, tipo, cambio]) => `| ${id} | ${cambio} | ${TIPO[tipo]} | ${T[tema]} |`),
];
for (const [k, nombre] of Object.entries(T)) {
  const lista = CAMBIOS.filter((c) => c[1] === k);
  if (!lista.length) continue;
  lineas.push('', `## ${nombre}`);
  for (const [id, , tipo, cambio, hoy, debe, pantallas, celular, origen] of lista) {
    lineas.push(
      '',
      `### ${id} · ${cambio} (${TIPO[tipo]})`,
      '',
      `- **Hoy en autex.com.mx:** ${hoy}`,
      `- **Cómo debe quedar:** ${debe}`,
      `- **Pantallas:** ${pantallas}`,
      `- **Celular:** ${celular}`,
      `- **Origen:** ${origen}`,
    );
  }
}

/* Notas: cada <h3> con su lista. */
const notas = html.slice(html.indexOf('<section class="notas"'), html.indexOf('</section>'));
lineas.push('', '## Qué tener en cuenta');
for (const [, titulo, lista] of notas.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<ul>([\s\S]*?)<\/ul>/g)) {
  lineas.push('', `### ${texto(titulo)}`, '');
  for (const [, li] of lista.matchAll(/<li>([\s\S]*?)<\/li>/g)) lineas.push(`- ${texto(li)}`);
}
fs.writeFileSync(path.join(dir, 'cambios-demo-vs-autex.md'), lineas.join('\n') + '\n');
console.log(`cambios-demo-vs-autex.md: ${CAMBIOS.length} cambios`);
