# Flujos — Autex_2026_Frames (página 111:8)

El MCP no expone las conexiones del prototipo; las transiciones se deducen del orden del lienzo y de los botones de cada frame.

## Secciones

| Sección | Pantallas en orden |
|---|---|
| EF-46271 (657:14081) | 657:14082 Catálogo → 657:14102 Mini-carrito → 673:18974 Carrito → 742:19087 / 742:19208 Modal login → 677:18887 Checkout 1 → 719:22355 Checkout 2 → 723:23455 Checkout 3 → 738:17646 Checkout 4 → 904:34705 Gracias |
| EF-42837 (893:10621), fila "envío sin costo" | 893:10681 → 893:10938 → 893:11011 → 893:11077 |
| EF-42837, fila "envío con costo" | 901:33560 → 901:32141 → 901:32200 → 901:32266 → 902:34618 Gracias |

## Transiciones implementadas

| Origen | Disparador | Acción | Destino | Fuente |
|---|---|---|---|---|
| Catálogo | "Agregar al carrito" sin ubicación | Abrir overlay | Selección de C.P. (D5) | Usuario (FR-016) |
| Catálogo | "Agregar al carrito" | Abrir overlay | Mini-carrito 657:14102 | Lienzo |
| Catálogo | "Avisar disponibilidad" (sin existencia) | Cambiar texto | "Te avisaremos" | Sin respaldo |
| Mini-carrito | "Ver todos los productos" | Navegar | Carrito 673:18974 | Lienzo |
| Carrito | "Guardar para más tarde" | Cambiar estado | Tus productos → Guardar para más tarde | Botón del frame |
| Carrito | "Proceder al pago" (invitado) | Abrir overlay | Modal login 742:19087 | Lienzo |
| Carrito | "Proceder al pago" (registrado) | Navegar | Checkout 1 | Lienzo |
| Modal login | "Iniciar sesión" / "Continuar como invitado" | Navegar | Checkout 1 (registrado / invitado) | Botones del frame |
| Navbar | "Ingresar" | Abrir overlay | Modal login | Sin respaldo |
| Checkout 1 → 2 → 3 | "Continuar" | Navegar | Paso siguiente | Botón del frame |
| Checkout 3 | "Otras formas de pago" | Abrir overlay | Tiendas de autoservicio (archivo anterior) | Sin respaldo |
| Checkout 3 | "Añadir tarjeta +" | Cambiar estado | Campos de tarjeta (archivo anterior) | Sin respaldo |
| Checkout 4 | "Cambiar" (envío / pago) | Navegar | Checkout 1 / Checkout 3 | Botones del frame |
| Checkout 4 | "Confirmar el pedido" | Abrir overlay | OpenPay → Verificando → Gracias (o Tarjeta declinada si termina en 0000) | Archivo anterior |
| Gracias | "Seguir comprando" | Navegar | Catálogo | Botón del frame |
| Cualquier paso | "Regresar" | Navegar | Paso anterior | Botón del frame |

## Regla SMC 4.0 aplicada (datos simulados)

- **Disponible**: las sucursales de la zona (sin CEDIS) suman las piezas pedidas ("104 pzs").
- **Bajo pedido**: solo CEDIS 41 completa las piezas; entrega estimada de 2 a 4 días hábiles. El carrito los agrupa aparte y el envío muestra la fila "(Productos bajo pedido)".
- **Sin existencia** o C.P. sin cobertura: "No disponible" / "Avisar disponibilidad"; en el carrito bloquea el pago (caja gris, spec 001).

## Flujos del sitio real autex.com.mx (sin respaldo en Figma, 2026-10-05)

| Origen | Disparador | Destino |
|---|---|---|
| Inicio | Buscador por vehículo (Año, Marca, Modelo, Motor) | `/busqueda?anio=…&marca_auto=…` |
| Inicio | "Buscar por producto" / "Buscar por marcas" | `/catalogo` / `/marcas` |
| Inicio | Especialidad (mosaico) | `/busqueda?especialidad=…` |
| Inicio | "Cómo comprar" / "Solicitar crédito" / "Ver revista" | `/como-comprar` / PDF de Apymsa / `/ofertas` |
| Inicio | Marca destacada | `/busqueda?marca=…` |
| Catálogo | Especialidad o categoría | `/busqueda?especialidad=…&categoria=…` |
| Marcas | Letra (A–Z) / buscador / marca | Desplazamiento a la letra / filtro / `/busqueda?marca=…` |
| Ofertas | "Agregar al carrito" / vacío: "Ir al Catálogo" | Mini-carrito / `/catalogo` |
| Navbar | Texto + Enter o lupa, especialidad del menú | `/busqueda?q=…&especialidad=…` |
| Navbar | Inicio / Catálogo / Marcas / Promociones | `/` / `/catalogo` / `/marcas` / `/ofertas` |
| Footer | "Localiza tu tienda" / "¿Cómo comprar en Autex?" | `/sucursales` / `/como-comprar` |
| Sucursales | Buscador o pin del mapa | Filtra la lista; "Como llegar" abre Google Maps |
| Búsqueda | Sin coincidencias | "Tu búsqueda no coincidió con ningún producto" |

