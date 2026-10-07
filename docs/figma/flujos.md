# Flujos del prototipo — Pasarela de compra (escritorio)

Fuente: lectura del lienzo de la página 32:309 (2026-10-02). Cada `Section` con "Panel de actividad"
es la cabecera de una fila; las pantallas de esa fila, de izquierda a derecha, son los pasos del flujo.
El MCP **no** expone las conexiones del prototipo (on click → navigate), así que la acción concreta
que lleva de una pantalla a la siguiente se deduce del botón principal de cada pantalla
(p. ej. "Continuar") y queda marcada como `Lienzo` hasta confirmarla en F4.

## Flujos

| # | Flujo (panel) | Panel nodeId | Pantallas en orden |
|---|---|---|---|
| F1 | Invitado · Recoger en sucursal | 463:117107 | 397:35700 Datos del usuario → 128:64284 Seleccionar sucursal → 2596:99063 Sucursales/Estados → 2596:99874 Estado seleccionado y tiendas → 129:66134 Método de pago → 130:65540 Confirmación |
| F2 | Confirmación tarjetas | 468:123679 | 2599:98491 Confirmación tarjeta (diálogo) → 2599:98979 Error |
| F3 | Editar método de envío | 463:117120 | 2599:99538 Editar método de envío (modal) → 2599:99708 Confirmación tarjeta - Error (modal) |
| F4 | Método de pago | 463:117901 | 2599:101632 Editar método de pago (modal) |
| F5 | Invitado · A domicilio · Pago en tienda autoservicio | 463:119907 | 1324:96920 Datos (domicilio) → 135:67668 Envío → 136:68850 Pago → 2599:103603 Pago (modal) → 136:70130 Confirmación → 2599:104540 Confirmación (modal) → 136:70626 Ficha de pago (06) · componente 949:84894 Ticket Tiendad · imagen 135:68191 Ticket |
| F6 | B2C (registrado) · Sucursal | 463:119920 | 463:119933 → 463:120909 → 463:121566 → 463:122330 → 482:87878 Confirmación |
| F7 | B2C (registrado) · Domicilio | 482:82962 | 482:82975 → 482:83129 → 2600:108075 → 2600:108667 Confirmación |
| F8 | Nuevo usuario | 482:86408 | 1324:97509 |
| F9 | Edición de envío | 482:81478 | 2600:113324 (modal) · 2600:113845 (modal) |
| F10 | Edición de método de pago | 482:90391 | 2600:114582 (modal) · 2600:114910 (modal) |
| F11 | B2B · Crédito | 2600:116092 | 2600:116100 → 2600:116276 → 2600:116409 → 2600:116683 Crédito Apymsa → 2600:116869 Confirmación · variante 2605:97855 Crédito Apymsa |

## Transiciones implementadas

El MCP no expone las conexiones del prototipo; las transiciones se tomaron de los botones de cada frame y del orden del lienzo.

| Origen | Disparador | Acción | Destino | Fuente |
|---|---|---|---|---|
| Inicio / Detalle | "Agregar al Carrito" / "Añadir al carrito" sin ubicación | Abrir overlay | Selección de C.P. (sin respaldo, D5) | Usuario (FR-016) |
| Inicio / Detalle | "Agregar al Carrito" con ubicación | Abrir overlay | Mini-carrito 1029:30142 | Lienzo |
| Mini-carrito | "Ver todos los productos" | Navegar | Carrito (sin respaldo) | Lienzo |
| Navbar | "Ingresar" | Navegar | Ingresar (sin respaldo) | FR-017 |
| Carrito | "Continuar" | Navegar | Datos del usuario | Sin respaldo |
| Paso 1 | "Continuar" | Navegar | Método de envío | Botón del frame |
| Paso 2 | "Ver disponibilidad en tiendas" | Cambiar estado | Estados → Tiendas (2596:99063 → 2596:99874) | Lienzo F1 |
| Paso 2 | "Seleccionar una Paquetería" | Cambiar estado | Paqueterías (135:67668) | Lienzo F5 |
| Paso 3 | "Otras formas de pago" | Abrir overlay | Tiendas de autoservicio (2599:104102) | Lienzo F5 |
| Paso 4 | "Cambiar" (envío / pago) | Abrir overlay | Editar envío (2599:100517 / 2599:101250) · Editar pago (2599:101789 / 2600:114744) | Lienzo F3, F4, F9, F10 |
| Paso 4 | "Confirmar el pedido" con tarjeta | Abrir overlay | OpenPay (2599:105017) → "Pagar" → Verificando (2599:98962) → Gracias, o Tarjeta declinada (2599:99468) si termina en 0000 | Lienzo F2, F5 |
| Paso 4 | "Confirmar el pedido" con tienda o crédito | Navegar | Gracias (136:70626) | Lienzo F5 |
| Gracias | "Descargar ticket de pago" | Abrir overlay | Ticket Tiendad (949:84894) | Lienzo F5 |
| Cualquier paso | "Regresar" | Navegar | Paso anterior | Botón del frame |

Duración y easing: Figma no define animaciones accesibles por MCP; las transiciones son instantáneas.

## Flujos previos al checkout (pedidos por el usuario, 2026-10-02)

| Flujo | Diseño en Figma | Estado |
|---|---|---|
| Selección de dirección / código postal | No existe en Figma | Implementado sin respaldo (D5, aprobado) |
| Agregar mercancía (home → detalle → carrito) | Home 12849:114186, Detalle 12849:113500, mini-carrito 1029:30142, ItemKart 3527:121767 | Implementado; la página de carrito es sin respaldo (D5) |
| Inicio de sesión (cliente registrado) | Componentes de login en Local components (email, Google, Facebook) | Disponible como componentes |
