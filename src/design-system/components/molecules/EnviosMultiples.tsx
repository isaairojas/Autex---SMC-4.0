/**
 * SIN RESPALDO EN FIGMA (D35). Dentro de "Envío a domicilio": aviso de envíos múltiples y una fila por envío
 * ("Envío 1 · Desde Autex Colón · 1 artículo") que se despliega para ver la sucursal y sus artículos.
 */
import { useState } from 'react';
import { Icon } from '../atoms/Icon';
import { ProductThumb } from '../atoms/ProductThumb';
import type { Envio } from '../../../mocks/envios';
import styles from './EnviosMultiples.module.css';

export function EnviosMultiples({ envios, total }: { envios: Envio[]; total: number }) {
  const [abiertos, setAbiertos] = useState<Set<number>>(new Set());
  if (!envios.length) return null;
  const alternar = (n: number) => setAbiertos((a) => (a.has(n) ? new Set([...a].filter((x) => x !== n)) : new Set([...a, n])));
  return (
    <div className={styles.envios}>
      {total > 1 && (
        <p className={`${styles.aviso} text-body-1-book`}>
          <Icon name="info" box={20} size={18} color="var(--color-primary-500)" />
          Tu pedido llegará en <strong>{total} envíos</strong>: los artículos salen de distintas sucursales.
        </p>
      )}
      {envios.map((e) => {
        const abierto = abiertos.has(e.numero);
        const piezas = e.lineas.reduce((n, l) => n + l.cantidad, 0);
        return (
          <div key={e.numero} className={styles.envio}>
            <button type="button" className={styles.cabecera} onClick={() => alternar(e.numero)} aria-expanded={abierto}>
              <span className={`${styles.numero} text-body-1-medium`}>Envío {e.numero}</span>
              <span className={`${styles.resumen} text-body-1-book`}>
                {piezas} {piezas === 1 ? 'artículo' : 'artículos'} · {e.tiempo}
              </span>
              <span className={`${styles.ver} text-body-2-book`}>{abierto ? 'Ocultar' : 'Ver sucursal y artículos'}</span>
              <Icon name={abierto ? 'expand_less' : 'expand_more'} color="var(--color-primary-500)" />
            </button>
            {abierto && (
              <div className={styles.detalle}>
                <p className={`${styles.sucursal} text-body-1-book`}>
                  <Icon name="store" box={20} size={18} color="var(--color-primary-500)" />
                  <span>
                    <span>
                      Sale de <strong>{e.sucursal}</strong>
                      {e.bajoPedido && ' (la sucursal lo solicita y te lo envía)'}
                    </span>
                    {e.direccion && <span className={`${styles.gris} text-body-2-book`}>{e.direccion}</span>}
                  </span>
                </p>
                <ul className={styles.articulos}>
                  {e.lineas.map((l) => (
                    <li key={l.producto.id} className="text-body-2-book">
                      <ProductThumb capas={l.producto.imagen} size={48} />
                      <span className={styles.nombre}>{l.producto.nombre}</span>
                      <span className={styles.gris}>Cantidad: {l.cantidad}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
