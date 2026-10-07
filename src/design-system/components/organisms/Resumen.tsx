/**
 * Figma (Autex_2026_Frames): columna derecha del checkout (Frame 4534609, 677:19623) — 428 de ancho, gap 30
 *  - Resumen 742:20253 ("Detalle de pedido"; en el paso 4 agrega "Confirmar el pedido", 742:20323)
 *  - Resumen compra/productos 677:18368 (miniatura 50×41, chip "Bajo pedido" chico)
 * Última sincronización: 2026-10-05
 */
import { formatoMXN, type EstadoExistencia, type LineaCarrito } from '../../../mocks/productos';
import { Button } from '../atoms/Button';
import { ChipBajoPedido } from './CarritoCompra';
import styles from './Resumen.module.css';

export type Totales = {
  subtotal: string;
  envio: string;
  /** "Descuentos aplicados". */
  cupon: string;
  total: string;
};

export const TOTALES_FIGMA: Totales = { subtotal: '$1,500.00', envio: '$0.00', cupon: '$0.00', total: '$1,500.00' };

type ResumenProps = {
  totales?: Totales;
  lineas: LineaCarrito[];
  /** Estado de existencia de cada producto (chip "Bajo pedido"). */
  estado?: (id: string) => EstadoExistencia;
  /** Cantidad mostrada; Figma muestra "x10" en el segundo producto (D25). */
  cantidadVisible?: (linea: LineaCarrito) => number;
  /** Botón "Confirmar el pedido", solo en el paso 4. */
  onConfirmar?: () => void;
  /** Sitio, paso 2 (sin respaldo en Figma, D35): sin la fila "Envío". */
  sinEnvio?: boolean;
};

export function Resumen({ totales = TOTALES_FIGMA, lineas, estado, cantidadVisible, onConfirmar, sinEnvio = false }: ResumenProps) {
  return (
    <aside className={styles.columna}>
      <div className={styles.detalle}>
        <p className={`${styles.titulo} text-subheadline-medium`}>Detalle de pedido</p>
        <div className={styles.filas}>
          <div className={`${styles.fila} ${styles.pad}`}>
            <span className="text-os-body-1">Subtotal</span>
            <span className={`${styles.monto} text-body-1-medium`}>{totales.subtotal}</span>
          </div>
          {!sinEnvio && (
            <div className={styles.fila}>
              <span className="text-os-body-1">Envío</span>
              <span className={`${styles.monto} text-os-body-1`}>{totales.envio}</span>
            </div>
          )}
          <div className={`${styles.fila} ${styles.pad}`}>
            <span className="text-os-body-1">Descuentos aplicados</span>
            <span className={`${styles.monto} text-os-body-1`}>{totales.cupon}</span>
          </div>
          <div className={`${styles.fila} ${styles.pad} ${styles.total} text-subheadline-medium`}>
            <span>TOTAL (IVA incluido)</span>
            <span>{totales.total}</span>
          </div>
        </div>
        {onConfirmar && (
          <Button onClick={onConfirmar} style={{ width: '100%', justifyContent: 'center' }}>
            Confirmar el pedido
          </Button>
        )}
      </div>

      <div className={styles.productos}>
        <p className={`${styles.productosTitulo} text-body-1-medium`}>Resumen de productos</p>
        <div className={styles.lista}>
          {lineas.map((l) => (
            <div key={l.producto.id} className={styles.item}>
              <img src={l.producto.imagen[l.producto.imagen.length - 1].src} alt="" width={50} height={41} className={styles.miniatura} />
              <span className={`${styles.nombre} text-os-body-2`}>{l.producto.nombre}</span>
              <span className={`${styles.qty} text-os-body-2`}>x{cantidadVisible ? cantidadVisible(l) : l.cantidad}</span>
              <span className={`${styles.precio} text-body-2-medium`}>{formatoMXN(l.producto.precio * l.cantidad)}</span>
              {estado?.(l.producto.id) === 'bajo-pedido' && <ChipBajoPedido chico />}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
