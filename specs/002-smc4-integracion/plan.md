# Implementation Plan: Autex.com.mx + SMC 4.0 v2

**Branch**: `002-smc4-integracion` (carpeta activa en `.specify/feature.json`; se trabaja sobre `main`) | **Date**: 2026-10-09 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-smc4-integracion/spec.md`

## Summary

SMC 4.0 decide desde qué sucursales se surte cada pedido: envíos, recoger en tienda, fechas, sin existencia y caja
gris. En la fase 1 la demo concentra ese cálculo en un solo módulo simulado (`src/mocks/smc.ts`) que aplica el orden
de decisión RN6 y cuya entrada y salida son el contrato de la fase 2 (`contracts/smc-propuesta.md`). Sobre él se
agrega lo que la demo aún no tiene: escenarios E1–E7, globos explicativos, IVA fronterizo, caja gris, exclusivos de
recoger con promociones, sucursal predefinida, sucursal base con complementos y la falla de SMC (RF20). Luego se
terminan las entregas 2 a 4 de la vista de celular. La fase 2 recibe el catálogo con IDs, esta spec y el contrato
para programar los cambios en el sitio real.

## Technical Context

**Language/Version**: TypeScript 5.9, React 18.3 (fase 1). Fase 2: lo que usa el sitio; observado en su HTML,
Next.js con Ant Design y Material UI (se confirma con su equipo, TODO(REPO_SITIO) de la constitution).

**Primary Dependencies**: react, react-dom, react-router-dom 6, Vite 6. Sin librerías de UI (reglas del sistema de
diseño).

**Storage**: estado en memoria (`src/state/DemoContext.tsx`) y configuración en JSON (`src/mocks/configuracion-*.json`).
Fase 2: los datos reales del sitio y de SMC 4.0.

**Testing**: Playwright con scripts de Node (`tests/e2e-flujo.mjs`, `tests/referencia/*.mjs`), comparación visual
con pixelmatch (`tests/visual/compare-all.mjs`) y `npm run build` (TypeScript estricto).

**Target Platform**: navegadores de escritorio (la página de 1920 px se ajusta al zoom) y de celular (768 px o menos,
vista móvil, D58).

**Project Type**: aplicación web de un solo proyecto (frontend con cálculo simulado).

**Performance Goals**: la propuesta de envío aparece en menos de 2 segundos tras llegar al paso de envío (RF20).

**Constraints**: solo componentes de `src/design-system` y tokens de `tokens.css`; lo que no está en Figma se arma con
componentes existentes y se marca "sin respaldo en Figma"; en celular, la referencia es el sitio (D58); español de
México y MXN; datos simulados.

**Scale/Scope**: 15 rutas, 52 cambios del catálogo, 7 escenarios más la falla de SMC, 51 tiendas simuladas (46 del
sitio y 5 solo de la configuración de SMC) y 31 productos.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Cómo lo cumple el plan | Estado |
|---|---|---|
| I. Simplicidad | Un solo módulo de cálculo en lugar de reglas repartidas; sin servidores ni librerías nuevas | ✅ |
| II. Español de México y MXN | Textos de globos, escenarios y avisos en español; IVA y precios en MXN | ✅ |
| III. Cero alcance fantasma | Cada tarea sale de un RF, RN o CA de la spec; B2B y alternativas quedan fuera | ✅ |
| IV. Verificable sin código | `quickstart.md`: cada criterio con pasos en la app; prueba por escenario | ✅ |
| V. Datos del usuario | Datos simulados; capturas con datos reales fuera del repositorio; sin secretos | ✅ |
| VI. Fuentes de verdad | Escritorio según Figma; globos, escenarios y caja gris sin respaldo, con componentes existentes; celular según el sitio | ✅ |
| VII. SMC 4.0 decide | Las pantallas solo muestran `calcularPropuesta`; los globos leen sus explicaciones | ✅ |
| VIII. Trazabilidad | Contrato, modelo y tareas citan IDs del catálogo y reglas de la spec | ✅ |

Revisión después del diseño (fase 1): sin cambios; ninguna violación que justificar.

## Project Structure

### Documentation (this feature)

```text
specs/002-smc4-integracion/
├── spec.md              # Especificación v2 (plantilla del proyecto, con Clarifications)
├── plan.md              # Este archivo
├── research.md          # Decisiones R1–R10
├── data-model.md        # Entidades y reglas
├── quickstart.md        # Validación en la app
├── contracts/
│   └── smc-propuesta.md # Tienda ↔ SMC 4.0: existencias y propuesta de surtido
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── mocks/
│   ├── smc.ts                         # NUEVO: calcularPropuesta (RN1–RN16), explicaciones para globos
│   ├── escenarios.ts                  # NUEVO: E1–E7 y "SMC 4.0 sin respuesta"
│   ├── fronteras.ts                   # NUEVO: C.P. de la región fronteriza (IVA 8 %)
│   ├── existencias.ts, envios.ts      # Se reutilizan desde smc.ts (red de entrega, reparto por tienda)
│   ├── fechasEntrega.ts               # Fechas en días hábiles (RN3)
│   ├── productos.ts, catalogo.ts      # + exclusivoRecoger, promocionId
│   ├── clientes.ts                    # + sucursalBaseId
│   └── configuracion-existencias.json # + porcentajeSucursalBase, sucursalesPredefinidas
├── state/
│   └── DemoContext.tsx                # Consume la propuesta; carga escenarios
├── design-system/components/
│   ├── molecules/Globo.tsx            # NUEVO: globo explicativo
│   └── organisms/*Movil.tsx           # Vista de celular (entregas 2–4)
└── screens/
    ├── sitio/Escenarios.tsx           # NUEVO: lista de escenarios (/escenarios)
    ├── tienda/                        # Catálogo, detalle y carrito (globos, IVA, exclusivos)
    └── checkout/                      # Envío y confirmación (caja gris, etiquetas, falla de SMC)

tests/
├── e2e-flujo.mjs
├── referencia/escenarios-demo.mjs     # NUEVO: E1–E7 y la falla de SMC
├── referencia/*.mjs                   # Pruebas existentes por decisión
└── visual/compare-all.mjs

docs/
├── negocio/cambios-demo-vs-autex.html # Catálogo (fuente) → cambios-demo-vs-autex.md (generado)
├── autex-real/movil/PLAN.md           # Plan de la vista de celular
└── figma/discrepancias.md             # Nuevas decisiones D (escenarios, globos, IVA, caja gris)
```

**Structure Decision**: proyecto web único (el actual). El cálculo de SMC 4.0 simulado vive en `src/mocks/smc.ts`
porque `src/mocks` ya concentra los datos y reglas simuladas; las pantallas no cambian de lugar.

## Complexity Tracking

Sin violaciones a la constitution que justificar.
