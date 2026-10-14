# Especificación: Autex.com.mx + SMC 4.0 v2

- **Fecha**: 2026-10-09 · **Estado**: borrador · **Constitution**: 3.0.0
- **Reemplaza a**: `specs/001-smc4-demo-sucursales/spec.md` (v1, la demo)
- **Catálogo de cambios**: `docs/negocio/cambios-demo-vs-autex.md` (los IDs como `UBI-01` salen de ahí)
- **Decisiones de la demo**: `docs/figma/discrepancias.md` (D1–D58)

## 1. Objetivo y contexto de negocio

Integrar el algoritmo de SMC 4.0 para que se pueda hacer la selección de sucursales para el surtido de pedidos.
SMC 4.0 es el back de la aplicación: selecciona y determina qué sucursal surte cada artículo, cuántos envíos
salen, por qué método (envío a domicilio o recoger en tienda, *pickup*) y en cuánto tiempo llega cada uno.

### Pagos y facturación: fuera de alcance (equipo Mercedes)

El tema de **método de pago, pasarela de cobro, asignación del número de pedido y Mis pedidos** queda **fuera
del alcance** de este proyecto; la integración y el cálculo del cobro son responsabilidad del equipo **Mercedes**
(especializado en finanzas e integración de pagos). Este proyecto **no** modifica cómo se ejecuta el pago,
solo cómo se visualiza la **selección de facturación** en la página: si el cliente marca "Requiero factura"
se muestran los campos; si no marca nada, se asume **"Público general"**.

> **Nota de pago.** El pago únicamente se realiza al momento de estar en la plataforma. Si el cliente no realiza
> el pago, no se genera factura.

**Por qué importa**: hoy autex.com.mx vende sin saber desde qué tienda sale cada pieza: el pago ofrece un solo
"Envío a domicilio" de 24 a 48 horas, cobra $249 en pedidos menores a $1,500 y no deja recoger en tienda. Con SMC
4.0 cada pedido sale de las tiendas más cercanas que tienen las piezas, el cliente ve desde el catálogo lo que se
puede comprar en su zona, elige domicilio o recoger, y sabe en cuántos envíos y en qué fecha llega.

**Cómo se usa en la vida real**: el cliente entra, el sitio detecta o le pide su ubicación ("Mi tienda" y "Entrega
en"), busca sus piezas con las existencias de su zona, arma el carrito eligiendo domicilio o recoger, y en el pago
ve los envíos que propuso SMC 4.0. Cada sucursal recibe la parte del pedido que le tocó.

**Fases** (constitution 3.0.0): esta v2 aplica a las dos. Fase 1: la demo de este repositorio, que ya muestra 52
cambios frente al sitio actual (catálogo), simula y explica primero lo que falta (globos, escenarios E1–E7, IVA
fronterizo, caja gris, exclusivos de recoger, sucursal predefinida y sucursal base). Fase 2: la programación real de
esos cambios en el sitio, a partir de esta spec. Solo clientes B2C (invitado y registrado).

## Clarifications

### Session 2026-10-09

Las respuestas las eligió el agente con la opción recomendada, por instrucción del usuario; están para revisión.

- Q: ¿Qué cubre esta versión 2: la demo, el sitio real o los dos, y para qué clientes? → A: Los dos, solo
  clientes B2C (invitado y registrado): la demo simula y explica primero lo que falta y el sitio lo programa
  después; los clientes B2B con crédito Apymsa quedan fuera. *Razón*: la constitution 3.0.0 define las dos fases,
  y ni el catálogo ni la demo tienen cambios B2B.
- Q: Cuando varias reglas aplican a la vez, ¿en qué orden decide SMC 4.0 desde dónde sale cada artículo? → A: 1)
  los exclusivos de recoger van a "Recoger en tienda"; 2) la sucursal predefinida de la dirección, con donantes
  para lo que le falte; 3) la sucursal base del registrado si cubre al menos el 80 %; 4) la tienda candidata más
  cercana que lo tenga completo; 5) se junta de las candidatas más cercanas; 6) lo que falte, bajo pedido de la
  foránea más cercana en un solo envío; 7) lo que no se pueda asignar va a "Caja gris" y lo que no tiene piezas en
  ninguna candidata, a "Sin existencia". *Razón*: conserva las reglas de la v1 (E1, E2, E3, E6) y las de la demo
  (D49, D57) sin contradecirse.
