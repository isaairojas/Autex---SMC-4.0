/**
 * Figma (Autex_2026_Frames): Autex - Checkout - 2 (719:22355), Container 901:32084
 *  - "Verifica el envío": una fila "Envio Paqueteria" por grupo de existencia SMC 4.0
 *    (Entrega inmediata / Productos bajo pedido).
 *  - Variante con costo: 901:32141 (envío $249.00 y leyenda para envío sin costo).
 * Reemplaza a las opciones de sucursal / paquetería del archivo anterior.
 * Sitio (sin respaldo en Figma, D35): sin costos de envío, "Dirección de entrega" visible, envíos múltiples por
 * sucursal y, para el cliente registrado (que llega aquí directo desde el carrito), "Cambiar dirección de entrega"
 * en lugar de "Regresar".
 * Última sincronización: 2026-10-05
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/atoms/Button';
import { Icon } from '../../design-system/components/atoms/Icon';
import { CheckoutCard } from '../../design-system/components/organisms/CheckoutCard';
import { Modal } from '../../design-system/components/organisms/Modal';
import { EnvioPaqueteria } from '../../design-system/components/molecules/EnvioPaqueteria';
import { EnviosMultiples } from '../../design-system/components/molecules/EnviosMultiples';
import { OpcionSeleccionable } from '../../design-system/components/molecules/OpcionSeleccionable';
import { lineaDireccion } from '../../mocks/clientes';
import { repartirEnvios } from '../../mocks/envios';
import { costoEnvio, UMBRAL_ENVIO_GRATIS } from '../../mocks/logistica';
import { coordenadas, UBICACION_PREDETERMINADA } from '../../mocks/tiendas';
import { useDemo } from '../../state/DemoContext';
import { CheckoutLayout } from './CheckoutLayout';
import styles from './MetodoEnvio.module.css';

const AVISO_CAMBIO = 'La fecha estimada de entrega y el envío están basados en la dirección seleccionada. Si la cambias, tu pedido podría verse afectado.';

export function MetodoEnvio() {
  const navigate = useNavigate();
  const demo = useDemo();
  const { carrito, disponibilidad, setEnvio, modoFigma, cliente, direccion, envioDetalle, setEnvioDetalle, ubicacion } = demo;
  const subtotal = carrito.reduce((s, l) => s + l.producto.precio * l.cantidad, 0);
  const costo = costoEnvio(subtotal);
  const hayBajoPedido = carrito.some((l) => disponibilidad(l.producto.id).estado === 'bajo-pedido');
  const hayInmediata = carrito.some((l) => disponibilidad(l.producto.id).estado === 'disponible');
  const sitio = !modoFigma;
  const registrado = sitio && cliente.tipo !== 'invitado';
  const [cambiando, setCambiando] = useState(false);

  /* Envíos por sucursal desde la ubicación de entrega. */
  const envios = sitio ? repartirEnvios(carrito, (ubicacion && coordenadas(ubicacion)) || UBICACION_PREDETERMINADA, (id) => disponibilidad(id).estado) : [];
  const inmediatos = envios.filter((e) => !e.bajoPedido);
  const pedidos = envios.filter((e) => e.bajoPedido);
  const textoDireccion = registrado && direccion ? lineaDireccion(direccion) : envioDetalle.direccion;

  return (
    <CheckoutLayout paso={2} sinCostoEnvio={sitio}>
      <CheckoutCard
        title="Método de envío"
        intro="Verifica el envío"
        actions={
          <>
            {registrado ? (
              <span className={styles.conAyuda}>
                <Button variant="outline" icon={<Icon name="edit_location_alt" />} onClick={() => setCambiando(true)} aria-describedby="aviso-cambio">
                  Cambiar dirección de entrega
                </Button>
                <span id="aviso-cambio" role="tooltip" className={`${styles.ayuda} text-body-2-book`}>
                  {AVISO_CAMBIO}
                </span>
              </span>
            ) : (
              <Button variant="outline" onClick={() => navigate('/checkout/datos')}>
                Regresar
              </Button>
            )}
            <Button
              onClick={() => {
                setEnvio('domicilio');
                if (registrado && direccion) setEnvioDetalle({ ...envioDetalle, direccion: lineaDireccion(direccion) });
                demo.conCarga('Preparando el pago', 'Cargamos tus métodos de pago…', () => navigate('/checkout/pago'), 900);
              }}
            >
              Continuar
            </Button>
          </>
        }
      >
        {sitio && textoDireccion && (
          <div className={styles.direccion}>
            <Icon name="location_on" box={32} size={28} color="var(--color-secondary-500)" />
            <div>
              <p className={`${styles.gris} text-body-2-book`}>Dirección de entrega</p>
              <p className="text-subheadline-medium">{registrado && direccion ? direccion.nombre : cliente.nombre}</p>
              <p className={`${styles.gris} text-body-1-book`}>{textoDireccion}</p>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(hayInmediata || !hayBajoPedido) && (
            <EnvioPaqueteria
              tiempo={
                costo > 0 && !sitio
                  ? /* figma: 901:32141 usa "2 a 4 días" en la fila de entrega inmediata (D25) */ 'Tiempo de entrega estimado de 2 a 4 días'
                  : 'Tiempo de entrega estimado de 24 a 48 horas.'
              }
              costo={costo}
              faltante={UMBRAL_ENVIO_GRATIS - subtotal}
              ocultarCosto={sitio}
            >
              {sitio && inmediatos.length > 0 ? <EnviosMultiples envios={inmediatos} total={envios.length} /> : null}
            </EnvioPaqueteria>
          )}
          {hayBajoPedido && (
            <EnvioPaqueteria bajoPedido tiempo="Tiempo de entrega estimado de 2 a 4 días." costo={costo} faltante={UMBRAL_ENVIO_GRATIS - subtotal} ocultarCosto={sitio}>
              {sitio && pedidos.length > 0 ? <EnviosMultiples envios={pedidos} total={inmediatos.length ? 0 : envios.length} /> : null}
            </EnvioPaqueteria>
          )}
        </div>
      </CheckoutCard>
      {cambiando && <CambiarDireccion onClose={() => setCambiando(false)} />}
    </CheckoutLayout>
  );
}

