/**
 * Figma (Autex_2026_Frames) — página de carrito "Autex_Carrito- 1" (673:18974):
 *  - EstadoExistencia: Motion 590:2371 (Disponible) / 673:20446 (Disponible bajo pedido)
 *  - ChipBajoPedido: Chip 673:20474 (grande) y 677:18415 (resumen)
 *  - CardProductoCarrito: Card producto carrito 673:18933 / 673:20391
 *  - SubtotalCarrito: 673:20358 · ResumenCarrito: Resumen 898:15870 (instancia 742:20364)
 *  - ProductosGuardados: Content_Saved items 668:18472
 * Última sincronización: 2026-10-05
 */
import { Fragment, type ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import removeIcon from '../../../assets/icons/remove.svg';
import addIcon from '../../../assets/icons/add.svg';
import disponibleIcon from '../../../assets/icons/estado-disponible.svg';
import bajoPedidoIcon from '../../../assets/icons/estado-bajo-pedido.svg';
import relojIcon from '../../../assets/icons/reloj-arena.svg';
import chipIcon from '../../../assets/icons/chip-reloj-arena.svg';
import chipIconSm from '../../../assets/icons/chip-reloj-arena-sm.svg';
import type { EstadoExistencia as Estado, LineaCarrito } from '../../../mocks/productos';
import styles from './CarritoCompra.module.css';

/** Precio con "$" y centavos en Inter 16 y el entero en 32 (Pricing 145:3514). */
export function Precio({ valor, medio = false }: { valor: number; medio?: boolean }) {
  const [entero, centavos] = valor.toFixed(2).split('.');
  return (
    <span className={styles.precio}>
      <span className="text-inter-body-1">$</span>
      <span className={medio ? 'text-precio-32-medium' : 'text-precio-32'}>{Number(entero).toLocaleString('en-US')}</span>
      <span className="text-inter-body-1">{centavos}</span>
    </span>
  );
}

export function EstadoExistencia({ estado }: { estado: Estado }) {
  if (estado === 'bajo-pedido') {
    return (
      <div className={styles.motionBajo}>
        <img src={bajoPedidoIcon} alt="" width={24} height={24} />
        <div className={styles.motionTexto}>
          <span className="text-body-1-book">Disponible bajo pedido</span>
          <span className={styles.motionDetalle}>Entrega estimada de 2 a 4 días hábiles</span>
        </div>
      </div>
    );
  }
  if (estado === 'sin-existencia') {
    /* Sin respaldo en Figma (2026): se compone con el mismo Motion y el ícono "cancel" (caja gris, spec 001). */
    return (
      <div className={`${styles.motion} ${styles.motionSin}`}>
        <Icon name="cancel" color="var(--color-secondary-500)" />
        <span className="text-body-1-book">Sin existencia en tu zona</span>
      </div>
    );
  }
  return (
    <div className={styles.motion}>
      <img src={disponibleIcon} alt="" width={24} height={24} />
      <span className="text-body-1-book">Disponible</span>
    </div>
  );
}

export function ChipBajoPedido({ chico = false }: { chico?: boolean }) {
  return (
    <span className={chico ? `${styles.chip} ${styles.chipChico}` : styles.chip}>
      <span className={styles.chipIcono}>
        <img src={chico ? chipIconSm : chipIcon} alt="" width={chico ? 4 : 9} height={chico ? 7 : 15} />
      </span>
      <span className={styles.chipTexto}>Bajo pedido</span>
    </span>
  );
}

type CardProps = {
  linea: LineaCarrito;
  estado: Estado;
  onCantidad: (n: number) => void;
  onEliminar: () => void;
  onGuardar?: () => void;
  /** Sitio (D39): piezas disponibles para compra en línea; "+" se desactiva al llegar al tope. */
  maximo?: number;
  /** Sitio (D43): selector "Enviar a domicilio" / "Recoger en tienda" bajo las acciones. */
  entrega?: ReactNode;
};

export function CardProductoCarrito({ linea, estado, onCantidad, onEliminar, onGuardar, maximo, entrega }: CardProps) {
  const { producto, cantidad } = linea;
  const tope = maximo !== undefined && cantidad >= maximo;
  const bajo = estado === 'bajo-pedido';
  return (
    <div className={bajo ? `${styles.card} ${styles.cardBajo}` : styles.card}>
      <div className={styles.cardContenido}>
        <div className={styles.cardImagen}>
          <img src={producto.imagen[producto.imagen.length - 1].src} alt="" width={198} height={163} />
          {bajo && <ChipBajoPedido />}
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardDesc}>
            <div className={styles.cardMain}>
              <p className={`${styles.nombre} text-body-1-book`}>{producto.nombre}</p>
              <div className={`${styles.sku} text-os-body-2`}>
                <span>{producto.skuCarrito ?? `SKU #${producto.sku}`}</span>
                <span>{producto.noOriginal ?? `No. Original ${producto.sku}`}</span>
              </div>
            </div>
            <EstadoExistencia estado={estado} />
          </div>
          <div className={styles.cardAcciones}>
            <div className={styles.qty}>
              <button type="button" className={styles.qtyBtn} onClick={() => onCantidad(cantidad - 1)} aria-label="Quitar uno">
                <img src={removeIcon} alt="" width={16} height={16} />
              </button>
              <span className={styles.qtyValor}>{cantidad}</span>
              <button type="button" className={`${styles.qtyBtn} ${styles.qtyDer}`} onClick={() => onCantidad(cantidad + 1)} aria-label="Agregar uno" disabled={tope}>
                <img src={addIcon} alt="" width={16} height={16} />
              </button>
            </div>
            {tope && (
              <p className={`${styles.avisoTope} text-body-2-book`}>
                {maximo === 1 ? 'Solo hay 1 pieza disponible' : `Solo hay ${maximo} piezas disponibles`} {linea.entrega === 'tienda' ? 'en tu tienda' : 'para compra en línea'}.
              </p>
            )}
            <div className={styles.links}>
              <button type="button" className={`${styles.link} text-body-1-book`} onClick={onEliminar}>
                Eliminar
              </button>
              <span className={styles.divisor} />
              <button type="button" className={`${styles.link} text-body-1-book`} onClick={onGuardar}>
                Guardar para más tarde
              </button>
            </div>
          </div>
          {entrega}
        </div>
      </div>
      <Precio valor={producto.precio * cantidad} />
    </div>
  );
}