- Q: Si una compra sale de varias sucursales, ¿el cliente ve un solo pedido con varios envíos o varios pedidos? →
  A: Un solo pedido, con un número, dividido en envíos; cada sucursal recibe por dentro su parte. *Razón*: así lo
  muestran la demo y el catálogo (PAG-02, PAG-11, PED-01) y es lo más claro para el cliente. Donde la v1 decía que
  la compra se separa "en diferentes pedidos", ahora dice "en diferentes envíos".
- Q: Si SMC 4.0 no responde a tiempo en el sitio real, ¿qué ve el cliente en el paso de envío? → A: La carga
  "Calculando tu envío" hasta 2 segundos; si no hay respuesta, el aviso "No pudimos calcular tus envíos en este
  momento" con "Reintentar", y no se puede pagar sin la propuesta de SMC 4.0. *Razón*: la tienda no inventa envíos
  (Principio VII) y los 2 segundos son el objetivo de la v1.
- Q: ¿Se muestran opciones alternativas de surtido (hasta 3) además de la recomendada? → A: No en esta versión:
  solo la opción recomendada; las alternativas quedan como propuesta. *Razón*: la demo, Figma 2026 y el catálogo
  muestran una sola opción, y agregar alternativas complica el pago (Principio I).

## 2. Usuarios

Lo usan clientes registrados y no registrados en la página (B2C). Con las existencias de una ubicación (dirección
o código postal), el sitio muestra los artículos y las existencias de las sucursales de esa ubicación, y le
permite al cliente entender que la existencia depende de su dirección.

| Usuario | Qué sabe | Qué no sabe |
|---|---|---|
| Cliente no registrado (invitado) | Su C.P. o su dirección y las piezas que busca | Qué tiendas tienen las piezas, cómo decide SMC 4.0, que las existencias cambian con su dirección |
| Cliente registrado | Lo anterior, más sus direcciones guardadas, su tarjeta y su tienda | Lo mismo; además, que su sucursal base puede surtir primero |
| Persona de negocio (demo) | Las reglas de surtido a grandes rasgos | Cómo se ve cada regla en el flujo; para eso recorre los escenarios con globos |

Reciben el resultado sin usar la app: las sucursales que surten (cada una recibe su parte del pedido), logística y
paquetería, atención a clientes (explica envíos y fechas) y el equipo que programa la fase 2 (recibe esta spec).

## 3. Escenarios de usuario (historias)

- **HU1 (P1)** — Como usuario no registrado, quiero que autex.com.mx me recomiende la mejor sucursal usando el
  algoritmo de SMC 4.0, para que mi envío siempre sea el más rápido según las sucursales candidatas de mi
  dirección.
- **HU2 (P1)** — Como cliente, quiero ver desde el catálogo qué piezas hay para mi dirección y en mi tienda, para
  comprar solo lo que me puede llegar. *(UBI-01 a UBI-03, CAT-01, CAT-02, CAT-07)*
- **HU3 (P1)** — Como cliente, quiero elegir por producto si me lo envían o lo recojo en mi tienda, para combinar
  lo urgente con lo que puede esperar. *(CAR-01, CAR-02, PAG-09)*
- **HU4 (P1)** — Como cliente, quiero ver en el pago en cuántos envíos llega mi pedido, de qué sucursal sale cada
  uno y en qué fecha, para saber cuándo tendré mis piezas. *(PAG-11, PAG-12, UBI-07)*
- **HU5 (P2)** — Como cliente que cambia su dirección o su tienda, quiero que se recalculen las existencias y los
  envíos y se me diga qué cambió, para no comprar algo que no me puede llegar. *(UBI-05, PAG-07, PAG-08)*
- **HU6 (P2)** — Como cliente, quiero elegir si requiero factura con un checkbox; si no lo marco, se usa "Público
  general" y no me piden datos fiscales. *(PAG-04)*
- **HU7 (P3)** — Como cliente en celular, quiero hacer la misma compra que en escritorio con la forma del sitio en
  celular, para comprar desde mi teléfono. *(CEL-01)*

## 4. Requisitos funcionales

Qué hace el sistema, sin tecnología. Entre paréntesis, los IDs del catálogo de donde sale cada requisito.

- **RF1.** El sistema debe dar la opción de envío recomendada por el algoritmo: los diferentes tiempos de envío y
  cómo se separa la compra en diferentes envíos de un mismo pedido, según las propias reglas del algoritmo.
  *(PAG-11, PAG-12, UBI-07)*
