# Investigación (fase 0): Autex.com.mx + SMC 4.0 v2

Resuelve lo que el plan marcaba como pendiente. Cada decisión dice qué se eligió, por qué y qué se descartó.

## R1. Un solo módulo "SMC 4.0 simulado" en la demo

- **Decisión**: concentrar el cálculo en una función `calcularPropuesta(entrada) → propuesta` (`src/mocks/smc.ts`) que
  aplica el orden de decisión RN6 y devuelve envíos, recoger, sin existencia, caja gris, IVA y explicaciones. Las
  pantallas y `DemoContext` solo la llaman y muestran el resultado.
- **Por qué**: hoy el cálculo está repartido entre `existencias.ts`, `envios.ts` y `DemoContext.tsx`; el Principio VII
  ("SMC 4.0 decide, la tienda muestra") pide una sola fuente. Además, la entrada y la salida de esa función son el
  contrato de la fase 2 (`contracts/smc-propuesta.md`): el sitio real cambia la función simulada por la llamada al
  servicio y las pantallas no cambian.
- **Descartado**: seguir agregando reglas en `envios.ts` y `DemoContext` (más difícil de explicar con globos y de
  probar por escenario); un servidor simulado aparte (complejidad sin necesidad, Principio I).

## R2. Escenarios E1–E7

- **Decisión**: un archivo de datos `src/mocks/escenarios.ts` con cada escenario (cliente, dirección, carrito, datos
  que lo provocan y resultado esperado) y una página `/escenarios` que los lista; al elegir uno se cargan dirección,
  cliente y carrito y se abre el carrito. Sin respaldo en Figma: se arma con componentes existentes.
- **Por qué**: RF18 y CA1–CA7 piden recorrerlos desde la app; datos fijos garantizan el mismo resultado siempre.
- **Descartado**: parámetros en la URL para cada dato (frágil y difícil de leer para negocio).

## R3. Datos que provocan cada escenario

- **Decisión**: agregar a los datos simulados solo lo necesario:
  - Producto: `exclusivoRecoger` (E3) y `promocionId` (E3, E6).
  - Configuración SMC: `sucursalesPredefinidas` por C.P. (E1), `porcentajeSucursalBase` = 80 (E2),
    `sucursalesForaneasMaximo` (ya existe).
  - Cliente registrado: `sucursalBaseId` (E2).
  - C.P. fronterizos (E4) en `src/mocks/fronteras.ts`.
- **Por qué**: cada escenario necesita un dato que hoy no existe; agregarlos a los tipos actuales (`Producto`,
  `Cliente`, `configuracion-existencias.json`) evita estructuras paralelas.

## R4. IVA fronterizo

- **Decisión**: los precios del catálogo ya incluyen IVA del 16 %. Con un C.P. de la región fronteriza, cada precio se
  muestra como `precio / 1.16 × 1.08`, redondeado a centavos, en catálogo, detalle, carrito y pago; el resumen dice
  "TOTAL (IVA incluido, 8 %)". Para la demo, los C.P. fronterizos son ejemplos de las regiones norte y sur (Tijuana
  22000, Mexicali 21000, Ciudad Juárez 32000, Reynosa 88500, Tapachula 30700, Chetumal 77000).
- **Por qué**: RN14 y CA4 piden precios y total al 8 %; calcularlo desde el precio con IVA evita duplicar precios.
- **Descartado**: guardar dos precios por producto (doble mantenimiento); aplicar el 8 % solo al total (contradice
  E4 de la v1, "los precios y el total").
- **Fase 2**: la lista oficial de municipios de la región fronteriza la da el equipo fiscal del sitio.

## R5. Caja gris y sin existencia

- **Decisión**: "Sin existencia" = ninguna sucursal candidata tiene piezas del artículo (se bloquea el pago, como hoy).
  "Caja gris" = hay piezas, pero el cálculo no puede armar la asignación (por ejemplo, una promoción cuyas piezas no
  completa ninguna sucursal y no se puede partir). La caja gris se muestra en el paso de envío y en la confirmación,
  separada de los envíos, y tampoco se paga.
- **Por qué**: la v1 los distingue (E5 y E6) y RN13 los separa.

## R6. Globos explicativos

- **Decisión**: un componente `Globo` (molécula, sin respaldo en Figma) con un ícono de ayuda y un texto que se abre al
  tocarlo; cada pantalla del flujo tiene al menos uno y su texto sale de `propuesta.explicaciones` (la regla aplicada
  y sus datos). Se compone con estilos ya existentes (tokens de `Toast` y de las ventanas).
- **Por qué**: RF18, CA16 y el objetivo de la demo; el texto sale del cálculo para no contradecirlo (Principio VII).
- **Descartado**: textos fijos por pantalla (no explicarían el escenario concreto).

## R7. Falla de SMC 4.0 (RF20)

- **Decisión**: en la demo, un escenario "SMC 4.0 sin respuesta" hace que `calcularPropuesta` no conteste en 2
  segundos; el paso de envío muestra la carga "Calculando tu envío", después "No pudimos calcular tus envíos en este
  momento" con "Reintentar", y "Continuar" queda bloqueado.
- **Por qué**: permite comprobar CA18 sin un servicio real.

## R8. Contrato con SMC 4.0 (fase 2)

- **Decisión**: documentar la entrada y la salida de la propuesta como JSON, independiente de la tecnología
  (`contracts/smc-propuesta.md`), con ejemplos de los escenarios y los errores.
- **Por qué**: TODO(REPO_SITIO) sigue abierto; un contrato en JSON sirve para cualquier tecnología del sitio.
- **Observado en el sitio actual** (solo lectura, 2026-10-09): Next.js con componentes de Ant Design y Material UI. Se
  confirma con el equipo del sitio antes de la fase 2.

## R9. Vista de celular

- **Decisión**: seguir `docs/autex-real/movil/PLAN.md`: entrega 2 (compra), entrega 3 (pago), entrega 4 (resto), y
  después los cambios de la demo con sus decisiones pendientes. Las piezas nuevas de esta v2 (globos, escenarios,
  caja gris, IVA) se diseñan para escritorio y celular desde el inicio.

## R10. Pruebas

- **Decisión**: una prueba de Playwright por escenario (`tests/referencia/escenarios-demo.mjs`, E1–E7 y la falla de
  SMC) además de las existentes (`tests/e2e-flujo.mjs`, `tests/referencia/*.mjs`, `tests/visual/compare-all.mjs`).
- **Por qué**: cada escenario es un criterio de aceptación que se comprueba en la app (Principio IV).
