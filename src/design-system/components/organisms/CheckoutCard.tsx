/**
 * Figma (Autex_2026_Frames): Container del checkout — 1270 de ancho, "Head + decore" de 96
 *  - Paso 1: 901:31850 (contenido px40 py20, gap 20, acciones alineadas al borde)
 *  - Pasos 2–4: 901:32084 / 723:23482 / 738:17673 (contenido px40, gap 15, acciones con px20)
 * Última sincronización: 2026-10-05
 */
import type { ReactNode } from 'react';
import decore from '../../../assets/illustrations/card-head-decore.svg';
import styles from './CheckoutCard.module.css';

type CheckoutCardProps = {
  title: string;
  /** Texto bajo la cabecera, p. ej. "Selecciona un a dirección" (Open Sans 18). */
  intro?: string;
  /** Espaciado del paso 1 (20) o de los pasos 2–4 (15). */
  espacio?: 15 | 20;
  /** Acciones con margen interno de 20 a la derecha (pasos 2–4). */
  accionesInset?: boolean;
  actions?: ReactNode;
  children?: ReactNode;
};

export function CheckoutCard({ title, intro, espacio = 15, accionesInset = true, actions, children }: CheckoutCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <img src={decore} alt="" className={styles.decore} width={185} height={196} />
        <h2 className={`${styles.title} text-headline-medium`}>{title}</h2>
      </div>
      <div className={styles.contenido} style={{ gap: espacio, paddingTop: espacio }}>
        {intro && <p className={`${styles.intro} text-os-subheadline`}>{intro}</p>}
        {children}
        {actions && <div className={accionesInset ? `${styles.actions} ${styles.actionsInset}` : styles.actions}>{actions}</div>}
      </div>
    </section>
  );
}
