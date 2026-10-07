# Sistema de diseño — réplica de Autex_2026_Frames

Fuente de verdad: Figma `UKrGgTeW6ld3CpGOFErLXX` (página 111:8 "Carrito y Pasarela de pago"), desde el 2026-10-05.
Mapa nodo ↔ código: [`docs/figma-2026/figma-map.json`](../figma-2026/figma-map.json). El archivo anterior (`qp14Mbl7khZF2xWAwaocfP`) queda como historial en `docs/figma/`.

## Cómo ejecutar

```bash
npm install
npm run dev          # http://localhost:5173 (la verificación usa --port 5179)
npm run build
```

- Demo (flujo real): `/` → producto → carrito → `/checkout/...` → `/checkout/gracias`.
- Galería Figma (cada frame con su estado fijo): `/figma`.
- Verificación visual: `node tests/visual/compare-all.mjs` (requiere el servidor en el puerto 5179).
- Flujo de punta a punta: `node tests/e2e-flujo.mjs`.

## Tokens (`src/design-system/tokens/`)

| Grupo | Contenido |
|---|---|
| Color | Primary 50–800, Secondary 500/600/700, Neutral 50–900, Green 50/700, Red 50/600/900, Blue 500, blancos, negro, Alpha/Back Alpha 300 (negro 16 %) |
| Tipografía | 12 estilos de Figma (`.text-heading-1-book` … `.text-caption-book`) + valores sueltos (`.text-heading-3-strong`, `.text-headline-medium`, `.text-os-*` para Open Sans) |
| Fuentes | Archivo (sustituye a HeadingNow, D1/D6), Open Sans e Inter (las mismas de Figma), Material Icons (los íconos de Figma son glifos de esta fuente) |
| Sombra | `--shadow-blur-base-00` |
| Layout | Pantalla de 1920 px, contenido de checkout en 80 px de margen |

Reglas:
- Usar siempre `var(--color-…)` y las clases `text-*`. Los valores sin variable en Figma llevan comentario `/* figma: <nodeId> */`.
- Los trazos de Figma son "inside": se implementan con `box-shadow: inset 0 0 0 Npx` para no sumar altura.
- `global.css` (tokens) se importa antes que los CSS Modules para que los ajustes de cada componente tengan prioridad.

## Componentes (`src/design-system/components/`)

| Nivel | Componente | Figma |
|---|---|---|
| Átomo | `Icon` | glifos Material Icons |
| Átomo | `Button` (primary/outline/text) | 2596:98482, 2596:98483 |
| Átomo | `TextField` (texto/selector) | Field Label 127:64412 |
| Átomo | `Radio` (medium/small) | 4973:32818 |
| Átomo | `LinkButton` | 2600:105558 |
| Átomo | `ProductThumb` | miniaturas con capas |
| Molécula | `Breadcrumbs` | 111:36109 |
| Molécula | `Stepper` | Step 3795:63969 |
| Molécula | `OpcionSeleccionable` | Option Sucursal 2596:100531 |
| Molécula | `MetodoEnvioRow` | 2596:99046 |
| Molécula | `Tabs` | 2596:99607 |
| Molécula | `Toast` | 2596:99563 |
| Molécula | `ConfirmacionBloque` | 2599:98351 |
| Organismo | `Navbar` (invitado/registrado/B2B) | 2617:106675, 2617:102447 |
| Organismo | `Footer` | 38:98638 |
| Organismo | `CheckoutCard` | Container 599:48146 |
| Organismo | `Resumen` | 2596:98511 |
| Organismo | `Modal`, `AlertDialogError`, `AlertDialogCarga` | 2599:100517, 2599:99468, 2599:98962 |
| Organismo | `SeleccionSucursal` | 2599:100618 |
| Organismo | `SelectorFormaDePago`, `CamposTarjeta` | 2599:97065, 2599:97130 |
| Organismo | `TarjetasRegistradas`, `TarjetaCredito`, `MiBalance` | 2600:106506, 2600:119037 |
| Organismo | `TiendasAutoservicio` | 2599:104115 |
| Organismo | `TicketTienda` | 949:84894 |
| Organismo | `ProductCard`, `Filtros`, `BuscadorVehiculo` | 12849:114195, 12849:114191, 12849:114189 |
| Organismo | `ItemKart`, `MiniCarrito` | 3527:121767, 1029:30142 |
| Organismo | `Ubicacion` | **sin respaldo en Figma** (D5) |
| Organismo | `Navbar2026` | Head 606:13261 (2026) |
| Organismo | `CarritoCompra` (CardProductoCarrito, GrupoCarrito, SubtotalCarrito, ResumenCarrito, ProductosGuardados, ChipBajoPedido, EstadoExistencia) | 673:20283, 668:18472 (2026) |
| Organismo | `ModalLogin` | 742:19087 / 742:19208 (2026) |
| Organismo | `Pago2026` (FormasDePago2026, TarjetaGuardada) | 725:24122, 725:24099 (2026) |
| Organismo | `TarjetaProducto`, `Filtros2026` | Product I657:14098, 657:14087 (2026) |
| Molécula | `EnvioPaqueteria` | 898:31778 / 904:34781 (2026) |

## Pantallas (`src/screens/`)

| Pantalla | Frames de Figma (Autex_2026_Frames) |
|---|---|
| `tienda/Inicio` | 657:14082 |
| `tienda/CarritoPagina` | 673:18974 |
| `tienda/DetalleProducto` | sin frame 2026 (se conserva 12849:113500 del archivo anterior) |
| `checkout/DatosUsuario` | 677:18887, 893:10681, 901:33560 |
| `checkout/MetodoEnvio` | 719:22355, 893:10938, 901:32141 |
| `checkout/MetodoPago` | 723:23455, 893:11011, 901:32200 |
| `checkout/Confirmacion` | 738:17646, 893:11077, 901:32266 |
| `checkout/Gracias` | 904:34705, 902:34618 |

## Datos

Todo es simulado (constitution, Principio V): `src/mocks/` (productos, catálogo, clientes, logística, existencias).
`mocks/existencias.ts` contiene la red de sucursales, existencias por sucursal y la distancia de Haversine,
punto de partida para el cálculo de SMC 4.0 que define la spec `001-smc4-demo-sucursales`.
