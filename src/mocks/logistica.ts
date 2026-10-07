/**
 * Datos de envío y pago tal como aparecen en Figma (textos literales).
 */
import oxxo from '../assets/images/tienda-oxxo.png';
import seven from '../assets/images/tienda-7eleven.png';
import ahorro from '../assets/images/tienda-farmacias-del-ahorro.png';
import circleK from '../assets/images/tienda-circle-k.png';
import extra from '../assets/images/tienda-extra.png';
import waldos from '../assets/images/tienda-waldos.png';
import eleczion from '../assets/images/tienda-eleczion.png';
import kiosko from '../assets/images/tienda-kiosko.png';
import bazar from '../assets/images/tienda-farmacias-bazar.png';
import delSol from '../assets/images/tienda-del-sol.png';
import yepas from '../assets/images/tienda-yepas.png';
import benavides from '../assets/images/tienda-benavides.png';
import woolworth from '../assets/images/tienda-woolworth.png';
import alsuper from '../assets/images/tienda-alsuper.png';

/** Figma: 2596:99034 (texto literal, D9). */
export const FECHA_ENTREGA = 'Recoge ente el 5 y el 12 de julio, 2023';

export type Sucursal = { id: string; nombre: string; km: string; direccion: string; horario: string };

export const SUCURSALES_JALISCO: Sucursal[] = [
  { id: 'adolf-horn', nombre: 'Jalisco (Adolf Horn) ', km: '1.1 km', direccion: 'Calz del Federalismo Nte 1343 Col, Mezquitan Country, 45190 Guadalajara, Jal.', horario: '9:00am - 6:30pm' },
  { id: 'central-camionera', nombre: 'Jalisco (Central Camionera)', km: '2.1 km', direccion: 'Calz del Federalismo Nte 1343 Col, Mezquitan Country, 45190 Guadalajara, Jal.', horario: '9:00am - 6:30pm' },
  { id: 'colon', nombre: 'Jalisco (Colón)', km: '4.1 km', direccion: 'Calz del Federalismo Nte 1343 Col, Mezquitan Country, 45190 Guadalajara, Jal.', horario: '9:00am - 6:30pm' },
];

export type Paqueteria = { id: string; nombre: string; precio: string; costo: number; tiempo: string };

export const PAQUETERIAS: Paqueteria[] = [
  { id: 'pe', nombre: 'Paquete Express', precio: 'Gratis', costo: 0, tiempo: 'Tiempo de entrega estiamdo de 24 a 48 horas.' },
  { id: 'pe-rapido', nombre: 'Paquete Express - Envío rápido', precio: '+150.00MXN', costo: 150, tiempo: 'Tiempo de entrega estiamdo de 24 a 48 horas.' },
  { id: 'estafeta', nombre: 'Estafeta', precio: 'Gratis', costo: 0, tiempo: 'Tiempo de entrega estiamdo de 24 a 48 horas.' },
  { id: 'estafeta-rapido', nombre: 'Estafeta - Envío rápido', precio: '+150.00MXN', costo: 150, tiempo: 'Tiempo de entrega estiamdo de 24 a 48 horas.' },
];

/** Figma: 2596:99870 — tres columnas (textos literales, incluye "Cohahuila" y "Moroles"). */
export const ESTADOS: string[][] = [
  ['Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 'Ciudad de México', 'Cohahuila', 'Colima', 'Durango', 'Estado de México'],
  ['Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Moroles', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro'],
  ['Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'],
];

/** Figma: Grid tiendas 2599:104115 — tamaño del logo dentro de la celda de 64 px de alto. */
export type TiendaAutoservicio = { id: string; nombre: string; logo: string; w: number; h: number };

export const TIENDAS_AUTOSERVICIO: TiendaAutoservicio[][] = [
  [
    { id: 'oxxo', nombre: 'OXXO', logo: oxxo, w: 72.8, h: 36.8 },
    { id: '7eleven', nombre: '7-Eleven', logo: seven, w: 48, h: 47.2 },
    { id: 'ahorro', nombre: 'Farmacias del Ahorro', logo: ahorro, w: 77.6, h: 78.4 },
    { id: 'circlek', nombre: 'Circle K', logo: circleK, w: 94.4, h: 36.8 },
    { id: 'extra', nombre: 'Extra', logo: extra, w: 91.2, h: 33.6 },
  ],
  [
    { id: 'waldos', nombre: "Waldo's", logo: waldos, w: 61.6, h: 61.6 },
    { id: 'eleczion', nombre: 'elecZion', logo: eleczion, w: 92, h: 61.6 },
    { id: 'kiosko', nombre: 'Kiosko', logo: kiosko, w: 121.6, h: 43.2 },
    { id: 'bazar', nombre: 'Farmacias Bazar', logo: bazar, w: 107.2, h: 26.4 },
    { id: 'delsol', nombre: 'Del Sol', logo: delSol, w: 60.8, h: 60.8 },
  ],
  [
    { id: 'yepas', nombre: 'Yepas', logo: yepas, w: 62.4, h: 62.4 },
    { id: 'benavides', nombre: 'Farmacias Benavides', logo: benavides, w: 130.2, h: 25.2 },
    { id: 'woolworth', nombre: 'Woolworth', logo: woolworth, w: 118.4, h: 37.6 },
    { id: 'alsuper', nombre: 'Alsuper', logo: alsuper, w: 111.2, h: 41.6 },
  ],
];

/**
 * Autex_2026_Frames — envío a domicilio (Envio Paqueteria 898:31778 / 904:34781).
 * El ejemplo "con costo" (901:32141) cobra $249.00 con subtotal de $1,260.00 y pide "$50.00" más para envío
 * sin costo, así que el umbral que implica Figma es $1,310.00 (el banner dice $499/$549 MXN: D27).
 */
export const UMBRAL_ENVIO_GRATIS = 1310;
export const COSTO_ENVIO = 249;

export function costoEnvio(subtotal: number): number {
  return subtotal >= UMBRAL_ENVIO_GRATIS ? 0 : COSTO_ENVIO;
}
