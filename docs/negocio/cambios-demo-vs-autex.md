# Cambios de la demo frente a autex.com.mx

Corte: 14 de octubre de 2026. 54 cambios. Se genera desde `cambios-demo-vs-autex.html` (la fuente): no editar a mano;
para actualizarlo, editar el HTML y correr `node docs/negocio/cambios-a-md.mjs`.

Tipos: **Nuevo** (no existe en el sitio actual) · **Ajuste** (existe en el sitio, pero cambia) · **Regla** (regla de
existencias, tiendas o envíos que decide el cálculo, no una pantalla). "Origen" es la decisión de la demo en
`docs/figma/discrepancias.md`.

## Índice

| ID | Cambio | Tipo | Tema |
|---|---|---|---|
| UBI-01 | Aviso de ubicación al entrar | Nuevo | Ubicación y tienda |
| UBI-02 | "Mi tienda" en la barra superior | Nuevo | Ubicación y tienda |
| UBI-03 | "Entrega en" (código postal o dirección) | Nuevo | Ubicación y tienda |
| UBI-04 | Tienda de otro estado | Regla | Ubicación y tienda |
| UBI-05 | Cambiar de tienda o de C.P. ajusta el carrito | Regla | Ubicación y tienda |
| UBI-06 | Ubicación inicial | Regla | Ubicación y tienda |
| UBI-07 | Niveles de servicio y fechas de entrega | Regla | Ubicación y tienda |
| UBI-08 | Tiendas que surten cada entrega | Regla | Ubicación y tienda |
| UBI-09 | Página de sucursales | Ajuste | Ubicación y tienda |
| CAT-01 | Ocultar productos sin existencia | Ajuste | Catálogo y existencias |
| CAT-02 | Existencia por rangos | Ajuste | Catálogo y existencias |
| CAT-03 | Cantidad escrita y tope de compra en línea | Ajuste | Catálogo y existencias |
| CAT-04 | Baterías solo de tiendas cercanas | Regla | Catálogo y existencias |
| CAT-05 | Venta bajo pedido desde la sucursal foránea | Regla | Catálogo y existencias |
| CAT-06 | CEDIS fuera de la venta en línea | Regla | Catálogo y existencias |
| CAT-07 | Disponibilidad en el detalle | Nuevo | Catálogo y existencias |
| CAT-08 | Buscar en otra tienda | Nuevo | Catálogo y existencias |
| CAT-09 | Una sola fuente de existencias | Regla | Catálogo y existencias |
| CAT-10 | Confirmación al agregar y "Comprados juntos" | Ajuste | Catálogo y existencias |
| CTA-01 | Dirección predeterminada al iniciar sesión | Regla | Cuenta |
| CTA-02 | Direcciones en Mi perfil | Ajuste | Cuenta |
| CTA-03 | Iniciar sesión | Ajuste | Cuenta |
| CTA-04 | Tarjeta predeterminada | Nuevo | Cuenta |
| CAR-01 | Enviar a domicilio o recoger en tienda | Nuevo | Carrito |
| CAR-02 | Zona o dirección de entrega y tienda de recolección | Nuevo | Carrito |
| CAR-03 | Carrito agrupado por disponibilidad | Ajuste | Carrito |
| CAR-08 | Cantidad mínima y eliminar | Regla | Carrito |
| CAR-09 | Monto máximo de compra | Regla | Carrito |
| CAR-04 | Tope al recoger en tienda | Regla | Carrito |
| CAR-05 | Detalle desde el carrito | Ajuste | Carrito |
| CAR-06 | Conteo de piezas y guardados | Regla | Carrito |
| CAR-07 | Registrado directo a Confirmación | Nuevo | Carrito |
| PAG-01 | Pago sin franja ni barra de navegación | Ajuste | Pago |
| PAG-02 | Número de pedido al pagar | Ajuste | Pago |
| PAG-03 | Moverse entre pasos | Ajuste | Pago |
| PAG-04 | Factura opcional | Ajuste | Pago |
| PAG-05 | Pedido solo para recoger | Nuevo | Pago |
| PAG-06 | Datos del cliente en el paso 1 | Ajuste | Pago |
| PAG-07 | Cambio de dirección en cualquier paso | Nuevo | Pago |
| PAG-08 | No se pagan artículos sin existencia | Regla | Pago |
| PAG-09 | Recoger en tienda en el pago | Nuevo | Pago |
| PAG-10 | Sin costo de envío | Ajuste | Pago |
| PAG-11 | Envíos múltiples | Nuevo | Pago |
| PAG-12 | Reglas para dividir el pedido | Regla | Pago |
| PAG-13 | Confirmación por envío y facturación | Ajuste | Pago |
| PAG-14 | Pago en tienda de autoservicio | Nuevo | Pago |
| PAG-15 | Tarjeta del invitado | Ajuste | Pago |
| PED-01 | Mis pedidos | Ajuste | Pedidos |
| PED-02 | Después de comprar | Regla | Pedidos |
| GEN-01 | Diseño Autex 2026 | Ajuste | Experiencia general |
| GEN-02 | Pantallas de carga | Nuevo | Experiencia general |
| GEN-03 | Franja de envío gratis | Ajuste | Experiencia general |
| GEN-04 | Textos | Ajuste | Experiencia general |
| CEL-01 | Vista de celular | Ajuste | Celular |

## Ubicación y tienda

### UBI-01 · Aviso de ubicación al entrar (Nuevo)

