# H01 · Ventana principal: ubicación, sucursal y envío gratis

- **Fecha**: 2026-10-12 · **Estado**: borrador · **Constitution**: 3.0.0
- **Índice**: `specs/historias-de-usuario.md` · **Catálogo**: GEN-03, UBI-01, UBI-02, UBI-03, UBI-04, UBI-06,
  UBI-09, CTA-01, CTA-03, CAT-08 (seleccionar tienda)
- **Depende de**: H02 (cálculo) · **La usan**: todas las demás

## 1. Objetivo y contexto de negocio

La ventana principal (el encabezado de todas las páginas fuera del pago) es el núcleo que une las demás historias:
ahí el cliente ve la promoción de envío gratis, elige su sucursal ("Mi tienda") y dice a dónde se le entrega
("Entrega en"). Con esa ubicación SMC 4.0 calcula existencias, sucursales y tiempos de entrega en todo el sitio.

La selección de sucursal es el conjunto de sucursales con servicio Local y Local Extendido de la ubicación; el
cliente elige una y se usa, sobre todo, para recoger en tienda (H04).

**Por qué importa**: hoy autex.com.mx no pide ubicación ni sucursal; el C.P. solo se captura en el pago, así que el
cliente compra sin saber si la pieza le llega.

**Decisiones (por confirmar)**:
- La lista de "Mi tienda" se limita a las Local y Local Extendido de la ubicación (antes mostraba todas las del
  estado). Una sucursal de otra zona se elige desde la página de sucursales, donde sigue la regla de "tienda de
  otro estado" (UBI-04).
- Un solo mensaje de envío gratis en todo el sitio: "Sin mínimo de compra".

## 2. Usuarios

- **Cliente no registrado (invitado)**: da su C.P. o permite su ubicación.
- **Cliente registrado**: usa sus direcciones guardadas; al iniciar sesión la entrega cambia a su predeterminada.

## 3. Escenarios de usuario (historias)

- **HU1 (P1)** — Como cliente no registrado, quiero indicar mi C.P. o mi ubicación al entrar, para ver solo lo que
  me puede llegar.
- **HU2 (P1)** — Como cliente registrado, quiero que la entrega use mi dirección predeterminada al iniciar sesión.
- **HU3 (P1)** — Como cliente, quiero elegir una sucursal cercana, para recoger ahí mis piezas.
- **HU4 (P2)** — Como cliente, quiero ver de cada sucursal su distancia, horario y tiempo de entrega.
- **HU5 (P2)** — Como cliente, quiero ver que el envío es gratis, para animarme a comprar en línea.

## 4. Requisitos funcionales

- **RF1.** Franja "Envío gratis a todo México | Sin mínimo de compra por apertura" con "(Aplica restricciones)" en
  letra más chica; promoción y leyenda se encienden o apagan por configuración. *(GEN-03)*
- **RF2.** Todos los banners de envío gratis (franja e inicio) dicen el mismo mensaje.
- **RF3.** Al entrar se pide permiso de ubicación; si se da, la sucursal más cercana queda como "Mi tienda"; si se
  cierra, "Elige una tienda" con "Usar mi ubicación" y "Elegir tienda manualmente" (pide el C.P. y luego las
  sucursales). *(UBI-01)*
- **RF4.** "Entrega en": el invitado ve su C.P. y puede escribir otro, usar su ubicación o iniciar sesión; el
  registrado ve su C.P. y el nombre de la dirección, elige otra, las administra o agrega una nueva (formulario de
  H05). *(UBI-03)*
- **RF5.** Sin elección del cliente, la entrega usa un C.P. inicial y su sucursal. *(UBI-06)*
- **RF6.** "Mi tienda" muestra la sucursal elegida y si está abierta o a qué hora abre; al abrirla, la lista de
  Local y Local Extendido ordenada por distancia, con kilómetros, nivel de servicio, tiempo de entrega y estado;
  sin costo logístico; se busca por nombre, id o dirección. *(UBI-02)*
