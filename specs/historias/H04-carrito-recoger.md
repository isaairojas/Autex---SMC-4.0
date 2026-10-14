# H04 · Carrito y recoger en tienda

- **Fecha**: 2026-10-12 · **Estado**: borrador · **Constitution**: 3.0.0
- **Índice**: `specs/historias-de-usuario.md` · **Catálogo**: CAR-01, CAR-02, CAR-03, CAR-04, CAR-05, CAR-06,
  PAG-05 · **Spec v2**: RN7, RN10
- **Depende de**: H01, H02, H03 · **La usan**: H05, H06, H07

## 1. Objetivo y contexto de negocio

El carrito muestra las existencias en línea y en la sucursal elegida de cada producto, deja elegir envío a
domicilio o recoger en tienda (por producto o para todo) y dice a dónde se entrega: la zona (C.P.) o la dirección;
con un pedido mixto, la sucursal de recolección y el destino del envío. Recoger usa solo las piezas de la sucursal
elegida, y los productos exclusivos de recoger siempre van ahí.

**Por qué importa**: hoy el carrito es una sola lista, no se elige el método de entrega y no se puede recoger.

## 2. Usuarios

- **Invitado y registrado sin direcciones**: ven "Zona de entrega" con el C.P.
- **Registrado con dirección**: ve "Dirección de entrega" y la puede cambiar (H05).

## 3. Escenarios de usuario (historias)

- **HU1 (P1)** — Como cliente, quiero elegir por producto si me lo envían o lo recojo.
- **HU2 (P1)** — Como cliente, quiero ver a dónde se entrega y dónde recojo antes de pagar.
- **HU3 (P2)** — Como cliente, quiero mandar todo a domicilio o recoger todo con un solo clic.
- **HU4 (P2)** — Como negocio, quiero que los exclusivos de recoger nunca se envíen.

## 4. Requisitos funcionales

- **RF1.** Cada producto muestra piezas en línea y en "Mi tienda" y las opciones "Enviar a domicilio" y "Recoger
  en tienda"; cada cambio muestra "Calculando disponibilidad en tienda". *(CAR-01)*
- **RF2.** "Enviar todo a domicilio" y "Recoger todo en tienda"; lo que la sucursal no tiene se queda a domicilio
  con aviso. *(CAR-01)*
- **RF3.** Recoger usa solo las piezas de "Mi tienda"; si se agregan más desde el catálogo o el detalle, la
  cantidad se ajusta con aviso y el producto no queda sin existencia. *(CAR-04)*
- **RF4.** Un exclusivo de recoger va siempre a "Recoger en tienda"; si es parte de una promoción, toda la
  promoción se recoge.
- **RF5.** Si algo va a domicilio, "Zona de entrega" (ciudad y alrededores con el C.P.) o "Dirección de entrega";
  si algo se recoge, "Recoger en tienda" con la sucursal; en un pedido mixto, las dos, cada una con "Cambiar".
  *(CAR-02)*
- **RF6.** Agrupar en "Productos disponibles" y "Productos bajo pedido"; los sin existencia bloquean "Proceder al
  pago" hasta eliminarlos o guardarlos. *(CAR-03)*
- **RF7.** Imagen y nombre abren el detalle. *(CAR-05)*
- **RF8.** El subtotal cuenta las mismas piezas en todo el carrito; un guardado que regresa se suma a su línea.
  *(CAR-06)*
- **RF9.** Si todo se recoge, el paso 1 del pago solo pide quién recoge y su teléfono (H05). *(PAG-05)*

## 5. Reglas de negocio (con ejemplos)

- **RN1. Zona del invitado.** *Ejemplo*: "Zona de entrega: Guadalajara y sus alrededores · C.P. 45138".
- **RN2. Mixto.** *Ejemplo*: inyector a domicilio y cinta aislante para recoger muestran "Dirección de entrega" y
  "Recoger en tienda: Autex Tesistan".
- **RN3. Tope de la sucursal.** *Ejemplo*: 999 piezas de cinta aislante para recoger se ajustan a las de Tesistán.
- **RN4. Exclusivos.** *Ejemplo*: con "Enviar todo a domicilio", el exclusivo se queda en "Recoger en tienda".
- **RN5. Sin existencia bloquea.** *Ejemplo*: una marcha sin piezas en la zona deja "Proceder al pago"
  desactivado.

## 6. Criterios de aceptación (verificables sin código)

- **CA1.** Cambiar un producto a "Recoger en tienda" muestra la sucursal en el bloque de recolección.
- **CA2.** "Recoger todo en tienda" deja a domicilio lo que la sucursal no tiene, con aviso.
- **CA3.** Escribir más piezas de las que tiene la sucursal ajusta la cantidad con aviso.
- **CA4.** El invitado ve "Zona de entrega" con su C.P.; el registrado, su dirección.
- **CA5.** Un exclusivo no se puede pasar a domicilio.
- **CA6.** Con un producto sin existencia no se puede proceder al pago.

## 7. Casos límite

- **CL1.** ¿Carrito vacío? "Proceder al pago" no avanza.
- **CL2.** ¿La sucursal no tiene el producto? La opción dice "No disponible en tu tienda" y sigue a domicilio.
- **CL3.** ¿Cambia de sucursal o ubicación? Todo se revisa con aviso (H03).
- **CL4.** ¿Todo bajo pedido? Solo aparece el grupo "Productos bajo pedido".
- **CL5.** ¿Celular? El orden de los bloques es una decisión pendiente (el sitio pone el resumen arriba).

## 8. Fuera de alcance

- Cupón de descuento y costo de envío (no hay, H06).
- Aviso de "listo para recoger" y tiempo de preparación en la sucursal.
