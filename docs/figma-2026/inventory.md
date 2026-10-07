# Inventario Figma — Autex_2026_Frames (escritorio) · F0

- Archivo: `UKrGgTeW6ld3CpGOFErLXX` · URL: https://www.figma.com/design/UKrGgTeW6ld3CpGOFErLXX/Autex_2026_Frames?node-id=111-8
- Generado: 2026-10-05 · Estado: aprobado (2026-10-05). Decisiones: reemplaza a las pantallas actuales; sin "Alertas de precios_Make"; sin página Home.
- Método: `FIGMA_REPLICA.md` (mismo flujo F0–F7 que el archivo anterior).

## Páginas

| Página | nodeId | Decisión propuesta |
|---|---|---|
| Carrito y Pasarela de pago | 111:8 | **Incluir** (página de la URL) |
| Home | 0:1 | Por confirmar (no estaba en la URL) |
| Local components | 33:761 | Incluir solo los componentes usados por 111:8 |

Librerías vinculadas: "Autex Design System - incluye version movil", "Autex_2026_Frames", "UX/UI Exodus team library".

## Página 111:8 — Carrito y Pasarela de pago

### Sección EF-46271 (657:14081) — flujo principal, de izquierda a derecha

| # | Frame | nodeId | Tamaño | Qué muestra (captura) |
|---|---|---|---|---|
| 1 | Autex_Catalogo_Stock_Cliente Registrado - 1 | 657:14082 | 1920×2845 | Catálogo con existencia por producto (disponible / bajo pedido / sin existencia) para cliente registrado |
| 2 | Carrito/Default | 657:14102 | 430×777 | Mini-carrito |
| 3 | Autex_Carrito- 1 | 673:18974 | 1920×2285 | **Página de carrito**: "Productos disponibles (1)" y "Productos bajo pedido (1)", resumen y "Tus productos guardados" |
| 4 | Modal login | 742:19087 | 840×848 | Inicio de sesión ("Bienvenido") |
| 5 | Modal login | 742:19208 | 792×848 | Variante del inicio de sesión |
| 6 | Autex - Checkout - 1 | 677:18887 | 1920×1830 | Paso 1: selección de dirección |
| 7 | Autex - Checkout - 2 | 719:22355 | 1920×1620 | Paso 2: método de envío |
| 8 | Autex - Checkout - 3 | 723:23455 | 1920×1780 | Paso 3: método de pago (tarjetas registradas) |
| 9 | Autex - Checkout - 4 | 738:17646 | 1920×1871 | Paso 4: confirmación |
| 10 | Content | 904:34705 | 935×557 | "¡Muchas gracias por tu compra!" |

### Sección EF-42837 (893:10621) — dos filas (variantes de costo de envío)

| Fila | Paso 1 | Paso 2 | Paso 3 | Paso 4 |
|---|---|---|---|---|
| Superior ("Ejemplo de envío sin costo") | 893:10681 | 893:10938 | 893:11011 | 893:11077 |
| Inferior ("Ejemplo de envío con costo") | 901:33560 | 901:32141 | 901:32200 | 901:32266 |
| Final | Content 902:34618 (gracias) | | | |

### Fuera de las secciones

| Frame | nodeId | Tamaño | Observación |
|---|---|---|---|
| Alertas de precios_Make | 2385:13413 | 1577×931 | Panel administrativo de APYMSA (menú PC2020, Precios especiales…). **No es la tienda Autex.** |

## Relación con la réplica actual (`qp14Mbl7khZF2xWAwaocfP`)

- Mismas variables (colores y tipografías): no hay tokens nuevos.
- Mismos componentes base (Navbar, Footer, Stepper, tarjeta de checkout, Resumen, opciones de dirección, tarjetas registradas, bloques de confirmación, página de gracias).
- **Nuevo** respecto a lo ya construido:
  - Catálogo con estado de existencia por producto (encaja con SMC 4.0: disponible / bajo pedido).
  - Página de carrito real (reemplazaría la página "sin respaldo" D5) con productos guardados.
  - Modal de login (reemplazaría "Ingresar" sin respaldo).
  - Checkout con variantes de envío sin costo / con costo y subtotal "(2 productos)" con "Proceder al pago".
- Estimación de llamadas MCP: ~60–90 (la mayoría de componentes se reutiliza).

## Preguntas antes de F1 (respondidas el 2026-10-05: reemplaza; sin Alertas; sin Home)

1. ¿Este archivo **reemplaza** al anterior (actualizar las pantallas existentes de la demo) o se agrega **como flujo aparte** (nuevas rutas, conservando las actuales)?
2. ¿Se incluye "Alertas de precios_Make" (panel interno de APYMSA)? Recomendación: no, porque no forma parte de la tienda ni de SMC 4.0.
3. ¿Se revisa también la página "Home" (0:1)?

## Estado F2–F7 (2026-10-05)

Completo. Mapa: `figma-map.json`; flujos: `flujos.md`; verificación: `verificacion.md`; capturas: `cache/`.
