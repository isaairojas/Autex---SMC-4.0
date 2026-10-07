/**
 * Estado de la demo: cliente, ubicación (C.P./dirección), carrito, envío y pago.
 * Todos los datos son simulados (constitution, Principio V).
 */
import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { CARRITO_2026, formatoMXN, type EstadoExistencia, type LineaCarrito, type Producto } from '../mocks/productos';
import { type Totales } from '../design-system/components/organisms/Resumen';
import type { DatosTarjeta, FormaSeleccionada } from '../design-system/components/organisms/FormaDePago';
import { estadoExistencia } from '../mocks/existencias';
import { costoEnvio } from '../mocks/logistica';
import { CLIENTE_INVITADO, CLIENTES, DIRECCIONES_ENTREGA, UBICACION_FIGMA, type Cliente, type DireccionEntrega, type Ubicacion } from '../mocks/clientes';
import { coordenadas, tiendasCercanas, ubicacionDesdeCoordenadas, UBICACION_PREDETERMINADA, UBICACION_SIMULADA, ubicacionDeDireccion, type TiendaCercana } from '../mocks/tiendas';
import { idVehiculo, type Vehiculo } from '../mocks/vehiculos';

export type MetodoEnvio = 'sucursal' | 'domicilio' | null;
export type MetodoPago = 'tarjeta' | 'tienda' | 'credito' | null;
/** Paneles de la barra de ubicación (sin respaldo en Figma): "Selecciona una tienda" y "Ubicación de entrega". */
export type PanelUbicacion = 'tienda' | 'entrega' | 'cuenta' | null;
/** Respuestas del aviso de ubicación del navegador (simulado en la demo). */
export type RespuestaPermiso = 'mientras' | 'una-vez' | 'nunca' | 'cerrar';
export type EstadoPermiso = 'pendiente' | 'concedido' | 'denegado' | 'cerrado';
export type ResultadoUbicacion = 'ok' | 'nunca' | 'cerrado';

/** direccion: dirección de entrega elegida en el paso 1 (Autex_2026_Frames 901:31850). */
export type EnvioDetalle = { sucursalId: string | null; paqueteriaId: string | null; direccion?: string };
/** Pedido terminado (sin respaldo en Figma, D42): se lista en "Mis pedidos" y alimenta la página de gracias. */
export type Pedido = {
  numero: string;
  fecha: string;
  total: string;
  piezas: number;
  articulos: string[];
  direccion: string;
  enTienda: boolean;
  registrado: boolean;
};

export type PagoDetalle = {
  forma: FormaSeleccionada;
  tarjeta: DatosTarjeta;
  tiendaId: string | null;
};

export const TARJETA_FIGMA: DatosTarjeta = { titular: 'Ernesto Quiñonez', numero: '4215896374124485', vigencia: '05/26', cvv: '***' };

