/**
 * SIN RESPALDO EN FIGMA (D43). Entrega por artículo en el carrito, tomada del ejemplo de Home Depot que dio el
 * usuario y compuesta con los tokens de Autex:
 *  - SelectorEntrega: existencias para compra en línea y en "Mi tienda", "Enviar a domicilio" / "Recoger en tienda".
 *  - MetodoEntregaCarrito: "Enviar todo a domicilio" / "Recoger todo en tienda".
 *  - ZonaEntregaCarrito: "<ciudad> y sus alrededores" (si algo va a domicilio).
 *  - RecoleccionCarrito: la tienda donde se recoge (si algo se recoge); con un pedido mixto se ven las dos.
 */
import type { ReactNode } from 'react';
import { Icon } from '../atoms/Icon';
import type { ModoEntrega } from '../../../mocks/productos';
import styles from './EntregaCarrito.module.css';

function Opcion({ activo, icono, children, deshabilitado, onClick }: { activo: boolean; icono: string; children: ReactNode; deshabilitado?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`${styles.opcion} ${activo ? styles.opcionActiva : ''} text-body-1-book`}
      aria-pressed={activo}
      disabled={deshabilitado}
      onClick={() => !activo && onClick()}
    >
      <Icon name={icono} color={deshabilitado ? 'var(--color-neutral-400)' : 'var(--color-primary-500)'} />
      <span className={styles.opcionTexto}>{children}</span>
      {activo && (
        <span className={styles.palomita} aria-hidden>
          <Icon name="check" box={20} size={18} color="var(--color-nativo-blanco)" />
        </span>
      )}
    </button>
  );
}

/** D44/D45: leyenda de lo que se consigue en sucursales foráneas (existencia en otra región). */
export const LEYENDA_FORANEA = 'Existencia en otra región: se envía como pedido foráneo y podría tardar más de lo normal.';

type SelectorProps = {
  modo: ModoEntrega;
  /** Etiqueta de piezas para compra en línea ("+100", "8"…). */
  enLinea: string;
  enTienda: number;
  tienda: string;
  aviso?: string;
  /** D44: bajo pedido desde sucursal foránea (solo aplica al envío a domicilio). */
  foranea?: boolean;
  onCambiar: (modo: ModoEntrega) => void;
};

export function SelectorEntrega({ modo, enLinea, enTienda, tienda, aviso, foranea, onCambiar }: SelectorProps) {
  return (
    <div className={styles.selector}>
      {foranea && modo === 'domicilio' && (
        <p className={`${styles.foranea} text-body-2-book`}>
          <Icon name="schedule" box={20} size={18} color="var(--color-naranja-bajo-pedido)" />
          {LEYENDA_FORANEA}
        </p>
      )}
      <div className={styles.existencias}>
        <p className="text-body-2-book">
          <Icon name="devices" box={20} size={18} color="var(--color-neutral-700)" />
          <span>
            <strong className={enLinea === '0' ? styles.rojo : styles.verde}>{enLinea}</strong> disponibles para compra en línea{foranea && ' (en otra región)'}
          </span>
        </p>
        {/* D45: en un pedido foráneo solo se muestra la existencia en línea, sin las tiendas. */}
        {!foranea && (
        <p className="text-body-2-book">
          <Icon name="store" box={20} size={18} color="var(--color-neutral-700)" />
          <span>
            <strong className={enTienda ? styles.verde : styles.rojo}>{enTienda}</strong> disponibles en {tienda}
          </span>
        </p>
        )}
      </div>
      <div className={styles.opciones} role="group" aria-label="Entrega del artículo">
        <Opcion activo={modo === 'domicilio'} icono="local_shipping" onClick={() => onCambiar('domicilio')}>
          Enviar a domicilio
        </Opcion>
        <Opcion activo={modo === 'tienda'} icono="store" deshabilitado={!enTienda} onClick={() => onCambiar('tienda')}>
          {enTienda ? 'Recoger en tienda' : 'No disponible en tu tienda'}
        </Opcion>
      </div>
      {aviso && (
        <p className={`${styles.aviso} text-body-2-book`} role="status">
          <Icon name="info" box={20} size={18} color="var(--color-primary-500)" />
          {aviso}
        </p>
      )}
    </div>
  );
}

