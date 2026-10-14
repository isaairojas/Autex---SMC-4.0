/**
 * Figma: SearchByCar (12849:114189 en inicio, 12849:113505 en detalle) — "Encuentra los mejores productos para tu vehículo".
 * Última sincronización: 2026-10-02
 */
import { useState } from 'react';
import { Icon } from '../atoms/Icon';
import { useMovil } from '../../movil';
import styles from './BuscadorVehiculo.module.css';

type Props = {
  /** Inicio: 1888×224, padding 24 80 · Detalle: 1920×292, padding 40 96 */
  variante: 'inicio' | 'detalle';
};

export function BuscadorVehiculo({ variante }: Props) {
  /* D58: en celular es "Búsqueda por vehículo" plegable, como el sitio (captura 04). */
  const movil = useMovil();
  const [abierto, setAbierto] = useState(false);
  return (
    <div className={`${styles.wrap} ${styles[variante]}`}>
      <div className={styles.searchByCar}>
        {movil ? (
          <button type="button" className={`${styles.plegable} text-body-1-book`} aria-expanded={abierto} onClick={() => setAbierto(!abierto)}>
            <Icon name="manage_search" />
            <span className={styles.plegableTexto}>Búsqueda por vehículo</span>
            <Icon name={abierto ? 'expand_less' : 'expand_more'} />
          </button>
        ) : (
          <p className={`${styles.title} text-heading-3-medium`}>Encuentra los mejores productos para tu vehículo</p>
        )}
        {(!movil || abierto) && (
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
        )}
      </div>
    </div>
  );
}
