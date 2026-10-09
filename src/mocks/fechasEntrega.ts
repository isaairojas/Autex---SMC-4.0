/**
 * Fechas estimadas de entrega (sin respaldo en Figma, D57). Se cuentan días hábiles: sin sábados, domingos ni días de
 * descanso obligatorio (LFT, art. 74); si la fecha cae en uno de ellos, salta al siguiente día hábil (spec 001).
 *  - Local: hoy si la compra es en día hábil antes de las 2:00 p.m.; si no, el siguiente día hábil.
 *  - Local Extendido: 2 días hábiles después de la compra (compra el miércoles → entrega el viernes).
 *  - Foráneo y bajo pedido: de 2 a 4 días hábiles (compra el miércoles → entre el viernes y el martes).
 */
import type { Servicio } from './tiendas';

export type RangoEntrega = { desde: Date; hasta: Date };

/** Hora límite para la entrega Local el mismo día (14:00). */
export const HORA_LIMITE_MISMO_DIA = 14;

const DIA = 86400000;
const soloFecha = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** n-ésimo lunes de un mes (mes 0–11). */
function lunes(anio: number, mes: number, n: number) {
  const primero = new Date(anio, mes, 1).getDay();
  return 1 + ((8 - primero) % 7) + (n - 1) * 7;
}

/** Días de descanso obligatorio del año (LFT, art. 74), como "mes-día". */
function festivos(anio: number) {
  const f = [
    [0, 1],
    [1, lunes(anio, 1, 1)],
    [2, lunes(anio, 2, 3)],
    [4, 1],
    [8, 16],
    [10, lunes(anio, 10, 3)],
    [11, 25],
  ];
  /* Transmisión del Poder Ejecutivo Federal: 1 de octubre cada seis años (2030, 2036…). */
  if ((anio - 2024) % 6 === 0) f.push([9, 1]);
  return new Set(f.map(([m, d]) => `${m}-${d}`));
}

export function esDiaHabil(d: Date) {
  const dia = d.getDay();
  return dia !== 0 && dia !== 6 && !festivos(d.getFullYear()).has(`${d.getMonth()}-${d.getDate()}`);
}

/** Siguiente día hábil a partir de d (incluido). */
const habilDesde = (d: Date) => {
  let x = soloFecha(d);
  while (!esDiaHabil(x)) x = new Date(x.getTime() + DIA);
  return x;
};

export function sumarDiasHabiles(d: Date, n: number) {
  let x = soloFecha(d);
  for (let i = 0; i < n; ) {
    x = new Date(x.getFullYear(), x.getMonth(), x.getDate() + 1);
    if (esDiaHabil(x)) i++;
  }
  return x;
}

/** Rango de entrega de un servicio de SMC 4.0; sin servicio o bajo pedido, de 2 a 4 días hábiles. */
export function rangoEntrega(servicio: Servicio | null, bajoPedido = false, ahora = new Date()): RangoEntrega {
  if (!bajoPedido && servicio?.tiempoEntrega === 'Mismo dia') {
    const hoy = esDiaHabil(ahora) && ahora.getHours() < HORA_LIMITE_MISMO_DIA ? soloFecha(ahora) : habilDesde(new Date(ahora.getTime() + DIA));
    return { desde: hoy, hasta: hoy };
  }
  if (!bajoPedido && servicio?.tiempoEntrega === '24 horas') {
    const d = sumarDiasHabiles(ahora, 2);
    return { desde: d, hasta: d };
  }
  return { desde: sumarDiasHabiles(ahora, 2), hasta: sumarDiasHabiles(ahora, 4) };
}

/** Rango que cubre varios envíos: del más próximo al más tardado. */
export function unirRangos(rangos: RangoEntrega[]): RangoEntrega | null {
  if (!rangos.length) return null;
  const desde = new Date(Math.min(...rangos.map((r) => r.desde.getTime())));
  const hasta = new Date(Math.max(...rangos.map((r) => r.hasta.getTime())));
  return { desde, hasta };
}

const mismoDia = (a: Date, b: Date) => soloFecha(a).getTime() === soloFecha(b).getTime();

/** "hoy", "mañana", "el viernes 9" o "el viernes 9 de octubre". */
function fecha(d: Date, ahora: Date, conMes = true) {
  if (mismoDia(d, ahora)) return 'hoy';
  if (mismoDia(d, new Date(ahora.getTime() + DIA))) return 'mañana';
  const dia = d.toLocaleDateString('es-MX', { weekday: 'long' });
  const mes = d.toLocaleDateString('es-MX', { month: 'long' });
  return `el ${dia} ${d.getDate()}${conMes ? ` de ${mes}` : ''}`;
}

/** "Entrega hoy", "Entrega mañana", "Entrega el viernes 9 de octubre" o "Entrega entre el viernes 9 y el martes 13 de octubre". */
export function textoRango(r: RangoEntrega, ahora = new Date()): string {
  if (mismoDia(r.desde, r.hasta)) return `Entrega ${fecha(r.desde, ahora)}`;
  const mismoMes = r.desde.getMonth() === r.hasta.getMonth();
  return `Entrega entre ${fecha(r.desde, ahora, !mismoMes)} y ${fecha(r.hasta, ahora)}`;
}
