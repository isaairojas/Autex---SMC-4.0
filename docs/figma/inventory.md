# Inventario Figma — FE_Autex_B2C_Editable (escritorio)

- Archivo: `qp14Mbl7khZF2xWAwaocfP` · Generado: 2026-10-02 · Fase F0
- Plataforma: **Escritorio** (todos los frames de la página son de 1920 px de ancho).
- Estado: aprobado (2026-10-02); F1–F7 completas (2026-10-05).

## Páginas

| Página | nodeId | Decisión |
|---|---|---|
| Pasarela de compra | 32:309 | **Incluir** (página indicada en la URL) |
| Local components | 1086:26165 | Incluir **solo** los componentes que use el checkout |
| Locofy (Prueba) | 12848:22335 | Incluir **solo** las pantallas de escritorio (inicio y detalle de producto) |

## Alcance ampliado (2026-10-02): flujo previo al checkout

Pedido por el usuario: dirección/C.P. → agregar mercancía → checkout, con y sin cliente registrado.

| Pantalla / componente | nodeId | Tamaño | Página | Uso |
|---|---|---|---|---|
| New Home Autex - Cuadricula | 12849:114186 | 1920×4196 | Locofy | Inicio con productos en cuadrícula ("Add to cart") |
| New Home Autex - Lista | 12849:114238 | 1920×4196 | Locofy | Inicio con productos en lista |
| Producto - Detalle - Especificaciones | 12849:113500 | 1920×3404 | Locofy | Detalle de producto |
| Carrito items-notificacion | 1029:30142 | 430×912 | Local components | Mini-carrito al agregar mercancía |
| ItemKart | 3527:121768 | — | Local components | Partidas del carrito |
| Head (logueado / no logueado) | 1074:37407 | 1920×225 | Local components | Cabecera con indicador de ubicación |
| Inicio de sesión (Email/Google/Facebook) | 2371:29872, 1986:44456, 1986:42570 | — | Local components | Cliente registrado (simulado) |
| Crear cuenta - Autex | 1986:45350 | 672×376 | Local components | Nuevo usuario |
| Selección de dirección / C.P. | — | — | **No existe** | Se arma con componentes existentes; "sin respaldo en Figma" (D5) |
| Página de carrito completa | — | — | **No existe** | Se arma con `ItemKart` + `Resumen`; "sin respaldo en Figma" (D5) |

Las pantallas móviles de la página Locofy (12849:117305, 12849:139135, 12849:139191) se ignoran.

## Estructura común de cada pantalla (1920×2414)

Todas las pantallas comparten el mismo esqueleto, de arriba a abajo:

| Bloque | Tipo | Tamaño | Notas |
|---|---|---|---|
| `Navbar / Completed` o `Navbar Desktop` | frame / instancia | 1920×225 | Barra de promo + logo + buscador + ubicación + menú. Frame 2599:99861 mide 1920×277 (discrepancia) |
| `Content` (breadcrumbs) | instancia | 1920×52 | Volver · Checkout · paso actual |
| `Section` | frame | 1920×1606 | Encabezado "Pago del pedido #…", stepper de 4 pasos, formulario + "Detalle de pedido" + "Resumen de productos" |
| `Footer` | instancia | 1920×531 | Logo, enlaces, contacto, métodos de pago, redes |
| `Modal` / `Dialog alert` | frame | 1920×2353–2414 | Solo en algunas pantallas (overlay) |

Stepper del checkout: **1 Datos del usuario → 2 Método de envío → 3 Método de pago → 4 Confirmación**.

## Página: Pasarela de compra — 32:309 — Incluir

La columna "Paso" se deduce del nombre; se confirmará con el screenshot de cada frame en F4.

