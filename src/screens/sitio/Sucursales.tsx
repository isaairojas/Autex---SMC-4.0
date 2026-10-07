/**
 * SIN RESPALDO EN FIGMA. Réplica de autex.com.mx/sucursales (2026-10-05): buscador por estado, ciudad o C.P.,
 * lista de sucursales (horario, nivel de envío, teléfono, "Cómo llegar") y mapa.
 * Distancia en km desde la entrega (C.P. 45138 si no se eligió otro), nivel de servicio (configuracion-servicios-smc.json),
 * "Mi tienda" y, como en el sitio con sesión iniciada (captura del usuario 2026-10-05), distancia a cada
 * sucursal, tarjeta seleccionada con borde y mapa acercado a la zona del cliente.
 * El sitio usa Google Maps; la demo no carga librerías externas, así que el mapa es un esquema con un pin por
 * sucursal (centro aproximado de su ciudad) y "Cómo llegar" abre Google Maps en otra pestaña.
 */
import { useState } from 'react';
import { Icon } from '../../design-system/components/atoms/Icon';
import { coordenadas, estadoHorario, textoEntrega, type TiendaCercana } from '../../mocks/tiendas';
import { useDemo } from '../../state/DemoContext';
import { PageShell } from '../PageShell';
import styles from './Sitio.module.css';

type Limites = { latMin: number; latMax: number; lonMin: number; lonMax: number };
const MEXICO: Limites = { latMin: 14, latMax: 33, lonMin: -118, lonMax: -86 };

