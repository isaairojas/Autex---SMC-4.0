/**
 * Figma: Modal / "Modal de edicion" (2599:100517, 2599:101789, 2599:104102) sobre fondo Alpha/Back Alpha 300.
 * Cabecera gris con título y cerrar, contenido y pie con acciones.
 * Última sincronización: 2026-10-02
 */
import type { ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import styles from './Modal.module.css';

type ModalProps = {
  titulo: string;
  onClose: () => void;
  ancho?: number;
  /** Distancia del modal al borde superior de la página (Figma: 424 o 485). */
  top?: number;
  /** Inicio del fondo oscuro (Figma: 0 o 61 según el frame). */
  fondoTop?: number;
  /** Contenido a la izquierda del pie (p. ej. botón "Envío a domicilio"). */
  pieIzquierda?: ReactNode;
  acciones?: ReactNode;
  children: ReactNode;
};

export function Modal({ titulo, onClose, ancho = 840, top = 424, fondoTop = 0, pieIzquierda, acciones, children }: ModalProps) {
  return (
    <div className={styles.backdrop} style={{ top: fondoTop }} onClick={onClose}>
      <div className={styles.modal} style={{ width: ancho, marginTop: top - fondoTop }} onClick={(e) => e.stopPropagation()} role="dialog" aria-label={titulo}>
        <div className={styles.head}>
          <p className={`${styles.title} text-os-subheadline`}>{titulo}</p>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
            <Icon name="close" />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
        {(acciones || pieIzquierda) && (
          <div className={styles.footer} style={{ justifyContent: pieIzquierda ? 'space-between' : 'flex-end' }}>
            {pieIzquierda}
            <div className={styles.actions}>{acciones}</div>
          </div>
        )}
      </div>
    </div>
  );
}