/** Encabezado de grupo: "Productos disponibles (1)" (742:20360) / "Productos bajo pedido (1)" (742:20356). */
export function GrupoCarrito({ estado, cantidad }: { estado: 'disponible' | 'bajo-pedido'; cantidad: number }) {
  const bajo = estado === 'bajo-pedido';
  return (
    <div className={bajo ? `${styles.grupo} ${styles.grupoBajo}` : styles.grupo}>
      <img src={bajo ? relojIcon : disponibleIcon} alt="" width={bajo ? 19 : 24} height={bajo ? 32 : 24} />
      <p className="text-os-titulo-28">
        {bajo ? 'Productos bajo pedido' : 'Productos disponibles'} ({cantidad})
      </p>
    </div>
  );
}

type SubtotalProps = { piezas: number; total: number; onSeguir: () => void; onPagar: () => void; pagarDeshabilitado?: boolean };

export function SubtotalCarrito({ piezas, total, onSeguir, onPagar, pagarDeshabilitado }: SubtotalProps) {
  return (
    <div className={styles.subtotal}>
      <div className={styles.subtotalFila}>
        <div className={styles.subtotalTexto}>
          <span className={styles.subtotalEtiqueta}>SUBTOTAL</span>
          <span className={`${styles.subtotalPiezas} text-os-body-1`}>{piezas} PRODUCTOS</span>
        </div>
        <Precio valor={total} medio />
      </div>
      <div className={styles.subtotalAcciones}>
        <Button variant="outline" onClick={onSeguir}>
          Continuar comprando
        </Button>
        <Button onClick={onPagar} disabled={pagarDeshabilitado}>
          Proceder al pago
        </Button>
      </div>
    </div>
  );
}

type ResumenCarritoProps = { titulo: string; total: string; onPagar: () => void; deshabilitado?: boolean };

/** Resumen 898:15870 — en Figma muestra "Subtotal (3 productos)" y "$0.00" (D25). */
export function ResumenCarrito({ titulo, total, onPagar, deshabilitado }: ResumenCarritoProps) {
  return (
    <aside className={styles.resumen}>
      <div className={styles.resumenHead}>
        <p className="text-body-1-medium">{titulo}</p>
      </div>
      <div className={styles.resumenItem}>
        <p className="text-total-30">{total}</p>
      </div>
      <div className={styles.resumenItem}>
        <Button onClick={onPagar} disabled={deshabilitado} style={{ width: '100%', justifyContent: 'center' }}>
          Proceder al pago
        </Button>
      </div>
    </aside>
  );
}

type GuardadosProps = {
  guardados: LineaCarrito[];
  onMover?: (id: string) => void;
  /** Figma muestra "1 artículos" aunque la lista está vacía (D25). */
  contador?: number;
};

export function ProductosGuardados({ guardados, onMover, contador = guardados.length }: GuardadosProps) {
  return (
    <section className={styles.guardados}>
      <div className={styles.guardadosTop}>
        <p className="text-os-titulo-32">Tus productos</p>
        <p className="text-os-body-2">Revisa tus artículos guardados para más tarde abajo, productos para comprar nuevamente</p>
      </div>
      <div className={styles.tabs}>
        <span className={`${styles.tab} ${styles.tabActiva} text-headline-book`}>Guardar para más tarde - {contador} artículos</span>
        <span className={`${styles.tab} text-headline-book`}>Comprar de nuevo</span>
      </div>
      <div className={styles.guardadosAcciones}>
        <div className={styles.buscar}>
          <span className={`${styles.buscarTexto} text-body-2-book`}>Buscar...</span>
          <Icon name="search" />
        </div>
        <div className={styles.orden}>
          <div className={styles.select}>
            <span className="text-body-1-book">Recientes</span>
            <Icon name="arrow_drop_down" box={16} size={16} />
          </div>
          <div className={styles.vistas}>
            <span className={`${styles.vista} ${styles.vistaActiva}`}>
              <Icon name="grid_view" />
            </span>
            <span className={styles.vista}>
              <Icon name="view_list" color="var(--color-neutral-600)" />
            </span>
          </div>
        </div>
      </div>
      <div className={styles.guardadosLista}>
        {guardados.length === 0 ? (
          <p className={`${styles.vacio} text-heading-1-book`}>No has guardado productos</p>
        ) : (
          /* Sin respaldo en Figma: lista simple de guardados con acción para regresarlos al carrito. */
          guardados.map((l) => (
            <Fragment key={l.producto.id}>
              <div className={styles.guardado}>
                <img src={l.producto.imagen[l.producto.imagen.length - 1].src} alt="" width={99} height={81} />
                <span className="text-body-1-book">{l.producto.nombre}</span>
                <Button variant="outline" onClick={() => onMover?.(l.producto.id)}>
                  Mover al carrito
                </Button>
              </div>
            </Fragment>
          ))
        )}
      </div>
    </section>
  );
}
