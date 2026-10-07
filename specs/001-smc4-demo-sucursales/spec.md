# Feature Specification: Demo de selección de sucursales con SMC 4.0

**Feature Branch**: `001-smc4-demo-sucursales`

**Created**: 2026-10-02

**Status**: Draft

**Input**: User description: "Integrar el algoritmo de SMC 4.0 para la selección de sucursales que surten
los pedidos de autex.com.mx. Inicialmente, una aplicación demo donde los usuarios recorren un flujo
simulado de compra, ven las opciones de envío resultantes en todos los escenarios y entienden, mediante
globos explicativos, cómo se hace el cálculo de SMC por detrás."

## Contexto

Autex.com.mx es la tienda en línea de autopartes del ecosistema APYMSA. Cuando un cliente compra, hay
que decidir desde qué sucursal (o CEDIS) se surte cada artículo. SMC 4.0 ("Sucursal Más Cercana" v4.0)
es el motor que toma esa decisión: según la dirección del cliente, las existencias de cada sucursal y
sus reglas de negocio, propone una opción **recomendada**, hasta tres opciones **opcionales** y la lista
de artículos **sin existencia**.

Esta versión es una **demo**: un flujo de compra simulado que muestra al usuario qué opciones de envío
obtiene, en cuántos envíos se divide su compra, cuánto tarda cada uno, y por qué (explicación paso a
paso con globos).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver la mejor sucursal para mi dirección (Priority: P1)

Como cliente **no registrado**, capturo mi código postal o dirección, agrego artículos al carrito y
llego a la selección de envío. La demo me muestra la opción recomendada por SMC 4.0: qué sucursal(es)
surten mi pedido, cuántos envíos serán, qué artículos van en cada uno, el costo de envío y la fecha
estimada de entrega.

**Why this priority**: es el corazón del producto; sin esto no hay demo.

**Independent Test**: capturar un código postal de prueba, agregar artículos con existencia en una
sola sucursal cercana y comprobar que la opción recomendada muestra esa sucursal con un solo envío.

**Acceptance Scenarios**:

1. **Given** un cliente no registrado con un código postal válido, **When** agrega artículos que una
   sola sucursal cercana tiene completos, **Then** la opción recomendada muestra 1 envío desde esa
   sucursal, con costo y fecha estimada.
2. **Given** un cliente no registrado, **When** ninguna sucursal tiene todos los artículos, **Then** la
   recomendada muestra la compra dividida en varios envíos e indica qué artículos van en cada uno.
3. **Given** cualquier resultado, **When** el cliente revisa las existencias de un artículo, **Then** la
   pantalla indica que las existencias corresponden a las sucursales de su dirección.

---

### User Story 2 - Entender cómo decidió SMC 4.0 (Priority: P1)

Durante todo el flujo, el usuario ve globos explicativos que describen, en lenguaje claro, qué paso del
cálculo se aplicó (sucursales candidatas por cercanía, cobertura del 100 %, sucursal base, división
PickUp/Delivery, sucursal predefinida, etc.) y por qué se eligió la opción mostrada.

**Why this priority**: el propósito declarado de la demo es explicar el cálculo, no solo mostrarlo.

**Independent Test**: recorrer cualquier escenario y comprobar que cada pantalla del flujo tiene al
menos un globo y que el globo de la selección de envío nombra la regla que determinó el resultado.

**Acceptance Scenarios**:

1. **Given** el paso de selección de envío, **When** el usuario abre el globo de la opción recomendada,
   **Then** ve la lista de sucursales candidatas consideradas, su distancia y su cobertura, y la regla
   que decidió el resultado.
2. **Given** que hubo artículos sin existencia, **When** el usuario abre el globo correspondiente,
   **Then** se explica que ninguna sucursal candidata los tenía.

---

### User Story 3 - Recorrer todos los escenarios de SMC 4.0 (Priority: P2)

El usuario puede elegir y recorrer cada uno de los escenarios de demostración y ver cómo cambian las
opciones de envío en cada caso.

**Why this priority**: permite mostrar a negocio todos los comportamientos del algoritmo.

**Independent Test**: seleccionar cada escenario de la lista y comprobar que su resultado coincide con
el esperado descrito en la sección "Escenarios de demostración".

**Acceptance Scenarios**:

1. **Given** la lista de escenarios, **When** el usuario elige uno, **Then** la demo carga
   automáticamente su dirección, cliente y carrito, y muestra el resultado esperado para ese escenario.

---

### User Story 4 - Elegir entre opción recomendada y opcionales (Priority: P3)

