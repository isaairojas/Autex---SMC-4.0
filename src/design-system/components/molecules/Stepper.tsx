/**
 * Figma: Step payment (instancias 127:64286…127:64333)
 * Variantes: completado (círculo Primary/500 relleno), activo (borde, Primary/400), pendiente (Neutral/700).
 * Última sincronización: 2026-10-02
 */
import styles from './Stepper.module.css';

export const PASOS = ['Datos del usuario', 'Método de envío', 'Método de pago', 'Confirmación'] as const;

type StepperProps = {
  /** Paso activo, 1 a 4. Los anteriores se muestran como completados. */
  activo: 1 | 2 | 3 | 4;
  /** Sitio (D51/D53, sin respaldo en Figma): los pasos ya visitados se pueden abrir, hacia atrás o hacia adelante. */
  onPaso?: (n: 1 | 2 | 3 | 4) => void;
  /** Paso más avanzado que se ha abierto (por defecto, el activo). */
  alcanzado?: number;
};

export function Stepper({ activo, onPaso, alcanzado = activo }: StepperProps) {
  return (
    <div className={styles.stepper}>
      {PASOS.map((label, i) => {
        const n = i + 1;
        const estado = n < activo ? 'done' : n === activo ? 'active' : 'pending';
        if (onPaso && n !== activo && n <= Math.max(alcanzado, activo))
          return (
            <button key={label} type="button" className={`${styles.step} ${styles[estado]} ${styles.boton}`} onClick={() => onPaso(n as 1 | 2 | 3 | 4)}>
              <span className={`${styles.number} text-subheadline-book`}>{n}</span>
              <span className={`${styles.label} text-heading-3-book`}>{label}</span>
            </button>
          );
        return (
          <div key={label} className={`${styles.step} ${styles[estado]}`}>
            <span className={`${styles.number} text-subheadline-book`}>{n}</span>
            <span className={`${styles.label} text-heading-3-book`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
