<!--
Sync Impact Report
- Versión: 1.0.0 → 2.0.0 (MAYOR: cambia el producto al que aplica y se redefinen principios)
- Producto: PresupuestosPro → Autex.com.mx + SMC 4.0 (demo de selección de sucursales)
- Principios modificados:
  II. Español de México y pesos mexicanos (se quita la mención al PDF; aplica a toda la tienda)
  IV. Verificable por una persona no técnica (ejemplo actualizado a Autex)
  V. Respeto por los datos del usuario (ya no habla de "presupuesto"; añade datos simulados)
- Principios añadidos: VI. Figma es la fuente de verdad visual
- Secciones modificadas: Restricciones del producto, Flujo de trabajo
- Secciones eliminadas: ninguna
- Plantillas dependientes: no modificadas (leen la constitution en tiempo de ejecución)
- TODOs pendientes: ninguno
-->

# Constitution de Autex.com.mx + SMC 4.0

Autex.com.mx es la tienda en línea de autopartes de APYMSA. Este proyecto replica su experiencia de
compra de escritorio y la usa como demo de SMC 4.0, el motor que elige desde qué sucursales se surte
cada pedido.

## Core Principles

### I. Simplicidad ante todo

- Ante dos soluciones válidas, se elige SIEMPRE la más simple.
- Es una versión 1: NO se añade complejidad "por si acaso" (capas, configuraciones,
  abstracciones o dependencias que hoy no hacen falta).
- Cualquier complejidad extra DEBE justificarse por escrito en el plan.

**Por qué**: lo simple se termina antes, se entiende mejor y falla menos.

### II. Español de México y pesos mexicanos

- Todo lo que ve el usuario (pantallas, mensajes y errores) DEBE estar en español de México.
- La única moneda es el peso mexicano (MXN), con formato mexicano: `$1,234.56 MXN`.
- Las fechas siguen el formato mexicano: `dd/mm/aaaa`.

**Por qué**: Autex vende al mercado mexicano.

### III. Cero alcance fantasma

- NO se implementa ninguna funcionalidad que no esté escrita en la spec.
- Si surge una idea nueva, se PROPONE (se anota y se comenta), pero NO se construye
  hasta que se añada a la spec.

**Por qué**: evita trabajo no pedido, retrasos y sorpresas.

### IV. Verificable por una persona no técnica

- Cada criterio de éxito DEBE poder comprobarse usando la app, sin leer código.
- Los criterios se redactan como acciones y resultados visibles
  (p. ej., "al capturar el C.P. 44100 y llegar al paso de envío se ve 1 envío desde la sucursal
  más cercana").

**Por qué**: quien decide si algo está terminado no necesita saber programar.

### V. Respeto por los datos del usuario

- Se pide SOLO la información imprescindible para completar la compra.
- La demo usa datos simulados: NUNCA datos reales de clientes.
- NUNCA se escriben claves, contraseñas ni otros secretos en el código; se guardan
  fuera de él (por ejemplo, en variables de entorno).

**Por qué**: menos datos significa menos riesgo para el usuario y para el proyecto.

### VI. Figma es la fuente de verdad visual

- Toda pantalla y componente que exista en Figma se replica tal cual, siguiendo `FIGMA_REPLICA.md`.
- No se rediseña ni se "mejora" el diseño. Las diferencias inevitables (p. ej. una fuente
  sustituta) se registran en `docs/figma/discrepancias.md`.
- Lo que no exista en Figma se arma solo con componentes ya replicados y se marca como
  "sin respaldo en Figma".

**Por qué**: el resultado debe verse igual que la tienda que el equipo de diseño definió.

## Restricciones del producto

- Producto: réplica web de escritorio de Autex.com.mx (dirección/C.P., agregar mercancía y
  checkout) con la lógica de SMC 4.0 simulada.
- Público: personas de negocio y clientes de prueba (registrados y no registrados).
- Idioma y moneda: ver Principio II.

## Flujo de trabajo

- Orden de trabajo: spec → plan → tareas → implementación.
- La UI se construye por fases de `FIGMA_REPLICA.md` (inventario → tokens → assets →
  componentes → pantallas → flujos → verificación).
- Antes de dar algo por terminado, se comprueban sus criterios de éxito usando la app
  (Principio IV).
- Las ideas nuevas se anotan como propuestas, nunca como código (Principio III).

## Governance

- Esta constitution prevalece sobre cualquier otra práctica del proyecto.
- Toda spec, plan y revisión DEBE comprobar que cumple estos principios.
- Para cambiarla: se propone el cambio por escrito, se aprueba y se actualiza la versión.
- Versionado: MAYOR si se elimina o redefine un principio; MENOR si se añade un principio
  o sección; PARCHE si solo se aclara la redacción.

**Version**: 2.0.0 | **Ratified**: 2026-10-02 | **Last Amended**: 2026-10-02
