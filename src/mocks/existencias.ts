/**
 * Datos simulados de existencias para la demo (sin conexión al servicio real de SMC 4.0, FR-013).
 * Red de existencias (D41): las tiendas Autex de tiendas.ts más CEDIS 41. Adolf Horn y Colón (y la fila de Central
 * Camionera, que sirve de referencia) tienen existencias capturadas; el resto de las tiendas toma una fracción estable
 * de la referencia, de modo que "Mi tienda", la compra en línea y los envíos usan la misma fuente.
 * CEDIS 41 no es origen de envío (D35): solo completa lo "bajo pedido", que surte la sucursal más cercana.
 */
import type { Ubicacion } from './clientes';
import { haversine } from './geo';
import { ALCANCE_MAXIMO_KM, resolverCP, SERVICIOS, TIENDAS } from './tiendas';

export { haversine };

export type SucursalRed = { id: string; nombre: string; lat: number; lon: number; direccion: string | null; cedis?: boolean };

export const CEDIS: SucursalRed = { id: 'cedis-41', nombre: 'CEDIS 41', lat: 20.7322, lon: -103.4146, direccion: null, cedis: true };

/** Tiendas Autex (sin CEDIS). */
export const SUCURSALES_RED: SucursalRed[] = TIENDAS.map((t) => ({ id: t.id, nombre: `Autex ${t.nombre}`, lat: t.lat, lon: t.lon, direccion: t.direccion }));
export const RED: SucursalRed[] = [...SUCURSALES_RED, CEDIS];

/** Existencias capturadas por sucursal y producto (piezas). */
export const EXISTENCIAS: Record<string, Record<string, number>> = {
  'adolf-horn': { 'switch-encendido': 0, 'cuerpo-aceleracion': 40, 'filtro-aire': 0, 'faro-derecho': 0, 'marcha': 0, 'alternador': 30, 'bomba-gasolina': 0, 'modulo-bomba': 6, 'ventilador': 20, 'switch-luces': 10, 'inyector-ai3922': 50, 'faro-ai3922': 0, 'bosch-x5dc': 20, 'kem-l2113': 10, 'autolite-ai5703': 6, 'kgp-1451': 1, 'duralast-31t': 0, 'eagle-7352': 1, 'autolite-app5363': 2, 'sachs-3000990492': 0, 'bateria-duralast-platinum': 6, 'bateria-duralast-gold': 0, 'alternador-90a': 12, 'alternador-150a': 2, 'aceite-eneos-10w40': 80, 'liqui-moly-flush': 20, 'foco-h7': 30, 'filtro-gasolina-bosch': 0, 'kit-clutch-sachs': 1, 'cables-bujia-kem': 10, 'bujia-incandescente': 0, 'cinta-aislante': 150, 'relevador-12v': 25, 'faro-trabajo-led': 5, 'juego-llaves': 6, 'bujia-moto-iridium': 20, 'bujia-motor-pequeno': 0, 'chaleco-reflejante': 30, 'guantes-nitrilo': 0 },
  'central-camionera': { 'switch-encendido': 0, 'cuerpo-aceleracion': 34, 'filtro-aire': 0, 'faro-derecho': 0, 'marcha': 0, 'alternador': 44, 'bomba-gasolina': 0, 'modulo-bomba': 4, 'ventilador': 10, 'switch-luces': 8, 'inyector-ai3922': 30, 'faro-ai3922': 0, 'bosch-x5dc': 5, 'kem-l2113': 4, 'autolite-ai5703': 16, 'kgp-1451': 0, 'duralast-31t': 2, 'eagle-7352': 0, 'autolite-app5363': 1, 'sachs-3000990492': 1, 'bateria-duralast-platinum': 4, 'bateria-duralast-gold': 0, 'alternador-90a': 8, 'alternador-150a': 0, 'aceite-eneos-10w40': 60, 'liqui-moly-flush': 15, 'foco-h7': 25, 'filtro-gasolina-bosch': 0, 'kit-clutch-sachs': 0, 'cables-bujia-kem': 4, 'bujia-incandescente': 0, 'cinta-aislante': 120, 'relevador-12v': 10, 'faro-trabajo-led': 3, 'juego-llaves': 0, 'bujia-moto-iridium': 15, 'bujia-motor-pequeno': 0, 'chaleco-reflejante': 20, 'guantes-nitrilo': 0 },
  colon: { 'switch-encendido': 0, 'cuerpo-aceleracion': 30, 'filtro-aire': 0, 'faro-derecho': 0, 'marcha': 0, 'alternador': 30, 'bomba-gasolina': 0, 'modulo-bomba': 2, 'ventilador': 8, 'switch-luces': 6, 'inyector-ai3922': 24, 'faro-ai3922': 0, 'bosch-x5dc': 0, 'kem-l2113': 12, 'autolite-ai5703': 4, 'kgp-1451': 2, 'duralast-31t': 1, 'eagle-7352': 1, 'autolite-app5363': 0, 'sachs-3000990492': 0, 'bateria-duralast-platinum': 0, 'bateria-duralast-gold': 3, 'alternador-90a': 10, 'alternador-150a': 1, 'aceite-eneos-10w40': 45, 'liqui-moly-flush': 18, 'foco-h7': 20, 'filtro-gasolina-bosch': 0, 'kit-clutch-sachs': 0, 'cables-bujia-kem': 12, 'bujia-incandescente': 0, 'cinta-aislante': 90, 'relevador-12v': 15, 'faro-trabajo-led': 4, 'juego-llaves': 4, 'bujia-moto-iridium': 10, 'bujia-motor-pequeno': 0, 'chaleco-reflejante': 25, 'guantes-nitrilo': 0 },
  /* D44: la marcha solo está en León (sucursales foráneas para Guadalajara): se vende bajo pedido. El clutch Sachs
     tiene pocas piezas en Guadalajara y más en León: al pedir muchas, la mayoría sale de León y pasa a bajo pedido. */
  'leon-moto-partes': { marcha: 4, 'kit-clutch-sachs': 6 },
  'leon-torres-landa': { marcha: 3, 'kit-clutch-sachs': 6 },
  'cedis-41': { 'switch-encendido': 0, 'cuerpo-aceleracion': 80, 'filtro-aire': 25, 'faro-derecho': 6, 'marcha': 0, 'alternador': 40, 'bomba-gasolina': 0, 'modulo-bomba': 0, 'ventilador': 15, 'switch-luces': 10, 'inyector-ai3922': 30, 'faro-ai3922': 4, 'bosch-x5dc': 100, 'kem-l2113': 50, 'autolite-ai5703': 80, 'kgp-1451': 10, 'duralast-31t': 15, 'eagle-7352': 5, 'autolite-app5363': 40, 'sachs-3000990492': 3, 'bateria-duralast-platinum': 30, 'bateria-duralast-gold': 20, 'alternador-90a': 20, 'alternador-150a': 6, 'aceite-eneos-10w40': 200, 'liqui-moly-flush': 40, 'foco-h7': 50, 'filtro-gasolina-bosch': 15, 'kit-clutch-sachs': 3, 'cables-bujia-kem': 50, 'bujia-incandescente': 0, 'cinta-aislante': 500, 'relevador-12v': 60, 'faro-trabajo-led': 10, 'juego-llaves': 10, 'bujia-moto-iridium': 60, 'bujia-motor-pequeno': 20, 'chaleco-reflejante': 100, 'guantes-nitrilo': 0 },
};