- **Hoy en autex.com.mx:** No pide la ubicación ni elige una tienda al entrar.
- **Cómo debe quedar:** Al entrar, el navegador pregunta si el sitio puede conocer la ubicación. Si el cliente lo permite, la página se recarga con su tienda más cercana como "Mi tienda". Si cierra el aviso, Autex muestra "Elige una tienda" con "Usar mi ubicación" y "Elegir tienda manualmente" (pide primero el C.P. y luego muestra las tiendas de ese estado). "No permitir nunca" solo cierra el aviso y ya no se vuelve a preguntar.
- **Pantallas:** Todas, al entrar al sitio
- **Celular:** Pendiente: cómo se ve el aviso en celular.
- **Origen:** D31

### UBI-02 · "Mi tienda" en la barra superior (Nuevo)

- **Hoy en autex.com.mx:** La barra tiene "Sucursales", que lleva a la lista de tiendas; no hay una tienda elegida.
- **Cómo debe quedar:** Muestra la tienda elegida y si está abierta o a qué hora abre. Al abrirla aparece la lista de tiendas del estado de la entrega, ordenadas por distancia, con su nivel de servicio y tiempo de entrega; se puede buscar por nombre, id o dirección y elegir otro estado. No se muestra el costo logístico.
- **Pantallas:** Barra superior (todas las páginas salvo el pago)
- **Celular:** Pendiente: el sitio en celular no tiene este botón; falta decidir dónde va.
- **Origen:** D31, D57

### UBI-03 · "Entrega en" (código postal o dirección) (Nuevo)

- **Hoy en autex.com.mx:** No existe; el código postal solo se captura en el pago.
- **Cómo debe quedar:** Botón junto a "Mi tienda" con el C.P. de entrega; el registrado con dirección guardada ve "Entrega en" con su C.P. y el nombre de la dirección. El invitado escribe su C.P., usa su ubicación actual o inicia sesión; el registrado elige entre sus direcciones guardadas, las administra o agrega una nueva. Al cambiarlo se recalculan las tiendas, las existencias y los tiempos de entrega.
- **Pantallas:** Barra superior
- **Celular:** Pendiente, igual que "Mi tienda".
- **Origen:** D31, D33

### UBI-04 · Tienda de otro estado (Regla)

- **Hoy en autex.com.mx:** No aplica: no se elige tienda.
- **Cómo debe quedar:** Elegir una tienda de otro estado solo cambia dónde se recoge: la dirección de entrega no cambia y el registrado conserva su dirección guardada.
- **Pantallas:** "Mi tienda", "Buscar en otra tienda"
- **Celular:** Igual.
- **Origen:** D57 (reemplaza a D47)

### UBI-05 · Cambiar de tienda o de C.P. ajusta el carrito (Regla)

- **Hoy en autex.com.mx:** No aplica.
- **Cómo debe quedar:** Al cambiar de tienda o de C.P. se revisa todo el carrito: lo que se recoge, contra las piezas de la nueva tienda (si no las tiene, pasa a domicilio); lo que va a domicilio, contra la existencia en línea del nuevo C.P. Un aviso temporal resume lo que cambió, por ejemplo "Actualizamos tu carrito con las existencias de tu nueva ubicación: 1 ajustado y 1 sin existencia".
- **Pantallas:** Barra superior, carrito
- **Celular:** Igual; el aviso temporal ya ocupa el ancho de la pantalla.
- **Origen:** D57

### UBI-06 · Ubicación inicial (Regla)

- **Hoy en autex.com.mx:** No aplica.
- **Cómo debe quedar:** Mientras el cliente no elige otra, la entrega usa un C.P. predeterminado y su tienda. En la demo son el C.P. 45138 y la tienda Tesistán (Zapopan); para el sitio falta definir cuál.
- **Pantallas:** Todas
- **Celular:** Igual.
- **Origen:** D31

### UBI-07 · Niveles de servicio y fechas de entrega (Regla)

- **Hoy en autex.com.mx:** El pago ofrece "Envío a domicilio (Entrega inmediata)" con "Tiempo de entrega estimado de 24 a 48 horas".
- **Cómo debe quedar:** Local, hasta 15 km: entrega hoy si se compra antes de las 2:00 p.m.; si no, el siguiente día hábil ("Entrega mañana"). Local Extendido, hasta 30 km: 2 días hábiles después de la compra (compra el miércoles, entrega el viernes). Foráneo, hasta 350 km: solo cuenta la sucursal foránea más cercana y lo que sale de ella se vende bajo pedido, de 2 a 4 días hábiles (compra el miércoles, entrega entre el viernes y el martes). Las fechas no cuentan sábados, domingos ni días de descanso obligatorio. Cada envío dice su fecha ("Entrega hoy", "Entrega mañana", "Entrega el viernes 9 de octubre" o "Entrega entre el martes 13 y el jueves 15 de octubre") y el encabezado de cada sección da el rango de sus envíos.
- **Pantallas:** "Mi tienda", detalle, pago (pasos 2 y 4), Mis pedidos
- **Celular:** Igual.
- **Origen:** D44, D57

### UBI-08 · Tiendas que surten cada entrega (Regla)

- **Hoy en autex.com.mx:** Por confirmar con el equipo del sitio.
- **Cómo debe quedar:** Las existencias en línea, "Buscar en otra tienda" y los envíos solo usan las tiendas Local y Local Extendido de la dirección (hasta 30 km) más la sucursal foránea más cercana. El número de foráneas es configurable (1 por defecto), así que el pedido tiene cuando mucho un envío foráneo. Una configuración dice qué sucursales no venden en línea (por ejemplo, Mercado Libre Adolf Horn): no aparecen en ninguna lista ni surten envíos.
- **Pantallas:** Catálogo, detalle, carrito, pago, "Mi tienda", sucursales
- **Celular:** Igual.
- **Origen:** D49, D59

