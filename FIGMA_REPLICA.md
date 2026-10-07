# FIGMA_REPLICA.md — Réplica fiel de prototipos Figma con Claude Code + MCP de Figma

> **Propósito:** este documento es la instrucción maestra para que Claude Code recree en código, **de forma idéntica**, el archivo de Figma indicado (todas las páginas, frames, componentes, variantes, tokens, assets y flujos), y deje registrada la **identidad visual y estructural** del producto para que en el futuro se agreguen funcionalidades, flujos y escenarios sin romper la consistencia.
>
> **Cómo usarlo:** colocar este archivo en la raíz del repositorio y referenciarlo desde `CLAUDE.md` con la línea:
> `Antes de cualquier tarea de UI, lee y sigue @FIGMA_REPLICA.md.`

---

## 0. Reglas de oro (no negociables)

1. **Figma es la fuente de verdad.** No se interpreta, no se "mejora", no se rediseña. Si algo en Figma parece un error (desalineación de 1 px, color distinto al token), se replica tal cual y se registra en `docs/figma/discrepancias.md`.
2. **Nada se inventa.** Si un dato no se puede obtener del MCP (una interacción, un estado, un texto, un asset), se detiene esa pieza, se registra como `PENDIENTE` y se pregunta al usuario. Nunca rellenar con valores "razonables".
3. **Todo valor visual sale de un token o de un valor medido en Figma.** Prohibido escribir colores, tamaños, radios o sombras "a ojo".
4. **Un componente de Figma = un componente de código.** Las instancias de Figma se renderizan usando el componente de código, nunca copiando su HTML.
5. **Cada pieza de código conserva su vínculo con Figma** (`nodeId`) en el mapa de identidad (`docs/figma/figma-map.json`).
6. **Trabajo incremental y verificable.** Nada se da por terminado sin comparación visual contra el screenshot de Figma (sección 9).
7. **No leer el archivo completo de un solo golpe.** Siempre se navega por página → frame → nodo para no saturar el contexto ni los límites del MCP.

---

## 1. Parámetros del proyecto (llenar antes de iniciar)

| Parámetro | Valor |
|---|---|
| URL del archivo Figma | `https://www.figma.com/design/qp14Mbl7khZF2xWAwaocfP/FE_Autex_B2C_Editable?node-id=32-309` |
| `FILE_KEY` | `qp14Mbl7khZF2xWAwaocfP` |
| Plataforma objetivo inicial | `Escritorio` (los frames de la página son de escritorio; móvil fuera de alcance) |
| Tamaño(s) de frame base | `1920×2414 escritorio` (contenido centrado de 1178 px; tomado de Figma) |
| Stack | `React 18 + TypeScript + Vite + CSS variables` (web de escritorio, sin PWA) |
| Librería de componentes externa | `Ninguna` (todo se construye desde Figma) |
| Páginas de Figma a replicar | `Pasarela de compra` (32:309) completa + inicio y detalle de escritorio de `Locofy (Prueba)` (12848:22335) + componentes de `Local components` (1086:26165) que usen |
| Páginas a ignorar | Pantallas móviles de `Locofy (Prueba)`; componentes de `Local components` que no aparecen en esas pantallas |
| Tema(s) / modes | `Ninguno` (solo Light) — por confirmar con variables |
| Idioma de la UI | Español (MX) |

> Si el stack cambia (p. ej. Flutter, React Native, Angular), **solo** cambian la sección 6 (mapeo) y la sección 7 (estructura). Todo lo demás se mantiene.

---

## 2. Configuración del MCP de Figma

### 2.1 Opción A — Servidor remoto (recomendado)
```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```
Después, dentro de Claude Code ejecutar `/mcp`, seleccionar `figma` y autenticar.

### 2.2 Opción B — Servidor local de Figma Desktop
Requiere Figma Desktop con Dev Mode y el servidor MCP habilitado (Preferencias → Enable Dev Mode MCP Server).
```bash
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```
Con esta opción, las herramientas trabajan sobre **la selección actual** en Figma Desktop cuando no se pasa `nodeId`.

