/**
 * Figma (Autex_2026_Frames): Autex - Checkout - 2 (719:22355), Container 901:32084
 *  - "Verifica el envío": una fila "Envio Paqueteria" por grupo de existencia SMC 4.0
 *    (Entrega inmediata / Productos bajo pedido).
 *  - Variante con costo: 901:32141 (envío $249.00 y leyenda para envío sin costo).
 * Reemplaza a las opciones de sucursal / paquetería del archivo anterior.
 * Sitio (sin respaldo en Figma, D35): sin costos de envío, "Dirección de entrega" visible, envíos múltiples por
 * sucursal y, para el cliente registrado (que llega aquí directo desde el carrito), "Cambiar dirección de entrega"
 * en lugar de "Regresar".
 * Sitio (D43): lo que el cliente eligió recoger en "Mi tienda" no entra en los envíos y se muestra en "Recoger en tienda".
 * Última sincronización: 2026-10-05
 */
import { useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/atoms/Button';
import { Icon } from '../../design-system/components/atoms/Icon';
import { ProductThumb } from '../../design-system/components/atoms/ProductThumb';
import { CheckoutCard } from '../../design-system/components/organisms/CheckoutCard';
import { EnvioPaqueteria } from '../../design-system/components/molecules/EnvioPaqueteria';
import { EnviosMultiples } from '../../design-system/components/molecules/EnviosMultiples';
import { lineaDireccion } from '../../mocks/clientes';
import { repartirEnvios } from '../../mocks/envios';
import { costoEnvio, UMBRAL_ENVIO_GRATIS } from '../../mocks/logistica';
import { coordenadas, estadoHorario, UBICACION_PREDETERMINADA } from '../../mocks/tiendas';
import { useDemo, type AjusteDireccion } from '../../state/DemoContext';
import { AVISO_CAMBIO, useCambioDireccion } from './CambioDireccion';
import { CheckoutLayout } from './CheckoutLayout';
import styles from './MetodoEnvio.module.css';

export function MetodoEnvio() {
  const navigate = useNavigate();
  const demo = useDemo();
  const { carrito, disponibilidad, setEnvio, modoFigma, cliente, direccion, envioDetalle, setEnvioDetalle, ubicacion, tienda } = demo;
  const sitio = !modoFigma;
  /* D43: en el sitio solo se envía lo que no se recoge en tienda. */
  const aDomicilio = sitio ? carrito.filter((l) => l.entrega !== 'tienda') : carrito;
  const aTienda = sitio ? carrito.filter((l) => l.entrega === 'tienda') : [];
  const subtotal = carrito.reduce((s, l) => s + l.producto.precio * l.cantidad, 0);
  const costo = costoEnvio(subtotal);
  const hayBajoPedido = aDomicilio.some((l) => disponibilidad(l.producto.id).estado === 'bajo-pedido');
  const hayInmediata = aDomicilio.some((l) => disponibilidad(l.producto.id).estado === 'disponible');
  const registrado = sitio && cliente.tipo !== 'invitado';
  /* D50/D51: cambio de dirección con confirmación; el resultado (de este paso o de otro) se muestra aquí. */
  const cambio = useCambioDireccion();
  const ajustes = demo.ajusteDireccion;
  const sinExistencia = sitio ? aDomicilio.filter((l) => disponibilidad(l.producto.id).estado === 'sin-existencia') : [];

  /* Envíos por sucursal desde la ubicación de entrega. */
  const envios = sitio ? repartirEnvios(aDomicilio, (ubicacion && coordenadas(ubicacion)) || UBICACION_PREDETERMINADA, (id) => disponibilidad(id).estado) : [];
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
            {/* D53: el registrado también puede regresar a sus datos. */}
            {registrado && (
              <Button variant="outline" onClick={() => navigate('/checkout/datos')}>
                Regresar
              </Button>
            )}
            {registrado ? (
              <span className={styles.conAyuda}>
                <Button variant="outline" icon={<Icon name="edit_location_alt" />} onClick={cambio.cambiar} aria-describedby="aviso-cambio">
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
              disabled={sinExistencia.length > 0}
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
        {sitio && textoDireccion && aDomicilio.length > 0 && (
          <div className={styles.direccion}>
            <Icon name="location_on" box={32} size={28} color="var(--color-secondary-500)" />
            <div>
              <p className={`${styles.gris} text-body-2-book`}>Dirección de entrega</p>
              <p className="text-subheadline-medium">{registrado && direccion ? direccion.nombre : cliente.nombre}</p>
              <p className={`${styles.gris} text-body-1-book`}>{textoDireccion}</p>
            </div>
          </div>
        )}
        {sitio && ajustes && (
          <AvisoNuevaDireccion
            ajustes={ajustes}
            total={carrito.length}
            sinExistencia={sinExistencia.length}
            onQuitar={() => sinExistencia.forEach((l) => demo.quitar(l.producto.id))}
            onOtraDireccion={cambio.cambiar}
            onCarrito={() => navigate('/carrito')}
          />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* D49: un artículo bajo pedido también puede tener envíos inmediatos con lo que hay en las tiendas locales. */}
          {aDomicilio.length > 0 && (sitio ? inmediatos.length > 0 : hayInmediata || !hayBajoPedido) && (
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
          {(sitio ? pedidos.length > 0 : hayBajoPedido) && (
            <EnvioPaqueteria bajoPedido tiempo="Tiempo de entrega estimado de 2 a 4 días." costo={costo} faltante={UMBRAL_ENVIO_GRATIS - subtotal} ocultarCosto={sitio}>
              {sitio && pedidos.length > 0 ? <EnviosMultiples envios={pedidos} total={inmediatos.length ? 0 : envios.length} /> : null}
            </EnvioPaqueteria>
          )}
          {aTienda.length > 0 && tienda && (
            <div className={styles.recoger}>
              <div className={styles.recogerCabecera}>
                <Icon name="store" box={32} size={28} color="var(--color-primary-500)" />
                <div>
                  <p className="text-subheadline-medium">Recoger en tienda</p>
                  <p className="text-body-1-book">
                    Autex {tienda.nombre} · <span className={styles.gris}>{tienda.direccion}</span>
                  </p>
                  <p className={`${styles.gris} text-body-2-book`}>
                    {estadoHorario(tienda.horario).corto} · Te avisaremos por correo cuando tu pedido esté listo para recoger.
                  </p>
                </div>
              </div>
              <ul className={styles.recogerLista}>
                {aTienda.map((l) => (
                  <li key={l.producto.id} className="text-body-2-book">
                    <ProductThumb capas={l.producto.imagen} size={48} />
                    <span className={styles.recogerNombre}>{l.producto.nombre}</span>
                    <span className={styles.gris}>Cantidad: {l.cantidad}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CheckoutCard>
      {cambio.modales}
    </CheckoutLayout>
  );
}

/**
 * SIN RESPALDO EN FIGMA (D50). Resultado de cambiar la dirección de entrega: si todo sigue disponible, una nota; si no
 * se completan las piezas, la leyenda amarilla con cada artículo ajustado; si nada tiene existencia, el aviso de que la
 * nueva ubicación no arroja existencias.
 */
type AvisoProps = { ajustes: AjusteDireccion[]; total: number; sinExistencia: number; onQuitar: () => void; onOtraDireccion: () => void; onCarrito: () => void };

function AvisoNuevaDireccion({ ajustes, total, sinExistencia, onQuitar, onOtraDireccion, onCarrito }: AvisoProps) {
  const pz = (n: number) => (n === 1 ? '1 pieza' : `${n} piezas`);
  if (!ajustes.length)
    return (
      <p className={`${styles.nota} ${styles.notaResultado} text-body-1-book`} role="status">
        <Icon name="check_circle" color="var(--color-green-700)" />
        Actualizamos las existencias para la nueva dirección: todos tus productos siguen disponibles.
      </p>
    );
  const ninguno = total > 0 && sinExistencia >= total;
  const detalle = (a: AjusteDireccion) => {
    if (a.ahora === 0) return a.tienda ? `${a.tienda} no lo tiene y tampoco hay piezas para envío a domicilio en la nueva ubicación.` : 'sin existencia en la nueva ubicación.';
    if (a.entrega === 'tienda') return `ajustamos la cantidad de ${pz(a.antes)} a ${pz(a.ahora)} disponibles para recoger en ${a.tienda}.`;
    if (a.tienda) return `${a.tienda} no lo tiene; pasa a envío a domicilio con ${pz(a.ahora)}${a.ahora < a.antes ? ` (de ${pz(a.antes)})` : ''}.`;
    return `ajustamos la cantidad de ${pz(a.antes)} a ${pz(a.ahora)} disponibles para envío a domicilio.`;
  };
  return (
    <div className={styles.avisoAmarillo} role="alert">
      <Icon name="warning" color="var(--color-amarillo-aviso-icono)" />
      <div className={styles.avisoCuerpo}>
        <p className="text-body-1-medium">
          {ninguno ? 'La nueva ubicación no arroja existencias para los productos de tu pedido.' : 'La totalidad de los productos no está disponible para la nueva ubicación seleccionada.'}
        </p>
        {ninguno ? (
          <p className="text-body-1-book">Ninguno de tus productos tiene piezas en las sucursales que surten esta dirección. Elige otra dirección de entrega o regresa al carrito.</p>
        ) : (
          <ul className={`${styles.avisoLista} text-body-1-book`}>
            {ajustes.map((a) => (
              <li key={a.id}>
                <b>{a.nombre}</b>: {detalle(a)}
              </li>
            ))}
          </ul>
        )}
        {sinExistencia > 0 && !ninguno && <p className="text-body-1-book">Quita los productos sin existencia para continuar con tu compra.</p>}
        {(sinExistencia > 0 || ninguno) && (
          <div className={styles.avisoAcciones}>
            {ninguno ? (
              <>
                <Button variant="outline" onClick={onOtraDireccion}>
                  Elegir otra dirección
                </Button>
                <Button variant="outline" onClick={onCarrito}>
                  Regresar al carrito
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={onQuitar}>
                Quitar productos sin existencia
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
