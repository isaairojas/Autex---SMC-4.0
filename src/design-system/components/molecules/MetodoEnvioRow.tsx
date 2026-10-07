/**
 * Figma: fila de método de envío (2596:99046 "Recoger en sucursal" / 2596:99051 "Envio a domicilio")
 * Ícono + título + fecha estimada + acción a la derecha (botón o texto).
 * Última sincronización: 2026-10-02
 */
import type { ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import styles from './MetodoEnvioRow.module.css';

type MetodoEnvioRowProps = {
  icono: 'store' | 'local_shipping';
  titulo: string;
  fecha: string;
  accion: ReactNode;
};

export function MetodoEnvioRow({ icono, titulo, fecha, accion }: MetodoEnvioRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <Icon name={icono} box={32} size={28} color="var(--color-primary-400)" />
        <div className={styles.desc}>
          <span className={`${styles.title} text-headline-medium`}>{titulo}</span>
          <span className={`${styles.fecha} text-os-body-1`}>{fecha}</span>
        </div>
      </div>
      {accion}
    </div>
  );
}