### 2.3 Validación inicial
1. Ejecutar `/mcp` y confirmar que el servidor está conectado.
2. Listar las herramientas disponibles y **registrar sus nombres y parámetros reales** en `docs/figma/mcp-tools.md` (los nombres pueden variar entre versiones del servidor; la tabla de la sección 3 es la referencia esperada).
3. Llamar `whoami` (si existe) para confirmar cuenta y plan. Si el plan/asiento tiene límite de llamadas, registrarlo y planear el trabajo por lotes.

### 2.4 Formato de `nodeId`
- En la URL de Figma aparece como `node-id=123-456`.
- En las herramientas MCP se usa como `123:456`.
- Siempre registrar ambos formatos en el mapa de identidad.

---

## 3. Herramientas MCP y cuándo usarlas

| Herramienta | Uso en este proceso |
|---|---|
| `get_metadata` | Estructura ligera (XML) de una página/frame: IDs, nombres, tipos, posición y tamaño. **Primera llamada siempre**, para inventario y para dividir nodos grandes. |
| `get_design_context` | Contexto de diseño + código de referencia de un nodo. Se usa **por frame o por componente**, nunca por página completa. Pasar framework/lenguaje del stack. |
| `get_screenshot` | Imagen de referencia del nodo. Obligatoria para cada componente, variante y pantalla (verificación visual). |
| `get_variable_defs` | Variables y estilos (color, tipografía, espaciado, radios, efectos) usados por un nodo. Base de los tokens. |
| `search_design_system` | Buscar componentes, variables y estilos del sistema de diseño. |
| `get_libraries` | Librerías vinculadas al archivo (detectar componentes que vienen de otra librería). |
| `download_assets` | Exportar íconos, ilustraciones e imágenes. |
| `get_code_connect_map` / `add_code_connect_map` | Leer/crear el vínculo nodo de Figma ↔ componente de código. |
| `create_design_system_rules` | Generar reglas de sistema de diseño para el repo (usar al final de la fase de componentes y guardar el resultado). |

**Reglas de uso:**
- Si `get_design_context` responde truncado o demasiado grande: volver a `get_metadata` del nodo, identificar hijos y pedir contexto por cada hijo.
- El código que devuelve `get_design_context` es **referencia**, no código final. Se adapta a los tokens y componentes del repo.
- Cachear respuestas en `docs/figma/cache/<nodeId>.json|png` para no repetir llamadas.

---

## 4. Fases de trabajo

El trabajo se ejecuta **en este orden estricto**. No se inicia una fase sin cerrar la anterior (checklist completo).

```
F0 Inventario → F1 Tokens → F2 Assets → F3 Componentes → F4 Pantallas → F5 Flujos → F6 Verificación → F7 Registro de identidad
```

### F0 — Inventario del archivo
**Objetivo:** saber exactamente qué hay antes de escribir código.

1. `get_metadata` de cada página del archivo.
2. Generar `docs/figma/inventory.md` con:
   - Páginas (nombre, `nodeId`, incluir/ignorar).
   - Por página: frames de nivel superior (nombre, `nodeId`, tamaño, tipo: pantalla / componente / documentación / borrador).
   - Componentes y *component sets* (con lista de propiedades de variante y sus valores).
   - Componentes usados como instancia que **no** están definidos en el archivo (vienen de librería externa) → `get_libraries`.
   - Estilos y variables detectados (conteo por tipo).
3. Clasificar cada pantalla por flujo (p. ej. *Login*, *Surtido*, *Revisión de pedido*) y por plataforma (móvil/escritorio).
4. Estimar número de llamadas y proponer lotes si hay límite de plan.

**Salida:** `inventory.md` aprobado por el usuario antes de pasar a F1.

### F1 — Tokens de diseño
1. `get_variable_defs` sobre frames representativos y sobre los componentes base.
2. Construir `src/design-system/tokens/tokens.json` con esta estructura:
   ```json
   {
     "color":      { "primitive": {}, "semantic": {} },
     "typography": { "family": {}, "size": {}, "weight": {}, "lineHeight": {}, "letterSpacing": {} },
     "spacing":    {},
     "radius":     {},
     "shadow":     {},
     "border":     {},
     "opacity":    {},
     "breakpoint": {},
     "zIndex":     {},
     "motion":     { "duration": {}, "easing": {} }
   }
   ```
