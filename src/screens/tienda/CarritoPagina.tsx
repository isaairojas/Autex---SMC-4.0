/**
 * Figma (Autex_2026_Frames): Autex_Carrito- 1 (673:18974)
 * URL: https://www.figma.com/design/UKrGgTeW6ld3CpGOFErLXX/?node-id=673-18974
 * Head (225) · Frame 4534607 (673:20283, y=245, fondo gris) con productos agrupados por existencia SMC 4.0
 * (disponibles / bajo pedido), Subtotal y Resumen · Content_Saved items (668:18472, y=1175) · Footer 491.
 * Reemplaza a la página de carrito "sin respaldo" (D5) del archivo anterior.
 * Última sincronización: 2026-10-05
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/atoms/Button';
import {
  CardProductoCarrito,
  GrupoCarrito,
  ProductosGuardados,
  ResumenCarrito,
  SubtotalCarrito,
} from '../../design-system/components/organisms/CarritoCompra';
import { maximoVenta } from '../../mocks/existencias';
import { formatoMXN } from '../../mocks/productos';
import { useDemo } from '../../state/DemoContext';
import { PageShell } from '../PageShell';
import { ComoContinuar } from '../../design-system/components/organisms/ComoContinuar';
import styles from './CarritoPagina.module.css';

export function CarritoPagina() {
  const navigate = useNavigate();
  const demo = useDemo();
  const { carrito, cambiarCantidad, quitar, disponibilidad, ubicacion, abrirUbicacion, modoFigma, guardados, guardar, moverAlCarrito, cliente, abrirLogin } = demo;
  const [comoContinuar, setComoContinuarState] = useState(false);
  /* El modal se dibuja arriba de la página: al abrirlo se sube para que quede a la vista. */
  const setComoContinuar = (v: boolean) => {
    if (v) window.scrollTo({ top: 0, behavior: 'smooth' });
    setComoContinuarState(v);
  };
  const conEstado = carrito.map((l) => ({ linea: l, estado: disponibilidad(l.producto.id).estado }));
  const disponibles = conEstado.filter((x) => x.estado === 'disponible');
  const bajoPedido = conEstado.filter((x) => x.estado === 'bajo-pedido');
  /* Sin existencia: va a "caja gris" (spec 001, FR-009); se muestra al final y bloquea el pago. */
  const sinExistencia = conEstado.filter((x) => x.estado === 'sin-existencia');
  const subtotal = carrito.reduce((s, l) => s + l.producto.precio * l.cantidad, 0);
  const piezas = carrito.reduce((n, l) => n + l.cantidad, 0);
  const bloqueado = carrito.length === 0 || !ubicacion || sinExistencia.length > 0;
  /* Invitado: "Proceder al pago" abre el Modal login (742:19087); desde ahí ingresa o continúa como invitado. */
  /* Registrado (sitio, D35): ya tiene dirección predeterminada, así que pasa directo al paso 2 "Método de envío". */
  const pagar = () =>
    !ubicacion
      ? abrirUbicacion()
      : cliente.tipo === 'invitado'
        ? /* Sitio (D40): "¿Cómo deseas continuar?"; la galería abre el Modal login de Figma. */
          modoFigma
          ? abrirLogin('/checkout/datos')
          : setComoContinuar(true)
        : modoFigma
          ? navigate('/checkout/datos')
          : /* Sin direcciones guardadas: paso 1 para añadir una. */
            demo.conCarga('Preparando tu pedido', 'Calculamos los envíos para tu dirección de entrega…', () => navigate(demo.direcciones.length ? '/checkout/envio' : '/checkout/datos'));
  /* Sitio (D39): la cantidad no supera las piezas para compra en línea del C.P. de entrega. */
  const maximo = (id: string) => (modoFigma ? undefined : maximoVenta(id, ubicacion?.codigoPostal ?? null));

  const tarjeta = ({ linea, estado }: (typeof conEstado)[number]) => (
    <CardProductoCarrito
      key={linea.producto.id}
      linea={linea}
      estado={estado}
      maximo={estado === 'sin-existencia' ? undefined : maximo(linea.producto.id)}
      onCantidad={(n) => (n < 1 ? quitar(linea.producto.id) : cambiarCantidad(linea.producto.id, Math.min(n, maximo(linea.producto.id) ?? n)))}
      onEliminar={() => quitar(linea.producto.id)}
      onGuardar={() => guardar(linea.producto.id)}
    />
  );

  return (
    <PageShell version2026>
      <div className={styles.seccion}>
        <div className={styles.lista}>
          {carrito.length === 0 && (
            <div className={styles.vacio}>
              <p className="text-os-titulo-28">Tu carrito está vacío</p>
              <Button onClick={() => navigate('/')}>Continuar comprando</Button>
            </div>
          )}
          {disponibles.length > 0 && <GrupoCarrito estado="disponible" cantidad={disponibles.length} />}
          {disponibles.map(tarjeta)}
          {bajoPedido.length > 0 && <GrupoCarrito estado="bajo-pedido" cantidad={bajoPedido.length} />}
          {bajoPedido.map(tarjeta)}
          {sinExistencia.length > 0 && (
            <p className={`${styles.sinExistencia} text-os-subheadline`}>
              Sin existencia en tu zona ({sinExistencia.length}). Elimínalos o guárdalos para continuar.
            </p>
          )}
          {sinExistencia.map(tarjeta)}
          {carrito.length > 0 && (
            <SubtotalCarrito
              piezas={modoFigma ? carrito.length : piezas}
              total={subtotal}
              onSeguir={() => navigate('/')}
              onPagar={pagar}
              pagarDeshabilitado={bloqueado && !!ubicacion}
            />
          )}
        </div>
        <ResumenCarrito
          titulo={modoFigma ? 'Subtotal (3 productos)' : `Subtotal (${piezas} productos)`}
          total={modoFigma ? '$0.00' : formatoMXN(subtotal)}
          onPagar={pagar}
          deshabilitado={bloqueado && !!ubicacion}
        />
      </div>
      <div className={styles.guardados}>
        <ProductosGuardados guardados={guardados} onMover={moverAlCarrito} contador={modoFigma ? 1 : guardados.length} />
      </div>
      {comoContinuar && (
        <ComoContinuar
          onClose={() => setComoContinuar(false)}
          onAceptar={(modo) => {
            setComoContinuar(false);
            /* Invitado: formulario de datos; con cuenta: iniciar sesión y, ya registrado, directo al paso 2. */
            if (modo === 'invitado') demo.conCarga('Preparando tu pedido', '', () => navigate('/checkout/datos'), 800);
            else abrirLogin('/checkout/datos');
          }}
        />
      )}
    </PageShell>
  );
}