El usuario ve, además de la recomendada, hasta tres opciones alternativas que surten su pedido completo
y puede seleccionar una para continuar con la compra simulada hasta la confirmación.

**Why this priority**: completa el flujo, pero la demo aporta valor sin él.

**Independent Test**: en un escenario con alternativas, elegir una opcional y llegar a la confirmación
mostrando las sucursales de la opción elegida.

**Acceptance Scenarios**:

1. **Given** un resultado con opciones alternativas, **When** el usuario elige una, **Then** el resumen
   de confirmación muestra los envíos de esa opción, no los de la recomendada.

### Escenarios de demostración

Cada escenario es un criterio de aceptación: al cargarlo, el resultado visible debe ser el indicado.

| # | Escenario | Resultado esperado visible en la demo |
|---|-----------|----------------------------------------|
| E1 | **Sucursal predefinida** | La dirección tiene una sucursal fija configurada; el pedido sale de ella y lo que le falta se completa con sucursales donantes. Se muestra la etiqueta "Sucursal predefinida". |
| E2 | **Sucursal base + complementos** | La sucursal base del cliente cubre al menos el porcentaje mínimo (p. ej. 80 %); surte lo que tiene y otras sucursales complementan los faltantes en envíos adicionales. |
| E3 | **Productos exclusivos PickUp** | El carrito incluye artículos que solo se pueden recoger en tienda; la compra se separa en una parte "Recoger en tienda" y otra "Envío a domicilio". Si un artículo exclusivo es parte de una promoción, toda la promoción pasa a "Recoger en tienda". |
| E4 | **IVA fronterizo** | Con un código postal de zona fronteriza, los precios y el total se muestran con IVA del 8 % en lugar del 16 %, y un globo lo explica. |
| E5 | **Sin existencias** | Ningún artículo (o parte de ellos) tiene existencia en las sucursales candidatas; se muestran en "Artículos sin existencia" con un mensaje claro. Si ninguna sucursal es apta, no se muestran opciones de envío. |
| E6 | **Caja gris** | Al armar una opción, uno o más artículos no se pueden completar en ninguna sucursal del conjunto (p. ej., una promoción cuyas piezas no están completas en una sola sucursal ni en ninguna). Esos artículos se muestran en una sección "Caja gris" (no asignados a ninguna sucursal), separados de los envíos, y un globo explica por qué. |
| E7 | **Cliente no registrado** | Sin iniciar sesión, solo con código postal/dirección, se obtiene recomendación usando el segmento de venta al público y sin sucursal base. |

### Edge Cases

- **Código postal inválido o sin cobertura**: se muestra un mensaje indicando que no hay sucursales
  que surtan esa dirección; no se muestran opciones de envío.
- **Carrito vacío**: no se puede avanzar a la selección de envío.
- **Existencia parcial de un artículo**: un mismo artículo puede dividirse entre dos sucursales; la
  demo muestra cuántas piezas salen de cada una.
- **Opción alternativa incompleta**: no se muestra; solo aparecen alternativas que cubren el 100 %.
- **Promoción o paquete**: si una sola sucursal tiene el paquete completo, sale junto; si no, se
  muestran sus componentes por separado.
- **Fecha estimada en día festivo o tras hora de corte**: la fecha mostrada salta al siguiente día
  hábil.
- Los casos límite adicionales se definirán en el documento adjunto que el usuario indicó (pendiente
  de recibir).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir capturar un código postal o dirección de entrega sin iniciar
  sesión.
- **FR-002**: El sistema DEBE mostrar las existencias de cada artículo considerando solo las sucursales
  candidatas de esa dirección, e indicarlo al usuario.
- **FR-003**: El sistema DEBE permitir armar un carrito con artículos de un catálogo de demostración.
- **FR-004**: El sistema DEBE calcular las opciones de envío aplicando las reglas de SMC 4.0: rutas
  CEDIS, sucursal predefinida, PickUp y Delivery por segmento, cobertura 100 %, sucursal base,
  asignación sucesiva por sucursal y opciones alternativas.
- **FR-005**: El sistema DEBE mostrar una opción recomendada y hasta tres opciones opcionales, cada una
  con: sucursales, artículos y piezas por envío, número de envíos, método (domicilio o recoger en
  tienda), costo de envío y fecha estimada de entrega.
- **FR-006**: El sistema DEBE mostrar los artículos sin existencia por separado.
- **FR-007**: El sistema DEBE mostrar siempre al menos una opción cuando exista una sucursal apta.
- **FR-008**: El sistema DEBE mostrar globos explicativos en cada paso del flujo (dirección, carrito,
  envío, pago simulado, confirmación) describiendo en lenguaje claro la regla aplicada.
