/**
 * Figma (Autex_2026_Frames): estructura común de "Autex - Checkout - 1…4" (677:18887, 719:22355, 723:23455, 738:17646)
 *  - Paso 1: Head 2026 (606:13261) + Headline 677:19625 en y=245 + franja gris (677:18891) + Footer 491
 *  - Pasos 2–4: "Navbar / Completed" + Headline en y=251 + franja gris en y=437 + Footer 531
 *  - Paso 4: "CTA usuario invitado" 742:20085 sobre la tarjeta (registrado)
 * Sin migas de pan (a diferencia del archivo anterior).
 * Última sincronización: 2026-10-05
 */
import type { ReactNode } from 'react';
import { Icon } from '../../design-system/components/atoms/Icon';
import { Stepper } from '../../design-system/components/molecules/Stepper';
import { Resumen } from '../../design-system/components/organisms/Resumen';
import { useDemo } from '../../state/DemoContext';
import { PageShell } from '../PageShell';
import styles from './CheckoutLayout.module.css';

type CheckoutLayoutProps = {
  paso: 1 | 2 | 3 | 4;
  /** Contenido de la tarjeta principal (CheckoutCard). */
  children: ReactNode;
  /** Overlay (Modal / Dialog alert) dentro del mismo frame. */
  overlay?: ReactNode;
  resumen?: ReactNode;
  /** Paso 4: muestra "Confirmar el pedido" en el resumen. */
  onConfirmar?: () => void;
  /** El resumen no muestra la fila "Envío" (en el sitio nunca se muestra, D35). */
  sinCostoEnvio?: boolean;
};

export function CheckoutLayout({ paso, children, overlay, resumen, onConfirmar, sinCostoEnvio }: CheckoutLayoutProps) {
  const { carrito, cliente, totales, disponibilidad, modoFigma, numeroPedido } = useDemo();
  const version2026 = paso === 1;
  const registrado = cliente.tipo === 'b2c' || cliente.tipo === 'b2b';
  return (
    <PageShell version2026={version2026} enlaceActivo={null}>
      <div className={styles.headline} style={{ marginTop: version2026 ? 20 : 26 }}>
        <h1 className={`${styles.title} text-heading-3-strong`}>Pago del pedido {numeroPedido} </h1>
        <Stepper activo={paso} />
      </div>
      <div className={styles.section} style={{ marginTop: version2026 ? 20 : 26, marginBottom: version2026 ? 20 : 26 }}>
        {paso === 4 && registrado && (
          /* figma: 742:20085 — x=96, y=50, alto 40 */
          <div className={styles.cta}>
            <Icon name="account_circle" box={40} size={40} />
            <span className={`${styles.ctaTexto} text-os-body-1`}>
              {cliente.nombre} / {cliente.empresa}
            </span>
          </div>
        )}
        <div className={styles.row}>
          {children}
          {resumen ?? (
            <Resumen
              lineas={carrito}
              totales={totales}
              estado={(id) => disponibilidad(id).estado}
              cantidadVisible={modoFigma ? (l) => (l.producto.estadoFigma === 'bajo-pedido' ? 10 : l.cantidad) : undefined}
              onConfirmar={onConfirmar}
              /* Sitio (D35): sin fila de envío en ningún paso. */
              sinEnvio={sinCostoEnvio || !modoFigma}
            />
          )}
        </div>
      </div>
      {overlay}
    </PageShell>
  );
}
