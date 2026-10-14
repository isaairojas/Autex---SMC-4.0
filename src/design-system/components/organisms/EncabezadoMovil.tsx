/**
 * SIN RESPALDO EN FIGMA (D58): encabezado de autex.com.mx en celular (≤768 px), copiado del sitio real
 * (docs/autex-real/movil: capturas 01, 03, 05 y registrado/01–03; medidas en medidas/medidas.json).
 * Franja azul con la promoción y los teléfonos; fila con menú, logo, "Mis vehículos", "Ingresar" (o la cuenta y la
 * campana con sesión) y carrito; buscador con "Especialidades".
 * Los textos que la demo ya cambió (franja, teléfonos) salen de la misma fuente que en escritorio.
 * Última revisión contra el sitio: 2026-10-09
 */
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ESPECIALIDADES } from '../../../mocks/sitio';
import telefonoIcono from '../../../assets/movil/telefono.svg';
import whatsappIcono from '../../../assets/movil/whatsapp-franja.svg';
import menuIcono from '../../../assets/movil/menu.svg';
import carroIcono from '../../../assets/movil/carro.svg';
import personaIcono from '../../../assets/movil/persona.svg';
import personaSesion from '../../../assets/movil/persona-sesion.svg';
import campanaIcono from '../../../assets/movil/campana.svg';
import carritoIcono from '../../../assets/movil/carrito.svg';
import flechaIcono from '../../../assets/movil/flecha-especialidades.svg';
import lupaIcono from '../../../assets/movil/lupa.svg';
import { Icon } from '../atoms/Icon';
import styles from './EncabezadoMovil.module.css';

export type OpcionCuenta = 'perfil' | 'pedidos' | 'salir';

type EncabezadoMovilProps = {
  /** Promoción de la franja (configuracion-banner.json, D57); null la deja solo con los teléfonos. */
  banner: { titulo: string; detalle: string; nota?: string } | null;
  telefono: string;
  whatsapp: string;
  /** Nombre del cliente con sesión; null es invitado ("Ingresar"). */
  usuario: string | null;
  carrito: number;
  onMenu: () => void;
  onVehiculos: () => void;
  onIngresar: () => void;
  onCuenta: () => void;
  cuentaAbierta: boolean;
  onOpcionCuenta: (o: OpcionCuenta) => void;
  onCarrito: () => void;
  /** D59: "Mi tienda" y "Entrega en" bajo el buscador (el sitio en celular no los tiene; ver H01). */
  ubicacion?: { tienda: string; detalle: string; entrega: string; onTienda: () => void; onEntrega: () => void };
  /** D52/D59: en el pago solo quedan el logo y "Volver al carrito". */
  onVolverCarrito?: () => void;
};

