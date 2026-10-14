# H02 · Cálculo de SMC 4.0 (back): existencias, foráneas, surtido y tiempos de entrega

- **Fecha**: 2026-10-12 · **Estado**: borrador · **Constitution**: 3.0.0
- **Índice**: `specs/historias-de-usuario.md` · **Catálogo**: UBI-07, UBI-08, CAT-04, CAT-05, CAT-06, CAT-09,
  PAG-12 · **Spec v2**: RN3, RN6, RN11–RN13, RN16, RF20 (sin ID en el catálogo: se agrega antes de programar)
- **Contrato**: `specs/002-smc4-integracion/contracts/smc-propuesta.md` (operación 1, existencias por ubicación;
  operación 2, propuesta de surtido)
- **Depende de**: H01 (ubicación) · **La usan**: H03, H04, H06, H07

## 1. Objetivo y contexto de negocio

SMC 4.0 es el back: para una ubicación (C.P. o dirección de entrega) calcula cuántas piezas de cada producto se
pueden vender en línea y, al pagar, de qué sucursales sale cada artículo, cuántos envíos hay, qué se recoge y
cuándo llega cada envío. Es el objetivo del proyecto: "integrar el algoritmo de SMC 4.0 para la selección de
sucursales para el surtido de pedidos".

Por ahora las existencias solo cuentan las sucursales **Local** y **Local Extendido**. Las foráneas se habilitan con
un parámetro general.

**Decisión (por confirmar)**: el parámetro "cantidad de sucursales foráneas" arranca en **0**, porque "de
momento" no se toman los servicios foráneos; al subirlo a 1 o más se habilita la venta bajo pedido.

**Por qué importa**: hoy la existencia no depende de la dirección, el pago ofrece un solo envío de 24 a 48 horas y
nadie decide desde qué sucursal sale cada pieza.

## 2. Usuarios

No tiene pantalla. Lo consumen catálogo, carrito y pago (H03–H07); lo reciben las sucursales (cada una surte su
parte), logística y atención a clientes. El negocio controla el parámetro de foráneas.

## 3. Escenarios de usuario (historias)

- **HU1 (P1)** — Como cliente, quiero que la existencia que veo sea la de las sucursales cercanas a mi ubicación.
- **HU2 (P1)** — Como cliente, quiero que mi pedido salga de las sucursales más cercanas que tienen las piezas.
- **HU3 (P1)** — Como negocio, quiero que todas las pantallas usen la misma existencia.
- **HU4 (P2)** — Como negocio, quiero encender o apagar las foráneas con un parámetro, sin cambiar el sitio.
- **HU5 (P2)** — Como negocio, quiero que se respeten la sucursal predefinida y la sucursal base del cliente.
- **HU6 (P2)** — Como cliente, quiero saber si no se pudo calcular mi envío y poder reintentar.

## 4. Requisitos funcionales

**Existencias (contrato, operación 1)**
- **RF1.** Dada una ubicación, obtener las candidatas: Local (hasta 15 km) y Local Extendido (hasta 30 km), con
  los radios que configura SMC 4.0. *(UBI-08)*
- **RF2.** Por producto, devolver piezas en línea (suma de candidatas), piezas en la sucursal elegida, máximo de
  venta, estado, nivel de servicio y fecha de entrega. *(CAT-09)*
- **RF3.** Responder para listas (búsqueda, categoría, promociones) y para un producto (detalle, carrito);
  recalcular al cambiar C.P., dirección o sesión.
- **RF4.** No contar CEDIS; nunca es origen de un envío. *(CAT-06)*
- **RF5.** Las baterías solo cuentan Local y Local Extendido, nunca bajo pedido. *(CAT-04)*

**Foráneas**
- **RF6.** Con el parámetro N > 0, sumar las N foráneas más cercanas (hasta 350 km). Si la zona no completa la
  cantidad y la foránea sí, el estado es "bajo pedido" con la leyenda "Existencia en otra región: se envía como
  pedido foráneo y podría tardar más de lo normal". *(CAT-05, UBI-08)*

**Surtido (contrato, operación 2)**
- **RF7.** Recibir cliente, ubicación, sucursal elegida y líneas (producto, cantidad, domicilio o recoger) y
  devolver envíos, recoger, sin existencia y caja gris, con su explicación. *(PAG-12)*
- **RF8.** Aplicar el orden de decisión de RN5; agrupar en un envío lo de una misma sucursal; cada línea en un
  solo lugar.
- **RF9.** Por envío, devolver sucursal, dirección, si es foráneo, etiquetas y fecha.

**Tiempos de entrega**
- **RF10.** Local: hoy si se compra antes de las 2:00 p.m.; si no, el siguiente día hábil. Local Extendido: 2 días
  hábiles. Foráneo: de 2 a 4 días hábiles. Sin sábados, domingos ni días de descanso obligatorio. *(UBI-07)*
- **RF11.** Textos: "Entrega hoy", "Entrega mañana", "Entrega el viernes 9 de octubre", "Entrega entre el martes 13
  y el jueves 15 de octubre". Con piezas de varios niveles, la fecha del más tardío.