- **RF2.** El sistema debe pedir o detectar la ubicación al entrar y dejar elegir el C.P. o la dirección de entrega
  ("Entrega en") y la tienda ("Mi tienda") en cualquier página fuera del pago. *(UBI-01 a UBI-03, UBI-06)*
- **RF3.** El sistema debe mostrar las existencias de cada producto con las sucursales candidatas de la ubicación y
  decirle al cliente que dependen de su dirección. *(UBI-08, CAT-02, CAT-09)*
- **RF4.** El sistema debe ocultar lo que no se puede comprar en la zona y mostrarlo solo si el cliente lo pide.
  *(CAT-01)*
- **RF5.** El sistema debe impedir pedir más piezas de las disponibles para compra en línea (o de las de la
  tienda, si se recoge) y avisarlo. *(CAT-03, CAR-04)*
- **RF6.** El sistema debe mostrar en el detalle las piezas para compra en línea y en "Mi tienda", y las tiendas
  cercanas que tienen el producto. *(CAT-07, CAT-08)*
- **RF7.** El sistema debe vender "bajo pedido" lo que solo completa la sucursal foránea, con su tiempo de
  entrega. *(CAT-05, CAT-06)*
- **RF8.** El sistema debe dejar elegir domicilio o recoger en tienda por producto y para todo el pedido. *(CAR-01,
  CAR-02)*
- **RF9.** El sistema debe agrupar el carrito en disponibles y bajo pedido, y no dejar pagar artículos sin
  existencia. *(CAR-03, PAG-08)*
- **RF10.** El sistema debe mostrar, en el paso de envío y en la confirmación, cada envío con su sucursal, sus
  artículos y su fecha, y aparte lo que se recoge. *(PAG-09, PAG-11, PAG-13)*
- **RF11.** El sistema debe mostrar aparte los artículos sin existencia y los que no se pudieron asignar a ninguna
  sucursal ("Caja gris").
- **RF12.** El sistema debe aplicar el IVA que corresponde a la dirección de entrega (8 % en zona fronteriza, 16 %
  en el resto).
- **RF13.** El sistema debe recalcular existencias y envíos al cambiar la tienda, el C.P. o la dirección, también
  durante el pago, y decir qué cambió. *(UBI-05, PAG-07)*
- **RF14.** El sistema debe pedir en el paso 1 solo lo necesario: dirección (con ayuda para capturarla), quién
  recoge si todo se recoge y el checkbox de facturación. *(PAG-04 a PAG-06)*
- **RF15.** El sistema debe aprovechar la dirección predeterminada del cliente registrado. *(CTA-01, CTA-02)*
- **RF16.** El sistema debe permitir seleccionar si se requiere factura. Con el checkbox "Requiero factura"
  aparecen los campos (régimen y uso del CFDI); sin él, se asume **"Público general"**. El cálculo y la emisión
  no son de este proyecto (equipo Mercedes). *(PAG-04)*
- **RF17.** La pasarela debe ir sin la barra de navegación y sin costo de envío, con un indicador que abre los
  pasos ya visitados. *(PAG-01, PAG-03, PAG-10)*
- **RF18.** Todo debe funcionar en escritorio y en celular. *(CEL-01, GEN-01)*
- **RF19.** Si SMC 4.0 no da su propuesta en 2 segundos, el sistema debe avisarlo con "No pudimos calcular tus
  envíos en este momento" y "Reintentar", sin dejar pagar ni inventar envíos.

> **Fuera de alcance (equipo Mercedes):** método de pago (tarjeta, OXXO, 7-Eleven, meses sin intereses),
> asignación del número de pedido, página de gracias con número, "Mis pedidos", tarjeta predeterminada del
> registrado, paso directo del registrado a Confirmación y la demo guiada con globos explicativos.

## 5. Reglas de negocio (con ejemplos)

Las reglas que no se pueden saltar. Los ejemplos usan los datos de la demo (C.P. 45138, tienda Tesistán, Zapopan).

Términos: **Mi tienda** es la que elige el cliente y solo decide dónde recoge; la **sucursal base** es la que tiene
asignada el cliente registrado; la **sucursal predefinida** está configurada para una dirección; las **sucursales
candidatas** son las que pueden surtir una dirección (RN2). Un **pedido** tiene un número y se divide en **envíos**.

