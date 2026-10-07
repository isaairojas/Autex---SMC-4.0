/**
 * Figma: Content (breadcrumbs) — componente 111:36109, instancia 728:89726
 * Última sincronización: 2026-10-02
 */
import { Fragment } from 'react';
import back from '../../../assets/icons/arrow-back.svg';
import styles from './Breadcrumbs.module.css';

type BreadcrumbsProps = {
  items: string[];
  onBack?: () => void;
};

export function Breadcrumbs({ items, onBack }: BreadcrumbsProps) {
  return (
    <div className={styles.content}>
      <button type="button" className={styles.back} onClick={onBack}>
        <img src={back} alt="" width={15} height={15} />
        <span className="text-body-2-book">Volver</span>
      </button>
      {items.map((item) => (
        <Fragment key={item}>
          <span className={`${styles.sep} text-os-body-2`}>|</span>
          <span className={`${styles.item} text-body-2-book`}>{item}</span>
        </Fragment>
      ))}
    </div>
  );
}