| # | Frame | nodeId | Tamaño | Tipo | Flujo | Paso | Overlay | Estado |
|---|---|---|---|---|---|---|---|---|
| 1 | Checkout - Invitado - Direccion | 397:35700 | 1920×2414 | Pantalla | Invitado | 1 Datos (verificado por screenshot) | — | Pendiente |
| 2 | Checkout - Nuevo usuario | 1324:97509 | 1920×2414 | Pantalla | Nuevo usuario | 1 Datos | — | Pendiente |
| 3 | Checkout - Invitado - A domicilio | 1324:96920 | 1920×2414 | Pantalla | Invitado · domicilio | 2 Envío | — | Pendiente |
| 4 | Checkout - A domiciolio - 02 | 135:67668 | 1920×2414 | Pantalla | Domicilio | 2 Envío | — | Pendiente |
| 5 | Checkout - Invitado - Seleccionar sucursal | 128:64284 | 1920×2414 | Pantalla | Invitado · sucursal | 2 Envío | — | Pendiente |
| 6 | Checkout - Invitado - Seleccionar sucursal - Sucursales - Estados | 2596:99063 | 1920×2414 | Pantalla | Invitado · sucursal | 2 Envío | — | Pendiente |
| 7 | Checkout - Invitado - Seleccionar sucursal - Edo seleccionado y tiendas | 2596:99874 | 1920×2414 | Pantalla | Invitado · sucursal | 2 Envío | — | Pendiente |
| 8 | Checkout - Invitado - Editar metodo de envio | 2599:99538 | 1920×2414 | Pantalla + modal | Invitado | 2 Envío | Modal 2599:100516 | Pendiente |
| 9 | Autex - Checkout - Domicilio | 482:82975 | 1920×2414 | Pantalla | Domicilio | Por confirmar | — | Pendiente |
| 10 | Autex - Checkout - Domicilio | 482:83129 | 1920×2414 | Pantalla | Domicilio | Por confirmar | — | Pendiente |
| 11 | Checkout - B2C - Sucursal | 463:119933 | 1920×2414 | Pantalla | B2C · sucursal | Por confirmar | — | Pendiente |
| 12 | Checkout - B2C - Sucursal | 463:120909 | 1920×2414 | Pantalla | B2C · sucursal | Por confirmar | — | Pendiente |
| 13 | Checkout - B2C - Sucursal | 463:121566 | 1920×2414 | Pantalla | B2C · sucursal | Por confirmar | — | Pendiente |
| 14 | Checkout - B2C - Sucursal | 463:122330 | 1920×2414 | Pantalla | B2C · sucursal | Por confirmar | — | Pendiente |
| 15 | Checkout - B2C - Sucursal | 2600:108075 | 1920×2414 | Pantalla | B2C · sucursal | Por confirmar | — | Pendiente |
| 16 | Checkout - B2B - Sucursal | 2600:116100 | 1920×2414 | Pantalla | B2B · sucursal | Por confirmar | — | Pendiente |
| 17 | Checkout - B2B - Sucursal | 2600:116276 | 1920×2414 | Pantalla | B2B · sucursal | Por confirmar | — | Pendiente |
| 18 | Checkout - B2B - Sucursal | 2600:116409 | 1920×2414 | Pantalla | B2B · sucursal | Por confirmar | — | Pendiente |
| 19 | Checkout - Invitado - Sucursal Metodo de pago | 129:66134 | 1920×2414 | Pantalla | Invitado · sucursal | 3 Pago | — | Pendiente |
| 20 | Checkout - A domiciolio - 03 | 136:68850 | 1920×2414 | Pantalla | Domicilio | 3 Pago | — | Pendiente |
| 21 | Checkout - A domiciolio - 9 | 2599:103603 | 1920×2414 | Pantalla + modal | Domicilio | 3 Pago | Modal wrapped 2599:104101 | Pendiente |
| 22 | Checkout - Invitado - Editar metodo de pago | 2599:101632 | 1920×2414 | Pantalla + modal | Invitado | 3 Pago | Modal 2599:101788 | Pendiente |
| 23 | Checkout - B2B -Credito apymsa | 2600:116683 | 1920×2414 | Pantalla | B2B · crédito | 3 Pago | — | Pendiente |
| 24 | Checkout - B2B -Credito apymsa | 2605:97855 | 1920×2414 | Pantalla | B2B · crédito | 3 Pago | — | Pendiente |
| 25 | Checkout - Invitado - Sucursal Confirmacion | 130:65540 | 1920×2414 | Pantalla | Invitado · sucursal | 4 Confirmación | — | Pendiente |
| 26 | Checkout - Invitado - Sucursal Confirmacion | 482:87878 | 1920×2414 | Pantalla | Invitado · sucursal | 4 Confirmación | — | Pendiente |
| 27 | Checkout - Invitado - Sucursal Confirmacion | 2600:116869 | 1920×2414 | Pantalla | Invitado · sucursal | 4 Confirmación | — | Pendiente |
| 28 | Checkout - Invitado - Sucursal Confirmacion | 2600:108667 | 1920×2414 | Pantalla | Invitado · sucursal | 4 Confirmación | — | Pendiente |
| 29 | Checkout - Invitado - Sucursal Confirmacion | 2600:113324 | 1920×2414 | Pantalla + modal | Invitado · sucursal | 4 Confirmación | Modal 2600:112261 | Pendiente |
| 30 | Checkout - Invitado - Sucursal Confirmacion | 2600:114582 | 1920×2414 | Pantalla + modal | Invitado · sucursal | 4 Confirmación | Modal 2600:114743 | Pendiente |
| 31 | Checkout - Invitado - Sucursal Confirmacion | 2600:113845 | 1920×2414 | Pantalla + modal | Invitado · sucursal | 4 Confirmación | Modal 2600:112467 | Pendiente |
| 32 | Checkout - Invitado - Sucursal Confirmacion | 2600:114910 | 1920×2414 | Pantalla + modal | Invitado · sucursal | 4 Confirmación | Modal 2600:112428 | Pendiente |
| 33 | Checkout - Invitado - Confirmacion tarjeta | 2599:98491 | 1920×2414 | Pantalla + diálogo | Invitado · tarjeta | 4 Confirmación | Dialog alert 2599:98961 (1923 px, discrepancia) | Pendiente |
| 34 | Checkout - Invitado - Confirmacion tarjeta - Error | 2599:98979 | 1920×2414 | Estado error | Invitado · tarjeta | 4 Confirmación | Dialog alert 2599:99467 | Pendiente |
| 35 | Checkout - Invitado - Confirmacion tarjeta - Error | 2599:99708 | 1920×2414 | Estado error | Invitado · tarjeta | 4 Confirmación | Modal 463:119451 | Pendiente |
| 36 | Checkout - A domiciolio - Confirmacion | 136:70130 | 1920×2414 | Pantalla | Domicilio | 4 Confirmación | — | Pendiente |
| 37 | Checkout - A domiciolio - Confirmacion | 2599:104540 | 1920×2414 | Pantalla + modal | Domicilio | 4 Confirmación | Modal 2599:105017 | Pendiente |
| 38 | Checkout - A domiciolio - 06 | 136:70626 | **1980×1685** | Pantalla | Domicilio | Por confirmar | — | Pendiente (ancho distinto: discrepancia) |

