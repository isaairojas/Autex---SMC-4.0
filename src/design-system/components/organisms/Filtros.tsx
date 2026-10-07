/**
 * Figma: Sidebar (instancia 12849:114191) — filtros laterales de la página de resultados.
 * Especialidad, Vehículo + Buscar, Categoría, Familias, Precio, Marcas y "Limpiar filtros".
 * Última sincronización: 2026-10-02
 */
import { useState, type ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import styles from './Filtros.module.css';

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span className={`${styles.checkbox} ${checked ? styles.checked : ''}`} aria-hidden>
      {checked && <Icon name="check" box={24} size={20} color="var(--color-nativo-blanco)" />}
    </span>
  );
}

function Buscar() {
  return (
    <div className={styles.search}>
      <span className={`${styles.placeholder} text-body-2-book`}>Buscar...</span>
      <Icon name="search" />
    </div>
  );
}

function Panel({ titulo, children, gap = 0, borde }: { titulo: string; children: ReactNode; gap?: number; borde?: boolean }) {
  return (
    <div className={styles.panel} style={{ gap }}>
      <div className={`${styles.head} ${borde ? styles.headBorde : ''}`}>
        <p className={`${styles.headTitle} text-subheadline-book`}>{titulo}</p>
        <Icon name="expand_less" />
      </div>
      {children}
    </div>
  );
}

function ListaCheck({ items, mas, alto, marcados }: { items: string[]; mas?: boolean; alto?: number; marcados: Set<number>; }) {
  const [sel, setSel] = useState(marcados);
  const toggle = (i: number) => {
    const n = new Set(sel);
    if (n.has(i)) n.delete(i);
    else n.add(i);
    setSel(n);
  };
  return (
    <div className={styles.listWrap}>
      <div className={styles.list}>
        {items.map((it, i) => (
          <button key={i} type="button" className={styles.item} onClick={() => toggle(i)}>
            <span className={styles.checkLabel}>
              <Checkbox checked={sel.has(i)} />
              <span className="text-body-1-book">{it}</span>
            </span>
            {mas && <Icon name="add" />}
          </button>
        ))}
      </div>
      {alto && (
        <span className={styles.scroll}>
          <span className={styles.thumb} />
        </span>
      )}
    </div>
  );
}

function Select({ valor }: { valor: string }) {
  return (
    <div className={styles.input}>
      <span className="text-body-1-book">{valor}</span>
      <Icon name="arrow_drop_down" box={16} size={16} />
    </div>
  );
}

export function Filtros() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.filters}>
        <Panel titulo="Especialidad">
          <div className={styles.searchList}>
            <Buscar />
            <ListaCheck items={['Servicio ligero']} marcados={new Set()} />
          </div>
        </Panel>

        <div className={styles.panel} style={{ gap: 16 }}>
          <div style={{ width: '100%' }}>
            <div className={`${styles.head} ${styles.headBorde}`}>
              <p className={`${styles.headTitle} text-subheadline-book`}>Vehículo</p>
              <Icon name="expand_less" />
            </div>
            <div className={styles.inputs}>
              <Select valor="2020" />
              <Select valor="Chevrolet" />
              <Select valor="Cavalier" />
              <Select valor="4 Cil - 2.0L" />
            </div>
          </div>
          <button type="button" className={`${styles.buscar} text-body-1-book`}>
            Buscar
          </button>
        </div>

        <Panel titulo="Categoría">
          <div className={styles.searchList}>
            <Buscar />
            <ListaCheck mas alto={168} marcados={new Set()} items={['Refacciones eléctricas', 'Mantenimiento de rutina', 'Suspensión, dirección y frenos', 'Audio y multimedia']} />
          </div>
        </Panel>

        <Panel titulo="Familias">
          <div className={styles.searchList}>
            <Buscar />
            <ListaCheck mas alto={244} marcados={new Set()} items={['Bobinas de encendido', 'Afinación', 'Sistema de encendido', 'Suspención', 'Automotriz', 'Llaves']} />
          </div>
        </Panel>

        <div className={styles.panel} style={{ gap: 16 }}>
          <div className={styles.precioHead}>
            <p className={`${styles.headTitle} text-subheadline-book`}>Precio</p>
          </div>
          <div className={styles.barra}>
            <span className={styles.barBg} />
            <span className={styles.barSel}>
              <span className={styles.bar} />
              <span className={`${styles.dot} ${styles.dotR}`} />
              <span className={`${styles.dot} ${styles.dotL}`} />
            </span>
          </div>
          <div className={styles.precios}>
            <div className={styles.input}>
              <span className="text-body-1-book">100.00</span>
            </div>
            <div className={styles.input}>
              <span className="text-body-1-book">$1,000.00</span>
            </div>
          </div>
        </div>

        <Panel titulo="Marcas">
          <div className={styles.searchList}>
            <Buscar />
            <ListaCheck alto={404} marcados={new Set([0])} items={['Autolite', 'Bosch', 'Autolite', 'Beru', 'Denso', 'Federal', 'Garlo', 'Hy-power', 'Nacional', 'Importado']} />
          </div>
        </Panel>
      </div>
      <button type="button" className={`${styles.limpiar} text-body-1-book`}>
        Limpiar filtros
      </button>
    </aside>
  );
}
