# AUTEX — Demo Autex.com.mx + SMC 4.0

- Constitution: `.specify/memory/constitution.md` (Spec Kit). Spec activa: `specs/001-smc4-demo-sucursales/spec.md`.
- Antes de cualquier tarea de UI, lee y sigue @FIGMA_REPLICA.md.

## Sistema de diseño (réplica de Figma)
- Fuente de verdad visual: Figma https://www.figma.com/design/UKrGgTeW6ld3CpGOFErLXX/Autex_2026_Frames (página 111:8). Mapa de identidad: docs/figma-2026/figma-map.json.
- El archivo anterior (qp14Mbl7khZF2xWAwaocfP, docs/figma/) quedó reemplazado el 2026-10-05; se conserva como historial.
- Toda UI nueva usa exclusivamente componentes de src/design-system y tokens de tokens.css.
- Prohibido introducir valores visuales literales, librerías de UI o íconos externos.
- Para nuevas pantallas/flujos: si existen en Figma, seguir FIGMA_REPLICA.md (F4–F6);
  si NO existen en Figma, componer con componentes existentes y marcar la pantalla como
  "sin respaldo en Figma" en docs/figma-2026/figma-map.json.
- Si el diseño cambia en Figma: resincronizar solo los nodos modificados y registrar en docs/figma/CHANGELOG.md.
- Reglas detalladas: docs/design-system/rules.md · Discrepancias: docs/figma/discrepancias.md.

## Comandos
- `npm run dev` · `npm run build`
- Verificación visual: `node tests/visual/compare-all.mjs` (servidor en el puerto 5179: `npx vite --port 5179`; capturas en docs/figma-2026/cache).
- Flujo completo: `node tests/e2e-flujo.mjs`.
