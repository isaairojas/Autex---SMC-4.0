/**
 * Figma: Icon (instancias de la fuente Material Icons, p. ej. 13:829, 13:835)
 * Los íconos de Figma son glifos de la fuente "Material Icons"; se renderizan con la misma fuente.
 * Última sincronización: 2026-10-02
 */
import type { CSSProperties } from 'react';

type IconProps = {
  name: string;
  /** Tamaño de la caja del ícono en Figma (px). */
  box?: number;
  /** Tamaño del glifo en Figma (px). */
  size?: number;
  color?: string;
  className?: string;
};

export function Icon({ name, box = 24, size = 20, color = 'var(--color-neutral-900)', className }: IconProps) {
  const style: CSSProperties = {
    width: box,
    height: box,
    fontSize: size,
    lineHeight: `${size}px`,
    color,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontFamily: "'Material Icons'",
    fontStyle: 'normal',
    fontWeight: 400,
    userSelect: 'none',
  };
  return (
    <span className={className} style={style} aria-hidden>
      {name}
    </span>
  );
}