/* Referencia para las tiendas sin captura: la mayor existencia entre las filas capturadas. */
const REFERENCIA = ['adolf-horn', 'central-camionera', 'colon'];
const referencia = (productoId: string) => Math.max(...REFERENCIA.map((id) => EXISTENCIAS[id]?.[productoId] ?? 0));
const hash = (t: string) => [...t].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

/**
 * Piezas físicas de un producto en una tienda. Sin captura: una de cada cuatro tiendas no lo tiene y el resto tiene
 * entre el 10 % y el 84 % de la referencia (al menos 1 pieza), siempre igual para la misma tienda y producto.
 */
export function existenciaEnTienda(productoId: string, tiendaId: string): number {
  const propia = EXISTENCIAS[tiendaId]?.[productoId];
  if (propia !== undefined) return propia;
  const base = referencia(productoId);
  if (!base) return 0;
  const h = hash(`${tiendaId}|${productoId}`) % 100;
  if (h < 25) return 0;
  return Math.max(1, Math.round((base * (h - 15)) / 100));
}

const piezasCedis = (productoId: string) => EXISTENCIAS[CEDIS.id]?.[productoId] ?? 0;

type CodigoPostal = Ubicacion & { lat: number; lon: number; cobertura: boolean };

/** Códigos postales de ejemplo. */
export const CODIGOS_POSTALES: CodigoPostal[] = [
  { codigoPostal: '44400', etiqueta: 'C.P. 44400, Guadalajara', detalle: 'Abierto hasta las 6:00PM', ciudad: 'Guadalajara', estado: 'Jalisco', lat: 20.6668, lon: -103.3318, cobertura: true },
  { codigoPostal: '45412', etiqueta: 'Av. Periferico,45412,To...', detalle: 'Abierto hasta las 6:00PM', ciudad: 'Tonalá', estado: 'Jalisco', lat: 20.6236, lon: -103.2426, cobertura: true },
  { codigoPostal: '45190', etiqueta: 'C.P. 45190, Zapopan', detalle: 'Abierto hasta las 6:00PM', ciudad: 'Zapopan', estado: 'Jalisco', lat: 20.7104, lon: -103.3633, cobertura: true },
  { codigoPostal: '64000', etiqueta: 'C.P. 64000, Monterrey', detalle: 'Sin sucursales cercanas', ciudad: 'Monterrey', estado: 'Nuevo León', lat: 25.6714, lon: -100.3089, cobertura: false },
];

/**
 * Baterías (decisión del usuario, D38): solo cuentan las sucursales a distancia Local o Local Extendido del C.P. de
 * entrega (configuracion-servicios-smc.json, hasta 30 km). No se surten de CEDIS ni con envío Foráneo.
 */
