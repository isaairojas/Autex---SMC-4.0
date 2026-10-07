/**
 * Figma: pago de cliente registrado
 *  - "Tus tarjetas registradas" (2600:106506) con "Tarjeta / Off" (componente Tarjeta 4269:126070, Desktop)
 *  - Crédito Apymsa (2600:119037) + "Mi balance" (2600:129339) — B2B 2600:116789 / sin saldo 2605:97961
 * Última sincronización: 2026-10-02
 */
import { Icon } from '../atoms/Icon';
import { Radio } from '../atoms/Radio';
import { LinkButton } from '../atoms/LinkButton';
import visa from '../../../assets/icons/tarjeta-registrada-visa.svg';
import master from '../../../assets/icons/tarjeta-registrada-mastercard.svg';
import apymsa from '../../../assets/icons/apymsa-brand.svg';
import styles from './PagoRegistrado.module.css';

export const TARJETAS_REGISTRADAS = [
  { id: 'visa-4489', marca: 'visa' as const, texto: 'Visa con terminación 4489' },
  { id: 'master-5517', marca: 'mastercard' as const, texto: 'Mastercard con terminación 5517' },
];

type TarjetasProps = {
  seleccion: string;
  onSelect: (id: string) => void;
  onNueva?: () => void;
  /** Figma: 1083 en la tarjeta del paso 3; 784 dentro del modal (2600:114744). */
  ancho?: number;
};

export function TarjetasRegistradas({ seleccion, onSelect, onNueva, ancho = 1083 }: TarjetasProps) {
  return (
    <div className={styles.registradas}>
      <p className={`${styles.subtitulo} text-os-subheadline`}>Tus tarjetas registradas</p>
      <div className={styles.tarjetas} style={{ width: ancho }}>
        {TARJETAS_REGISTRADAS.map((t) => (
          <button key={t.id} type="button" className={`${styles.tarjeta} ${seleccion === t.id ? styles.sel : ''}`} onClick={() => onSelect(t.id)}>
            <span className={styles.tarjetaMain}>
              <Radio selected={seleccion === t.id} />
              <span className={styles.tarjetaInfo}>
                <img src={t.marca === 'visa' ? visa : master} alt="" width={68} height={40} />
                <span className="text-os-subheadline" style={{ lineHeight: '24px' }}>
                  {t.texto}
                </span>
              </span>
            </span>
            <Icon name="expand_more" box={32} size={28} />
          </button>
        ))}
      </div>
      {onNueva && (
        <div className={styles.nueva}>
          <LinkButton mas onClick={onNueva}>
            Nueva tarjeta
          </LinkButton>
        </div>
      )}
    </div>
  );
}

/** Tarjeta "Crédito Apymsa" del selector de formas de pago (2600:119037). */
export function TarjetaCredito({ seleccionada, onClick }: { seleccionada: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`${styles.credito} ${seleccionada ? styles.sel : ''}`} onClick={onClick}>
      <img src={apymsa} alt="APYMSA" width={119} height={19.833} />
      <span className={styles.creditoLabel}>
        <span className="text-os-body-1">Crédito Apymsa</span>
        <span style={{ transform: 'rotate(90deg)', display: 'flex' }}>
          <Icon name="navigate_next" />
        </span>
      </span>
    </button>
  );
}

type BalanceProps = { disponible: number; necesario: number; formato: (n: number) => string; onDetalles: () => void; onPagarSaldo: () => void };

/** "Mi balance" (2600:129339): saldo disponible, necesario y balance. */
export function MiBalance({ disponible, necesario, formato, onDetalles, onPagarSaldo }: BalanceProps) {
  const balance = disponible - necesario;
  const insuficiente = balance < 0;
  return (
    <div className={styles.balanceWrap}>
      <div className={styles.balance}>
        <p className={`${styles.subtitulo} text-os-subheadline`}>Mi balance</p>
        <div className={`${styles.items} text-os-body-1`}>
          <div className={styles.item}>
            <span className={styles.itemLabel}>Saldo disponible</span>
            <span className={insuficiente ? styles.rojo : styles.verde}>{formato(disponible)}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.itemLabel}>Saldo necesario</span>
            <span>{formato(necesario)}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.itemLabel}>Balance</span>
            <span className={insuficiente ? styles.rojo : undefined}>{insuficiente ? '-' + formato(-balance) : formato(balance)}</span>
          </div>
        </div>
      </div>
      {insuficiente ? (
        <button type="button" className={`${styles.pagarSaldo} text-body-1-book`} onClick={onPagarSaldo}>
          Pagar saldo vendico
        </button>
      ) : (
        <LinkButton onClick={onDetalles}>Ver detalles de mi crédito</LinkButton>
      )}
    </div>
  );
}
