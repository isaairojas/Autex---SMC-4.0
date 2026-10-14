# Vista de celular: plan y pendientes

Barrido del 2026-10-09 después de la entrega 1. Cruza tres fuentes: las capturas del sitio real en celular
(`docs/autex-real/movil`), la lista de cambios de la demo contra autex.com.mx (`docs/negocio/cambios-demo-vs-autex.html`)
y un recorrido de la demo a 390 px.

Plan acordado (D58): primero se copia tal cual la vista de celular del sitio (invitado y registrado) y después se le
aplican los cambios de la demo. Mientras una pantalla no tiene su vista de celular, su versión de escritorio se ve
reducida.

## 1. Ya está (entrega 1: marco y navegación)

- [x] Encabezado: franja, menú, logo, "Mis vehículos", "Ingresar" (o cuenta y campana con sesión), carrito con burbuja
      y buscador con "Especialidades".
- [x] Menú de hamburguesa con y sin sesión; pie plegable; botón flotante de WhatsApp.
- [x] "Mis vehículos" de una columna; inicio de sesión a pantalla completa; menú de la cuenta.
- [x] En celular no hay mini-carrito: el carrito del encabezado abre su página.
- [x] Pantallas de carga, aviso temporal, "Elige una tienda" y paneles de ubicación a todo el ancho.

## 2. Ajustes encontrados en la entrega 1

- [ ] **Agregar al carrito no da ningún aviso**: se quitó el mini-carrito y todavía no está el aviso del sitio
      ("Se agregó correctamente al carrito", captura 16). Solo cambia la burbuja del carrito.
- [ ] **Panel "Selecciona una tienda"**: el selector de estado se sale por la derecha (la fila no se parte).
- [ ] **Franja**: "(Aplica restricciones)" la parte en 3 líneas (en el sitio son 2).
- [ ] **Recargar la página reinicia la demo** (carrito, sesión y ubicación) y vuelve a pedir la ubicación. En celular
      pasa más seguido: al jalar la página hacia abajo o al volver de otra aplicación.
- [x] "Especialidades": en el sitio real en celular su lista no abre (ni al tocar ni al pasar encima); en la demo sí
      abre, con la lista de escritorio y estilo de celular.

## 3. El sitio real cambió desde la copia de escritorio (2026-10-05)

| Qué | Sitio hoy | Demo |
|---|---|---|
| Inicio | "Categorías" (7: Carga y arranque, Eléctricos, Fuel injection, Iluminación y cable, Herramientas, Motopartes, Heavy duty) y "Todas las categorías" | "Explora por especialidad" (5) |
| Menú y barra | "Promociones" | "Ofertas" en escritorio; "Promociones" en celular |
| Franja | "Compras mayores a $1500 MXN" | Su configuración (D57) |
| WhatsApp | 33 1602 5603 | 33 2835 9694 (se mantiene, D57) |

## 4. Copia tal cual pendiente

### Entrega 2: compra
| Pantalla | Captura del sitio | Notas |
|---|---|---|
| "Búsqueda por vehículo" plegable | 04 | Va en inicio, resultados y detalle |
| Resultados | 13 | Tarjetas en 2 columnas: SKU, nombre, precio, estado, −/+, "Añadir al carrito", "Si le queda" |
| Filtros | 14 | Panel a pantalla completa: Vehículo, Especialidad, Categoría… |
| Vista de lista | 15 | |
| Aviso al agregar | 16 | Arriba, con SKU, nombre, precio y "Se agregó correctamente al carrito" |
| Detalle | 17 | SKU y No. Original, nombre, precio, imágenes con flechas y miniaturas |
| Carrito vacío | 07 | "¡Hola, bienvenido a Autex! Tu carrito de compras está vacío" y "Seguir navegando" |
| Carrito con productos | 18, registrado/07 | "Resumen de compra" arriba (productos, subtotal, "Proceder al pago", "Continuar comprando") y abajo los productos y "Tus productos" |
| ¿Cómo deseas continuar? | 19 | Ventana centrada |

### Entrega 3: pago
| Pantalla | Captura del sitio | Notas |
|---|---|---|
| Paso 1 invitado | 20, 21 | El sitio pone primero el resumen (Detalle de pedido, cupón, Resumen de productos plegable) y después el número de pedido, los 4 pasos y el formulario |
| Paso 1 registrado | registrado/08 | "Selecciona una dirección" con las guardadas, "Editar dirección" y "Añadir dirección" |
| Paso 2 | 22, registrado/09 | Solo "Envío a domicilio (Entrega inmediata)", $249.00 y "Agrega $… para envío sin costo" |
| Paso 3 | 23, registrado/10 | Solo tarjeta |
| Paso 4 y gracias | — | Sin captura (el sitio solo acepta tarjeta): se arman con el diseño de la demo |

### Entrega 4: resto del sitio y cuenta
| Pantalla | Captura del sitio |
|---|---|
| Inicio | 01 |
| Catálogo, Marcas, Promociones, Sucursales, Cómo comprar | 08 a 12 |
| Mi perfil (pestañas Mi perfil, Dirección de envío, Método de pago) | registrado/03c |
| Mis pedidos / Historial de pedidos | registrado/03d, registrado/06 |
| Mis listas | 05 (no existe en la demo) |

