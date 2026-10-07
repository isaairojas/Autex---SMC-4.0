import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { DemoProvider, useDemo } from '../state/DemoContext';
import { DatosUsuario } from '../screens/checkout/DatosUsuario';
import { MetodoEnvio } from '../screens/checkout/MetodoEnvio';
import { MetodoPago } from '../screens/checkout/MetodoPago';
import { Confirmacion } from '../screens/checkout/Confirmacion';
import { Gracias } from '../screens/checkout/Gracias';
import { Inicio } from '../screens/tienda/Inicio';
import { Home } from '../screens/sitio/Home';
import { CatalogoEspecialidades } from '../screens/sitio/CatalogoEspecialidades';
import { Marcas } from '../screens/sitio/Marcas';
import { Ofertas } from '../screens/sitio/Ofertas';
import { Sucursales } from '../screens/sitio/Sucursales';
import { ComoComprar } from '../screens/sitio/ComoComprar';
import { Configuracion } from '../screens/sitio/Configuracion';
import { CarritoPagina } from '../screens/tienda/CarritoPagina';
import { DetalleProducto } from '../screens/tienda/DetalleProducto';
import { GALERIA, slug } from './galeria';

/** Al cambiar de página se vuelve al inicio, como en una navegación normal del sitio. */
function ArribaAlNavegar() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

/**
 * Cada vez que se entra a la demo aparece el aviso de ubicación del navegador (simulado: "www.autex.com.mx quiere ·
 * Conocer tu ubicación"). Si el cliente lo permite, carga de página y "Mi tienda" es la más cercana; si lo cierra
 * con la X aparece el aviso de Autex "Elige una tienda"; con "No permitir nunca" solo se cierra. Mientras no elija otro C.P., la entrega queda
 * en el 45138 y la tienda es Tesistán (sin respaldo en Figma, decisiones del usuario 2026-10-06, D31).
 */
let ubicacionPedida = false; // StrictMode monta dos veces en desarrollo: se pide una sola vez
function PedirUbicacion() {
  const { usarMiUbicacion, setAvisoTienda } = useDemo();
  useEffect(() => {
    if (ubicacionPedida) return;
    ubicacionPedida = true;
    /* "No permitir nunca" solo cierra el aviso; cerrarlo con la X muestra "Elige una tienda". */
    usarMiUbicacion().then((r) => {
      if (r === 'cerrado') setAvisoTienda(true);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

/** Flujo real de la demo: empieza con el C.P. 45138 y el carrito vacío. */
function Demo() {
  return (
    <DemoProvider>
      <ArribaAlNavegar />
      <PedirUbicacion />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/busqueda" element={<Inicio />} />
        <Route path="/catalogo" element={<CatalogoEspecialidades />} />
        <Route path="/marcas" element={<Marcas />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/sucursales" element={<Sucursales />} />
        <Route path="/como-comprar" element={<ComoComprar />} />
        <Route path="/configuracion/:seccion?/:accion?" element={<Configuracion />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/carrito" element={<CarritoPagina />} />
        <Route path="/checkout/datos" element={<DatosUsuario />} />
        <Route path="/checkout/envio" element={<MetodoEnvio />} />
        <Route path="/checkout/pago" element={<MetodoPago />} />
        <Route path="/checkout/confirmacion" element={<Confirmacion />} />
        <Route path="/checkout/gracias" element={<Gracias />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </DemoProvider>
  );
}

/** Galería: cada frame de Figma con su estado fijo (textos literales de Figma). */
function FrameFigma() {
  const { nodo } = useParams();
  const e = GALERIA.find((g) => slug(g.nodeId) === nodo);
  if (!e) return <IndiceGaleria />;
  return (
    <DemoProvider key={e.nodeId} inicial={e.inicial}>
      {e.pantalla}
    </DemoProvider>
  );
}

function IndiceGaleria() {
  const flujos = [...new Set(GALERIA.map((g) => g.flujo))];
  return (
    <div style={{ padding: 40, background: 'var(--color-nativo-blanco)', minHeight: '100vh' }}>
      <h1 className="text-heading-3-strong">Galería Figma · Autex_2026_Frames</h1>
      <p className="text-os-body-1" style={{ margin: '8px 0 24px' }}>
        {GALERIA.length} frames. <Link to="/">Ir a la demo</Link>
      </p>
      {flujos.map((f) => (
        <section key={f} style={{ marginBottom: 24 }}>
          <h2 className="text-subheadline-medium">{f}</h2>
          <ul className="text-body-1-book">
            {GALERIA.filter((g) => g.flujo === f).map((g) => (
              <li key={g.nodeId}>
                <Link to={`/figma/${slug(g.nodeId)}`}>
                  {g.nodeId} — {g.nombre}
                </Link>
                {g.porConfirmar && ' (por confirmar)'}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/figma" element={<IndiceGaleria />} />
        <Route path="/figma/:nodo/*" element={<FrameFigma />} />
        <Route path="/*" element={<Demo />} />
      </Routes>
    </BrowserRouter>
  );
}
