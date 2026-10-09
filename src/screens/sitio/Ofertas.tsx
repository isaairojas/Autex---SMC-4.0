/**
 * SIN RESPALDO EN FIGMA. Réplica de autex.com.mx/ofertas (2026-10-05). El sitio real no tenía ofertas
 * vigentes ese día y muestra "¡No se encontraron productos en oferta!". La demo muestra las tarjetas del
 * catálogo marcadas con descuento (simulado) y conserva el estado vacío cuando no hay ninguna.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/atoms/Button';
import { TarjetaProducto } from '../../design-system/components/organisms/TarjetaProducto';
import { AvisoNoDisponibles } from '../../design-system/components/molecules/NoDisponibles';
import { CargaPagina } from '../../design-system/components/molecules/CargaPagina';
import { CATALOGO } from '../../mocks/catalogo';
import { estadoExistencia, etiquetaExistencia, existenciaEnLinea, maximoVenta, piezasEnTiendas } from '../../mocks/existencias';
import { useDemo } from '../../state/DemoContext';
import { PageShell } from '../PageShell';
import styles from './Sitio.module.css';

/** Productos en oferta (simulado). */
const EN_OFERTA = ['ventilador', 'switch-luces', 'cuerpo-aceleracion'];

export function Ofertas() {
  const navigate = useNavigate();
  const { ubicacion, agregar, abrirUbicacion, carrito, validarExistencias } = useDemo();
  const [verNoDisponibles, setVerNoDisponibles] = useState(false);
  /* Carga de productos (D36). */
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    setCargando(true);
    const t = window.setTimeout(() => setCargando(false), 800);
    return () => window.clearTimeout(t);
  }, [verNoDisponibles]);
  const estado = (id: string) => estadoExistencia(id, ubicacion?.codigoPostal ?? null);
  const enOferta = CATALOGO.filter((p) => EN_OFERTA.includes(p.id));
  /* Los productos sin existencia en la zona se ocultan salvo que el cliente pida verlos (D34). */
  const ocultos = enOferta.filter((p) => estado(p.id) === 'sin-existencia').length;
  const productos = verNoDisponibles ? enOferta : enOferta.filter((p) => estado(p.id) !== 'sin-existencia');
  return (
    <PageShell version2026 enlaceActivo="Promociones">
      {cargando && <CargaPagina texto="Cargando productos…" />}
      <div className={styles.contenido} style={{ width: 1360 }}>
        {enOferta.length === 0 ? (
          <div className={styles.vacio}>
            <p className={`${styles.vacioTitulo} text-heading-1-book`}>¡No se encontraron productos en oferta!</p>
            <p className="text-subheadline-book">Da clic en el botón para encontrar los productos que necesitas.</p>
            <Button onClick={() => navigate('/catalogo')} width={250} style={{ justifyContent: 'center' }}>
              Ir al Catálogo
            </Button>
          </div>
        ) : (
          <>
            <h1 className={`${styles.titulo} text-heading-3-medium`}>Ofertas</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              {productos.map((p) => (
                <TarjetaProducto
                  key={p.id}
                  producto={p}
                  estado={estado(p.id)}
                  estadoPara={(n) => estadoExistencia(p.id, ubicacion?.codigoPostal ?? null, n + (carrito.find((l) => l.producto.id === p.id)?.cantidad ?? 0))}
                  piezas={piezasEnTiendas(p.id)}
                  etiquetaPiezas={etiquetaExistencia(existenciaEnLinea(p.id, ubicacion?.codigoPostal ?? null))}
                  maximo={maximoVenta(p.id, ubicacion?.codigoPostal ?? null) - (carrito.find((l) => l.producto.id === p.id)?.cantidad ?? 0)}
                  validar={validarExistencias}
                  onAgregar={(c) => (ubicacion ? agregar(p, c) : abrirUbicacion())}
                  onVer={() => navigate(`/producto/${p.id}`)}
                />
              ))}
            </div>
            <AvisoNoDisponibles ocultos={ocultos} mostrar={verNoDisponibles} onCambiar={setVerNoDisponibles} />
          </>
        )}
      </div>
    </PageShell>
  );
}
