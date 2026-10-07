/**
 * Figma (Autex_2026_Frames): Autex - Checkout - 4 (738:17646), Container 738:17673 / 742:20100
 *  - Bloques "Acerca del pedido", "Método de envío" (domicilio) y "Método de pago"; "Cambiar" regresa al paso.
 *  - "Confirmar el pedido" en el resumen (742:20323).
 *  - Pago con tarjeta: OpenPay → Verificando → Gracias, o Tarjeta declinada (archivo anterior: 2599:105017,
 *    2599:98962, 2599:99468); el archivo 2026 no redibuja esos diálogos.
 * Última sincronización: 2026-10-05
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/atoms/Button';
import { CheckoutCard } from '../../design-system/components/organisms/CheckoutCard';
import { ConfirmacionBloque } from '../../design-system/components/molecules/ConfirmacionBloque';
import { AlertDialogCarga, AlertDialogError } from '../../design-system/components/organisms/AlertDialog';
import { TIENDAS_AUTOSERVICIO } from '../../mocks/logistica';
import { useDemo } from '../../state/DemoContext';
import { CheckoutLayout } from './CheckoutLayout';
import openpay from '../../assets/images/openpay-formulario-tarjeta.png';
import styles from './Confirmacion.module.css';

export type OverlayConfirmacion = 'ninguno' | 'openpay' | 'verificando' | 'declinada';

const CALZ = 'Calz del Federalismo Nte 1343 Col, Mezquitan Country, 45190 Guadalajara, Jal.';

export function Confirmacion({ overlayInicial = 'ninguno' }: { overlayInicial?: OverlayConfirmacion }) {
  const navigate = useNavigate();
  const { pago, envioDetalle, pagoDetalle, modoFigma, cliente, numeroPedido, registrarPedido } = useDemo();
  /* Sitio: el registrado cambia la dirección en el paso 2 ("Cambiar dirección de entrega"); el invitado, en su formulario. */
  const pasoDireccion = !modoFigma && cliente.tipo !== 'invitado' ? '/checkout/envio' : '/checkout/datos';
  const terminar = () => {
    registrarPedido();
    navigate('/checkout/gracias');
  };
  const [overlay, setOverlay] = useState<OverlayConfirmacion>(overlayInicial);

  const tienda = TIENDAS_AUTOSERVICIO.flat().find((t) => t.id === pagoDetalle.tiendaId);
  const enTienda = pago === 'tienda';
  /* figma: 742:20135 muestra "Visa terminación 4489" aunque el paso 3 elige la 4485 (D25) */
  const terminacion = modoFigma ? '4489' : pagoDetalle.tarjeta.numero.slice(-4);
  const marca = pagoDetalle.forma === 'mastercard' ? 'Mastercard' : 'Visa';

  const confirmar = () => {
    if (enTienda) {
      terminar();
      return;
    }
    setOverlay('openpay');
  };

  const pagar = () => {
    setOverlay('verificando');
    // Simulación: las tarjetas que terminan en 0000 se declinan.
    window.setTimeout(() => {
      if (terminacion === '0000') setOverlay('declinada');
      else terminar();
    }, 2000);
  };

  return (
    <CheckoutLayout
      paso={4}
      onConfirmar={confirmar}
      overlay={
        <>
          {overlay === 'openpay' && <OpenPay onPagar={pagar} onClose={() => setOverlay('ninguno')} />}
          {overlay === 'verificando' && <AlertDialogCarga onClose={() => setOverlay('ninguno')} />}
          {overlay === 'declinada' && (
            <AlertDialogError
              titulo="Tarjeta declinada"
              mensaje="No es posible realizar el pago con esta tarjeta."
              detalle="Utiliza una nueva tarjeta o verifica con tu banco este acontecimiento."
              onCancel={() => setOverlay('ninguno')}
              onAccept={() => navigate('/checkout/pago')}
            />
          )}
        </>
      }
    >
      <CheckoutCard
        title="Confirmación del pedido"
        intro="Selecciona método de pago"
        actions={
          <Button variant="outline" onClick={() => navigate('/checkout/pago')}>
            Regresar
          </Button>
        }
      >
        <div className={styles.blocks}>
          <ConfirmacionBloque
            titulo="Acerca del pedido"
            gap={99}
            variante="pedido"
            filas={[
              { etiqueta: 'Número de pedido', valor: modoFigma ? '#0001087 - 24 ' : numeroPedido },
              { etiqueta: 'Fecha de solicitud', valor: modoFigma ? 'Miércoles 9/03/2023' : fechaHoy() },
            ]}
          />
          <ConfirmacionBloque
            titulo="Método de envío"
            gap={112}
            variante="envio"
            filas={[
              {
                etiqueta: 'Envío a domicilio',
                valor: modoFigma ? CALZ : envioDetalle.direccion ?? CALZ,
                onCambiar: () => navigate(pasoDireccion),
              },
            ]}
          />
          <ConfirmacionBloque
            titulo="Método de pago"
            gap={116}
            variante="pago"
            filas={[
              enTienda
                ? { etiqueta: 'Tienda de autoservcio', valor: `Tienda ${tienda?.nombre ?? 'OXXO'}`, onCambiar: () => navigate('/checkout/pago') }
                : { etiqueta: 'Pago con tarjeta débito / crédito', valor: `${marca} terminación ${terminacion}`, onCambiar: () => navigate('/checkout/pago') },
            ]}
          />
        </div>
      </CheckoutCard>
    </CheckoutLayout>
  );
}

/** Fecha de hoy como la muestra Figma: "Miércoles 9/03/2023". */
function fechaHoy() {
  const d = new Date();
  const dia = d.toLocaleDateString('es-MX', { weekday: 'long' });
  return `${dia[0].toUpperCase()}${dia.slice(1)} ${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/**
 * Figma: Modal 2599:105017 con "image 28" (2599:105018): formulario de OpenPay como imagen (796×590).
 * La zona del botón "Pagar" de la imagen es interactiva.
 */
function OpenPay({ onPagar, onClose }: { onPagar: () => void; onClose: () => void }) {
  return (
    <div className={styles.openpayBackdrop} onClick={onClose}>
      <div className={styles.openpay} onClick={(e) => e.stopPropagation()}>
        <img src={openpay} alt="Formulario de pago con tarjeta de OpenPay" width={796} height={590} />
        <button type="button" className={styles.pagar} onClick={onPagar} aria-label="Pagar" />
      </div>
    </div>
  );
}
