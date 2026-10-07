/**
 * Tiendas Autex y ubicación de entrega (sin respaldo en Figma, sin conexión al servicio real de SMC 4.0).
 * - Tiendas: las 46 de autex.com.mx/sucursales más las de configuracion-servicios-smc.json que no aparecen en el sitio.
 * - Servicios: todas las tiendas tienen Local, Local Extendido y Foráneo con los valores de la tienda "acapulco"
 *   de configuracion-servicios-smc.json (decisión del usuario, 2026-10-06).
 * - Códigos postales: sin catálogo de SEPOMEX; se reconoce el C.P. de cada tienda, unos C.P. de ejemplo y, para el
 *   resto, la zona por los dos primeros dígitos (ciudad representativa, ubicación aproximada).
 */
import config from './configuracion-servicios-smc.json';
import { haversine } from './geo';
import { SUCURSALES_AUTEX } from './sucursales';
import { calleCompleta, type DireccionEntrega, type Ubicacion } from './clientes';

export type Servicio = (typeof config.sucursales)[number]['servicios'][number];

/** Servicios de la tienda "acapulco" (configuracion-servicios-smc.json), ordenados por nivel. */
export const SERVICIOS: Servicio[] = [...config.sucursales.find((s) => s.id === 'acapulco')!.servicios].sort((a, b) => a.orden - b.orden);
export const ALCANCE_MAXIMO_KM = Math.max(...SERVICIOS.filter((s) => s.activo).map((s) => s.distanciaMaximaKm));

export type Tienda = {
  id: string;
  nombre: string;
  direccion: string;
  cp: string | null;
  ciudad: string;
  estado: string;
  horario: string | null;
  telefono: string | null;
  lat: number;
  lon: number;
};

const slug = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Coordenadas aproximadas por tienda del sitio (centro de la colonia o de la ciudad). */
const COORDS: Record<string, [number, number]> = {
  'CDMX Cuauhtemoc': [19.4555, -99.1405],
  'Mexicali Lazaro Cardenas': [32.6110, -115.4120],
  'Tijuana la Curva': [32.5160, -117.0090],
  'Mexicali Colegio Militar': [32.6330, -115.4720],
  'Tijuana 5 y 10': [32.4970, -116.9640],
  'San Jose del Cabo': [23.0650, -109.7000],
  'Saltillo': [25.4230, -101.0000],
  'Tuxtla Moto Partes': [16.7530, -93.1160],
  'Tapachula Moto Partes': [14.9060, -92.2630],
  'Chihuahua Churubusco': [28.6560, -106.0890],
  'Chihuahua Cuauhtemoc': [28.4060, -106.8670],
  'Ciudad Juarez Oscar Flores': [31.7050, -106.4380],
  'Leon Moto Partes': [21.1150, -101.6700],
  'Tulancingo': [20.0850, -98.3630],
  'Tesistan': [20.7965, -103.4776],
  'Federalismo': [20.6930, -103.3530],
  'Belisario Dominguez': [20.6930, -103.3260],
  'Colon': [20.6440, -103.3550],
  'Adolf Horn': [20.6015, -103.2856],
  'Mercado Libre Adolf Horn': [20.6030, -103.2880],
  'Forum Tlaquepaque': [20.6400, -103.3100],
  'Toluca Pino Suarez': [19.2830, -99.6440],
  'Neza': [19.4000, -99.0150],
  'Ojo de Agua': [19.6830, -99.0090],
  'Uruapan': [19.4210, -102.0630],
  'Zamora': [19.9860, -102.2840],
  'Escobedo Raúl Salinas Lozano': [25.7930, -100.3130],
  'Guadalupe': [25.6780, -100.2290],
  'Monterrey Ruiz': [25.6950, -100.3350],
  'Monterrey Lincoln': [25.7180, -100.3720],
  'Apodaca': [25.7810, -100.1880],
  'Oaxaca Madero': [17.0760, -96.7300],
  'Ciudad Valles SLP': [21.9850, -99.0100],
  'Guasave': [25.5680, -108.4700],
  'San Luis Rio Colorado': [32.4560, -114.7720],
  'Hermosillo Quiroga': [29.0560, -110.9900],
  'Hermosillo Periferico': [29.1000, -110.9700],
  'Tampico 2 Centro': [22.2160, -97.8580],
  'Nuevo Laredo': [27.4780, -99.5160],
  'Tampico 1 Norte': [22.2800, -97.8700],
  'Veracruz Diaz Miron': [19.1830, -96.1400],
};

