/**
 * Figma: Toast (instancia 2596:99563) — aviso de error
 * La fuente del texto en Figma es Inter (sin variable).
 * Última sincronización: 2026-10-02
 */
import { Icon } from '../atoms/Icon';

export function Toast({ children }: { children: string }) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        padding: '12px 16px',
        borderRadius: 6,
        background: 'var(--color-red-50)',
        boxShadow: 'inset 0 0 0 1px var(--color-secondary-700)',
        overflow: 'hidden',
      }}
    >
      <Icon name="error" />
      <span style={{ flex: '1 1 0', font: "400 16px/24px 'Inter', sans-serif", color: 'var(--color-neutral-900)' }}>{children}</span>
    </div>
  );
}
