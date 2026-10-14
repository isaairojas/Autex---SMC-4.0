# H03 · Catálogo por ubicación (front): búsqueda, categorías y detalle con existencias, tiempos e IVA

- **Fecha**: 2026-10-12 · **Estado**: borrador · **Constitution**: 3.0.0
- **Índice**: `specs/historias-de-usuario.md` · **Catálogo**: UBI-05, CAT-01, CAT-02, CAT-03, CAT-07, CAT-08,
  CAT-10, GEN-02 · **Spec v2**: RN14 · **Sin ID** (se agregan antes de programar): etiqueta de entrega en la
  tarjeta, IVA fronterizo
- **Depende de**: H01, H02 · **La usan**: H04

## 1. Objetivo y contexto de negocio

Búsqueda, categorías, promociones y detalle piden la existencia a SMC 4.0 (H02) y la muestran con la ubicación
actual: piezas por rangos, cuándo llega y el precio con el IVA de la zona. Si el cliente cambia su ubicación, todo
se actualiza, incluido el carrito. El detalle muestra además las piezas en la sucursal elegida, para que el
cliente decida si lo pide a domicilio o lo recoge.

**Por qué importa**: hoy la tarjeta solo dice "Producto disponible" o "No disponible", muestra lo que no se puede
comprar en la zona y el detalle no dice piezas por tienda.

**Decisión (por confirmar)**: el IVA sigue a la ubicación de entrega; si todo se recoge, el del C.P. de la
sucursal.

## 2. Usuarios

Clientes no registrados y registrados en búsqueda, categorías, promociones y detalle.

## 3. Escenarios de usuario (historias)

- **HU1 (P1)** — Como cliente, quiero ver cuántas piezas hay en mi zona y cuándo llegan, para elegir con datos
  reales.
- **HU2 (P1)** — Como cliente, quiero ver solo lo que puedo comprar en mi zona, y lo demás si lo pido.
- **HU3 (P1)** — Como cliente, quiero ver en el detalle las piezas en línea y en mi sucursal.
- **HU4 (P2)** — Como cliente que cambia de ubicación, quiero que todo se actualice y se me diga qué cambió.
- **HU5 (P2)** — Como cliente en la frontera, quiero ver mis precios con el IVA que me corresponde.

## 4. Requisitos funcionales

- **RF1.** Consultar la existencia al buscar, filtrar, entrar a una categoría o promoción y abrir un detalle.
- **RF2.** Junto a "Disponible", las piezas en línea por rangos: +100, +50, +30, +10 o la cantidad exacta si hay
  menos de 10, sumando todas las sucursales Local y Local Extendido. *(CAT-02)*
- **RF3.** Ocultar lo que no tiene existencia en la zona; al final de los filtros, "Disponibilidad · Mostrar
  productos no disponibles (N)" con "Avisar disponibilidad". *(CAT-01)*
- **RF4.** Etiqueta de entrega en la tarjeta según el nivel de servicio de las piezas; si la cantidad necesita
  piezas de servicios distintos, la del envío más tardío; si solo la completa una foránea habilitada, "Disponible
  bajo pedido" con la leyenda de otra región.
- **RF5.** Detalle: sección "Disponibilidad" con piezas en línea y piezas en "Mi tienda", sin pasillo ni bahía;
  si solo hay piezas en otra región o la cantidad supera lo de la zona: "No encontramos este producto en las tiendas
  de tu zona. Lo enviaremos desde otra región y podría tardar más de lo normal. *Entrega estimada de 2 a 4 días
  hábiles". Los rangos de piezas llegan hasta "+100". *(CAT-07, CAT-02, D59)*
- **RF6.** "Buscar en otra tienda" abre una barra con "Mi tienda" primero y las sucursales cercanas que lo tienen
  (abierta o cerrada, piezas, dirección, teléfono, mapa y "Seleccionar tienda"); al pie, "Cambiar dirección".
  *(CAT-08)*
- **RF7.** Escribir la cantidad además de − y +; si pasa del máximo, "Validando existencias", regresa al máximo y
  avisa "Solo hay N piezas disponibles para compra en línea". El máximo es la existencia en línea menos lo que ya
  está en el carrito (o las piezas de la sucursal si se recoge); "+" y "Agregar al carrito" se desactivan al
  llegar. *(CAT-03)*
