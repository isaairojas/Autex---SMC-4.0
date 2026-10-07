/**
 * Figma (Autex_2026_Frames): Autex_Catalogo_Stock_Cliente Registrado - 1 (657:14082)
 * Head 2026 · Busqueda (SearchByCar 657:14085) · Body Resulta search (Filtros 657:14087 + Resultado de busqueda 657:14088:
 * barra de orden, cuadrícula de 12 tarjetas con existencia SMC 4.0 y paginado) · Footer 491.
 * Reemplaza a "New Home Autex - Cuadricula" (12849:114186) del archivo anterior. Ruta /busqueda.
 * Filtros por parámetros (q, especialidad, categoria, marca) y estado "Tu búsqueda no coincidió…"
 * de autex.com.mx (sin respaldo en Figma). En la demo se ocultan los productos sin existencia en la zona, con
 * filtro para mostrarlos, y la existencia va por rangos ("+100 pzs", D34); la galería conserva el frame de Figma.
 * Última sincronización: 2026-10-05
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../../design-system/components/atoms/Icon';
import { Filtros2026 } from '../../design-system/components/organisms/Filtros2026';
import { TarjetaProducto } from '../../design-system/components/organisms/TarjetaProducto';
import { AvisoNoDisponibles, FiltroNoDisponibles } from '../../design-system/components/molecules/NoDisponibles';
import { CargaPagina } from '../../design-system/components/molecules/CargaPagina';
import dots from '../../assets/icons/pagination-dots.svg';
import { CATALOGO_SITIO, GRID_2026_FIGMA, type ProductoCatalogo } from '../../mocks/catalogo';
import { estadoExistencia, etiquetaExistencia, existenciaEnLinea, maximoVenta, piezasEnTiendas } from '../../mocks/existencias';
import { useDemo } from '../../state/DemoContext';
import { PageShell } from '../PageShell';
import styles from './Inicio.module.css';

/* Familia de cada producto para el filtro "Familia" de la demo. */
const FAMILIA: Record<string, string> = {
  'bomba-gasolina': 'Bomba de gasolina',
  'modulo-bomba': 'Bomba de gasolina',
  'cuerpo-aceleracion': 'Cuerpo de aceleración',
  alternador: 'Rectificador de corriente',
  marcha: 'Marcha',
  ventilador: 'Motoventilador',
};

const PAGINAS = ['2', '3', '4'];