**Falla o sin cobertura**
- **RF12.** Si SMC 4.0 no responde en 2 segundos, no se devuelven existencias ni envíos inventados; la tienda
  muestra el aviso con "Reintentar" (H03, H06). Si la ubicación no tiene candidatas, todo va a "Sin existencia"
  con motivo "sin cobertura".

## 5. Reglas de negocio (con ejemplos)

- **RN1. Candidatas por distancia.** *Ejemplo*: para 45138, Tesistán (0 km), Belisario Domínguez (19.5 km), Colón
  (21.2 km), Mercado Libre Adolf Horn (29.2 km) y Adolf Horn (29.5 km). Zamora (153.6 km) es foránea.
- **RN2. Una sola fuente.** "Mi tienda", venta en línea, "Buscar en otra tienda" y envíos usan las mismas piezas.
- **RN3. Estado por cantidad.** *Ejemplo*: el filtro de aire tiene 1 pieza en Tesistán: con 1 está disponible; con
  2 pasa a bajo pedido si N = 1, o se limita a 1 si N = 0. La marcha (sin piezas en la zona) está sin existencia
  con N = 0 y bajo pedido con N = 1.
- **RN4. CEDIS y baterías.** *Ejemplo*: lo que solo tiene CEDIS aparece sin existencia; en Zacatecas una batería
  sin sucursal a 30 km o menos aparece sin existencia.
- **RN5. Orden de decisión del surtido.** 1) exclusivos de recoger, a "Recoger en tienda"; 2) sucursal predefinida
  de la dirección, con donantes para lo que falte; 3) sucursal base del registrado si cubre al menos el 80 %; 4) la
  candidata más cercana que lo tenga completo; 5) se junta de las candidatas más cercanas; 6) lo que falte, bajo
  pedido de la foránea (si N > 0) en un solo envío; 7) lo que no se puede asignar, a "Caja gris"; sin piezas, a
  "Sin existencia".
- **RN6. Siempre hay resultado si hay una sucursal apta.** *Ejemplo*: un inyector que Tesistán tiene completo sale
  en 1 envío desde Tesistán.
- **RN7. Sucursal base.** *Ejemplo*: si la base cubre 8 de 10 piezas, surte esas 8 y otra sucursal las 2.
- **RN8. Caja gris.** *Ejemplo*: una promoción cuyas piezas no están completas en ninguna sucursal.
- **RN9. Un pedido, varios envíos.** Un número de pedido; cada sucursal recibe por dentro su parte.
- **RN10. Fechas.** Miércoles 7 de octubre de 2026 a las 10:00, Local → "Entrega hoy"; a las 16:00 → "Entrega
  mañana"; viernes 16:00 → "Entrega el lunes 12 de octubre"; Local Extendido el miércoles → "Entrega el viernes 9
  de octubre"; foráneo → "Entrega entre el viernes 9 y el martes 13 de octubre".
- **RN11. La tienda no inventa.** Sin respuesta de SMC 4.0 no hay existencias ni envíos.

## 6. Criterios de aceptación (verificables sin código)

- **CA1.** Con 45138, la existencia en línea de un producto es la suma de las 5 sucursales de RN1; con 64000
  cambia a las de Monterrey.
- **CA2.** Búsqueda, detalle y carrito muestran el mismo número de piezas para el mismo producto.
- **CA3.** Con N = 0 la marcha está sin existencia; con N = 1, "Disponible bajo pedido".
- **CA4 (E1).** Con un C.P. con sucursal predefinida, el primer envío lleva "Sucursal predefinida".
- **CA5 (E2).** Registrado con base que cubre ≥ 80 %: envío "Sucursal base" y complementos.
- **CA6 (E3).** El exclusivo queda en "Recoger en tienda" aunque se pida a domicilio.
- **CA7 (E5, E6).** Sin piezas en candidatas: "Sin existencia"; promoción incompleta: "Caja gris".
- **CA8.** Con N = 1, nunca más de un envío foráneo.
- **CA9.** Las fechas de RN10 aparecen igual en detalle, paso 2 y Mis pedidos.
- **CA10.** Simulando que SMC 4.0 no responde, el paso 2 muestra "No pudimos calcular tus envíos en este momento"
  con "Reintentar" y no deja continuar.

## 7. Casos límite

- **CL1.** ¿Sucursal a exactamente 30 km? Cuenta como Local Extendido.
- **CL2.** ¿La sucursal elegida no es candidata? Sus piezas cuentan para recoger, no para la venta en línea.
- **CL3.** ¿Dos candidatas igual de cercanas con todo? La de más piezas.
- **CL4.** ¿La base cubre menos del 80 %? Se sigue con la regla 4.
- **CL5.** ¿No hay foránea a 350 km o menos? Se comporta como N = 0.
- **CL6.** ¿Compra exactamente a las 2:00 p.m.? Cuenta como después de la hora límite. ¿En fin de semana? Cuenta
  desde el lunes hábil. Zona horaria: centro de México.
- **CL7.** ¿SMC 4.0 responde en 3 segundos? Se descarta y el cliente reintenta.

## 8. Fuera de alcance

- Opciones alternativas de surtido, apartar existencias, surtido físico, guías y rastreo.
- Cambiar radios o reglas de SMC 4.0 desde la tienda; monitoreo interno de SMC 4.0.
