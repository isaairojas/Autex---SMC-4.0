# H05 · Datos del usuario, direcciones y selección de facturación

- **Fecha**: 2026-10-12 · **Estado**: borrador · **Constitution**: 3.0.0
- **Índice**: `specs/historias-de-usuario.md` · **Catálogo**: PAG-04, PAG-06, PAG-07, PAG-08, CTA-02, UBI-03
  (direcciones del registrado), CAR-02 ("Cambiar" en el carrito)
- **Depende de**: H03, H04 · **La usan**: H01, H06

## 1. Objetivo y contexto de negocio

Hay un solo formulario de dirección en todo el sitio, con el autocompletado de direcciones de Google: lo usa el
invitado en "Datos del usuario" (paso 1 del pago) y el registrado para agregar o editar direcciones desde Mi
perfil, "Entrega en", el carrito o la pasarela. El registrado puede cambiar su dirección de entrega desde el
carrito y desde cualquier paso. Si cambia el C.P., se recalculan existencias y envíos.

Esta historia también cubre la **selección de facturación** como visualización: un checkbox "Requiero factura"
que oculta/muestra los campos fiscales (régimen y uso del CFDI). Si el cliente no lo marca, el sistema asume
**"Público general"** y no bloquea el flujo.

> **Nota — equipo Mercedes.** La lógica y la emisión de la factura (y el cálculo del cobro) **no** son de este
> proyecto; corresponden al equipo **Mercedes**. Este proyecto solo cambia **cómo se visualiza** la selección de
> facturación. El pago se realiza únicamente al momento de estar en la plataforma; si no se paga, no se genera
> factura.

**Por qué importa**: hoy el invitado captura todo a mano y siempre ve los datos fiscales. Con este cambio, los
datos fiscales se piden solo cuando el cliente los necesita.

## 2. Usuarios

- **Invitado**: llena el paso 1 después de elegir "Usuario invitado".
- **Registrado**: con o sin direcciones guardadas.

## 3. Escenarios de usuario (historias)

- **HU1 (P1)** — Como invitado, quiero que mi dirección se complete al escribirla, para no capturarla toda.
- **HU2 (P1)** — Como cliente, quiero que solo se me pidan datos fiscales si quiero factura.
- **HU3 (P1)** — Como registrado, quiero cambiar mi dirección de entrega desde el carrito y que el paso 1 llegue
  lleno.
- **HU4 (P1)** — Como cliente en Confirmación, quiero regresar a corregir mi dirección sin capturar todo de nuevo.
- **HU5 (P2)** — Como registrado, quiero agregar, editar, eliminar o marcar como predeterminada una dirección.

## 4. Requisitos funcionales

**Formulario (uno solo)**
- **RF1.** "Buscar dirección" sugiere direcciones de Google mientras se escribe y llena calle, número, C.P. y
  colonia; ciudad y estado se llenan solos; todo se puede corregir a mano. *(PAG-06)*
- **RF2.** "Continuar" se habilita al completar lo obligatorio; lo capturado se conserva al moverse entre pasos.
  *(PAG-06)*
- **RF3.** Régimen fiscal y uso del CFDI solo con "Requiero factura"; no se piden RFC, razón social ni C.P.
  fiscal. *(PAG-04)*
- **RF4.** Si todo se recoge, solo pide quién recoge y su teléfono (H04).

**Registrado**
- **RF5.** El paso 1 muestra el mismo formulario, lleno con la dirección en uso y los datos del pedido anterior,
  con sus direcciones guardadas arriba para llenarlo con una de ellas. *(PAG-06)*
- **RF6.** "Cambiar" de "Dirección de entrega" en el carrito abre sus direcciones con "Agregar dirección".
  *(CAR-02, UBI-03)*
- **RF7.** En Mi perfil, cada dirección tiene nombre, "Editar", "Usar como predeterminada" y "Eliminar"; "Añadir
  dirección" usa el formulario. Una dirección agregada en el carrito o el pago queda como la de entrega. *(CTA-02)*

**Cambio de dirección en cualquier paso**
- **RF8.** Desde el carrito y desde los 4 pasos se puede cambiar la dirección; editarla modifica esa dirección (la
  guardada, en el registrado). *(PAG-07)*
- **RF9.** Si cambia el C.P.: confirmación ("Al cambiar la dirección de entrega, los precios y la disponibilidad de
  tus productos podrían cambiar, ¿desea continuar?"), recálculo según domicilio o recoger y regreso a Método de
  envío con una leyenda amarilla de lo ajustado y "Quitar productos sin existencia". Con el mismo C.P., sin aviso.
  *(PAG-07)*
- **RF10.** Si algún artículo queda en 0 piezas (también si el invitado escribe un C.P. sin piezas), el cliente
  regresa al carrito con un aviso que lo nombra. *(PAG-08)*

## 5. Reglas de negocio (con ejemplos)

- **RN1. Factura opcional.** *Ejemplo*: sin marcarla no aparece "Datos fiscales".
- **RN2. Confirmación por cambio de C.P.** *Ejemplo*: de "Casa · 45138" a "Oficina · 64000" aparece la pregunta;
  de "Casa · 45138" a "Taller · 45138", no.
- **RN3. Editar es editar.** *Ejemplo*: corregir el número exterior de "Casa" actualiza "Casa" en Mi perfil.
- **RN4. No se paga sin existencia.** *Ejemplo*: con una marcha en el carrito, cambiar a Monterrey regresa al
  carrito con "Te regresamos al carrito…".
- **RN5. Eliminar la de entrega.** *Ejemplo*: si se elimina "Oficina" mientras se usa, la entrega pasa a la
  predeterminada; sin direcciones, al C.P. inicial.

## 6. Criterios de aceptación (verificables sin código)

- **CA1.** Escribir "Av. Juan Gil Preciado" sugiere direcciones y al elegir una se llenan calle, C.P. y colonia.
- **CA2.** Sin "Requiero factura" no se ven datos fiscales; al marcarlo aparecen.
- **CA3.** El registrado llega al paso 1 con la dirección en uso ya llena.
- **CA4.** Desde el carrito, el registrado cambia a una dirección de Monterrey y se actualizan dirección y
  existencias.
- **CA5.** Desde Confirmación, el indicador abre Datos del usuario lleno; cambiar a un C.P. con menos piezas lleva
  a Método de envío con la leyenda amarilla.
- **CA6.** En Mi perfil, agregar una dirección con el autocompletado y verla en "Entrega en".

## 7. Casos límite

- **CL1.** ¿Google no encuentra la dirección? Se captura a mano; la colonia se elige según el C.P.
- **CL2.** ¿El autocompletado no trae número? El campo queda vacío y es obligatorio.
- **CL3.** ¿Registrado sin direcciones? El carrito muestra "Zona de entrega" con "Agregar dirección" y el paso 1
  llega vacío.
- **CL4.** ¿Cancela la confirmación de cambio de C.P.? La dirección queda como estaba.
- **CL5.** ¿Edita una dirección usada en un pedido pagado? El pedido conserva la dirección con la que se pagó.
- **CL6.** ¿Elimina la predeterminada? La primera de la lista pasa a serlo.
- **CL7.** ¿Celular? Mi perfil está pendiente de llevar a celular (entrega 4 del plan).

## 8. Fuera de alcance

- Crear cuenta desde el pago, direcciones fiscales y validar que la dirección exista físicamente.