## 5. Cambios de la demo por aplicar en celular

Marcas: **✔** ya funciona en celular (es lógica o ya quedó en la entrega 1) · **⚙** se adapta al llevar su pantalla a
celular · **?** necesita una decisión (el sitio no tiene referencia).

### Ubicación y tienda
- **?** "Mi tienda" y "Entrega en" en el encabezado de celular. Hoy en celular solo se llega a ellos con "Elige una tienda"
  al entrar y con "Cambiar" en el carrito.
- **?** Aviso de ubicación al entrar: en celular se ve como el aviso de Chrome de escritorio, encima del encabezado.
- **⚙** Paneles "Ubicación de entrega" y "Selecciona una tienda": ya a todo el ancho (falta el selector de estado).
- **✔** Tienda de otro estado, ajuste del carrito al cambiar tienda o C.P. (con aviso temporal), ubicación inicial,
  niveles de servicio y tiendas que surten cada entrega.
- **⚙** Página de sucursales ordenada por distancia con "Hacer mi tienda" (entrega 4).

### Vehículos
- **✔** Navegación sin vehículo y ventana "Mis vehículos".
- **?** Con un vehículo activo, en escritorio dice "Buscando para…"; en celular no se capturó y hoy sigue diciendo
  "Mis vehículos".

### Catálogo y existencias (entrega 2)
- **⚙** Tarjeta: existencia por rangos (+100, +50…), "Disponible bajo pedido", sin existencia con "Avisar
  disponibilidad", cantidad escrita con "Validando existencias", tope de piezas y su aviso.
- **⚙** Filtro "Mostrar productos no disponibles" dentro del panel de filtros; total de resultados y paginado reales.
- **⚙** Detalle: "Disponibilidad" (piezas en línea y en "Mi tienda"), "Existencia en otra región", migas de pan,
  "Agregado al carrito" y "Comprados juntos" que agrega.
- **?** "Buscar en otra tienda": en escritorio es una barra a la derecha; en celular hoy se ve diminuta.
- **✔** Baterías, CEDIS fuera de la venta en línea, productos de sucursales foráneas, existencias coherentes.

### Carrito (entrega 2)
- **?** Dónde van en el carrito de celular los bloques de la demo: por producto, piezas en línea y en "Mi tienda" con
  "Enviar a domicilio" / "Recoger en tienda"; "Enviar todo a domicilio" / "Recoger todo en tienda"; "Zona" o
  "Dirección de entrega" y "Recoger en tienda" con "Cambiar"; grupos "Productos disponibles" y "Productos bajo pedido".
- **⚙** Sin existencia bloquea el pago; detalle desde el carrito; tope al recoger; registrado directo a Confirmación.
- **⚙** "¿Cómo deseas continuar?" hoy se ve diminuta arriba (está dentro de la pantalla reducida).

### Pago (entrega 3)
- **?** Encabezado: el sitio en celular muestra el encabezado completo; la demo en escritorio solo deja el logo y
  "Volver al carrito" (D52).
- **⚙** Sin número de pedido antes de pagar (el sitio lo muestra) y sin costo de envío (el sitio cobra $249).
- **⚙** Indicador de 4 pasos que abre cualquier paso ya visitado.
- **⚙** Paso 1: "Requiero factura", pedido solo para recoger ("¿Quién recoge el pedido?"), "Buscar dirección" con
  sugerencias, datos que se conservan al regresar; el registrado ve el formulario lleno con sus direcciones (el sitio
  muestra "Selecciona una dirección").
- **⚙** Cambio de dirección en cualquier paso con su confirmación y la leyenda amarilla; regreso al carrito si algo se
  queda sin existencia.
- **⚙** Paso 2 y Confirmación: fechas en días hábiles, envíos múltiples plegables, "Recoger en tienda" aparte,
  facturación solo si se pidió, "Cambiar" en cada bloque.
- **⚙** Paso 3: tarjeta del invitado vacía, tarjeta predeterminada del registrado y "Tienda de autoservicio" (el sitio
  en celular solo ofrece tarjeta).

### Pedidos y cuenta (entregas 3 y 4)
- **⚙** Gracias con el número de pedido y la tienda de autoservicio; "Seguir comprando" sin cerrar sesión.
- **⚙** Mis pedidos (con la tienda cuando se recoge); Mi perfil con direcciones (colonia por C.P., predeterminada,
  eliminar) y tarjeta predeterminada.
- **✔** Menú de la cuenta e inicio de sesión que regresa a la página principal.

### General
- **✔** Pantallas de carga y franja configurable.
- **⚙** Textos corregidos ("Tienda de autoservicio", "días hábiles", año actual…): se aplican al llevar cada pantalla.
- No aplica: ajuste al zoom (solo escritorio).

## 6. Decisiones pendientes

1. Lugar de "Mi tienda" y "Entrega en" en el encabezado de celular.
2. Aviso de ubicación al entrar en celular.
3. "Buscar en otra tienda" en celular.
4. Orden del carrito en celular con los bloques de la demo.
5. Encabezado de la pasarela de pago en celular.
6. Si la copia se actualiza a lo que el sitio tiene hoy (sección 3), solo en celular o también en escritorio.
7. Si el estado de la demo se conserva al recargar la página.
