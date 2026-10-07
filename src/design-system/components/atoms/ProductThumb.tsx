/**
 * Figma: miniatura de producto (p. ej. 1341:94683, 1341:94692): capas de imagen superpuestas.
 * Última sincronización: 2026-10-02
 */
import type { CapaImagen } from '../../../mocks/productos';

type ProductThumbProps = {
  capas: CapaImagen[];
  size: number;
};

export function ProductThumb({ capas, size }: ProductThumbProps) {
  return (
    <span style={{ position: 'relative', width: size, height: size, flexShrink: 0, display: 'block' }} aria-hidden>
      {capas.map((c, i) => (
        <img
          key={i}
          src={c.src}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: c.fit }}
        />
      ))}
    </span>
  );
}
