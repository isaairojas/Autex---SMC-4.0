/**
 * SIN RESPALDO EN FIGMA (D34). En los resultados del sitio se ocultan los productos sin existencia en la zona;
 * este filtro (al final de los filtros) y el aviso al pie de los resultados permiten mostrarlos.
 */
import { Icon } from '../atoms/Icon';
import styles from './NoDisponibles.module.css';

type Props = { ocultos: number; mostrar: boolean; onCambiar: (v: boolean) => void };

/** Filtro con casilla, al final del panel de filtros. */
export function FiltroNoDisponibles({ ocultos, mostrar, onCambiar }: Props) {
  return (
    <label className={styles.filtro}>
      <span className={`${styles.titulo} text-subheadline-book`}>Disponibilidad</span>
      <span className={`${styles.opcion} text-body-1-book`}>
        <input type="checkbox" checked={mostrar} onChange={(e) => onCambiar(e.target.checked)} />
        Mostrar productos no disponibles ({ocultos})
      </span>
    </label>
  );
}

/** Aviso al pie de los resultados cuando hay productos ocultos. */
export function AvisoNoDisponibles({ ocultos, mostrar, onCambiar }: Props) {
  if (!ocultos) return null;
  return (
    <p className={`${styles.aviso} text-body-1-book`}>
      <Icon name={mostrar ? 'visibility_off' : 'visibility'} color="var(--color-neutral-600)" />
      {mostrar ? `Se muestran ${ocultos} ${ocultos === 1 ? 'producto' : 'productos'} sin existencia en tu zona.` : `${ocultos} ${ocultos === 1 ? 'producto no está disponible' : 'productos no están disponibles'} en tu zona.`}
      <button type="button" className="text-body-1-book" onClick={() => onCambiar(!mostrar)}>
        {mostrar ? 'Ocultar no disponibles' : 'Ver productos no disponibles'}
      </button>
    </p>
  );
}
