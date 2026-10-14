<!--
Sync Impact Report
- Versión: 2.1.0 → 3.0.0 (MAYOR, 2026-10-09: se redefine el producto. Ya no es solo la demo: es la integración
  de SMC 4.0 en autex.com.mx, con la demo como fase 1 y las specs de la programación real como fase 2)
- Principios modificados:
  I. Simplicidad ante todo (se quita "Es una versión 1"; la regla aplica a las dos fases)
  IV. Verificable por una persona no técnica ("criterio de éxito" → "criterio de aceptación", como la plantilla)
  V. Respeto por los datos del usuario (capturas con datos reales fuera del repositorio)
  VI. Figma es la fuente de verdad visual → VI. Fuentes de verdad visual y funcional (Figma Autex 2026 en
      escritorio, el sitio actual en celular, la demo como referencia funcional de la fase 2)
- Principios añadidos: VII. SMC 4.0 decide, la tienda muestra · VIII. Trazabilidad
- Secciones modificadas: introducción, Restricciones del producto (fases 1 y 2), Flujo de trabajo (plantilla de
  spec del proyecto y clarify resuelto por el agente)
- Secciones eliminadas: ninguna
- Plantillas dependientes: no se modifican (leen la constitution al ejecutarse). La plantilla de spec de Spec Kit
  (.specify/templates/spec-template.md) tiene otro formato; las specs nuevas usan la plantilla del proyecto
  descrita en "Flujo de trabajo".
- TODOs pendientes: TODO(REPO_SITIO): repositorio y tecnología del sitio donde se programarán los cambios de la
  fase 2.

Reportes anteriores
- Versión: 2.0.0 → 2.1.0 (MENOR, 2026-10-09: se añade la vista de celular)
- Versión: 1.0.0 → 2.0.0 (MAYOR: cambia el producto al que aplica y se redefinen principios)
-->

# Constitution de Autex.com.mx + SMC 4.0

Autex.com.mx es la tienda en línea de autopartes de APYMSA. Este proyecto integra SMC 4.0, el algoritmo que elige
desde qué sucursales se surte cada pedido: cuántos envíos salen, por qué método y qué se recoge en tienda, según la
dirección o el código postal del cliente. En la fase 1, una demo (este repositorio) replica la compra en escritorio
y en celular con SMC 4.0 simulado y explicado. En la fase 2 se escriben las specs para programar los cambios en el
sitio real.

## Core Principles

### I. Simplicidad ante todo

- Ante dos soluciones válidas, se elige SIEMPRE la más simple.
- NO se añade complejidad "por si acaso" (capas, configuraciones, abstracciones o dependencias que hoy no hacen
  falta).
- Cualquier complejidad extra DEBE justificarse por escrito en el plan.

**Por qué**: lo simple se termina antes, se entiende mejor y falla menos.

### II. Español de México y pesos mexicanos

- Todo lo que ve el usuario (pantallas, mensajes y errores) DEBE estar en español de México.
- La única moneda es el peso mexicano (MXN), con formato mexicano: `$1,234.56 MXN`.
- Las fechas siguen el formato mexicano: `dd/mm/aaaa`.

**Por qué**: Autex vende al mercado mexicano.

### III. Cero alcance fantasma

- NO se implementa ninguna funcionalidad que no esté escrita en la spec.
- Si surge una idea nueva, se PROPONE (se anota y se comenta), pero NO se construye hasta que se añada a la spec.

**Por qué**: evita trabajo no pedido, retrasos y sorpresas.

### IV. Verificable por una persona no técnica