type DemoState = {
  /** true: se muestran los textos y totales literales de Figma. */
  modoFigma: boolean;
  cliente: Cliente;
  ubicacion: Ubicacion | null;
  carrito: LineaCarrito[];
  totales: Totales;
  envio: MetodoEnvio;
  pago: MetodoPago;
  envioDetalle: EnvioDetalle;
  pagoDetalle: PagoDetalle;
  setEnvioDetalle: (d: EnvioDetalle) => void;
  setPagoDetalle: (d: PagoDetalle) => void;
  ubicacionAbierta: boolean;
  miniAbierto: boolean;
  /** Modal login (742:19087). destino: ruta a la que se sigue al ingresar o continuar como invitado. */
  login: { abierto: boolean; destino: string | null };
  abrirLogin: (destino?: string | null) => void;
  cerrarLogin: () => void;
  cerrarMini: () => void;
  abrirMini: () => void;
  /** Disponibilidad simulada de un producto según el C.P. elegido. */
  disponibilidad: (productoId: string) => { ok: boolean; texto: string; estado: EstadoExistencia };
  setCliente: (c: Cliente) => void;
  ingresar: (id: keyof typeof CLIENTES) => void;
  salir: () => void;
  setUbicacion: (u: Ubicacion) => void;
  abrirUbicacion: () => void;
  cerrarUbicacion: () => void;
  /** Tienda elegida ("Mi tienda"); sin elección es la más cercana a la ubicación de entrega. */
  tienda: TiendaCercana | null;
  /** Tiendas ordenadas por distancia a la ubicación de entrega, con su nivel de servicio. */
  tiendas: TiendaCercana[];
  setTienda: (id: string) => void;
  panel: PanelUbicacion;
  abrirPanel: (p: PanelUbicacion) => void;
  /** Aviso propio de Autex "Elige una tienda" (cuando el navegador no da la ubicación). */
  avisoTienda: boolean;
  setAvisoTienda: (v: boolean) => void;
  /**
   * Pide la ubicación: si el permiso está pendiente o el aviso se cerró, vuelve a mostrar el aviso simulado del
   * navegador; con "No permitir nunca" ya no lo muestra (como Chrome). Al permitirlo, carga de página completa
   * mientras se ubica la tienda más cercana (D36).
   * 'ok': se obtuvo; 'nunca': eligió "No permitir nunca" (o ya estaba bloqueado); 'cerrado': cerró el aviso.
   */
  usarMiUbicacion: () => Promise<ResultadoUbicacion>;
  permiso: EstadoPermiso;
  /** Aviso simulado del navegador "www.autex.com.mx quiere · Conocer tu ubicación". */
  avisoNavegador: boolean;
  responderPermiso: (r: RespuestaPermiso) => void;
  /** "Mis vehículos": lista y vehículo con el que se navega (null: navegar sin vehículo). */
  vehiculos: Vehiculo[];
  vehiculo: Vehiculo | null;
  agregarVehiculo: (v: Omit<Vehiculo, 'id'>) => void;
  activarVehiculo: (id: string | null) => void;
  vehiculosAbierto: boolean;
  setVehiculosAbierto: (v: boolean) => void;
  /** Ventana de carga del sitio (D36): checkout, cambio de tienda, de C.P. o de dirección. */
  cargando: { titulo: string; texto: string } | null;
  /** Muestra la carga, espera y ejecuta la acción (en la galería la ejecuta de inmediato). */
  conCarga: (titulo: string, texto: string, accion: () => void, ms?: number) => void;
  /** Direcciones de entrega guardadas (cliente registrado) y la elegida en "Entrega en" (null: C.P. suelto). */
  direcciones: DireccionEntrega[];
  direccion: DireccionEntrega | null;
  elegirDireccion: (id: string) => void;
  /** Dirección predeterminada: la que se usa al iniciar sesión ("Utilizar esta dirección como predeterminada"). */
  predeterminadaId: string | null;
  /** usar: la nueva dirección pasa a ser la de entrega aunque no sea la predeterminada (alta desde el checkout). */
  agregarDireccion: (d: Omit<DireccionEntrega, 'id'>, predeterminada: boolean, usar?: boolean) => void;
  eliminarDireccion: (id: string) => void;
  hacerPredeterminada: (id: string) => void;
  agregar: (p: Producto, cantidad?: number) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  quitar: (id: string) => void;
  /** "Guardar para más tarde" (668:18478): saca la línea del carrito y la deja en guardados. */
  guardados: LineaCarrito[];
  guardar: (id: string) => void;
  moverAlCarrito: (id: string) => void;
  setEnvio: (m: MetodoEnvio) => void;
  setPago: (m: MetodoPago) => void;
  reiniciar: () => void;
  /** Formulario del invitado (D40): se conserva al regresar del paso 2 al paso 1. */
  borradorInvitado: Record<string, string> | null;
  /** Número del pedido en curso ("#0001087 - 24" en Figma; consecutivo en el sitio). */
  numeroPedido: string;
  pedidos: Pedido[];
  ultimoPedido: Pedido | null;
  /** Al pagar: guarda el pedido y deja carrito, envío y pago listos para la siguiente compra. */
  registrarPedido: () => void;
  setBorradorInvitado: (d: Record<string, string> | null) => void;
};

const Ctx = createContext<DemoState | null>(null);

export type Inicial = {
  modoFigma?: boolean;
  cliente?: Cliente;
  ubicacion?: Ubicacion | null;
  carrito?: LineaCarrito[];
  envio?: MetodoEnvio;
  pago?: MetodoPago;
  envioDetalle?: EnvioDetalle;
  pagoDetalle?: Partial<PagoDetalle>;
};

/** Estado de la galería: carrito y cliente registrado de Autex_2026_Frames. */
export const INICIAL_FIGMA: Inicial = { modoFigma: true, cliente: CLIENTES.b2c, ubicacion: UBICACION_FIGMA, carrito: CARRITO_2026 };

