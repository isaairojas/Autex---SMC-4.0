/**
 * Figma (Autex_2026_Frames): estructura común de "Autex - Checkout - 1…4" (677:18887, 719:22355, 723:23455, 738:17646)
 *  - Paso 1: Head 2026 (606:13261) + Headline 677:19625 en y=245 + franja gris (677:18891) + Footer 491
 *  - Pasos 2–4: "Navbar / Completed" + Headline en y=251 + franja gris en y=437 + Footer 531
 *  - Paso 4: "CTA usuario invitado" 742:20085 sobre la tarjeta (registrado)
 * Sin migas de pan (a diferencia del archivo anterior).
 * Última sincronización: 2026-10-05
 */
import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../design-system/components/atoms/Icon';
import { Stepper } from '../../design-system/components/molecules/Stepper';
import { Resumen } from '../../design-system/components/organisms/Resumen';
import { useDemo } from '../../state/DemoContext';
import { PageShell } from '../PageShell';
import { useGruposPedido } from './gruposPedido';
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

/** D51/D53: rutas de los pasos (el sitio permite ir a cualquier paso ya visitado desde el indicador). */
const RUTAS_PASO = { 1: '/checkout/datos', 2: '/checkout/envio', 3: '/checkout/pago', 4: '/checkout/confirmacion' } as const;

export function CheckoutLayout({ paso, children, overlay, resumen, onConfirmar, sinCostoEnvio }: CheckoutLayoutProps) {
  const navigate = useNavigate();
  const { carrito, cliente, totales, disponibilidad, modoFigma, numeroPedido, pasoAlcanzado, setPasoAlcanzado } = useDemo();
  const version2026 = paso === 1;
  const registrado = cliente.tipo === 'b2c' || cliente.tipo === 'b2b';
  const { grupos } = useGruposPedido();
  /* D53: el paso abierto queda como visitado para poder volver a él desde cualquier otro. */
  useEffect(() => {
    if (paso > pasoAlcanzado) setPasoAlcanzado(paso);
  }, [paso]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <PageShell version2026={version2026} enlaceActivo={null} pasarela={!modoFigma}>
      <div className={styles.headline} style={{ marginTop: version2026 ? 20 : 26 }}>
        {/* D53: en el sitio aún no hay número de pedido (se asigna al pagar y se muestra en la página de gracias). */}
        <h1 className={`${styles.title} text-heading-3-strong`}>{modoFigma ? `Pago del pedido ${numeroPedido} ` : 'Pago del pedido'}</h1>
        <Stepper activo={paso} alcanzado={pasoAlcanzado} onPaso={modoFigma ? undefined : (n) => navigate(RUTAS_PASO[n])} />
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
              /* D54: desde el paso 2 (ya con dirección) los productos van separados por envío y "Recoger en tienda". */
              grupos={paso > 1 ? grupos : null}
            />
          )}
        </div>
      </div>
      {overlay}
    </PageShell>
  );
}
