/**
 * Figma (Autex_2026_Frames): Head → Navbar Desktop 606:13261 (instancia 673:18975)
 * URL: https://www.figma.com/design/UKrGgTeW6ld3CpGOFErLXX/?node-id=673-18975
 * Diferencias con Navbar (archivo anterior): banner con WhatsApp y "$499 MXN", una sola fila
 * justify-between, sin campana, chip de usuario con empresa y navegación con enlace activo subrayado.
 * Última sincronización: 2026-10-05
 */
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ESPECIALIDADES } from '../../../mocks/sitio';
import { Icon } from '../atoms/Icon';
import logo from '../../../assets/icons/autex-logo-navbar.svg';
import whatsapp from '../../../assets/icons/navbar-whatsapp.svg';
import styles from './Navbar2026.module.css';

type Navbar2026Props = {
  ubicacion?: string;
  ubicacionDetalle?: string;
  onUbicacionClick?: () => void;
  /** Sin valor se muestra "Ingresar" (sin respaldo en Figma: el archivo 2026 solo muestra cliente registrado). */
  usuario?: string | null;
  empresa?: string;
  onUsuarioClick?: () => void;
  carrito?: number;
  onCarritoClick?: () => void;
  /** Enlace subrayado en "Link navigation" (I673:18975;606:13287). */
  activo?: 'Inicio' | 'Catálogo' | 'Marcas' | 'Promociones' | null;
  /**
   * Textos del sitio real autex.com.mx en lugar de los de Figma: "Ofertas", "Hola / nombre" y campana con sesión
   * iniciada. La galería de Figma lo deja en false.
   */
  sitio?: boolean;
  /**
   * Chip "Buscando para" (sin respaldo en Figma: comportamiento de autex.com.mx). Sin la prop se muestra el texto
   * de Figma; null muestra "Mis vehículos" (navegar sin vehículo).
   */
  vehiculo?: string | null;
  onVehiculoClick?: () => void;
  /** Chip "Entrega en C.P." junto al de la tienda (sin respaldo en Figma, D31). */
  entrega?: string;
  /** Línea 1 del chip de entrega; con dirección guardada lleva el C.P. ("Entrega en 45040"). */
  entregaTitulo?: string;
  onEntregaClick?: () => void;
};

const LINKS = ['Inicio', 'Catálogo', 'Marcas', 'Promociones'] as const;
/* Destinos de autex.com.mx: Inicio, Catálogo, Marcas y Ofertas ("Promociones" en Figma). */
const RUTAS: Record<(typeof LINKS)[number], string> = { Inicio: '/', Catálogo: '/catalogo', Marcas: '/marcas', Promociones: '/ofertas' };

