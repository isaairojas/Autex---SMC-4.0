/**
 * Figma (Autex_2026_Frames): Método de pago — Container 723:23482
 *  - FormasDePago2026: "Formas de pago" 725:24122 (Paymet options 725:23867 / 725:23872 + logos de tarjetas y bancos)
 *  - TarjetaGuardada: "Tarjeta" 725:24099 (seleccionada 725:24113, borde 2 Primary/500)
 * Los logos de bancos se usan como una sola exportación de Figma (formas-de-pago-2026.svg, recortada a "Content tarjeta").
 * Última sincronización: 2026-10-05
 */
import { Icon } from '../atoms/Icon';
import { Radio } from '../atoms/Radio';
import logos from '../../../assets/illustrations/formas-de-pago-2026.svg';
import badgeVisa from '../../../assets/icons/badge-visa-2026.svg';
import badgeMastercard from '../../../assets/icons/badge-mastercard-2026.svg';
import styles from './Pago2026.module.css';

export type FormaPago2026 = 'tarjetas' | 'otras';

type FormasProps = { valor: FormaPago2026; onChange: (f: FormaPago2026) => void };

export function FormasDePago2026({ valor, onChange }: FormasProps) {
  return (
    <div className={styles.formas}>
      <div className={styles.opciones}>
        <button type="button" className={valor === 'tarjetas' ? `${styles.opcion} ${styles.activa}` : styles.opcion} onClick={() => onChange('tarjetas')}>
          <Icon name="credit_card" box={32} size={28} />
          <span className={`${styles.opcionTexto} text-body-1-book`}>Tarjetas</span>
        </button>
        <button type="button" className={valor === 'otras' ? `${styles.opcion} ${styles.activa}` : styles.opcion} onClick={() => onChange('otras')}>
          <Icon name="store" box={32} size={28} />
          <span className={`${styles.opcionTexto} text-body-1-book`}>Otras formas de pago</span>
        </button>
      </div>
      {valor === 'tarjetas' && <img src={logos} alt="Tarjetas de crédito y de débito aceptadas" width={1190} height={72} className={styles.logos} />}
    </div>
  );
}

export type TarjetaRegistrada2026 = { id: string; marca: 'visa' | 'mastercard'; terminacion: string };

/** Tarjetas de 725:24098 (texto literal). */
export const TARJETAS_2026: TarjetaRegistrada2026[] = [
  { id: 'visa-8896', marca: 'visa', terminacion: '8896' },
  { id: 'mc-5517', marca: 'mastercard', terminacion: '5517' },
  { id: 'visa-4485', marca: 'visa', terminacion: '4485' },
];

type TarjetaProps = {
  tarjeta: TarjetaRegistrada2026;
  seleccionada: boolean;
  onSelect: () => void;
  /** Sitio (D57, sin respaldo en Figma): marca de la tarjeta predeterminada. */
  predeterminada?: boolean;
};

export function TarjetaGuardada({ tarjeta, seleccionada, onSelect, predeterminada = false }: TarjetaProps) {
  const nombre = tarjeta.marca === 'visa' ? 'Visa' : 'Mastercard';
  return (
    <button type="button" className={seleccionada ? `${styles.tarjeta} ${styles.tarjetaActiva}` : styles.tarjeta} onClick={onSelect}>
      <Radio selected={seleccionada} />
      <span className={styles.tarjetaInfo}>
        <img src={tarjeta.marca === 'visa' ? badgeVisa : badgeMastercard} alt="" width={64.5} height={42} className={styles.badge} />
        <span className={styles.tarjetaTexto}>
          {nombre} con terminación {tarjeta.terminacion}
        </span>
        {predeterminada && <span className={`${styles.predeterminada} text-caption-book`}>Predeterminada</span>}
      </span>
      <Icon name="expand_more" box={32} size={28} />
    </button>
  );
}