### UBI-09 · Página de sucursales (Ajuste)

- **Hoy en autex.com.mx:** Lista de tiendas con búsqueda por estado, ciudad o C.P.; cada una con dirección, si está abierta, horario, "Pickup disponible", teléfono y "Cómo llegar".
- **Cómo debe quedar:** Las tiendas se ordenan por distancia a la entrega, con kilómetros, nivel de servicio, tiempo de entrega y el botón "Hacer mi tienda".
- **Pantallas:** Sucursales
- **Celular:** Pendiente de llevar a celular (entrega 4 del plan).
- **Origen:** D30, D31

## Catálogo y existencias

### CAT-01 · Ocultar productos sin existencia (Ajuste)

- **Hoy en autex.com.mx:** Los resultados muestran los productos sin existencia con "No disponible" y "Avisar disponibilidad".
- **Cómo debe quedar:** Los resultados solo muestran lo que se puede comprar en la zona del cliente. Al final de los filtros, "Disponibilidad · Mostrar productos no disponibles (N)" los muestra, con "Avisar disponibilidad".
- **Pantallas:** Búsqueda, promociones, filtros
- **Celular:** El filtro va dentro del panel "Filtros".
- **Origen:** D34

### CAT-02 · Existencia por rangos (Ajuste)

- **Hoy en autex.com.mx:** La tarjeta dice "Producto disponible" o "No disponible", sin número de piezas.
- **Cómo debe quedar:** Junto a "Disponible" se muestran las piezas para compra en línea por rangos: +100, +50, +30, +10, o la cantidad exacta si hay menos de 10.
- **Pantallas:** Búsqueda, promociones
- **Celular:** Igual en la tarjeta de dos columnas.
- **Origen:** D34

### CAT-03 · Cantidad escrita y tope de compra en línea (Ajuste)

- **Hoy en autex.com.mx:** La cantidad se cambia con − y +.
- **Cómo debe quedar:** En la tarjeta, el detalle y el carrito el cliente puede escribir la cantidad, además de usar − y +. No puede pasar de las piezas para compra en línea menos las que ya tiene en el carrito (o de las de su tienda, si recoge): al escribir de más aparece la carga "Validando existencias" y la cantidad vuelve al máximo con el aviso "Solo hay N piezas disponibles para compra en línea". El "+" se desactiva al llegar al máximo, y si ya están todas en el carrito "Agregar al carrito" se desactiva.
- **Pantallas:** Búsqueda, detalle, carrito
- **Celular:** Igual.
- **Origen:** D39, D48, D55

### CAT-04 · Baterías solo de tiendas cercanas (Regla)

- **Hoy en autex.com.mx:** Por confirmar con el equipo del sitio.
- **Cómo debe quedar:** Las baterías solo se venden con existencias de tiendas Local o Local Extendido (hasta 30 km): nunca bajo pedido ni de CEDIS. Fuera de ese alcance aparecen sin existencia (por ejemplo, en Zacatecas).
- **Pantallas:** Catálogo, detalle, carrito
- **Celular:** Igual.
- **Origen:** D39, D41

### CAT-05 · Venta bajo pedido desde la sucursal foránea (Regla)

- **Hoy en autex.com.mx:** Por confirmar con el equipo del sitio.
- **Cómo debe quedar:** Si las tiendas de la zona (hasta 30 km) no completan la cantidad pero la sucursal foránea más cercana sí, el producto se vende "Disponible bajo pedido", con entrega de 2 a 4 días hábiles y la leyenda "Este producto está disponible en otra zona. El envío puede tardar más de lo normal." (no se habla de sucursales foráneas: es un término operativo). Se recalcula con la cantidad, también desde la tarjeta: el filtro de aire tiene 1 pieza en Tesistán, así que con 1 está disponible y con 2 pasa a bajo pedido; la marcha no tiene piezas en la zona y es bajo pedido desde la primera. En el pago, las tiendas de la zona envían lo que tienen con su tiempo normal y solo lo que falta sale bajo pedido de la foránea.
- **Pantallas:** Búsqueda, detalle, carrito, pago
- **Celular:** Igual.
- **Origen:** D44, D46, D59

### CAT-06 · CEDIS fuera de la venta en línea (Regla)

- **Hoy en autex.com.mx:** Por confirmar con el equipo del sitio.
- **Cómo debe quedar:** La venta en línea solo cuenta las piezas de las tiendas. Lo que únicamente tiene CEDIS aparece sin existencia y se oculta en los resultados. CEDIS nunca es origen de un envío.
- **Pantallas:** Catálogo, detalle, carrito, pago
- **Celular:** Igual.
- **Origen:** D45

### CAT-07 · Disponibilidad en el detalle (Nuevo)

- **Hoy en autex.com.mx:** El detalle muestra precio, cantidad y "Añadir al carrito", sin piezas por tienda.
- **Cómo debe quedar:** Sección "Disponibilidad" con las piezas para compra en línea y las piezas físicas en "Mi tienda", más "Buscar en otra tienda". No se muestran pasillo ni bahía. Si el producto solo se consigue en la sucursal foránea, o la cantidad supera lo que hay en las tiendas de la zona, el detalle dice: "No encontramos este producto en las tiendas de tu zona. Lo enviaremos desde otra región y podría tardar más de lo normal. *Entrega estimada de 2 a 4 días hábiles"; en el carrito se muestra bajo pedido.
- **Pantallas:** Detalle, carrito
- **Celular:** Igual.
- **Origen:** D34, D45, D59

