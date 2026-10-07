/**
 * SIN RESPALDO EN FIGMA (2026-10-06). Ubicación de entrega y "Mi tienda", con la identidad de Autex, a partir de
 * los ejemplos que dio el usuario: aviso del navegador "Conocer tu ubicación" (simulado), aviso "Elige una tienda",
 * panel "Ubicación de entrega" (vista de invitado con C.P. y vista de cliente registrado con sus direcciones
 * guardadas, D33) y panel "Selecciona una tienda".
 * Compuesto con Button, Icon y Modal; los niveles de servicio salen de configuracion-servicios-smc.json.
 */
import { useState, type FormEvent } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { OpcionSeleccionable } from '../molecules/OpcionSeleccionable';
import { Modal } from './Modal';
import { ALCANCE_MAXIMO_KM, ESTADOS_CON_TIENDA, estadoHorario, formatoKm, resolverCP, textoEntrega, type TiendaCercana, type UbicacionEntrega } from '../../../mocks/tiendas';
import { lineaDireccion, type DireccionEntrega, type Ubicacion } from '../../../mocks/clientes';
import styles from './UbicacionTienda.module.css';

const mapa = (t: TiendaCercana) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.cp ? `Autex ${t.direccion}` : `${t.lat},${t.lon}`)}`;

/* ---------- Aviso del navegador (simulado) ---------- */

type PermisoProps = { onResponder: (r: 'mientras' | 'una-vez' | 'nunca' | 'cerrar') => void };

/**
 * Réplica del aviso de Chrome "www.autex.com.mx quiere · Conocer tu ubicación" (355×253, ejemplo del usuario).
 * Se dibuja en la esquina superior izquierda de la ventana, donde Chrome lo muestra bajo la barra de direcciones.
 */
export function PermisoNavegador({ onResponder }: PermisoProps) {
  return (
    <div className={styles.navegador} role="dialog" aria-label="www.autex.com.mx quiere">
      <div className={styles.navegadorCabecera}>
        <p>www.autex.com.mx quiere</p>
        <button type="button" className={styles.navegadorCerrar} onClick={() => onResponder('cerrar')} aria-label="Cerrar aviso de ubicación">
          <Icon name="close" box={20} size={18} color="var(--color-navegador-texto)" />
        </button>
      </div>
      <p className={styles.navegadorPermiso}>
        <Icon name="location_on" box={20} size={18} color="var(--color-navegador-texto)" />
        Conocer tu ubicación
      </p>
      <div className={styles.navegadorBotones}>
        <button type="button" onClick={() => onResponder('mientras')}>
          Permitir mientras se visita el sitio
        </button>
        <button type="button" onClick={() => onResponder('una-vez')}>
          Permitir esta vez
        </button>
        <button type="button" onClick={() => onResponder('nunca')}>
          No permitir nunca
        </button>
      </div>
    </div>
  );
}

/** Posición del panel bajo su chip del navbar (la calcula PageShell). */
export type Posicion = { left: number; top: number };

/* ---------- Panel "Ubicación de entrega" ---------- */

type EntregaProps = {
  posicion?: Posicion;
  actual: Ubicacion | null;
  invitado: boolean;
  /** Cliente registrado: direcciones guardadas y la elegida (vista "Mis direcciones"). */
  direcciones?: DireccionEntrega[];
  direccionId?: string | null;
  predeterminadaId?: string | null;
  onElegirDireccion?: (id: string) => void;
  /** Formulario "Nueva dirección" y "Dirección de envío" de Configuración (como autex.com.mx). */
  onNuevaDireccion?: () => void;
  onAdministrar?: () => void;
  onActualizar: (u: UbicacionEntrega) => void;
  onUsarMiUbicacion: () => Promise<boolean>;
  onIniciarSesion: () => void;
  onClose: () => void;
};

/** "Usar mi ubicación actual" + código postal: lo comparten las dos vistas del panel. */
function OtroCodigoPostal({ onActualizar, onUsarMiUbicacion }: Pick<EntregaProps, 'onActualizar' | 'onUsarMiUbicacion'>) {
  const [cp, setCp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const actualizar = (e?: FormEvent) => {
    e?.preventDefault();
    const u = resolverCP(cp);
    if (!u) return setError('Ingresa un código postal mexicano válido de 5 dígitos.');
    onActualizar(u);
  };
  const miUbicacion = async () => {
    setError(null);
    if (!(await onUsarMiUbicacion())) setError('No tenemos permiso para conocer tu ubicación. Ingresa tu código postal.');
  };
  return (
    <>
      <button type="button" className={`${styles.enlace} text-body-1-book`} onClick={miUbicacion}>
        <Icon name="my_location" box={20} size={18} color="var(--color-primary-500)" />
        Usar mi ubicación actual
      </button>
      <form className={styles.campo} onSubmit={actualizar}>
        <input
          className="text-body-1-book"
          placeholder="Ingresa un código postal mexicano"
          inputMode="numeric"
          value={cp}
          onChange={(e) => {
            setError(null);
            setCp(e.target.value.replace(/\D/g, '').slice(0, 5));
          }}
          aria-label="Código postal"
        />
        <button type="submit" className={styles.lupa} aria-label="Buscar código postal">
          <Icon name="search" color="var(--color-primary-500)" />
        </button>
      </form>
      {error && <p className={`${styles.rojo} text-body-2-book`}>{error}</p>}
      <Button variant="outline" className={styles.anchoCompleto} disabled={cp.length !== 5} onClick={() => actualizar()}>
        Actualizar ubicación
      </Button>
    </>
  );
}

export function PanelEntrega({ posicion, actual, invitado, direcciones, direccionId, predeterminadaId, onElegirDireccion, onNuevaDireccion, onAdministrar, onActualizar, onUsarMiUbicacion, onIniciarSesion, onClose }: EntregaProps) {
  const registrado = !invitado && !!direcciones;
  return (
    <div className={`${styles.panel} ${registrado ? styles.panelDirecciones : styles.panelEntrega}`} style={posicion} role="dialog" aria-label="Ubicación de entrega">
      <div className={styles.panelCabecera}>
        <p className="text-subheadline-medium">Ubicación de entrega</p>
        <button type="button" className={styles.cerrar} onClick={onClose} aria-label="Cerrar">
          <Icon name="close" />
        </button>
      </div>
      {registrado ? (
        /* Cliente registrado: elige una de sus direcciones guardadas. */
        <div className={`${styles.panelCuerpo} ${styles.cuerpoDesplazable}`}>
          <p className={`${styles.gris} text-body-2-book`}>
            Elige dónde quieres recibir tus productos; con esa dirección te mostramos las tiendas, existencias y tiempos de entrega de tu zona.
          </p>
          <div className={styles.tiendaCabecera}>
            <p className="text-body-1-medium">Mis direcciones</p>
            <button type="button" className={`${styles.enlaceTexto} text-body-2-book`} onClick={onAdministrar}>
              Administrar direcciones
            </button>
          </div>
          {direcciones.length === 0 && (
            <p className={`${styles.gris} text-body-2-book`}>Por el momento no hay direcciones registradas. Añade una para enviarte tus pedidos.</p>
          )}
          <div className={styles.direcciones}>
            {direcciones.map((d) => (
              <OpcionSeleccionable
                key={d.id}
                bordeGrueso
                selected={d.id === direccionId}
                onSelect={() => onElegirDireccion?.(d.id)}
                titulo={d.nombre}
                extra={d.id === predeterminadaId ? 'Predeterminada' : undefined}
                extraTono="secondary"
                descripcion={lineaDireccion(d)}
              />
            ))}
          </div>
          <button type="button" className={`${styles.enlace} text-body-1-book`} onClick={onNuevaDireccion}>
            <Icon name="add_circle_outline" box={20} size={18} color="var(--color-primary-500)" />
            Agregar nueva dirección
          </button>
          <p className={`${styles.separadorTexto} ${styles.gris} text-body-2-book`}>¿Vas a recibir en otro lugar?</p>
          <OtroCodigoPostal onActualizar={onActualizar} onUsarMiUbicacion={onUsarMiUbicacion} />
        </div>
      ) : (
        /* Cliente no registrado: código postal y aviso para iniciar sesión. */
        <div className={styles.panelCuerpo}>
          <p className={`${styles.gris} text-body-2-book`}>
            Ingresa tu código postal para ver las tiendas Autex de tu zona, sus existencias y los tiempos de entrega.
          </p>
          {actual && (
            <div className={styles.tarjetaCp}>
              <p className="text-body-2-book">
                <span className={`${styles.etiqueta} text-caption-book`}>Entrega en</span> Código postal <strong>{actual.codigoPostal}</strong>
              </p>
              <p className={`${styles.gris} text-body-2-book`}>
                {actual.ciudad}, {actual.estado}
                {'aproximada' in actual && actual.aproximada ? ' (zona aproximada)' : ''}
              </p>
            </div>
          )}
          <OtroCodigoPostal onActualizar={onActualizar} onUsarMiUbicacion={onUsarMiUbicacion} />
          {invitado && (
            <div className={styles.sesion}>
              <p className="text-body-2-book">Inicia sesión para usar tus direcciones guardadas y completar tu compra más rápido.</p>
              <div className={styles.sesionBotones}>
                <Button onClick={onIniciarSesion}>Iniciar sesión</Button>
                <Button variant="outline" onClick={onIniciarSesion}>
                  Crear una cuenta
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Panel "Selecciona una tienda" ---------- */

type TiendaProps = {
  posicion?: Posicion;
  tiendas: TiendaCercana[];
  actual: TiendaCercana | null;
  /** Estado de la ubicación de entrega: solo se muestran sus tiendas (el cliente puede cambiar el filtro). */
  estado: string | null;
  codigoPostal: string | null;
  onSeleccionar: (id: string) => void;
  onCambiarEntrega: () => void;
  onClose: () => void;
};

const TODOS = 'Todos los estados';

export function PanelTienda({ posicion, tiendas, actual, estado, codigoPostal, onSeleccionar, onCambiarEntrega, onClose }: TiendaProps) {
  const [q, setQ] = useState('');
  /* Las tiendas del estado del C.P. de entrega; si ese estado no tiene tiendas, las 5 más cercanas. */
  const sinTiendas = !!estado && !ESTADOS_CON_TIENDA.includes(estado);
  const [filtro, setFiltro] = useState(estado && !sinTiendas ? estado : TODOS);
  const f = q.trim().toLowerCase();
  /* Con texto se busca en todo México. "Mi tienda" siempre va primero. */
  const lista = tiendas
    .filter((t) => (f ? [t.id, t.nombre, t.direccion, t.ciudad, t.estado, t.cp ?? ''].some((v) => v.toLowerCase().includes(f)) : filtro === TODOS || t.estado === filtro))
    .slice(0, !f && filtro === TODOS && sinTiendas ? 5 : undefined)
    .sort((a, b) => Number(b.id === actual?.id) - Number(a.id === actual?.id));
  return (
    <div className={`${styles.panel} ${styles.panelTienda}`} style={posicion} role="dialog" aria-label="Selecciona una tienda">
      <div className={styles.panelCabecera}>
        <p className="text-subheadline-medium">Selecciona una tienda</p>
        <button type="button" className={styles.cerrar} onClick={onClose} aria-label="Cerrar">
          <Icon name="close" />
        </button>
      </div>
      <div className={styles.panelCuerpo}>
        {codigoPostal && (
          <p className={`${styles.gris} text-body-2-book`}>
            {sinTiendas
              ? `Aún no hay tiendas en ${estado}; estas son las más cercanas a tu entrega en C.P. `
              : `${lista.length} ${lista.length === 1 ? 'tienda' : 'tiendas'} en ${filtro === TODOS ? 'México' : filtro} para tu entrega en C.P. `}
            <strong>{codigoPostal}</strong> ·{' '}
            <button type="button" className={`${styles.enlaceTexto} text-body-2-book`} onClick={onCambiarEntrega}>
              Cambiar
            </button>
          </p>
        )}
        <label className={styles.campo}>
          <input className="text-body-1-book" placeholder="Buscar por nombre, id o dirección" value={q} onChange={(e) => setQ(e.target.value)} />
          <Icon name="search" color="var(--color-primary-500)" />
        </label>
        <div className={styles.filaEstado}>
          <span className={`${styles.gris} text-body-2-book`}>O selecciona una tienda en:</span>
          <span className={styles.selector}>
            <select className="text-body-2-book" value={filtro} onChange={(e) => setFiltro(e.target.value)} aria-label="Estado">
              {[TODOS, ...ESTADOS_CON_TIENDA].map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
            <Icon name="arrow_drop_down" color="var(--color-secondary-500)" />
          </span>
        </div>
      </div>
      <div className={styles.listaTiendas}>
        {lista.length === 0 && <p className={`${styles.gris} text-body-2-book`}>No encontramos tiendas con esa búsqueda.</p>}
        {lista.map((t) => {
          const mia = t.id === actual?.id;
          const h = estadoHorario(t.horario);
          return (
            <div key={t.id} className={mia ? `${styles.tienda} ${styles.tiendaMia}` : styles.tienda}>
              {mia && <span className={`${styles.etiqueta} text-caption-book`}>Mi tienda</span>}
              <div className={styles.tiendaCabecera}>
                <p className="text-subheadline-book">{t.nombre}</p>
                <span className={`${styles.gris} text-body-2-book`}>{formatoKm(t.km)}</span>
              </div>
              {h.abierto !== null && (
                <p className="text-body-2-book">
                  <span className={h.abierto ? styles.verde : styles.rojo}>{h.abierto ? 'Abierto' : 'Cerrado'}</span>
                  <span className={styles.gris}> · {h.texto}</span>
                </p>
              )}
              <p className={`${styles.gris} text-body-2-book`}>{t.direccion}</p>
              <div className={styles.servicio}>
                {t.servicio ? (
                  <span className="text-body-2-book">
                    <strong>Envío {t.servicio.nivel}</strong> · {textoEntrega(t.servicio, new Date(), true)}
                  </span>
                ) : (
                  <span className={`${styles.gris} text-body-2-book`}>Sin envío a tu C.P. (más de {formatoKm(ALCANCE_MAXIMO_KM)}); disponible para recoger en tienda.</span>
                )}
              </div>
              <div className={styles.horario}>
                <p className="text-body-2-medium">Lunes a Sábado</p>
                <p className="text-body-2-book">{h.horario ?? 'Horario no disponible'}</p>
              </div>
              {t.telefono && (
                <a className={`${styles.fila} ${styles.azul} text-body-2-book`} href={`tel:${t.telefono}`}>
                  <Icon name="call" box={20} size={18} color="var(--color-primary-500)" />
                  {t.telefono.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2 $3')}
                </a>
              )}
              <a className={`${styles.fila} ${styles.azul} ${styles.subrayado} text-body-2-book`} href={mapa(t)} target="_blank" rel="noreferrer">
                <Icon name="directions" box={20} size={18} color="var(--color-primary-500)" />
                Mostrar en Google Maps
              </a>
              {!mia && (
                <Button variant="outline" className={styles.anchoCompleto} onClick={() => onSeleccionar(t.id)}>
                  Seleccionar tienda
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Aviso "Elige una tienda" ---------- */

type AvisoProps = {
  /** "No permitir nunca": la página ya no puede volver a pedir la ubicación. */
  bloqueado: boolean;
  onManual: () => void;
  onUsarMiUbicacion: () => Promise<boolean>;
  onClose: () => void;
};

export function AvisoTienda({ bloqueado, onManual, onUsarMiUbicacion, onClose }: AvisoProps) {
  const [error, setError] = useState(false);
  return (
    <Modal
      titulo="Elige una tienda"
      onClose={onClose}
      ancho={640}
      top={160}
      acciones={
        <>
          <Button variant="outline" onClick={onManual}>
            Elegir tienda manualmente
          </Button>
          <Button
            onClick={async () => {
              setError(false);
              if (!(await onUsarMiUbicacion())) setError(true);
            }}
          >
            Usar mi ubicación
          </Button>
        </>
      }
    >
      <div className={styles.aviso}>
        <p className="text-body-1-book">Concédenos permiso de usar tu ubicación para seleccionar tu tienda Autex más cercana automáticamente.</p>
        <ul className={`${styles.gris} text-body-1-book`}>
          <li>Mejora tu experiencia de compra</li>
          <li>Consulta existencias y tiempos de entrega de tu zona</li>
          <li>Visualiza productos y promociones exclusivas para tu área</li>
        </ul>
        <a className={`${styles.azul} text-body-2-book`} href="https://www.autex.com.mx/aviso-de-privacidad/" target="_blank" rel="noreferrer">
          Consulta nuestro Aviso de Privacidad
        </a>
        {error && (
          <p className={`${styles.rojo} text-body-2-book`}>
            {bloqueado
              ? 'Bloqueaste el acceso a tu ubicación para este sitio. Elige tu tienda manualmente con tu código postal.'
              : 'No nos diste acceso a tu ubicación. Elige tu tienda manualmente con tu código postal.'}
          </p>
        )}
      </div>
    </Modal>
  );
}
