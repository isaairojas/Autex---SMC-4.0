# Referencia móvil: autex.com.mx en celular

Capturas del sitio real a 390×844 (Chrome con emulación de celular), tomadas el 2026-10-09.
Son la referencia de la vista móvil de la demo: Figma (Autex_2026_Frames) no tiene pantallas móviles.

Plan acordado con el usuario: primero se copia la vista móvil **tal cual** (cliente invitado y registrado) y después
se le aplican los cambios que ya tiene la demo (D48–D57).

## Scripts

| Script | Qué captura |
|---|---|
| `node tests/referencia/capturar-autex-movil.mjs` | Invitado: páginas públicas, búsqueda, detalle, carrito y "¿Cómo deseas continuar?". Agrega 1 producto a un carrito anónimo. |
| `PAGO=1 node tests/referencia/capturar-autex-movil.mjs` | Además avanza como invitado con datos ficticios hasta el paso 3. **El sitio genera un número de pedido al entrar al pago** (queda sin pagar). |
| `node tests/referencia/cdp-registrado-movil.mjs` | Cliente registrado, con la sesión del usuario en el Chrome de depuración (puerto 9222). Las capturas van a `registrado/`, que git ignora porque tienen datos reales. |

## Medidas

Para copiar sin valores "a ojo", los estilos calculados del sitio en celular (tipografías, colores, tamaños, márgenes,
sombras) están en `medidas/medidas.json` y sus íconos en `medidas/imagenes/` (versiones limpias en `src/assets/movil/`):

| Script | Qué mide |
|---|---|
| `node tests/referencia/medir-autex-movil.mjs` | Invitado: encabezado, menú, pie (con cada sección abierta), WhatsApp flotante, "Mis vehículos" e inicio de sesión. |
| `node tests/referencia/cdp-medir-registrado-movil.mjs` | Con sesión (Chrome de depuración): ícono de cuenta, campana, burbuja del carrito, menú de la cuenta y "Hola" del menú. Va a `registrado/medidas`. |

## Capturas (invitado)

Cada pantalla tiene `NN-nombre.png` (lo que se ve en el celular) y, en las páginas largas, `NN-nombre-completa.png` y
`NN-nombre.txt` (texto visible).

| # | Pantalla del sitio real | Ruta real | En la demo |
|---|---|---|---|
| 01 | Inicio | `/` | `/` (Home) |
| 02 | Menú (hamburguesa) | — | No existe en escritorio |
| 03 | Especialidades | buscador | Buscador del encabezado |
| 04 | Búsqueda por vehículo | `/` | BuscadorVehiculo |
| 05 | Mis vehículos | — | MisVehiculos |
| 06 | Ingresar | `/autenticacion/login/` | ModalLogin (en el sitio real es una página) |
| 07 | Carrito vacío | `/carrito/` | `/carrito` |
| 08 | Catálogo | `/catalogo/` | `/catalogo` |
| 09 | Marcas | `/busqueda-marca/` | `/marcas` |
| 10 | Promociones | `/promociones/` | `/ofertas` |
| 11 | Sucursales | `/sucursales/` | `/sucursales` |
| 12 | Cómo comprar | `/como-comprar/` | `/como-comprar` |
| 13 | Resultados de búsqueda ("bujia") | `/busqueda/?q=…` | `/busqueda` |
| 14 | Filtros | `/busqueda/?q=…` | Filtros |
| 15 | Resultados en lista | `/busqueda/?q=…` | `/busqueda` (vista de lista) |
| 16 | Aviso al agregar al carrito | `/busqueda/?q=…` | Mini-carrito |
| 17 | Detalle de producto | `/<especialidad>/<nombre>/<sku>/` | `/producto/:id` |
| 18 | Carrito con producto | `/carrito/` | `/carrito` |
| 19 | ¿Cómo deseas continuar? | `/carrito/` | ComoContinuar |
| 20 | Pago, paso 1 vacío | `/PasarelaPago/DatosUsuario/` | `/checkout/datos` |
| 21 | Pago, paso 1 con datos ficticios | `/PasarelaPago/DatosUsuario/` | `/checkout/datos` |
| 22 | Pago, paso 2 (método de envío) | `/PasarelaPago/MetodoEnvio/` | `/checkout/envio` |
| 23 | Pago, paso 3 (método de pago) | `/PasarelaPago/MetodoPago/` | `/checkout/pago` |