### CAT-08 · Buscar en otra tienda (Nuevo)

- **Hoy en autex.com.mx:** No existe.
- **Cómo debe quedar:** Desde la disponibilidad del detalle se abre una barra con "Mi tienda" primero y las tiendas cercanas que tienen el producto: abierta o cerrada, piezas disponibles, dirección, teléfono, mapa y "Seleccionar tienda". Al pie, "Cambiar dirección" lleva al C.P. o a la dirección de entrega.
- **Pantallas:** Detalle
- **Celular:** Pendiente: en escritorio es una barra a la derecha.
- **Origen:** D43

### CAT-09 · Una sola fuente de existencias (Regla)

- **Hoy en autex.com.mx:** Por confirmar con el equipo del sitio.
- **Cómo debe quedar:** "Mi tienda", la compra en línea, "Buscar en otra tienda" y los envíos usan las mismas existencias por tienda: cada tienda del país con sus piezas.
- **Pantallas:** Catálogo, detalle, carrito, pago
- **Celular:** Igual.
- **Origen:** D41

### CAT-10 · Confirmación al agregar y "Comprados juntos" (Ajuste)

- **Hoy en autex.com.mx:** En celular, al agregar aparece arriba el aviso "Se agregó correctamente al carrito".
- **Cómo debe quedar:** En escritorio, agregar desde la búsqueda abre el mini-carrito con lo agregado (diseño 2026); en el detalle, "Añadir al carrito" cambia a "Agregado al carrito". En "Comprados juntos", "Añadir productos al carrito" agrega los productos marcados que tienen piezas.
- **Pantallas:** Búsqueda, detalle
- **Celular:** Sin mini-carrito, como el sitio: al agregar se muestra su aviso y el carrito abre su página.
- **Origen:** D57, D58

## Cuenta

### CTA-01 · Dirección predeterminada al iniciar sesión (Regla)

- **Hoy en autex.com.mx:** No aplica: no hay "Entrega en".
- **Cómo debe quedar:** Al iniciar sesión, la entrega cambia a la dirección predeterminada del cliente y se recalculan tiendas y existencias.
- **Pantallas:** Barra superior, carrito
- **Celular:** Igual.
- **Origen:** D33

### CTA-02 · Direcciones en Mi perfil (Ajuste)

- **Hoy en autex.com.mx:** Mi perfil tiene "Dirección de envío" con las direcciones guardadas, "Editar dirección" y "Añadir dirección".
- **Cómo debe quedar:** Se agregan "Usar como predeterminada" y "Eliminar". La nueva dirección elige la colonia según el C.P. y llena ciudad y estado solos. Si se elimina la dirección de entrega que se está usando, la entrega pasa a la predeterminada; sin direcciones, regresa al C.P. inicial.
- **Pantallas:** Mi perfil
- **Celular:** Pendiente de llevar a celular (entrega 4 del plan).
- **Origen:** D33

### CTA-03 · Iniciar sesión (Ajuste)

- **Hoy en autex.com.mx:** El inicio de sesión es una página aparte. A dónde regresa después: por confirmar con el equipo del sitio.
- **Cómo debe quedar:** En el diseño 2026 el inicio de sesión es una ventana. Al iniciar sesión el cliente siempre regresa a la página principal, sin importar desde dónde entró (barra superior, carrito o pago).
- **Pantallas:** Barra superior, carrito, pago
- **Celular:** Ocupa toda la pantalla, como la página del sitio.
- **Origen:** D57, D58

### CTA-04 · Tarjeta predeterminada (Nuevo)

- **Hoy en autex.com.mx:** Mi perfil tiene "Método de pago". Tarjeta predeterminada: por confirmar con el equipo del sitio.
- **Cómo debe quedar:** El registrado tiene una tarjeta predeterminada: aparece marcada y elegida de inicio en el paso 3, se cambia en Mi perfil → Método de pago o con "Usar esta tarjeta como predeterminada" al pagar, y es la que usa la confirmación directa (CAR-07).
- **Pantallas:** Mi perfil, pago (pasos 3 y 4)
- **Celular:** Igual.
- **Origen:** D57

## Carrito

### CAR-01 · Enviar a domicilio o recoger en tienda (Nuevo)

- **Hoy en autex.com.mx:** No se elige en el carrito; el pago solo ofrece "Envío a domicilio".
- **Cómo debe quedar:** Cada producto muestra cuántas piezas hay para compra en línea y cuántas en "Mi tienda", y el cliente elige "Enviar a domicilio" o "Recoger en tienda". Recoger usa solo las piezas de su tienda: si pidió más, la cantidad se ajusta con aviso; si la tienda no lo tiene, la opción dice "No disponible en tu tienda". Para todo el pedido hay "Enviar todo a domicilio" y "Recoger todo en tienda" (solo en la tienda seleccionada); lo que la tienda no tiene se queda a domicilio y se avisa. Cada cambio muestra la carga "Calculando disponibilidad en tienda".
- **Pantallas:** Carrito
- **Celular:** Pendiente: el orden de los bloques en el carrito de celular.
- **Origen:** D43

### CAR-02 · Zona o dirección de entrega y tienda de recolección (Nuevo)

