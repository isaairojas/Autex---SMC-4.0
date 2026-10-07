# CHANGELOG — sincronización con Figma

## 2026-10-07 — Sucursales foráneas y secciones de entrega (sin respaldo en Figma, D44)
- Bajo pedido cuando la mayoría de las piezas sale de sucursales foráneas (más de 30 km), con la leyenda "podría demorar más de lo normal" en detalle, carrito y paso 2 (envío aparte desde la foránea).
- Carrito: "Zona de entrega" solo con artículos a domicilio y "Recoger en tienda" como sección aparte solo con artículos para recoger.

## 2026-10-07 — Recoger en tienda (sin respaldo en Figma, D43)
- Carrito: "Enviar a domicilio" / "Recoger en tienda" por artículo con existencias en línea y en "Mi tienda"; la cantidad se ajusta a las piezas de la tienda; "Método de entrega" (todo a domicilio / todo en tienda) y "Zona de entrega" ("Guadalajara y sus alrededores"), con carga "Calculando disponibilidad en tienda".
- Cambio de tienda o C.P.: lo que se recoge se recalcula con la nueva tienda.
- Checkout: "Recoger en tienda" separado de los envíos en el paso 2 y en la confirmación.
- Detalle: barra lateral "Buscar en otras tiendas" con "Cambiar dirección".
- Publicación en GitHub Pages (`.github/workflows/pages.yml`). Prueba nueva `tests/referencia/recoger-demo.mjs`.

## 2026-10-06 — Barrido del flujo: correcciones (sin respaldo en Figma)
- Existencias y envíos con una sola red de tiendas (D41): "Mi tienda", compra en línea y envíos usan las mismas existencias; envíos agrupados por la tienda más cercana con existencia; sin costo de envío en todo el checkout; tope de piezas en carrito y detalle.
- Pedidos y cuenta (D42): número y fecha reales, "Mis pedidos", "Seguir comprando" conserva la sesión, direcciones reales del registrado en el paso 1, alta de dirección desde el checkout, formulario del invitado conservado, tarjeta del invitado vacía y validada, "Salir" al inicio, total y paginado del catálogo, migas de pan del producto.
- `src/mocks/geo.ts` (distancia) separa la dependencia circular entre tiendas y existencias. e2e ampliado; `tests/referencia/barrido-demo.mjs` cubre los casos borde.

## 2026-10-06 — Ubicación de entrega, "Mi tienda" y "Mis vehículos" (sin respaldo en Figma)
- Cada vez que se entra a la demo aparece el aviso del navegador simulado ("www.autex.com.mx quiere · Conocer tu ubicación": permitir mientras se visita, permitir esta vez, no permitir nunca). Al cerrarlo con la X aparece el aviso de Autex "Elige una tienda"; "No permitir nunca" solo lo cierra; al permitirlo hay carga de página y "Mi tienda" es la más cercana.
- Navbar 2026 en modo sitio: chip "Mi tienda" (abierto / cierra) con "Entrega en C.P." a su lado; paneles "Ubicación de entrega" y "Selecciona una tienda" bajo cada chip. "Elegir tienda manualmente" pide primero el C.P. y luego muestra las tiendas de ese estado.
- C.P. predeterminado 45138 (tienda Tesistán). Niveles de servicio de `src/mocks/configuracion-servicios-smc.json` (todas las tiendas con los de "acapulco"); la cobertura de existencias usa el alcance Foráneo (350 km). Datos en `src/mocks/tiendas.ts`.
- "Mis vehículos" replicado de autex.com.mx (captura en `docs/autex-real/vehiculos/`); la demo empieza sin vehículo y el buscador del inicio agrega y activa el vehículo.
- `/sucursales`: ordenadas por distancia a la entrega, km, nivel de servicio, "Hacer mi tienda" y mapa acercado a la zona. Navbar 2026 con prop `sitio` ("Ofertas", "Hola / nombre", campana).
- Gestión de direcciones (D33): "Entrega en" con vista de invitado (C.P.) y de cliente registrado ("Mis direcciones"); página `/configuracion` replicada de autex.com.mx (Mi perfil, Dirección de envío con estado vacío y formulario "Nueva dirección", Método de pago, Mis pedidos) y menú de la cuenta (Mi perfil, Mis pedidos, Salir).
- Existencias (D34): los resultados ocultan lo que no tiene existencia (filtro para verlo), etiqueta "+100 pzs" por rangos, tarjeta "Disponibilidad" en el detalle (en línea y en Mi tienda) y panel de tiendas sin costo logístico.
- Checkout del cliente registrado (D35): del carrito directo a "Método de envío", dirección de entrega visible, "Cambiar dirección de entrega" con tooltip y modal, sin costos de envío y envíos múltiples por sucursal (Envío 1, 2, 3) desplegables.
- Cargas a página completa (D36): la página se pone en gris con el spinner al centro en los pasos del checkout, los cambios de tienda, C.P. o dirección y al cargar productos (búsqueda, categoría, marca, vehículo, filtros).
- Página adaptativa al zoom (D37): por debajo de 1920 px de ventana la página se escala para caber completa; con zoom out queda centrada.
- Catálogo ampliado (D38): 19 productos en las 5 especialidades (baterías, alternadores, cinta aislante…); baterías solo con existencias locales/local extendido; entrega Local el mismo día antes de las 2:00 p.m.; detalle con datos del producto.
- Imágenes de autex.com.mx para cinta aislante, juego de llaves, chaleco y guantes (sin imagen en Figma, D38). Cantidad editable en las tarjetas con tope de existencia para venta en línea (D39).
- Cliente no registrado (D40): "¿Cómo deseas continuar?" al proceder al pago; formulario de invitado de autex.com.mx en el paso 1; "Tengo una cuenta Autex" → inicio de sesión → paso 2.
- Tokens nuevos `--color-navegador-*` y `--font-family-navegador` (aviso del navegador). e2e actualizado. Discrepancias D31–D32.

