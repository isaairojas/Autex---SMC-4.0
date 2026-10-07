/**
 * Catálogo simulado de la demo. El primer producto es el de la tarjeta de Figma (12849:114195);
 * el resto son los productos del resumen del checkout (1341:94679) con su imagen de Figma.
 */
import bujiaPlp from '../assets/images/producto-bujia-autolite-plp.png';
import f21 from '../assets/images/plp-fila2-1.png';
import f22 from '../assets/images/plp-fila2-2.png';
import f23 from '../assets/images/plp-fila2-3.png';
import f24 from '../assets/images/plp-fila2-4.png';
import f41 from '../assets/images/plp-fila4-1.png';
import f42 from '../assets/images/plp-fila4-2.png';
import f43 from '../assets/images/plp-fila4-3.png';
import f44 from '../assets/images/plp-fila4-4.png';
import inyector from '../assets/images/producto-inyector.png';
import switchEncendido from '../assets/images/producto-switch-encendido.png';
import cuerpo from '../assets/images/producto-cuerpo-aceleracion.png';
import filtro from '../assets/images/producto-filtro-aire.png';
import faro from '../assets/images/producto-faro.png';
import faro2 from '../assets/images/producto-faro-2.png';
import marcha from '../assets/images/producto-marcha.png';
import alternador from '../assets/images/producto-alternador.png';
import bombaGasolina from '../assets/images/producto-bomba-gasolina.png';
import moduloBomba from '../assets/images/producto-modulo-bomba.png';
import ventilador from '../assets/images/producto-ventilador.png';
import switchLuces from '../assets/images/producto-switch-luces.png';
/* Imágenes de Figma reutilizadas para el catálogo del sitio (el nombre del archivo no siempre coincide con el producto). */
import bateriaDuralast from '../assets/images/producto-capa-intermedia.png';
import focoH7 from '../assets/images/producto-fondo-base.png';
import aceiteEneos from '../assets/images/juntos-aceite.png';
import liquiMoly from '../assets/images/juntos-liqui-moly.png';
import filtroGasolina from '../assets/images/rel-3.png';
import kitClutch from '../assets/images/producto-kit-clutch-sachs.png';
import cablesBujia from '../assets/images/producto-cables-bujias-kem.png';
import bujiaIncandescente from '../assets/images/plp-fila4-1.png';
import bujiaMotoIridium from '../assets/images/plp-fila4-4.png';
import bujiaMotorPequeno from '../assets/images/plp-fila4-3.png';
import relevador from '../assets/images/sust-6.png';
import faroTrabajo from '../assets/images/sust-4.png';
import logoAutex from '../assets/icons/autex-logo-navbar.svg';
/* Sin imagen en Figma: fotos del catálogo de autex.com.mx (captura 2026-10-06, a pedido del usuario, D38). */
import cintaAislante from '../assets/images/sitio-cinta-aislante-tuk-320.png';
import chaleco from '../assets/images/sitio-chaleco-reflejante.png';
import juegoLlaves from '../assets/images/sitio-juego-llaves-matraca.png';
import guantes from '../assets/images/sitio-guantes-puntos.png';
import { PRODUCTOS, type EstadoExistencia, type Producto } from './productos';

export type ProductoCatalogo = Producto & {
  /** SKU visible en la tarjeta: "SKU #1103113". */
  skuVisible: string;
  marca: string;
  /** Solo Autolite tiene logo en Figma. */
  logoMarca: boolean;
  imagenTarjeta: string;
  /** Catálogo del sitio (D38): especialidad y categoría de autex.com.mx. */
  especialidad?: string;
  categoria?: string;
  /** Sin imagen en Figma: se muestra el logo de Autex en gris, como hace autex.com.mx (regla 5). */
  imagenPendiente?: boolean;
};

