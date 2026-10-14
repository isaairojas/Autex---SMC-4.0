# Historias de usuario: Autex.com.mx + SMC 4.0

- **Fecha**: 2026-10-12 · **Estado**: borrador para revisión · **Constitution**: 3.0.0
- **Sale de**: la spec v2 (`specs/002-smc4-integracion/spec.md`), el catálogo de cambios
  (`docs/negocio/cambios-demo-vs-autex.md`) y las decisiones de la demo (`docs/figma/discrepancias.md`).
- **Para qué**: cada historia es su propia spec en `historias/`, con la plantilla del proyecto (objetivo,
  usuarios, historias, requisitos, reglas, criterios de aceptación, casos límite y fuera de alcance). La v2 queda
  como referencia general.

## Pagos fuera de alcance (equipo Mercedes)

El tema de **pagos, método de pago, pasarela de cobro, asignación del número de pedido y Mis pedidos** queda
**fuera del alcance** de este proyecto. La integración y el cálculo del cobro corresponden al equipo **Mercedes**
(especializado en finanzas e integración de pagos). Por eso se eliminaron las historias **H07** (Pago,
confirmación y pedido) y **H08** (Demo guiada); sus archivos quedan como historial en `historias/historial/`.

Lo único que este proyecto conserva relacionado con la pasarela es:
- **Visualización de la facturación** (checkbox "Requiero factura" en el paso 1), que se cubre en **H05**.
- **Método de envío** (paso 2 del pago) con la propuesta de SMC 4.0, que se cubre en **H06**.

> **Nota de pago.** El pago únicamente se realiza al momento de estar en la plataforma. Si por algún motivo
> el cliente no realiza el pago, no se genera factura.

## Índice de historias

Las 23 historias de la primera versión se unificaron en 6 funcionales + 1 de celular. La columna "Unió" dice
cuáles de la primera versión absorbe cada una; "Catálogo", los cambios que cubre.

| # | Historia | Unió | Catálogo |
|---|---|---|---|
| [H01](historias/H01-ventana-principal.md) | Ventana principal: ubicación, sucursal y envío gratis | Ventana principal; selección de sucursal | GEN-03, UBI-01, UBI-02, UBI-03, UBI-04, UBI-06, UBI-09, CTA-01, CTA-03 |
| [H02](historias/H02-calculo-smc.md) | Cálculo de SMC 4.0 (back): existencias, foráneas, surtido y tiempos de entrega | Algoritmo de existencias; foráneas; algoritmo de surtido; tiempos de entrega; falla de SMC | UBI-07, UBI-08, CAT-04, CAT-05, CAT-06, CAT-09, PAG-12 |
| [H03](historias/H03-catalogo-por-ubicacion.md) | Catálogo por ubicación (front): búsqueda, categorías y detalle con existencias, tiempos e IVA | Existencias (front); búsqueda por rangos; detalle; IVA fronterizo | UBI-05, CAT-01, CAT-02, CAT-03, CAT-07, CAT-08, CAT-10, GEN-02 |
| [H04](historias/H04-carrito-recoger.md) | Carrito y recoger en tienda | Carrito; recoger en tienda | CAR-01, CAR-02, CAR-03, CAR-04, CAR-05, CAR-06, PAG-05 |
| [H05](historias/H05-datos-usuario-direcciones.md) | Datos del usuario, direcciones y facturación (ocultar/mostrar) | Datos del invitado; datos del registrado; dirección de envío; selección de facturación | PAG-04, PAG-06, PAG-07, PAG-08, CTA-02 |
| [H06](historias/H06-pasarela-metodo-envio.md) | Pasarela y método de envío: sin encabezado, pasos y envíos múltiples | Pasarela sin encabezado; paso 2 Método de envío | PAG-01, PAG-03, PAG-09, PAG-10, PAG-11 |
| H09 | Vista celular: compra completa en dispositivos móviles (≤768 px) | Celular | CEL-01 |
| ~~H07~~ | ~~Pago, confirmación y pedido~~ (fuera de alcance → equipo Mercedes) | — | — |
| ~~H08~~ | ~~Demo guiada~~ (fuera de alcance) | — | — |

## No son historias: van dentro de cada spec

- **Diseño Autex 2026** (GEN-01): cada spec cita sus pantallas de Figma; lo que no esté en Figma se marca "sin
  respaldo en Figma".
- **Celular** (CEL-01): además de H09, cada spec dice cómo se ve en celular, con el sitio en celular como base.
  Decisiones pendientes: "Mi tienda", "Entrega en" y el aviso de ubicación (H01); "Buscar en otra tienda" (H03);
  orden del carrito (H04); encabezado de la pasarela en celular (H06).

## Decisiones tomadas al escribir las specs (por confirmar)

1. **Foráneas (H02).** El parámetro arranca en 0 (sin foráneas), porque "de momento" no se toman; antes la regla
   contaba 1 por defecto (UBI-08).
2. **Lista de "Mi tienda" (H01).** Solo Local y Local Extendido de la ubicación (antes, todas las del estado); una
   sucursal de otra zona se elige desde la página de sucursales.
3. **Facturación (H05).** La selección de facturación (sí/no) se cubre como visualización: con el checkbox
   "Requiero factura" aparecen los campos; sin él, se asume **"Público general"**. El cálculo y la emisión de
   la factura **no** son de este proyecto (equipo Mercedes). Si el pago no se realiza, no se genera factura.
4. **Envío gratis (H01).** Un solo mensaje, "Sin mínimo de compra", en la franja y en el inicio (que hoy dice
   "Compras mayores a $499").
5. **IVA (H03).** Sigue a la ubicación de entrega; si todo se recoge, el de la sucursal. El pedido mixto queda por
   confirmar con fiscal.

## Pendientes

- Agregar al catálogo lo que no tiene ID: etiqueta de entrega en la tarjeta e IVA fronterizo (H03), falla de
  SMC 4.0 (H02). Principio VIII.
- Con negocio: si regresa el costo de envío al apagar la promoción (H06).
- Con el equipo Mercedes: handoff de la facturación y los pagos (fuera de este alcance).