/** Las tiendas que también están en la configuración de SMC toman sus coordenadas de ahí. */
const DE_CONFIG: Record<string, string> = {
  'Acapulco Constituyentes': 'acapulco-constituyentes',
  'Ciudad del Carmen': 'ciudad-del-carmen',
  Comitan: 'comitan',
  'Leon Torres Landa': 'leon-torres-landa',
  Salamanca: 'salamanca',
};
const ESTADOS_CONFIG: Record<string, string> = { 'Distrito Federal': 'Ciudad de México' };

const delSitio: Tienda[] = SUCURSALES_AUTEX.map((s) => {
  const c = config.sucursales.find((x) => x.id === DE_CONFIG[s.nombre]);
  const [lat, lon] = c ? [c.lat, c.lng] : COORDS[s.nombre];
  /* "1593": la dirección del sitio no trae ciudad (Tuxtla Gutiérrez). */
  return { id: slug(s.nombre), nombre: s.nombre, direccion: s.direccion, cp: s.cp, ciudad: s.ciudad === '1593' ? 'Tuxtla Gutiérrez' : s.ciudad, estado: s.estado, horario: s.horario, telefono: s.telefono, lat, lon };
});

const soloConfig: Tienda[] = config.sucursales
  .filter((c) => !Object.values(DE_CONFIG).includes(c.id))
  .map((c) => {
    const estado = ESTADOS_CONFIG[c.estado] ?? c.estado;
    return { id: c.id, nombre: c.nombre, direccion: `${c.municipio}, ${estado}`, cp: null, ciudad: c.municipio, estado, horario: null, telefono: null, lat: c.lat, lon: c.lng };
  });

export const TIENDAS: Tienda[] = [...delSitio, ...soloConfig];
export const ESTADOS_CON_TIENDA = [...new Set(TIENDAS.map((t) => t.estado))].sort((a, b) => a.localeCompare(b, 'es'));

/* ---------- Ubicación de entrega ---------- */

export type UbicacionEntrega = Ubicacion & { lat: number; lon: number; aproximada: boolean };

type Zona = { ciudad: string; estado: string; lat: number; lon: number };
const z = (ciudad: string, estado: string, lat: number, lon: number): Zona => ({ ciudad, estado, lat, lon });
const CDMX = z('Ciudad de México', 'Ciudad de México', 19.4326, -99.1332);

