/**
 * Productos tal como aparecen en Figma (Resumen de productos 1341:94679).
 * Las miniaturas en Figma son capas superpuestas; se conservan en el mismo orden.
 */
import fondo from '../assets/images/producto-fondo-base.png';
import capa from '../assets/images/producto-capa-intermedia.png';
import cables from '../assets/images/producto-cables-bujias-kem.png';
import bujiaIridio from '../assets/images/producto-bujia-iridio-autolite.png';
import bomba from '../assets/images/producto-bomba-agua-kgp.png';
import bateria from '../assets/images/producto-bateria-duralast.png';
import cardan from '../assets/images/producto-acoplamiento-cardan.png';
import bujiaPlatino from '../assets/images/producto-bujia-doble-platino.png';
import clutch from '../assets/images/producto-kit-clutch-sachs.png';
import inyector from '../assets/images/producto-inyector.png';
import faro from '../assets/images/producto-faro.png';
import switchEncendido from '../assets/images/producto-switch-encendido.png';
import switchLuces from '../assets/images/producto-switch-luces.png';

export type CapaImagen = { src: string; fit: 'cover' | 'contain' };

export type Producto = {
  id: string;
  sku: string;
  nombre: string;
  /** Precio unitario con IVA, en pesos. */
  precio: number;
  imagen: CapaImagen[];
  /** Autex_2026_Frames: "SKU #0012345" y "No. Original AI3922" en la tarjeta del carrito. */
  skuCarrito?: string;
  noOriginal?: string;
  /** Estado que muestra Figma cuando la galería fija el estado (modoFigma). */
  estadoFigma?: EstadoExistencia;
};

/** SMC 4.0: disponible en sucursales de la zona, bajo pedido (solo CEDIS) o sin existencia. */
export type EstadoExistencia = 'disponible' | 'bajo-pedido' | 'sin-existencia';

export const PRODUCTOS: Producto[] = [
  { id: 'kem-l2113', sku: 'L-2113', nombre: 'Cables para Bujias KEM L-2113', precio: 80.5, imagen: [{ src: cables, fit: 'cover' }] },
  {
    id: 'autolite-ai5703',
    sku: 'AI5703',
    nombre: 'Autolite Ultra Bujia de Iridio AI5703',
    precio: 189,
    imagen: [{ src: fondo, fit: 'cover' }, { src: bujiaIridio, fit: 'contain' }],
  },
  {
    id: 'kgp-1451',
    sku: 'KGP-1451',
    nombre: 'Bomba de Agua Keep On Green KGP-1451',
    precio: 6899,
    imagen: [{ src: fondo, fit: 'cover' }, { src: capa, fit: 'cover' }, { src: bomba, fit: 'cover' }],
  },
  {
    id: 'duralast-31t',
    sku: '31T-AGM',
    nombre: 'Duralast Platinum AGM Bateria 31T-AGM',
    precio: 6899,
    imagen: [{ src: fondo, fit: 'cover' }, { src: capa, fit: 'cover' }, { src: bateria, fit: 'cover' }],
  },
  {
    id: 'eagle-7352',
    sku: '7352-EAG',
    nombre: 'Acoplamiento de Flecha Cardan Trasero Eagle 7352-EAG',
    precio: 6899,
    imagen: [{ src: fondo, fit: 'cover' }, { src: capa, fit: 'cover' }, { src: cardan, fit: 'cover' }],
  },
  { id: 'autolite-app5363', sku: 'APP5363-AUT', nombre: 'Bujia de Doble Platino Autolite APP5363-AUT', precio: 6899, imagen: [{ src: bujiaPlatino, fit: 'cover' }] },
  { id: 'sachs-3000990492', sku: '3000 990 492', nombre: 'Kit de Clutch Sachs 3000 990 492 SACHS', precio: 6899, imagen: [{ src: clutch, fit: 'cover' }] },
];

/** Productos del archivo Autex_2026_Frames (673:18933 inyector, 673:20391 faro). Textos literales de Figma. */
const LOREM = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum';
export const PRODUCTOS_2026: Producto[] = [
  { id: 'inyector-ai3922', sku: 'AI3922', nombre: LOREM, precio: 750, imagen: [{ src: inyector, fit: 'cover' }], skuCarrito: 'SKU #0012345', noOriginal: 'No. Original AI3922', estadoFigma: 'disponible' },
  { id: 'faro-ai3922', sku: 'AI3922-F', nombre: LOREM, precio: 750, imagen: [{ src: faro, fit: 'cover' }], skuCarrito: 'SKU #0012345', noOriginal: 'No. Original AI3922', estadoFigma: 'bajo-pedido' },
];

/** Productos adicionales del mini-carrito 2026 (645:10675, 645:10714). */
export const PRODUCTOS_2026_EXTRA: Producto[] = [
  { id: 'switch-encendido', sku: 'SW-0012345', nombre: LOREM, precio: 132.25, imagen: [{ src: switchEncendido, fit: 'cover' }], skuCarrito: 'SKU #0012345', noOriginal: 'No. Original AI3922', estadoFigma: 'disponible' },
  { id: 'switch-luces', sku: 'SL-0012345', nombre: LOREM, precio: 132.25, imagen: [{ src: switchLuces, fit: 'cover' }], skuCarrito: 'SKU #0012345', noOriginal: 'No. Original AI3922', estadoFigma: 'disponible' },
];

/** Sitio (D43): cómo recibe el cliente cada artículo. Sin valor: envío a domicilio. */
export type ModoEntrega = 'domicilio' | 'tienda';
/** aviso: mensaje del último ajuste de cantidad o de entrega (p. ej. al pasar a "Recoger en tienda"). */
export type LineaCarrito = { producto: Producto; cantidad: number; entrega?: ModoEntrega; aviso?: string };

/** Carrito de Autex_Carrito- 1 (673:18974): un producto disponible y uno bajo pedido. */
export const CARRITO_2026: LineaCarrito[] = PRODUCTOS_2026.map((producto) => ({ producto, cantidad: 1 }));

/** Mini-carrito Carrito/Default (657:14102): cuatro productos de $132.25, subtotal $529.00. */
export const CARRITO_MINI_FIGMA: LineaCarrito[] = [...PRODUCTOS_2026, ...PRODUCTOS_2026_EXTRA].map((producto) => ({
  producto: { ...producto, precio: 132.25 },
  cantidad: 1,
}));

/** Fila "Ejemplo de envío con costo" (EF-42837, 901:33560…): ambos productos a $630.00 y disponibles. */
export const CARRITO_2026_CON_COSTO: LineaCarrito[] = PRODUCTOS_2026.map((producto) => ({
  producto: { ...producto, precio: 630, estadoFigma: 'disponible' },
  cantidad: 1,
}));

/** Carrito que muestran todas las pantallas de checkout en Figma. */
export const CARRITO_FIGMA: LineaCarrito[] = [
  { producto: PRODUCTOS[0], cantidad: 10 },
  { producto: PRODUCTOS[1], cantidad: 16 },
  ...PRODUCTOS.slice(2).map((producto) => ({ producto, cantidad: 1 })),
];

/** Formato de moneda de Figma: "$6,899.00" */
export function formatoMXN(valor: number): string {
  return '$' + valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