- **RN1. Siempre hay resultado si hay una sucursal apta.** Si al menos una sucursal candidata tiene el artículo,
  se muestra un envío o la opción de recoger. *Ejemplo*: en 45138, un inyector que Tesistán tiene completo sale en
  1 envío desde Tesistán.
- **RN2. Sucursales candidatas.** Son las tiendas Local (hasta 15 km) y Local Extendido (hasta 30 km) de la
  dirección, más la sucursal foránea más cercana (hasta 350 km; el número de foráneas se configura y por defecto
  es 1). CEDIS no cuenta. *Ejemplo*: para 45138 son Tesistán (0 km), Belisario Domínguez (19.5 km), Colón
  (21.2 km), Mercado Libre Adolf Horn (29.2 km) y Adolf Horn (29.5 km), y la foránea Zamora (153.6 km).
- **RN3. Fechas en días hábiles.** Local: hoy si se compra antes de las 2:00 p.m., si no el siguiente día hábil;
  Local Extendido: 2 días hábiles; foráneo (bajo pedido): de 2 a 4 días hábiles. Sin sábados, domingos ni días de
  descanso obligatorio. *Ejemplo*: compra el miércoles 7 de octubre de 2026 a las 10:00 en zona Local → "Entrega
  hoy"; a las 16:00 → "Entrega mañana"; el viernes a las 16:00 → "Entrega el lunes 12 de octubre"; Local
  Extendido el miércoles → "Entrega el viernes 9 de octubre"; foráneo el miércoles → "Entrega entre el viernes 9
  y el martes 13 de octubre".
- **RN4. Bajo pedido.** Si la zona no completa la cantidad y la foránea sí, se vende "bajo pedido". *Ejemplo*: el
  filtro de aire tiene 1 pieza en Tesistán: con 1 está disponible; con 2 pasa a bajo pedido. La marcha no tiene
  piezas en la zona: es bajo pedido desde la primera.
- **RN5. Baterías solo cercanas.** Solo de tiendas a 30 km o menos; nunca bajo pedido. *Ejemplo*: en Zacatecas una
  batería aparece sin existencia.
- **RN6. Orden de decisión y división del pedido.** Para cada artículo, en este orden: 1) si es exclusivo de
  recoger, va a "Recoger en tienda"; 2) si la dirección tiene sucursal predefinida, sale de ella y lo que le falta
  de donantes; 3) si el registrado tiene sucursal base que cubre al menos el 80 % del pedido, sale de ella; 4) de
  la tienda candidata más cercana que lo tenga completo; 5) si ninguna lo completa, se junta de las candidatas más
  cercanas; 6) lo que falte, bajo pedido de la foránea más cercana, en un solo envío foráneo; 7) lo que no se pueda
  asignar va a "Caja gris" y lo que no tiene piezas en ninguna candidata, a "Sin existencia". Los artículos de una
  misma sucursal viajan juntos. *Ejemplo*: con todas las piezas de un inyector en línea, el pedido nunca tiene más
  de un envío foráneo.
- **RN7. Recoger usa solo "Mi tienda".** Lo que se recoge no pasa de las piezas de esa tienda y no entra en los
  envíos. *Ejemplo*: si se piden 999 piezas de cinta aislante para recoger, la cantidad se ajusta a las piezas de
  Tesistán.
- **RN8. La tienda de otro estado no mueve la entrega.** *Ejemplo*: un invitado en 45138 elige Monterrey Ruiz como
  "Mi tienda" y su entrega sigue en 45138.
- **RN9. No se paga sin existencia.** *Ejemplo*: con un inyector y una marcha en el carrito, cambiar la dirección a
  Monterrey en el pago deja la marcha en 0 piezas: el cliente regresa al carrito con el aviso "Te regresamos al
  carrito…" y no puede pagar hasta quitarla o guardarla.
- **RN10. Productos exclusivos de recoger.** Un artículo que solo se puede recoger va siempre a "Recoger en
  tienda"; si es parte de una promoción, toda la promoción se recoge. *Ejemplo*: con "Enviar todo a domicilio",
  el artículo exclusivo se queda en "Recoger en tienda".
- **RN11. Sucursal predefinida.** Si la dirección tiene una sucursal fija configurada, el pedido sale de ella y lo
  que le falta se completa con sucursales donantes; se muestra la etiqueta "Sucursal predefinida".
- **RN12. Sucursal base del registrado.** Si la sucursal base del cliente cubre al menos el 80 % del pedido, surte
  lo que tiene y otras sucursales complementan los faltantes en envíos adicionales.
