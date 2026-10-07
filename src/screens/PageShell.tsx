/**
 * Marco común de todas las pantallas de escritorio: Navbar Desktop (225) + contenido + Footer (531).
 * Ancho fijo de 1920 px, igual que los frames de Figma. Aloja los overlays globales:
 * selección de ubicación (sin respaldo en Figma, D5) y mini-carrito (1029:30142). En la demo (no en la galería):
 * aviso simulado del navegador, "Elige una tienda", paneles de entrega y tienda y "Mis vehículos" (D31).
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../design-system/components/organisms/Navbar';
import { Navbar2026 } from '../design-system/components/organisms/Navbar2026';
import { Footer } from '../design-system/components/organisms/Footer';
import { Ubicacion } from '../design-system/components/organisms/Ubicacion';
import { MiniCarrito } from '../design-system/components/organisms/Carrito';
import { CargaPagina } from '../design-system/components/molecules/CargaPagina';
import { ModalLogin } from '../design-system/components/organisms/ModalLogin';
import { AvisoTienda, PanelEntrega, PanelTienda, PermisoNavegador, type Posicion } from '../design-system/components/organisms/UbicacionTienda';
import { MisVehiculos } from '../design-system/components/organisms/MisVehiculos';
import { nombreVehiculo } from '../mocks/vehiculos';
import { estadoHorario } from '../mocks/tiendas';
import styles from '../design-system/components/organisms/UbicacionTienda.module.css';
import { CATALOGO_SITIO } from '../mocks/catalogo';
import { useDemo } from '../state/DemoContext';

const SKUS = Object.fromEntries(CATALOGO_SITIO.map((p) => [p.id, p.skuVisible]));

/** Ancho de diseño: los frames de Figma miden 1920 px. */
const ANCHO = 1920;

/**
 * Página adaptativa al zoom (sin respaldo en Figma, D37): si la ventana es más angosta que 1920 px (zoom in o
 * pantalla chica) la página se escala para caber completa, sin scroll horizontal; con zoom out queda centrada.
 */
function useEscala() {
  const medir = () => Math.min(1, document.documentElement.clientWidth / ANCHO);
  const [escala, setEscala] = useState(medir);
  useEffect(() => {
    const alCambiar = () => setEscala(medir());
    window.addEventListener('resize', alCambiar);
    return () => window.removeEventListener('resize', alCambiar);
  }, []);
  return escala;
}

type PageShellProps = {
  children: ReactNode;
  /**
   * Cabecera y pie del archivo Autex_2026_Frames: "Head" 606:13261 + Footer 491 (catálogo, carrito, paso 1).
   * Los pasos 2–4 de ese archivo siguen usando "Navbar / Completed" y el Footer de 531 (variante clásica).
   */
  version2026?: boolean;
  /** Enlace activo de la Navbar 2026. */
  enlaceActivo?: 'Inicio' | 'Catálogo' | 'Marcas' | 'Promociones' | null;
};

