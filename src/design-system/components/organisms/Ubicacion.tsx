/**
 * SIN RESPALDO EN FIGMA (D5): selección de código postal / dirección.
 * Compuesto solo con componentes existentes: Modal (2599:100517), TextField (127:64412),
 * Toast (2596:99563), OpcionSeleccionable (2596:100531) y Button.
 */
import { useState } from 'react';
import { Button } from '../atoms/Button';
import { TextField } from '../atoms/TextField';
import { Toast } from '../molecules/Toast';
import { OpcionSeleccionable } from '../molecules/OpcionSeleccionable';
import { Modal } from './Modal';
import { CODIGOS_POSTALES } from '../../../mocks/existencias';
import type { Ubicacion as TUbicacion } from '../../../mocks/clientes';

type Props = { onClose: () => void; onConfirmar: (u: TUbicacion) => void; actual: TUbicacion | null };

export function Ubicacion({ onClose, onConfirmar, actual }: Props) {
  const [cp, setCp] = useState(actual?.codigoPostal ?? '');
  const encontrado = CODIGOS_POSTALES.find((c) => c.codigoPostal === cp.trim());
  const error = cp.trim().length === 5 && !encontrado;
  return (
    <Modal
      titulo="Elige tu ubicación"
      onClose={onClose}
      acciones={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={!encontrado} onClick={() => encontrado && onConfirmar(encontrado)}>
            Confirmar
          </Button>
        </>
      }
    >
      <div style={{ width: 792, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <TextField label="Código Postal" helper="" value={cp} onChange={(v) => setCp(v.replace(/\D/g, '').slice(0, 5))} placeholder="Escribe tu código postal" />
        {error && <Toast>Lo sentimos, no pudimos determinar tu ubicación exacta, intenta agregar tu ubicación manualmente.</Toast>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CODIGOS_POSTALES.map((c) => (
            <OpcionSeleccionable
              key={c.codigoPostal}
              selected={cp === c.codigoPostal}
              onSelect={() => setCp(c.codigoPostal)}
              titulo={`${c.codigoPostal} · ${c.ciudad}`}
              descripcion={`${c.ciudad}, ${c.estado}`}
              etiqueta={c.cobertura ? 'Productos disponibles' : undefined}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