- **Hoy en autex.com.mx:** No existe.
- **Cómo debe quedar:** Si algo va a domicilio, el carrito muestra a dónde se entrega: el registrado con dirección guardada ve esa dirección ("Dirección de entrega"); el invitado y el registrado sin direcciones ven "Zona de entrega" con la ciudad y sus alrededores (por ejemplo, "Guadalajara y sus alrededores") y el C.P. Si algo se recoge, muestra aparte "Recoger en tienda" con la sucursal. Con un pedido mixto se ven las dos, cada una con "Cambiar".
- **Pantallas:** Carrito
- **Celular:** Pendiente, con CAR-01.
- **Origen:** D43, D55

### CAR-03 · Carrito agrupado por disponibilidad (Ajuste)

- **Hoy en autex.com.mx:** Una sola lista de productos, cada uno con su estado ("Producto disponible").
- **Cómo debe quedar:** Los productos se agrupan en "Productos disponibles" y "Productos bajo pedido". Los que no tienen existencia en la zona bloquean el pago hasta eliminarlos o guardarlos para más tarde.
- **Pantallas:** Carrito
- **Celular:** Igual.
- **Origen:** D44, D57

### CAR-08 · Cantidad mínima y eliminar (Regla)

- **Hoy en autex.com.mx:** Por confirmar con el equipo del sitio.
- **Cómo debe quedar:** Bajar la cantidad con "−" o escribir 0 deja el producto en 1 pieza: no se elimina. Para quitarlo del carrito está "Eliminar".
- **Pantallas:** Carrito
- **Celular:** Igual.
- **Origen:** D59

### CAR-09 · Monto máximo de compra (Regla)

- **Hoy en autex.com.mx:** Por confirmar con el equipo del sitio.
- **Cómo debe quedar:** Si el total del carrito supera $70,000 (configurable), aparece "El total de tu compra no puede superar $70,000.00. Ajusta las cantidades o elimina productos para continuar." y no se puede pasar al pago.
- **Pantallas:** Carrito
- **Celular:** Igual.
- **Origen:** D59

### CAR-04 · Tope al recoger en tienda (Regla)

- **Hoy en autex.com.mx:** No aplica.
- **Cómo debe quedar:** Si un producto se recoge en tienda, agregar más piezas desde el catálogo o el detalle no pasa de las piezas de esa tienda: la cantidad se ajusta con un aviso y el producto no queda sin existencia.
- **Pantallas:** Catálogo, detalle, carrito
- **Celular:** Igual.
- **Origen:** D57

### CAR-05 · Detalle desde el carrito (Ajuste)

- **Hoy en autex.com.mx:** Por confirmar con el equipo del sitio.
- **Cómo debe quedar:** La imagen y el nombre de cada producto del carrito abren su detalle.
- **Pantallas:** Carrito
- **Celular:** Igual.
- **Origen:** D56

### CAR-06 · Conteo de piezas y guardados (Regla)

- **Hoy en autex.com.mx:** Por confirmar con el equipo del sitio.
- **Cómo debe quedar:** El subtotal cuenta las mismas piezas en todo el carrito. Si un producto guardado para más tarde vuelve al carrito, sus piezas se suman a la línea que ya existe en lugar de duplicarla.
- **Pantallas:** Carrito
- **Celular:** Igual.
- **Origen:** D41

### CAR-07 · Registrado directo a Confirmación (Nuevo)

- **Hoy en autex.com.mx:** El registrado entra al paso 1 y elige una de sus direcciones ("Selecciona una dirección").
- **Cómo debe quedar:** El registrado con dirección guardada y tarjeta registrada, con todo a domicilio y un solo envío, pasa del carrito directo al paso 4 "Confirmación", con el envío y su tarjeta predeterminada ya elegidos y el aviso "Tu información está completa y tu pedido llega en un solo envío". Con varios envíos o algo para recoger entra al paso 2 "Método de envío"; sin direcciones, al paso 1.
- **Pantallas:** Carrito, pago
- **Celular:** Igual.
- **Origen:** D35, D52

## Pago

### PAG-01 · Pago sin franja ni barra de navegación (Ajuste)

- **Hoy en autex.com.mx:** Los pasos del pago muestran el encabezado completo del sitio.
- **Cómo debe quedar:** En los 4 pasos del pago se ocultan la franja superior y la barra de navegación; solo quedan el logo y "Volver al carrito".
- **Pantallas:** Pago (4 pasos)
- **Celular:** Pendiente: el sitio en celular muestra el encabezado completo.
- **Origen:** D52

### PAG-02 · Número de pedido al pagar (Ajuste)

- **Hoy en autex.com.mx:** Al entrar al pago ya se asigna un número ("Pago del pedido #1199077") y el pedido queda pendiente aunque no se pague.
- **Cómo debe quedar:** El número de pedido se asigna al pagar y aparece en la página de gracias y en "Mis pedidos". Antes de pagar, el pago dice "Pago del pedido", sin número ni fecha.
- **Pantallas:** Pago, gracias, Mis pedidos
- **Celular:** Igual.
- **Origen:** D42, D53

### PAG-03 · Moverse entre pasos (Ajuste)

- **Hoy en autex.com.mx:** Indicador de 4 pasos (Datos del usuario, Método de envío, Método de pago, Confirmación). Si se puede tocar: por confirmar con el equipo del sitio.
- **Cómo debe quedar:** El indicador abre cualquier paso ya visitado, hacia atrás o hacia adelante. El registrado también tiene "Regresar" en Método de envío.
- **Pantallas:** Pago (4 pasos)
- **Celular:** Igual.
- **Origen:** D53

