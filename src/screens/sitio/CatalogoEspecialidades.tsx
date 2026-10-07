/**
 * SIN RESPALDO EN FIGMA. Réplica de autex.com.mx/catalogo (2026-10-05): "Catálogo de productos",
 * especialidades y categorías de cada una. Cada mosaico lleva a la búsqueda filtrada.
 */
import { CATEGORIAS, ESPECIALIDADES } from '../../mocks/sitio';
import { PageShell } from '../PageShell';
import { IMAGEN_CATEGORIA, IMAGEN_ESPECIALIDAD } from './imagenes';
import { Mosaico, rutaBusqueda } from './Mosaico';
import styles from './Sitio.module.css';

export function CatalogoEspecialidades() {
  return (
    <PageShell version2026 enlaceActivo="Catálogo">
      <div className={styles.contenido} style={{ width: 1360 }}>
        <h1 className={`${styles.titulo} text-heading-3-medium`}>Catálogo de productos</h1>
        <section>
          <h2 className={`${styles.subtitulo} text-headline-book`}>Especialidades</h2>
          <div style={{ marginTop: 24 }}>
            <Mosaico items={ESPECIALIDADES.map((e) => ({ nombre: e, imagen: IMAGEN_ESPECIALIDAD[e], to: rutaBusqueda({ especialidad: e }) }))} />
          </div>
        </section>
        {ESPECIALIDADES.map((e) => (
          <section key={e}>
            <h3 className={`${styles.subtitulo} text-body-1-medium`}>{e}</h3>
            <div style={{ marginTop: 24 }}>
              <Mosaico
                items={(CATEGORIAS[e] ?? []).map((c) => ({
                  nombre: c,
                  imagen: IMAGEN_CATEGORIA[c] ?? { icono: 'inventory_2' },
                  to: rutaBusqueda({ especialidad: e, categoria: c }),
                }))}
              />
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
