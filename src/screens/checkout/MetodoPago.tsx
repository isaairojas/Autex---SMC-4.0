/**
 * Figma (Autex_2026_Frames): Autex - Checkout - 3 (723:23455), Container 723:23482
 *  - "Tarjetas": logos aceptados + tarjetas registradas (725:24098) + "Añadir tarjeta +".
 *  - "Otras formas de pago": abre el modal de tiendas de autoservicio del archivo anterior (2599:104102),
 *    sin pantalla equivalente en el archivo 2026.
 *  - Invitado o "Añadir tarjeta": campos de tarjeta del archivo anterior (2599:97130), sin respaldo en 2026.
 * Última sincronización: 2026-10-05
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/atoms/Button';
import { LinkButton } from '../../design-system/components/atoms/LinkButton';
import { CheckoutCard } from '../../design-system/components/organisms/CheckoutCard';
import { CamposTarjeta, tarjetaValida } from '../../design-system/components/organisms/FormaDePago';
import { FormasDePago2026, TARJETAS_2026, TarjetaGuardada, type FormaPago2026 } from '../../design-system/components/organisms/Pago2026';
import { Modal } from '../../design-system/components/organisms/Modal';
import { TiendasAutoservicio } from '../../design-system/components/organisms/TiendasAutoservicio';
import { TARJETA_FIGMA, useDemo } from '../../state/DemoContext';
import { BloqueDireccion, useCambioDireccion } from './CambioDireccion';
import { CheckoutLayout } from './CheckoutLayout';
import styles from './FormularioInvitado.module.css';

export function MetodoPago({ modalTiendas = false }: { modalTiendas?: boolean }) {
  const navigate = useNavigate();
  const { pagoDetalle, setPagoDetalle, setPago, cliente, conCarga, modoFigma, tarjetaPredeterminadaId, setTarjetaPredeterminada } = useDemo();
  const registrado = cliente.tipo === 'b2c' || cliente.tipo === 'b2b';
  const [forma, setForma] = useState<FormaPago2026>(pagoDetalle.forma === 'otras' ? 'otras' : 'tarjetas');
  const [modal, setModal] = useState(modalTiendas);
  const [tienda, setTienda] = useState(pagoDetalle.tiendaId);
  /* D57: de inicio, la tarjeta predeterminada del cliente (la galería conserva la Visa 4485 de Figma). */
  const [registrada, setRegistrada] = useState(modoFigma ? 'visa-4485' : tarjetaPredeterminadaId);
  const [comoPredeterminada, setComoPredeterminada] = useState(false);
  const [nueva, setNueva] = useState(!registrado);
  /* D51: la dirección también se cambia desde este paso (con confirmación; regresa a Método de envío). */
  const cambio = useCambioDireccion();
  /* Sitio: la tarjeta nueva empieza vacía (sin los datos de Figma), con el nombre del cliente como titular. */
  useEffect(() => {
    if (!modoFigma && nueva && pagoDetalle.tarjeta === TARJETA_FIGMA)
      setPagoDetalle({ ...pagoDetalle, tarjeta: { titular: registrado ? '' : cliente.nombre, numero: '', vigencia: '', cvv: '' } });
  }, [nueva]); // eslint-disable-line react-hooks/exhaustive-deps

  const tiendaElegida = forma === 'otras' && !!pagoDetalle.tiendaId && !modal;
  const tarjetaCompleta = modoFigma ? pagoDetalle.tarjeta.numero.replace(/\D/g, '').length >= 15 : tarjetaValida(pagoDetalle.tarjeta);
  const puede = forma === 'otras' ? tiendaElegida : nueva ? tarjetaCompleta : true;

  const continuar = () => {
    if (forma === 'otras') {
      setPago('tienda');
    } else {
      setPago('tarjeta');
      if (!nueva) {
        const t = TARJETAS_2026.find((x) => x.id === registrada) ?? TARJETAS_2026[2];
        if (comoPredeterminada) setTarjetaPredeterminada(t.id);
        setPagoDetalle({ ...pagoDetalle, forma: t.marca, tarjeta: { ...pagoDetalle.tarjeta, numero: `421589637412${t.terminacion}` } });
      } else {
        setPagoDetalle({ ...pagoDetalle, forma: pagoDetalle.tarjeta.numero.startsWith('5') ? 'mastercard' : 'visa' });
      }
    }
    conCarga('Revisando tu pedido', 'Preparamos la confirmación de tu pedido…', () => navigate('/checkout/confirmacion'), 900);
  };

  return (
    <CheckoutLayout
      paso={3}
      overlay={
        <>
        {cambio.modales}
        {modal && (
          <Modal
            titulo="Pago en tiendas de autoservicio"
            onClose={() => setModal(false)}
            acciones={
              <>
                <Button variant="outline" onClick={() => setModal(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setPagoDetalle({ ...pagoDetalle, forma: 'otras', tiendaId: tienda });
                    setModal(false);
                  }}
                >
                  Confirmar
                </Button>
              </>
            }
          >
            <TiendasAutoservicio seleccion={tienda} onSelect={setTienda} />
          </Modal>
        )}
        </>
      }
    >
      <CheckoutCard
        title="Método de pago"
        intro="Selecciona método de pago"
        actions={
          <>
            <Button variant="outline" onClick={() => (nueva && registrado ? setNueva(false) : navigate('/checkout/envio'))}>
              Regresar
            </Button>
            <Button disabled={!puede} onClick={continuar}>
              Continuar
            </Button>
          </>
        }
      >
        {!modoFigma && <BloqueDireccion onCambiar={cambio.cambiar} />}
        <FormasDePago2026
          valor={forma}
          onChange={(f) => {
            setForma(f);
            if (f === 'otras') setModal(true);
          }}
        />
        {forma === 'tarjetas' && !nueva && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            {TARJETAS_2026.map((t) => (
              <TarjetaGuardada key={t.id} tarjeta={t} seleccionada={registrada === t.id} onSelect={() => setRegistrada(t.id)} predeterminada={!modoFigma && t.id === tarjetaPredeterminadaId} />
            ))}
            {!modoFigma && registrada !== tarjetaPredeterminadaId && (
              <label className={`${styles.casilla} text-body-1-book`}>
                <input type="checkbox" checked={comoPredeterminada} onChange={(e) => setComoPredeterminada(e.target.checked)} />
                Usar esta tarjeta como predeterminada
              </label>
            )}
            <LinkButton mas onClick={() => setNueva(true)}>
              Añadir tarjeta
            </LinkButton>
          </div>
        )}
        {forma === 'tarjetas' && nueva && <CamposTarjeta sitio={!modoFigma} datos={pagoDetalle.tarjeta} onChange={(tarjeta) => setPagoDetalle({ ...pagoDetalle, tarjeta })} />}
        {forma === 'otras' && tiendaElegida && (
          <p className="text-os-body-1" style={{ margin: 0 }}>
            Pagarás en tienda de autoservicio. <LinkButton onClick={() => setModal(true)}>Cambiar tienda</LinkButton>
          </p>
        )}
      </CheckoutCard>
    </CheckoutLayout>
  );
}