## 2026-10-05 — Flujos del sitio real autex.com.mx (sin respaldo en Figma)
- Nuevas páginas: inicio (`/`), catálogo de especialidades (`/catalogo`), búsqueda por marca (`/marcas`), ofertas (`/ofertas`), sucursales (`/sucursales`, 46 sucursales públicas) y cómo comprar (`/como-comprar`).
- El catálogo de Figma (657:14082) pasa a `/busqueda` con filtros por parámetros (texto, especialidad, categoría, marca, vehículo) y el estado "Tu búsqueda no coincidió con ningún producto".
- Navbar 2026 funcional: buscador, menú de especialidades y enlaces Inicio / Catálogo / Marcas / Promociones (→ Ofertas). Footer: "Localiza tu tienda" y "¿Cómo comprar en Autex?".
- Referencia y scripts de captura en `docs/autex-real/` y `tests/referencia/`. Discrepancias D29–D30. Prueba de punta a punta ampliada.

## 2026-10-05 — Autex_2026_Frames (UKrGgTeW6ld3CpGOFErLXX, página 111:8) reemplaza al archivo anterior
- Pantallas reemplazadas: catálogo (657:14082) en `/`, carrito (673:18974) en `/carrito`, checkout 1–4 (677:18887, 719:22355, 723:23455, 738:17646) y gracias (904:34705). Variantes de envío sin costo / con costo (EF-42837).
- Nuevos: Navbar2026, Footer `version2026`, ModalLogin (reemplaza `/ingresar`), CarritoCompra (agrupa por existencia SMC 4.0: disponible / bajo pedido / sin existencia), EnvioPaqueteria, Pago2026 (tarjetas guardadas y logos de bancos), TarjetaProducto ("104 pzs", "Avisar disponibilidad"), Filtros2026 y el mini-carrito 2026.
- Ajustados al 2026: CheckoutCard (1270, sin migas de pan), CheckoutLayout (Headline de 160, franja #F2F2F2), Resumen (428, "Descuentos aplicados", chip "Bajo pedido"), Navbar registrado (719:22711), ConfirmacionBloque.
- Datos: catálogo de 12 productos con existencias por sucursal; estado SMC 4.0 calculado (`estadoExistencia`); costo de envío con el umbral implícito (D27); productos guardados para más tarde.
- Tokens nuevos sin variable en Figma: naranja de bajo pedido, fondo #F2F2F2, rojo "No disponible", SKU, Facebook y sombras del login (ver `valores-sin-token.md`).
- Galería `/figma` con 19 frames del archivo 2026; verificación en `docs/figma-2026/verificacion.md`. Discrepancias D25–D28.
- Excluidos por decisión del usuario: "Alertas de precios_Make" y la página Home (0:1).

## 2026-10-05
- F2–F7 completas para la página "Pasarela de compra" (38 frames) y las pantallas de escritorio de "Locofy (Prueba)" (inicio y detalle).
- 26 componentes del sistema de diseño (`src/design-system/components`), 9 pantallas, galería `/figma` con 41 entradas.
- Verificación visual de 39 frames: 1.5 %–2.8 % de píxeles distintos (fuente sustituta, D1); 3 frames hasta 4.7 % con causa registrada (D10, D22, D24). Ver `verificacion.md`.
- Flujo previo al checkout (ubicación por C.P., agregar al carrito, carrito, ingreso simulado) agregado con componentes existentes (D5).
- Prueba de punta a punta `tests/e2e-flujo.mjs`: invitado (sucursal + tarjeta + OpenPay) y B2B.
- Pendiente: confirmar con diseño las variantes marcadas "por confirmar" en la galería y las decisiones D2–D4.

## 2026-10-02
- F0 Inventario: 38 pantallas de checkout (32:309), inicio y detalle de escritorio (Locofy), componentes usados. Ver `inventory.md` y `flujos.md`.
- F1 Tokens: 27 colores, 12 estilos de texto, 1 sombra, 2 medidas de layout → `src/design-system/tokens/`.