### PAG-04 · Factura opcional (Ajuste)

- **Hoy en autex.com.mx:** El paso 1 siempre muestra "Datos fiscales" (régimen fiscal y uso del CFDI).
- **Cómo debe quedar:** Los datos fiscales (régimen fiscal y uso del CFDI) solo se piden si el cliente marca "Requiero factura". Sin marcarla el pedido no se factura y la confirmación no muestra "Facturación". No se piden RFC, razón social ni C.P. fiscal.
- **Pantallas:** Pago (pasos 1 y 4)
- **Celular:** Igual.
- **Origen:** D57

### PAG-05 · Pedido solo para recoger (Nuevo)

- **Hoy en autex.com.mx:** No aplica: no se recoge en tienda.
- **Cómo debe quedar:** Si todo el pedido se recoge, el paso 1 no pide dirección de envío ni la parte fiscal: pide quién recoge y su teléfono, los dos obligatorios. La confirmación muestra quién recoge.
- **Pantallas:** Pago (pasos 1 y 4)
- **Celular:** Igual.
- **Origen:** D57

### PAG-06 · Datos del cliente en el paso 1 (Ajuste)

- **Hoy en autex.com.mx:** El invitado llena datos del cliente, datos fiscales y dirección (la colonia se elige según el C.P.). El registrado elige una de sus direcciones guardadas, con "Editar dirección" y "Añadir dirección".
- **Cómo debe quedar:** "Buscar dirección" sugiere direcciones mientras se escribe (como el autocompletado de Google Maps) y llena calle, número, C.P. y colonia; ciudad y estado se llenan solos. "Continuar" se habilita al completar los datos obligatorios. Si el invitado regresa del paso 2, el formulario conserva lo capturado. El registrado ve el mismo formulario, lleno con los datos de su pedido anterior y la dirección de entrega en uso, con sus direcciones guardadas arriba para llenarlo con una de ellas.
- **Pantallas:** Pago (paso 1)
- **Celular:** Igual.
- **Origen:** D40, D42, D51

### PAG-07 · Cambio de dirección en cualquier paso (Nuevo)

- **Hoy en autex.com.mx:** No aplica.
- **Cómo debe quedar:** Desde Datos del usuario, Método de envío, Método de pago o Confirmación se puede cambiar la dirección. Si cambia el C.P., se pide confirmación ("Al cambiar la dirección de entrega, los precios y la disponibilidad de tus productos podrían cambiar, ¿desea continuar?"), se recalculan las existencias de cada artículo según su opción (domicilio o recoger) y se regresa a Método de envío. Ahí una leyenda amarilla dice qué artículos se ajustaron o que la nueva ubicación no tiene existencias, con "Quitar productos sin existencia", y "Continuar" se bloquea mientras haya artículos sin existencia. Con el mismo C.P., el registrado cambia la dirección sin aviso.
- **Pantallas:** Pago (4 pasos)
- **Celular:** Igual.
- **Origen:** D50, D51, D56

### PAG-08 · No se pagan artículos sin existencia (Regla)

- **Hoy en autex.com.mx:** Por confirmar con el equipo del sitio.
- **Cómo debe quedar:** Ningún paso del pago deja continuar con un artículo sin existencia: el cliente regresa al carrito con un aviso temporal que nombra los artículos, para eliminarlos o guardarlos. Incluye al invitado que escribe en el paso 1 un C.P. donde algo no tiene piezas y a quien cambia la dirección en el pago y deja algún artículo en 0 piezas.
- **Pantallas:** Pago, carrito
- **Celular:** Igual.
- **Origen:** D57

### PAG-09 · Recoger en tienda en el pago (Nuevo)

- **Hoy en autex.com.mx:** No aplica.
- **Cómo debe quedar:** Lo que el cliente eligió recoger no entra en los envíos: el paso 2 lo muestra en "Recoger en tienda" con "Entrega el mismo día", la tienda, su dirección y horario, y la confirmación lo muestra aparte con sus artículos. Al terminar la compra (y en el correo de confirmación) se avisa: "Recoge tu pedido a partir de hoy y hasta 3 días posteriores a tu compra", con su número de pedido y su INE. Los 3 días se configuran.
- **Pantallas:** Pago (pasos 2 y 4), gracias, correo de confirmación
- **Celular:** Igual.
- **Origen:** D43, D54, D59

### PAG-10 · Sin costo de envío (Ajuste)

- **Hoy en autex.com.mx:** Envío a domicilio de $249.00 en pedidos menores a $1,500, con "Agrega $… a tu pedido para envío sin costo".
- **Cómo debe quedar:** No se muestra costo de envío en ningún paso ni en el total del pedido.
- **Pantallas:** Pago (4 pasos)
- **Celular:** Igual.
- **Origen:** D35, D41

### PAG-11 · Envíos múltiples (Nuevo)

- **Hoy en autex.com.mx:** Un solo "Envío a domicilio".
- **Cómo debe quedar:** Si el pedido sale de varias tiendas se avisa "Tu pedido llegará en N envíos". Cada "Envío 1, 2, 3…" se despliega con la tienda de origen, su dirección, los artículos y el tiempo de entrega, en el paso 2 y en la confirmación. El resumen de productos los separa por envío y por "Recoger en tienda".
- **Pantallas:** Pago (pasos 2 y 4)
- **Celular:** Igual.
- **Origen:** D35, D54

