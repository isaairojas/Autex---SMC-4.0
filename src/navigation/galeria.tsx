/**
 * Galería Figma: una ruta por frame de Autex_2026_Frames (UKrGgTeW6ld3CpGOFErLXX, página 111:8).
 * Cada entrada fija el estado inicial para reproducir el frame tal cual y compararlo con su captura
 * (FIGMA_REPLICA.md §9). Los frames del archivo anterior (qp14Mbl7khZF2xWAwaocfP) quedaron reemplazados
 * el 2026-10-05; su registro está en docs/figma/.
 */
import type { ReactElement } from 'react';
import { CLIENTE_INVITADO } from '../mocks/clientes';
import { CARRITO_2026_CON_COSTO, CARRITO_MINI_FIGMA } from '../mocks/productos';
import { INICIAL_FIGMA, type Inicial } from '../state/DemoContext';
import { ModalLogin } from '../design-system/components/organisms/ModalLogin';
import { MiniCarrito } from '../design-system/components/organisms/Carrito';
import { Gracias } from '../screens/checkout/Gracias';
import { CarritoPagina } from '../screens/tienda/CarritoPagina';
import { Inicio } from '../screens/tienda/Inicio';
import { DatosUsuario } from '../screens/checkout/DatosUsuario';
import { MetodoEnvio } from '../screens/checkout/MetodoEnvio';
import { MetodoPago } from '../screens/checkout/MetodoPago';
import { Confirmacion } from '../screens/checkout/Confirmacion';

export type EntradaGaleria = {
  nodeId: string;
  nombre: string;
  flujo: string;
  inicial: Inicial;
  pantalla: ReactElement;
  /** El paso o la variante se dedujo del lienzo y falta confirmarlo contra el contenedor. */
  porConfirmar?: boolean;
};

const reg: Inicial = { ...INICIAL_FIGMA };
const regPago: Inicial = { ...reg, envio: 'domicilio', pago: 'tarjeta', pagoDetalle: { forma: 'visa' } };
const conCosto: Inicial = { ...reg, carrito: CARRITO_2026_CON_COSTO };
const conCostoPago: Inicial = { ...regPago, carrito: CARRITO_2026_CON_COSTO };
const nada = () => undefined;

const F1 = 'EF-46271 · Carrito y pasarela (cliente registrado)';
const F2 = 'EF-42837 · Ejemplo de envío sin costo';
const F3 = 'EF-42837 · Ejemplo de envío con costo';

/** Las capturas de Figma de componentes sueltos incluyen el margen de la sombra. */
const Margen = ({ x, y, children }: { x: number; y: number; children: ReactElement }) => (
  <div style={{ padding: `${y}px ${x}px`, background: 'var(--color-nativo-blanco)', width: 'fit-content' }}>{children}</div>
);

export const GALERIA: EntradaGaleria[] = [
  { nodeId: '657:14082', nombre: 'Autex_Catalogo_Stock_Cliente Registrado - 1', flujo: F1, inicial: reg, pantalla: <Inicio /> },
  {
    nodeId: '657:14102',
    nombre: 'Carrito/Default (mini-carrito)',
    flujo: F1,
    inicial: { ...reg, carrito: CARRITO_MINI_FIGMA },
    pantalla: (
      <Margen x={9} y={9}>
        <MiniCarrito
          incrustado
          lineas={CARRITO_MINI_FIGMA}
          skus={{}}
          estado={(id) => (id === 'faro-ai3922' ? 'bajo-pedido' : 'disponible')}
          onClose={nada}
          onEliminar={nada}
          onVerTodos={nada}
        />
      </Margen>
    ),
  },
  { nodeId: '673:18974', nombre: 'Autex_Carrito- 1', flujo: F1, inicial: reg, pantalla: <CarritoPagina /> },
  {
    nodeId: '742:19087',
    nombre: 'Modal login (vacío)',
    flujo: F1,
    inicial: reg, pantalla: <ModalLogin incrustado onClose={nada} onIngresar={nada} onInvitado={nada} /> },
  {
    nodeId: '742:19208',
    nombre: 'Modal login (con datos)',
    flujo: F1,
    inicial: reg,
    pantalla: (
      <Margen x={16} y={16}>
        <ModalLogin incrustado ancho={792} correoInicial="Ernesto Quiñones" claveInicial="**********" onClose={nada} onIngresar={nada} onInvitado={nada} />
      </Margen>
    ),
  },
  { nodeId: '677:18887', nombre: 'Autex - Checkout - 1', flujo: F1, inicial: reg, pantalla: <DatosUsuario /> },
  { nodeId: '719:22355', nombre: 'Autex - Checkout - 2', flujo: F1, inicial: reg, pantalla: <MetodoEnvio /> },
  { nodeId: '723:23455', nombre: 'Autex - Checkout - 3', flujo: F1, inicial: reg, pantalla: <MetodoPago /> },
  { nodeId: '738:17646', nombre: 'Autex - Checkout - 4', flujo: F1, inicial: regPago, pantalla: <Confirmacion /> },
  { nodeId: '904:34705', nombre: 'Content (gracias)', flujo: F1, inicial: regPago, pantalla: <Gracias soloContenido /> },
  { nodeId: '893:10681', nombre: 'Checkout - 1 (sin costo)', flujo: F2, inicial: reg, pantalla: <DatosUsuario /> },
  { nodeId: '893:10938', nombre: 'Checkout - 2 (sin costo)', flujo: F2, inicial: reg, pantalla: <MetodoEnvio /> },
  { nodeId: '893:11011', nombre: 'Checkout - 3 (sin costo)', flujo: F2, inicial: reg, pantalla: <MetodoPago /> },
  { nodeId: '893:11077', nombre: 'Checkout - 4 (sin costo)', flujo: F2, inicial: regPago, pantalla: <Confirmacion /> },
  { nodeId: '901:33560', nombre: 'Checkout - 1 (con costo)', flujo: F3, inicial: conCosto, pantalla: <DatosUsuario /> },
  { nodeId: '901:32141', nombre: 'Checkout - 2 (con costo)', flujo: F3, inicial: conCosto, pantalla: <MetodoEnvio /> },
  { nodeId: '901:32200', nombre: 'Checkout - 3 (con costo)', flujo: F3, inicial: conCosto, pantalla: <MetodoPago /> },
  { nodeId: '901:32266', nombre: 'Checkout - 4 (con costo)', flujo: F3, inicial: conCostoPago, pantalla: <Confirmacion /> },
  { nodeId: '902:34618', nombre: 'Content (gracias, con costo)', flujo: F3, inicial: conCostoPago, pantalla: <Gracias soloContenido /> },
];

export const slug = (nodeId: string) => nodeId.replace(':', '-');
export { CLIENTE_INVITADO };
