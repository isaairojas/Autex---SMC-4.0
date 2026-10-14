# H07 · Pago, confirmación y pedido: método de pago, paso directo del registrado, gracias y Mis pedidos

- **Fecha**: 2026-10-12 · **Estado**: borrador · **Constitution**: 3.0.0
- **Índice**: `specs/historias-de-usuario.md` · **Catálogo**: PAG-02, PAG-13, PAG-14, PAG-15, CTA-04, CAR-07,
  PED-01, PED-02, GEN-04
- **Depende de**: H02, H05, H06

## 1. Objetivo y contexto de negocio

El paso 3 acepta tarjeta y pago en tienda de autoservicio; el registrado tiene una tarjeta predeterminada. El paso
4 "Confirmación" muestra el pedido por envío, lo que se recoge, el pago y la facturación. Al pagar se asigna el
número de pedido, que aparece en la página de gracias y en "Mis pedidos". El registrado con datos completos y al
menos un envío previo pasa del carrito directo a Confirmación, con todo ya elegido.

**Decisiones (por confirmar)**:
- El paso directo conserva las condiciones de CAR-07 (todo a domicilio y un solo envío) y agrega la nueva: al menos
  un envío previo a esa dirección. Con varios envíos o algo para recoger entra al paso 2.
- Sin factura previa, la confirmación muestra "Facturación: Público general" (antes se ocultaba).

**Por qué importa**: hoy el paso 3 solo acepta tarjeta, el sitio asigna el número al entrar al pago y deja pedidos
pendientes aunque no se paguen.

## 2. Usuarios

- **Invitado**: captura su tarjeta o elige tienda de autoservicio; ve su número en gracias.
- **Registrado**: tarjetas guardadas, paso directo y "Mis pedidos".

## 3. Escenarios de usuario (historias)

- **HU1 (P1)** — Como cliente sin tarjeta, quiero pagar en OXXO o 7-Eleven.
- **HU2 (P1)** — Como cliente, quiero revisar mi pedido por envío antes de pagar.
- **HU3 (P1)** — Como cliente, quiero recibir mi número de pedido al pagar y verlo en Mis pedidos.
- **HU4 (P2)** — Como cliente frecuente, quiero ir directo a confirmar, para comprar en menos pasos.

## 4. Requisitos funcionales

**Paso 3 Método de pago**
- **RF1.** "Otras formas de pago" ofrece tienda de autoservicio (OXXO, 7-Eleven) con plazo de 3 días. *(PAG-14)*
- **RF2.** El titular empieza con el nombre del cliente; se validan número, vigencia (MM/AA) y CVV. *(PAG-15)*
- **RF3.** El registrado ve su tarjeta predeterminada marcada y elegida; la cambia en Mi perfil → Método de pago o
  con "Usar esta tarjeta como predeterminada". *(CTA-04)*

**Paso 4 Confirmación**
- **RF4.** Muestra la dirección, cada envío plegado (sucursal, fecha y artículos), "Recoger en tienda" aparte con
  quién recoge, el método de pago y "Facturación" (o "Público general"). *(PAG-13)*
- **RF5.** "Cambiar" del envío abre el cambio de dirección; el del pago, el paso 3; el de facturación, Datos del
  usuario. *(PAG-13)*

**Paso directo del registrado**
- **RF6.** Pasa del carrito a Confirmación si tiene dirección con al menos un envío previo, tarjeta
  predeterminada, todo va a domicilio y SMC 4.0 propone un solo envío; aviso "Tu información está completa y tu
  pedido llega en un solo envío". Método de envío, pago y facturación (la del último pedido o "Público general")
  ya elegidos. *(CAR-07)*

**Pedido pagado**
- **RF7.** Antes de pagar dice "Pago del pedido", sin número; el número se asigna al pagar. *(PAG-02)*
- **RF8.** Gracias muestra el número y, si aplica, la tienda de autoservicio; sin "Tu auto está por estrenar";
  "Seguir comprando" conserva la sesión. *(PED-02, GEN-04)*
- **RF9.** Mis pedidos muestra fecha, piezas, total, artículos, dirección o tienda, envíos y estado ("En
  preparación" o "Pago pendiente en tienda"); el carrito queda vacío. *(PED-01)*

## 5. Reglas de negocio (con ejemplos)

- **RN1. Plazo de autoservicio.** *Ejemplo*: elegir OXXO el 12 de octubre da hasta el 15 para pagar.
- **RN2. Envío previo.** *Ejemplo*: un registrado que solo ha recogido en tienda entra al paso 1.
- **RN3. Facturación anterior.** *Ejemplo*: si su último pedido se facturó con régimen 612 y uso G03, aparecen esos.
- **RN4. Un pedido, varios envíos.** *Ejemplo*: un pedido de Tesistán y Zamora aparece una vez en Mis pedidos con
  sus 2 envíos.
- **RN5. Sin número sin pago.** *Ejemplo*: abandonar el pago no deja pedido pendiente.

## 6. Criterios de aceptación (verificables sin código)

- **CA1.** Una tarjeta con vigencia 13/26 marca error.
- **CA2.** Elegir tienda de autoservicio muestra su plazo y la confirmación dice "Tienda de autoservicio".
- **CA3.** La confirmación muestra cada envío con su sucursal y fecha; sin factura previa, "Público general".
- **CA4.** Registrado con dirección, envío previo y tarjeta, todo a domicilio y un envío: "Proceder al pago" abre
  Confirmación con el aviso; con algo para recoger, entra al paso 2.
- **CA5.** El número aparece solo en gracias y Mis pedidos; tras pagar, el carrito está vacío.

## 7. Casos límite

- **CL1.** ¿La tarjeta predeterminada venció? No se elige sola; el paso directo entra al paso 3 con aviso.
- **CL2.** ¿Sin tarjeta guardada? El registrado entra al paso 3 con lo demás lleno; sin direcciones, al paso 1.
- **CL3.** ¿El pago se rechaza? Se queda en Confirmación con aviso, sin número.
- **CL4.** ¿No paga en la tienda de autoservicio en el plazo? El pedido se cancela (por confirmar con negocio).
- **CL5.** ¿Invitado? Ve el número en gracias; no tiene Mis pedidos.

## 8. Fuera de alcance

- Meses sin intereses, crédito Apymsa (B2B), cupones, pagar con un clic sin Confirmación.
- Devoluciones, cancelaciones, PDF y XML de factura.