- **RF7.** Al elegir sucursal, "Cambiando tu tienda" y se actualizan las piezas de sucursal en el sitio y el
  carrito (H03, H04).
- **RF8.** La página de sucursales ordena por distancia a la entrega con "Hacer mi tienda". *(UBI-09)*
- **RF9.** Elegir una sucursal de otro estado solo cambia dónde se recoge; la entrega no cambia. *(UBI-04)*
- **RF10.** Al cambiar la ubicación o iniciar sesión se recalculan sucursales, existencias, tiempos y precios
  (H02, H03). *(UBI-03, CTA-01)*
- **RF11.** El inicio de sesión es una ventana y al terminar el cliente regresa a la página principal. *(CTA-03)*

## 5. Reglas de negocio (con ejemplos)

- **RN1. Una sola ubicación manda.** *Ejemplo*: un invitado en 45138 cambia a 64000 y todo pasa a Monterrey.
- **RN2. Ubicación inicial.** *Ejemplo*: en la demo, 45138 y la sucursal Tesistán (Zapopan).
- **RN3. Dirección predeterminada.** *Ejemplo*: al iniciar sesión, "Entrega en" cambia a "Casa · 45138".
- **RN4. Lista por servicio.** *Ejemplo*: en 45138, Tesistán, Belisario Domínguez, Colón, Mercado Libre Adolf Horn
  y Adolf Horn; no Zamora.
- **RN5. La sucursal no mueve la entrega.** *Ejemplo*: desde Sucursales, un invitado en 45138 hace "Mi tienda" a
  Monterrey Ruiz y su entrega sigue en 45138.
- **RN6. "No permitir nunca"** cierra el aviso y no se vuelve a preguntar.
- **RN7. Mensaje único.** *Ejemplo*: el inicio ya no dice "Compras mayores a $499".

## 6. Criterios de aceptación (verificables sin código)

- **CA1.** Al entrar por primera vez aparece el aviso de ubicación; al cerrarlo, "Elige una tienda".
- **CA2.** Con 64000 en "Entrega en", la búsqueda muestra existencias de Monterrey.
- **CA3.** Al iniciar sesión, "Entrega en" muestra la predeterminada y el cliente está en la página principal.
- **CA4.** En 45138 la lista de "Mi tienda" tiene 5 sucursales ordenadas por distancia.
- **CA5.** Al elegir Colón, el encabezado y el detalle muestran Colón.
- **CA6.** "Hacer mi tienda" con una sucursal de otro estado no cambia "Entrega en".
- **CA7.** La franja dice el mensaje de RF1; al apagarla por configuración desaparece.

## 7. Casos límite

- **CL1.** ¿El C.P. no existe o no tiene sucursales? Se avisa y se conserva la ubicación anterior (H02).
- **CL2.** ¿Niega el permiso de ubicación? Se usa la ubicación inicial hasta que elija.
- **CL3.** ¿Registrado sin direcciones? "Entrega en" muestra el C.P. inicial con "Agregar dirección".
- **CL4.** ¿Cierra sesión? La entrega regresa al C.P. inicial.
- **CL5.** ¿Cambia de C.P. y su sucursal no está en la lista nueva? Se conserva hasta que elija otra.
- **CL6.** ¿La sucursal está cerrada? Se puede elegir; dice a qué hora abre.
- **CL7.** ¿Celular? El sitio en celular no tiene "Mi tienda" ni "Entrega en": falta decidir dónde van y cómo se
  ve el aviso de ubicación (decisiones pendientes de CEL-01).

## 8. Fuera de alcance

- Que la sucursal elegida decida de dónde salen los envíos (eso es H02).
- Notificaciones de la campana, "Mis listas" y "Mis vehículos" (sin cambios).
- Cambiar las condiciones de la promoción de envío gratis.
