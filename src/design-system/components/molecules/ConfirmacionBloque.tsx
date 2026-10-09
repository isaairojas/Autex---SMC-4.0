/**
 * Figma: bloques de "Confirmación del pedido" (2599:98351 Acerca del pedido, 2599:98365 Método de envío,
 * 2599:98385 Método de pago): título a la izquierda + filas etiqueta/valor (+ botón "Cambiar").
 * Última sincronización: 2026-10-02
 */
import type { ReactNode } from 'react';
import styles from './ConfirmacionBloque.module.css';

/** contenido (sitio, D54): bloque bajo la fila, p. ej. la sucursal y los artículos de un envío. */
export type FilaConfirmacion = { etiqueta: string; valor: ReactNode; nota?: ReactNode; contenido?: ReactNode; onCambiar?: () => void };

type Props = {
  titulo: string;
  /** Separación entre título y filas en Figma: 99 / 112 / 116. */
  gap: number;
  filas: FilaConfirmacion[];
  /** Padding vertical de las filas: "pedido" (pb16, py16) o "envio" (py16 todas) o "pago" (sin padding). */
  variante: 'pedido' | 'envio' | 'pago';
  /** Sitio (D54): ancho fijo del título para alinear las filas de todos los bloques. */
  anchoTitulo?: number;
};

export function ConfirmacionBloque({ titulo, gap, filas, variante, anchoTitulo }: Props) {
  return (
    <div className={styles.block} style={{ gap }}>
      <p className={`${styles.title} text-os-subheadline`} style={anchoTitulo ? { width: anchoTitulo, flexShrink: 0 } : undefined}>
        {titulo}
      </p>
      <div className={styles.rows}>
        {filas.map((f, i) => (
          <div key={f.etiqueta} className={`${styles.row} ${styles[variante]} ${i === 0 ? styles.first : ''}`}>
            <div className={styles.texts}>
              <p className={`${styles.label} text-os-subheadline`}>{f.etiqueta}</p>
              <p className={`${styles.value} text-os-subheadline`}>{f.valor}</p>
              {f.nota && <p className={`${styles.nota} text-os-body-2`}>{f.nota}</p>}
              {f.contenido}
            </div>
            {f.onCambiar && (
              <button type="button" className={`${styles.cambiar} text-body-1-book`} onClick={f.onCambiar}>
                Cambiar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
