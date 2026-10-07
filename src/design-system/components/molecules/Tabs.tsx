/**
 * Figma: Tab (2596:99604 activa / 2596:99601 inactiva)
 * Última sincronización: 2026-10-02
 */
import styles from './Tabs.module.css';

type TabsProps = { tabs: string[]; activa: number; onChange: (i: number) => void };

export function Tabs({ tabs, activa, onChange }: TabsProps) {
  return (
    <div className={styles.tabs}>
      {tabs.map((t, i) => (
        <button key={t} type="button" className={`${styles.tab} ${i === activa ? styles.active : ''} text-headline-book`} onClick={() => onChange(i)}>
          {t}
        </button>
      ))}
    </div>
  );
}
