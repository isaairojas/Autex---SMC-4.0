/**
 * Figma: Field Label (instancia 127:64412) + Input form (27:710)
 * Etiqueta roja (campo obligatorio) + texto auxiliar "Text Label" + caja de entrada.
 * Última sincronización: 2026-10-02
 */
import styles from './TextField.module.css';
import { Icon } from './Icon';

type TextFieldProps = {
  label: string;
  /** Texto auxiliar junto a la etiqueta; en Figma es "Text Label". */
  helper?: string;
  value: string;
  onChange?: (value: string) => void;
  /** Variante con flecha (selector). */
  select?: boolean;
  options?: string[];
  placeholder?: string;
  className?: string;
};

export function TextField({ label, helper = 'Text Label', value, onChange, select, options, placeholder, className }: TextFieldProps) {
  return (
    <label className={[styles.field, className].filter(Boolean).join(' ')}>
      <span className={`${styles.label} text-body-2-book`}>
        <span className={styles.required}>{label}</span>
        {helper && <span className={styles.helper}>{helper}</span>}
      </span>
      <span className={styles.input}>
        {select ? (
          <>
            <select className={`${styles.control} text-body-1-book`} value={value} onChange={(e) => onChange?.(e.target.value)}>
              {(options ?? [value]).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <Icon name="expand_more" box={16} size={16} />
          </>
        ) : (
          <input
            className={`${styles.control} text-body-1-book`}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
          />
        )}
      </span>
    </label>
  );
}