export const esSoloLocal = (productoId: string) => productoId.startsWith('bateria-');
export const alcanceLocalKm = () => Math.max(...SERVICIOS.filter((s) => s.nivel !== 'Foraneo').map((s) => s.distanciaMaximaKm));
/** Distancia máxima desde la que una tienda surte un producto: Foráneo (350 km); baterías, Local Extendido. */
export const alcanceKm = (productoId: string) => (esSoloLocal(productoId) ? alcanceLocalKm() : ALCANCE_MAXIMO_KM);

/** Tiendas (sin CEDIS) que pueden surtir un producto a un C.P.; sin C.P., todas. */
export function tiendasQueSurten(productoId: string, cp: string | null): SucursalRed[] {
  if (cp === null) return SUCURSALES_RED;
  const u = resolverCP(cp);
  if (!u) return [];
  return SUCURSALES_RED.filter((s) => haversine(u.lat, u.lon, s.lat, s.lon) <= alcanceKm(productoId));
}

/** Cobertura de un C.P.: alguna tienda dentro del alcance Foráneo (configuracion-servicios-smc.json, 350 km). */
const cobertura = (cp: string | null) => cp === null || tiendasQueSurten('', cp).length > 0;

/** Piezas en tiendas Local o Local Extendido del C.P. (hasta 30 km); sin C.P., todas. */
export function existenciaLocal(productoId: string, cp: string | null): number {
  if (cp === null) return existenciaEnLinea(productoId, null);
  const u = resolverCP(cp);
  if (!u) return 0;
  return SUCURSALES_RED.filter((s) => haversine(u.lat, u.lon, s.lat, s.lon) <= alcanceLocalKm()).reduce((n, s) => n + existenciaEnTienda(productoId, s.id), 0);
}

/**
 * Origen de lo "bajo pedido" (D44):
 * - 'foranea': las tiendas que alcanzan el C.P. completan las piezas, pero la mayoría tiene que salir de sucursales
 *   foráneas (más de 30 km), así que puede demorar más de lo normal (2 a 4 días hábiles).
 * - 'cedis': las tiendas no completan las piezas y CEDIS 41 sí.
 * null: no es bajo pedido.
 */
export function origenBajoPedido(productoId: string, cp: string | null, cantidad = 1): 'foranea' | 'cedis' | null {
  if (esSoloLocal(productoId) || !cobertura(cp)) return null;
  const local = existenciaLocal(productoId, cp);
  if (local >= cantidad) return null;
  const enLinea = existenciaEnLinea(productoId, cp);
  if (enLinea >= cantidad) return cantidad - local > cantidad / 2 ? 'foranea' : null;
  return enLinea + piezasCedis(productoId) >= cantidad ? 'cedis' : null;
}

/** Piezas que se pueden comprar en línea para un C.P.: tiendas que lo alcanzan (baterías: solo locales); sin CEDIS. */
export function existenciaEnLinea(productoId: string, cp: string | null = null): number {
  return tiendasQueSurten(productoId, cp).reduce((n, s) => n + existenciaEnTienda(productoId, s.id), 0);
}

/** Piezas en todas las tiendas (sin CEDIS): "104 pzs" en la tarjeta del catálogo 2026. */
export const piezasEnTiendas = (productoId: string) => existenciaEnLinea(productoId, null);

/**
 * Estado de existencia que ve el cliente (Autex_2026_Frames): disponible si las tiendas que alcanzan su C.P. tienen
 * piezas suficientes y la mayoría sale de tiendas locales; bajo pedido (entrega de 2 a 4 días hábiles) si la mayoría
 * sale de sucursales foráneas o si solo CEDIS 41 las completa; sin existencia si nadie las tiene o el C.P. no tiene
 * cobertura (caja gris, spec 001). Baterías: nunca bajo pedido.
 */
export function estadoExistencia(productoId: string, cp: string | null, cantidad = 1): 'disponible' | 'bajo-pedido' | 'sin-existencia' {
  if (origenBajoPedido(productoId, cp, cantidad)) return 'bajo-pedido';
  return existenciaEnLinea(productoId, cp) >= cantidad ? 'disponible' : 'sin-existencia';
}

/** Etiqueta de existencia por rangos, como el sitio: "+100", "+50", "+30", "+10" o la cantidad exacta. */
export function etiquetaExistencia(n: number): string {
  const rango = [100, 50, 30, 10].find((r) => n >= r);
  return rango ? `+${rango}` : String(n);
}

/**
 * Piezas que se pueden vender en línea (D39): las de las tiendas que alcanzan el C.P.; si no hay en tiendas (bajo
 * pedido), las de CEDIS. Baterías: solo las locales.
 */
export function maximoVenta(productoId: string, cp: string | null): number {
  const enLinea = existenciaEnLinea(productoId, cp);
  if (enLinea > 0 || esSoloLocal(productoId) || !cobertura(cp)) return enLinea;
  return piezasCedis(productoId);
}
