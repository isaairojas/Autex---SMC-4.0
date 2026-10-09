/**
 * Figma (Autex_2026_Frames): Autex - Checkout - 4 (738:17646), Container 738:17673 / 742:20100
 *  - Bloques "Acerca del pedido", "Método de envío" (domicilio) y "Método de pago"; "Cambiar" regresa al paso.
 *  - "Confirmar el pedido" en el resumen (742:20323).
 *  - Pago con tarjeta: OpenPay → Verificando → Gracias, o Tarjeta declinada (archivo anterior: 2599:105017,
 *    2599:98962, 2599:99468); el archivo 2026 no redibuja esos diálogos.
 * Última sincronización: 2026-10-05
 */
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/atoms/Button';
import { Icon } from '../../design-system/components/atoms/Icon';
import { CheckoutCard } from '../../design-system/components/organisms/CheckoutCard';
import { ConfirmacionBloque } from '../../design-system/components/molecules/ConfirmacionBloque';
import { AlertDialogCarga, AlertDialogError } from '../../design-system/components/organisms/AlertDialog';
import { TIENDAS_AUTOSERVICIO } from '../../mocks/logistica';
import { useDemo } from '../../state/DemoContext';
import { ProductThumb } from '../../design-system/components/atoms/ProductThumb';
import type { FilaConfirmacion } from '../../design-system/components/molecules/ConfirmacionBloque';
import { EnviosMultiples } from '../../design-system/components/molecules/EnviosMultiples';
import { PEDIDO_ANTERIOR_REGISTRADO } from '../../mocks/clientes';
import type { LineaCarrito } from '../../mocks/productos';
import { estadoHorario } from '../../mocks/tiendas';
import { useCambioDireccion } from './CambioDireccion';
import { useGruposPedido } from './gruposPedido';
import { CheckoutLayout } from './CheckoutLayout';
import openpay from '../../assets/images/openpay-formulario-tarjeta.png';
import styles from './Confirmacion.module.css';
import envioStyles from './MetodoEnvio.module.css';

export type OverlayConfirmacion = 'ninguno' | 'openpay' | 'verificando' | 'declinada';

const CALZ = 'Calz del Federalismo Nte 1343 Col, Mezquitan Country, 45190 Guadalajara, Jal.';

