/**
 * Figma (Autex_2026_Frames): Product (instancias I657:14098;606:11951…) — 335 × 547, p12, borde Neutral/200
 * Estados de existencia SMC 4.0:
 *  - Disponible + "104 pzs" (Motion 590:2371): "Agregar a lista" y "Agregar al carrito".
 *  - Bajo pedido (chip 620:9374 + "Entrega estimada de 2 a 4 días hábiles").
 *  - No disponible (motion_photos_off, rojo #E4092C): "Agregar a lista" al 50 % y "Avisar disponibilidad".
 * Última sincronización: 2026-10-05
 */
import { useState } from 'react';
import { Icon } from '../atoms/Icon';
import removeIcon from '../../../assets/icons/remove.svg';
import addIcon from '../../../assets/icons/add.svg';
import disponibleIcon from '../../../assets/icons/estado-disponible.svg';
import bajoPedidoIcon from '../../../assets/icons/estado-bajo-pedido.svg';
import tecnofuel from '../../../assets/images/marca-tecnofuel.png';
import type { ProductoCatalogo } from '../../../mocks/catalogo';
import type { EstadoExistencia } from '../../../mocks/productos';
import { ChipBajoPedido } from './CarritoCompra';
import styles from './TarjetaProducto.module.css';

type Props = {
  producto: ProductoCatalogo;
  estado: EstadoExistencia;
  /** Piezas en sucursales de la zona ("104 pzs"). */
  piezas: number;
  /** Sitio (sin respaldo en Figma, D34): existencia por rangos ("+100") en lugar de la cantidad exacta. */
  etiquetaPiezas?: string;
  /**
   * Sitio (D39): piezas que aún se pueden agregar (existencia para venta en línea menos lo que ya está en el carrito).
   * Con este valor la cantidad se puede escribir y no puede superarlo; sin él se ve el contador de Figma.
   */
  maximo?: number;
  onAgregar: (cantidad: number) => void;
  onVer?: () => void;
  onAvisar?: () => void;
};

export function TarjetaProducto({ producto, estado, piezas, etiquetaPiezas, maximo, onAgregar, onVer, onAvisar }: Props) {
  const [cantidad, setCantidad] = useState(1);
  const [texto, setTexto] = useState('1');
  const [aviso, setAviso] = useState<string | null>(null);
  const limitado = maximo !== undefined;
  const agotado = limitado && maximo <= 0;
  /* Fija la cantidad entre 1 y la existencia para venta en línea; si se pasa, avisa y la ajusta. */
  const fijar = (n: number) => {
    let c = Math.max(1, Number.isFinite(n) ? Math.floor(n) : 1);
    if (limitado && maximo > 0 && c > maximo) {
      c = maximo;
      setAviso(`Solo hay ${maximo} ${maximo === 1 ? 'pieza disponible' : 'piezas disponibles'} para compra en línea.`);
    } else setAviso(null);
    setCantidad(c);
    setTexto(String(c));
  };
  const [avisado, setAvisado] = useState(false);
  const [entero, centavos] = producto.precio.toFixed(2).split('.');
  const sinExistencia = estado === 'sin-existencia';
  return (
    <div className={styles.card}>
      {estado === 'bajo-pedido' && <ChipBajoPedido />}
      <div className={styles.contenido}>
        <button type="button" className={styles.imagen} onClick={onVer} aria-label={producto.nombre}>
          <img src={producto.imagenTarjeta} alt="" width={229} height={188} className={producto.imagenPendiente ? styles.pendiente : undefined} />
        </button>
        <div className={styles.principal}>
          <div className={styles.skuMarca}>
            <span className={`${styles.sku} text-caption-book`}>{producto.skuVisible}</span>
            {producto.logoMarca && <img src={tecnofuel} alt={producto.marca} width={71} height={25} />}
          </div>
          <div className={styles.descripcion}>
            <button type="button" className={`${styles.nombre} text-body-1-book`} onClick={onVer}>
              {producto.nombre}
            </button>
            <div className={styles.precio}>
              <span className="text-caption-book">$</span>
              <span className={styles.entero}>{Number(entero).toLocaleString('en-US')}</span>
              <span className="text-caption-book">{centavos}</span>
            </div>
            {estado === 'disponible' && (
              <div className={styles.motion}>
                <img src={disponibleIcon} alt="" width={24} height={24} />
                <span className="text-body-1-book">Disponible</span>
                <span className={styles.piezas}>{etiquetaPiezas ?? piezas} pzs</span>
              </div>
            )}
            {estado === 'bajo-pedido' && (
              <div className={styles.motionBajo}>
                <img src={bajoPedidoIcon} alt="" width={24} height={24} />
                <span className={styles.motionTexto}>
                  <span className="text-body-1-book">Disponible bajo pedido</span>
                  <span className={styles.entrega}>
                    Entrega estimada de <b>2 a 4 día</b>s habiles
                  </span>
                </span>
              </div>
            )}
            {sinExistencia && (
              <div className={styles.motionNo}>
                <Icon name="motion_photos_off" box={28} size={28} color="var(--color-rojo-no-disponible)" />
                <span className="text-body-1-book">No disponible</span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.acciones}>
          <div className={styles.fila}>
            <div className={styles.qty}>
              <button type="button" className={styles.qtyBtn} onClick={() => fijar(cantidad - 1)} aria-label="Quitar uno">
                <img src={removeIcon} alt="" width={16} height={16} />
              </button>
              {limitado ? (
                <input
                  className={`${styles.qtyValor} ${styles.qtyInput} text-body-1-book`}
                  inputMode="numeric"
                  value={texto}
                  aria-label={`Cantidad de ${producto.nombre}`}
                  disabled={sinExistencia || agotado}
                  onChange={(e) => setTexto(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onBlur={() => fijar(Number(texto))}
                  onKeyDown={(e) => e.key === 'Enter' && fijar(Number(texto))}
                />
              ) : (
                <span className={`${styles.qtyValor} text-body-1-book`}>{cantidad}</span>
              )}
              <button type="button" className={`${styles.qtyBtn} ${styles.qtyDer}`} onClick={() => fijar(cantidad + 1)} aria-label="Agregar uno">
                <img src={addIcon} alt="" width={16} height={16} />
              </button>
            </div>
            <button type="button" className={`${styles.lista} text-body-1-book`} disabled={sinExistencia}>
              Agregar a lista
            </button>
          </div>
          {sinExistencia ? (
            <button
              type="button"
              className={`${styles.avisar} text-body-1-book`}
              onClick={() => {
                setAvisado(true);
                onAvisar?.();
              }}
            >
              {avisado ? 'Te avisaremos' : 'Avisar disponibilidad'}
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.carrito} text-body-1-book`}
              disabled={agotado}
              onClick={() => {
                /* La cantidad escrita sin confirmar también se valida contra la existencia. */
                const n = Math.max(1, Math.floor(Number(texto)) || 1);
                const c = limitado && n > maximo ? maximo : n;
                if (c !== n) fijar(n);
                if (c > 0) onAgregar(c);
              }}
            >
              Agregar al carrito
            </button>
          )}
          {limitado && (aviso || agotado) && (
            <p className={`${styles.avisoCantidad} text-caption-book`} role="alert">
              {agotado ? 'Ya tienes en tu carrito todas las piezas disponibles para compra en línea.' : aviso}
            </p>
          )}
          <button type="button" className={`${styles.compat} text-body-2-medium`}>
            Si le queda a tu vehículo
            <Icon name="check" box={16} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
