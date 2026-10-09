/**
 * Estado de la demo: cliente, ubicación (C.P./dirección), carrito, envío y pago.
 * Todos los datos son simulados (constitution, Principio V).
 */
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CARRITO_2026, formatoMXN, type EstadoExistencia, type LineaCarrito, type ModoEntrega, type Producto } from '../mocks/productos';
import { type Totales } from '../design-system/components/organisms/Resumen';
import type { DatosTarjeta, FormaSeleccionada } from '../design-system/components/organisms/FormaDePago';
import { esPedidoForaneo, estadoExistencia, existenciaEnTienda, maximoVenta } from '../mocks/existencias';
import { costoEnvio, TIENDAS_AUTOSERVICIO } from '../mocks/logistica';
import { CLIENTE_INVITADO, CLIENTES, DIRECCIONES_ENTREGA, UBICACION_FIGMA, type Cliente, type DireccionEntrega, type Ubicacion } from '../mocks/clientes';
import { coordenadas, tiendasCercanas, ubicacionDesdeCoordenadas, UBICACION_PREDETERMINADA, UBICACION_SIMULADA, ubicacionDeDireccion, type TiendaCercana, type UbicacionEntrega } from '../mocks/tiendas';
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
  /** D57: tienda de autoservicio donde se paga ("7-Eleven"). */
  tiendaPago?: string;
  /** D57: tienda donde se recoge lo que no va a domicilio ("Autex Colón"). */
  tiendaRecoge?: string;
  registrado: boolean;
  /** D51: datos del formulario del paso 1 (cliente, fiscales y dirección) para llenar el siguiente pedido. */
  datos?: Record<string, string>;
};

export type PagoDetalle = {
  forma: FormaSeleccionada;
  tarjeta: DatosTarjeta;
  tiendaId: string | null;
};

export const TARJETA_FIGMA: DatosTarjeta = { titular: 'Ernesto Quiñonez', numero: '4215896374124485', vigencia: '05/26', cvv: '***' };