- **RN13. Caja gris.** Lo que no se puede completar en ninguna sucursal de la opción (por ejemplo, una promoción
  cuyas piezas no están completas en ninguna) va a "Caja gris", separada de los envíos y de "sin existencia".
- **RN14. IVA fronterizo.** En códigos postales de la zona fronteriza norte y sur, precios y total con IVA del 8 %;
  en el resto, 16 %. *Ejemplo*: con el C.P. 22000 (Tijuana) el total muestra IVA del 8 %; con 45138, del 16 %.
- **RN15. Facturación opcional (solo visualización).** Régimen fiscal y uso del CFDI solo con "Requiero factura".
  Sin marcarla, se asume **"Público general"**. *Ejemplo*: un cliente que no marca el checkbox pasa al paso 2 sin
  campos fiscales. **Nota:** la lógica de generación de la factura la ejecuta el equipo Mercedes, fuera de este
  proyecto; si el pago no se realiza, no se genera factura.
- **RN16. Un pedido, varios envíos.** La compra es un solo pedido; se divide en los envíos que propone SMC 4.0 y
  cada sucursal recibe por dentro su parte. *Ejemplo*: un pedido con un envío desde Tesistán y otro desde Zamora
  tiene dos envíos. **Nota:** la asignación del número de pedido y Mis pedidos quedan en el alcance del equipo
  Mercedes.

## 6. Criterios de aceptación (verificables sin código)

Escenarios de demostración: al cargar cada uno, el resultado visible debe ser el indicado (sí/no).

- **CA1. Sucursal predefinida (E1).** El pedido sale de la sucursal fija de la dirección, con la etiqueta
  "Sucursal predefinida", y lo que le falta llega de sucursales donantes en envíos aparte.
- **CA2. Sucursal base + complementos (E2).** La sucursal base del cliente, que cubre al menos el 80 %, surte lo
  que tiene y los faltantes llegan de otras sucursales en envíos adicionales.
- **CA3. Productos exclusivos de recoger (E3).** La compra se separa en "Recoger en tienda" y "Envío a domicilio";
  si el exclusivo es parte de una promoción, toda la promoción queda en "Recoger en tienda".
- **CA4. IVA fronterizo (E4).** Con un C.P. fronterizo, los precios y el total salen con IVA del 8 % y un globo lo
  explica.
- **CA5. Sin existencias (E5).** Los artículos sin piezas en las candidatas salen en "Artículos sin existencia"
  con un mensaje claro; si ninguna sucursal es apta, no se muestran opciones de envío.
- **CA6. Caja gris (E6).** Los artículos que no se pueden completar en ninguna sucursal salen en "Caja gris",
  separados de los envíos, y un globo explica por qué.
- **CA7. Cliente no registrado (E7).** Sin iniciar sesión, solo con C.P. o dirección, hay recomendación con el
  segmento de venta al público y sin sucursal base.
- **CA8.** Con el C.P. 45138 y un producto que Tesistán tiene completo, el paso de envío muestra 1 envío desde
  Tesistán con su fecha en días hábiles.
- **CA9.** Con todas las piezas de un inyector en el carrito, el paso de envío nunca muestra más de un envío
  foráneo.
- **CA10.** Al elegir "Recoger en tienda" y escribir más piezas de las que hay en la tienda, la cantidad se ajusta
  a las de la tienda y el producto no queda sin existencia.
- **CA11.** Si todo se recoge, el paso 1 pide quién recoge y su teléfono, y no pide dirección ni datos fiscales.
- **CA12.** Al cambiar la dirección en el pago a una con menos piezas, aparece la leyenda amarilla y se puede
  continuar; si algún artículo queda en 0, el cliente regresa al carrito y "Proceder al pago" queda bloqueado.
- **CA13.** Al cambiar el C.P. desde la barra superior con productos en el carrito, un aviso temporal dice qué
  productos se ajustaron o quedaron sin existencia.
- **CA14.** Si el cliente no marca "Requiero factura" en el paso 1, los campos de datos fiscales (régimen y uso
  del CFDI) permanecen ocultos y el sistema asume "Público general" sin bloquear el avance del flujo.
- **CA15.** En un celular de 390 px se abre el menú, "Mis vehículos", el inicio de sesión y el carrito sin
  desplazar la página de lado.
