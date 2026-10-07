/**
 * Figma: ItemKart Tipo=Full (3527:121767, archivo anterior) y mini-carrito
 * Autex_2026_Frames Carrito/Default (657:14102): tarjetas de 208, chip "Bajo pedido", lista de 585 con scroll.
 * Última sincronización: 2026-10-05
 */
import { Icon } from '../atoms/Icon';
import removeIcon from '../../../assets/icons/remove.svg';
import addIcon from '../../../assets/icons/add.svg';
import { formatoMXN, type EstadoExistencia, type LineaCarrito } from '../../../mocks/productos';
import { ChipBajoPedido } from './CarritoCompra';
import styles from './Carrito.module.css';

type ItemProps = {
  linea: LineaCarrito;
  sku: string;
  disponible: { ok: boolean; texto: string };
  onCantidad: (n: number) => void;
  onEliminar: () => void;
};

/** ItemKart Tipo=Full — 1340 de ancho. */
export function ItemKart({ linea, sku, disponible, onCantidad, onEliminar }: ItemProps) {
  const { producto, cantidad } = linea;
  const [entero, centavos] = (producto.precio * cantidad).toFixed(2).split('.');
  return (
    <div className={styles.item}>
      <div className={styles.product}>
        <div className={styles.img}>
          <img src={producto.imagen[producto.imagen.length - 1].src} alt="" />
        </div>
        <div className={styles.info}>
          <div className={styles.top}>
            <div className={styles.mainDesc}>
              <p className="text-os-subheadline">{producto.nombre}</p>
              <div className={`${styles.sku} text-os-body-2`}>
                <span>{sku}</span>
                <span>No. Original {producto.sku}</span>
              </div>
            </div>
            <div className={styles.disp}>
              <Icon name={disponible.ok ? 'check_circle' : 'cancel'} color={disponible.ok ? 'var(--color-green-700)' : 'var(--color-secondary-500)'} />
              <span className="text-os-body-1">{disponible.texto}</span>
            </div>
          </div>
          <div className={styles.actions}>
            <div className={styles.qty}>
              <button type="button" className={styles.qtyBtn} onClick={() => onCantidad(cantidad - 1)} aria-label="Quitar uno">
                <img src={removeIcon} alt="" width={16} height={16} />
              </button>
              <span className={styles.qtyValue}>{cantidad}</span>
              <button type="button" className={`${styles.qtyBtn} ${styles.right}`} onClick={() => onCantidad(cantidad + 1)} aria-label="Agregar uno">
                <img src={addIcon} alt="" width={16} height={16} />
              </button>
            </div>
            <div className={styles.links}>
              <button type="button" className={`${styles.link} text-body-1-book`} onClick={onEliminar}>
                Eliminar
              </button>
              <span className={styles.divider} />
              <button type="button" className={`${styles.link} text-body-1-book`}>
                Guardar para más tarde
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.price}>
        <span className={styles.small}>$</span>
        <span className={styles.big}>{Number(entero).toLocaleString('en-US')}</span>
        <span className={styles.small}>{centavos}</span>
      </div>
    </div>
  );
}

type MiniProps = {
  lineas: LineaCarrito[];
  skus: Record<string, string>;
  /** Estado SMC 4.0 por producto: muestra el chip "Bajo pedido" (677:18421). */
  estado?: (id: string) => EstadoExistencia;
  onClose: () => void;
  onEliminar: (id: string) => void;
  onVerTodos: () => void;
  incrustado?: boolean;
};

/** Carrito items-notificacion — 430 de ancho, se abre bajo el ícono del carrito. */
export function MiniCarrito({ lineas, skus, estado, onClose, onEliminar, onVerTodos, incrustado = false }: MiniProps) {
  const subtotal = lineas.reduce((s, l) => s + l.producto.precio * l.cantidad, 0);
  return (
    <div className={incrustado ? `${styles.mini} ${styles.miniIncrustado}` : styles.mini} role="dialog" aria-label="Mi carrito">
      <div className={styles.miniHead}>
        <p className="text-body-2-medium">Mi carrito</p>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
          <Icon name="close" />
        </button>
      </div>
      <div className={styles.miniList}>
        {lineas.map((l) => (
          <div key={l.producto.id} className={styles.miniItem}>
            <div className={styles.miniImg}>
              {estado?.(l.producto.id) === 'bajo-pedido' && (
                <span className={styles.miniChip}>
                  <ChipBajoPedido chico />
                </span>
              )}
              <img src={l.producto.imagen[l.producto.imagen.length - 1].src} alt="" />
            </div>
            <div className={styles.miniInfo}>
              <p className={`${styles.miniSku} text-caption-book`}>{l.producto.skuCarrito ?? skus[l.producto.id] ?? ''}</p>
              <p className="text-body-1-book">{l.producto.nombre}</p>
              <p className="text-body-2-book">Piezas: {l.cantidad}</p>
              <div className={styles.miniPrice}>
                <span className={`${styles.miniMonto} text-body-1-medium`}>{formatoMXN(l.producto.precio * l.cantidad)}</span>
                <button type="button" className={styles.trash} onClick={() => onEliminar(l.producto.id)} aria-label="Eliminar">
                  <Icon name="delete" box={16} size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.miniSubtotal}>
        <span className="text-body-1-book">Subtotal</span>
        <span className="text-body-1-medium">{formatoMXN(subtotal)}</span>
      </div>
      <div className={styles.miniAction}>
        <button type="button" className={`${styles.verTodos} text-body-1-book`} onClick={onVerTodos}>
          Ver todos los productos
        </button>
      </div>
    </div>
  );
}
