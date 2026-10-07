/**
 * Figma: Product (instancia 12849:114195) — tarjeta de producto con cantidad y "Agregar al Carrito".
 * Última sincronización: 2026-10-02
 */
import { useState } from 'react';
import { Icon } from '../atoms/Icon';
import removeIcon from '../../../assets/icons/remove.svg';
import addIcon from '../../../assets/icons/add.svg';
import autolite from '../../../assets/images/marca-autolite.png';
import type { ProductoCatalogo } from '../../../mocks/catalogo';
import styles from './ProductCard.module.css';

type Props = {
  producto: ProductoCatalogo;
  onAgregar: (cantidad: number) => void;
  onVer?: () => void;
  /** Texto de disponibilidad según la ubicación elegida. */
  disponibilidad?: { ok: boolean; texto: string };
  /** Figma: la primera tarjeta muestra "→" y las demás "✓" en "Si le queda a tu coche". */
  iconoCompatibilidad?: 'arrow_forward' | 'check';
};

export function ProductCard({ producto, onAgregar, onVer, disponibilidad = { ok: true, texto: 'Producto disponible' }, iconoCompatibilidad = 'check' }: Props) {
  const [cantidad, setCantidad] = useState(1);
  const [entero, centavos] = producto.precio.toFixed(2).split('.');
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <button type="button" className={styles.img} onClick={onVer} aria-label={producto.nombre}>
          <img src={producto.imagenTarjeta} alt="" />
        </button>
        <div className={styles.main}>
          <div className={styles.skuBrand}>
            <span className={`${styles.sku} text-caption-book`}>{producto.skuVisible}</span>
            {producto.logoMarca && <img src={autolite} alt="Autolite" className={styles.brand} />}
          </div>
          <div className={styles.desc}>
            <button type="button" className={`${styles.nombre} text-body-1-book`} onClick={onVer}>
              {producto.nombre}
            </button>
            <div className={styles.price}>
              <span className={styles.small}>$</span>
              <span className={styles.big}>{Number(entero).toLocaleString('en-US')}</span>
              <span className={styles.small}>{centavos}</span>
            </div>
            <div className={styles.disp}>
              <Icon name={disponibilidad.ok ? 'check_circle' : 'cancel'} color={disponibilidad.ok ? 'var(--color-green-700)' : 'var(--color-secondary-500)'} />
              <span className="text-body-1-book">{disponibilidad.texto}</span>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.addRow}>
            <div className={styles.qty}>
              <button type="button" className={styles.qtyBtn} onClick={() => setCantidad(Math.max(1, cantidad - 1))} aria-label="Quitar uno">
                <img src={removeIcon} alt="" width={16} height={16} />
              </button>
              <span className={`${styles.qtyValue} text-body-1-book`}>{cantidad}</span>
              <button type="button" className={`${styles.qtyBtn} ${styles.right}`} onClick={() => setCantidad(cantidad + 1)} aria-label="Agregar uno">
                <img src={addIcon} alt="" width={16} height={16} />
              </button>
            </div>
            <button type="button" className={`${styles.agregar} text-body-2-medium`} disabled={!disponibilidad.ok} onClick={() => onAgregar(cantidad)}>
              Agregar al Carrito
            </button>
          </div>
          <button type="button" className={`${styles.compat} text-body-2-medium`}>
            Si le queda a tu coche
            <Icon name={iconoCompatibilidad} box={16} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
