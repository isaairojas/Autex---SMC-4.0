/**
 * Figma: Option Sucursal (2596:100531) — usado para sucursales (con km, horario y etiqueta)
 * y para paqueterías (2600:105242, con precio y tiempo de entrega).
 * Última sincronización: 2026-10-02
 */
import type { ReactNode } from 'react';
import { Radio } from '../atoms/Radio';
import { Icon } from '../atoms/Icon';
import styles from './OpcionSeleccionable.module.css';

type OpcionSeleccionableProps = {
  selected: boolean;
  onSelect: () => void;
  titulo: string;
  /** Texto a la derecha: "1.1 km", "Gratis", "+150.00MXN". */
  extra?: string;
  /** Oculta el radio (direcciones no seleccionadas, 2600:106702). */
  sinRadio?: boolean;
  /** Acción a la derecha del título, p. ej. "Editar dirección" (723:88017). */
  accion?: ReactNode;
  /** Variante de borde 2 px Neutral/200 cuando no está seleccionada (direcciones). */
  bordeGrueso?: boolean;
  extraTono?: 'primary' | 'secondary';
  descripcion: string;
  horario?: string;
  /** Etiqueta verde "Productos disponibles". */
  etiqueta?: string;
  children?: ReactNode;
};

export function OpcionSeleccionable({
  selected,
  onSelect,
  titulo,
  extra,
  extraTono = 'primary',
  sinRadio,
  accion,
  bordeGrueso,
  descripcion,
  horario,
  etiqueta,
  children,
}: OpcionSeleccionableProps) {
  return (
    <div role="button" tabIndex={0} className={`${styles.option} ${bordeGrueso ? styles.grueso : ''} ${selected ? styles.selected : ''}`} onClick={onSelect}>
      {!sinRadio && (
        <span className={styles.radio}>
          <Radio selected={selected} size="small" />
        </span>
      )}
      <span className={styles.main}>
        <span className={styles.nameRow}>
          <span className={`${styles.name} text-subheadline-medium`}>{titulo}</span>
          {extra && <span className={`${styles.extra} ${styles[extraTono]} text-body-1-medium`}>{extra}</span>}
          {accion}
        </span>
        <span className={styles.details}>
          <span className={`${styles.desc} text-os-body-1`}>{descripcion}</span>
          {horario && (
            <span className={`${styles.horario} text-os-body-2`}>
              <span>Abierto ahora:</span>
              <span>{horario}</span>
            </span>
          )}
        </span>
        {etiqueta && (
          <span className={styles.tag}>
            <span className="text-body-2-book">{etiqueta}</span>
            <Icon name="check" box={16} size={16} color="var(--color-green-700)" />
          </span>
        )}
        {children}
      </span>
    </div>
  );
}
