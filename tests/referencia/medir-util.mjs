// Utilidades para medir autex.com.mx (vista de celular): árbol de estilos calculados de una zona y descarga de sus
// imágenes. Las usan medir-autex-movil.mjs (invitado) y cdp-medir-registrado-movil.mjs (con sesión).
import fs from 'node:fs';

const PROPS = [
  'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'text-align',
  'color', 'background-color', 'background-image', 'padding', 'margin', 'border-top', 'border-right',
  'border-bottom', 'border-left', 'border-radius', 'box-shadow', 'display', 'flex-direction', 'justify-content',
  'align-items', 'gap', 'position', 'top', 'right', 'bottom', 'left', 'z-index', 'opacity', 'text-decoration-line',
  'background-size', 'background-position', 'background-repeat', 'object-fit', 'max-width', 'width', 'height',
];
const OMITIR = {
  'background-size': 'auto', 'background-position': '0% 0%', 'background-repeat': 'repeat', 'object-fit': 'fill',
  'max-width': 'none', 'background-image': 'none', 'box-shadow': 'none', 'text-transform': 'none',
  'letter-spacing': 'normal', opacity: '1', 'z-index': 'auto', 'text-decoration-line': 'none',
};

/**
 * Árbol de estilos de una zona: cada elemento visible dentro del rectángulo (px de CSS) o del selector, con su caja,
 * su texto propio y los estilos que importan para replicarlo.
 */
export const arbol = (p, zona) =>
  p.evaluate(
    ({ zona, PROPS, OMITIR }) => {
      const fuera = (r) => r.width === 0 || r.height === 0 || r.bottom < zona.y || r.top > zona.y + zona.alto;
      const salida = [];
      const raiz = zona.selector ? document.querySelector(zona.selector) : document.body;
      if (!raiz) return [{ error: `sin ${zona.selector}` }];
      const visitar = (el, nivel) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        if (!fuera(r)) {
          const propio = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim();
          const estilos = {};
          for (const k of PROPS) {
            const v = cs.getPropertyValue(k);
            if (v && OMITIR[k] !== v && !(k.startsWith('border-') && v.startsWith('0px')) && !(k === 'padding' && v === '0px') && !(k === 'margin' && v === '0px')) estilos[k] = v;
          }
          salida.push({
            nivel,
            tag: el.tagName.toLowerCase(),
            clase: (el.getAttribute('class') ?? '').toString().slice(0, 80),
            texto: propio.slice(0, 60),
            caja: [Math.round(r.left * 10) / 10, Math.round(r.top * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10],
            src: el.getAttribute('src') ?? undefined,
            estilos,
          });
        }
        for (const h of el.children) visitar(h, nivel + 1);
      };
      visitar(raiz, 0);
      return salida;
    },
    { zona, PROPS, OMITIR },
  );

/** Guarda en <dir>/imagenes las imágenes (img, svg en línea y fondos) visibles dentro de la zona. */
export async function imagenes(p, dir, prefijo, zona) {
  fs.mkdirSync(`${dir}/imagenes`, { recursive: true });
  const lista = await p.evaluate((zona) => {
    const dentro = (r) => r.width > 0 && r.height > 0 && r.bottom > zona.y && r.top < zona.y + zona.alto;
    const res = [];
    const raiz = zona.selector ? document.querySelector(zona.selector) : document;
    for (const el of raiz?.querySelectorAll('img, svg, [style*="background"], div, span, a') ?? []) {
      const r = el.getBoundingClientRect();
      if (!dentro(r)) continue;
      const tag = el.tagName.toLowerCase();
      if (tag === 'svg') {
        if (el.parentElement?.closest('svg')) continue;
        res.push({ tipo: 'svg', svg: el.outerHTML, caja: [r.left, r.top, r.width, r.height].map(Math.round), alt: el.getAttribute('aria-label') ?? '' });
      } else if (tag === 'img') {
        res.push({ tipo: 'img', src: el.currentSrc || el.src, caja: [r.left, r.top, r.width, r.height].map(Math.round), alt: el.getAttribute('alt') ?? '' });
      } else {
        const m = /url\("([^"]+)"\)/.exec(getComputedStyle(el).backgroundImage);
        if (m) res.push({ tipo: 'fondo', src: m[1], caja: [r.left, r.top, r.width, r.height].map(Math.round), alt: '' });
      }
    }
    return res;
  }, zona);
  let i = 0;
  for (const im of lista) {
    const n = `${prefijo}-${String(++i).padStart(2, '0')}`;
    if (im.svg) fs.writeFileSync(`${dir}/imagenes/${n}.svg`, im.svg);
    else if (im.src?.startsWith('data:')) {
      const [cab, datos] = im.src.split(',');
      const ext = cab.includes('svg') ? 'svg' : cab.includes('png') ? 'png' : 'bin';
      fs.writeFileSync(`${dir}/imagenes/${n}.${ext}`, cab.includes('base64') ? Buffer.from(datos, 'base64') : decodeURIComponent(datos));
    } else if (im.src && !im.src.startsWith('blob:')) {
      const r = await p.request.get(im.src).catch(() => null);
      if (r?.ok()) {
        const tipo = r.headers()['content-type'] ?? '';
        const ext = tipo.includes('svg') ? 'svg' : tipo.includes('png') ? 'png' : tipo.includes('webp') ? 'webp' : tipo.includes('jpeg') ? 'jpg' : 'bin';
        fs.writeFileSync(`${dir}/imagenes/${n}.${ext}`, await r.body());
      }
    }
    console.log(' ', n, im.tipo, im.caja.join(','), im.alt, (im.src ?? '').slice(0, 80));
  }
  return lista.map((im, k) => ({ archivo: `${prefijo}-${String(k + 1).padStart(2, '0')}`, ...im, svg: undefined }));
}