const BUJIA_FIGMA: ProductoCatalogo = {
  id: 'bosch-x5dc',
  sku: '0 242 145 500',
  skuVisible: 'SKU #1103113',
  nombre: 'Bujía resistiva X5DC BMW 750CC 85-96 CAGIVA 350CC 450CC 94-96 BOSCH 0 242 145 500',
  precio: 189,
  marca: 'Autolite',
  logoMarca: true,
  imagen: [{ src: bujiaPlp, fit: 'contain' }],
  imagenTarjeta: bujiaPlp,
};

/** Catálogo del archivo anterior (Locofy, 12849:114186); se conserva como referencia. */
export const CATALOGO_ANTERIOR: ProductoCatalogo[] = [
  BUJIA_FIGMA,
  ...PRODUCTOS.map((p, i) => ({
    ...p,
    skuVisible: `SKU #${1103114 + i}`,
    marca: p.nombre.includes('Autolite') ? 'Autolite' : '',
    logoMarca: p.nombre.includes('Autolite'),
    imagenTarjeta: p.imagen[p.imagen.length - 1].src,
  })),
];

/** Cuadrícula de Figma: mismos textos en las 16 tarjetas; las filas 2 (12849:114199) y 4 (12849:114209) cambian la imagen. */
const conImagen = (src: string, i: number): ProductoCatalogo => ({ ...BUJIA_FIGMA, id: `${BUJIA_FIGMA.id}-${i}`, imagenTarjeta: src });
export const GRID_FIGMA: ProductoCatalogo[] = [
  ...Array.from({ length: 4 }, () => BUJIA_FIGMA),
  ...[f21, f22, f23, f24].map(conImagen),
  ...Array.from({ length: 4 }, () => BUJIA_FIGMA),
  ...[f41, f42, f43, f44].map((s, i) => conImagen(s, i + 4)),
];

/**
 * Catálogo Autex_2026_Frames (Autex_Catalogo_Stock_Cliente Registrado - 1, 657:14082; tarjetas I657:14098;606:*).
 * Nombres y precios para la demo; la galería usa los textos literales de Figma (GRID_2026_FIGMA).
 * Marca de todas las tarjetas en Figma: Tecnofuel.
 */
type Base = { id: string; nombre: string; precio: number; img: string; estadoFigma: EstadoExistencia };
const BASE_2026: Base[] = [
  { id: 'inyector-ai3922', nombre: 'Inyector de combustible Tecnofuel AI3922', precio: 750, img: inyector, estadoFigma: 'disponible' },
  { id: 'switch-encendido', nombre: 'Switch de encendido con llaves Tecnofuel', precio: 489, img: switchEncendido, estadoFigma: 'sin-existencia' },
  { id: 'cuerpo-aceleracion', nombre: 'Cuerpo de aceleración electrónico Tecnofuel', precio: 2890, img: cuerpo, estadoFigma: 'disponible' },
  { id: 'filtro-aire', nombre: 'Filtro de aire de motor Tecnofuel', precio: 259, img: filtro, estadoFigma: 'bajo-pedido' },
  { id: 'faro-ai3922', nombre: 'Faro delantero izquierdo Tecnofuel', precio: 750, img: faro, estadoFigma: 'bajo-pedido' },
  { id: 'faro-derecho', nombre: 'Faro delantero derecho Tecnofuel', precio: 750, img: faro2, estadoFigma: 'bajo-pedido' },
  { id: 'marcha', nombre: 'Motor de arranque (marcha) Tecnofuel', precio: 3150, img: marcha, estadoFigma: 'sin-existencia' },
  { id: 'alternador', nombre: 'Alternador 12V 120A Tecnofuel', precio: 3690, img: alternador, estadoFigma: 'disponible' },
  { id: 'bomba-gasolina', nombre: 'Bomba de gasolina eléctrica Tecnofuel', precio: 899, img: bombaGasolina, estadoFigma: 'sin-existencia' },
  { id: 'modulo-bomba', nombre: 'Módulo de bomba de combustible Tecnofuel', precio: 1890, img: moduloBomba, estadoFigma: 'disponible' },
  { id: 'ventilador', nombre: 'Motoventilador de radiador Tecnofuel', precio: 2350, img: ventilador, estadoFigma: 'disponible' },
  { id: 'switch-luces', nombre: 'Switch de luces y direccionales Tecnofuel', precio: 599, img: switchLuces, estadoFigma: 'disponible' },
];

