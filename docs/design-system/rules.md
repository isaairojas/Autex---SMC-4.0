# Reglas del sistema de diseño (para personas y agentes)

> El servidor MCP de Figma no ofrece `create_design_system_rules`; estas reglas se escribieron a mano (F7).

1. Antes de tocar UI, leer `FIGMA_REPLICA.md` y `docs/figma/figma-map.json`.
2. Toda pantalla nueva se compone con `src/design-system/components`. Prohibido introducir librerías de UI o íconos externos.
3. Colores, tipografías y sombras solo desde `src/design-system/tokens/tokens.css`. Si Figma usa un valor sin variable,
   se escribe literal con `/* figma: <nodeId> */` y se anota en `docs/figma/valores-sin-token.md`.
4. Íconos: componente `Icon` con el nombre del glifo de Material Icons tal como aparece en Figma.
5. Imágenes y SVG: solo los descargados de Figma en `src/assets/`. No redibujar ni sustituir.
6. Trazos "inside" de Figma → `box-shadow: inset`. Bordes de lado (p. ej. inferior) → `border-*`.
7. Textos literales de Figma, incluidas sus erratas (registradas en `docs/figma/discrepancias.md`).
8. Si una pantalla no existe en Figma: componer con componentes existentes, marcarla "sin respaldo en Figma"
   en el comentario de cabecera y en `figma-map.json`, y proponer el diseño al equipo.
9. Cada archivo de componente o pantalla inicia con su nodo de Figma y la fecha de sincronización.
10. Después de cambiar UI: `node tests/visual/compare-all.mjs` y revisar los diffs; `node tests/e2e-flujo.mjs` para el flujo.