/** D50: resultado del recálculo de un artículo al cambiar la dirección (ahora 0: sin existencia en la nueva ubicación). */
export type AjusteDireccion = { id: string; nombre: string; entrega: ModoEntrega; antes: number; ahora: number; tienda?: string };

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
  /** foranea (D44): bajo pedido porque la mayoría de las piezas sale de sucursales foráneas (puede demorar más). */
  disponibilidad: (productoId: string) => { ok: boolean; texto: string; estado: EstadoExistencia; foranea?: boolean };
  setCliente: (c: Cliente) => void;
  ingresar: (id: keyof typeof CLIENTES) => void;
  salir: () => void;
  setUbicacion: (u: Ubicacion) => void;
  abrirUbicacion: () => void;
  cerrarUbicacion: () => void;
  /**
   * Tienda elegida ("Mi tienda"); sin elección es la más cercana a la ubicación de entrega. D57 (reemplaza a D47):
   * elegir una tienda de otro estado ya no cambia la ubicación de entrega ni quita la dirección guardada.
   */
  tienda: TiendaCercana | null;
  /** Tiendas ordenadas por distancia a la ubicación de entrega, con su nivel de servicio. */
  tiendas: TiendaCercana[];
  setTienda: (id: string) => void;
  /** setTienda con la carga de página "Cambiando tu tienda". */
  elegirTienda: (id: string) => void;
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
  /** Sitio: cantidad escrita mayor a la existencia; recalcula con la carga "Validando existencias" y luego ajusta. */
  validarExistencias: (ajustar: () => void) => void;
  /** Direcciones de entrega guardadas (cliente registrado) y la elegida en "Entrega en" (null: C.P. suelto). */
  direcciones: DireccionEntrega[];
  direccion: DireccionEntrega | null;
  elegirDireccion: (id: string) => void;
  /**
   * D50: cambia la dirección de entrega del pedido (paso 2) y recalcula cada artículo con su opción: a domicilio con la
   * existencia en línea de la nueva ubicación y "Recoger en tienda" con la nueva "Mi tienda". Devuelve lo que cambió.
   */
  cambiarDireccionPedido: (id: string) => AjusteDireccion[];
  /** D51: igual que cambiarDireccionPedido con una dirección capturada en el formulario (invitado o registrado). */
  cambiarUbicacionPedido: (u: UbicacionEntrega) => AjusteDireccion[];
  /** D50/D51: resultado del último cambio de dirección en el checkout; Método de envío lo muestra. */
  ajusteDireccion: AjusteDireccion[] | null;
  setAjusteDireccion: (a: AjusteDireccion[] | null) => void;
  /** D53: paso más avanzado que el cliente ha abierto en este checkout (0 fuera del checkout); hasta ahí puede ir y volver. */
  pasoAlcanzado: number;
  setPasoAlcanzado: (n: number) => void;
  /** Dirección predeterminada: la que se usa al iniciar sesión ("Utilizar esta dirección como predeterminada"). */
  predeterminadaId: string | null;
  /** usar: la nueva dirección pasa a ser la de entrega aunque no sea la predeterminada (alta desde el checkout). */
  agregarDireccion: (d: Omit<DireccionEntrega, 'id'>, predeterminada: boolean, usar?: boolean) => void;
  eliminarDireccion: (id: string) => void;
  hacerPredeterminada: (id: string) => void;
  agregar: (p: Producto, cantidad?: number) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  /**
   * Sitio (D43): "Enviar a domicilio" o "Recoger en tienda" para un artículo. Recoger solo usa las existencias de
   * "Mi tienda": la cantidad se ajusta a sus piezas y, si no tiene, el artículo se queda a domicilio.
   */
  cambiarEntrega: (id: string, modo: ModoEntrega) => void;
  /** "Enviar todo a domicilio" / "Recoger todo en tienda" (solo la tienda seleccionada). */
  entregaMasiva: (modo: ModoEntrega) => void;
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
  /** D57: leyenda temporal (toast) arriba de la página; se quita sola. */
  avisoTemporal: string | null;
  mostrarAviso: (texto: string | null) => void;
  /** D57: tarjeta registrada predeterminada (la que se elige de inicio al pagar). */
  tarjetaPredeterminadaId: string;
  setTarjetaPredeterminada: (id: string) => void;
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
  const [ajusteDireccion, setAjusteDireccion] = useState<AjusteDireccion[] | null>(null);
  const [pasoAlcanzado, setPasoAlcanzado] = useState(0);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [ultimoPedido, setUltimoPedido] = useState<Pedido | null>(null);
  const [avisoTemporal, setAvisoTemporal] = useState<string | null>(null);
  const relojAviso = useRef<number>();
  const mostrarAviso = (texto: string | null) => {
    window.clearTimeout(relojAviso.current);
    setAvisoTemporal(texto);
    if (texto) relojAviso.current = window.setTimeout(() => setAvisoTemporal(null), 8000);
  };
  const [tarjetaPredeterminadaId, setTarjetaPredeterminada] = useState('visa-4485');
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

  /* D43: aplica un modo de entrega a una línea con las existencias de "Mi tienda" o de la compra en línea. */
  const ajustarEntrega = (l: LineaCarrito, modo: ModoEntrega): LineaCarrito => {
    const pz = (n: number) => (n === 1 ? '1 pieza disponible' : `${n} piezas disponibles`);
    if (modo === 'domicilio') {
      const n = maximoVenta(l.producto.id, ubicacion?.codigoPostal ?? null);
      if (n > 0 && l.cantidad > n) return { ...l, entrega: 'domicilio', cantidad: n, aviso: `Ajustamos la cantidad a ${pz(n)} para envío a domicilio.` };
      return { ...l, entrega: 'domicilio', aviso: undefined };
    }
    const n = tienda ? existenciaEnTienda(l.producto.id, tienda.id) : 0;
    const nombre = tienda ? `Autex ${tienda.nombre}` : 'tu tienda';
    if (!n) return { ...l, entrega: 'domicilio', aviso: `${nombre} no tiene este producto; se queda con envío a domicilio.` };
    if (l.cantidad > n) return { ...l, entrega: 'tienda', cantidad: n, aviso: `Ajustamos la cantidad a ${pz(n)} en ${nombre}.` };
    return { ...l, entrega: 'tienda', aviso: undefined };
  };
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

  /* D43/D57: si cambia "Mi tienda" o el C.P. de entrega (barra superior, mi ubicación o una dirección), se ajusta todo el
     carrito: lo que se recoge a las piezas de la nueva tienda (si no las tiene, pasa a domicilio) y lo que va a domicilio
     a la existencia en línea del nuevo C.P. Fuera del checkout, una leyenda temporal resume lo que cambió. */
  const claveUbicacion = `${tienda?.id ?? ''}|${ubicacion?.codigoPostal ?? ''}`;
  const ubicacionPrevia = useRef(claveUbicacion);
  /* D57: el cambio de dirección del checkout ya ajustó el carrito y da su propio aviso (p. ej. "Te regresamos al
     carrito…"); la leyenda general no debe reemplazarlo. */
  const cambioDelCheckout = useRef(false);
  useEffect(() => {
    if (ubicacionPrevia.current === claveUbicacion) return;
    ubicacionPrevia.current = claveUbicacion;
    const delCheckout = cambioDelCheckout.current;
    cambioDelCheckout.current = false;
    if (modoFigma || !carrito.length) return;
    const cp = ubicacion?.codigoPostal ?? null;
    let ajustados = 0;
    const nuevo = carrito.map((l) => {
      let r = ajustarEntrega(l, l.entrega === 'tienda' ? 'tienda' : 'domicilio');
      if (l.entrega === 'tienda' && r.entrega === 'domicilio') {
        const d = ajustarEntrega(r, 'domicilio');
        r = { ...d, aviso: [r.aviso, d.aviso].filter(Boolean).join(' ') };
      }
      if (r.cantidad !== l.cantidad || r.entrega !== (l.entrega ?? 'domicilio')) ajustados++;
      return r;
    });
    const sin = nuevo.filter((l) => l.entrega !== 'tienda' && maximoVenta(l.producto.id, cp) === 0).length;
    setCarrito(nuevo);
    if (delCheckout || window.location.pathname.includes('/checkout/') || (!ajustados && !sin)) return;
    const partes = [
      ajustados ? `${ajustados} ${ajustados === 1 ? 'artículo cambió' : 'artículos cambiaron'} de cantidad o de entrega` : '',
      sin ? `${sin} sin existencia` : '',
    ].filter(Boolean);
    mostrarAviso(`Actualizamos tu carrito con las existencias de tu nueva ubicación: ${partes.join(' y ')}.`);
  }, [claveUbicacion]); // eslint-disable-line react-hooks/exhaustive-deps

  /* D57: tope de una línea: lo que se recoge no supera las piezas de "Mi tienda" ni lo que va a domicilio la existencia en línea. */
  const topeLinea = (l: LineaCarrito): LineaCarrito => {
    if (modoFigma) return l;
    const r = ajustarEntrega(l, l.entrega === 'tienda' ? 'tienda' : 'domicilio');
    return r.cantidad < l.cantidad ? r : { ...l, aviso: undefined };
  };

  /**
   * D50: recalcula cada artículo para una nueva ubicación de entrega con su opción: a domicilio contra la existencia en
   * línea del nuevo C.P. y "Recoger en tienda" contra la nueva "Mi tienda" (la más cercana); si la tienda no lo tiene,
   * pasa a domicilio. Sin piezas se conserva la cantidad: el artículo queda "sin existencia" y bloquea el pago.
   */
  const recalcularPara = (u: UbicacionEntrega) => {
    const nuevaTienda = tiendasCercanas(coordenadas(u) ?? u)[0] ?? null;
    const ajustes: AjusteDireccion[] = [];
    const nuevo = carrito.map((l): LineaCarrito => {
      const base = { id: l.producto.id, nombre: l.producto.nombre, antes: l.cantidad };
      if (l.entrega === 'tienda') {
        const n = nuevaTienda ? existenciaEnTienda(l.producto.id, nuevaTienda.id) : 0;
        const tiendaNombre = nuevaTienda ? `Autex ${nuevaTienda.nombre}` : undefined;
        if (n >= l.cantidad) return { ...l, aviso: undefined };
        if (n > 0) {
          ajustes.push({ ...base, entrega: 'tienda', ahora: n, tienda: tiendaNombre });
          return { ...l, cantidad: n, aviso: undefined };
        }
        const m = maximoVenta(l.producto.id, u.codigoPostal);
        ajustes.push({ ...base, entrega: 'domicilio', ahora: Math.min(m, l.cantidad), tienda: tiendaNombre });
        return { ...l, entrega: 'domicilio', cantidad: m > 0 ? Math.min(m, l.cantidad) : l.cantidad, aviso: undefined };
      }
      const m = maximoVenta(l.producto.id, u.codigoPostal);
      if (m >= l.cantidad) return { ...l, aviso: undefined };
      ajustes.push({ ...base, entrega: 'domicilio', ahora: m });
      return { ...l, cantidad: m > 0 ? m : l.cantidad, aviso: undefined };
    });
    return { ajustes, nuevo };
  };

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
        /* D43: lo que se recoge depende solo de las piezas de "Mi tienda". */
        if (!modoFigma && linea?.entrega === 'tienda') {
          const ok = !!tienda && existenciaEnTienda(id, tienda.id) >= linea.cantidad;
          return ok ? { ok, texto: 'Disponible para recoger en tienda', estado: 'disponible' } : { ok, texto: 'Sin existencia en tu tienda', estado: 'sin-existencia' };
        }
        const estado: EstadoExistencia = modoFigma || !ubicacion
          ? linea?.producto.estadoFigma ?? 'disponible'
          : estadoExistencia(id, ubicacion.codigoPostal, linea?.cantidad ?? 1);
        if (estado === 'disponible') return { ok: true, texto: 'Disponible', estado };
        if (estado === 'bajo-pedido')
          return { ok: true, texto: 'Disponible bajo pedido', estado, foranea: !modoFigma && !!ubicacion && esPedidoForaneo(id, ubicacion.codigoPostal, linea?.cantidad ?? 1) };
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
      /* D57 (reemplaza a D47): la tienda solo cambia dónde se recoge; la entrega y la dirección guardada se conservan. */
      setTienda: (id) => {
        setTiendaId(id);
        setPanel(null);
      },
      elegirTienda: (id) => {
        setPanel(null);
        value.conCarga('Cambiando tu tienda', 'Consultamos las existencias de la sucursal…', () => value.setTienda(id));
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
      validarExistencias: (ajustar) => value.conCarga('Validando existencias', 'Recalculamos las piezas disponibles para compra en línea…', ajustar, 900),
      direcciones,
      direccion,
      elegirDireccion: (id) => {
        const d = direcciones.find((x) => x.id === id);
        if (d) usarDireccion(d);
      },
      cambiarDireccionPedido: (id) => {
        const d = direcciones.find((x) => x.id === id);
        if (!d) return [];
        const { ajustes, nuevo } = recalcularPara(ubicacionDeDireccion(d));
        cambioDelCheckout.current = true;
        usarDireccion(d);
        setCarrito(nuevo);
        return ajustes;
      },
      cambiarUbicacionPedido: (u) => {
        const { ajustes, nuevo } = recalcularPara(u);
        cambioDelCheckout.current = true;
        setUbicacionState(u);
        setDireccionId(null);
        setTiendaId(null);
        setCarrito(nuevo);
        return ajustes;
      },
      ajusteDireccion,
      setAjusteDireccion,
      pasoAlcanzado,
      setPasoAlcanzado,
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
        const actual = carrito.find((l) => l.producto.id === p.id);
        if (!actual) return setCarrito((c) => [...c, { producto: p, cantidad }]);
        /* D57: si se recoge en tienda, la suma no pasa de las piezas de "Mi tienda" (y a domicilio, de la existencia en línea). */
        const linea = topeLinea({ ...actual, cantidad: actual.cantidad + cantidad });
        if (linea.cantidad < actual.cantidad + cantidad) mostrarAviso(linea.aviso ?? null);
        setCarrito((c) => c.map((l) => (l.producto.id === p.id ? linea : l)));
      },
      cambiarCantidad: (id, cantidad) =>
        setCarrito((c) => c.map((l) => (l.producto.id === id ? { ...l, cantidad: Math.max(1, cantidad), aviso: undefined } : l))),
      cambiarEntrega: (id, modo) => setCarrito((c) => c.map((l) => (l.producto.id === id ? ajustarEntrega(l, modo) : l))),
      entregaMasiva: (modo) => setCarrito((c) => c.map((l) => ajustarEntrega(l, modo))),
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
          articulos: carrito.map((l) => `${l.cantidad} × ${l.producto.nombre}${l.entrega === 'tienda' && tienda ? ` (recoger en Autex ${tienda.nombre})` : ''}`),
          /* D57: la dirección solo si algo va a domicilio; si algo se recoge, la tienda. */
          direccion: carrito.some((l) => l.entrega !== 'tienda') ? envioDetalle.direccion ?? '' : '',
          tiendaRecoge: carrito.some((l) => l.entrega === 'tienda') && tienda ? `Autex ${tienda.nombre}` : undefined,
          enTienda: pago === 'tienda',
          tiendaPago: pago === 'tienda' ? TIENDAS_AUTOSERVICIO.flat().find((x) => x.id === pagoDetalle.tiendaId)?.nombre : undefined,
          registrado: cliente.tipo !== 'invitado',
          datos: borradorInvitado ?? undefined,
        };
        setPedidos((l) => [pedido, ...l]);
        setAjusteDireccion(null);
        setPasoAlcanzado(0);
        setUltimoPedido(pedido);
        setCarrito([]);
        setEnvio(null);
        setPago(null);
        setEnvioDetalle((d) => ({ ...d, direccion: undefined }));
        setPagoDetalle((d) => ({ ...d, forma: null }));
      },
      avisoTemporal,
      mostrarAviso,
      tarjetaPredeterminadaId,
      setTarjetaPredeterminada,
    };
  }, [avisoTemporal, tarjetaPredeterminadaId,modoFigma, cliente, ubicacion, carrito, envio, pago, envioDetalle, pagoDetalle, ubicacionAbierta, miniAbierto, guardados, login, tienda, tiendas, panel, avisoTienda, ubicacionInicial, permiso, avisoNavegador, vehiculos, vehiculo, vehiculosAbierto, cargando, direcciones, direccion, predeterminadaId, direccionId, borradorInvitado, pedidos, ultimoPedido, numeroPedido, ajusteDireccion, pasoAlcanzado]);

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
