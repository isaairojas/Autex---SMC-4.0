/** Mosaico de especialidades / categorías (imagen + nombre), según autex.com.mx. Sin respaldo en Figma. */
import { Link } from 'react-router-dom';
import { Icon } from '../../design-system/components/atoms/Icon';
import styles from './Sitio.module.css';

type Item = { nombre: string; imagen?: string | { icono: string }; to: string };

export function Mosaico({ items }: { items: Item[] }) {
  return (
    <div className={styles.mosaico}>
      {items.map((it) => (
        <Link key={it.nombre} to={it.to} className={`${styles.tile} text-body-1-book`}>
          <span className={styles.tileImagen}>
            {typeof it.imagen === 'string' ? (
              <img src={it.imagen} alt="" />
            ) : (
              <Icon name={it.imagen?.icono ?? 'category'} box={96} size={88} color="var(--color-neutral-600)" />
            )}
          </span>
          {it.nombre}
        </Link>
      ))}
    </div>
  );
}

export const rutaBusqueda = (params: Record<string, string>) => `/busqueda?${new URLSearchParams(params)}`;