export function Confirmacion({ overlayInicial = 'ninguno' }: { overlayInicial?: OverlayConfirmacion }) {
  const navigate = useNavigate();
  /* D52: el registrado con su información completa y un solo envío llega aquí directo desde el carrito. */
  const directo = !!(useLocation().state as { directo?: boolean } | null)?.directo;
  const { pago, envioDetalle, pagoDetalle, modoFigma, cliente, registrarPedido, carrito, tienda: miTienda, borradorInvitado, pedidos } = useDemo();
  /* D43: lo que se recoge en tienda va en su propia fila de "Método de envío". */
  const recoge = !modoFigma && carrito.some((l) => l.entrega === 'tienda');
  const envia = modoFigma || carrito.some((l) => l.entrega !== 'tienda');
  /* D51: "Cambiar" abre el cambio de dirección con confirmación (el invitado va a su formulario) y regresa al paso 2. */
  const cambio = useCambioDireccion();
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

  /* D54: "Método de envío" separado: la dirección, cada envío con su sucursal, tiempo y artículos (sin elegir fecha) y
     lo que se recoge en tienda aparte. */
  const { envios, recoger, sinExistencia } = useGruposPedido();
  const filasEnvio: FilaConfirmacion[] = [
    ...(envia
      ? [
          {
            etiqueta: 'Envío a domicilio',
            valor: envioDetalle.direccion ?? CALZ,
            /* D54: los envíos se ven compactos (sucursal y artículos se despliegan), como en Método de envío. */
            contenido: <EnviosMultiples envios={envios} total={envios.length} />,
            onCambiar: cambio.cambiar,
          },
        ]
      : []),
    ...(recoge && miTienda
      ? [
          {
            etiqueta: 'Recoger en tienda',
            valor: `Autex ${miTienda.nombre}`,
            nota: `${miTienda.direccion} · ${estadoHorario(miTienda.horario).corto}`,
            contenido: <Desplegable lineas={recoger} />,
            onCambiar: () => navigate('/carrito'),
          },
        ]
      : []),
    ...(sinExistencia.length
      ? [{ etiqueta: 'Sin existencia', valor: 'No entra en ningún envío', contenido: <Desplegable lineas={sinExistencia} />, onCambiar: () => navigate('/checkout/envio') }]
      : []),
  ];
  /* D54: facturación con los datos fiscales del paso 1 (el registrado, los de su pedido anterior si no los ha cambiado). */
  const fiscales = borradorInvitado ?? (cliente.tipo !== 'invitado' ? pedidos.find((p) => p.registrado && p.datos)?.datos ?? PEDIDO_ANTERIOR_REGISTRADO : null);
  const filasFacturacion: FilaConfirmacion[] =
    fiscales?.regimen && fiscales.cfdi
      ? [
          { etiqueta: 'Régimen fiscal', valor: fiscales.regimen, onCambiar: () => navigate('/checkout/datos') },
          { etiqueta: 'Uso del CFDI', valor: fiscales.cfdi },
          { etiqueta: 'Factura a nombre de', valor: `${fiscales.nombre ?? ''} ${fiscales.apellido ?? ''}`.trim() || cliente.nombre, nota: `La enviaremos a ${fiscales.correo || cliente.correo}` },
        ]
      : [{ etiqueta: 'Factura', valor: 'Sin datos fiscales', nota: 'Si necesitas factura, agrega tu régimen fiscal y uso del CFDI en Datos del usuario.', onCambiar: () => navigate('/checkout/datos') }];

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
          {cambio.modales}
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
        {directo && (
          <p className={`${envioStyles.nota} text-body-1-book`} role="status">
            <Icon name="check_circle" color="var(--color-green-700)" />
            Tu información está completa y tu pedido llega en un solo envío: solo revisa y confirma tu pedido. Si necesitas cambiar la dirección o el método de pago, usa "Cambiar".
          </p>
        )}
        {!modoFigma ? (
          <div className={styles.blocks}>
            <ConfirmacionBloque titulo="Método de envío" gap={TITULO_GAP} anchoTitulo={TITULO_ANCHO} variante="envio" filas={filasEnvio} />
            <ConfirmacionBloque
              titulo="Método de pago"
              gap={TITULO_GAP}
              anchoTitulo={TITULO_ANCHO}
              variante="envio"
              filas={[
                enTienda
                  ? { etiqueta: 'Tienda de autoservcio', valor: `Tienda ${tienda?.nombre ?? 'OXXO'}`, onCambiar: () => navigate('/checkout/pago') }
                  : { etiqueta: 'Pago con tarjeta débito / crédito', valor: `${marca} terminación ${terminacion}`, onCambiar: () => navigate('/checkout/pago') },
              ]}
            />
            <ConfirmacionBloque titulo="Facturación" gap={TITULO_GAP} anchoTitulo={TITULO_ANCHO} variante="envio" filas={filasFacturacion} />
          </div>
        ) : (
        <div className={styles.blocks}>
          <ConfirmacionBloque
            titulo="Acerca del pedido"
            gap={99}
            variante="pedido"
            filas={[
              /* D53: en el sitio el número de pedido se asigna al pagar (página de gracias). */
              ...(modoFigma ? [{ etiqueta: 'Número de pedido', valor: '#0001087 - 24 ' }] : []),
              { etiqueta: 'Fecha de solicitud', valor: modoFigma ? 'Miércoles 9/03/2023' : fechaHoy() },
            ]}
          />
          <ConfirmacionBloque
            titulo="Método de envío"
            gap={112}
            variante="envio"
            filas={[
              ...(envia
                ? [{ etiqueta: 'Envío a domicilio', valor: modoFigma ? CALZ : envioDetalle.direccion ?? CALZ, onCambiar: modoFigma ? () => navigate('/checkout/datos') : cambio.cambiar }]
                : []),
              ...(recoge && miTienda ? [{ etiqueta: 'Recoger en tienda', valor: `Autex ${miTienda.nombre} · ${miTienda.direccion}`, onCambiar: () => navigate('/carrito') }] : []),
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
        )}
      </CheckoutCard>
    </CheckoutLayout>
  );
}

/* D54: títulos de los bloques del sitio con el mismo ancho para alinear las filas. */
const TITULO_ANCHO = 180;
const TITULO_GAP = 24;

/** D54: artículos plegados ("Ver artículos (N)"), para no mostrar todos los productos desde el inicio. */
function Desplegable({ lineas }: { lineas: LineaCarrito[] }) {
  const [abierto, setAbierto] = useState(false);
  const piezas = lineas.reduce((n, l) => n + l.cantidad, 0);
  return (
    <div className={styles.envio}>
      <button type="button" className={`${styles.verArticulos} text-body-2-book`} onClick={() => setAbierto(!abierto)} aria-expanded={abierto}>
        {abierto ? 'Ocultar artículos' : `Ver artículos (${piezas} ${piezas === 1 ? 'pieza' : 'piezas'})`}
        <Icon name={abierto ? 'expand_less' : 'expand_more'} color="var(--color-primary-500)" />
      </button>
      {abierto && <Articulos lineas={lineas} />}
    </div>
  );
}

/** Artículos de un envío o de lo que se recoge en tienda. */
function Articulos({ lineas }: { lineas: LineaCarrito[] }) {
  return (
    <ul className={styles.articulos}>
      {lineas.map((l) => (
        <li key={l.producto.id} className="text-body-2-book">
          <ProductThumb capas={l.producto.imagen} size={48} />
          <span className={styles.articuloNombre}>{l.producto.nombre}</span>
          <span className={styles.gris}>Cantidad: {l.cantidad}</span>
        </li>
      ))}
    </ul>
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
