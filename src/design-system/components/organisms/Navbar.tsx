/**
 * Figma: Navbar / Completed — Navbar Desktop
 * nodeId: 2617:106675 (instancia 2617:106676) · componente Head 1074:37407 (logueado / no logueado)
 * URL: https://www.figma.com/design/qp14Mbl7khZF2xWAwaocfP/?node-id=2617-106675
 * Última sincronización: 2026-10-05 (variante registrado según Autex_2026_Frames 719:22711)
 */
import { Link } from 'react-router-dom';
import { Icon } from '../atoms/Icon';
import punto from '../../../assets/icons/notificacion-punto.svg';
import logo from '../../../assets/icons/autex-logo-navbar.svg';
import styles from './Navbar.module.css';

type NavbarProps = {
  /** Línea 1 del indicador de ubicación. Figma: "Av. Periferico,45412,To..." */
  ubicacion?: string;
  /** Línea 2 del indicador de ubicación. Figma: "Abierto hasta las 6:00PM" */
  ubicacionDetalle?: string;
  onUbicacionClick?: () => void;
  /** Nombre del cliente registrado; sin valor se muestra "Ingresar". */
  usuario?: string | null;
  onUsuarioClick?: () => void;
  carrito?: number;
  onCarritoClick?: () => void;
  /** Registrado (Autex_2026_Frames, Navbar / Completed 719:22711): enlaces de B2B, chip con empresa y campana sin aviso. */
  logueado?: boolean;
  /** Variante B2B "Navbar Desktop" (2617:102447): banner Secondary/600, chip de usuario, campana con aviso. */
  b2b?: boolean;
  empresa?: string;
};

const LINKS_B2B = [
  { label: 'Inicio', to: '/' },
  { label: 'Catálogo', to: '/' },
  { label: 'Marcas', to: '/' },
  { label: 'Mis pedidos', to: '/' },
  { label: 'Listas', to: '/' },
  { label: 'Crédito', to: '/' },
  { label: 'Promociones', to: '/' },
];

const LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Catálogo', to: '/' },
  { label: 'Marcas', to: '/' },
  { label: 'Mis pedidos', to: '/' },
  { label: 'Preguntas frecuentes', to: '/' },
];

export function Navbar({
  ubicacion = 'Av. Periferico,45412,To...',
  ubicacionDetalle = 'Abierto hasta las 6:00PM',
  onUbicacionClick,
  usuario,
  onUsuarioClick,
  carrito = 0,
  onCarritoClick,
  logueado,
  b2b,
  empresa,
}: NavbarProps) {
  const links = b2b || logueado ? LINKS_B2B : LINKS;
  return (
    <header className={styles.navbar}>
      {/* Banner informative · I2617:106676;291:5011 */}
      <div className={b2b ? `${styles.banner} ${styles.bannerB2b}` : styles.banner}>
        <div className={`${styles.bannerText} text-body-1-medium`}>
          <span>ENVÍO GRATIS A TODO MÉXICO</span>
          <span>|</span>
          <span>COMPRAS MAYORES A $549MXN</span>
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
        </div>
      </div>

      {/* Navbar · I2617:106676;457:35791 */}
      <div className={styles.main}>
        <div className={styles.left}>
          <Icon name="menu" box={40} size={36} />
          <Link to="/" className={styles.brand} aria-label="Autex inicio">
            <img src={logo} alt="AUTEX" width={165.087} height={24.1553} />
          </Link>
          <div className={styles.action}>
            <span className={styles.actionDesc}>
              <Icon name="directions_car_filled" />
              <span className={styles.actionText} style={{ width: 166 }}>
                <span className={styles.line1}>Buscando para</span>
                <span className={styles.line2Primary}>Cadillac ATS Premium 2014...</span>
              </span>
            </span>
            <Icon name="expand_more" />
          </div>
        </div>

        <div className={styles.searchbar}>
          <div className={styles.categories}>
            <span className="text-body-1-book">Todas las Especialidades</span>
            <Icon name="arrow_drop_down" box={16} size={16} />
          </div>
          <div className={styles.search}>
            <span className={`${styles.searchPlaceholder} text-body-2-book`}>Buscar marca, modelo, tipo de producto...</span>
            <Icon name="search" />
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.actions}>
            <button type="button" className={`${styles.action} ${styles.location}`} onClick={onUbicacionClick}>
              <Icon name="location_on" />
              <span className={styles.actionText}>
                <span className={styles.line1}>{ubicacion}</span>
                <span className={styles.line2Green}>{ubicacionDetalle}</span>
              </span>
            </button>
            {b2b || logueado ? (
              <button type="button" className={styles.action} onClick={onUsuarioClick}>
                <Icon name="person" color="var(--color-primary-500)" />
                <span className={styles.actionText}>
                  <span className={styles.line1} style={{ color: 'var(--color-primary-500)' }}>
                    {usuario}
                  </span>
                  <span className={styles.line2Gray}>{empresa}</span>
                </span>
              </button>
            ) : (
              <button type="button" className={styles.user} onClick={onUsuarioClick}>
                <Icon name="person" />
                <span className={styles.line1}>{usuario ?? 'Ingresar'}</span>
              </button>
            )}
          </div>
          <div className={styles.actionsRight}>
            <span className={b2b ? `${styles.bell} ${styles.bellB2b}` : styles.bell}>
              <Icon name="notifications" />
              {b2b && <img src={punto} alt="" className={styles.punto} width={12} height={12} />}
            </span>
            <button type="button" className={styles.cart} style={b2b ? { width: 108 } : undefined} onClick={onCarritoClick}>
              <Icon name="shopping_cart" />
              <span className={`${styles.badge} text-caption-book`}>{carrito > 99 ? '99+' : carrito}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Link navigation · I2617:106676;546:10181 */}
      <nav className={styles.links}>
        <div className={styles.linksRow} style={b2b || logueado ? { width: '100%' } : undefined}>
          {links.map((l) => (
            <Link key={l.label} to={l.to} className={`${styles.link} text-body-1-book`}>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