### Otros nodos de nivel superior

| Nodo | nodeId | Tamaño | Tipo | Decisión |
|---|---|---|---|---|
| Ticket Tiendad | 949:84894 | 600×792 | Componente: ficha de pago en tienda (referencia, monto, botón) | Incluir (lo usa el pago en efectivo) |
| Ticket | 135:68191 | 1080×1920 | Imagen (rectángulo) | Por confirmar si es asset o referencia |
| Section × 11 con "Panel de actividad" | 463:117107, 463:119907, 463:119920, 482:82962, 482:86408, 463:117120, 482:81478, 482:90391, 2600:116092, 468:123679, 463:117901 | ~2500–5300×280 | Documentación / anotaciones del flujo | Ignorar como UI; leer en F5 para los flujos |
| Content (sueltos) | 728:89017, 728:89070 | 1920×52 | Instancias sueltas de breadcrumbs | Ignorar |

## Componentes (página Local components, relevantes al checkout)

| Componente / set | nodeId | Variantes |
|---|---|---|
| Head (navbar) | 1074:37407 | Property 1 = logueado / no logueado (1920×225) |
| Link navigation | 1036:25018 | no logueado / Logueado |
| Searchbar | 1035:3406 | Default / Variant2 |
| Breadcrumbs | 111:35732 | — |
| Content (breadcrumb) | 111:36109 | Default / categoria / familia / Grupo / R producto |
| Footer | 2231:19229 | — |
| Step (stepper) | 3795:63969 | Iniciado / No iniciado / Finalizado |
| Usuario | 3884:124313 | Invitado / Registrado |
| Resumen | 3677:105115 | Small / Large |
| Item (resumen) | 11332:266120 | Resumen / Add Cart / Promociones |
| ItemKart | 3527:121768 | Full / Lista / Promo Lista / Promocion / Saved / Deleted |
| Tarjeta (acordeón) | 4269:126070 | Expanded On/Off × Desktop/Movil (usar solo Desktop) |
| Formas de pago desktop | 5692:119326 | Desktop / Movil (usar Desktop) |
| Formas de pago | 5692:119355 | Default / Movil |
| Paymet options | 5689:113724 | Actived On / Off |
| Content tarjeta | 5691:113989 | — |
| Badge payments | 5685:108437 | Visa L/S, Master Default/L |
| Tarjetas perfil | 5702:121019 | Predeterminada / Other |
| Component 9 (alertas) | 5549:159270 | Confirmación / Alerta / Error |
| Modal | 2231:13383 | Default / Variant2 / Variant3 |
| Cards/Colored/_Base | 5685:108534 | — (frame, no componente) |

