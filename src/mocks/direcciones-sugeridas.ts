/**
 * Sugerencias de direcciones mientras el cliente escribe (sin respaldo en Figma, D51). Simula el autocompletado de
 * Google Places: la demo no tiene clave de Google Maps ni puede cargar scripts externos, así que sugiere calles de
 * ejemplo de las zonas de la demo (Guadalajara, Zapopan, Tlaquepaque, Monterrey, León y Ciudad de México).
 * Al elegir una se llenan calle, número (si se escribió), C.P. y colonia; ciudad y estado salen del C.P.
 */
import { coloniasDe } from './colonias';
import { resolverCP } from './tiendas';

type Calle = { calle: string; colonia: string; codigoPostal: string };

const CALLES: Calle[] = [
  { calle: 'Av. Guadalupe', colonia: 'Chapalita', codigoPostal: '45040' },
  { calle: 'Av. Tepeyac', colonia: 'Chapalita', codigoPostal: '45040' },
  { calle: 'Av. de las Rosas', colonia: 'Chapalita', codigoPostal: '45040' },
  { calle: 'Av. López Mateos Sur', colonia: 'Jardines de Guadalupe', codigoPostal: '45040' },
  { calle: 'Calz. del Federalismo Nte', colonia: 'Mezquitan Country', codigoPostal: '44260' },
  { calle: 'Av. Manuel Ávila Camacho', colonia: 'Mezquitán', codigoPostal: '44260' },
  { calle: 'Av. Juárez', colonia: 'Guadalajara Centro', codigoPostal: '44100' },
  { calle: 'Av. Hidalgo', colonia: 'Guadalajara Centro', codigoPostal: '44100' },
  { calle: 'Calz. Independencia Nte', colonia: 'Oblatos', codigoPostal: '44400' },
  { calle: 'Av. Niños Héroes', colonia: 'San Pedro Tlaquepaque Centro', codigoPostal: '45500' },
  { calle: 'Av. Tesistán', colonia: 'Nuevo México', codigoPostal: '45138' },
  { calle: 'Av. Aviación', colonia: 'Jardines Del Valle', codigoPostal: '45138' },
  { calle: 'Av. Santa Margarita', colonia: 'Santa Margarita Residencial', codigoPostal: '45138' },
  { calle: 'Av. Constitución', colonia: 'Monterrey Centro', codigoPostal: '64000' },
  { calle: 'Av. Benito Juárez', colonia: 'Centro', codigoPostal: '64000' },
  { calle: 'Calz. Francisco I. Madero', colonia: 'Centro', codigoPostal: '64000' },
  { calle: 'Blvd. Adolfo López Mateos', colonia: 'Centro', codigoPostal: '37000' },
  { calle: 'Blvd. Juan Alonso de Torres', colonia: 'Centro', codigoPostal: '37530' },
  { calle: 'Paseo de la Reforma', colonia: 'Centro', codigoPostal: '06000' },
  { calle: 'Av. Insurgentes Sur', colonia: 'Centro', codigoPostal: '06920' },
];

export type SugerenciaDireccion = {
  calle: string;
  numeroExterior: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  estado: string;
  /** Línea principal ("Av. Guadalupe 1144") y secundaria ("Chapalita, 45040 Zapopan, Jalisco, México"). */
  principal: string;
  secundario: string;
};

const normalizar = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ');

/**
 * Sugerencias para lo escrito: cada palabra debe empezar alguna palabra de la calle, colonia o ciudad; un número de 5
 * dígitos filtra por C.P. y otro número se toma como número exterior. Hacen falta al menos 3 letras.
 */
export function sugerirDirecciones(texto: string, maximo = 5): SugerenciaDireccion[] {
  const tokens = normalizar(texto).split(/\s+/).filter(Boolean);
  const cp = tokens.find((t) => /^\d{5}$/.test(t));
  const numero = tokens.find((t) => /^\d{1,4}[a-z]?$/.test(t)) ?? '';
  const palabras = tokens.filter((t) => !/^\d/.test(t));
  if (palabras.join('').length < 3) return [];
  return CALLES.flatMap((c) => {
    const zona = resolverCP(c.codigoPostal);
    if (!zona || !coloniasDe(c.codigoPostal).includes(c.colonia)) return [];
    const hay = normalizar(`${c.calle} ${c.colonia} ${zona.ciudad} ${zona.estado}`).split(/\s+/);
    if (!palabras.every((p) => hay.some((h) => h.startsWith(p))) || (cp && c.codigoPostal !== cp)) return [];
    return [
      {
        calle: c.calle,
        numeroExterior: numero.toUpperCase(),
        colonia: c.colonia,
        codigoPostal: c.codigoPostal,
        ciudad: zona.ciudad,
        estado: zona.estado,
        principal: numero ? `${c.calle} ${numero.toUpperCase()}` : c.calle,
        secundario: `${c.colonia}, ${c.codigoPostal} ${zona.ciudad}, ${zona.estado}, México`,
      },
    ];
  }).slice(0, maximo);
}