/** Zona por los dos primeros dígitos del C.P. (ciudad representativa). */
const ZONAS: Record<string, Zona> = {
  ...Object.fromEntries(Array.from({ length: 16 }, (_, i) => [String(i + 1).padStart(2, '0'), CDMX])),
  '20': z('Aguascalientes', 'Aguascalientes', 21.8818, -102.2916),
  '21': z('Mexicali', 'Baja California', 32.6245, -115.4523),
  '22': z('Tijuana', 'Baja California', 32.5149, -117.0382),
  '23': z('La Paz', 'Baja California Sur', 24.1426, -110.3128),
  '24': z('Campeche', 'Campeche', 19.8301, -90.5349),
  '25': z('Saltillo', 'Coahuila de Zaragoza', 25.4232, -101.0053),
  '26': z('Monclova', 'Coahuila de Zaragoza', 26.908, -101.4215),
  '27': z('Torreón', 'Coahuila de Zaragoza', 25.5428, -103.4068),
  '28': z('Colima', 'Colima', 19.2433, -103.725),
  '29': z('Tuxtla Gutiérrez', 'Chiapas', 16.7516, -93.1161),
  '30': z('Tapachula', 'Chiapas', 14.9056, -92.2633),
  '31': z('Chihuahua', 'Chihuahua', 28.632, -106.0691),
  '32': z('Juárez', 'Chihuahua', 31.6904, -106.4245),
  '33': z('Delicias', 'Chihuahua', 28.19, -105.47),
  '34': z('Durango', 'Durango', 24.0277, -104.6532),
  '35': z('Gómez Palacio', 'Durango', 25.5611, -103.4983),
  '36': z('Irapuato', 'Guanajuato', 20.6767, -101.3563),
  '37': z('León', 'Guanajuato', 21.125, -101.686),
  '38': z('Celaya', 'Guanajuato', 20.5235, -100.8157),
  '39': z('Acapulco de Juárez', 'Guerrero', 16.8531, -99.8237),
  '40': z('Iguala', 'Guerrero', 18.3448, -99.5399),
  '41': z('Tlapa', 'Guerrero', 17.5459, -98.5755),
  '42': z('Pachuca', 'Hidalgo', 20.1011, -98.7591),
  '43': z('Tulancingo', 'Hidalgo', 20.0853, -98.3633),
  '44': z('Guadalajara', 'Jalisco', 20.6597, -103.3496),
  '45': z('Zapopan', 'Jalisco', 20.672, -103.416),
  '46': z('Ameca', 'Jalisco', 20.5478, -104.047),
  '47': z('Tepatitlán', 'Jalisco', 20.817, -102.763),
  '48': z('Puerto Vallarta', 'Jalisco', 20.6534, -105.2253),
  '49': z('Ciudad Guzmán', 'Jalisco', 19.7044, -103.4614),
  '50': z('Toluca', 'México', 19.2826, -99.6557),
  '51': z('Valle de Bravo', 'México', 19.1951, -100.1312),
  '52': z('Metepec', 'México', 19.2513, -99.6047),
  '53': z('Naucalpan', 'México', 19.4785, -99.2396),
  '54': z('Tlalnepantla', 'México', 19.5401, -99.195),
  '55': z('Ecatepec', 'México', 19.601, -99.05),
  '56': z('Chalco', 'México', 19.2647, -98.8975),
  '57': z('Nezahualcóyotl', 'México', 19.4006, -99.0148),
  '58': z('Morelia', 'Michoacán de Ocampo', 19.706, -101.195),
  '59': z('Zamora', 'Michoacán de Ocampo', 19.9855, -102.284),
  '60': z('Uruapan', 'Michoacán de Ocampo', 19.421, -102.063),
  '61': z('Zitácuaro', 'Michoacán de Ocampo', 19.4362, -100.3573),
  '62': z('Cuernavaca', 'Morelos', 18.9242, -99.2216),
  '63': z('Tepic', 'Nayarit', 21.5042, -104.8946),
  '64': z('Monterrey', 'Nuevo León', 25.6866, -100.3161),
  '65': z('Montemorelos', 'Nuevo León', 25.1872, -99.8275),
  '66': z('San Nicolás de los Garza', 'Nuevo León', 25.75, -100.28),
  '67': z('Guadalupe', 'Nuevo León', 25.6775, -100.2597),
  '68': z('Oaxaca de Juárez', 'Oaxaca', 17.0732, -96.7266),
  '69': z('Oaxaca de Juárez', 'Oaxaca', 17.0732, -96.7266),
  '70': z('Juchitán', 'Oaxaca', 16.433, -95.019),
  '71': z('Puerto Escondido', 'Oaxaca', 15.872, -97.0767),
  '72': z('Puebla', 'Puebla', 19.0414, -98.2063),
  '73': z('Teziutlán', 'Puebla', 19.8173, -97.3594),
  '74': z('Atlixco', 'Puebla', 18.9088, -98.4366),
  '75': z('Tehuacán', 'Puebla', 18.4617, -97.3928),
  '76': z('Querétaro', 'Querétaro', 20.5888, -100.3899),
  '77': z('Cancún', 'Quintana Roo', 21.1619, -86.8515),
  '78': z('San Luis Potosí', 'San Luis Potosí', 22.1565, -100.9855),
  '79': z('Ciudad Valles', 'San Luis Potosí', 21.985, -99.01),
  '80': z('Culiacán', 'Sinaloa', 24.8091, -107.394),
  '81': z('Los Mochis', 'Sinaloa', 25.7904, -108.9858),
  '82': z('Mazatlán', 'Sinaloa', 23.2494, -106.4111),
  '83': z('Hermosillo', 'Sonora', 29.0729, -110.9559),
  '84': z('Nogales', 'Sonora', 31.3086, -110.9422),
  '85': z('Ciudad Obregón', 'Sonora', 27.4828, -109.9304),
  '86': z('Villahermosa', 'Tabasco', 17.9892, -92.9475),
  '87': z('Ciudad Victoria', 'Tamaulipas', 23.7369, -99.1411),
  '88': z('Reynosa', 'Tamaulipas', 26.0508, -98.2979),
  '89': z('Tampico', 'Tamaulipas', 22.2331, -97.8611),
  '90': z('Tlaxcala', 'Tlaxcala', 19.3182, -98.2375),
  '91': z('Veracruz', 'Veracruz de Ignacio de la Llave', 19.1738, -96.1342),
  '92': z('Tuxpan', 'Veracruz de Ignacio de la Llave', 20.9567, -97.4058),
  '93': z('Poza Rica', 'Veracruz de Ignacio de la Llave', 20.533, -97.459),
  '94': z('Córdoba', 'Veracruz de Ignacio de la Llave', 18.8842, -96.9256),
  '95': z('San Andrés Tuxtla', 'Veracruz de Ignacio de la Llave', 18.4483, -95.2131),
  '96': z('Coatzacoalcos', 'Veracruz de Ignacio de la Llave', 18.1345, -94.459),
  '97': z('Mérida', 'Yucatán', 20.9674, -89.5926),
  '98': z('Zacatecas', 'Zacatecas', 22.7709, -102.5833),
  '99': z('Fresnillo', 'Zacatecas', 23.1747, -102.8697),
};