- **RF8.** Agregar: en escritorio, desde la búsqueda abre el mini-carrito; en el detalle, el botón cambia a
  "Agregado al carrito"; "Comprados juntos" agrega los marcados con piezas; en celular, el aviso del sitio.
  *(CAT-10)*
- **RF9.** Al cambiar C.P., dirección, sucursal o sesión, actualizar la pantalla y revisar el carrito: lo que se
  recoge contra la nueva sucursal (si no la tiene, pasa a domicilio) y lo que va a domicilio contra la nueva
  existencia; aviso temporal con el resumen. *(UBI-05)*
- **RF10.** Precios en tarjetas, detalle, carrito y pago con IVA del 8 % en la región fronteriza norte y sur y del
  16 % en el resto; el resumen del pago dice el porcentaje.
- **RF11.** Pantallas de carga con su motivo: "Cargando productos…", "Actualizando tu ubicación", "Cambiando tu
  tienda", "Validando existencias". *(GEN-02)*
- **RF12.** Si SMC 4.0 no responde: "No pudimos consultar las existencias de tu zona" con "Reintentar" y "Agregar
  al carrito" desactivado (H02).

## 5. Reglas de negocio (con ejemplos)

- **RN1. Rangos.** *Ejemplo*: 137 piezas → "+100"; 42 → "+30"; 2 en Tesistán y 5 en Colón → "7".
- **RN2. Envío más tardío.** *Ejemplo*: con cantidad 3, Tesistán tiene 2 (Local) y Colón 1 (Local Extendido): la
  tarjeta dice la fecha de Local Extendido.
- **RN3. Tope con el carrito.** *Ejemplo*: 3 piezas en línea y 2 en el carrito: desde la tarjeta solo 1 más.
- **RN4. Aviso de ajuste.** *Ejemplo*: "Actualizamos tu carrito con las existencias de tu nueva ubicación: 1
  ajustado y 1 sin existencia".
- **RN5. En línea y sucursal son distintas.** *Ejemplo*: en 45138, 7 piezas en línea y 2 en Tesistán.
- **RN6. IVA.** *Ejemplo*: C.P. 22000 (Tijuana), 8 %; 45138, 16 %.

## 6. Criterios de aceptación (verificables sin código)

- **CA1.** En 45138, un producto con 7 piezas en la zona muestra "Disponible · 7" y su etiqueta de entrega.
- **CA2.** Un producto sin existencia no aparece hasta marcar "Mostrar productos no disponibles".
- **CA3.** Al subir la cantidad de la tarjeta hasta necesitar piezas de Local Extendido, la etiqueta cambia.
- **CA4.** Cambiar el C.P. a 64000 cambia el número de piezas de la tarjeta; con algo en el carrito aparece el
  aviso de ajuste.
- **CA5.** Escribir 999 en la cantidad: "Validando existencias" y regresa al máximo con su aviso.
- **CA6.** El detalle muestra piezas en línea y en "Mi tienda"; "Buscar en otra tienda" lista primero "Mi tienda".
- **CA7.** Con 22000 los precios y el total salen con IVA del 8 %; al cambiar a 45138, con 16 %.
- **CA8.** Categorías y promociones se comportan igual que la búsqueda.

## 7. Casos límite

- **CL1.** ¿Ningún resultado tiene existencia? "No hay productos disponibles en tu zona" con la opción de ver los
  no disponibles.
- **CL2.** ¿Escribe 0 o deja vacía la cantidad? Vuelve a 1.
- **CL3.** ¿"Mi tienda" no lo tiene? El detalle muestra 0 en la sucursal y la venta en línea sigue.
- **CL4.** ¿Pedido mixto con envío a la frontera y recoger fuera? Por confirmar con fiscal; propuesta: cada parte
  con el IVA de su destino.
- **CL5.** ¿Celular? "Buscar en otra tienda" ocupa toda la pantalla (decisión pendiente de CEL-01).

## 8. Fuera de alcance

- Cómo se calcula la existencia (H02).
- Orden y productos por página, compatibilidad con el vehículo, "Agregar a mi lista", especificaciones,
  sustitutos y relacionados.
