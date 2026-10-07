/**
 * Envíos múltiples del pedido (sin respaldo en Figma, D35/D41). SMC 4.0 surte cada artículo desde la tienda más
 * cercana a la entrega que tenga las piezas; los artículos de una misma tienda viajan en el mismo envío, así que el
 * pedido se divide solo cuando la tienda más cercana no tiene todo.
 * Por regla general CEDIS 41 no es origen de envío (decisión del usuario, 2026-10-06): lo bajo pedido lo surte la
 * tienda más cercana a la entrega, que lo solicita y lo envía (2 a 4 días hábiles).
 * D44: lo que es bajo pedido porque la mayoría de sus piezas está en sucursales foráneas (más de 30 km) sale de esas
 * tiendas en envíos aparte, marcados como foráneos (2 a 4 días hábiles; puede demorar más de lo normal).
 */
import type { EstadoExistencia, LineaCarrito } from './productos';
import { alcanceKm, alcanceLocalKm, existenciaEnTienda, haversine, SUCURSALES_RED, type SucursalRed } from './existencias';
import { ALCANCE_MAXIMO_KM, servicioPara, textoEntrega } from './tiendas';

export type Envio = {
  numero: number;
  sucursal: string;
  direccion: string | null;
  bajoPedido: boolean;
  /** D44: sale de una sucursal foránea (más de 30 km de la entrega). */
  foranea: boolean;
  /** "Entrega hoy…", "Entrega en 24 horas", "Entrega en 48 a 72 horas", "Entrega de 2 a 4 días hábiles". */
  tiempo: string;
  lineas: LineaCarrito[];
};

type Cercana = SucursalRed & { km: number };

export function repartirEnvios(lineas: LineaCarrito[], entrega: { lat: number; lon: number }, estado: (id: string) => EstadoExistencia): Envio[] {
  const sucursales: Cercana[] = SUCURSALES_RED.map((s) => ({ ...s, km: haversine(entrega.lat, entrega.lon, s.lat, s.lon) }))
    .filter((s) => s.km <= ALCANCE_MAXIMO_KM)
    .sort((a, b) => a.km - b.km);
  if (!sucursales.length) return [];
  const inmediatos = new Map<string, LineaCarrito[]>();
  const pedidos = new Map<string, LineaCarrito[]>();
  const sumar = (m: Map<string, LineaCarrito[]>, id: string, l: LineaCarrito) => m.set(id, [...(m.get(id) ?? []), l]);
  for (const l of lineas) {
    const id = l.producto.id;
    const e = estado(id);
    if (e === 'sin-existencia') continue;
    let faltan = l.cantidad;
    const enAlcance = sucursales.filter((s) => s.km <= alcanceKm(id));
    const enTiendas = enAlcance.reduce((n, s) => n + existenciaEnTienda(id, s.id), 0);
    if (e === 'bajo-pedido' && enTiendas >= faltan) {
      /* D44: bajo pedido por sucursales foráneas: primero las foráneas, para que el artículo viaje junto en su propio
         envío; si no alcanzan, se completan con las tiendas locales. */
      const foraneas = enAlcance.filter((s) => s.km > alcanceLocalKm());
      for (const s of [...foraneas, ...enAlcance.filter((x) => !foraneas.includes(x))]) {
        const toma = Math.min(faltan, existenciaEnTienda(id, s.id));
        if (toma <= 0) continue;
        sumar(pedidos, s.id, { ...l, cantidad: toma });
        faltan -= toma;
        if (!faltan) break;
      }
    }
    if (e === 'disponible') {
      /* Primero la tienda más cercana que tenga todas las piezas; si ninguna, se juntan de las más cercanas. */
      const completa = enAlcance.find((s) => existenciaEnTienda(id, s.id) >= faltan);
      for (const s of completa ? [completa] : enAlcance) {
        const toma = Math.min(faltan, existenciaEnTienda(id, s.id));
        if (toma <= 0) continue;
        sumar(inmediatos, s.id, { ...l, cantidad: toma });
        faltan -= toma;
        if (!faltan) break;
      }
    }
    /* Lo que ninguna tienda completa: la más cercana lo solicita a CEDIS y lo envía. */
    if (faltan > 0) sumar(pedidos, sucursales[0].id, { ...l, cantidad: faltan });
  }
  const envio = (id: string, ls: LineaCarrito[], bajoPedido: boolean) => {
    const s = sucursales.find((x) => x.id === id)!;
    return {
      sucursal: s.nombre,
      direccion: s.direccion,
      bajoPedido,
      foranea: s.km > alcanceLocalKm(),
      /* Local: hoy si la compra es antes de las 2:00 p.m.; si no, mañana (D38). */
      tiempo: bajoPedido ? 'Entrega de 2 a 4 días hábiles' : textoEntrega(servicioPara(s.km)),
      lineas: ls,
    };
  };
  /* Primero lo de entrega inmediata y al final lo bajo pedido. */
  return [...[...inmediatos].map(([id, ls]) => envio(id, ls, false)), ...[...pedidos].map(([id, ls]) => envio(id, ls, true))].map((e, i) => ({ ...e, numero: i + 1 }));
}