/** C.P. con ubicación conocida: el de cada tienda del sitio y unos de ejemplo. */
const CONOCIDOS: Record<string, Zona> = {
  ...Object.fromEntries(delSitio.filter((t) => t.cp).map((t) => [t.cp, z(t.ciudad, t.estado, t.lat, t.lon)])),
  '44100': z('Guadalajara', 'Jalisco', 20.6767, -103.3475),
  '45040': z('Zapopan', 'Jalisco', 20.6681, -103.3994),
  '45500': z('San Pedro Tlaquepaque', 'Jalisco', 20.6409, -103.3123),
  '44400': z('Guadalajara', 'Jalisco', 20.6668, -103.3318),
  '45412': z('Tonalá', 'Jalisco', 20.6236, -103.2426),
  '45190': z('Zapopan', 'Jalisco', 20.7104, -103.3633),
  '64000': z('Monterrey', 'Nuevo León', 25.6714, -100.3089),
  '04870': z('Coyoacán', 'Ciudad de México', 19.301, -99.139),
};

/** C.P. que se usa mientras el cliente no elige otro (decisión del usuario, 2026-10-06): tienda Tesistán, Zapopan. */
export const CP_PREDETERMINADO = '45138';

/** Ubicación de entrega a partir de un C.P. de 5 dígitos; null si el C.P. no existe en México. */
export function resolverCP(cp: string): UbicacionEntrega | null {
  if (!/^\d{5}$/.test(cp)) return null;
  const conocido = CONOCIDOS[cp];
  const zona = conocido ?? ZONAS[cp.slice(0, 2)];
  if (!zona) return null;
  return {
    codigoPostal: cp,
    etiqueta: `C.P. ${cp}, ${zona.ciudad}`,
    detalle: `${zona.ciudad}, ${zona.estado}`,
    ciudad: zona.ciudad,
    estado: zona.estado,
    lat: zona.lat,
    lon: zona.lon,
    aproximada: !conocido,
  };
}

/** Ubicación de entrega a partir de las coordenadas del navegador: se toma el C.P. conocido más cercano. */
export function ubicacionDesdeCoordenadas(lat: number, lon: number): UbicacionEntrega {
  const [cp] = Object.entries(CONOCIDOS).sort(([, a], [, b]) => haversine(lat, lon, a.lat, a.lon) - haversine(lat, lon, b.lat, b.lon))[0];
  return { ...resolverCP(cp)!, lat, lon, aproximada: false, detalle: 'Mi ubicación actual' };
}

export const UBICACION_PREDETERMINADA = resolverCP(CP_PREDETERMINADO)!;
/** Ubicación de entrega a partir de una dirección guardada: etiqueta con su nombre y coordenadas de su C.P. */
export function ubicacionDeDireccion(d: DireccionEntrega): UbicacionEntrega {
  const u = resolverCP(d.codigoPostal) ?? UBICACION_PREDETERMINADA;
  return { ...u, codigoPostal: d.codigoPostal, etiqueta: d.nombre, detalle: `${calleCompleta(d)}, ${d.colonia}`, ciudad: d.ciudad, estado: d.estado };
}

/** "Mi ubicación actual" cuando el navegador no tiene permiso real: centro de Guadalajara (C.P. 44100). */
export const UBICACION_SIMULADA = ubicacionDesdeCoordenadas(20.6767, -103.3475);

/** Coordenadas de una ubicación: las propias (navegador o C.P. resuelto) o las de su C.P. */
export function coordenadas(u: Ubicacion): { lat: number; lon: number } | null {
  const c = u as Partial<UbicacionEntrega>;
  return typeof c.lat === 'number' && typeof c.lon === 'number' ? { lat: c.lat, lon: c.lon } : resolverCP(u.codigoPostal);
}

/* ---------- Zona de entrega (D43) ---------- */

