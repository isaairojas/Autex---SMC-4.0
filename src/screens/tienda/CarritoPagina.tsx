/**
 * Figma (Autex_2026_Frames): Autex_Carrito- 1 (673:18974)
 * URL: https://www.figma.com/design/UKrGgTeW6ld3CpGOFErLXX/?node-id=673-18974
 * Head (225) · Frame 4534607 (673:20283, y=245, fondo gris) con productos agrupados por existencia SMC 4.0
 * (disponibles / bajo pedido), Subtotal y Resumen · Content_Saved items (668:18472, y=1175) · Footer 491.
 * Reemplaza a la página de carrito "sin respaldo" (D5) del archivo anterior.
 * Sitio (sin respaldo en Figma, D43): cada artículo se envía a domicilio o se recoge en "Mi tienda" (con sus
 * existencias); en la columna derecha, "Método de entrega" para todo el pedido y "Zona de entrega".
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
import { etiquetaExistencia, existenciaEnLinea, existenciaEnTienda, maximoVenta } from '../../mocks/existencias';
import { estadoHorario, zonaEntrega } from '../../mocks/tiendas';
import { ColumnaCarrito, MetodoEntregaCarrito, RecoleccionCarrito, SelectorEntrega, ZonaEntregaCarrito } from '../../design-system/components/organisms/EntregaCarrito';
import type { ModoEntrega } from '../../mocks/productos';
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
  /* Sitio (D39/D43): la cantidad no supera las piezas para compra en línea del C.P. o, si se recoge, las de "Mi tienda". */
  const cp = ubicacion?.codigoPostal ?? null;
  const { tienda } = demo;
  const enTienda = (id: string) => (tienda ? existenciaEnTienda(id, tienda.id) : 0);
  const recoge = (id: string) => carrito.find((l) => l.producto.id === id)?.entrega === 'tienda';
  const maximo = (id: string) => (modoFigma ? undefined : recoge(id) ? enTienda(id) : maximoVenta(id, cp));
  const nombreTienda = tienda ? `Autex ${tienda.nombre}` : 'tu tienda';
  /* Cambiar la entrega recalcula existencias: carga de página como en el sitio. */
  const cambiarEntrega = (id: string, modo: ModoEntrega) =>
    demo.conCarga(modo === 'tienda' ? 'Calculando disponibilidad en tienda' : 'Calculando disponibilidad para envío', '', () => demo.cambiarEntrega(id, modo), 900);
  const entregaMasiva = (modo: ModoEntrega) =>
    demo.conCarga(modo === 'tienda' ? 'Calculando disponibilidad en tienda' : 'Calculando disponibilidad para envío', '', () => demo.entregaMasiva(modo), 900);
  const modos = new Set(carrito.map((l) => l.entrega ?? 'domicilio'));
  const todos: ModoEntrega | null = modos.size === 1 ? [...modos][0] : null;
  /* Los paneles de tienda y C.P. se abren bajo su botón del navbar. */
  const abrirArriba = (panel: 'tienda' | 'entrega') => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    demo.abrirPanel(panel);
  };

  const tarjeta = ({ linea, estado }: (typeof conEstado)[number]) => (
    <CardProductoCarrito
      key={linea.producto.id}
      linea={linea}
      estado={estado}
      maximo={estado === 'sin-existencia' ? undefined : maximo(linea.producto.id)}
      entrega={
        modoFigma ? undefined : (
          <SelectorEntrega
            modo={linea.entrega ?? 'domicilio'}
            enLinea={etiquetaExistencia(existenciaEnLinea(linea.producto.id, cp))}
            enTienda={enTienda(linea.producto.id)}
            tienda={nombreTienda}
            aviso={linea.aviso}
            foranea={disponibilidad(linea.producto.id).foranea}
            onCambiar={(modo) => cambiarEntrega(linea.producto.id, modo)}
          />
        )
      }
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
        {modoFigma ? (
          <ResumenCarrito titulo="Subtotal (3 productos)" total="$0.00" onPagar={pagar} deshabilitado={bloqueado && !!ubicacion} />
        ) : (
          <ColumnaCarrito>
            {carrito.length > 0 && (
              <MetodoEntregaCarrito todos={todos} tienda={nombreTienda} puedeRecoger={carrito.some((l) => enTienda(l.producto.id) > 0)} onTodo={entregaMasiva} />
            )}
            {/* D44: secciones separadas según cómo se recibe: a domicilio (zona) y/o en tienda (sucursal). */}
            {ubicacion && (carrito.length === 0 || carrito.some((l) => l.entrega !== 'tienda')) && (
              <ZonaEntregaCarrito zona={zonaEntrega(ubicacion)} codigoPostal={ubicacion.codigoPostal} onCambiar={() => abrirArriba('entrega')} />
            )}
            {tienda && carrito.some((l) => l.entrega === 'tienda') && (
              <RecoleccionCarrito
                tienda={{ nombre: nombreTienda, direccion: tienda.direccion, horario: estadoHorario(tienda.horario).corto }}
                onCambiar={() => abrirArriba('tienda')}
              />
            )}
            <ResumenCarrito titulo={`Subtotal (${piezas} productos)`} total={formatoMXN(subtotal)} onPagar={pagar} deshabilitado={bloqueado && !!ubicacion} />
          </ColumnaCarrito>
        )}
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