export function DemoProvider({ children, inicial = {} }: { children: ReactNode; inicial?: Inicial }) {
  const [cliente, setCliente] = useState<Cliente>(inicial.cliente ?? CLIENTE_INVITADO);
  /* Sin C.P. elegido, la demo usa el 45138 (Tesistán, Zapopan); la galería de Figma conserva su estado. */
  const [ubicacion, setUbicacionState] = useState<Ubicacion | null>(inicial.ubicacion !== undefined ? inicial.ubicacion : inicial.modoFigma ? null : UBICACION_PREDETERMINADA);
  const [carrito, setCarrito] = useState<LineaCarrito[]>(inicial.carrito ?? []);
  const [envio, setEnvio] = useState<MetodoEnvio>(inicial.envio ?? null);
  const [pago, setPago] = useState<MetodoPago>(inicial.pago ?? null);
  const [envioDetalle, setEnvioDetalle] = useState<EnvioDetalle>(inicial.envioDetalle ?? { sucursalId: 'adolf-horn', paqueteriaId: 'pe' });
  const [pagoDetalle, setPagoDetalle] = useState<PagoDetalle>({ forma: null, tarjeta: TARJETA_FIGMA, tiendaId: 'oxxo', ...inicial.pagoDetalle });
  const [miniAbierto, setMiniAbierto] = useState(false);
  const [guardados, setGuardados] = useState<LineaCarrito[]>([]);
  const [login, setLogin] = useState<{ abierto: boolean; destino: string | null }>({ abierto: false, destino: null });
  const [tiendaId, setTiendaId] = useState<string | null>(null);
  const [panel, setPanel] = useState<PanelUbicacion>(null);
  const [avisoTienda, setAvisoTienda] = useState(false);
  const [permiso, setPermiso] = useState<EstadoPermiso>('pendiente');
  const [avisoNavegador, setAvisoNavegador] = useState(false);
  const respuesta = useRef<((r: RespuestaPermiso) => void) | null>(null);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [vehiculoId, setVehiculoId] = useState<string | null>(null);
  const [vehiculosAbierto, setVehiculosAbierto] = useState(false);
  const [cargando, setCargando] = useState<{ titulo: string; texto: string } | null>(null);
  const [borradorInvitado, setBorradorInvitado] = useState<Record<string, string> | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [ultimoPedido, setUltimoPedido] = useState<Pedido | null>(null);
  const vehiculo = vehiculos.find((v) => v.id === vehiculoId) ?? null;
  const [direcciones, setDirecciones] = useState<DireccionEntrega[]>(DIRECCIONES_ENTREGA);
  const [direccionId, setDireccionId] = useState<string | null>(null);
  const [predeterminadaId, setPredeterminadaId] = useState<string | null>(DIRECCIONES_ENTREGA[0]?.id ?? null);
  const direccion = cliente.tipo === 'invitado' ? null : direcciones.find((d) => d.id === direccionId) ?? null;
  const usarDireccion = (d: DireccionEntrega) => {
    setDireccionId(d.id);
    setUbicacionState(ubicacionDeDireccion(d));
    setTiendaId(null);
  };
  const modoFigma = !!inicial.modoFigma;
  /* Figma: "#0001087 - 24"; en el sitio cada compra toma el siguiente número. */
  const numeroPedido = `#${String(1087 + pedidos.length).padStart(7, '0')} - 24`;
  const ubicacionInicial = modoFigma ? null : UBICACION_PREDETERMINADA;
  const ubicacionAbierta = panel === 'entrega';

  /* Distancias a las tiendas desde la ubicación de entrega (coordenadas propias o las de su C.P.). */
  const tiendas = useMemo(() => {
    const u = ubicacion && coordenadas(ubicacion);
    return u ? tiendasCercanas(u) : [];
  }, [ubicacion]);
  const tienda = tiendas.find((t) => t.id === tiendaId) ?? tiendas[0] ?? null;

  const value = useMemo<DemoState>(() => {
    const subtotal = carrito.reduce((s, l) => s + l.producto.precio * l.cantidad, 0);
    /* Sitio (D35): sin costo de envío en todo el checkout; la galería conserva los totales de Figma. */
    const envioCosto = carrito.length && modoFigma ? costoEnvio(subtotal) : 0;
    const totales: Totales = { subtotal: formatoMXN(subtotal), envio: formatoMXN(envioCosto), cupon: formatoMXN(0), total: formatoMXN(subtotal + envioCosto) };
    return {
      modoFigma,
      cliente,
      ubicacion,
      carrito,
      totales,
      envio,
      pago,
      envioDetalle,
      pagoDetalle,
      setEnvioDetalle,
      setPagoDetalle,
      ubicacionAbierta,
      miniAbierto,
      login,
      abrirLogin: (destino = null) => setLogin({ abierto: true, destino }),
      cerrarLogin: () => setLogin({ abierto: false, destino: null }),
      cerrarMini: () => setMiniAbierto(false),
      abrirMini: () => setMiniAbierto(true),
      disponibilidad: (id) => {
        const linea = carrito.find((l) => l.producto.id === id);
        const estado: EstadoExistencia = modoFigma || !ubicacion
          ? linea?.producto.estadoFigma ?? 'disponible'
          : estadoExistencia(id, ubicacion.codigoPostal, linea?.cantidad ?? 1);
        if (estado === 'disponible') return { ok: true, texto: 'Disponible', estado };
        if (estado === 'bajo-pedido') return { ok: true, texto: 'Disponible bajo pedido', estado };
        return { ok: false, texto: 'Sin existencia en tu zona', estado };
      },
      setCliente,
      ingresar: (id) => {
        setCliente(CLIENTES[id]);
        /* Al iniciar sesión, la entrega pasa a la dirección predeterminada del cliente (fuera de la galería). */
        const pred = direcciones.find((d) => d.id === predeterminadaId) ?? direcciones[0];
        if (!modoFigma && pred) usarDireccion(pred);
      },
      salir: () => {
        setCliente(CLIENTE_INVITADO);
        setDireccionId(null);
        setPanel(null);
        setBorradorInvitado(null);
      },
      setUbicacion: (u) => {
        setUbicacionState(u);
        setDireccionId(null);
        /* Al cambiar la entrega, "Mi tienda" vuelve a ser la más cercana. */
        setTiendaId(null);
        setPanel(null);
      },
      abrirUbicacion: () => setPanel('entrega'),
      cerrarUbicacion: () => setPanel(null),
      tienda,
      tiendas,
      setTienda: (id) => {
        setTiendaId(id);
        setPanel(null);
      },
      panel,
      abrirPanel: setPanel,
      avisoTienda,
      setAvisoTienda,
      usarMiUbicacion: async () => {
        if (permiso === 'denegado') return 'nunca';
        if (permiso !== 'concedido') {
          const r = await new Promise<RespuestaPermiso>((resolve) => {
            respuesta.current = resolve;
            setAvisoNavegador(true);
          });
          if (r === 'nunca') return 'nunca';
          if (r === 'cerrar') return 'cerrado';
        }
        /* Carga de página completa mientras se ubica la tienda más cercana. */
        if (!modoFigma) setCargando({ titulo: 'Ubicando tu tienda más cercana', texto: '' });
        const [u] = await Promise.all([localizar(), new Promise((r) => window.setTimeout(r, modoFigma ? 0 : 1100))]);
        setUbicacionState(u);
        setDireccionId(null);
        setTiendaId(null);
        setCargando(null);
        return 'ok';
      },
      permiso,
      avisoNavegador,
      responderPermiso: (r) => {
        setAvisoNavegador(false);
        setPermiso(r === 'nunca' ? 'denegado' : r === 'cerrar' ? 'cerrado' : 'concedido');
        respuesta.current?.(r);
        respuesta.current = null;
      },
      vehiculos,
      vehiculo,
      agregarVehiculo: (v) => {
        const id = idVehiculo(v);
        setVehiculos((l) => (l.some((x) => x.id === id) ? l : [...l, { ...v, id }]));
        setVehiculoId(id);
      },
      activarVehiculo: setVehiculoId,
      vehiculosAbierto,
      setVehiculosAbierto,
      cargando,
      conCarga: (titulo, texto, accion, ms = 1100) => {
        if (modoFigma) return accion();
        setCargando({ titulo, texto });
        window.setTimeout(() => {
          accion();
          setCargando(null);
        }, ms);
      },
      direcciones,
      direccion,
      elegirDireccion: (id) => {
        const d = direcciones.find((x) => x.id === id);
        if (d) usarDireccion(d);
      },
      predeterminadaId,
      agregarDireccion: (d, predeterminada, usar = false) => {
        const nueva = { ...d, id: `dir-${Date.now()}` };
        setDirecciones((l) => [...l, nueva]);
        /* La primera dirección o la marcada como predeterminada pasa a ser la de entrega. */
        if (predeterminada || !direcciones.length) setPredeterminadaId(nueva.id);
        if (predeterminada || usar || !direcciones.length) usarDireccion(nueva);
      },
      eliminarDireccion: (id) => {
        const restantes = direcciones.filter((d) => d.id !== id);
        setDirecciones(restantes);
        const nuevaPred = predeterminadaId === id ? restantes[0]?.id ?? null : predeterminadaId;
        setPredeterminadaId(nuevaPred);
        /* Si se elimina la dirección de entrega activa, la entrega pasa a la predeterminada (o al C.P. inicial). */
        if (direccionId === id) {
          const otra = restantes.find((d) => d.id === nuevaPred);
          if (otra) usarDireccion(otra);
          else {
            setDireccionId(null);
            setUbicacionState(UBICACION_PREDETERMINADA);
            setTiendaId(null);
          }
        }
      },
      hacerPredeterminada: setPredeterminadaId,
      agregar: (p, cantidad = 1) => {
        setMiniAbierto(true);
        setCarrito((c) => {
          const i = c.findIndex((l) => l.producto.id === p.id);
          if (i < 0) return [...c, { producto: p, cantidad }];
          return c.map((l, j) => (j === i ? { ...l, cantidad: l.cantidad + cantidad } : l));
        });
      },
      cambiarCantidad: (id, cantidad) =>
        setCarrito((c) => c.map((l) => (l.producto.id === id ? { ...l, cantidad: Math.max(1, cantidad) } : l))),
      quitar: (id) => setCarrito((c) => c.filter((l) => l.producto.id !== id)),
      guardados,
      guardar: (id) => {
        const linea = carrito.find((l) => l.producto.id === id);
        if (!linea) return;
        setCarrito((c) => c.filter((l) => l.producto.id !== id));
        setGuardados((g) => [...g, linea]);
      },
      moverAlCarrito: (id) => {
        const linea = guardados.find((l) => l.producto.id === id);
        if (!linea) return;
        setGuardados((g) => g.filter((l) => l.producto.id !== id));
        /* Si el producto ya volvió al carrito, se suman las piezas en la misma línea. */
        setCarrito((c) => (c.some((l) => l.producto.id === id) ? c.map((l) => (l.producto.id === id ? { ...l, cantidad: l.cantidad + linea.cantidad } : l)) : [...c, linea]));
      },
      setEnvio,
      setPago,
      /* Después de comprar: carrito, envío y pago nuevos. El cliente registrado conserva su sesión y su entrega;
         el invitado vuelve a empezar (datos y C.P. inicial). */
      reiniciar: () => {
        if (cliente.tipo === 'invitado') {
          setCliente(CLIENTE_INVITADO);
          setUbicacionState(ubicacionInicial);
          setTiendaId(null);
          setBorradorInvitado(null);
        }
        setCarrito([]);
        setEnvio(null);
        setPago(null);
        setEnvioDetalle((d) => ({ ...d, direccion: undefined }));
        setPagoDetalle((d) => ({ ...d, forma: null }));
      },
      borradorInvitado,
      setBorradorInvitado,
      numeroPedido,
      pedidos,
      ultimoPedido,
      registrarPedido: () => {
        if (modoFigma) return;
        const pedido: Pedido = {
          numero: numeroPedido,
          fecha: new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
          total: totales.total,
          piezas: carrito.reduce((n, l) => n + l.cantidad, 0),
          articulos: carrito.map((l) => `${l.cantidad} × ${l.producto.nombre}`),
          direccion: envioDetalle.direccion ?? '',
          enTienda: pago === 'tienda',
          registrado: cliente.tipo !== 'invitado',
        };
        setPedidos((l) => [pedido, ...l]);
        setUltimoPedido(pedido);
        setCarrito([]);
        setEnvio(null);
        setPago(null);
        setEnvioDetalle((d) => ({ ...d, direccion: undefined }));
        setPagoDetalle((d) => ({ ...d, forma: null }));
      },
    };
  }, [modoFigma, cliente, ubicacion, carrito, envio, pago, envioDetalle, pagoDetalle, ubicacionAbierta, miniAbierto, guardados, login, tienda, tiendas, panel, avisoTienda, ubicacionInicial, permiso, avisoNavegador, vehiculos, vehiculo, vehiculosAbierto, cargando, direcciones, direccion, predeterminadaId, direccionId, borradorInvitado, pedidos, ultimoPedido, numeroPedido]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * Ubicación al permitir el aviso simulado: la real si el navegador ya tiene permiso para el sitio (sin volver a
 * preguntar); si no, una ubicación simulada en el centro de Guadalajara.
 */
async function localizar() {
  const real = await navigator.permissions
    ?.query({ name: 'geolocation' })
    .then((p) => p.state === 'granted')
    .catch(() => false);
  if (!real) return UBICACION_SIMULADA;
  return new Promise<typeof UBICACION_SIMULADA>((resolve) =>
    navigator.geolocation.getCurrentPosition(
      (p) => resolve(ubicacionDesdeCoordenadas(p.coords.latitude, p.coords.longitude)),
      () => resolve(UBICACION_SIMULADA),
      { timeout: 10000, maximumAge: 300000 },
    ),
  );
}

export function useDemo(): DemoState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useDemo debe usarse dentro de DemoProvider');
  return v;
}
