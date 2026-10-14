# Contrato: tienda ↔ SMC 4.0

Qué le manda la tienda a SMC 4.0 y qué recibe. En la fase 1 lo cumple la función simulada de la demo
(`src/mocks/smc.ts`); en la fase 2, el servicio real. El formato es JSON y no depende de la tecnología del sitio.
Fechas en ISO 8601 con zona horaria de México; importes en MXN; textos en español de México.

Hay dos operaciones: **existencias por ubicación** (catálogo, detalle y carrito) y **propuesta de surtido** (paso de
envío y confirmación).

## 1. Existencias por ubicación

Para mostrar existencias por rangos, disponibilidad y "Buscar en otra tienda" (CAT-01, CAT-02, CAT-07, CAT-08).

**Entrada**

```json
{
  "entrega": { "codigoPostal": "45138" },
  "miTiendaId": "tesistan",
  "productos": [{ "productoId": "filtro-aire", "cantidad": 2 }]
}
```

**Salida**

```json
{
  "productos": [
    {
      "productoId": "filtro-aire",
      "estado": "bajo-pedido",
      "piezasEnLinea": 1,
      "piezasEnMiTienda": 1,
      "maximoVenta": 3,
      "entrega": { "desde": "2026-10-09", "hasta": "2026-10-13", "texto": "Entrega entre el viernes 9 y el martes 13 de octubre" },
      "tiendasConPiezas": [{ "sucursalId": "tesistan", "km": 0.0, "piezas": 1 }]
    }
  ]
}
```

Reglas: `estado` es `disponible`, `bajo-pedido` o `sin-existencia` y cambia con la cantidad (RN4); las baterías solo
cuentan candidatas a 30 km o menos (RN5); CEDIS no cuenta (CAT-06). La tienda muestra `piezasEnLinea` por rangos
(+100, +50, +30, +10 o el número exacto si es menor de 10).

## 2. Propuesta de surtido

**Entrada**

```json
{
  "cliente": { "tipo": "invitado", "segmento": "publico", "sucursalBaseId": null },
  "entrega": { "codigoPostal": "45138" },
  "miTiendaId": "tesistan",
  "lineas": [
    { "productoId": "inyector-ai3922", "cantidad": 2, "metodo": "domicilio" },
    { "productoId": "cinta-aislante", "cantidad": 3, "metodo": "recoger" }
  ],
  "ahora": "2026-10-07T10:00:00-06:00"
}
```

| Campo | Regla |
|---|---|
| cliente.tipo | `invitado` o `registrado` (B2C) |
| cliente.sucursalBaseId | Solo registrados; activa RN12 |
| entrega.codigoPostal | Obligatorio; define candidatas, fronteriza y predefinida |
| lineas[].metodo | `domicilio` o `recoger`; los exclusivos de recoger se tratan como `recoger` aunque lleguen como `domicilio` |
| ahora | Para las fechas en días hábiles y la hora límite de las 2:00 p.m. |

**Salida**

```json
{
  "envios": [
    {
      "numero": 1,
      "sucursalId": "tesistan",
      "sucursal": "Autex Tesistan",
      "direccion": "Av. Juan Gil Preciado #4051 Col. Hogares de Nuevo México, 45138 Zapopan, Jalisco",
      "foraneo": false,
      "bajoPedido": false,
      "etiquetas": [],
      "entrega": { "desde": "2026-10-07", "hasta": "2026-10-07", "texto": "Entrega hoy" },
      "lineas": [{ "productoId": "inyector-ai3922", "piezas": 2 }]
    }
  ],
  "recoger": {
    "sucursalId": "tesistan",
    "lineas": [{ "productoId": "cinta-aislante", "piezas": 3 }]
  },
  "sinExistencia": [],
  "cajaGris": [],
  "iva": 16,
  "explicaciones": [
    {
      "paso": "envio",
      "regla": "Sucursal más cercana con todo",
      "texto": "Autex Tesistan está a 0.0 km de tu C.P. 45138 y tiene las 2 piezas, así que tu pedido sale de ahí hoy."
    }
  ]
}
```

| Campo | Regla |
|---|---|
| envios[] | Orden de decisión RN6; los de una sucursal juntos; cuando mucho un envío foráneo |
| envios[].etiquetas | `Sucursal predefinida`, `Sucursal base`, `Complemento`, `Bajo pedido` |
| recoger | Solo piezas de "Mi tienda" (RN7); `null` si nada se recoge |
| sinExistencia[] | Sin piezas en ninguna candidata (E5); bloquean el pago |
| cajaGris[] | Con piezas pero sin asignación posible, con `motivo` (E6); bloquean el pago |
| iva | 8 en C.P. fronterizo, 16 en el resto (RN14) |
| explicaciones[] | Un texto por regla aplicada, para los globos (RF18) |

Invariantes: cada línea aparece en un solo lugar (envío, recoger, sin existencia o caja gris); si existe una
sucursal apta, `envios` o `recoger` no están vacíos (RN1).

## Errores y tiempos

| Caso | Respuesta | Qué muestra la tienda |
|---|---|---|
| C.P. sin sucursales candidatas | `envios: []`, `recoger: null`, todas las líneas en `sinExistencia` con `motivo: "sin-cobertura"` | "No hay sucursales que surtan esa dirección" (CL1) |
| Sin respuesta en 2 segundos | (ninguna) | "No pudimos calcular tus envíos en este momento" con "Reintentar"; no se paga (RF20) |
| Entrada inválida (C.P. mal escrito, cantidad 0) | Error con el campo y el motivo | El formulario marca el campo; no se llama de nuevo hasta corregirlo |

## Ejemplos por escenario (resultado esperado)

| Escenario | Entrada que lo provoca | Salida esperada |
|---|---|---|
| E1 Sucursal predefinida | C.P. con sucursal predefinida | Primer envío con etiqueta `Sucursal predefinida`; faltantes en envíos `Complemento` |
| E2 Sucursal base | Registrado con `sucursalBaseId` que cubre ≥ 80 % | Envío `Sucursal base` y complementos para lo que falta |
| E3 Exclusivos de recoger | Línea exclusiva (o su promoción) con `metodo: domicilio` | Esas líneas en `recoger`; el resto en `envios` |
| E4 IVA fronterizo | C.P. 22000 | `iva: 8` |
| E5 Sin existencias | Producto sin piezas en candidatas | Línea en `sinExistencia` |
| E6 Caja gris | Promoción que ninguna sucursal completa | Líneas en `cajaGris` con su motivo |
| E7 No registrado | `cliente.tipo: invitado`, sin `sucursalBaseId` | Propuesta con segmento público, sin etiqueta `Sucursal base` |