3. Respetar la **jerarquía de Figma**: variables primitivas → variables semánticas (alias). No aplanar alias.
4. Generar `tokens.css` con variables CSS (`--color-primary-500`, etc.). Si hay *modes* (Light/Dark, Marca, Densidad), cada mode es un selector (`[data-theme="dark"]`).
5. Nombres de token = nombres de Figma normalizados a `kebab-case`, conservando el nombre original en un comentario o en `tokens.json` (`"figmaName"`).
6. Valores sin variable en Figma (valores "sueltos") se registran en `docs/figma/valores-sin-token.md` y se usan como valor literal con comentario `/* figma: <nodeId> */`.
7. Tipografías: verificar disponibilidad de cada familia/peso. Si una fuente no está disponible, **detener y preguntar**; no sustituir.

### F2 — Assets
1. Identificar íconos, logos, ilustraciones e imágenes en el inventario.
2. `download_assets` por nodo. Formatos:
   - Íconos y logos → **SVG** (conservar `viewBox`; color vía `currentColor` solo si el ícono en Figma es monocromo y se recolorea por instancia).
   - Fotografías → PNG/WebP en @1x, @2x, @3x.
3. Estructura: `src/assets/icons/`, `src/assets/illustrations/`, `src/assets/images/`.
4. Nombre del archivo = nombre de la capa en Figma en `kebab-case`. Registrar `nodeId` en `docs/figma/assets.md`.
5. No redibujar íconos a mano ni sustituirlos por una librería de íconos, aunque se parezcan.

### F3 — Componentes
**Orden:** átomos → moléculas → organismos (de menor a mayor dependencia).

Por **cada** componente / *component set*:
1. `get_metadata` → estructura y variantes.
2. `get_design_context` del *component set* (o de cada variante si es grande).
3. `get_variable_defs` → confirmar tokens usados.
4. `get_screenshot` de **cada variante** → guardar en `docs/figma/cache/`.
5. Mapear propiedades de Figma a props de código:

   | Figma | Código |
   |---|---|
   | Variant property (`Size=Sm/Md/Lg`) | `size: 'sm' \| 'md' \| 'lg'` |
   | Variant de estado (`State=Default/Hover/Pressed/Disabled/Focus`) | pseudo-clases CSS + prop `disabled`; nunca prop `state` si es interactivo |
   | Boolean property (`Show icon`) | `showIcon?: boolean` |
   | Text property (`Label`) | `label: string` o `children` |
   | Instance swap (`Icon`) | `icon?: ReactNode` |
   | Nested instances expuestas | props del hijo con prefijo |

6. Implementar el componente con los tokens de F1 y los assets de F2.
7. Crear su historia/vitrina (Storybook o página `/_catalogo`) mostrando **todas** las variantes en la misma grilla que Figma.
8. Registrar en `figma-map.json` y, si está disponible, `add_code_connect_map`.
9. Documentar en `docs/components/<Componente>.md` con la plantilla de la sección 11.2.

### F4 — Pantallas
Por **cada** frame de pantalla, en el orden de los flujos:
1. `get_metadata` del frame → árbol de capas.
2. `get_design_context` del frame (dividir por secciones si es grande: header, contenido, footer, bottom sheet, etc.).
3. `get_screenshot` del frame.
4. Construir la pantalla **usando exclusivamente** componentes de F3. Si aparece un elemento repetible que no es componente en Figma, se construye localmente y se registra en `discrepancias.md` como candidato a componente (no se promueve sin aprobación).
5. Respetar exactamente: orden de capas, textos (incluyendo mayúsculas, puntuación y saltos de línea), tamaños, espaciados, alineación, truncado de texto, scroll (qué parte hace scroll y qué es fijo).
6. Móvil: respetar *safe areas*, barras de estado/navegación del frame (si son parte del diseño decorativo del sistema operativo, **no** se renderizan como UI propia; registrar la decisión).
7. Ruta sugerida: `/<flujo>/<pantalla>` en `kebab-case`.
8. Datos: usar *mocks* con exactamente los textos/valores del diseño en `src/mocks/<flujo>.ts`.