export const CATALOGO: ProductoCatalogo[] = BASE_2026.map((b, i) => ({
  id: b.id,
  sku: `TF-${1001 + i}`,
  skuVisible: `SKU #${String(12345 + i).padStart(7, '0')}`,
  skuCarrito: `SKU #${String(12345 + i).padStart(7, '0')}`,
  noOriginal: `No. Original TF-${1001 + i}`,
  nombre: b.nombre,
  precio: b.precio,
  marca: 'Tecnofuel',
  logoMarca: true,
  imagen: [{ src: b.img, fit: 'cover' }],
  imagenTarjeta: b.img,
  estadoFigma: b.estadoFigma,
}));

const LOREM = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum';

/** Cuadrícula literal de Figma: mismos textos ("SKU #0012345", "$599 00") y el estado de cada tarjeta. */
export const GRID_2026_FIGMA: ProductoCatalogo[] = CATALOGO.map((p) => ({ ...p, nombre: LOREM, precio: 599, skuVisible: 'SKU #0012345' }));

/* ---------- Catálogo del sitio (sin respaldo en Figma, D38) ---------- */

type Nuevo = { id: string; nombre: string; precio: number; marca: string; especialidad: string; categoria: string; img?: string };

/**
 * Productos agregados para la demo del sitio: las 5 especialidades de autex.com.mx, baterías, alternadores y cinta
 * aislante. Imágenes de Figma; los que no tienen imagen en Figma usan la foto de autex.com.mx (D38).
 */