type MetodoProps = {
  /** null: el pedido tiene ambos métodos. */
  todos: ModoEntrega | null;
  tienda: string;
  puedeRecoger: boolean;
  onTodo: (modo: ModoEntrega) => void;
};

export function MetodoEntregaCarrito({ todos, tienda, puedeRecoger, onTodo }: MetodoProps) {
  return (
    <section className={styles.tarjeta} aria-label="Método de entrega">
      <p className={`${styles.titulo} text-body-1-medium`}>Método de entrega</p>
      <div className={styles.cuerpo}>
        <p className={`${styles.gris} text-body-2-book`}>
          {todos === null
            ? 'Tu pedido tiene ambos métodos de entrega. Si quieres uno solo para todo tu pedido, elige una opción:'
            : 'Elige cómo quieres recibir todo tu pedido:'}
        </p>
        <div className={styles.opciones}>
          <Opcion activo={todos === 'domicilio'} icono="local_shipping" onClick={() => onTodo('domicilio')}>
            Enviar <strong>todo</strong> a domicilio
          </Opcion>
          <Opcion activo={todos === 'tienda'} icono="store" deshabilitado={!puedeRecoger} onClick={() => onTodo('tienda')}>
            Recoger <strong>todo</strong> en tienda
          </Opcion>
        </div>
        <p className={`${styles.gris} text-caption-book`}>Recoger en tienda aplica solo en {tienda}, con sus existencias.</p>
      </div>
    </section>
  );
}

type ZonaProps = {
  zona: string;
  codigoPostal: string;
  onCambiar: () => void;
};

/** D43/D44: "Zona de entrega" — solo cuando algún artículo va a domicilio: "<ciudad> y sus alrededores" y el C.P. */
export function ZonaEntregaCarrito({ zona, codigoPostal, onCambiar }: ZonaProps) {
  return (
    <section className={styles.tarjeta} aria-label="Zona de entrega">
      <p className={`${styles.titulo} text-body-1-medium`}>Zona de entrega</p>
      <div className={styles.fila}>
        <Icon name="location_on" color="var(--color-secondary-500)" />
        <div className={styles.filaTexto}>
          <p className="text-body-1-book">
            <strong>{zona}</strong> y sus alrededores
          </p>
          <p className={`${styles.gris} text-body-2-book`}>Envío a domicilio · C.P. {codigoPostal}</p>
        </div>
        <button type="button" className={`${styles.cambiar} text-body-1-book`} onClick={onCambiar} aria-label="Cambiar zona de entrega">
          Cambiar
        </button>
      </div>
    </section>
  );
}

type RecoleccionProps = {
  tienda: { nombre: string; direccion: string; horario: string };
  onCambiar: () => void;
};

/** D44: "Recoger en tienda" — sección aparte, solo cuando algún artículo se recoge: la tienda de recolección. */
export function RecoleccionCarrito({ tienda, onCambiar }: RecoleccionProps) {
  return (
    <section className={styles.tarjeta} aria-label="Recoger en tienda">
      <p className={`${styles.titulo} text-body-1-medium`}>Recoger en tienda</p>
      <div className={styles.fila}>
        <Icon name="store" color="var(--color-neutral-800)" />
        <div className={styles.filaTexto}>
          <p className="text-body-1-medium">{tienda.nombre}</p>
          <p className={`${styles.gris} text-body-2-book`}>{tienda.direccion}</p>
          <p className={`${styles.gris} text-body-2-book`}>{tienda.horario}</p>
        </div>
        <button type="button" className={`${styles.cambiar} text-body-1-book`} onClick={onCambiar} aria-label="Cambiar tienda">
          Cambiar
        </button>
      </div>
    </section>
  );
}

/** Columna derecha del carrito del sitio: método de entrega, zona de entrega y resumen. */
export function ColumnaCarrito({ children }: { children: ReactNode }) {
  return <div className={styles.columna}>{children}</div>;
}