export function Navbar2026({
  ubicacion = 'Calz. del Federalismo N',
  ubicacionDetalle = 'Abierto hasta las 6:00PM',
  onUbicacionClick,
  usuario,
  empresa,
  onUsuarioClick,
  carrito = 0,
  onCarritoClick,
  activo = 'Catálogo',
  sitio = false,
  vehiculo,
  onVehiculoClick,
  entrega,
  entregaTitulo = 'Entrega en',
  onEntregaClick,
}: Navbar2026Props) {
  const navigate = useNavigate();
  const [texto, setTexto] = useState('');
  const [especialidad, setEspecialidad] = useState<string | null>(null);
  const [menuEsp, setMenuEsp] = useState(false);
  const buscar = (e: FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (texto.trim()) q.set('q', texto.trim());
    if (especialidad) q.set('especialidad', especialidad);
    navigate(`/busqueda${q.toString() ? `?${q}` : ''}`);
  };
  return (
    <header className={styles.navbar}>
      {/* Banner informative · I673:18975;606:13262 */}
      <div className={styles.banner}>
        <div className={`${styles.bannerText} text-body-1-medium`}>
          <span>ENVÍO GRATIS A TODO MÉXICO</span>
          <span>|</span>
          <span>COMPRAS MAYORES A $499 MXN</span>
        </div>
        <div className={styles.bannerButtons}>
          <span className={styles.bannerItem}>
            <Icon name="info" color="var(--color-nativo-blanco)" />
            <span className="text-body-1-book">AYUDA</span>
          </span>
          <span className={styles.bannerItem}>
            <Icon name="call" color="var(--color-nativo-blanco)" />
            <span className="text-body-1-book">33 3205 4440</span>
          </span>
          <span className={styles.bannerItem}>
            <img src={whatsapp} alt="" width={18} height={17.419} />
            <span className="text-body-1-book">33 2835 9694</span>
          </span>
        </div>
      </div>

      {/* Navbar · I673:18975;606:13277 */}
      <div className={styles.main}>
        <div className={styles.row}>
          <Icon name="menu" box={40} size={36} />
          <Link to="/" className={styles.brand} aria-label="Autex inicio">
            <img src={logo} alt="AUTEX" width={165.087} height={24.1553} />
          </Link>
          <button type="button" className={styles.chip} onClick={onVehiculoClick} aria-label="Mis vehículos" data-ancla="vehiculo">
            <Icon name="directions_car_filled" />
            <span className={styles.chipText}>
              {vehiculo === null ? (
                <span className={styles.line1}>Mis vehículos</span>
              ) : (
                <>
                  <span className={styles.line1}>Buscando para</span>
                  <span className={styles.line2Primary}>{vehiculo ?? 'Cadillac ATS Premium 2014...'}</span>
                </>
              )}
            </span>
          </button>
          <form className={entrega ? `${styles.searchbar} ${styles.searchbarSitio}` : styles.searchbar} onSubmit={buscar} role="search">
            <button type="button" className={styles.categories} onClick={() => setMenuEsp(!menuEsp)} aria-expanded={menuEsp}>
              <span className="text-body-1-book">{especialidad ?? 'Todas las Especialidades'}</span>
              <Icon name="arrow_drop_down" box={16} size={16} />
            </button>
            {/* Lista de especialidades de autex.com.mx (sin respaldo en Figma). */}
            {menuEsp && (
              <ul className={styles.menuEsp}>
                {[null, ...ESPECIALIDADES].map((e) => (
                  <li key={e ?? 'todas'}>
                    <button
                      type="button"
                      className="text-body-1-book"
                      onClick={() => {
                        setEspecialidad(e);
                        setMenuEsp(false);
                      }}
                    >
                      {e ?? 'Todas las Especialidades'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <label className={styles.search}>
              <input
                className={`${styles.placeholder} ${styles.input} text-body-2-book`}
                placeholder="Buscar marca, modelo, tipo de producto..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                aria-label="Buscar productos"
              />
              <button type="submit" className={styles.lupa} aria-label="Buscar">
                <Icon name="search" />
              </button>
            </label>
          </form>
          <div className={styles.grupo}>
            <button type="button" className={`${styles.chip} ${styles.location}`} onClick={onUbicacionClick} aria-label="Mi tienda" data-ancla="tienda">
              <Icon name={entrega ? 'store' : 'location_on'} />
              <span className={styles.chipText}>
                <span className={styles.line1}>{ubicacion}</span>
                <span className={styles.line2Green}>{ubicacionDetalle}</span>
              </span>
            </button>
            {entrega && (
              <button type="button" className={`${styles.chip} ${styles.entrega}`} onClick={onEntregaClick} aria-label="Entrega en" data-ancla="entrega">
                <Icon name="location_on" color="var(--color-secondary-500)" />
                <span className={styles.chipText}>
                  <span className={styles.line1}>{entregaTitulo}</span>
                  <span className={styles.line2Primary}>{entrega}</span>
                </span>
              </button>
            )}
          </div>
          <button type="button" className={styles.chip} onClick={onUsuarioClick} data-ancla="usuario" aria-label={usuario ? 'Mi cuenta' : 'Ingresar'}>
            <Icon name="person" color="var(--color-primary-500)" />
            <span className={styles.chipText}>
              {/* Sitio con sesión iniciada (captura del usuario): "Hola" arriba y el nombre abajo. */}
              {sitio && usuario && <span className={styles.line2Gray}>Hola</span>}
              <span className={styles.line1Primary}>{usuario ?? 'Ingresar'}</span>
              {!sitio && empresa && <span className={styles.line2Gray}>{empresa}</span>}
            </span>
          </button>
          {sitio && usuario && (
            <button type="button" className={styles.campana} aria-label="Notificaciones">
              <Icon name="notifications" />
            </button>
          )}
          <button type="button" className={styles.cart} onClick={onCarritoClick}>
            <Icon name="shopping_cart" />
            <span className={`${styles.badge} text-caption-book`}>{carrito > 99 ? '99+' : carrito}</span>
          </button>
        </div>
      </div>

      {/* Link navigation · I673:18975;606:13287 */}
      <nav className={styles.links}>
        <div className={styles.linksRow}>
          {LINKS.map((l) => (
            <Link key={l} to={RUTAS[l]} className={`${styles.link} ${l === activo ? styles.linkActivo : ''} text-body-1-book`}>
              {sitio && l === 'Promociones' ? 'Ofertas' : l}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
