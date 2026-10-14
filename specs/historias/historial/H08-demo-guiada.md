# H08 · Demo guiada: escenarios y globos explicativos (solo la demo)

- **Fecha**: 2026-10-12 · **Estado**: borrador · **Constitution**: 3.0.0
- **Índice**: `specs/historias-de-usuario.md` · **Spec v2**: RF18, HU5, CA16 · Se registra como decisión D en
  `docs/figma/discrepancias.md` (no es un cambio del sitio)
- **Usa**: todas las historias (fase 1)

## 1. Objetivo y contexto de negocio

En la demo (fase 1), la persona de negocio recorre los escenarios de SMC 4.0 con un flujo de compra simulado y ve,
en globos explicativos, qué regla aplicó el cálculo en cada paso. No se programa en el sitio real.

## 2. Usuarios

Persona de negocio que valida las reglas de surtido.

## 3. Escenarios de usuario (historias)

- **HU1 (P1)** — Como persona de negocio, quiero cargar un escenario y ver el resultado, para validar la regla.
- **HU2 (P1)** — Como persona de negocio, quiero que cada pantalla explique la decisión de SMC 4.0.

## 4. Requisitos funcionales

- **RF1.** Una lista de escenarios (E1 Sucursal predefinida, E2 Sucursal base, E3 Exclusivos de recoger, E4 IVA
  fronterizo, E5 Sin existencias, E6 Caja gris, E7 No registrado y "SMC 4.0 sin respuesta") que carga ubicación,
  cliente y carrito.
- **RF2.** Cada pantalla del flujo tiene al menos un globo; el del paso de envío nombra la regla que decidió.
- **RF3.** Los globos se pueden ocultar.
- **RF4.** Un control de la demo cambia el parámetro de foráneas (0 o 1) para mostrar los dos casos de H02.

## 5. Reglas de negocio (con ejemplos)

- **RN1. Los globos leen la explicación de SMC 4.0.** *Ejemplo*: "Autex Tesistan está a 0.0 km de tu C.P. 45138 y
  tiene las 2 piezas, así que tu pedido sale de ahí hoy."

## 6. Criterios de aceptación (verificables sin código)

- **CA1.** Cada escenario de RF1 se carga desde la lista y muestra su resultado esperado (contrato, ejemplos).
- **CA2.** Cada pantalla del flujo tiene un globo.

## 7. Casos límite

- **CL1.** ¿Se recarga la página? Se pierde el escenario cargado.

## 8. Fuera de alcance

- Globos, escenarios o controles de parámetros en el sitio real.
