/**
 * SIN RESPALDO EN FIGMA. Réplica de autex.com.mx/busqueda-marca (2026-10-05): índice A–Z,
 * buscador por nombre y columnas de marcas. Cada marca lleva a la búsqueda filtrada.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../design-system/components/atoms/Icon';
import { MARCAS_POR_LETRA } from '../../mocks/sitio';
import { PageShell } from '../PageShell';
import { rutaBusqueda } from './Mosaico';
import styles from './Sitio.module.css';

const LETRAS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), '0-9'];

export function Marcas() {
  const [filtro, setFiltro] = useState('');
  const f = filtro.trim().toLowerCase();
  const grupos = ['0-9', ...LETRAS.slice(0, 26)].map((l) => ({
    letra: l,
    marcas: (MARCAS_POR_LETRA[l] ?? []).filter((m) => !f || m.toLowerCase().includes(f)),
  }));

  return (
    <PageShell version2026 enlaceActivo="Marcas">
      <div className={styles.contenido} style={{ width: 1536, gap: 24 }}>
        <h1 className={`${styles.titulo} text-heading-3-medium`}>Búsqueda por marca</h1>
        <div className={styles.letras}>
          {LETRAS.map((l) => (
            <button
              key={l}
              type="button"
              className={`${styles.letra} ${l === '0-9' ? styles.letraAncha : ''} text-body-1-book`}
              disabled={!(MARCAS_POR_LETRA[l] ?? []).length}
              onClick={() => document.getElementById(`marca-${l}`)?.scrollIntoView({ behavior: 'smooth' })}
            >
              {l}
            </button>
          ))}
        </div>
        <label className={styles.campo}>
          <input className="text-body-1-book" placeholder="Buscar por nombre de la marca" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
          <Icon name="search" />
        </label>
        <div className={styles.columnasMarcas} style={{ marginTop: 24 }}>
          {grupos.map((g) => (
            <div key={g.letra} id={`marca-${g.letra}`} className={styles.grupoMarca}>
              <h3 className={`text-heading-1-book ${g.marcas.length ? '' : styles.sinMarcas}`}>{g.letra}</h3>
              <ul className="text-body-2-book">
                {g.marcas.length ? (
                  /* autex.com.mx repite algunas marcas (p. ej. BOSCH); se conservan y la clave usa el índice. */
                  g.marcas.map((m, i) => (
                    <li key={`${m}-${i}`}>
                      <Link to={rutaBusqueda({ marca: m })}>{m}</Link>
                    </li>
                  ))
                ) : (
                  <li className={styles.sinMarcas}>Sin marcas disponibles</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