### F5 — Flujos e interacciones (prototipo)
1. Intentar obtener las conexiones del prototipo (on click → navigate to, open overlay, swap, back, scroll to) desde lo que exponga el MCP.
2. **Si el MCP no expone las conexiones de prototipo** (es probable que no las exponga completas), **no deducirlas**: generar `docs/figma/flujos.md` con la tabla vacía de la sección 11.3 y pedir al usuario que la complete o confirme.
3. Implementar navegación, overlays (modales, bottom sheets, toasts), y transiciones con los tiempos/curvas de Figma (Smart animate → transición equivalente; registrar duración y easing como tokens `motion`).
4. Estados de pantalla que existan como frames separados (vacío, cargando, error, éxito) se modelan como estados de la misma pantalla, no como rutas distintas.

### F6 — Verificación visual
Ver sección 9. Obligatoria por componente y por pantalla.

### F7 — Registro de identidad del producto
Al cerrar, generar/actualizar:
- `docs/figma/figma-map.json` — mapa completo nodo ↔ código.
- `docs/design-system/README.md` — tokens, componentes, reglas de uso.
- Salida de `create_design_system_rules` guardada en `docs/design-system/rules.md`.
- `docs/figma/CHANGELOG.md` — fecha, versión del archivo de Figma (si se conoce), qué se sincronizó.
- Actualizar `CLAUDE.md` con la sección de la sección 12.

---

## 5. Reglas de fidelidad visual

| Aspecto | Regla |
|---|---|
| Medidas | Valores exactos de Figma en `px` (o `rem` con base 16 si el stack lo exige, conversión exacta). |
| Colores | Solo tokens. Respetar opacidades de relleno y de capa por separado. |
| Tipografía | Familia, peso, tamaño, line-height (px o %), letter-spacing (convertir % a `em`), text-transform, text-decoration, alineación. |
| Rellenos múltiples | Replicar todas las capas de fill en orden (gradientes incluidos, con ángulos y stops exactos). |
| Bordes | Grosor, posición (inside → `box-shadow inset` o `outline`; center/outside según corresponda), estilo, radios por esquina. |
| Efectos | Drop shadow / inner shadow (x, y, blur, spread, color), layer blur, background blur (`backdrop-filter`). |
| Blend modes | Replicar con `mix-blend-mode`. |
| Iconos | Tamaño del contenedor y del vector tal como en Figma. |
| Texto | Copia literal. Nunca corregir ortografía sin registrarlo como discrepancia. |
| Clip content | `overflow: hidden` si el frame tiene *clip content*. |

---

## 6. Mapeo Figma → código (stack web: React + CSS)

| Figma | CSS / código |
|---|---|
| Auto layout horizontal / vertical | `display:flex; flex-direction: row / column` |
| Gap (spacing between) | `gap` |
| Spacing *Auto* (space between) | `justify-content: space-between` |
| Padding | `padding` (4 valores exactos) |
| Alineación de auto layout | `justify-content` + `align-items` |
| Wrap | `flex-wrap: wrap` + `row-gap` / `column-gap` |
| Hug contents | ancho/alto automático (`width: fit-content` o sin definir) |
| Fill container | `flex: 1 1 0` en el eje principal / `align-self: stretch` en el transversal |
| Fixed | `width` / `height` exactos |
| Min/Max width/height | `min-width`, `max-width`, etc. |
| Absolute position (dentro de auto layout) | `position:absolute` con padre `position:relative` |
| Constraints (Left/Right/Center/Scale/Left & Right) | `left/right/transform` o anchos relativos según constraint |
| Grid (layout guide) | CSS grid con columnas, gutter y márgenes exactos |
| Frame sin auto layout | `position:relative` + hijos absolutos (último recurso; preferir si así está en Figma) |
| Rotación | `transform: rotate()` |
| Z-order de capas | orden del DOM (capa inferior primero) |

> Para escritorio / responsive: los *breakpoints* se toman de los frames que existan en Figma por plataforma. Si solo existe la versión móvil, **no** se inventa el layout de escritorio; se deja el contenedor centrado con el ancho del frame móvil y se registra como pendiente.

---

## 7. Estructura del repositorio

