/**
 * SIN RESPALDO EN FIGMA (D52). Entrada del cliente registrado a la pasarela de pago:
 *  - Con su información completa (dirección de entrega guardada y tarjeta registrada), todo a domicilio, sin artículos
 *    sin existencia y un solo envío, pasa directo al paso 4 "Confirmación" con el envío y su tarjeta predeterminada (D57).
 *  - Si no, al paso 2 "Método de envío" (o al paso 1 si no tiene direcciones guardadas).
 */
import { useNavigate } from 'react-router-dom';
import { TARJETAS_2026 } from '../../design-system/components/organisms/Pago2026';
import { lineaDireccion } from '../../mocks/clientes';
import { repartirEnvios } from '../../mocks/envios';
import { coordenadas } from '../../mocks/tiendas';
import { useDemo } from '../../state/DemoContext';

export function useIrAlCheckout() {
  const navigate = useNavigate();
  const demo = useDemo();
  return () => {
    const { carrito, direccion, ubicacion, disponibilidad } = demo;
    if (!demo.direcciones.length) {
      demo.conCarga('Preparando tu pedido', 'Calculamos los envíos para tu dirección de entrega…', () => navigate('/checkout/datos'));
      return;
    }
    const u = ubicacion && coordenadas(ubicacion);
    const directo =
      !!direccion &&
      !!u &&
      carrito.length > 0 &&
      carrito.every((l) => l.entrega !== 'tienda' && disponibilidad(l.producto.id).estado !== 'sin-existencia') &&
      repartirEnvios(carrito, u, (id) => disponibilidad(id).estado).length === 1;
    demo.conCarga('Preparando tu pedido', 'Calculamos los envíos para tu dirección de entrega…', () => {
      if (!directo || !direccion) return navigate('/checkout/envio');
      demo.setEnvio('domicilio');
      demo.setEnvioDetalle({ ...demo.envioDetalle, direccion: lineaDireccion(direccion) });
      /* D57: la tarjeta predeterminada del cliente (Mi cuenta → Método de pago o el paso 3). */
      const predeterminada = TARJETAS_2026.find((t) => t.id === demo.tarjetaPredeterminadaId) ?? TARJETAS_2026[0];
      demo.setPago('tarjeta');
      demo.setPagoDetalle({ ...demo.pagoDetalle, forma: predeterminada.marca, tarjeta: { ...demo.pagoDetalle.tarjeta, numero: `421589637412${predeterminada.terminacion}` } });
      navigate('/checkout/confirmacion', { state: { directo: true } });
    });
  };
}
