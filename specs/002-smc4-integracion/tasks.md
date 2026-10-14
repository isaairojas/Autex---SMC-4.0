---

description: "Tareas de la spec 002: Autex.com.mx + SMC 4.0 v2"
---

# Tasks: Autex.com.mx + SMC 4.0 v2

**Input**: Design documents from `/specs/002-smc4-integracion/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/smc-propuesta.md, quickstart.md

**Tests**: sí. La spec pide criterios verificables en la app (CA1–CA19) y el plan define las pruebas de Playwright
(`tests/referencia/escenarios-demo.mjs` y las existentes). En cada historia, la prueba va primero y debe fallar antes
de implementar.

**Organization**: una fase por historia de la spec. Etiquetas: US1 = HU1, US2 = HU2, … US8 = HU8.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (otro archivo, sin depender de tareas pendientes)
- **[Story]**: historia de la spec (US1 … US8)
- Proyecto único: `src/`, `tests/`, `docs/` en la raíz (ver plan.md)

---

## Phase 1: Setup

**Purpose**: registrar las decisiones y preparar la prueba de escenarios.

- [ ] T001 Registrar la decisión D59 en docs/figma/discrepancias.md: escenarios E1–E7, globos explicativos, IVA fronterizo, caja gris, exclusivos de recoger, sucursal predefinida y sucursal base, todos "sin respaldo en Figma" (spec 002, Clarifications 2026-10-09)
- [ ] T002 [P] Agregar en docs/figma-2026/figma-map.json (sinRespaldoEnFigma) las piezas nuevas: molécula Globo, página /escenarios, secciones "Caja gris" y etiquetas "Sucursal predefinida", "Sucursal base" y "Complemento"
- [ ] T003 [P] Crear tests/referencia/escenarios-demo.mjs con la base de las pruebas de referencia (servidor http://localhost:5179, `nueva()` que junta errores de consola, `paso()` y `falla()`, carpeta de capturas por argumento), sin casos todavía

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: un solo cálculo de SMC 4.0 simulado (Principio VII) con el comportamiento de hoy, y una línea base de
pruebas en verde.

**⚠️ CRITICAL**: ninguna historia empieza antes de terminar esta fase.

- [ ] T004 Actualizar al comportamiento vigente (D49, D57) las pruebas de referencia que ya fallaban, tests/referencia/existencias-demo.mjs, tests/referencia/catalogo-demo.mjs y tests/referencia/direcciones-demo.mjs, hasta que pasen
- [ ] T005 [P] Agregar a src/mocks/configuracion-existencias.json `"porcentajeSucursalBase": 80` y `"sucursalesPredefinidas": {}` (C.P. → id de sucursal) con su descripción, y exponerlos en src/mocks/existencias.ts junto a SUCURSALES_FORANEAS_MAXIMO
- [ ] T006 [P] Crear src/mocks/fronteras.ts con los C.P. de ejemplo de la región fronteriza (22000 Tijuana, 21000 Mexicali, 32000 Ciudad Juárez, 88500 Reynosa, 30700 Tapachula, 77000 Chetumal) y `esFronterizo(cp)`, y hacer que esos C.P. se resuelvan como válidos en resolverCP de src/mocks/tiendas.ts
- [ ] T007 [P] Extender los tipos: `exclusivoRecoger?: boolean` ("Siempre a 'Recoger en tienda'") y `promocionId?: string` ("Las piezas de una promoción van juntas") en Producto de src/mocks/productos.ts; `sucursalBaseId?: string` ("Solo registrados") en Cliente de src/mocks/clientes.ts
- [ ] T008 Crear src/mocks/smc.ts con los tipos del contrato (contracts/smc-propuesta.md): EntradaPropuesta, PropuestaSurtido (envios, recoger, sinExistencia, cajaGris, iva, explicaciones), EnvioSMC (numero "1, 2, 3… en el orden en que se muestran", sucursalId, sucursal, direccion, foraneo, bajoPedido, etiquetas, entrega {desde, hasta, texto}, lineas), Explicacion (paso, regla, texto), EntradaExistencias y ExistenciaProducto
- [ ] T009 Implementar `calcularPropuesta(entrada)` en src/mocks/smc.ts con los pasos 4 a 7 de RN6 tal como funcionan hoy (mover la lógica de repartirEnvios de src/mocks/envios.ts conservando D49 y D57), con `recoger` solo con piezas de "Mi tienda" (RN7) y `sinExistencia`; invariante: "cada línea queda en exactamente un lugar"
- [ ] T010 Implementar `existenciasPorUbicacion(entrada)` (operación 1 del contrato) en src/mocks/smc.ts sobre estadoExistencia, existenciaEnLinea, maximoVenta y existenciaEnTienda de src/mocks/existencias.ts
- [ ] T011 Hacer que src/state/DemoContext.tsx (disponibilidad, recalcularPara, envíos del pedido), src/screens/checkout/gruposPedido.ts, src/screens/checkout/MetodoEnvio.tsx y src/screens/checkout/Confirmacion.tsx usen calcularPropuesta y existenciasPorUbicacion en lugar de repartirEnvios y estadoExistencia, sin cambio visible
- [ ] T012 Correr la regresión completa (`npm run build`, `node tests/e2e-flujo.mjs`, todas las de tests/referencia/*.mjs y `node tests/visual/compare-all.mjs`) y corregir hasta que el resultado sea el mismo que antes de T008

**Checkpoint**: el cálculo vive en un solo lugar y todo pasa como antes.

---

## Phase 3: User Story 1 - Mejor sucursal con SMC 4.0 (Priority: P1) 🎯 MVP

**Goal**: el paso de envío muestra la propuesta completa de SMC 4.0 (orden RN6 con predefinida, sucursal base, caja
gris y sin existencia), con la regla que la decidió en un globo, y avisa si SMC no responde.

**Independent Test**: en tests/referencia/escenarios-demo.mjs pasan CA1, CA2, CA5, CA6, CA7, CA8, CA9 y CA18
recorriendo el flujo normal (C.P., carrito y pago).

### Tests for User Story 1 ⚠️

- [ ] T013 [P] [US1] Agregar a tests/referencia/escenarios-demo.mjs CA8 (C.P. 45138 + inyector → 1 envío desde "Autex Tesistan" con fecha en días hábiles) y CA9 (todas las piezas del inyector → cuando mucho un envío foráneo)
- [ ] T014 [P] [US1] Agregar a tests/referencia/escenarios-demo.mjs CA1 (C.P. con sucursal predefinida → primer envío "Sucursal predefinida" y faltantes "Complemento"), CA2 (registrado con sucursal base → envío "Sucursal base" y complementos), CA5 (sin existencias), CA6 (promoción incompleta → "Caja gris" con su globo), CA7 (invitado sin "Sucursal base") y CA18 (SMC sin respuesta → "No pudimos calcular tus envíos en este momento", "Reintentar" y "Continuar" deshabilitado)

### Implementation for User Story 1

- [ ] T015 [P] [US1] Datos que provocan los escenarios: una sucursal predefinida para el C.P. 44100 en src/mocks/configuracion-existencias.json, `sucursalBaseId` del cliente registrado de ejemplo en src/mocks/clientes.ts (una sucursal que cubra al menos el 80 % de un carrito de prueba) y una promoción de dos productos (`promocionId`) en src/mocks/catalogo.ts que ninguna sucursal candidata del C.P. 45138 complete
- [ ] T016 [US1] Paso 2 de RN6 en src/mocks/smc.ts: si `sucursalesPredefinidas[C.P.]` existe, el pedido sale de esa sucursal con etiqueta "Sucursal predefinida" y lo que le falta sale de las demás candidatas (donantes) con etiqueta "Complemento"
- [ ] T017 [US1] Paso 3 de RN6 en src/mocks/smc.ts: si el registrado tiene `sucursalBaseId` y esa sucursal cubre al menos `porcentajeSucursalBase` (80) % de las piezas del pedido, surte lo que tiene con etiqueta "Sucursal base" y los faltantes salen con etiqueta "Complemento"
- [ ] T018 [US1] Caja gris en src/mocks/smc.ts: las líneas con `promocionId` cuya promoción no completa ninguna sucursal candidata van a `cajaGris` con motivo "Ninguna sucursal tiene la promoción completa"; no se parten
- [ ] T019 [US1] Explicaciones en src/mocks/smc.ts: una por regla aplicada (sucursal predefinida, sucursal base, sucursal más cercana con todo, se juntó de las más cercanas, bajo pedido de la foránea, caja gris, sin existencia) con los datos del caso (sucursal, km, piezas, C.P.)
- [ ] T020 [P] [US1] Crear la molécula Globo en src/design-system/components/molecules/Globo.tsx y Globo.module.css (sin respaldo en Figma): botón con el ícono "help_outline" de Icon, texto que se abre y se cierra al tocarlo, solo tokens de tokens.css y estilos de celular bajo `:global(.vista-movil)`
- [ ] T021 [US1] En el paso de envío (src/screens/checkout/MetodoEnvio.tsx): etiquetas de cada envío, secciones "Artículos sin existencia" y "Caja gris" de la propuesta y un Globo por envío con su explicación
- [ ] T022 [US1] Falla de SMC (RF20) en src/mocks/smc.ts y src/screens/checkout/MetodoEnvio.tsx: con la bandera `smcSinRespuesta` del estado de la demo (src/state/DemoContext.tsx) la propuesta no llega en 2 segundos; se ve la carga "Calculando tu envío" y después "No pudimos calcular tus envíos en este momento" con "Reintentar"; "Continuar" queda deshabilitado
- [ ] T023 [US1] Bloquear el pago con líneas en `cajaGris` igual que con artículos sin existencia, en src/screens/checkout/CheckoutLayout.tsx y src/screens/tienda/CarritoPagina.tsx

**Checkpoint**: la propuesta de SMC 4.0 se ve y se explica en el paso de envío (MVP).

---

## Phase 4: User Story 2 - Catálogo según mi ubicación (Priority: P1)

**Goal**: lo que el cliente ve en catálogo, detalle y carrito depende de su dirección, incluido el IVA fronterizo.

**Independent Test**: CA4 en tests/referencia/escenarios-demo.mjs y las pruebas existentes de existencias y ubicación.

### Tests for User Story 2 ⚠️

- [ ] T024 [P] [US2] Agregar CA4 a tests/referencia/escenarios-demo.mjs: con el C.P. 22000, precios de catálogo, detalle y carrito, y el total, al 8 % (`precio / 1.16 × 1.08`, a centavos), y el resumen dice "TOTAL (IVA incluido, 8 %)"

### Implementation for User Story 2

- [ ] T025 [US2] Función `precioConIva(precio, cp)` en src/mocks/smc.ts (8 % con C.P. fronterizo, igual con el resto) y `iva` (8 o 16) en la propuesta según `esFronterizo` de src/mocks/fronteras.ts
- [ ] T026 [US2] Usar precioConIva en las tarjetas (src/design-system/components/organisms/TarjetaProducto.tsx y ProductCard.tsx), el detalle (src/screens/tienda/DetalleProducto.tsx), el carrito (src/screens/tienda/CarritoPagina.tsx) y el resumen (src/design-system/components/organisms/Resumen.tsx, "TOTAL (IVA incluido, 8 %)" con C.P. fronterizo)
- [ ] T027 [US2] Globo en la búsqueda (src/screens/tienda/Inicio.tsx) y en "Disponibilidad" del detalle (src/screens/tienda/DetalleProducto.tsx): las existencias son de las sucursales candidatas del C.P. (las nombra con su distancia) y, con C.P. fronterizo, que el IVA es del 8 %

**Checkpoint**: catálogo, detalle y carrito explican que dependen de la dirección.

---

## Phase 5: User Story 3 - Domicilio o recoger en tienda (Priority: P1)

**Goal**: los productos exclusivos de recoger (y su promoción) siempre se recogen.

**Independent Test**: CA3, CA10 y CA11 (con tests/referencia/recoger-demo.mjs y revision-flujo-demo.mjs).

### Tests for User Story 3 ⚠️

- [ ] T028 [P] [US3] Agregar CA3 a tests/referencia/escenarios-demo.mjs: con "Enviar todo a domicilio", el producto exclusivo y su promoción siguen en "Recoger en tienda" en el carrito y en el paso de envío

### Implementation for User Story 3

- [ ] T029 [P] [US3] Marcar un producto de ejemplo como `exclusivoRecoger: true` y ponerlo en una promoción con otro producto en src/mocks/catalogo.ts
- [ ] T030 [US3] Paso 1 de RN6 en src/mocks/smc.ts: las líneas exclusivas, y toda su promoción, van a `recoger` aunque lleguen como `domicilio`, con su explicación
- [ ] T031 [US3] Carrito (src/screens/tienda/CarritoPagina.tsx y src/design-system/components/organisms/EntregaCarrito.tsx): el exclusivo muestra "Solo se recoge en tienda" sin la opción de domicilio; "Enviar todo a domicilio" lo deja en recoger con aviso; Globo que lo explica
- [ ] T032 [US3] Si "Mi tienda" no tiene piezas del exclusivo, el producto dice "No disponible en tu tienda" y bloquea el pago hasta elegir otra tienda con "Buscar en otra tienda" (src/state/DemoContext.tsx, src/screens/tienda/CarritoPagina.tsx)

**Checkpoint**: domicilio y recoger respetan los exclusivos.

---

## Phase 6: User Story 4 - Envíos y fechas en el pago (Priority: P1)

**Goal**: la confirmación, la página de gracias y "Mis pedidos" muestran los envíos de la propuesta bajo un solo
pedido.

**Independent Test**: CA15 y CA19 (con tests/referencia/confirmacion-envios-demo.mjs y tests/e2e-flujo.mjs).

### Tests for User Story 4 ⚠️

- [ ] T033 [P] [US4] Agregar CA19 a tests/referencia/escenarios-demo.mjs: un pedido con envíos de dos sucursales (inyector con piezas de Tesistán y de Zamora) se paga y aparece una sola vez en "Mis pedidos", con un número y dos envíos

### Implementation for User Story 4

- [ ] T034 [US4] Confirmación (src/screens/checkout/Confirmacion.tsx): etiquetas de cada envío, "Caja gris" y artículos sin existencia como no pagables, y un Globo con las reglas aplicadas
- [ ] T035 [US4] Guardar en el pedido la propuesta aceptada (envíos con etiquetas y recoger) en src/state/DemoContext.tsx y mostrar en "Mis pedidos" (src/screens/sitio/Configuracion.tsx) los envíos de cada pedido bajo su número
- [ ] T036 [US4] Globo en la página de gracias (src/screens/checkout/Gracias.tsx): en cuántos envíos llega el pedido y desde qué sucursales

**Checkpoint**: el cliente ve un pedido con sus envíos de principio a fin.

---

## Phase 7: User Story 5 - Escenarios y globos (Priority: P2)

**Goal**: negocio recorre E1–E7 y la falla de SMC desde una lista, con globos en todas las pantallas.

**Independent Test**: tests/referencia/escenarios-demo.mjs recorre los 8 escenarios desde /escenarios y CA16.

### Tests for User Story 5 ⚠️

- [ ] T037 [P] [US5] Completar tests/referencia/escenarios-demo.mjs: cargar cada escenario desde /escenarios, comprobar su resultado esperado (CA1–CA7, CA18) y que cada pantalla del flujo tenga al menos un globo (CA16)

### Implementation for User Story 5

- [ ] T038 [US5] Crear src/mocks/escenarios.ts con E1–E7 y "SMC 4.0 sin respuesta": id, nombre, descripción, cliente (invitado o registrado), C.P. o dirección, carrito (producto, cantidad, método) y resultado esperado (texto de CA1–CA7 y CA18), usando los datos de T015 y T029
- [ ] T039 [US5] Acción `cargarEscenario(id)` en src/state/DemoContext.tsx: fija cliente, ubicación (C.P. y tienda), carrito y la bandera `smcSinRespuesta`, con la carga "Preparando el escenario"
- [ ] T040 [US5] Página src/screens/sitio/Escenarios.tsx en la ruta /escenarios (src/navigation/App.tsx): lista con nombre, descripción y "Cargar escenario", que lleva al carrito; con componentes existentes y marcada "sin respaldo en Figma"
- [ ] T041 [US5] Acceso a /escenarios en el pie de escritorio (src/design-system/components/organisms/Footer.tsx) y de celular (src/design-system/components/organisms/PieMovil.tsx) como "Escenarios SMC 4.0 (demo)"
- [ ] T042 [US5] Globos en las pantallas que faltan (CA16): ubicación ("Mi tienda" y "Entrega en", src/design-system/components/organisms/UbicacionTienda.tsx), carrito (src/screens/tienda/CarritoPagina.tsx), datos (src/screens/checkout/DatosUsuario.tsx) y pago (src/screens/checkout/MetodoPago.tsx), con el texto de la propuesta o de la regla del paso

**Checkpoint**: los escenarios se cargan y cada pantalla se explica.

---

## Phase 8: User Story 6 - Recalcular al cambiar la ubicación (Priority: P2)

**Goal**: al cambiar tienda, C.P. o dirección, las reglas nuevas también se recalculan y se explica qué cambió.

**Independent Test**: CA12 y CA13 (con tests/referencia/cambio-direccion-demo.mjs, etapas-direccion-demo.mjs y revision-flujo-demo.mjs).

### Tests for User Story 6 ⚠️

- [ ] T043 [P] [US6] Agregar a tests/referencia/escenarios-demo.mjs: al cambiar en el pago a un C.P. fronterizo, el total pasa a IVA del 8 % y la propuesta se recalcula; al cambiar a un C.P. con sucursal predefinida, aparece "Sucursal predefinida"

### Implementation for User Story 6

- [ ] T044 [US6] Revisar que recalcularPara, cambiarDireccionPedido y cambiarUbicacionPedido de src/state/DemoContext.tsx recalculan con existenciasPorUbicacion y calcularPropuesta las reglas nuevas (predefinida, sucursal base, exclusivos, caja gris e IVA)
- [ ] T045 [US6] Globo en la leyenda amarilla del paso de envío (src/screens/checkout/MetodoEnvio.tsx) y en el aviso temporal (src/screens/PageShell.tsx): por qué cambió (otras sucursales candidatas para el nuevo C.P.)

**Checkpoint**: los cambios de ubicación mantienen la propuesta al día y explicada.

---

## Phase 9: User Story 7 - Cliente registrado (Priority: P2)

**Goal**: la confirmación directa del registrado decide con la propuesta de SMC 4.0.

**Independent Test**: CA14 (con tests/e2e-flujo.mjs y tests/referencia/etapas-direccion-demo.mjs).

### Tests for User Story 7 ⚠️

- [ ] T046 [P] [US7] Agregar a tests/referencia/escenarios-demo.mjs CA14 (registrado con dirección y tarjeta, todo a domicilio y un solo envío → abre "Confirmación") y el caso contrario (sucursal base con complemento, dos envíos → abre "Método de envío")

### Implementation for User Story 7

- [ ] T047 [US7] En src/screens/checkout/inicioCheckout.ts, decidir la confirmación directa con calcularPropuesta: un solo envío y nada que recoger
- [ ] T048 [US7] Globo en la confirmación directa (src/screens/checkout/Confirmacion.tsx): por qué se saltaron los pasos ("Tu información está completa y tu pedido llega en un solo envío")

**Checkpoint**: el registrado compra en menos pasos solo cuando la propuesta lo permite.

---

## Phase 10: User Story 8 - Celular (Priority: P3)

**Goal**: todo el flujo en celular con la forma del sitio (entregas 2 a 4 de docs/autex-real/movil/PLAN.md) y los
cambios de la demo, incluidas las piezas nuevas de esta v2.

**Independent Test**: tests/referencia/movil-demo.mjs a 360, 390 y 414 px sin pantallas reducidas (sin
`.vista-escalada`) y las comparaciones de docs/autex-real/movil/comparacion/.

### Tests for User Story 8 ⚠️

- [ ] T049 [P] [US8] Extender tests/referencia/movil-demo.mjs por entrega: búsqueda, detalle, carrito, pago, cuenta y escenarios sin `.vista-escalada` y sin desplazamiento horizontal

### Implementation for User Story 8

- [ ] T050 [US8] Resolver con el usuario las 6 decisiones pendientes de docs/autex-real/movil/PLAN.md (lugar de "Mi tienda" y "Entrega en", aviso de ubicación, "Buscar en otra tienda", orden del carrito, encabezado del pago, estado al recargar) y registrarlas como decisiones D en docs/figma/discrepancias.md
- [ ] T051 [P] [US8] Ajustes de la entrega 1: aviso al agregar al carrito como el del sitio (captura 16: arriba, con SKU, nombre, precio y "Se agregó correctamente al carrito") en un organismo nuevo src/design-system/components/organisms/AvisoAgregadoMovil.tsx usado por src/screens/PageShell.tsx; selector de estado del panel "Selecciona una tienda" sin salirse (src/design-system/components/organisms/UbicacionTienda.module.css)
- [ ] T052 [P] [US8] Medir en el sitio búsqueda, filtros, detalle, carrito y pago en celular ampliando tests/referencia/medir-autex-movil.mjs (salida en docs/autex-real/movil/medidas/) antes de construir esas pantallas
- [ ] T053 [US8] Entrega 2, búsqueda: "Búsqueda por vehículo" plegable (captura 04), resultados en 2 columnas (13), vista de lista (15) y filtros a pantalla completa con "Mostrar productos no disponibles" (14), en organismos *Movil de src/design-system/components/organisms/ y src/screens/tienda/Inicio.tsx con `movilListo`
- [ ] T054 [US8] Entrega 2, detalle (captura 17) con "Disponibilidad", "Existencia en otra región" y "Buscar en otra tienda" según la decisión de T050, en src/screens/tienda/DetalleProducto.tsx con `movilListo`
- [ ] T055 [US8] Entrega 2, carrito vacío (07) y con productos (18) con los bloques de la demo en el orden de T050, y "¿Cómo deseas continuar?" (19), en src/screens/tienda/CarritoPagina.tsx con `movilListo`
- [ ] T056 [US8] Entrega 3, pago: encabezado según T050 y pasos 1 a 3 (capturas 20–23 y registrado/08–10) con los cambios de la demo (sin número de pedido, sin costo de envío, factura opcional, quién recoge, envíos, fechas), en src/screens/checkout/CheckoutLayout.tsx y sus pantallas, con `movilListo`
- [ ] T057 [US8] Entrega 3, confirmación y gracias en una columna con el diseño de la demo (sin captura del sitio), en src/screens/checkout/Confirmacion.tsx y Gracias.tsx
- [ ] T058 [US8] Entrega 4: inicio (captura 01, con la decisión de "Categorías" de T050), catálogo, marcas, promociones, sucursales y cómo comprar (08–12), en src/screens/sitio/ con `movilListo`
- [ ] T059 [US8] Entrega 4: Mi perfil y Mis pedidos (registrado/03c, 03d y 06) en src/screens/sitio/Configuracion.tsx con `movilListo`
- [ ] T060 [US8] Piezas nuevas de la v2 en celular: Globo, /escenarios, "Caja gris", etiquetas de envío e IVA fronterizo (src/design-system/components/molecules/Globo.module.css, src/screens/sitio/Escenarios.tsx y las pantallas del pago)
- [ ] T061 [US8] Actualizar docs/autex-real/movil/PLAN.md y docs/autex-real/movil/comparacion/ con cada entrega

**Checkpoint**: el flujo completo funciona en celular sin pantallas reducidas.

---

## Phase 11: Polish y entregables de la fase 2 (sitio real)

**Purpose**: dejar listo lo que recibe el equipo que programará en el sitio.

- [ ] T062 [P] Agregar al catálogo docs/negocio/cambios-demo-vs-autex.html los cambios nuevos de esta v2 frente al sitio, con IDs y su "Hoy" y "Cómo debe quedar": sucursal predefinida, sucursal base, exclusivos de recoger, caja gris, IVA fronterizo, falla de SMC 4.0, globos y escenarios (estos dos solo de la demo); regenerar docs/negocio/cambios-demo-vs-autex.md con `node docs/negocio/cambios-a-md.mjs`
- [ ] T063 [P] Crear docs/negocio/guia-fase-2.md: cómo escribir una spec de programación por tema (Ubicación, Catálogo, Cuenta, Carrito, Pago, Pedidos, Celular) con la plantilla del proyecto, citando IDs del catálogo, la spec 002 y contracts/smc-propuesta.md; las preguntas abiertas (los "Por confirmar" del catálogo y TODO(REPO_SITIO))
- [ ] T064 Resolver con el equipo del sitio los "Por confirmar" de la columna "Hoy" del catálogo y TODO(REPO_SITIO) de .specify/memory/constitution.md; actualizar docs/negocio/cambios-demo-vs-autex.html y regenerar el MD
- [ ] T065 [P] Actualizar docs/figma/CHANGELOG.md y el estado de specs/002-smc4-integracion/spec.md
- [ ] T066 Correr toda la validación de specs/002-smc4-integracion/quickstart.md (pruebas automáticas y tabla de criterios) y anotar el resultado

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: después de Setup; bloquea todas las historias.
- **US1–US4 (P1)**: después de Phase 2. US1 primero (MVP); US2, US3 y US4 pueden ir en paralelo después de US1
  porque leen la misma propuesta.
- **US5–US7 (P2)**: US5 usa los datos de T015 (US1) y T029 (US3); US6 y US7 pueden ir en paralelo con US5.
- **US8 (P3)**: T050 (decisiones) antes de T053–T059; puede avanzar en paralelo con US5–US7 en archivos distintos.
- **Phase 11**: T062 cuando US1–US5 estén listas; T063 en cualquier momento después de Phase 2; T066 al final.

### User Story Dependencies

- **US1**: solo Phase 2.
- **US2**: Phase 2 (y T020, el Globo, de US1).
- **US3**: Phase 2 (y T020).
- **US4**: US1 (etiquetas y caja gris en la propuesta).
- **US5**: US1 (T015) y US3 (T029) para los datos de los escenarios.
- **US6**: US1 y US2 (reglas e IVA que recalcular).
- **US7**: US1 (propuesta con un envío).
- **US8**: Phase 2; las pantallas de cada entrega, después de T050.

### Within Each User Story

- La prueba primero (debe fallar), después datos, cálculo en src/mocks/smc.ts, pantallas y globos.

### Parallel Opportunities

- T002 y T003; T005, T006 y T007.
- Las pruebas [P] de cada historia (todas agregan casos al mismo script, en bloques separados: coordinar el archivo).
- T015 y T020 en US1; T029 en US3; T051 y T052 en US8; T062, T063 y T065 en Phase 11.

---

## Parallel Example: User Story 1

```bash
Task: "T013 [US1] CA8 y CA9 en tests/referencia/escenarios-demo.mjs"
Task: "T015 [US1] Datos de escenarios en src/mocks/configuracion-existencias.json, clientes.ts y catalogo.ts"
Task: "T020 [US1] Molécula Globo en src/design-system/components/molecules/Globo.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 y Phase 2 (un solo cálculo, línea base en verde).
2. Phase 3 (US1): la propuesta completa con su globo y la falla de SMC.
3. **Validar**: CA1, CA2, CA5–CA9 y CA18 en la app y en tests/referencia/escenarios-demo.mjs.
4. Publicar la demo para revisión de negocio.

### Incremental Delivery

1. US2 (IVA y existencias explicadas) → US3 (exclusivos) → US4 (pedido y envíos) → validar y publicar.
2. US5 (escenarios y globos) → US6 → US7 → validar y publicar.
3. US8 por entregas (2, 3 y 4) → validar en celular y publicar.
4. Phase 11: catálogo, guía y preguntas abiertas para la fase 2.

---

## Notes

- Cada tarea cita su archivo; cada historia cita sus criterios de aceptación (Principio VIII).
- Al terminar cada historia: `npm run build`, la regresión de tests/ y, si cambió la UI de escritorio,
  `node tests/visual/compare-all.mjs`.
- Lo que no esté en la spec se propone, no se programa (Principio III).
