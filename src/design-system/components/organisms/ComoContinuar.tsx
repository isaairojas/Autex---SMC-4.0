/**
 * SIN RESPALDO EN FIGMA (D40). Réplica del modal de autex.com.mx al pulsar "Proceder al pago" sin sesión
 * (captura 2026-10-06): "¿Cómo deseas continuar?" con "Usuario invitado" / "Tengo una cuenta Autex",
 * "Cancelar" y "Aceptar" (deshabilitado hasta elegir). Compuesto con Modal, Radio y Button.
 */
import { useState } from 'react';
import { Button } from '../atoms/Button';
import { Radio } from '../atoms/Radio';
import { Modal } from './Modal';
import styles from './ComoContinuar.module.css';

export type ModoCompra = 'invitado' | 'cuenta';

type Props = { onAceptar: (modo: ModoCompra) => void; onClose: () => void };

const OPCIONES: { id: ModoCompra; texto: string }[] = [
  { id: 'invitado', texto: 'Usuario invitado' },
  { id: 'cuenta', texto: 'Tengo una cuenta Autex' },
];

export function ComoContinuar({ onAceptar, onClose }: Props) {
  const [modo, setModo] = useState<ModoCompra | null>(null);
  return (
    <Modal
      titulo="¿Cómo deseas continuar?"
      onClose={onClose}
      ancho={580}
      top={140}
      acciones={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={!modo} onClick={() => modo && onAceptar(modo)}>
            Aceptar
          </Button>
        </>
      }
    >
      <div className={styles.opciones} role="radiogroup" aria-label="¿Cómo deseas continuar?">
        {OPCIONES.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={modo === o.id} className={`${styles.opcion} text-body-1-book`} onClick={() => setModo(o.id)}>
            <Radio selected={modo === o.id} size="small" />
            {o.texto}
          </button>
        ))}
      </div>
    </Modal>
  );
}
