/**
 * Figma (Autex_2026_Frames): Filtros 657:14087 — 348 de ancho, paneles "Fil" (898:19732 Especialidad,
 * 898:22897 Categoría, 898:23150 Familia, 898:23404 Marcas), Precio (83:2847) y "Limpiar filtros".
 * Las listas tienen scroll con la barra decorativa de Figma (48:1017).
 * Última sincronización: 2026-10-05
 */
import { useState } from 'react';
import { Icon } from '../atoms/Icon';
import styles from './Filtros2026.module.css';

const PANELES: { titulo: string; alto?: number; activo?: boolean; items: string[] }[] = [
  { titulo: 'Especialidad', activo: true, items: ['Servicio Ligero', 'Servicio Pesado', 'Motocicletas', 'Miscelaneo'] },
  {
    titulo: 'Categoría',
    alto: 244,
    items: [
      'Fuel injection',
      'Sistema de carga',
      'Sistema Eléctrico',
      'Sistema de arranque',
      'Sistema de enfriamiento',
      'Sistema de encendido',
      'Motor',
      'Colisión',
      'Sistema de suspensión y frenos',
      'Sistema mecánico',
    ],
  },
  {
    titulo: 'Familia',
    alto: 241,
    items: ['Bomba de gasolina', 'Cuerpo de aceleración', 'Rectificador de corriente', 'Rotor', 'Estator', 'Solenoide', 'Sensor', 'Marcha', 'Polea', 'Motoventilador'],
  },
  { titulo: 'Marcas', alto: 240, items: ['T Tecnofuel', 'Reward', 'Values Starter', 'QBH Carfan', 'QBH Dynamic', 'Depo', 'Grob', 'Zen', 'Nacional', 'Importado'] },
];

type Props = { marcados?: Set<string>; onCambiar?: (marcados: Set<string>) => void };

export function Filtros2026({ marcados = new Set(), onCambiar }: Props) {
  const [abiertos, setAbiertos] = useState<Record<string, boolean>>({});
  const alternar = (item: string) => {
    const s = new Set(marcados);
    if (s.has(item)) s.delete(item);
    else s.add(item);
    onCambiar?.(s);
  };
  return (
    <aside className={styles.filtros}>
      <div className={styles.paneles}>
        {PANELES.map((p) => {
          const cerrado = abiertos[p.titulo] === false;
          return (
            <div key={p.titulo} className={styles.panel}>
              <button type="button" className={styles.head} onClick={() => setAbiertos({ ...abiertos, [p.titulo]: cerrado })}>
                <span className="text-subheadline-book">{p.titulo}</span>
                <Icon name={cerrado ? 'expand_more' : 'expand_less'} />
              </button>
              {!cerrado && (
                <>
                  <div className={p.activo ? `${styles.buscar} ${styles.buscarActivo}` : styles.buscar}>
                    <span className="text-body-2-book">Buscar...</span>
                    <Icon name="search" />
                  </div>
                  <div className={styles.lista} style={p.alto ? { height: p.alto } : undefined}>
                    <div className={styles.items}>
                      {p.items.map((it) => (
                        <label key={it} className={styles.item}>
                          <input type="checkbox" className={styles.checkbox} checked={marcados.has(it)} onChange={() => alternar(it)} />
                          <span className="text-body-1-book">{it}</span>
                        </label>
                      ))}
                    </div>
                    <span className={styles.scroll}>
                      <span className={styles.thumb} />
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
        <div className={styles.precio}>
          <p className={`${styles.precioTitulo} text-subheadline-book`}>Precio</p>
          <div className={styles.barraWrap}>
            <span className={styles.barra} />
            <span className={styles.rango}>
              <span className={styles.rangoBar} />
              <span className={styles.dot} style={{ left: 0 }} />
              <span className={styles.dot} style={{ right: -4 }} />
            </span>
          </div>
          <div className={styles.montos}>
            <span className="text-body-1-book">100.00</span>
            <span className="text-body-1-book">$1,000.00</span>
          </div>
        </div>
      </div>
      <div className={styles.limpiarWrap}>
        <button type="button" className={`${styles.limpiar} text-body-1-book`} onClick={() => onCambiar?.(new Set())}>
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}
