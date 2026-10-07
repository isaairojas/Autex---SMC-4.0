/**
 * Figma: selector de método de pago (2599:97065) + campos de tarjeta (2599:97130)
 * Tarjetas: Cards/White/Visa, Cards/White/Mastercard, Cards/Colored (AMEX, D12), Cards/Colored/_Base "Otras formas de pago".
 * Última sincronización: 2026-10-02
 */
import { Icon } from '../atoms/Icon';
import { TextField } from '../atoms/TextField';
import visa from '../../../assets/icons/card-logo-visa.svg';
import master from '../../../assets/icons/card-logo-mastercard.svg';
import amex from '../../../assets/icons/card-colored-amex.svg';
import { TarjetaCredito } from './PagoRegistrado';
import styles from './FormaDePago.module.css';

export type FormaSeleccionada = 'credito' | 'visa' | 'mastercard' | 'amex' | 'otras' | 'registrada' | null;

type SelectorProps = {
  valor: FormaSeleccionada;
  onChange: (v: FormaSeleccionada) => void;
  /** B2B: muestra primero la tarjeta "Crédito Apymsa" (2600:119037). */
  credito?: boolean;
};

export function SelectorFormaDePago({ valor, onChange, credito }: SelectorProps) {
  return (
    <div className={styles.cards}>
      {credito && <TarjetaCredito seleccionada={valor === 'credito'} onClick={() => onChange('credito')} />}
      <button type="button" className={`${styles.white} ${valor === 'visa' ? styles.sel : ''}`} onClick={() => onChange('visa')} aria-label="Visa">
        <span className={styles.logoBox}>
          <img src={visa} alt="" className={styles.visa} />
        </span>
      </button>
      <button type="button" className={`${styles.white} ${styles.thin} ${valor === 'mastercard' ? styles.sel : ''}`} onClick={() => onChange('mastercard')} aria-label="Mastercard">
        <span className={styles.logoBox}>
          <img src={master} alt="" className={styles.master} />
        </span>
      </button>
      <button type="button" className={`${styles.colored} ${valor === 'amex' ? styles.selColored : ''}`} onClick={() => onChange('amex')} aria-label="American Express">
        <img src={amex} alt="" width={84} height={48} />
      </button>
      <button type="button" className={`${styles.otras} ${valor === 'otras' ? styles.sel : ''}`} onClick={() => onChange('otras')}>
        <Icon name="store" box={32} size={28} />
        <span className={styles.otrasLabel}>
          <span className="text-os-body-1">Otras formas de pago</span>
          <Icon name="navigate_next" />
        </span>
      </button>
    </div>
  );
}

export type DatosTarjeta = { titular: string; numero: string; vigencia: string; cvv: string };

/** sitio: sin el texto auxiliar "Text Label" de Figma, con ejemplos y solo números en tarjeta, vigencia y CVV. */
type CamposProps = { datos: DatosTarjeta; onChange: (d: DatosTarjeta) => void; sitio?: boolean };

/** Tarjeta completa en el sitio: titular, 15–16 dígitos, vigencia MM/AA y CVV de 3–4 dígitos. */
export const tarjetaValida = (d: DatosTarjeta) =>
  !!d.titular.trim() && /^\d{15,16}$/.test(d.numero.replace(/\s/g, '')) && /^(0[1-9]|1[0-2])\/\d{2}$/.test(d.vigencia) && /^\d{3,4}$/.test(d.cvv);

export function CamposTarjeta({ datos, onChange, sitio = false }: CamposProps) {
  const set = (k: keyof DatosTarjeta) => (v: string) => onChange({ ...datos, [k]: v });
  const digitos = (k: keyof DatosTarjeta, max: number) => (v: string) => onChange({ ...datos, [k]: v.replace(/\D/g, '').slice(0, max) });
  const vigencia = (v: string) => {
    const n = v.replace(/\D/g, '').slice(0, 4);
    onChange({ ...datos, vigencia: n.length > 2 ? `${n.slice(0, 2)}/${n.slice(2)}` : n });
  };
  const ayuda = sitio ? '' : undefined;
  return (
    <div className={styles.fields}>
      <TextField label="Nombre del titular" helper={ayuda} placeholder={sitio ? 'Como aparece en la tarjeta' : undefined} value={datos.titular} onChange={set('titular')} />
      <TextField label="Número de tarjeta" helper={ayuda} placeholder={sitio ? '16 dígitos' : undefined} value={datos.numero} onChange={sitio ? digitos('numero', 16) : set('numero')} />
      <div className={styles.pair}>
        <TextField label="Vigencia" helper={ayuda} placeholder={sitio ? 'MM/AA' : undefined} value={datos.vigencia} onChange={sitio ? vigencia : set('vigencia')} />
        <TextField label="CVV" helper={ayuda} placeholder={sitio ? '3 dígitos' : undefined} value={datos.cvv} onChange={sitio ? digitos('cvv', 4) : set('cvv')} />
      </div>
    </div>
  );
}
