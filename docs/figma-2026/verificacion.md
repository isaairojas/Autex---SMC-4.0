# Verificación visual — Autex_2026_Frames (FIGMA_REPLICA.md §9)

Render a 1920 px con Playwright contra la captura de Figma (`pixelmatch`, umbral 0.1), 19 frames.
Comando: `npx vite --port 5179` y luego `node tests/visual/compare-all.mjs` (usa `docs/figma-2026/cache`; `CACHE=docs/figma/cache` para el archivo anterior).

**Lectura**: el criterio del MD es ≤ 1 %. Las pantallas completas quedan entre 1.8 % y 3 % por la fuente sustituta (Archivo en lugar de HeadingNow, D1).
Los componentes sueltos (mini-carrito y modal de login) quedan entre 7.8 % y 13.4 %: el texto ocupa casi toda el área y HeadingNow es más ancha que Archivo (D26). Se revisaron los mapas de diferencias: no hay desplazamientos de layout.

| Flujo | nodeId | Frame | Ruta | Diferencia |
|---|---|---|---|---|
| EF-46271 · Carrito y pasarela (cliente registrado) | 657:14082 | Autex_Catalogo_Stock_Cliente Registrado - 1 | /figma/657-14082 | 2.94 % |
| EF-46271 · Carrito y pasarela (cliente registrado) | 657:14102 | Carrito/Default (mini-carrito) | /figma/657-14102 | 13.39 % |
| EF-46271 · Carrito y pasarela (cliente registrado) | 673:18974 | Autex_Carrito- 1 | /figma/673-18974 | 2.88 % |
| EF-46271 · Carrito y pasarela (cliente registrado) | 742:19087 | Modal login (vacío) | /figma/742-19087 | 7.83 % |
| EF-46271 · Carrito y pasarela (cliente registrado) | 742:19208 | Modal login (con datos) | /figma/742-19208 | 12.35 % |
| EF-46271 · Carrito y pasarela (cliente registrado) | 677:18887 | Autex - Checkout - 1 | /figma/677-18887 | 1.79 % |
| EF-46271 · Carrito y pasarela (cliente registrado) | 719:22355 | Autex - Checkout - 2 | /figma/719-22355 | 2.27 % |
| EF-46271 · Carrito y pasarela (cliente registrado) | 723:23455 | Autex - Checkout - 3 | /figma/723-23455 | 2.04 % |
| EF-46271 · Carrito y pasarela (cliente registrado) | 738:17646 | Autex - Checkout - 4 | /figma/738-17646 | 2.20 % |
| EF-46271 · Carrito y pasarela (cliente registrado) | 904:34705 | Content (gracias) | /figma/904-34705 | 2.18 % |
| EF-42837 · Ejemplo de envío sin costo | 893:10681 | Checkout - 1 (sin costo) | /figma/893-10681 | 2.13 % |
| EF-42837 · Ejemplo de envío sin costo | 893:10938 | Checkout - 2 (sin costo) | /figma/893-10938 | 2.37 % |
| EF-42837 · Ejemplo de envío sin costo | 893:11011 | Checkout - 3 (sin costo) | /figma/893-11011 | 2.03 % |
| EF-42837 · Ejemplo de envío sin costo | 893:11077 | Checkout - 4 (sin costo) | /figma/893-11077 | 2.45 % |
| EF-42837 · Ejemplo de envío con costo | 901:33560 | Checkout - 1 (con costo) | /figma/901-33560 | 2.41 % |
| EF-42837 · Ejemplo de envío con costo | 901:32141 | Checkout - 2 (con costo) | /figma/901-32141 | 2.13 % |
| EF-42837 · Ejemplo de envío con costo | 901:32200 | Checkout - 3 (con costo) | /figma/901-32200 | 2.01 % |
| EF-42837 · Ejemplo de envío con costo | 901:32266 | Checkout - 4 (con costo) | /figma/901-32266 | 2.44 % |
| EF-42837 · Ejemplo de envío con costo | 902:34618 | Content (gracias, con costo) | /figma/902-34618 | 2.18 % |

Prueba de punta a punta: `node tests/e2e-flujo.mjs` — invitado (login → continuar como invitado → tarjeta → OpenPay → gracias) y registrado (inicio de sesión → producto bajo pedido → dirección → tarjeta guardada → gracias). Resultado: sin errores.