- **FR-009**: El sistema DEBE ofrecer una lista de escenarios de demostración (E1–E7) que carguen
  automáticamente dirección, cliente y carrito.
- **FR-010**: El sistema DEBE permitir completar la compra simulada hasta una pantalla de confirmación
  sin cobrar ni generar pedidos reales.
- **FR-011**: El sistema DEBE aplicar IVA del 8 % en códigos postales de zona fronteriza y 16 % en el
  resto, mostrándolo en el resumen.
- **FR-012**: Todos los textos DEBEN estar en español de México y los importes en pesos mexicanos
  (`$1,234.56 MXN`).
- **FR-013**: La demo DEBE funcionar con datos simulados (sucursales, existencias, clientes,
  direcciones y artículos de ejemplo) y un cálculo simulado que reproduce las reglas de SMC 4.0, sin
  conectarse al servicio real; cada escenario da siempre el mismo resultado.
- **FR-014**: El sistema DEBE mostrar en una sección "Caja gris" los artículos que no se pudieron
  asignar a ninguna sucursal de la opción, distinguiéndolos de los artículos sin existencia.
- **FR-015**: La demo DEBE verse como la tienda Autex.com.mx de escritorio definida en Figma
  (cabecera, pie de página, inicio, detalle de producto y los 4 pasos del checkout).
- **FR-016**: El usuario DEBE poder elegir su dirección o código postal antes de agregar mercancía,
  y ver las existencias según esa ubicación.
- **FR-017**: El flujo completo (dirección/C.P. → agregar mercancía → checkout → confirmación) DEBE
  poder recorrerse como invitado y como cliente registrado (inicio de sesión simulado), incluyendo los
  casos B2C, B2B con crédito, envío a domicilio, recoger en sucursal y pago en tienda.

### Key Entities

- **Cliente**: registrado o no registrado; segmento de venta; sucursal base (solo registrados).
- **Dirección de entrega**: código postal, ubicación aproximada, si es zona fronteriza, si tiene
  sucursal predefinida.
- **Sucursal**: nombre, ubicación, servicios (domicilio/recoger), existencias por artículo; incluye el
  CEDIS central.
- **Artículo**: nombre, precio, si es exclusivo PickUp, si es transitorio, si forma parte de promoción.
- **Opción de surtido**: recomendada u opcional; lista de envíos.
- **Envío**: sucursal origen, artículos y piezas, método, costo, fecha estimada, etiquetas (predefinida,
  traspaso).
- **Escenario de demostración**: nombre, cliente, dirección, carrito y resultado esperado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los 7 escenarios de demostración muestran exactamente el resultado esperado descrito en
  la tabla, comprobado usando solo la app.
- **SC-002**: Una persona sin conocimientos técnicos completa el flujo de compra simulado (dirección →
  carrito → envío → confirmación) en menos de 3 minutos.
- **SC-003**: Tras recorrer un escenario, al menos 8 de cada 10 usuarios de prueba explican con sus
  palabras por qué se eligió esa sucursal.
- **SC-004**: El 100 % de las pantallas del flujo tienen al menos un globo explicativo.
- **SC-005**: Las opciones de envío aparecen en menos de 2 segundos tras llegar al paso de envío.

## Fuera de alcance

- Cobro real, pasarela de pagos o crédito AutexPay.
- Crear pedidos reales, apartar o bloquear existencias en el ERP.
- Surtido físico, generación de guías, facturación o rastreo de paquetería.
- Inicio de sesión real o registro de clientes.
- Devoluciones, listas de deseos, búsqueda por vehículo o catálogo completo.
- Modificar las reglas o parámetros de SMC 4.0 desde la demo.
- Conexión con el servicio real de SMC 4.0 o con existencias reales.

## Assumptions

- La tienda es autex.com.mx (la historia de usuario menciona apymsa.com; se asume el mismo ecosistema).
- Los clientes no registrados usan el segmento de venta al público y no tienen sucursal base.
- La sucursal predefinida depende de la dirección, por lo que aplica también a no registrados.
- IVA fronterizo: 8 % para códigos postales de la región fronteriza norte y sur; 16 % en el resto.
- Los parámetros (porcentaje de sucursal base, radios, número de donantes) usan valores de ejemplo
  realistas fijos para la demo.
- La demo la usan personas de negocio y clientes de prueba para entender el comportamiento.