export function PageShell({ children, version2026 = false, enlaceActivo = 'Catálogo' }: PageShellProps) {
  const navigate = useNavigate();
  const demo = useDemo();
  const { ubicacion, cliente, carrito, abrirUbicacion, ubicacionAbierta, cerrarUbicacion, setUbicacion, miniAbierto, cerrarMini, abrirMini, quitar } = demo;
  const piezas = carrito.reduce((n, l) => n + l.cantidad, 0);
  /* Sitio (no galería): el chip de ubicación del navbar muestra "Mi tienda" y a su lado "Entrega en C.P.". */
  const sitio = !demo.modoFigma;
  const { tienda, panel, abrirPanel } = demo;
  /* Cada panel se abre bajo su chip del navbar ("Mi tienda" o "Entrega en"). */
  const marco = useRef<HTMLDivElement>(null);
  const escala = useEscala();
  const [posicion, setPosicion] = useState<Posicion>();
  useLayoutEffect(() => {
    const m = marco.current?.getBoundingClientRect();
    const ancla = panel && marco.current?.querySelector(`[data-ancla=${panel === 'cuenta' ? 'usuario' : panel}]`)?.getBoundingClientRect();
    if (!m || !ancla) return setPosicion(undefined);
    const ancho = panel === 'entrega' ? (cliente.tipo === 'invitado' ? 400 : 460) : panel === 'cuenta' ? 220 : 440;
    /* Las medidas del navegador ya vienen escaladas; el panel se posiciona en px de diseño. */
    const k = m.width / ANCHO || 1;
    setPosicion({ left: Math.min((ancla.left - m.left) / k, ANCHO - 80 - ancho), top: (ancla.bottom - m.top) / k + 8 });
  }, [panel, cliente.tipo, escala]);
  const manual = () => {
    /* Primero el C.P. de entrega; con él se muestran las tiendas de ese estado. */
    demo.setAvisoTienda(false);
    abrirPanel('entrega');
  };
  return (
    <div ref={marco} style={{ width: ANCHO, margin: '0 auto', background: 'var(--color-nativo-blanco)', position: 'relative', zoom: escala, ['--escala' as string]: escala }}>
      {version2026 ? (
        <Navbar2026
          /* En la galería se muestran los textos literales del Head 2026 (I673:18975;606:13284, badge "99+"). */
          ubicacion={demo.modoFigma ? 'Calz. del Federalismo N' : tienda ? `Autex ${tienda.nombre}` : 'Elige tu tienda'}
          ubicacionDetalle={sitio ? (tienda ? estadoHorario(tienda.horario).corto : 'Código postal o dirección') : ubicacion ? ubicacion.detalle : 'Código postal o dirección'}
          onUbicacionClick={() => (sitio ? abrirPanel(panel === 'tienda' ? null : 'tienda') : abrirUbicacion())}
          usuario={cliente.tipo === 'invitado' ? null : cliente.nombre}
          empresa={cliente.tipo === 'invitado' ? undefined : cliente.empresa}
          /* Con sesión, el menú de la cuenta de autex.com.mx: Mi perfil, Mis pedidos, Salir. */
          onUsuarioClick={() => (cliente.tipo === 'invitado' ? demo.abrirLogin() : sitio ? abrirPanel(panel === 'cuenta' ? null : 'cuenta') : undefined)}
          carrito={demo.modoFigma ? 100 : piezas}
          onCarritoClick={() => (miniAbierto ? cerrarMini() : abrirMini())}
          activo={enlaceActivo}
          sitio={!demo.modoFigma}
          vehiculo={sitio ? (demo.vehiculo ? nombreVehiculo(demo.vehiculo) : null) : undefined}
          onVehiculoClick={() => sitio && demo.setVehiculosAbierto(true)}
          /* Registrado con dirección guardada: "Entrega en C.P." y el nombre de la dirección; si no, solo el C.P. */
          entrega={sitio ? (demo.direccion ? demo.direccion.nombre : ubicacion?.codigoPostal ?? 'C.P.') : undefined}
          entregaTitulo={demo.direccion ? `Entrega en ${demo.direccion.codigoPostal}` : undefined}
          onEntregaClick={() => abrirPanel(panel === 'entrega' ? null : 'entrega')}
        />
      ) : (
      <Navbar
        ubicacion={ubicacion ? ubicacion.etiqueta : 'Elige tu ubicación'}
        ubicacionDetalle={ubicacion ? ubicacion.detalle : 'Código postal o dirección'}
        onUbicacionClick={abrirUbicacion}
        usuario={cliente.tipo === 'invitado' ? null : cliente.nombre}
        logueado={cliente.tipo === 'b2c'}
        b2b={cliente.tipo === 'b2b'}
        empresa={cliente.empresa}
        onUsuarioClick={() => (cliente.tipo === 'invitado' ? demo.abrirLogin() : undefined)}
        carrito={demo.modoFigma ? 100 : piezas}
        onCarritoClick={() => (miniAbierto ? cerrarMini() : abrirMini())}
      />
      )}
      {children}
      <Footer version2026={version2026} />
      {miniAbierto && (
        <MiniCarrito
          lineas={carrito}
          skus={SKUS}
          estado={(id) => demo.disponibilidad(id).estado}
          onClose={cerrarMini}
          onEliminar={quitar}
          onVerTodos={() => {
            cerrarMini();
            navigate('/carrito');
          }}
        />
      )}
      {demo.login.abierto && (
        <ModalLogin
          onClose={demo.cerrarLogin}
          onIngresar={() => {
            const destino = demo.login.destino;
            demo.ingresar('b2c');
            demo.cerrarLogin();
            /* Al ingresar desde el carrito, el cliente registrado salta al paso 2 (D35); sin direcciones, al paso 1. */
            if (destino && sitio && destino === '/checkout/datos')
              demo.conCarga('Preparando tu pedido', 'Calculamos los envíos para tu dirección de entrega…', () => navigate(demo.direcciones.length ? '/checkout/envio' : '/checkout/datos'));
            else if (destino) navigate(destino);
          }}
          onInvitado={() => {
            const destino = demo.login.destino;
            demo.cerrarLogin();
            if (destino) demo.conCarga('Preparando tu pedido', 'Un momento, estamos preparando tu compra…', () => navigate(destino), 800);
          }}
        />
      )}
      {!sitio && ubicacionAbierta && <Ubicacion actual={ubicacion} onClose={cerrarUbicacion} onConfirmar={setUbicacion} />}
      {sitio && panel && <div className={styles.capa} onClick={() => abrirPanel(null)} />}
      {sitio && panel === 'entrega' && (
        <PanelEntrega
          posicion={posicion ?? { left: 1920 - 80 - 400, top: 160 }}
          actual={ubicacion}
          invitado={cliente.tipo === 'invitado'}
          direcciones={demo.direcciones}
          direccionId={demo.direccion?.id ?? null}
          onElegirDireccion={(id) => {
            abrirPanel(null);
            /* Con la dirección elegida se muestran las tiendas de su estado. */
            demo.conCarga('Actualizando tu ubicación', 'Buscamos las tiendas y los tiempos de entrega de tu zona…', () => {
              demo.elegirDireccion(id);
              abrirPanel('tienda');
            });
          }}
          predeterminadaId={demo.predeterminadaId}
          onNuevaDireccion={() => {
            abrirPanel(null);
            navigate('/configuracion/direcciones/nueva');
          }}
          onAdministrar={() => {
            abrirPanel(null);
            navigate('/configuracion/direcciones');
          }}
          onActualizar={(u) => {
            abrirPanel(null);
            /* Con el nuevo C.P. se muestran las tiendas de esa dirección. */
            demo.conCarga('Actualizando tu ubicación', 'Buscamos las tiendas y los tiempos de entrega de tu zona…', () => {
              setUbicacion(u);
              abrirPanel('tienda');
            });
          }}
          onUsarMiUbicacion={async () => {
            const ok = (await demo.usarMiUbicacion()) === 'ok';
            if (ok) abrirPanel('tienda');
            return ok;
          }}
          onIniciarSesion={() => {
            abrirPanel(null);
            demo.abrirLogin();
          }}
          onClose={() => abrirPanel(null)}
        />
      )}
      {sitio && panel === 'cuenta' && (
        <nav className={styles.menuCuenta} style={posicion} aria-label="Mi cuenta">
          {[
            ['Mi perfil', '/configuracion/perfil'],
            ['Mis pedidos', '/configuracion/pedidos'],
          ].map(([t, ruta]) => (
            <button key={t} type="button" className="text-body-1-book" onClick={() => { abrirPanel(null); navigate(ruta); }}>
              {t}
            </button>
          ))}
          <button
            type="button"
            className="text-body-1-book"
            onClick={() => {
              abrirPanel(null);
              /* Como el sitio: al salir se vuelve al inicio (la cuenta y el checkout del registrado ya no aplican). */
              demo.conCarga('Cerrando sesión', '', () => {
                demo.salir();
                navigate('/');
              }, 700);
            }}
          >
            Salir
          </button>
        </nav>
      )}
      {sitio && panel === 'tienda' && (
        <PanelTienda
          posicion={posicion ?? { left: 1920 - 80 - 440, top: 160 }}
          tiendas={demo.tiendas}
          actual={tienda}
          estado={ubicacion?.estado ?? null}
          codigoPostal={ubicacion?.codigoPostal ?? null}
          onSeleccionar={(id) => {
            demo.elegirTienda(id);
          }}
          onCambiarEntrega={() => abrirPanel('entrega')}
          onClose={() => abrirPanel(null)}
        />
      )}
      {sitio && demo.avisoTienda && (
        <AvisoTienda
          bloqueado={demo.permiso === 'denegado'}
          onManual={manual}
          onUsarMiUbicacion={async () => {
            const ok = (await demo.usarMiUbicacion()) === 'ok';
            if (ok) demo.setAvisoTienda(false);
            return ok;
          }}
          onClose={() => demo.setAvisoTienda(false)}
        />
      )}
      {sitio && demo.vehiculosAbierto && (
        <MisVehiculos
          vehiculos={demo.vehiculos}
          activo={demo.vehiculo}
          invitado={cliente.tipo === 'invitado'}
          onAgregar={demo.agregarVehiculo}
          onActivar={demo.activarVehiculo}
          onIngresar={() => {
            demo.setVehiculosAbierto(false);
            demo.abrirLogin();
          }}
          onClose={() => demo.setVehiculosAbierto(false)}
        />
      )}
      {sitio && demo.avisoNavegador && <PermisoNavegador onResponder={demo.responderPermiso} />}
      {sitio && demo.cargando && <CargaPagina texto={demo.cargando.titulo} />}
    </div>
  );
}
