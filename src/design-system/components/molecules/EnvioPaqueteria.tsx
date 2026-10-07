/**
 * Figma (Autex_2026_Frames): Envio Paqueteria — Default 898:31778 / Bajo pedido 904:34781 / con costo (901:32141)
 * Última sincronización: 2026-10-05
 */
import type { ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import { formatoMXN } from '../../../mocks/productos';
import styles from './EnvioPaqueteria.module.css';

type EnvioPaqueteriaProps = {
  bajoPedido?: boolean;
  /** Texto de tiempo de entrega (Figma lo varía por fila). */
  tiempo: string;
  /** 0 = "Sin costo de envío". */
  costo: number;
  /** Monto que falta para envío sin costo. */
  faltante?: number;
  /** Sitio (sin respaldo en Figma, D35): sin columna de costo de envío. */
  ocultarCosto?: boolean;
  /** Sitio (D35): envíos múltiples bajo la descripción. */
  children?: ReactNode;
};

export function EnvioPaqueteria({ bajoPedido = false, tiempo, costo, faltante = 0, ocultarCosto = false, children }: EnvioPaqueteriaProps) {
  return (
    <div className={styles.fila}>
      <div className={styles.izquierda}>
        <Icon name="local_shipping" box={32} size={28} color="var(--color-primary-400)" />
        <div className={styles.descripcion}>
          <p className={styles.titulo}>
            <span className={styles.tituloGrande}>Envío a domicilio </span>
            <span className={bajoPedido ? `${styles.tituloChico} ${styles.naranja}` : styles.tituloChico}>
              {bajoPedido ? '(Productos bajo pedido)' : '(Entrega inmediata)'}
            </span>
          </p>
          <p className={`${styles.tiempo} text-os-body-1`}>{tiempo}</p>
        </div>
      </div>
      {ocultarCosto ? null : costo === 0 ? (
        <p className={`${styles.costo} text-body-1-medium`}>Sin costo de envío</p>
      ) : (
        <div className={styles.conCosto}>
          <p className={`${styles.costo} text-body-1-medium`}>
            Envío <span className={styles.monto}>+{costo.toFixed(2)} MXN</span>
          </p>
          {faltante > 0 && (
            <p className={`${styles.agrega} text-os-body-1`}>
              Agrega <strong>{formatoMXN(faltante)}</strong> pesos mas a tu pedido para envío sin costo
            </p>
          )}
        </div>
      )}
      {children && <div className={styles.extra}>{children}</div>}
    </div>
  );
}