### PAG-12 · Reglas para dividir el pedido (Regla)

- **Hoy en autex.com.mx:** Por confirmar con el equipo del sitio.
- **Cómo debe quedar:** Cada artículo sale de la tienda de la zona más cercana que lo tenga completo, y los de una misma tienda viajan juntos. Si ninguna lo completa, se juntan de las tiendas de la zona más cercanas. Si la zona no completa las piezas, las tiendas de la zona envían lo que tienen y solo lo que falta sale bajo pedido de la sucursal foránea más cercana, en un solo envío foráneo. CEDIS nunca es origen de un envío.
- **Pantallas:** Pago (pasos 2 y 4)
- **Celular:** Igual.
- **Origen:** D41, D49

### PAG-13 · Confirmación por envío y facturación (Ajuste)

- **Hoy en autex.com.mx:** Sin captura: en el sitio el paso 3 solo acepta tarjeta.
- **Cómo debe quedar:** "Método de envío" muestra la dirección y cada envío plegado (sucursal, tiempo de entrega y artículos; sin elegir fecha) y "Recoger en tienda" aparte. No hay "Acerca del pedido". "Facturación" (régimen fiscal, uso del CFDI y a nombre de quién se factura) solo aparece si el cliente pidió factura. "Cambiar" del envío abre el cambio de dirección (el registrado elige entre sus direcciones guardadas; el invitado va a su formulario), el del pago regresa al paso 3 y el de facturación a Datos del usuario.
- **Pantallas:** Pago (paso 4)
- **Celular:** Se arma con el diseño de la demo.
- **Origen:** D54, D57

### PAG-14 · Pago en tienda de autoservicio (Nuevo)

- **Hoy en autex.com.mx:** El paso 3 solo acepta tarjeta de crédito o débito.
- **Cómo debe quedar:** Además de tarjeta, "Otras formas de pago" ofrece pagar en una tienda de autoservicio (por ejemplo, OXXO o 7-Eleven), con un plazo de 3 días a partir de hoy. La confirmación dice "Tienda de autoservicio" y la página de gracias nombra la tienda elegida.
- **Pantallas:** Pago (pasos 3 y 4), gracias
- **Celular:** Igual.
- **Origen:** D42, D57

### PAG-15 · Tarjeta del invitado (Ajuste)

- **Hoy en autex.com.mx:** Formulario vacío: nombre del titular, número de tarjeta, fecha de expiración (mes y año) y código de seguridad.
- **Cómo debe quedar:** El titular empieza con el nombre del cliente y se validan el número, la vigencia (MM/AA) y el CVV.
- **Pantallas:** Pago (paso 3)
- **Celular:** Igual.
- **Origen:** D42

## Pedidos

### PED-01 · Mis pedidos (Ajuste)

- **Hoy en autex.com.mx:** "Historial de pedidos" con número, estado (por ejemplo, "Pago pendiente"), fecha, total, tipo de envío, PDF, XML y "Ver detalle".
- **Cómo debe quedar:** Al pagar, el pedido queda en "Mis pedidos" con fecha, piezas, total, artículos, dirección (o la tienda, si se recoge) y estado ("En preparación" o "Pago pendiente en tienda"). El carrito queda vacío.
- **Pantallas:** Mis pedidos
- **Celular:** Pendiente de llevar a celular (entrega 4 del plan).
- **Origen:** D42, D57

### PED-02 · Después de comprar (Regla)

- **Hoy en autex.com.mx:** Por confirmar con el equipo del sitio.
- **Cómo debe quedar:** "Seguir comprando" conserva la sesión del registrado.
- **Pantallas:** Gracias
- **Celular:** Igual.
- **Origen:** D42

## Experiencia general

### GEN-01 · Diseño Autex 2026 (Ajuste)

- **Hoy en autex.com.mx:** Diseño actual del sitio.
- **Cómo debe quedar:** Barra superior, catálogo, carrito, mini-carrito, inicio de sesión (ventana) y pago de 4 pasos siguen el diseño nuevo de Figma (Autex_2026_Frames).
- **Pantallas:** Barra superior, catálogo, carrito, pago
- **Celular:** Figma no tiene diseño de celular: la base es el sitio en celular (CEL-01).
- **Origen:** Figma Autex 2026

### GEN-02 · Pantallas de carga (Nuevo)

- **Hoy en autex.com.mx:** Por confirmar con el equipo del sitio.
- **Cómo debe quedar:** La página se pone en gris con un indicador y el motivo ("Preparando tu pedido", "Calculando tu envío", "Cambiando tu tienda", "Actualizando tu ubicación", "Validando existencias", "Cargando productos…", "Cerrando sesión") en cada paso del pago, al cambiar de tienda, C.P. o dirección, al validar una cantidad escrita, al buscar o filtrar y al cerrar sesión.
- **Pantallas:** Todas
- **Celular:** Igual: ocupa toda la pantalla.
- **Origen:** D36

### GEN-03 · Franja de envío gratis (Ajuste)

- **Hoy en autex.com.mx:** "Envío gratis a todo México · Compras mayores a $1500 MXN".
- **Cómo debe quedar:** "Envío gratis en tus primeras compras" con "(Aplica restricciones)" en letra más chica, para no prometer que siempre será así. El beneficio del inicio dice lo mismo. La promoción y la leyenda de restricciones se encienden o se apagan por configuración.
- **Pantallas:** Barra superior, inicio
- **Celular:** Igual.
- **Origen:** D57, D59

### GEN-04 · Textos (Ajuste)

