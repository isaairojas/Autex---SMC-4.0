/**
 * Figma: Button de texto subrayado ("Añadir dirección +" 2600:105558, "Nueva tarjeta +" 2600:106507,
 * "Editar dirección" 723:88004, "Ver detalles de mi crédito" 2600:119077).
 * Última sincronización: 2026-10-02
 */
import { Icon } from './Icon';

type LinkButtonProps = { children: string; mas?: boolean; onClick?: () => void; padding?: string; width?: number };

export function LinkButton({ children, mas, onClick, padding = mas ? '8px 12px 8px 20px' : '8px 16px', width }: LinkButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="text-body-1-book"
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        padding,
        width,
        border: 'none',
        borderRadius: 8,
        background: 'none',
        color: 'var(--color-neutral-900)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <span style={{ textDecoration: 'underline' }}>{children}</span>
      {mas && <Icon name="add" />}
    </button>
  );
}
