/**
 * Figma: SearchByCar (12849:114189 en inicio, 12849:113505 en detalle) — "Encuentra los mejores productos para tu vehículo".
 * Última sincronización: 2026-10-02
 */
import { Icon } from '../atoms/Icon';
import styles from './BuscadorVehiculo.module.css';

type Props = {
  /** Inicio: 1888×224, padding 24 80 · Detalle: 1920×292, padding 40 96 */
  variante: 'inicio' | 'detalle';
};

export function BuscadorVehiculo({ variante }: Props) {
  return (
    <div className={`${styles.wrap} ${styles[variante]}`}>
      <div className={styles.searchByCar}>
        <p className={`${styles.title} text-heading-3-medium`}>Encuentra los mejores productos para tu vehículo</p>
        <div className={styles.vehicle}>
          {['2020', 'Chevrolet', 'Cavalier', '4 cil'].map((v) => (
            <div key={v} className={styles.select}>
              <span className="text-body-1-book">{v}</span>
              <Icon name="expand_more" box={16} size={16} />
            </div>
          ))}
          <button type="button" className={styles.lupa} aria-label="Buscar">
            <Icon name="search" size={24} color="var(--color-nativo-blanco)" />
          </button>
        </div>
      </div>
    </div>
  );
}