export function EncabezadoMovil({
  banner,
  telefono,
  whatsapp,
  usuario,
  carrito,
  onMenu,
  onVehiculos,
  onIngresar,
  onCuenta,
  cuentaAbierta,
  onOpcionCuenta,
  onCarrito,
  ubicacion,
  onVolverCarrito,
}: EncabezadoMovilProps) {
  const navigate = useNavigate();
  const [texto, setTexto] = useState('');
  const [especialidad, setEspecialidad] = useState<string | null>(null);
  const [listaEsp, setListaEsp] = useState(false);
  const buscar = (e: FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (texto.trim()) q.set('q', texto.trim());
    if (especialidad) q.set('especialidad', especialidad);
    navigate(`/busqueda${q.toString() ? `?${q}` : ''}`);
  };
  const carritoBoton = (
    <button type="button" className={styles.carrito} onClick={onCarrito} aria-label={`Carrito, ${carrito} piezas`}>
      <img src={carritoIcono} alt="" width={17} height={18} />
      {carrito > 0 && <span className={`${styles.burbuja} text-movil-8-8`}>{carrito > 99 ? '99+' : carrito}</span>}
    </button>
  );
  if (onVolverCarrito)
    return (
      <header className={`${styles.encabezado} ${styles.pasarela}`}>
        <button type="button" className={styles.logo} onClick={() => navigate('/')} aria-label="Autex inicio" />
        <button type="button" className={`${styles.volver} text-movil-14-22`} onClick={onVolverCarrito}>
          <Icon name="arrow_back" box={20} size={18} />
          Volver al carrito
        </button>
      </header>
    );
  return (
    <header className={styles.encabezado}>
      <div className={styles.franja}>
        {banner && (
          <>
            <span className={styles.linea}>
              <strong className="text-movil-16-24-medium">{banner.titulo}</strong>
            </span>
            <span className={styles.linea}>
              {banner.detalle && <strong className="text-movil-16-24-medium">{banner.detalle}</strong>}
              {banner.nota && <span className={`${styles.nota} text-caption-book`}> {banner.nota}</span>}
            </span>
          </>
        )}
        <div className={styles.telefonos}>
          <a className={styles.telefono} href={`tel:${telefono.replace(/\s/g, '')}`}>
            <img src={telefonoIcono} alt="" width={16} height={16} />
            <strong className="text-movil-16-24-medium">{telefono}</strong>
          </a>
          <a className={styles.telefono} href={`https://wa.me/${whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noreferrer">
            <img src={whatsappIcono} alt="" width={24} height={24} />
            <strong className="text-movil-16-24-medium">{whatsapp}</strong>
          </a>
        </div>
      </div>

      <div className={styles.fila}>
        <button type="button" className={styles.icono} onClick={onMenu} aria-label="Menú">
          <img src={menuIcono} alt="" width={28} height={18} />
        </button>
        <button type="button" className={styles.logo} onClick={() => navigate('/')} aria-label="Autex inicio" />
        <button type="button" className={styles.vehiculos} onClick={onVehiculos} aria-label="Mis vehículos">
          <img src={carroIcono} alt="" width={16} height={14} />
          <span className="text-movil-14-22">Mis vehículos</span>
        </button>
        {usuario ? (
          <>
            <span className={styles.ancla}>
              <button type="button" className={styles.icono} onClick={onCuenta} aria-label="Mi cuenta" aria-expanded={cuentaAbierta}>
                <img src={personaSesion} alt="" width={24} height={24} />
              </button>
              {cuentaAbierta && (
                <ul className={styles.cuenta} aria-label="Opciones de la cuenta">
                  {(
                    [
                      ['perfil', 'Mi perfil'],
                      ['pedidos', 'Mis pedidos'],
                      ['salir', 'Salir'],
                    ] as const
                  ).map(([o, t]) => (
                    <li key={o}>
                      <button type="button" className="text-movil-14-22" onClick={() => onOpcionCuenta(o)}>
                        {t}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </span>
            <span className={styles.grupo}>
              {/* La campana del sitio abre sus notificaciones; la demo no las tiene (D58). */}
              <span className={styles.campana} aria-label="Notificaciones">
                <img src={campanaIcono} alt="" width={15} height={17} />
              </span>
              {carritoBoton}
            </span>
          </>
        ) : (
          <>
            <button type="button" className={styles.ingresar} onClick={onIngresar}>
              <img src={personaIcono} alt="" width={14} height={14} />
              <span className="text-movil-14-22">Ingresar</span>
            </button>
            {carritoBoton}
          </>
        )}
      </div>

      <form className={styles.buscador} onSubmit={buscar} role="search">
        <button type="button" className={`${styles.especialidades} text-movil-14-16`} onClick={() => setListaEsp(!listaEsp)} aria-expanded={listaEsp}>
          <span>{especialidad ?? 'Especialidades'}</span>
          <img src={flechaIcono} alt="" width={8} height={4} />
        </button>
        {/* El sitio abre la lista de especialidades; su forma en celular no quedó en las capturas (D58). */}
        {listaEsp && (
          <ul className={styles.listaEsp}>
            {[null, ...ESPECIALIDADES].map((e) => (
              <li key={e ?? 'todas'}>
                <button
                  type="button"
                  className="text-movil-14-22"
                  onClick={() => {
                    setEspecialidad(e);
                    setListaEsp(false);
                  }}
                >
                  {e ?? 'Todas las especialidades'}
                </button>
              </li>
            ))}
          </ul>
        )}
        <span className={styles.campo}>
          <input
            className="text-movil-14-22"
            placeholder="Buscar año, marca, modelo, tipo de producto..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            aria-label="Buscar productos"
          />
          <button type="submit" className={styles.lupa} aria-label="Buscar">
            <img src={lupaIcono} alt="" width={16} height={16} />
          </button>
        </span>
      </form>
      {ubicacion && (
        <div className={styles.ubicacion}>
          <button type="button" className={styles.chip} data-ancla="tienda" onClick={ubicacion.onTienda}>
            <Icon name="store" box={20} size={18} color="var(--color-primary-500)" />
            <span className={styles.chipTexto}>
              <span className="text-movil-12-16">Mi tienda</span>
              <strong className="text-movil-14-22">{ubicacion.tienda}</strong>
            </span>
          </button>
          <button type="button" className={styles.chip} data-ancla="entrega" onClick={ubicacion.onEntrega}>
            <Icon name="local_shipping" box={20} size={18} color="var(--color-primary-500)" />
            <span className={styles.chipTexto}>
              <span className="text-movil-12-16">Entrega en</span>
              <strong className="text-movil-14-22">{ubicacion.entrega}</strong>
            </span>
          </button>
        </div>
      )}
    </header>
  );
}
