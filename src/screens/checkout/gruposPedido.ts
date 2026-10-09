/**
 * SIN RESPALDO EN FIGMA (D54). Reparto del pedido para mostrarlo separado: los envíos a domicilio (por sucursal, D35/D49),
 * lo que se recoge en "Mi tienda" (D43) y lo que quedó sin existencia. Lo usan "Método de envío" de Confirmación y el
 * "Resumen de productos" de la columna derecha.
 */
import { repartirEnvios } from '../../mocks/envios';
import type { LineaCarrito } from '../../mocks/productos';
import { coordenadas, UBICACION_PREDETERMINADA } from '../../mocks/tiendas';
import { useDemo } from '../../state/DemoContext';

export type GrupoResumen = { titulo: string; detalle?: string; lineas: LineaCarrito[] };

export function useGruposPedido() {
  const { carrito, ubicacion, disponibilidad, tienda, modoFigma } = useDemo();
  const aDomicilio = carrito.filter((l) => l.entrega !== 'tienda');
  const recoger = modoFigma ? [] : carrito.filter((l) => l.entrega === 'tienda');
  const sinExistencia = modoFigma ? [] : aDomicilio.filter((l) => disponibilidad(l.producto.id).estado === 'sin-existencia');
  const envios = modoFigma ? [] : repartirEnvios(aDomicilio, (ubicacion && coordenadas(ubicacion)) || UBICACION_PREDETERMINADA, (id) => disponibilidad(id).estado);
  /* Grupos del resumen: solo cuando hay más de una forma de entrega (varios envíos, algo para recoger o sin existencia). */
  const grupos: GrupoResumen[] = [
    ...envios.map((e) => ({ titulo: envios.length > 1 ? `Envío ${e.numero}` : 'Envío a domicilio', detalle: `${e.sucursal} · ${e.tiempo}`, lineas: e.lineas })),
    ...(recoger.length ? [{ titulo: 'Recoger en tienda', detalle: tienda ? `Autex ${tienda.nombre}` : undefined, lineas: recoger }] : []),
    ...(sinExistencia.length ? [{ titulo: 'Sin existencia', detalle: 'No entra en ningún envío', lineas: sinExistencia }] : []),
  ];
  return { envios, recoger, sinExistencia, grupos: grupos.length > 1 ? grupos : null };
}