- **CA16.** Si SMC 4.0 no responde en 2 segundos, el paso de envío muestra "No pudimos calcular tus envíos en este
  momento" con "Reintentar", y "Continuar" no deja avanzar.

## 7. Casos límite

Tomados de la spec v1, de las decisiones de la demo y del catálogo. Pendiente: el archivo adjunto que el usuario
indicó para casos límite y fuera de alcance; cuando llegue se completan estas dos secciones.

- **CL1.** ¿El C.P. no existe o no tiene sucursales? Se dice que no hay sucursales que surtan esa dirección y no se
  muestran opciones de envío.
- **CL2.** ¿El carrito está vacío? "Proceder al pago" no avanza.
- **CL3.** ¿Un artículo se reparte entre dos sucursales? Se muestra cuántas piezas salen de cada una.
- **CL4.** ¿Una promoción o paquete? Si una sucursal lo tiene completo sale junto; si no, sus partes por separado,
  o en "Caja gris" si ninguna lo completa.
- **CL5.** ¿Se compra después de las 2:00 p.m., en fin de semana o antes de un festivo? La fecha pasa al siguiente
  día hábil.
- **CL6.** ¿El invitado escribe en el paso 1 un C.P. donde algo no tiene piezas? Regresa al carrito con un aviso
  que nombra esos artículos. *(PAG-08)*
- **CL7.** ¿El cliente pide más piezas de las que hay? Carga "Validando existencias" y la cantidad vuelve al
  máximo con aviso. *(CAT-03)*
- **CL8.** ¿El cliente elige recoger y su tienda no tiene el producto? La opción dice "No disponible en tu tienda"
  y el producto sigue a domicilio. *(CAR-01)*
- **CL9.** ¿Elige una tienda de otro estado? Solo cambia dónde recoge. *(UBI-04)*
- **CL10.** ¿Elimina la dirección de entrega que está usando? La entrega pasa a la predeterminada; sin
  direcciones, al C.P. inicial. *(CTA-02)*
- **CL11.** ¿No da permiso de ubicación o cierra el aviso? Aparece "Elige una tienda"; mientras no elija, se usa la
  ubicación inicial. *(UBI-01, UBI-06)*
- **CL12.** ¿El registrado cambia a otra dirección con el mismo C.P.? Cambia sin aviso de recálculo. *(PAG-07)*
- **CL13.** ¿El registrado tiene varios envíos o algo para recoger? Entra al paso 2, no directo a la
  confirmación. *(CAR-07)*
- **CL14.** ¿Un producto solo lo tiene CEDIS? Aparece sin existencia y no se muestra en los resultados. *(CAT-06)*
- **CL15.** ¿Se recarga la página de la demo? Se pierden carrito, sesión y ubicación (solo en la demo).
- **CL16.** ¿SMC 4.0 no responde o tarda más de 2 segundos (sitio real)? Aviso "No pudimos calcular tus envíos en
  este momento" con "Reintentar"; no se paga sin propuesta. *(Clarifications)*

## 8. Fuera de alcance

Lo que esta versión NO hace.

- **Pagos y facturación (equipo Mercedes):** método de pago (tarjeta, OXXO, 7-Eleven, meses sin intereses),
  pasarela de cobro, asignación del número de pedido, página de gracias con número y "Mis pedidos", tarjeta
  predeterminada del registrado y paso directo del registrado a Confirmación. Este proyecto no modifica cómo se
  ejecuta el pago; solo cómo se visualiza la selección de facturación. Si el cliente no realiza el pago, no se
  genera factura.
- **Demo guiada:** escenarios cargables E1–E7 con globos explicativos (se consideró en el borrador anterior; sale
  del alcance en esta versión).
- Modificar las reglas o los parámetros de SMC 4.0 desde la tienda.
- Surtido físico, guías, rastreo de paquetería y facturación electrónica (la tienda solo captura la bandera de
  "Requiero factura").
- Cupón de descuento, "Mis listas", notificaciones de la campana y facturación con RFC, razón social o C.P.
  fiscal.
- Compatibilidad real con el vehículo (sigue simulada; es un riesgo registrado en el catálogo).
- Lo marcado "solo de la demo" en el catálogo (datos de ejemplo, ajuste al zoom, galería de Figma).
- Devoluciones y cambios de pedidos ya pagados.
- Clientes B2B con crédito Apymsa.
- Opciones alternativas de surtido (hasta 3) además de la recomendada: quedan como propuesta.
