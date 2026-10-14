# H06 · Pasarela y método de envío: sin encabezado y envíos múltiples

- **Fecha**: 2026-10-12 · **Estado**: borrador · **Constitution**: 3.0.0
- **Índice**: `specs/historias-de-usuario.md` · **Catálogo**: PAG-01, PAG-03, PAG-09, PAG-10, PAG-11, PAG-12
  (lo muestra), UBI-07 (fechas por envío)
- **Depende de**: H02 (propuesta de surtido), H04, H05

## 1. Objetivo y contexto de negocio

La pasarela va sin la franja de banners ni la barra de navegación, sin costo de envío y con un indicador que deja
moverse entre pasos. El paso 2 "Método de envío" muestra la propuesta de SMC 4.0: el envío a domicilio dividido
en envíos (cada uno con su sucursal, artículos y fecha), lo que se recoge en tienda y, cuando estén habilitadas,
los envíos desde sucursales foráneas. La pantalla solo muestra lo que decide SMC 4.0 (H02).

**Alcance de esta historia:** paso 1 (datos de usuario y facturación, H05) y **paso 2 (método de envío)**.
Los pasos **3 (método de pago)** y **4 (confirmación con número de pedido)** quedan **fuera de alcance** y los
cubre el equipo **Mercedes**.

**Por qué importa**: hoy el pago muestra el encabezado completo, cobra $249 en pedidos menores a $1,500 y ofrece
un solo "Envío a domicilio" de 24 a 48 horas.

## 2. Usuarios

Clientes no registrados y registrados dentro del pago.

## 3. Escenarios de usuario (historias)

- **HU1 (P1)** — Como cliente que paga, quiero una pantalla sin distracciones y sin costo de envío.
- **HU2 (P1)** — Como cliente, quiero ver en cuántos envíos llega mi pedido, de qué sucursal sale cada uno y
  cuándo.
- **HU3 (P1)** — Como cliente con un pedido mixto, quiero ver aparte lo que recojo.
- **HU4 (P2)** — Como cliente, quiero regresar a cualquier paso que ya visité.

## 4. Requisitos funcionales

**Pasarela**
- **RF1.** Los 4 pasos (Datos del usuario, Método de envío, Método de pago, Confirmación) no muestran la franja
  ni la barra de navegación; muestran el logo (regresa al inicio) y "Volver al carrito". *(PAG-01)*
- **RF2.** No mostrar costo de envío en ningún paso ni en el total. *(PAG-10)*
- **RF3.** El indicador abre cualquier paso ya visitado, hacia atrás o adelante; el registrado tiene "Regresar"
  en Método de envío. *(PAG-03)*

**Paso 2 Método de envío**
- **RF4.** "Calculando tu envío" mientras SMC 4.0 responde; si falla, el aviso con "Reintentar" (H02).
- **RF5.** Si hay varios envíos, "Tu pedido llegará en N envíos"; cada "Envío 1, 2…" se despliega con la
  sucursal, su dirección, los artículos y la fecha. *(PAG-11)*
- **RF6.** "Recoger en tienda" aparte, con la sucursal, dirección y horario. *(PAG-09)*
- **RF7.** Los envíos desde foránea se marcan "Bajo pedido" con su fecha de 2 a 4 días hábiles. *(PAG-12)*
- **RF8.** "Artículos sin existencia" y "Caja gris" aparte cuando SMC 4.0 los devuelva; "Continuar" se bloquea
  mientras haya artículos sin existencia.
- **RF9.** El encabezado de cada sección da el rango de fechas de sus envíos; el resumen separa los productos por
  envío y por "Recoger en tienda". *(UBI-07, PAG-11)*

## 5. Reglas de negocio (con ejemplos)

- **RN1. Un pedido, varios envíos.** *Ejemplo*: un inyector de Tesistán y una marcha de Zamora: "Tu pedido llegará
  en 2 envíos".
- **RN2. El cliente no elige fecha ni sucursal del envío**: las propone SMC 4.0.
- **RN3. Sin costo de envío.** *Ejemplo*: un pedido de $300 no muestra "Agrega $… a tu pedido para envío sin
  costo".

## 6. Criterios de aceptación (verificables sin código)

- **CA1.** En los 4 pasos no se ven la franja ni la barra de navegación, y el resumen no tiene costo de envío.
- **CA2.** Con 45138 y un producto que Tesistán tiene completo: 1 envío desde Tesistán con su fecha.
- **CA3.** Con un producto para recoger y otro a domicilio: "Envío 1" y "Recoger en tienda".
- **CA4.** Con foráneas en 1 y todas las piezas de un inyector: nunca más de un envío foráneo; con foráneas en 0
  no aparecen envíos "Bajo pedido".
- **CA5.** Desde Confirmación, el indicador abre Método de envío.

## 7. Casos límite

- **CL1.** ¿Un artículo se reparte entre dos sucursales? Se muestran las piezas de cada una.
- **CL2.** ¿Todo se recoge? Solo aparece "Recoger en tienda".
- **CL3.** ¿Pasos no visitados? No se abren desde el indicador.
- **CL4.** ¿La promoción de envío gratis se apaga por configuración? Por confirmar con negocio si regresa el costo.
- **CL5.** ¿Celular? El sitio en celular muestra el encabezado completo; se aplica la misma regla (decisión
  pendiente de CEL-01).

## 8. Fuera de alcance

- Opciones alternativas de surtido y elegir fecha de entrega.
- Contenido de los pasos 1, 3 y 4 (H05, H07).
