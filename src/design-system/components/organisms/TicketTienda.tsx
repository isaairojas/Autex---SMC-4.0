/**
 * Figma: Ticket Tiendad (949:84894) — ficha digital de pago OXXO, 600×792.
 * Se muestra como overlay al pulsar "Descargar ticket de pago".
 * Última sincronización: 2026-10-02
 */
import oxxoPay from '../../../assets/images/oxxo-pay.png';
import styles from './TicketTienda.module.css';

const PASOS = [
  'Acude a la tienda OXXO más cercana.',
  'Indica en caja que quieres realizar un pago de OXXOpay.',
  'Dicta al cajero el número de referencia en esta ficha para que tecleé directamente en la pantalla de venta,',
  'Realiza el pago correspondiente con dinero en efectivo.',
  'Al confirmar tu pago, el cajero te entregará un comprobante impresa. En el podrás verificar que se haya realizado correctamente. Conserve este comprobante de pago.',
];

export function TicketTienda({ monto, onClose }: { monto: string; onClose: () => void }) {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.ticket} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Ficha de pago">
        <p className={styles.top}>FICHA DIGITAL. NO ES NECESARIO IMPRIMIR</p>
        <img src={oxxoPay} alt="OXXO Pay" className={styles.logo} />
        <p className={`${styles.montoLabel} text-os-body-2`}>MONTO A PAGAR</p>
        <div className={styles.monto}>
          <p className={styles.montoValor}>{monto}</p>
          <p className={styles.comision}>OXXO cobrará una comisión adicional al momento de realizar el pago</p>
        </div>
        <div className={styles.referencia}>
          <p className="text-body-2-medium">Referencia de pago</p>
          <div className={styles.refBox}>993-456-789-012-32</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.instrucciones}>
          <p className="text-body-2-medium">Instrucciones</p>
          <ol className={`${styles.lista} text-os-body-2`}>
            {PASOS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
        <p className={styles.aviso}>Al complementar estos pasos recibirás un correo confirmando tu pago</p>
        <button type="button" className={`${styles.imprimir} text-body-1-book`} onClick={() => window.print()}>
          Imprimir
        </button>
      </div>
    </div>
  );
}