El resto de Local components (home, banners, marcas, buscador avanzado, filtros, login, detalle de
producto, paginación) **no** se replica salvo que aparezca dentro de una pantalla del checkout.

## Librerías externas vinculadas

| Librería | Origen | Nota |
|---|---|---|
| Autex Design System Editable | equipo | Probable origen de tokens y de `Footer`, `Content`, `Navbar Desktop` |
| FE_Autex_B2C_Editable | equipo | Este mismo archivo |
| Material 3 Design Kit | comunidad | Por confirmar qué se usa |
| Simple Design System | comunidad | Por confirmar qué se usa |
| iOS 18 and iPadOS 18 | comunidad | Probablemente no se usa en escritorio |

## Variables detectadas (muestra: frame 397:35700)

- **Color (16)**: Primary 50/300/400/500/600, Secondary 500, Neutral 50/100/200/500/700/800/900,
  Green 700, Nativo/Blanco.
- **Tipografía (7)**: Heading 3, Subheadline Book/Medium, Body 1 Book/Medium, Body 2 Book, Caption Book.
- **Fuente**: `HeadingNow-73Book` y `HeadingNow-74Regular` → **no instalada en este equipo** (ver bloqueos).

## Bloqueos y preguntas (regla 2 y F1.7)

1. ~~Fuente HeadingNow~~ → resuelto: se sustituye por `Archivo` (D1).
2. ~~Paso de los frames "Por confirmar"~~ → resuelto con la lectura del lienzo: ver `flujos.md`.
3. Conexiones exactas del prototipo: el MCP no las expone; se confirman por botón en F4.
4. Dirección/C.P. y página de carrito sin diseño (D5): pendiente de aprobación.

## Estimación de llamadas MCP

- F1 tokens: ~5 · F2 assets: ~15 · F3 componentes (~20 sets): ~60–80 · F4 pantallas (38): ~110–150.
- Total aproximado: **200–250 llamadas**, en lotes por paso del checkout.
