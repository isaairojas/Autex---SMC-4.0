# Verificación visual (FIGMA_REPLICA.md §9)

Render a 1920 px con Playwright comparado contra la captura de Figma (`pixelmatch`, umbral 0.1).
Comando: `npm run dev` y luego `node tests/visual/compare-all.mjs`. Diferencias en `tests/visual/__diff__/`.

**Lectura de los resultados**: el criterio del MD es ≤ 1 %. Ninguna pantalla lo cumple porque la fuente HeadingNow se sustituyó por Archivo (D1): cambia el ancho de todos los textos. Se revisaron los mapas de diferencias: no hay desplazamientos de layout salvo los indicados.

| Flujo | nodeId | Frame | Ruta | Diferencia |
|---|---|---|---|---|
| Tienda | 12849:114186 | New Home Autex - Cuadricula | /figma/12849-114186 | 4.23 % |
| Tienda | 12849:113500 | Producto - Detalle - Expecificaciones del producto | /figma/12849-113500 | 2.26 % |
| F1 Invitado · Sucursal | 397:35700 | Checkout - Invitado - Direccion | /figma/397-35700 | 4.45 % |
| F1 Invitado · Sucursal | 128:64284 | Checkout - Invitado - Seleccionar sucursal | /figma/128-64284 | 1.61 % |
| F1 Invitado · Sucursal | 2596:99063 | … Sucursales - Estados | /figma/2596-99063 | 2.07 % |
| F1 Invitado · Sucursal | 2596:99874 | … Edo seleccionado y tiendas | /figma/2596-99874 | 2.11 % |
| F1 Invitado · Sucursal | 129:66134 | Checkout - Invitado - Sucursal Metodo de pago | /figma/129-66134 | 1.61 % |
| F1 Invitado · Sucursal | 130:65540 | Checkout - Invitado - Sucursal Confirmacion | /figma/130-65540 | 2.02 % |
| F2 Confirmación tarjetas | 2599:98491 | Checkout - Invitado - Confirmacion tarjeta | /figma/2599-98491 | 2.16 % |
| F2 Confirmación tarjetas | 2599:98979 | Checkout - Invitado - Confirmacion tarjeta - Error | /figma/2599-98979 | 2.61 % |
| F3 Editar envío | 2599:99538 | Checkout - Invitado - Editar metodo de envio | /figma/2599-99538 | 2.60 % |
| F3 Editar envío | 2599:99708 | Checkout - Invitado - Confirmacion tarjeta - Error (domicilio) | /figma/2599-99708 | 2.57 % |
| F4 Editar pago | 2599:101632 | Checkout - Invitado - Editar metodo de pago | /figma/2599-101632 | 2.53 % |
| F5 Invitado · Domicilio | 1324:96920 | Checkout - Invitado - A domicilio | /figma/1324-96920 | 1.92 % |
| F5 Invitado · Domicilio | 135:67668 | Checkout - A domiciolio - 02 | /figma/135-67668 | 1.91 % |
| F5 Invitado · Domicilio | 136:68850 | Checkout - A domiciolio - 03 | /figma/136-68850 | 1.52 % |
| F5 Invitado · Domicilio | 2599:103603 | Checkout - A domiciolio - 9 | /figma/2599-103603 | 2.54 % |
| F5 Invitado · Domicilio | 136:70130 | Checkout - A domiciolio - Confirmacion | /figma/136-70130 | 2.04 % |
| F5 Invitado · Domicilio | 2599:104540 | Checkout - A domiciolio - Confirmacion (OpenPay) | /figma/2599-104540 | 1.87 % |
| F5 Invitado · Domicilio | 136:70626 | Checkout - A domiciolio - 06 | /figma/136-70626 | — |
| F5 Invitado · Domicilio | 949:84894 | Ticket Tiendad | /figma/949-84894 | — |
| F6 B2C · Sucursal | 463:119933 | Checkout - B2C - Sucursal (datos) | /figma/463-119933 | 1.63 % |
| F6 B2C · Sucursal | 463:120909 | Checkout - B2C - Sucursal (envío) | /figma/463-120909 | 1.65 % |
| F6 B2C · Sucursal | 463:121566 | Checkout - B2C - Sucursal (tiendas) | /figma/463-121566 | 2.16 % |
| F6 B2C · Sucursal | 463:122330 | Checkout - B2C - Sucursal (pago) | /figma/463-122330 | 1.71 % |
| F6 B2C · Sucursal | 482:87878 | Checkout - Invitado - Sucursal Confirmacion (B2C) | /figma/482-87878 | 2.04 % |
| F7 B2C · Domicilio | 482:82975 | Autex - Checkout - Domicilio (datos) | /figma/482-82975 | 4.72 % |
| F7 B2C · Domicilio | 482:83129 | Autex - Checkout - Domicilio (envío) | /figma/482-83129 | 2.00 % |
| F7 B2C · Domicilio | 2600:108075 | Checkout - B2C - Sucursal (pago, domicilio) | /figma/2600-108075 | 1.71 % |
| F7 B2C · Domicilio | 2600:108667 | Checkout - Invitado - Sucursal Confirmacion (B2C domicilio) | /figma/2600-108667 | 2.12 % |
| F8 Nuevo usuario | 1324:97509 | Checkout - Nuevo usuario | /figma/1324-97509 | 1.96 % |
| F9 Edición de envío | 2600:113324 | Confirmacion + editar envío | /figma/2600-113324 | 2.59 % |
| F9 Edición de envío | 2600:113845 | Confirmacion + editar envío (oculto) | /figma/2600-113845 | 2.13 % |
| F10 Edición de pago | 2600:114582 | Confirmacion + editar pago | /figma/2600-114582 | 2.44 % |
| F10 Edición de pago | 2600:114910 | Confirmacion + editar pago (tarjeta nueva) | /figma/2600-114910 | 2.44 % |
| F11 B2B · Crédito | 2600:116100 | Checkout - B2B - Sucursal (datos) | /figma/2600-116100 | 2.27 % |
| F11 B2B · Crédito | 2600:116276 | Checkout - B2B - Sucursal (envío) | /figma/2600-116276 | 2.12 % |
| F11 B2B · Crédito | 2600:116409 | Checkout - B2B - Sucursal (tiendas) | /figma/2600-116409 | 2.68 % |
| F11 B2B · Crédito | 2600:116683 | Checkout - B2B -Credito apymsa | /figma/2600-116683 | 2.25 % |
| F11 B2B · Crédito | 2605:97855 | Checkout - B2B -Credito apymsa (sin saldo) | /figma/2605-97855 | 2.34 % |
| F11 B2B · Crédito | 2600:116869 | Checkout - Invitado - Sucursal Confirmacion (B2B) | /figma/2600-116869 | 2.75 % |

Notas:
- 397:35700 y 482:82975: la `Section` de esos frames está desplazada en Figma (D10, D24).
- 12849:114186: la fuente sustituta parte menos líneas en los filtros y cambia la altura de la columna.
- 136:70626 (1980 px) y 949:84894 (componente) se revisaron visualmente.
