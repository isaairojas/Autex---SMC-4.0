/**
 * SIN RESPALDO EN FIGMA (D36). Carga a página completa: todo se pone en gris (Alpha/Back Alpha 300) con el spinner
 * del diálogo "Verificando tus datos" (2599:98962) al centro, como una recarga; al terminar la página ya muestra
 * los cambios. Se usa en el checkout, en los cambios de tienda, C.P. o dirección y al cargar productos.
 */
import spinner from '../../../assets/icons/circular-slider.svg';
import styles from './CargaPagina.module.css';

export function CargaPagina({ texto }: { texto: string }) {
  return (
    <div className={styles.capa} role="status" aria-live="polite" aria-label={texto}>
      <img src={spinner} alt="" width={96} height={96} className={styles.spin} />
      <p className={`${styles.texto} text-subheadline-book`}>{texto}</p>
    </div>
  );
}
