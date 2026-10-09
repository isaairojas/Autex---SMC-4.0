# Valores sin variable en Figma

Figma solo expone variables de **color**, **tipografía** y **una sombra**. Espaciados, radios, bordes,
opacidades, z-index y animaciones no tienen variable: se tomarán como valores literales medidos en
cada nodo (F3/F4), con el comentario `/* figma: <nodeId> */`, y se listarán aquí.

| Valor | Uso | nodeId | Fase |
|---|---|---|---|
| Opacidad de `Alpha/Back Alpha 300` | Fondo de modales | por medir | F4 |
| Letter-spacing 0.2 / 0.1 | Body 1 / Body 2 | — | F1 — se interpreta en **px** (el MCP no indica unidad); confirmar en verificación visual |

## Autex_2026_Frames (2026-10-05)

| Token | Valor | nodeId |
|---|---|---|
| `--color-naranja-bajo-pedido` | #EE6300 | 742:20355 |
| `--color-naranja-bajo-pedido-fondo` | rgba(238,148,0,0.1) | 673:20391 |
| `--color-fondo-2026` | #F2F2F2 | 673:20283 |
| `--color-texto-sku` | #6E7176 | I673:18933;668:18861 |
| `--color-texto-cantidad` | #1A202C | I673:18933;668:18873 |
| `--color-rojo-no-disponible` | #E4092C | Motion "No dsponible" (catálogo) |
| `--color-facebook` | #1877F2 | I742:19087;742:18828 |
| `--shadow-modal-login` | 0 13px 16px #ADADB1 | 742:19087 |
| `--shadow-input-foco` | 0 2px 6px #EAF1FF | I742:19087;742:18815;27:710 |
| `.text-os-titulo-28/32`, `.text-inter-body-1`, `.text-precio-32`, `.text-precio-32-medium`, `.text-total-30` | Open Sans 600, Inter 400, HeadingNow 32/30 | 742:20363, 668:18475, 145:3515, 898:15863 |

| `--color-navegador-fondo`, `--color-navegador-texto`, `--color-navegador-boton`, `--color-navegador-texto-boton` | #2B2B2B, #E3E3E3, #0B4F7D, #D3E3FD | Sin nodo: aviso de ubicación de Chrome simulado (ejemplo del usuario, D31) |
| `--font-family-navegador` | Segoe UI, system-ui | Sin nodo: aviso de ubicación de Chrome simulado (D31) |
| `--color-amarillo-aviso-fondo`, `--color-amarillo-aviso-borde`, `--color-amarillo-aviso-icono` | #FFF8E1, #F2C230, #B88600 | Sin nodo: leyenda amarilla de disponibilidad al cambiar la dirección de entrega (D50) |