/** Municipios conurbados: el carrito dice "Guadalajara y sus alrededores" aunque el C.P. sea de Zapopan. */
const ZONAS_METROPOLITANAS: Record<string, string> = {
  Zapopan: 'Guadalajara',
  'San Pedro Tlaquepaque': 'Guadalajara',
  Tlaquepaque: 'Guadalajara',
  'Tonalá': 'Guadalajara',
  'Tlajomulco de Zúñiga': 'Guadalajara',
  'El Salto': 'Guadalajara',
  Guadalupe: 'Monterrey',
  Apodaca: 'Monterrey',
  'San Nicolás de los Garza': 'Monterrey',
  'General Escobedo': 'Monterrey',
  Escobedo: 'Monterrey',
  'Santa Catarina': 'Monterrey',
  'San Pedro Garza García': 'Monterrey',
  'Coyoacán': 'Ciudad de México',
  'Nezahualcóyotl': 'Ciudad de México',
  Ecatepec: 'Ciudad de México',
  'Tlalnepantla': 'Ciudad de México',
  'Naucalpan': 'Ciudad de México',
};

/** Ciudad de la zona de entrega ("Guadalajara" para Zapopan, Tlaquepaque, Tonalá…). */
export const zonaEntrega = (u: Ubicacion) => ZONAS_METROPOLITANAS[u.ciudad] ?? u.ciudad;

/* ---------- Distancias y nivel de servicio ---------- */

export type TiendaCercana = Tienda & { km: number; servicio: Servicio | null };

/** Nivel de servicio: el primero (por orden) cuya distancia máxima cubre la distancia a la tienda. */
export const servicioPara = (km: number) => SERVICIOS.find((s) => s.activo && km <= s.distanciaMaximaKm) ?? null;

export function tiendasCercanas(u: { lat: number; lon: number }): TiendaCercana[] {
  return TIENDAS.map((t) => {
    const km = haversine(u.lat, u.lon, t.lat, t.lon);
    return { ...t, km, servicio: servicioPara(km) };
  }).sort((a, b) => a.km - b.km);
}

export const tiendaMasCercana = (u: { lat: number; lon: number }) => tiendasCercanas(u)[0];

/* ---------- Horario ---------- */

const minutos = (h: string) => {
  const m = h.match(/(\d{1,2}):(\d{2})\s*([AP])/i);
  if (!m) return null;
  let hh = Number(m[1]);
  if (m[3].toUpperCase() === 'P' && hh < 12) hh += 12;
  return hh * 60 + Number(m[2]);
};
const hora12 = (min: number) => {
  const h = Math.floor(min / 60);
  const mm = String(min % 60).padStart(2, '0');
  return `${h % 12 || 12}:${mm} ${h < 12 ? 'a.m.' : 'p.m.'}`;
};

/** Abierto o cerrado según la hora actual; el sitio solo da un horario (se toma de lunes a sábado). */
export function estadoHorario(horario: string | null, ahora = new Date()) {
  const [ini, fin] = (horario ?? '').split('-').map((x) => minutos(x));
  if (ini == null || fin == null) return { abierto: null, texto: 'Horario no disponible', corto: 'Horario no disponible', horario: null };
  const m = ahora.getHours() * 60 + ahora.getMinutes();
  const habil = ahora.getDay() !== 0;
  const abierto = habil && m >= ini && m < fin;
  return {
    abierto,
    texto: abierto ? `Cierra ${hora12(fin)}` : `Abre ${hora12(ini)}`,
    corto: abierto ? `Abierto hasta las ${hora12(fin)}` : `Cerrado · abre ${hora12(ini)}`,
    horario: `${hora12(ini)} - ${hora12(fin)}`,
  };
}

export const formatoKm = (n: number) => `${n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;

/* ---------- Tiempo de entrega (D38) ---------- */

/** Hora límite para la entrega Local el mismo día (14:00). */
export const HORA_LIMITE_MISMO_DIA = 14;

/**
 * Texto de entrega de un servicio. Local: el mismo día si la compra se hace antes de las 2:00 p.m.; después, al día
 * siguiente. Con `general` se da la regla sin depender de la hora (panel de tiendas).
 */
export function textoEntrega(servicio: Servicio | null, ahora = new Date(), general = false): string {
  if (!servicio) return 'Entrega de 2 a 4 días hábiles';
  if (servicio.tiempoEntrega !== 'Mismo dia') return `Entrega en ${servicio.tiempoEntrega}`;
  if (general) return 'Entrega el mismo día en compras antes de las 2:00 p.m.';
  return ahora.getHours() < HORA_LIMITE_MISMO_DIA ? 'Entrega hoy (compra antes de las 2:00 p.m.)' : 'Entrega mañana (después de las 2:00 p.m.)';
}
