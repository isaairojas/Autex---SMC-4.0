# Referencia: autex.com.mx (sitio real)

Capturas del sitio público tomadas el 2026-10-05 con Playwright y Chrome, **solo lectura**: sin iniciar sesión ni comprar.
Sirven de referencia para las páginas que **no existen en Figma** (Autex_2026_Frames).

Scripts (requieren Chrome instalado; el sitio bloquea el Chromium de Playwright con "Access Denied"):
- `CANAL=chrome node tests/referencia/capturar-autex.mjs <salida>` — páginas principales.
- `CANAL=chrome node tests/referencia/interacciones-autex.mjs <salida>` — menú de especialidades, Ingresar, etc.
- `CANAL=chrome node tests/referencia/sucursales-autex.mjs` — texto de la lista de sucursales (origen de `src/mocks/sucursales.ts`).
- `node tests/referencia/capturar-demo.mjs <salida> home catalogo …` — capturas de la demo (puerto 5179).

| Página real | Ruta en la demo | Archivo |
|---|---|---|
| `/` inicio | `/` | `src/screens/sitio/Home.tsx` |
| `/catalogo/` | `/catalogo` | `src/screens/sitio/CatalogoEspecialidades.tsx` |
| `/busqueda-marca/` | `/marcas` | `src/screens/sitio/Marcas.tsx` |
| `/ofertas/` | `/ofertas` | `src/screens/sitio/Ofertas.tsx` |
| `/busqueda/Catalogos/?…` | `/busqueda?…` | `src/screens/tienda/Inicio.tsx` (catálogo de Figma 657:14082 con filtros por parámetros) |
| `/sucursales/` | `/sucursales` | `src/screens/sitio/Sucursales.tsx` |
| `/como-comprar/` | `/como-comprar` | `src/screens/sitio/ComoComprar.tsx` |
| `/autenticacion/login/` | Modal login | Ya replicado desde Figma (742:19087) |
| `/carrito/` | `/carrito` | Ya replicado desde Figma (673:18974) |

Fuera de alcance (enlaces externos o páginas de texto legal): términos, aviso de privacidad, preguntas frecuentes, facturación,
quiénes somos, bolsa de trabajo, revista y solicitud de crédito (PDF de Apymsa).