## Capturas (cliente registrado)

En `registrado/` (solo en la computadora del usuario: tienen sus datos reales). Se tomaron el 2026-10-09 con
`cdp-registrado-movil.mjs`.

| # | Pantalla del sitio real | Ruta real | En la demo |
|---|---|---|---|
| 01 | Inicio con sesión | `/` | `/` |
| 02 | Menú con sesión ("Hola, nombre", Mis listas, Historial de pedidos, Cerrar sesión) | — | No existe en escritorio |
| 03 | Menú de la cuenta (Mi perfil, Mis pedidos, Salir) | — | Menú de la cuenta |
| 03b | Notificaciones (campana) | — | No existe en la demo |
| 03c | Mi perfil (pestañas Mi perfil, Dirección de envío, Método de pago) | `/configuracion/perfil/` | `/configuracion/perfil` |
| 03d | Mis pedidos | `/historial-de-pedidos/` | `/configuracion/pedidos` |
| 04 | Mis vehículos | — | MisVehiculos |
| 05 | Mis listas (vacío, "Crear una lista") | `/mis-listas/` | No existe en la demo |
| 06 | Historial de pedidos | `/historial-de-pedidos/` | `/configuracion/pedidos` |
| 07 | Carrito con sesión | `/carrito/` | `/carrito` |
| 08 | Pago, paso 1: "Selecciona una dirección" (guardadas, Editar, Añadir) | `/PasarelaPago/DatosUsuario/` | `/checkout/datos` |
| 09 | Pago, paso 2 | `/PasarelaPago/MetodoEnvio/` | `/checkout/envio` |
| 10 | Pago, paso 3: "Selecciona un método de pago" (solo Tarjetas) | `/PasarelaPago/MetodoPago/` | `/checkout/pago` |

Pendiente: el paso 4 (Confirmación) de los dos flujos. El sitio solo acepta tarjeta en el paso 3 y no se escriben
datos de tarjeta; en celular el paso 4 se armará con el diseño de escritorio de la demo.

## Comparación con la demo

`comparacion/` tiene cada pantalla de la entrega 1 lado a lado (sitio real | demo): inicio, menú, "Mis vehículos" e
inicio de sesión. En la demo, el contenido de las pantallas que aún no tienen vista de celular se ve reducido.

## Lo que se observó (2026-10-09)

- El sitio pasa a la vista móvil por debajo de 768 px (su regla de CSS más usada es `max-width: 768px`).
- Encabezado: franja azul (envío gratis y teléfonos), luego menú, logo corto, "Mis vehículos", "Ingresar" y carrito;
  debajo, el buscador con "Especialidades" y "Búsqueda por vehículo" plegable.
- El menú agrupa Ingresar, Marcas, Promociones, Empresa (¿Quiénes somos?, Sucursales) y Ayuda.
- "Especialidades" abre la lista propia del celular, que no aparece en la captura.
- El pie de página va en acordeones y hay un botón flotante de WhatsApp en todas las páginas.
- El pago muestra primero el resumen (Detalle de pedido, cupón y Resumen de productos) y después el número de pedido,
  los 4 pasos y el formulario.
- El paso 1 del invitado muestra un nombre de ejemplo: "Enrique Quiñonez / Taller Chapalita".
- Paso 2: solo "Envío a domicilio (Entrega inmediata)", $249.00 y "Agrega $… a tu pedido para envío sin costo".
- Paso 3 del invitado: solo tarjeta de crédito o débito. Como no se escriben datos de tarjeta, el paso 4 del invitado
  no se capturó.
- Pedidos sin pagar que se generaron al capturar como invitado: #1198951, #1199066 y #1199077. El registrado
  reutiliza su pedido pendiente (no se generaron pedidos nuevos).
- Con sesión, "Ingresar" se vuelve un ícono de cuenta (Mi perfil, Mis pedidos, Salir) y aparece una campana de
  notificaciones ("Mostrar no leídos", Cancel / OK).