const pos = ([lat, lon]: [number, number], l: Limites) => ({
  left: `${((lon - l.lonMin) / (l.lonMax - l.lonMin)) * 100}%`,
  top: `${((l.latMax - lat) / (l.latMax - l.latMin)) * 100}%`,
});
const dentro = ([lat, lon]: [number, number], l: Limites) => lat >= l.latMin && lat <= l.latMax && lon >= l.lonMin && lon <= l.lonMax;
const km = (n: number) => `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km`;
const mapa = (s: TiendaCercana) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.cp ? `Autex ${s.direccion}` : `${s.lat},${s.lon}`)}`;

export function Sucursales() {
  const { ubicacion, tiendas, tienda, elegirTienda } = useDemo();
  const entrega = ubicacion && coordenadas(ubicacion);
  const origen: [number, number] | null = entrega ? [entrega.lat, entrega.lon] : null;
  const [q, setQ] = useState('');
  const [activa, setActiva] = useState<string | null>(tienda?.id ?? null);
  const [cerca, setCerca] = useState(true);
  const f = q.trim().toLowerCase();
  /* Ordenadas por distancia a la entrega (C.P. 45138 si el cliente no eligió otro). */
  const lista = tiendas
    .map((s) => ({ s, c: [s.lat, s.lon] as [number, number], d: s.km }))
    .filter(({ s }) => !f || [s.nombre, s.ciudad, s.estado, s.cp ?? '', s.direccion].some((v) => v.toLowerCase().includes(f)));
  const sel = lista.find((x) => x.s.id === activa) ?? lista[0];
  /* Mapa acercado a la zona de entrega (±0.35° de latitud), o a la tienda elegida si no hay entrega. */
  const centro = cerca ? origen ?? sel?.c ?? null : null;
  const limites: Limites = centro ? { latMin: centro[0] - 0.35, latMax: centro[0] + 0.35, lonMin: centro[1] - 0.45, lonMax: centro[1] + 0.45 } : MEXICO;

  return (
    <PageShell version2026 enlaceActivo={null}>
      <div className={styles.contenido} style={{ width: 1360 }}>
        <div className={styles.sucursales}>
          <div className={styles.listaSuc}>
            <h1 className={`${styles.titulo} text-subheadline-medium`}>Localiza tu tienda Autex más cercana</h1>
            <p className={`${styles.gris} text-body-2-book`} style={{ margin: 0 }}>
              Busca por Estado, Ciudad, Código postal
            </p>
            <label className={styles.campo}>
              <input className="text-body-1-book" placeholder="Buscar por Estado, Ciudad, CP" value={q} onChange={(e) => setQ(e.target.value)} />
              <Icon name="search" />
            </label>
            <p className={`${styles.gris} text-caption-book`} style={{ margin: 0 }}>
              {lista.length} sucursales{ubicacion ? ` · distancias desde tu entrega en C.P. ${ubicacion.codigoPostal}` : ''}
            </p>
            <div className={styles.scrollSuc}>
              {lista.map(({ s, d }) => (
                <div key={s.id} className={sel?.s.id === s.id ? `${styles.suc} ${styles.sucActiva}` : styles.suc} onClick={() => setActiva(s.id)}>
                  <div className={styles.sucCabecera}>
                    <p className="text-subheadline-book" style={{ margin: 0 }}>
                      {s.nombre}
                    </p>
                    <span className={`${styles.gris} text-subheadline-book`}>{km(d)}</span>
                  </div>
                  {tienda?.id === s.id && <span className={`${styles.verde} text-body-2-medium`}>Mi tienda</span>}
                  <span className={`${styles.sucFila} text-body-2-book`}>
                    <Icon name="location_on" color="var(--color-primary-500)" />
                    {s.direccion}
                  </span>
                  {s.horario && (
                    <span className={`${styles.sucFila} text-body-2-book`}>
                      <Icon name="schedule" color="var(--color-primary-500)" />
                      <span className={styles.verde}>{estadoHorario(s.horario).abierto ? 'Abierto ahora:' : 'Horario:'}</span> {s.horario}
                    </span>
                  )}
                  <span className={`${styles.sucFila} text-body-2-book`}>
                    <Icon name="local_shipping" color="var(--color-primary-500)" />
                    {s.servicio
                      ? `Envío ${s.servicio.nivel} · ${textoEntrega(s.servicio, new Date(), true)}`
                      : 'Fuera del alcance de envío · Pickup disponible'}
                  </span>
                  {s.telefono && (
                    <span className={`${styles.sucFila} text-body-2-book`}>
                      <Icon name="call" color="var(--color-primary-500)" />
                      <a className={styles.link} href={`tel:${s.telefono}`}>
                        {s.telefono}
                      </a>
                    </span>
                  )}
                  <span className={styles.sucCabecera}>
                    <a className={`${styles.link} text-body-2-book`} href={mapa(s)} target="_blank" rel="noreferrer">
                      Como llegar
                    </a>
                    {tienda?.id !== s.id && (
                      <button type="button" className={`${styles.botonTexto} text-body-2-book`} onClick={() => elegirTienda(s.id)}>
                        Hacer mi tienda
                      </button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.mapa} aria-label="Mapa esquemático de sucursales">
            {lista
              .filter(({ c }) => dentro(c, limites))
              .map(({ s, c }) => {
                const marcado = s.id === sel?.s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={styles.pin}
                    style={{ ...pos(c, limites), zIndex: marcado ? 2 : 1 }}
                    onClick={() => setActiva(s.id)}
                    title={s.nombre}
                  >
                    <Icon name="location_on" box={marcado ? 44 : 32} size={marcado ? 44 : 32} color={marcado ? 'var(--color-secondary-500)' : 'var(--color-primary-500)'} />
                  </button>
                );
              })}
            {origen && dentro(origen, limites) && (
              <span className={styles.pin} style={{ ...pos(origen, limites), transform: 'translate(-50%, -50%)' }} title="Tu ubicación">
                <Icon name="my_location" box={28} size={24} color="var(--color-green-700)" />
              </span>
            )}
            <button type="button" className={`${styles.mapaBoton} text-body-2-book`} onClick={() => setCerca(!cerca)}>
              {cerca ? 'Ver todo México' : 'Acercar a mi zona'}
            </button>
            <span className={`${styles.mapaNota} text-caption-book`}>Mapa esquemático (sin Google Maps): un pin por sucursal en el centro aproximado de su ciudad.</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
