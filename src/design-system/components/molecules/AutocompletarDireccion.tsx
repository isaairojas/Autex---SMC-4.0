/**
 * SIN RESPALDO EN FIGMA (D51). Campo "Buscar dirección" con sugerencias mientras se escribe, al estilo del
 * autocompletado de Google Maps: lista bajo el campo, ícono de ubicación, línea principal y secundaria; se navega con
 * las flechas, Enter elige y Escape cierra.
 */
import { useState } from 'react';
import { Icon } from '../atoms/Icon';
import styles from './AutocompletarDireccion.module.css';

export type OpcionDireccion = { principal: string; secundario: string };

type Props = {
  etiqueta: string;
  placeholder: string;
  valor: string;
  onCambiar: (texto: string) => void;
  sugerencias: OpcionDireccion[];
  onElegir: (indice: number) => void;
  /** Leyenda al pie de la lista (p. ej. el origen de las sugerencias). */
  pie?: string;
};

export function AutocompletarDireccion({ etiqueta, placeholder, valor, onCambiar, sugerencias, onElegir, pie }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState(0);
  const visible = abierto && sugerencias.length > 0;
  const elegir = (i: number) => {
    onElegir(i);
    setAbierto(false);
  };
  return (
    <label className={styles.campo}>
      <span className="text-body-2-book">{etiqueta}</span>
      <span className={styles.caja}>
        <Icon name="search" color="var(--color-neutral-600)" />
        <input
          className="text-body-1-book"
          role="combobox"
          aria-expanded={visible}
          aria-controls="sugerencias-direccion"
          aria-autocomplete="list"
          aria-label={etiqueta}
          autoComplete="off"
          placeholder={placeholder}
          value={valor}
          onChange={(e) => {
            onCambiar(e.target.value);
            setActiva(0);
            setAbierto(true);
          }}
          onFocus={() => setAbierto(true)}
          onBlur={() => setAbierto(false)}
          onKeyDown={(e) => {
            if (!visible) return;
            if (e.key === 'ArrowDown') setActiva((a) => (a + 1) % sugerencias.length);
            else if (e.key === 'ArrowUp') setActiva((a) => (a - 1 + sugerencias.length) % sugerencias.length);
            else if (e.key === 'Enter') elegir(activa);
            else if (e.key === 'Escape') setAbierto(false);
            else return;
            e.preventDefault();
          }}
        />
      </span>
      {visible && (
        <ul id="sugerencias-direccion" role="listbox" className={styles.lista}>
          {sugerencias.map((s, i) => (
            <li
              key={`${s.principal}-${s.secundario}`}
              role="option"
              aria-selected={i === activa}
              className={i === activa ? `${styles.opcion} ${styles.activa}` : styles.opcion}
              /* mousedown para elegir antes de que el campo pierda el foco */
              onMouseDown={(e) => {
                e.preventDefault();
                elegir(i);
              }}
              onMouseEnter={() => setActiva(i)}
            >
              <Icon name="location_on" color="var(--color-neutral-600)" />
              <span className={styles.textos}>
                <span className="text-body-1-medium">{s.principal}</span>
                <span className={`${styles.secundario} text-body-2-book`}>{s.secundario}</span>
              </span>
            </li>
          ))}
          {pie && <li className={`${styles.pie} text-caption-book`}>{pie}</li>}
        </ul>
      )}
    </label>
  );
}