const NUEVOS: Nuevo[] = [
  { id: 'bateria-duralast-platinum', nombre: 'Batería Duralast Platinum AGM 24F-DLP 710 CCA', precio: 3890, marca: 'Duralast', especialidad: 'Automotriz', categoria: 'Acumuladores', img: bateriaDuralast },
  { id: 'bateria-duralast-gold', nombre: 'Batería Duralast Gold 35-DLG 640 CCA', precio: 3150, marca: 'Duralast', especialidad: 'Automotriz', categoria: 'Acumuladores', img: bateriaDuralast },
  { id: 'alternador-90a', nombre: 'Alternador 12V 90A Tecnofuel', precio: 2890, marca: 'Tecnofuel', especialidad: 'Automotriz', categoria: 'Refacciones electricas arranque y carga', img: alternador },
  { id: 'alternador-150a', nombre: 'Alternador 12V 150A alto rendimiento Tecnofuel', precio: 4590, marca: 'Tecnofuel', especialidad: 'Automotriz', categoria: 'Refacciones electricas arranque y carga', img: alternador },
  { id: 'aceite-eneos-10w40', nombre: 'Aceite para motor ENEOS 10W-40 semisintético 946 ml', precio: 189, marca: 'ENEOS', especialidad: 'Automotriz', categoria: 'Mantenimiento de rutina', img: aceiteEneos },
  { id: 'liqui-moly-flush', nombre: 'Liqui Moly 2657 Engine Flush Plus limpiador de motor 300 ml', precio: 233.4, marca: 'Liqui Moly', especialidad: 'Automotriz', categoria: 'Limpieza y cuidado automotriz', img: liquiMoly },
  { id: 'foco-h7', nombre: 'Foco halógeno H7 12V 55W luz blanca', precio: 165, marca: 'Tecnofuel', especialidad: 'Automotriz', categoria: 'Refacciones de iluminacion', img: focoH7 },
  { id: 'filtro-gasolina-bosch', nombre: 'Filtro de gasolina Bosch 0 986 MF2 086', precio: 245, marca: 'Bosch', especialidad: 'Automotriz', categoria: 'Refacciones del sistema de inyeccion', img: filtroGasolina },
  { id: 'kit-clutch-sachs', nombre: 'Kit de clutch Sachs 3000 990 492', precio: 4250, marca: 'Sachs', especialidad: 'Automotriz', categoria: 'Refacciones de transmision', img: kitClutch },
  { id: 'cables-bujia-kem', nombre: 'Juego de cables para bujía KEM L2113', precio: 690, marca: 'KEM', especialidad: 'Automotriz', categoria: 'Refacciones de motor', img: cablesBujia },
  { id: 'bujia-incandescente', nombre: 'Bujías incandescentes Autolite para motor diésel (4 piezas)', precio: 980, marca: 'Autolite', especialidad: 'Automotriz', categoria: 'Refacciones de motor', img: bujiaIncandescente },
  { id: 'cinta-aislante', nombre: 'Cinta aislante de vinil negra 19 mm x 18 m TUK 320', precio: 33.87, marca: 'TUK', especialidad: 'Ferreteria', categoria: 'Materiales electricos', img: cintaAislante },
  { id: 'relevador-12v', nombre: 'Relevador automotriz 12V 40A 5 terminales', precio: 89, marca: 'Tecnofuel', especialidad: 'Ferreteria', categoria: 'Materiales electricos', img: relevador },
  { id: 'faro-trabajo-led', nombre: 'Faro de trabajo LED redondo 27W 12/24V', precio: 349, marca: 'Tecnofuel', especialidad: 'Herramientas y equipos', categoria: 'Herramientas automotrices', img: faroTrabajo },
  { id: 'juego-llaves', nombre: 'Juego de llaves combinadas con matraca 7 piezas', precio: 899, marca: '', especialidad: 'Herramientas y equipos', categoria: 'Herramientas manuales', img: juegoLlaves },
  { id: 'bujia-moto-iridium', nombre: 'Bujía Autolite Xtreme Sport Iridium para motocicleta', precio: 145, marca: 'Autolite', especialidad: 'Motocicletas', categoria: 'Accesorios', img: bujiaMotoIridium },
  { id: 'bujia-motor-pequeno', nombre: 'Bujía Autolite para motor pequeño y motocicleta', precio: 79, marca: 'Autolite', especialidad: 'Motocicletas', categoria: 'Accesorios', img: bujiaMotorPequeno },
  { id: 'chaleco-reflejante', nombre: 'Chaleco de seguridad reflejante naranja talla única', precio: 129, marca: '', especialidad: 'Seguridad y prevencion', categoria: 'Seguridad personal', img: chaleco },
  { id: 'guantes-nitrilo', nombre: 'Guantes de algodón con puntos antiderrapantes (par)', precio: 59, marca: '', especialidad: 'Seguridad y prevencion', categoria: 'Seguridad laboral', img: guantes },
];

/** Catálogo que usa el sitio (búsqueda, ofertas, detalle, carrito). La galería de Figma usa CATALOGO / GRID_2026_FIGMA. */
export const CATALOGO_SITIO: ProductoCatalogo[] = [
  ...CATALOGO.map((p) => ({ ...p, especialidad: 'Automotriz' })),
  ...NUEVOS.map((n, i) => {
    const img = n.img ?? logoAutex;
    return {
      id: n.id,
      sku: `AX-${2001 + i}`,
      skuVisible: `SKU #${String(12400 + i).padStart(7, '0')}`,
      skuCarrito: `SKU #${String(12400 + i).padStart(7, '0')}`,
      noOriginal: `No. Original AX-${2001 + i}`,
      nombre: n.nombre,
      precio: n.precio,
      marca: n.marca,
      logoMarca: false,
      imagen: [{ src: img, fit: 'contain' as const }],
      imagenTarjeta: img,
      especialidad: n.especialidad,
      categoria: n.categoria,
      imagenPendiente: !n.img,
    };
  }),
];
