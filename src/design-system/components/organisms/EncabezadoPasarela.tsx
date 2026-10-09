/**
 * SIN RESPALDO EN FIGMA (D52). Encabezado de la pasarela de pago (checkout del sitio): sin la franja superior ni la
 * barra de navegación; solo el logo y "Volver al carrito", para que el cliente no salga del pago por otro camino.
 * Medidas de la barra "Navbar / Completed" (alto 96, margen 80).
 */
import logo from '../../../assets/icons/autex-logo-navbar.svg';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import styles from './EncabezadoPasarela.module.css';

export function EncabezadoPasarela({ onVolver }: { onVolver: () => void }) {
  return (
    <header className={styles.encabezado}>
      <img src={logo} alt="AUTEX" width={165.087} height={24.1553} />
      <Button variant="text" icon={<Icon name="arrow_back" color="var(--color-primary-500)" />} onClick={onVolver}>
        Volver al carrito
      </Button>
    </header>
  );
}
