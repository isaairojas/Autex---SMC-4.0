/**
 * Envíos múltiples del pedido (sin respaldo en Figma, D35/D41). SMC 4.0 surte cada artículo desde la tienda más
 * cercana a la entrega que tenga las piezas; los artículos de una misma tienda viajan en el mismo envío, así que el
 * pedido se divide solo cuando la tienda más cercana no tiene todo.
 * CEDIS 41 no es origen de envío ni cuenta para la venta en línea (D35, D45).
 * D44: lo que es bajo pedido porque la zona no completa las piezas sale de la sucursal foránea en un envío aparte,
 * marcado como foráneo (2 a 4 días hábiles; puede demorar más de lo normal).
 * D49: solo se buscan las tiendas Local y Local Extendido más la foránea más cercana (parametrizable), así que cuando
 * mucho hay un envío foráneo; lo disponible sale primero de las tiendas locales.
 */
import type { EstadoExistencia, LineaCarrito } from './productos';
import { alcanceLocalKm, existenciaEnTienda, redDeEntrega } from './existencias';
import { rangoEntrega, textoRango, type RangoEntrega } from './fechasEntrega';
import { servicioPara } from './tiendas';

export type Envio = {
  numero: number;
  sucursal: string;
  direccion: string | null;
  bajoPedido: boolean;
  /** D44: sale de una sucursal foránea (más de 30 km de la entrega). */
  foranea: boolean;
  /** D57: "Entrega hoy", "Entrega mañana", "Entrega el viernes 9 de octubre", "Entrega entre el viernes 9 y el martes 13 de octubre". */
  tiempo: string;
  /** D57: fechas estimadas (días hábiles) para el encabezado de la sección. */
  rango: RangoEntrega;
  lineas: LineaCarrito[];
};

export function repartirEnvios(lineas: LineaCarrito[], entrega: { lat: number; lon: number }, estado: (id: string) => EstadoExistencia): Envio[] {
  const sucursales = redDeEntrega(entrega);
  if (!sucursales.length) return [];
  const inmediatos = new Map<string, LineaCarrito[]>();
  const pedidos = new Map<string, LineaCarrito[]>();
  const sumar = (m: Map<string, LineaCarrito[]>, id: string, l: LineaCarrito) => m.set(id, [...(m.get(id) ?? []), l]);
  for (const l of lineas) {
    const id = l.producto.id;
    const e = estado(id);
    if (e === 'sin-existencia') continue;
    let faltan = l.cantidad;
    const enAlcance = redDeEntrega(entrega, id);
    const enTiendas = enAlcance.reduce((n, s) => n + existenciaEnTienda(id, s.id), 0);
    if (e === 'bajo-pedido' && enTiendas >= faltan) {
      /* D49: las tiendas locales envían lo que tienen con su tiempo normal y solo lo que falta sale bajo pedido de la
         sucursal foránea (un solo envío foráneo). La red ya viene con las locales primero. */
      for (const s of enAlcance) {
        const toma = Math.min(faltan, existenciaEnTienda(id, s.id));
        if (toma <= 0) continue;
        sumar(s.km > alcanceLocalKm() ? pedidos : inmediatos, s.id, { ...l, cantidad: toma });
        faltan -= toma;
        if (!faltan) break;
      }
    }
    if (e === 'disponible') {
      /* Primero la tienda local más cercana que tenga todas las piezas; si ninguna, se juntan de las más cercanas. */
      const completa = enAlcance.find((s) => s.km <= alcanceLocalKm() && existenciaEnTienda(id, s.id) >= faltan);
      for (const s of completa ? [completa] : enAlcance) {
        const toma = Math.min(faltan, existenciaEnTienda(id, s.id));
        if (toma <= 0) continue;
        sumar(inmediatos, s.id, { ...l, cantidad: toma });
        faltan -= toma;
        if (!faltan) break;
      }
    }
    /* Respaldo (no debería ocurrir: el carrito solo deja vender lo que las tiendas completan). */
    if (faltan > 0) sumar(pedidos, sucursales[0].id, { ...l, cantidad: faltan });
  }
  const envio = (id: string, ls: LineaCarrito[], bajoPedido: boolean) => {
    const s = sucursales.find((x) => x.id === id)!;
    /* D57: Local hoy (antes de las 2:00 p.m.) o el siguiente día hábil; Local Extendido a 2 días hábiles; foráneo y bajo
       pedido de 2 a 4 días hábiles. */
    const rango = rangoEntrega(servicioPara(s.km), bajoPedido);
    return {
      sucursal: s.nombre,
      direccion: s.direccion,
      bajoPedido,
      foranea: s.km > alcanceLocalKm(),
      tiempo: textoRango(rango),
      rango,
      lineas: ls,
    };
  };
  /* Primero lo de entrega inmediata y al final lo bajo pedido. */
  return [...[...inmediatos].map(([id, ls]) => envio(id, ls, false)), ...[...pedidos].map(([id, ls]) => envio(id, ls, true))].map((e, i) => ({ ...e, numero: i + 1 }));
}