```
/
├── CLAUDE.md
├── FIGMA_REPLICA.md
├── docs/
│   ├── figma/
│   │   ├── inventory.md
│   │   ├── figma-map.json
│   │   ├── flujos.md
│   │   ├── assets.md
│   │   ├── discrepancias.md
│   │   ├── valores-sin-token.md
│   │   ├── mcp-tools.md
│   │   ├── CHANGELOG.md
│   │   └── cache/                # screenshots y respuestas MCP por nodeId
│   ├── design-system/
│   │   ├── README.md
│   │   └── rules.md
│   └── components/
│       └── <Componente>.md
├── src/
│   ├── design-system/
│   │   ├── tokens/ (tokens.json, tokens.css)
│   │   ├── components/
│   │   │   ├── atoms/
│   │   │   ├── molecules/
│   │   │   └── organisms/
│   │   └── index.ts
│   ├── assets/ (icons/, illustrations/, images/)
│   ├── screens/<flujo>/<Pantalla>.tsx
│   ├── navigation/ (rutas, overlays)
│   └── mocks/
└── tests/
    └── visual/                   # pruebas de regresión visual
```

---

## 8. Convenciones de nombres

- Componentes: `PascalCase` derivado del nombre en Figma (`Button/Primary` → `Button` con `variant="primary"`).
- Carpetas y rutas: `kebab-case`.
- Tokens: `--<categoría>-<nombre-figma-normalizado>`.
- Cada archivo de componente/pantalla inicia con:
  ```ts
  /**
   * Figma: <Nombre en Figma>
   * nodeId: 123:456
   * URL: https://www.figma.com/design/<FILE_KEY>/?node-id=123-456
   * Última sincronización: AAAA-MM-DD
   */
  ```

---

## 9. Verificación visual (Definición de Hecho)

1. Renderizar el componente/pantalla con Playwright al **mismo tamaño** del frame de Figma y `deviceScaleFactor` igual al del screenshot.
2. Comparar contra `docs/figma/cache/<nodeId>.png` con `pixelmatch` (o equivalente).
3. Tolerancia: **≤ 1 %** de píxeles distintos y ninguna diferencia de layout (posición/tamaño) mayor a **1 px**. Diferencias por antialiasing de fuentes se aceptan solo si el resto coincide.
4. Guardar el diff en `tests/visual/__diff__/` y reportar el porcentaje.
5. Si no pasa: corregir y repetir. Máximo 3 iteraciones; si persiste, registrar en `discrepancias.md` con el diff y pedir revisión.

### Checklist por componente
- [ ] Todas las variantes implementadas y visibles en el catálogo.
- [ ] Todos los estados (default, hover, pressed, focus, disabled, error, loading si existe).
- [ ] Solo tokens; ningún valor literal sin registrar.
- [ ] Props mapeadas 1:1 con propiedades de Figma.
- [ ] Verificación visual aprobada por variante.
- [ ] Registrado en `figma-map.json` (+ Code Connect si aplica).
- [ ] Ficha en `docs/components/`.

### Checklist por pantalla
- [ ] Construida solo con componentes del sistema.
- [ ] Textos literales idénticos.
- [ ] Zonas de scroll / fijas correctas.
- [ ] Safe areas (móvil).
- [ ] Estados alternos (vacío, error, carga) si existen en Figma.
- [ ] Navegación de entrada/salida conforme a `flujos.md`.
- [ ] Verificación visual aprobada.
- [ ] Registrada en `figma-map.json`.

---

## 10. Manejo de problemas frecuentes

| Situación | Acción |
|---|---|
| Respuesta del MCP truncada o muy grande | Dividir con `get_metadata` y pedir contexto por nodo hijo. |
| Límite de llamadas alcanzado | Detener, guardar avance en `CHANGELOG.md` con el siguiente nodo pendiente, reanudar después. |
| Componente viene de librería externa | `get_libraries`; si no hay acceso, pedir al usuario el archivo de la librería. |
| Fuente no disponible | Detener y preguntar. No sustituir. |
| Imagen como relleno (image fill) | Exportar con `download_assets`; respetar modo (fill/fit/crop/tile). |
| Capas ocultas | No se renderizan, pero se registran si parecen estados alternos. |
| Nombres de capa genéricos (`Frame 123`) | Nombrar en código por función y registrar el nombre original en el comentario de cabecera. |
| Inconsistencia en Figma (mismo elemento con valores distintos) | Replicar cada instancia tal cual y registrar en `discrepancias.md`. |
| Interacción no visible en el MCP | Registrar como `PENDIENTE` en `flujos.md` y preguntar. |

---

## 11. Plantillas