- Cada criterio de aceptación DEBE poder comprobarse usando la app, sin leer código.
- Los criterios se redactan como acciones y resultados visibles (p. ej., "al capturar el C.P. 44100 y llegar al
  paso de envío se ve 1 envío desde la sucursal más cercana").

**Por qué**: quien decide si algo está terminado no necesita saber programar.

### V. Respeto por los datos del usuario

- Se pide SOLO la información imprescindible para completar la compra.
- La demo usa datos simulados: NUNCA datos reales de clientes.
- Las capturas del sitio real con datos de un cliente se quedan fuera del repositorio.
- NUNCA se escriben claves, contraseñas ni otros secretos en el código; se guardan fuera de él (por ejemplo, en
  variables de entorno).

**Por qué**: menos datos significa menos riesgo para el usuario y para el proyecto.

### VI. Fuentes de verdad visual y funcional

- En escritorio, Figma Autex 2026 es la fuente de verdad visual: lo que existe ahí se replica tal cual, siguiendo
  `FIGMA_REPLICA.md`. No se rediseña ni se "mejora"; las diferencias inevitables (p. ej. una fuente sustituta) se
  registran en `docs/figma/discrepancias.md`.
- En celular Figma no tiene diseño: la referencia es autex.com.mx en celular (capturas y medidas en
  `docs/autex-real/movil`). Primero se copia tal cual y después se aplican los cambios de la demo (D58).
- Lo que no tenga referencia se arma solo con componentes ya replicados y se marca como "sin respaldo en Figma".
- La demo es la referencia funcional de la fase 2: lo que se programe en el sitio se comporta como la demo, salvo
  que la spec diga otra cosa.

**Por qué**: el resultado debe verse como la tienda que diseñó el equipo y comportarse como lo que negocio ya
revisó en la demo.

### VII. SMC 4.0 decide, la tienda muestra

- Las tiendas que surten un pedido, los envíos, lo que se recoge en tienda y los tiempos de entrega salen del
  cálculo de SMC 4.0. Ninguna pantalla los calcula por su cuenta ni los contradice.
- Si existe al menos una sucursal apta, SIEMPRE se muestra un resultado.
- En la demo, cada decisión del cálculo se explica en lenguaje claro durante el flujo.

**Por qué**: una sola fuente para existencias y envíos evita que el carrito, el pago y el pedido surtido digan
cosas distintas.

### VIII. Trazabilidad

- Cada requisito de una spec cita el ID del cambio del catálogo (`docs/negocio/cambios-demo-vs-autex.md`) o la
  decisión D de `docs/figma/discrepancias.md` de donde sale.
- El catálogo se edita en `docs/negocio/cambios-demo-vs-autex.html` (la fuente) y el MD se genera con
  `node docs/negocio/cambios-a-md.mjs`.
- Toda decisión nueva se registra con su número D antes de construirla.

**Por qué**: quien programe en el sitio debe poder llegar desde cada requisito a lo que negocio vio y aprobó.

## Restricciones del producto

- Producto: integración de SMC 4.0 en autex.com.mx, en escritorio y en celular (dirección o C.P., agregar
  mercancía, carrito, pago y pedidos).
- Fase 1 (este repositorio): demo web con SMC 4.0 y datos simulados; no se conecta al sitio ni a SMC 4.0.
- Fase 2: specs y archivos MD de los cambios del catálogo para programarlos en el sitio real.
  TODO(REPO_SITIO): repositorio y tecnología del sitio donde se programarán.
- Público: clientes registrados y no registrados; personas de negocio que usan la demo para entender el
  comportamiento.
- Idioma y moneda: ver Principio II.

## Flujo de trabajo

- Orden de trabajo: spec → clarify → plan → tareas → implementación.
- Las specs usan la plantilla del proyecto: 1. Objetivo y contexto de negocio · 2. Usuarios · 3. Escenarios de
  usuario (historias) · 4. Requisitos funcionales (qué hace, sin tecnología) · 5. Reglas de negocio con ejemplos
  comprobables · 6. Criterios de aceptación verificables sin código · 7. Casos límite · 8. Fuera de alcance.
- En clarify, el agente resuelve cada duda con la mejor opción y la deja escrita en la spec, con su razón, para
  que una persona la revise.
- La UI de la demo se construye por fases de `FIGMA_REPLICA.md` (inventario → tokens → assets → componentes →
  pantallas → flujos → verificación).
- Antes de dar algo por terminado, se comprueban sus criterios de aceptación usando la app (Principio IV).
- Las ideas nuevas se anotan como propuestas, nunca como código (Principio III).

## Governance

- Esta constitution prevalece sobre cualquier otra práctica del proyecto.
- Toda spec, plan y revisión DEBE comprobar que cumple estos principios.
- Para cambiarla: se propone el cambio por escrito, se aprueba y se actualiza la versión.
- Versionado: MAYOR si se elimina o redefine un principio o el producto; MENOR si se añade un principio o sección;
  PARCHE si solo se aclara la redacción.

**Version**: 3.0.0 | **Ratified**: 2026-10-02 | **Last Amended**: 2026-10-09