/* Especialidad y categoría de cada producto (catálogo de autex.com.mx). */
const CATEGORIA: Record<string, string> = {
  'inyector-ai3922': 'Refacciones del sistema de inyeccion',
  'switch-encendido': 'Refacciones electricas arranque y carga',
  'cuerpo-aceleracion': 'Refacciones del sistema de inyeccion',
  'filtro-aire': 'Mantenimiento de rutina',
  'faro-ai3922': 'Refacciones de iluminacion',
  'faro-derecho': 'Refacciones de iluminacion',
  marcha: 'Refacciones electricas arranque y carga',
  alternador: 'Refacciones electricas arranque y carga',
  'bomba-gasolina': 'Refacciones del sistema de inyeccion',
  'modulo-bomba': 'Refacciones del sistema de inyeccion',
  ventilador: 'Enfriamiento y aire acondicionado',
  'switch-luces': 'Refacciones de iluminacion',
};
const sinAcentos = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function Inicio() {
  const navigate = useNavigate();
  const { modoFigma, agregar, ubicacion, abrirUbicacion, carrito } = useDemo();
  const enCarrito = (id: string) => carrito.find((l) => l.producto.id === id)?.cantidad ?? 0;
  const [params] = useSearchParams();
  const [filtros, setFiltros] = useState<Set<string>>(new Set());
  const [verNoDisponibles, setVerNoDisponibles] = useState(false);
  /* Sitio (D36): carga de página al buscar o cambiar categoría, marca, vehículo o filtros (la de ubicación la hace PageShell). */
  const [cargandoProductos, setCargandoProductos] = useState(!modoFigma);
  const claveFiltros = [...filtros].sort().join('|');
  useEffect(() => {
    if (modoFigma) return;
    setCargandoProductos(true);
    const t = window.setTimeout(() => setCargandoProductos(false), 800);
    return () => window.clearTimeout(t);
  }, [modoFigma, params.toString(), claveFiltros, verNoDisponibles]); // eslint-disable-line react-hooks/exhaustive-deps
  const base = modoFigma ? GRID_2026_FIGMA : CATALOGO_SITIO;
  const familias = [...filtros].filter((f) => Object.values(FAMILIA).includes(f));
  const q = sinAcentos(params.get('q') ?? '');
  const especialidad = params.get('especialidad');
  const categoria = params.get('categoria');
  const marca = params.get('marca');
  const encontrados = base.filter(
    (p) =>
      (!familias.length || familias.includes(FAMILIA[p.id])) &&
      (!q || q.split(/\s+/).every((w) => sinAcentos(`${p.nombre} ${p.marca} ${p.categoria ?? CATEGORIA[p.id] ?? ''} ${p.especialidad ?? ''}`).includes(w))) &&
      (!especialidad || (p.especialidad ?? 'Automotriz') === especialidad) &&
      (!categoria || (p.categoria ?? CATEGORIA[p.id]) === categoria) &&
      (!marca || sinAcentos(p.marca).includes(sinAcentos(marca).replace(/^t\s+/, ''))),
  );
  const vehiculo = ['anio', 'marca_auto', 'modelo', 'motor'].map((k) => params.get(k)).filter(Boolean);

  const estado = (p: ProductoCatalogo) => (modoFigma ? p.estadoFigma ?? 'disponible' : estadoExistencia(p.id, ubicacion?.codigoPostal ?? null));
  /* Sitio: los productos sin existencia en la zona se ocultan salvo que el cliente pida verlos. */
  const ocultos = modoFigma ? 0 : encontrados.filter((p) => estado(p) === 'sin-existencia').length;
  const productos = modoFigma || verNoDisponibles ? encontrados : encontrados.filter((p) => estado(p) !== 'sin-existencia');

  const onAgregar = (p: ProductoCatalogo, cantidad: number) => {
    if (!ubicacion) {
      abrirUbicacion();
      return;
    }
    agregar(p, cantidad);
  };

  return (
    <PageShell version2026 enlaceActivo="Catálogo">
      {cargandoProductos && <CargaPagina texto="Cargando productos…" />}
      <section className={styles.busqueda}>
        <p className={`${styles.busquedaTitulo} text-heading-3-medium`}>Encuentra los mejores productos para tu vehículo</p>
        <div className={styles.vehiculo}>
          {['Año', 'Marca', 'Modelo', 'Motor (opcional)'].map((c) => (
            <div key={c} className={styles.select}>
              <span className="text-body-1-book">{c}</span>
              <Icon name="expand_more" box={16} size={16} />
            </div>
          ))}
          <button type="button" className={styles.buscar} aria-label="Buscar vehículo">
            <Icon name="search" size={24} color="var(--color-nativo-blanco)" />
          </button>
        </div>
      </section>
      <div className={styles.cuerpo}>
        {modoFigma ? (
          <Filtros2026 marcados={filtros} onCambiar={setFiltros} />
        ) : (
          <div className={styles.columnaFiltros}>
            <Filtros2026 marcados={filtros} onCambiar={setFiltros} />
            <FiltroNoDisponibles ocultos={ocultos} mostrar={verNoDisponibles} onCambiar={setVerNoDisponibles} />
          </div>
        )}
        <div className={styles.resultados}>
          <div className={styles.barra}>
            {(vehiculo.length > 0 || especialidad || categoria || marca || q) && (
              <p className={`${styles.criterios} text-body-2-book`}>
                {[vehiculo.join(' '), especialidad, categoria, marca, params.get('q')].filter(Boolean).join(' · ')}
              </p>
            )}
            <div className={styles.porPagina}>
              <span className="text-body-1-book">12</span>
              <Icon name="arrow_drop_down" box={16} size={16} />
            </div>
            <div className={styles.orden}>
              <span className="text-body-1-book">Relevancia</span>
              <Icon name="expand_more" box={16} size={16} />
            </div>
            <span className={`${styles.total} text-body-1-book`}>{modoFigma ? 25 : productos.length}</span>
            <span className={`${styles.vista} ${styles.vistaOn}`}>
              <Icon name="grid_view" />
            </span>
            <span className={styles.vista}>
              <Icon name="view_list" color="var(--color-neutral-600)" />
            </span>
          </div>
          <div className={styles.grid}>
            {encontrados.length === 0 && (
              /* Estado vacío de autex.com.mx/busqueda (sin respaldo en Figma). */
              <div className={styles.vacio}>
                <p className="text-heading-3-medium">"Tu búsqueda no coincidió con ningún producto"</p>
                <ul className="text-body-1-book">
                  {['Comprueba que has escrito correctamente', 'Intenta buscando con una o dos palabras', 'Intenta con una combinacion diferente de filtros', 'Intenta con un termino genérico'].map((t) => (
                    <li key={t}>
                      <Icon name="check" box={20} size={20} />
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="text-body-2-book">Si no puedes encontrar lo que deseas, puedes ponerte en contacto con nuestro centro de atención</p>
              </div>
            )}
            {productos.map((p) => (
              <TarjetaProducto
                key={p.id}
                producto={p}
                estado={estado(p)}
                estadoPara={modoFigma ? undefined : (n) => estadoExistencia(p.id, ubicacion?.codigoPostal ?? null, n + enCarrito(p.id))}
                piezas={modoFigma ? 104 : piezasEnTiendas(p.id)}
                etiquetaPiezas={modoFigma ? undefined : etiquetaExistencia(existenciaEnLinea(p.id, ubicacion?.codigoPostal ?? null))}
                maximo={modoFigma ? undefined : maximoVenta(p.id, ubicacion?.codigoPostal ?? null) - enCarrito(p.id)}
                onAgregar={(c) => onAgregar(p, c)}
                onVer={() => navigate(`/producto/${p.id}`)}
              />
            ))}
          </div>
          {!modoFigma && <AvisoNoDisponibles ocultos={ocultos} mostrar={verNoDisponibles} onCambiar={setVerNoDisponibles} />}
          {productos.length > 0 && (
          <div className={styles.paginado}>
            <div className={styles.pages}>
              <Icon name="arrow_back" color="var(--color-neutral-600)" />
              <div className={styles.nums}>
                <span className={`${styles.num} ${styles.numOn} text-subheadline-book`}>1</span>
                {/* Sitio: todos los resultados caben en una página (12 por página en Figma). */}
                {modoFigma &&
                  PAGINAS.map((n) => (
                    <span key={n} className={`${styles.num} text-subheadline-book`}>
                      {n}
                    </span>
                  ))}
                {modoFigma && <img src={dots} alt="" width={16} height={3} className={styles.dots} />}
                {modoFigma && <span className={`${styles.num} text-subheadline-book`}>14</span>}
              </div>
              <span style={{ transform: 'rotate(180deg) scaleY(-1)', display: 'flex' }}>
                <Icon name="arrow_back" color="var(--color-neutral-600)" />
              </span>
            </div>
            <p className={`${styles.conteo} text-caption-book`}>{modoFigma ? '12 -132 resultados' : `1 - ${productos.length} resultados`}</p>
          </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