### 11.1 Entrada de inventario (`inventory.md`)
```md
## Página: <nombre> — nodeId <x:y> — [Incluir | Ignorar]
| Frame | nodeId | Tamaño | Tipo | Flujo | Plataforma | Estado |
|---|---|---|---|---|---|---|
| Login | 12:34 | 390×844 | Pantalla | Autenticación | Móvil | Pendiente |
```

### 11.2 Ficha de componente (`docs/components/<Componente>.md`)
```md
# <Componente>
- Figma: <nombre> · nodeId <x:y> · <URL>
- Nivel: átomo | molécula | organismo
- Dependencias: <componentes>
## Props
| Prop | Tipo | Default | Propiedad Figma |
## Variantes
| Combinación | nodeId | Screenshot | Verificación |
## Tokens usados
## Notas / discrepancias
```

### 11.3 Tabla de flujos (`flujos.md`)
```md
| Origen (pantalla/nodo) | Disparador | Acción | Destino | Transición | Duración/Easing | Fuente |
|---|---|---|---|---|---|---|
| Login / Botón Entrar | Tap | Navegar | Home | Slide izq. | 300ms ease-out | MCP / Usuario / PENDIENTE |
```

### 11.4 Entrada de `figma-map.json`
```json
{
  "fileKey": "<FILE_KEY>",
  "lastSync": "AAAA-MM-DD",
  "nodes": {
    "123:456": {
      "name": "Button",
      "type": "COMPONENT_SET",
      "code": "src/design-system/components/atoms/Button/Button.tsx",
      "variants": { "123:457": "variant=primary,size=md" },
      "screenshot": "docs/figma/cache/123-456.png",
      "status": "verificado"
    }
  }
}
```

---

## 12. Bloque para agregar a `CLAUDE.md` (al terminar F7)

```md
## Sistema de diseño (réplica de Figma)
- Fuente de verdad visual: Figma <URL>. Mapa de identidad: docs/figma/figma-map.json.
- Toda UI nueva usa exclusivamente componentes de src/design-system y tokens de tokens.css.
- Prohibido introducir valores visuales literales, librerías de UI o íconos externos.
- Para nuevas pantallas/flujos: si existen en Figma, seguir FIGMA_REPLICA.md (F4–F6);
  si NO existen en Figma, componer con componentes existentes y marcar la pantalla como
  "sin respaldo en Figma" en docs/figma/figma-map.json.
- Si el diseño cambia en Figma: resincronizar solo los nodos modificados y registrar en CHANGELOG.md.
```

---

## 13. Extensión futura (nuevas funcionalidades y flujos)

1. **Nuevo diseño en Figma:** ejecutar F0 solo sobre la página/frames nuevos → F3 para componentes nuevos → F4–F6 → actualizar `figma-map.json` y `CHANGELOG.md`.
2. **Cambio en un componente existente:** comparar screenshot nuevo vs caché; actualizar componente; volver a correr la verificación visual de **todas** las pantallas que lo usan (buscar en `figma-map.json`).
3. **Funcionalidad sin diseño:** solo composición con componentes existentes; nunca crear estilos nuevos. Proponer el diseño al equipo para incorporarlo a Figma.
4. **Versión escritorio:** cuando existan frames de escritorio en Figma, agregar breakpoints como tokens y aplicar F4–F6 sobre esos frames; los componentes se reutilizan y solo se añaden variantes si Figma las tiene.

---

## 14. Prompt de arranque para Claude Code

```
Lee @FIGMA_REPLICA.md completo. Parámetros: FILE_KEY=<...>, stack=<...>, plataforma=Móvil.
1) Valida la conexión del MCP de Figma y registra las herramientas reales en docs/figma/mcp-tools.md.
2) Ejecuta únicamente la fase F0 (inventario) y genera docs/figma/inventory.md.
3) Detente y espera mi aprobación del inventario antes de continuar con F1.
Reglas: no inventes valores, no rediseñes, registra toda duda como PENDIENTE.
```

Para las fases siguientes:
```
Continúa con la fase <F1|F2|F3|F4|F5> según @FIGMA_REPLICA.md.
Alcance: <todo | componente X | página Y>. Al terminar, ejecuta la verificación (sección 9),
reporta el checklist y detente.
```