- **Hoy en autex.com.mx:** Textos del sitio y del diseño 2026.
- **Cómo debe quedar:** Confirmación: "Tienda de autoservicio" y "Revisa tu pedido y confírmalo". Gracias: sin "Tu auto está por estrenar" y con la tienda de autoservicio elegida. "Días hábiles" con acento. Pie con el año actual en todas las páginas.
- **Pantallas:** Pago, gracias, catálogo, pie
- **Celular:** Igual.
- **Origen:** D57

## Celular

### CEL-01 · Vista de celular (Ajuste)

- **Hoy en autex.com.mx:** El sitio tiene su vista de celular (768 px o menos): franja azul, menú de hamburguesa, "Mis vehículos", "Ingresar", carrito, buscador con "Especialidades", "Búsqueda por vehículo" plegable, pie plegable y botón flotante de WhatsApp. En celular la lista de "Especialidades" no abre.
- **Cómo debe quedar:** La vista de celular parte de la del sitio, copiada tal cual (capturas y medidas en docs/autex-real/movil), y le aplica todos los cambios de esta lista; Figma no tiene diseño de celular. "Especialidades" abre su lista. En la demo todas las pantallas ya tienen su vista de celular (encabezado, menú, pie, inicio, catálogo con filtros en un panel, detalle, carrito, los 4 pasos del pago, gracias y la cuenta), con "Mi tienda" y "Entrega en" bajo el buscador y, en el pago, solo el logo y "Volver al carrito".
- **Pantallas:** Todas
- **Celular:** Ver las decisiones pendientes abajo.
- **Origen:** D58, D59

## Qué tener en cuenta

### Para escribir las specs

- "Por confirmar" en "Hoy" quiere decir que no se pudo ver en el sitio sin comprar o sin acceso a sus sistemas: se revisa con el equipo de autex.com.mx antes de la spec.
- Los cambios de tipo "Regla" los decide el cálculo de existencias y envíos (SMC 4.0); las pantallas solo muestran su resultado.
- Cada cambio aplica en escritorio y en celular. La columna "Celular" dice cuando hay una diferencia o algo pendiente.

### Celular: decisiones tomadas (D59, por confirmar)

- "Mi tienda" y "Entrega en" van en una fila bajo el buscador; cada uno abre su panel a pantalla completa.
- Carrito: método de entrega, zona o dirección y subtotal arriba (como el resumen del sitio en celular) y los productos abajo.
- Pago: solo el logo y "Volver al carrito", como en escritorio (D52); los pasos muestran sus números y el nombre del paso actual.
- Catálogo: "Búsqueda por vehículo" plegable y "Filtros" en un panel a pantalla completa, como el sitio.

### Celular: decisiones pendientes

- Cómo se ve el aviso de ubicación al entrar.
- Si el estado de la demo se conserva al recargar la página (en celular se recarga más seguido).
- Plan y avance de la vista de celular: `docs/autex-real/movil/PLAN.md`.

### El sitio cambió desde la copia de escritorio (5 de octubre)

- El inicio muestra "Categorías" (Carga y arranque, Eléctricos, Fuel injection, Iluminación y cable, Herramientas, Motopartes, Heavy duty y "Todas las categorías") en lugar de "Explora por especialidad".
- El menú dice "Promociones" (la demo en escritorio dice "Ofertas"); la franja dice "Compras mayores a $1500 MXN"; el WhatsApp es 33 1602 5603.

### Igual que el sitio actual (ya no se listan como cambio)

- "¿Cómo deseas continuar?" (Usuario invitado / Tengo una cuenta Autex) al proceder al pago sin sesión.
- "Mis vehículos": agregar un vehículo, activarlo o navegar sin vehículo; al buscar por vehículo se agrega y se activa.
- Menú de la cuenta: Mi perfil, Mis pedidos y Salir.

### Solo de la demo (no se programan en el sitio)

- Todos los datos son simulados: existencias por tienda, clientes, direcciones, tarjetas y pedidos. La demo no se conecta a SMC 4.0 ni a autex.com.mx.
- Los pedidos, direcciones, vehículos y el carrito se borran al recargar la página.
- 19 productos de ejemplo en las 5 especialidades; 4 sin imagen en el diseño usan la foto de autex.com.mx.
- Los niveles de servicio salen del archivo de configuración de SMC 4.0; todas las tiendas usan los valores de Acapulco.
- El autocompletado de direcciones es simulado: solo conoce unas 20 calles de Guadalajara, Zapopan, Tlaquepaque, Monterrey, León y Ciudad de México.
- En escritorio la página de 1920 px se ajusta al zoom del navegador; el sitio real ya es adaptable.
- Siguen como en Figma, sin funcionalidad: especificaciones, pestañas, productos sustitutos y relacionados del detalle (iguales para todos), "Agregar a mi lista", orden y productos por página del catálogo.

### Se mantienen como están (decisión del usuario)

- Ofertas sin descuento visible; teléfono de la barra (33 3205 4440) distinto al del pie (33 3208 4440); "Descuentos aplicados $0.00" sin cupón; "Avisar disponibilidad" sin pedir correo al invitado.

### No incluidos todavía

- Cupón de descuento, "Mis listas", notificaciones de la campana y facturación con RFC, razón social o C.P. fiscal.

### Riesgo

- La compatibilidad con el vehículo es simulada: todas las tarjetas dicen "Si le queda a tu vehículo" y el vehículo elegido no filtra los resultados. No rompe la compra, pero en autopartes es el principal riesgo de devoluciones.
