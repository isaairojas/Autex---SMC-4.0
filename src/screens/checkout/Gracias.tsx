/**
 * Figma (Autex_2026_Frames): Content 904:34705 / 902:34618 — "¡Muchas gracias por tu compra!" con "Seguir comprando".
 * Pago en tienda de autoservicio: bloque de ticket del archivo anterior (136:70626, 949:84894).
 * Última sincronización: 2026-10-05
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../design-system/components/atoms/Icon';
import { TicketTienda } from '../../design-system/components/organisms/TicketTienda';
import docFrame from '../../assets/illustrations/gracias-doc-frame.svg';
import vector34 from '../../assets/illustrations/gracias-vector-34.svg';
import boxPedidos from '../../assets/illustrations/gracias-box-pedidos.svg';
import pesos from '../../assets/illustrations/gracias-signo-pesos.svg';
import brand from '../../assets/illustrations/gracias-brand.svg';
import { useDemo } from '../../state/DemoContext';
import { PageShell } from '../PageShell';
import styles from './Gracias.module.css';

type GraciasProps = {
  ticketAbierto?: boolean;
  /** Galería: solo el bloque "Content" (935×557) sin navbar ni footer. */
  soloContenido?: boolean;
};

export function Gracias({ ticketAbierto = false, soloContenido = false }: GraciasProps) {
  const navigate = useNavigate();
  const { pago, totales, reiniciar, modoFigma, ultimoPedido } = useDemo();
  const [ticket, setTicket] = useState(ticketAbierto);
  /* Sitio: datos del pedido recién pagado (el carrito ya quedó vacío); la galería conserva los de Figma. */
  const pedido = modoFigma ? null : ultimoPedido;
  const enTienda = pedido ? pedido.enTienda : pago === 'tienda';
  const numero = pedido ? pedido.numero : '#0001087 - 24';
  const monto = pedido ? pedido.total : totales.total;
  /* Plazo para pagar en tienda: 3 días (Figma: 21-04-2023). */
  const limite = modoFigma ? '21-04-2023' : new Date(Date.now() + 3 * 86400000).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');

  const inicio = () => {
    if (!modoFigma) reiniciar();
    navigate('/');
  };

  const contenido = (
    <div className={styles.content}>
          <div className={styles.head}>
            <div className={styles.doc} aria-hidden>
              <img src={docFrame} alt="" className={styles.frame} />
              <span className={styles.check}>
                <Icon name="check" box={18.581} size={20.903} color="var(--color-accent-1c6fff)" />
              </span>
              <img src={vector34} alt="" className={styles.vector} />
              <img src={boxPedidos} alt="" className={styles.box} />
              <span className={styles.lines}>
                <i style={{ width: 60 }} />
                <i style={{ width: 118 }} />
                <i style={{ width: 118 }} />
                <i style={{ width: 60 }} />
              </span>
              <img src={pesos} alt="" className={styles.pesos} />
              <img src={brand} alt="" className={styles.brand} />
            </div>
            <div className={styles.mensaje}>
              <p className={`${styles.title} text-heading-1-book`}>¡Muchas gracias por tu compra!</p>
              <p className={`${styles.desc} text-os-body-1`}>
                {/* D57: el sitio no usa "Tu auto está por estrenar" y nombra la tienda de autoservicio elegida (Figma: siempre OXXO). */}
                {modoFigma ? 'Tu auto está por estrenar. ' : 'Recibimos tu pedido. '}Tu número de pedido es<b className={styles.bold}> {numero}. </b>Se enviará un correo electrónico con los detalles de tu
                compra.{enTienda && ` No te olvides de descargar tu referencia de pago y realizarlo en ${modoFigma ? 'Tienda OXXO' : pedido?.tiendaPago ?? 'la tienda de autoservicio que elegiste'}.`}
              </p>
            </div>
          </div>
          <div className={styles.actions}>
            {enTienda && (
              <div className={`${styles.texts} text-os-body-1`}>
                <p>Tienes hasta el {limite} para realizar el pago.</p>
                <p className={styles.cantidad}>
                  <span>Cantidad a pagar:</span>
                  <span className={styles.monto}>{monto}</span>
                </p>
              </div>
            )}
            <div className={styles.buttons}>
              <button type="button" className={`${styles.btn} ${styles.outline} text-body-1-book`} onClick={inicio}>
                {enTienda ? 'Regresar al inicio' : 'Seguir comprando'}
              </button>
              {enTienda && (
                <button type="button" className={`${styles.btn} ${styles.primary} text-body-1-book`} onClick={() => setTicket(true)}>
                  Descargar ticket de pago
                  <Icon name="file_download" color="var(--color-nativo-blanco)" />
                </button>
              )}
            </div>
          </div>
        </div>
  );

  if (soloContenido) return contenido;

  return (
    <PageShell>
      <section className={styles.section}>
        {contenido}
      </section>
      {ticket && <TicketTienda monto={monto} onClose={() => setTicket(false)} />}
    </PageShell>
  );
}
