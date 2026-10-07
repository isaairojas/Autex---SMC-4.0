/**
 * Figma: "Disponibilidad en tiendas" — 2596:99510 (título), Toast 2596:99563, Tabs 2596:99607,
 * Input form 2596:99667, lista de estados 2596:99870 y lista de sucursales "Tiendas" 129:65474.
 * Reutilizado dentro del modal "Editar de método de envío" (2599:100517).
 * Última sincronización: 2026-10-02
 */
import { useState } from 'react';
import { Icon } from '../atoms/Icon';
import { Radio } from '../atoms/Radio';
import { Tabs } from '../molecules/Tabs';
import { Toast } from '../molecules/Toast';
import { OpcionSeleccionable } from '../molecules/OpcionSeleccionable';
import { ESTADOS, SUCURSALES_JALISCO } from '../../../mocks/logistica';
import styles from './SeleccionSucursal.module.css';

type Props = {
  /** Estado elegido; con valor se muestran las sucursales. */
  estado: string | null;
  /** Muestra el aviso "no pudimos determinar tu ubicación". */
  aviso?: boolean;
  /** Estado marcado en la lista de radios. */
  estadoMarcado?: string | null;
  onEstado: (estado: string) => void;
  onLimpiar: () => void;
  sucursalId: string | null;
  onSucursal: (id: string) => void;
  ancho?: number;
};

export function SeleccionSucursal({ estado, aviso, estadoMarcado, onEstado, onLimpiar, sucursalId, onSucursal, ancho = 1083 }: Props) {
  const [tab, setTab] = useState(0);
  return (
    <div className={styles.wrap} style={{ width: ancho, gap: estado ? 18 : 16 }}>
      <div className={styles.head}>
        <p className={`${styles.title} text-os-body-1`}>Disponibilidad en tiendas</p>
        {aviso && !estado && <Toast>Lo sentimos, no pudimos determinar tu ubicación exacta, intenta agregar tu ubicación manualmente.</Toast>}
        <Tabs tabs={['Estado', 'Código Postal o Tienda']} activa={tab} onChange={setTab} />
      </div>
      <div className={styles.input}>
        <span className={`${styles.value} text-body-1-book`}>{estado ?? 'Selecciona tu estado'}</span>
        {estado ? (
          <button type="button" className={styles.iconBtn} onClick={onLimpiar} aria-label="Quitar estado">
            <Icon name="close" box={16} size={16} />
          </button>
        ) : (
          <Icon name="expand_more" box={16} size={16} />
        )}
      </div>
      {!estado && (
        <div className={styles.estados}>
          {ESTADOS.map((col, i) => (
            <div key={i} className={styles.col}>
              {col.map((e) => (
                <button key={e} type="button" className={styles.radioLabel} onClick={() => onEstado(e)}>
                  <Radio selected={e === estadoMarcado} />
                  <span className="text-body-1-book">{e}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
      {estado && (
        <div className={styles.tiendas}>
          {SUCURSALES_JALISCO.map((s) => (
            <OpcionSeleccionable
              key={s.id}
              selected={sucursalId === s.id}
              onSelect={() => onSucursal(s.id)}
              titulo={s.nombre}
              extra={s.km}
              descripcion={s.direccion}
              horario={s.horario}
              etiqueta="Productos disponibles"
            />
          ))}
        </div>
      )}
    </div>
  );
}
