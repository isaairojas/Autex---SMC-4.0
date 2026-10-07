/**
 * SIN RESPALDO EN FIGMA (2026-10-06). Réplica del modal "Mis vehículos" de autex.com.mx
 * (docs/autex-real/vehiculos/1-mis-vehiculos.png y 5-mis-vehiculos-despues.png): "Navegar sin vehículo",
 * "Agregar nuevo vehículo" (Año, Marca, Modelo, Motor opcional) y la lista con el vehículo activo marcado.
 * Compuesto con Modal, Button e Icon.
 */
import { useState } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Modal } from './Modal';
import { ANIOS, MARCAS_AUTO, MODELOS, MOTORES, nombreVehiculo, type Vehiculo } from '../../../mocks/vehiculos';
import styles from './MisVehiculos.module.css';

type Props = {
  vehiculos: Vehiculo[];
  activo: Vehiculo | null;
  invitado: boolean;
  onAgregar: (v: Omit<Vehiculo, 'id'>) => void;
  onActivar: (id: string | null) => void;
  onIngresar: () => void;
  onClose: () => void;
};

const VACIO = { anio: '', marca: '', modelo: '', motor: '' };

export function MisVehiculos({ vehiculos, activo, invitado, onAgregar, onActivar, onIngresar, onClose }: Props) {
  const [v, setV] = useState(VACIO);
  const [q, setQ] = useState('');
  const completo = !!(v.anio && v.marca && v.modelo);
  const f = q.trim().toLowerCase();
  const lista = vehiculos.filter((x) => !f || `${nombreVehiculo(x)} ${x.motor}`.toLowerCase().includes(f));
  const select = (campo: keyof typeof VACIO, etiqueta: string, opciones: string[], extra: Partial<typeof VACIO> = {}) => (
    <span className={styles.select}>
      <select className="text-body-1-book" value={v[campo]} onChange={(e) => setV({ ...v, [campo]: e.target.value, ...extra })} aria-label={etiqueta}>
        <option value="">{etiqueta}</option>
        {opciones.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <Icon name="expand_more" />
    </span>
  );
  return (
    <Modal titulo="Mis vehículos" onClose={onClose} ancho={840} top={218}>
      <div className={styles.cabecera}>
        <p className="text-subheadline-book">
          {invitado ? (
            <>
              <button type="button" className={`${styles.enlace} text-subheadline-book`} onClick={onIngresar}>
                Ingresa
              </button>{' '}
              a tu cuenta para administrar tus vehículos
            </>
          ) : (
            'Administra tus vehículos'
          )}
        </p>
        <button type="button" className={`${styles.navegar} text-subheadline-book`} onClick={() => onActivar(null)}>
          {activo ? 'Activar navegación sin vehículo' : 'Navegar sin vehículo'}
          {!activo && <Icon name="check_circle" color="var(--color-green-700)" />}
        </button>
      </div>
      <div className={styles.cuerpo}>
        <div className={styles.agregar}>
          <p className="text-subheadline-medium">Agregar nuevo vehículo</p>
          {select('anio', 'Año', ANIOS)}
          {select('marca', 'Marca', MARCAS_AUTO, { modelo: '' })}
          {select('modelo', 'Modelo', MODELOS[v.marca] ?? [])}
          {select('motor', 'Motor (Opcional)', v.modelo ? MOTORES : [])}
          <Button
            disabled={!completo}
            onClick={() => {
              onAgregar(v);
              setV(VACIO);
            }}
          >
            Agregar vehículo a la lista
          </Button>
        </div>
        <div className={styles.lista}>
          <label className={styles.buscar}>
            <input className="text-body-1-book" placeholder="Buscar por modelo, año, tipo de producto, marca..." value={q} onChange={(e) => setQ(e.target.value)} />
            <Icon name="search" />
          </label>
          {vehiculos.length === 0 ? (
            <div className={styles.vacio}>
              <span className={styles.circulo}>
                <Icon name="directions_car_filled" box={48} size={40} color="var(--color-neutral-500)" />
              </span>
              <p className="text-subheadline-book">No has seleccionado ningún vehículo</p>
            </div>
          ) : (
            lista.map((x) => (
              <button
                key={x.id}
                type="button"
                className={x.id === activo?.id ? `${styles.vehiculo} ${styles.activo} text-subheadline-book` : `${styles.vehiculo} text-subheadline-book`}
                onClick={() => onActivar(x.id)}
              >
                <span>
                  {nombreVehiculo(x)}
                  {x.motor && <span className={`${styles.motor} text-body-2-book`}> · {x.motor}</span>}
                </span>
                {x.id === activo?.id && <Icon name="check_circle" color="var(--color-green-700)" />}
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
