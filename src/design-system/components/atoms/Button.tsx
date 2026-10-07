/**
 * Figma: Button (instancias 2596:98482 outline, 2596:98483 primario, 2596:99024 deshabilitado)
 * Última sincronización: 2026-10-02
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'text';
  icon?: ReactNode;
  width?: number;
};

export function Button({ variant = 'primary', icon, width, className, children, style, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      style={{ width, ...style }}
      {...rest}
    >
      {icon}
      <span className="text-body-1-book">{children}</span>
    </button>
  );
}
