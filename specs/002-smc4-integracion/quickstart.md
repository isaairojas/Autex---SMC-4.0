# Guía de validación: Autex.com.mx + SMC 4.0 v2

Cómo comprobar, usando la app, que la v2 funciona. Los datos están en `data-model.md` y el contrato en
`contracts/smc-propuesta.md`.

## Preparación

```bash
npm install
npx vite --port 5179          # la demo en http://localhost:5179
```

Pruebas automáticas (con el servidor anterior abierto):

```bash
npm run build                                   # compila sin errores
node tests/e2e-flujo.mjs                        # flujo completo, invitado y registrado
node tests/referencia/escenarios-demo.mjs       # E1–E7 y SMC sin respuesta (nuevo)
node tests/referencia/revision-flujo-demo.mjs   # recoger, factura, fechas, avisos
node tests/referencia/movil-demo.mjs            # vista de celular
node tests/visual/compare-all.mjs               # escritorio contra Figma
```

## Escenarios de aceptación

Abrir `/escenarios`, elegir el escenario y comprobar el resultado (sí/no).

| Criterio | Pasos | Resultado esperado |
|---|---|---|
| CA1 (E1) | Elegir "Sucursal predefinida" → Proceder al pago → Método de envío | Primer envío con "Sucursal predefinida"; faltantes en envíos aparte |
| CA2 (E2) | Elegir "Sucursal base + complementos" | Envío "Sucursal base" y complementos |
| CA3 (E3) | Elegir "Productos exclusivos de recoger" → "Enviar todo a domicilio" | El exclusivo (y su promoción) sigue en "Recoger en tienda" |
| CA4 (E4) | Elegir "IVA fronterizo" | Precios y total con IVA del 8 % y un globo que lo explica |
| CA5 (E5) | Elegir "Sin existencias" | "Artículos sin existencia" con mensaje claro; sin opciones de envío si no hay sucursal apta |
| CA6 (E6) | Elegir "Caja gris" | Sección "Caja gris" separada de los envíos, con su globo |
| CA7 (E7) | Elegir "Cliente no registrado" | Propuesta sin sesión, sin "Sucursal base" |
| CA18 | Elegir "SMC 4.0 sin respuesta" → Método de envío | "No pudimos calcular tus envíos en este momento" con "Reintentar"; no deja continuar |

## Comprobaciones del flujo (C.P. 45138)

| Criterio | Pasos | Resultado esperado |
|---|---|---|
| CA8 | Agregar un inyector → pago como invitado | 1 envío desde Autex Tesistan con su fecha en días hábiles |
| CA9 | Agregar todas las piezas de un inyector | Nunca más de un envío foráneo |
| CA10 | Carrito → "Recoger en tienda" → escribir 999 en la cantidad | Se ajusta a las piezas de la tienda; no queda sin existencia |
| CA11 | Todo para recoger → pago | El paso 1 pide quién recoge y su teléfono; sin dirección ni datos fiscales |
| CA12 | Registrado → pago → "Cambiar dirección de entrega" a Monterrey | Leyenda amarilla si baja; regreso al carrito si algo queda en 0 |
| CA13 | Barra superior → C.P. 64000 con productos en el carrito | Aviso temporal con lo ajustado o sin existencia |
| CA14 | Registrado con dirección y tarjeta, todo a domicilio y un envío → "Proceder al pago" | Abre directo "Confirmación" |
| CA15 | Pagar | El número aparece en gracias y en "Mis pedidos", no antes |
| CA16 | Recorrer el flujo | Cada pantalla tiene un globo; el del envío nombra la regla |
| CA17 | Ventana de 390 px | Menú, "Mis vehículos", inicio de sesión y carrito sin desplazamiento de lado |
| CA19 | Pedido con dos sucursales → pagar → "Mis pedidos" | Un número, una fila, dos envíos |

## Fase 2 (sitio real)

Para cada cambio del catálogo, la spec de programación cita su ID y valida su "Cómo debe quedar" con los mismos pasos
en el sitio; las llamadas a SMC 4.0 siguen `contracts/smc-propuesta.md`.
