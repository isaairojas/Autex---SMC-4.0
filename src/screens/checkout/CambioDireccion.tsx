/**
 * SIN RESPALDO EN FIGMA (D50/D51). Cambio de la dirección de entrega en cualquier paso del checkout (datos del
 * usuario, método de envío, método de pago y confirmación): se pide confirmación, se recalculan las existencias de
 * cada artículo con su opción de entrega y el cliente regresa a "Método de envío", que muestra el resultado.
 * El registrado elige entre sus direcciones guardadas; el invitado cambia la suya en el formulario del paso 1.
 */
import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/atoms/Button';
import { Icon } from '../../design-system/components/atoms/Icon';
import { Modal } from '../../design-system/components/organisms/Modal';
import { OpcionSeleccionable } from '../../design-system/components/molecules/OpcionSeleccionable';
import { lineaDireccion } from '../../mocks/clientes';
import { useDemo, type AjusteDireccion } from '../../state/DemoContext';
import styles from './MetodoEnvio.module.css';

export const AVISO_CAMBIO = 'La fecha estimada de entrega y el envío están basados en la dirección seleccionada. Si la cambias, tu pedido podría verse afectado.';
/** D51: texto de la confirmación (decisión del usuario). */
export const AVISO_CONFIRMAR = 'Al cambiar la dirección de entrega, los precios y la disponibilidad de tus productos podrían cambiar, ¿desea continuar?';

type Pendiente = { nueva: ReactNode; aplicar: () => AjusteDireccion[] };

/**
 * pedir(nueva, aplicar, cp): muestra la confirmación; al aceptar aplica el cambio (que devuelve lo que se ajustó), guarda
 * el resultado y lleva a "Método de envío". D56: si se pasa el C.P. nuevo y es el mismo de la entrega actual (cliente
 * registrado), no se pregunta: la dirección cambia directo y no hay aviso de existencias.
 * cambiar(): el registrado abre sus direcciones; el invitado va a su formulario.
 */
export function useCambioDireccion() {
  const navigate = useNavigate();
  const demo = useDemo();
  const [pendiente, setPendiente] = useState<Pendiente | null>(null);
  const [eligiendo, setEligiendo] = useState(false);
  const registrado = demo.cliente.tipo !== 'invitado';
  const aplicarCambio = (aplicar: () => AjusteDireccion[], mismoCP: boolean) =>
    demo.conCarga('Actualizando tu dirección de entrega', 'Recalculamos las existencias, los envíos y los tiempos de entrega…', () => {
      const ajustes = aplicar();
      demo.setAjusteDireccion(mismoCP ? null : ajustes);
      navigate('/checkout/envio');
    });
  const pedir = (nueva: ReactNode, aplicar: () => AjusteDireccion[], cp?: string) =>
    cp && cp === demo.ubicacion?.codigoPostal ? aplicarCambio(aplicar, true) : setPendiente({ nueva, aplicar });
  const cambiar = () => (registrado ? setEligiendo(true) : navigate('/checkout/datos'));
  const modales = (
    <>
      {eligiendo && (
        <ElegirDireccion
          onClose={() => setEligiendo(false)}
          onElegir={(id) => {
            setEligiendo(false);
            const d = demo.direcciones.find((x) => x.id === id);
            if (d && id !== demo.direccion?.id)
              pedir(
                <>
                  <b>{d.nombre}</b> · <span className={styles.gris}>{lineaDireccion(d)}</span>
                </>,
                () => {
                  demo.setEnvioDetalle({ ...demo.envioDetalle, direccion: lineaDireccion(d) });
                  return demo.cambiarDireccionPedido(id);
                },
                d.codigoPostal,
              );
          }}
        />
      )}
      {pendiente && (
        <Modal
          titulo="Cambiar dirección de entrega"
          onClose={() => setPendiente(null)}
          ancho={640}
          top={240}
          acciones={
            <>
              <Button variant="outline" onClick={() => setPendiente(null)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  const { aplicar } = pendiente;
                  setPendiente(null);
                  aplicarCambio(aplicar, false);
                }}
              >
                Sí, continuar
              </Button>
            </>
          }
        >
          <div className={styles.modal}>
            <p className={`${styles.notaAmarilla} text-body-1-book`} role="alert">
              <Icon name="warning" color="var(--color-amarillo-aviso-icono)" />
              {AVISO_CONFIRMAR}
            </p>
            <p className="text-body-1-book">Nueva dirección: {pendiente.nueva}</p>
          </div>
        </Modal>
      )}
    </>
  );
  return { pedir, cambiar, modales };
}

/** Modal "Cambiar dirección de entrega": direcciones guardadas del cliente registrado. */
function ElegirDireccion({ onClose, onElegir }: { onClose: () => void; onElegir: (id: string) => void }) {
  const navigate = useNavigate();
  const { direcciones, direccion, predeterminadaId } = useDemo();
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
          <Button disabled={!sel} onClick={() => (sel === direccion?.id ? onClose() : onElegir(sel))}>
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

/** D51: "Dirección de entrega" con "Cambiar dirección de entrega" para los pasos 3 y 4 (solo si algo va a domicilio). */
export function BloqueDireccion({ onCambiar }: { onCambiar: () => void }) {
  const { cliente, direccion, envioDetalle, carrito } = useDemo();
  const registrado = cliente.tipo !== 'invitado';
  const texto = registrado && direccion ? lineaDireccion(direccion) : envioDetalle.direccion;
  if (!texto || !carrito.some((l) => l.entrega !== 'tienda')) return null;
  return (
    <div className={styles.direccion}>
      <Icon name="location_on" box={32} size={28} color="var(--color-secondary-500)" />
      <div className={styles.direccionTexto}>
        <p className={`${styles.gris} text-body-2-book`}>Dirección de entrega</p>
        <p className="text-subheadline-medium">{registrado && direccion ? direccion.nombre : cliente.nombre}</p>
        <p className={`${styles.gris} text-body-1-book`}>{texto}</p>
      </div>
      <Button variant="text" icon={<Icon name="edit_location_alt" color="var(--color-primary-500)" />} onClick={onCambiar}>
        Cambiar dirección de entrega
      </Button>
    </div>
  );
}
