# Herramientas MCP de Figma disponibles

- Servidor: claude.ai Figma (remoto). Validado el 2026-10-02.
- Cuenta: `Brethan` — plan "UX/UI Exodus" (pro, invitado) y "brethan.beltran's team" (starter, admin).
  Puede haber límite de llamadas: trabajar por lotes.

| Herramienta | Parámetros clave | Uso |
|---|---|---|
| `whoami` | — | Cuenta y planes |
| `get_metadata` | `fileKey`, `nodeId?` | Sin `nodeId` lista páginas; con `nodeId` da XML (la página 32:309 pesa ~800 KB: navegar por frame) |
| `get_design_context` | `fileKey`, `nodeId`, `clientFrameworks`, `clientLanguages` | Código de referencia + screenshot por frame/sección |
| `get_screenshot` | `fileKey`, `nodeId`, `maxDimension?` | Devuelve URL temporal del PNG → guardar en `docs/figma/cache/` |
| `get_variable_defs` | `fileKey`, `nodeId` | Variables de color y tipografía |
| `get_libraries` | `fileKey` | Librerías vinculadas |
| `search_design_system` | — | Buscar en librerías |
| `download_assets` | — | Exportar íconos/imágenes |
| `get_code_connect_map` / `add_code_connect_map` | — | Vínculo Figma ↔ código |

Nota: `create_design_system_rules` no aparece en este servidor; F7 generará `rules.md` manualmente.
