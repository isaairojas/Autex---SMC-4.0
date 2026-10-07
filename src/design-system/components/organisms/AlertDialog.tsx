/**
 * Figma: Alert Dialog (2599:99468, error) y "Verificando tus datos" (2599:98962, carga)
 * Última sincronización: 2026-10-02
 */
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import spinner from '../../../assets/icons/circular-slider.svg';
import styles from './AlertDialog.module.css';

type ErrorProps = {
  titulo: string;
  mensaje: string;
  detalle: string;
  onCancel: () => void;
  onAccept: () => void;
};

export function AlertDialogError({ titulo, mensaje, detalle, onCancel, onAccept }: ErrorProps) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.alert} role="alertdialog">
        <div className={styles.head}>
          <p className={`${styles.title} text-subheadline-book`}>{titulo}</p>
          <button type="button" className={styles.close} onClick={onCancel} aria-label="Cerrar">
            <Icon name="close" />
          </button>
        </div>
        <div className={styles.desc}>
          <p className="text-body-1-medium">{mensaje}</p>
          <p className={`${styles.detail} text-body-1-book`}>{detalle}</p>
        </div>
        <div className={styles.buttons}>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button className={styles.danger} onClick={onAccept}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}

type CargaProps = {
  onClose?: () => void;
  /** Sitio (sin respaldo en Figma, D36): textos de cada espera; por defecto los de 2599:98962. */
  titulo?: string;
  texto?: string;
};

export function AlertDialogCarga({ onClose, titulo = 'Verificando tus datos', texto = 'Este proceso puede tardar unos minutos' }: CargaProps) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.loading} role="alertdialog" aria-label={titulo} aria-busy="true">
        <div className={styles.loadingHead}>
          <p className={`${styles.title} text-os-subheadline`}>{titulo}</p>
          {onClose && (
            <button type="button" className={styles.closeRound} onClick={onClose} aria-label="Cerrar">
              <Icon name="close" box={16} size={16} />
            </button>
          )}
        </div>
        <div className={styles.loadingBody}>
          <img src={spinner} alt="" width={112} height={112} className={styles.spin} />
          <p className={`${styles.loadingText} text-os-body-1`}>{texto}</p>
        </div>
      </div>
    </div>
  );
}
