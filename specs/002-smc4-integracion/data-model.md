# Modelo de datos (fase 1): Autex.com.mx + SMC 4.0 v2

Entidades del dominio y sus reglas. Entre paréntesis, dónde viven hoy en la demo; **nuevo** marca lo que agrega esta
versión.

## Cliente (`src/mocks/clientes.ts`)

| Campo | Tipo | Regla |
|---|---|---|
| tipo | invitado · nuevo · b2c | B2B queda fuera de v2 |
| nombre, correo, teléfono | texto | Solo lo imprescindible (Principio V) |
| direcciones | DireccionEntrega[] | Una puede ser predeterminada |
| tarjetaPredeterminadaId | id | CTA-04 |
| sucursalBaseId | id de Sucursal | **Nuevo**. Solo registrados; E2 (RN12) |

## Ubicación de entrega (`src/mocks/tiendas.ts`, `clientes.ts`)

| Campo | Tipo | Regla |
|---|---|---|
| codigoPostal | 5 dígitos | Sin C.P. válido no hay sucursales (CL1) |
| lat, lon | número | Para medir distancias a las sucursales |
| ciudad, estado | texto | "Zona de entrega" del carrito |
| fronteriza | sí/no | **Nuevo**. Sale de `src/mocks/fronteras.ts`; IVA 8 % (RN14) |
| sucursalPredefinidaId | id o vacío | **Nuevo**. Sale de la configuración SMC; E1 (RN11) |

## Sucursal (`src/mocks/tiendas.ts`, `existencias.ts`)

| Campo | Tipo | Regla |
|---|---|---|
| id, nombre, dirección, horario, teléfono | texto | |
| lat, lon | número | |
| cedis | sí/no | CEDIS no vende en línea ni es origen (CAT-06) |
| existencias | piezas por producto | Una sola fuente (CAT-09) |

Derivados por ubicación: `km` y nivel de servicio (Local ≤ 15 km, Local Extendido ≤ 30 km, Foráneo ≤ 350 km;
`configuracion-servicios-smc.json`). **Sucursales candidatas** = Local + Local Extendido + las N foráneas más
cercanas (N = `sucursalesForaneasMaximo`, 1).

## Producto (`src/mocks/productos.ts`, `catalogo.ts`)

| Campo | Tipo | Regla |
|---|---|---|
| id, sku, nombre, imágenes | texto | |
| precio | pesos con IVA 16 % | Con C.P. fronterizo se muestra `precio / 1.16 × 1.08` |
| esBateria | derivado del id | Solo candidatas ≤ 30 km (CAT-04) |
| exclusivoRecoger | sí/no | **Nuevo**. Siempre a "Recoger en tienda" (RN10) |
| promocionId | id o vacío | **Nuevo**. Las piezas de una promoción van juntas (RN10, RN13) |

## Línea del carrito (`src/mocks/productos.ts`, `DemoContext.tsx`)

| Campo | Tipo | Regla |
|---|---|---|
| producto, cantidad | | Cantidad ≤ máximo de compra en línea o de "Mi tienda" si recoge (CAT-03, CAR-04) |
| metodo | domicilio · recoger | CAR-01; los exclusivos siempre recoger |
| estado | disponible · bajo pedido · sin existencia | Se recalcula con la ubicación y la cantidad |

## Configuración SMC (`src/mocks/configuracion-*.json`)

| Campo | Valor en la demo |
|---|---|
| servicios por distancia | Local 15 km, Local Extendido 30 km, Foráneo 350 km (valores de Acapulco) |
| sucursalesForaneasMaximo | 1 |
| porcentajeSucursalBase | **Nuevo**: 80 |
| sucursalesPredefinidas | **Nuevo**: C.P. → id de sucursal |
| horaLimiteMismoDia | 14:00 (`fechasEntrega.ts`) |

## Propuesta de surtido — salida de SMC 4.0 (**nuevo**, `src/mocks/smc.ts`)

| Campo | Contenido |
|---|---|
| envios | Envío[]: número, sucursal origen, dirección, foráneo, bajo pedido, etiquetas, fecha estimada, líneas con piezas |
| recoger | sucursal ("Mi tienda") con sus líneas (PAG-09) |
| sinExistencia | líneas sin piezas en ninguna candidata (E5) |
| cajaGris | líneas que no se pudieron asignar, con su motivo (E6) |
| iva | 16 o 8 |
| explicaciones | Explicación[] para los globos |

Reglas: cada línea queda en exactamente un lugar (envío, recoger, sin existencia o caja gris); los envíos siguen
el orden RN6; cuando mucho un envío foráneo; si hay al menos una sucursal apta, hay al menos un envío o recoger
(RN1).

### Envío

| Campo | Regla |
|---|---|
| numero | 1, 2, 3… en el orden en que se muestran |
| etiquetas | "Sucursal predefinida", "Sucursal base", "Complemento", "Bajo pedido" |
| rango | Fechas en días hábiles (RN3) |

### Explicación (globo)

| Campo | Contenido |
|---|---|
| paso | dirección · carrito · envío · pago · confirmación |
| regla | Nombre de la regla (p. ej. "Sucursal más cercana con todo") |
| texto | Frase en español claro con los datos del caso (sucursales candidatas, distancias, piezas) |

## Escenario de demostración (**nuevo**, `src/mocks/escenarios.ts`)

| Campo | Contenido |
|---|---|
| id | E1 … E7, más "SMC sin respuesta" |
| nombre | Como en la spec (CA1–CA7) |
| cliente, ubicación, carrito | Datos que se cargan al elegirlo |
| esperado | Resultado visible que comprueba el criterio de aceptación |

## Pedido (`DemoContext.tsx`)

| Campo | Regla |
|---|---|
| número | Se asigna al pagar (PAG-02); un pedido por compra (RN16) |
| envíos, recoger | Copia de la propuesta aceptada |
| estado | "En preparación" o "Pago pendiente en tienda" (PED-01) |

Transiciones del pedido: *carrito* → (pagar con tarjeta) → *En preparación*; *carrito* → (pagar en tienda de
autoservicio) → *Pago pendiente en tienda* (plazo de 3 días).