/** Modal "Cambiar dirección de entrega": direcciones guardadas del cliente, con el aviso de que el pedido puede cambiar. */
function CambiarDireccion({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { direcciones, direccion, elegirDireccion, predeterminadaId, conCarga } = useDemo();
  const [sel, setSel] = useState(direccion?.id ?? direcciones[0]?.id ?? '');
  return (
    <Modal
      titulo="Cambiar dirección de entrega"
      onClose={onClose}
      ancho={720}
      top={200}
      pieIzquierda={
        <Button variant="text" icon={<Icon name="add_circle_outline" color="var(--color-primary-500)" />} onClick={() => navigate('/configuracion/direcciones/nueva', { state: { volver: '/checkout/envio' } })}>
          Agregar nueva dirección
        </Button>
      }
      acciones={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={!sel}
            onClick={() => {
              onClose();
              conCarga('Actualizando tu dirección de entrega', 'Recalculamos los envíos y tiempos de entrega…', () => elegirDireccion(sel));
            }}
          >
            Usar esta dirección
          </Button>
        </>
      }
    >
      <div className={styles.modal}>
        <p className={`${styles.nota} text-body-1-book`}>
          <Icon name="info" color="var(--color-primary-500)" />
          {AVISO_CAMBIO}
        </p>
        {direcciones.map((d) => (
          <OpcionSeleccionable
            key={d.id}
            bordeGrueso
            selected={d.id === sel}
            onSelect={() => setSel(d.id)}
            titulo={d.nombre}
            extra={d.id === predeterminadaId ? 'Predeterminada' : undefined}
            extraTono="secondary"
            descripcion={lineaDireccion(d)}
          />
        ))}
      </div>
    </Modal>
  );
}
