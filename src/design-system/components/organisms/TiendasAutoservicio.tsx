/**
 * Figma: contenido del modal "Pago en tiendas de autoservicio" (2599:104102):
 * Description 2599:104111 + Grid tiendas 2599:104115 (celdas de 64 px, gap 12/24).
 * Última sincronización: 2026-10-02
 */
import { TIENDAS_AUTOSERVICIO } from '../../../mocks/logistica';
import styles from './TiendasAutoservicio.module.css';

type Props = { seleccion: string | null; onSelect: (id: string) => void };

export function TiendasAutoservicio({ seleccion, onSelect }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.desc}>
        <p className="text-body-1-medium">Pagos en efectivo en más de 30,000 puntos de venta en todo el país</p>
        <p className={`${styles.hint} text-os-body-2`}>Selecciona la tienda de tu preferencia.</p>
      </div>
      <div className={styles.grid}>
        {TIENDAS_AUTOSERVICIO.map((fila, i) => (
          <div key={i} className={styles.row}>
            {fila.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`${styles.cell} ${i === 2 ? styles.fixed : ''} ${seleccion === t.id ? styles.sel : ''}`}
                onClick={() => onSelect(t.id)}
                aria-label={t.nombre}
              >
                <img src={t.logo} alt="" style={{ width: t.w, height: t.h, objectFit: 'contain' }} />
                {seleccion === t.id && <span className={styles.check} />}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
