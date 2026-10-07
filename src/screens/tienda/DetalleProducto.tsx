/**
 * Figma: Producto - Detalle - Expecificaciones del producto (12849:113500) — página "Locofy (Prueba)"
 * Head 12849:113502 · Section 12849:113507 · Comprados juntos 12849:113532 ·
 * Tabs - Especificaciones 12849:113561 · Sustitutos 12849:113606 · Relacionados 12849:113622
 * Última sincronización: 2026-10-02
 */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../../design-system/components/atoms/Icon';
import { Breadcrumbs } from '../../design-system/components/molecules/Breadcrumbs';
import { Tabs } from '../../design-system/components/molecules/Tabs';
import { BuscadorVehiculo } from '../../design-system/components/organisms/BuscadorVehiculo';
import { BuscarOtraTienda } from '../../design-system/components/organisms/UbicacionTienda';
import { ALCANCE_MAXIMO_KM } from '../../mocks/tiendas';
import removeIcon from '../../assets/icons/remove.svg';
import addIcon from '../../assets/icons/add.svg';
import playIcon from '../../assets/icons/video-play.svg';
import bullet from '../../assets/icons/bullet.svg';
import fondo from '../../assets/images/detalle-fondo.png';
import bujia from '../../assets/images/detalle-bujia.png';
import bujia2 from '../../assets/images/detalle-bujia-2.png';
import marca from '../../assets/images/detalle-marca.png';
import jBujia from '../../assets/images/juntos-bujia.png';
import jLiqui from '../../assets/images/juntos-liqui-moly.png';
import jAceite from '../../assets/images/juntos-aceite.png';
import s1 from '../../assets/images/sust-1.png';
import s2 from '../../assets/images/sust-2.png';
import s3 from '../../assets/images/sust-3.png';
import s4 from '../../assets/images/sust-4.png';
import s5 from '../../assets/images/sust-5.png';
import s6 from '../../assets/images/sust-6.png';
import s7 from '../../assets/images/sust-7.png';
import r1 from '../../assets/images/rel-1.png';
import r2 from '../../assets/images/rel-2.png';
import r3 from '../../assets/images/rel-3.png';
import r4 from '../../assets/images/rel-4.png';
import { CATALOGO_SITIO } from '../../mocks/catalogo';
import { formatoMXN } from '../../mocks/productos';
import { esSoloLocal, estadoExistencia, etiquetaExistencia, existenciaEnLinea, existenciaEnTienda, maximoVenta, origenBajoPedido } from '../../mocks/existencias';
import { LEYENDA_FORANEA } from '../../design-system/components/organisms/EntregaCarrito';
import { useDemo } from '../../state/DemoContext';
import { PageShell } from '../PageShell';
import styles from './DetalleProducto.module.css';

const MINIATURAS: string[][] = [[fondo, bujia], [fondo], [fondo, bujia2], [fondo]];

const SUSTITUTOS = [
  { capas: [s1], precio: ['320', '00'] },
  { capas: [s2], precio: ['55', '46'] },
  { capas: [s3], precio: ['700', '00'] },
  { capas: [s4, s5], precio: ['164', '00'] },
  { capas: [s6, s7], precio: ['108', '22'] },
  { capas: [s7, s2], precio: ['99', '99'] },
].map((p) => ({ ...p, nombre: 'Bujía resistiva W22MPR-U motosierra DENSO 22MPR-U' }));

const RELACIONADOS = [
  { capas: [r1], precio: ['99', '00'], nombre: 'Bujía resistiva W22MPR-U motosierra DENSO 22MPR-U' },
  { capas: [r2], precio: ['73', '46'], nombre: 'Filtro gasolina Audi SAAB VW, BOSCH 0 986 MF2 086' },
  { capas: [r1], precio: ['75', '00'], nombre: 'Filtro gasolina Audi SAAB VW, BOSCH 0 986 MF2 086' },
  { capas: [r3, r4], precio: ['80', '00'], nombre: 'Filtro gasolina Audi SAAB VW, BOSCH 0 986 MF2 086' },
  { capas: [r3], precio: ['108', '22'], nombre: 'Filtro gasolina Audi SAAB VW, BOSCH 0 986 MF2 086' },
  { capas: [r4], precio: ['89', '99'], nombre: 'Filtro gasolina Audi SAAB VW, BOSCH 0 986 MF2 086' },
];

const JUNTOS = [
  { nombre: 'Bujía resistiva X5DC BMW 750CC 85-96 CAGIVA 350CC 450CC 94-96 BOSCH 0 242 145 500', precio: '$132.30' },
  { nombre: 'Liqui Moly 2657 - Motor Limpieza, Engine Flush Plus, 300 ml', precio: '$233.40' },
  { nombre: 'Castrol 1597B1 Edge Extended Performance 5W-30 Aceite de Motor sintético Completo, 5...', precio: '$890.00' },
];

const ESPECIFICACIONES = [
  ['13.5 Centimetros', '200 L/H', '55 PSI (Libras)', '22 Centimetros'],
  ['0.586 KOhms', '19 Centimetros', '0.414 K Ohms'],
];

export function DetalleProducto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { agregar, ubicacion, abrirUbicacion, disponibilidad, modoFigma, tienda, tiendas, abrirPanel, carrito, setTienda, conCarga } = useDemo();
  /* D43: barra lateral "Buscar en otras tiendas". */
  const [otrasTiendas, setOtrasTiendas] = useState(false);
  const producto = CATALOGO_SITIO.find((p) => p.id === id) ?? CATALOGO_SITIO[0];
  const [entero, centavos] = (producto.precio * cantidadInicial(modoFigma)).toFixed(2).split('.');
  const [cantidad, setCantidad] = useState(modoFigma ? 16 : 1);
  const [mini, setMini] = useState(0);
  const [tab, setTab] = useState(0);
  const disp = disponibilidad(producto.id);
  /* Sitio (D39): no se agregan más piezas de las disponibles para compra en línea (menos las del carrito). */
  const enCarrito = carrito.find((l) => l.producto.id === producto.id)?.cantidad ?? 0;
  const maximo = modoFigma ? Infinity : Math.max(0, maximoVenta(producto.id, ubicacion?.codigoPostal ?? null) - enCarrito);
  const tope = !modoFigma && cantidad >= maximo;
  /* D44: con la cantidad elegida (más lo del carrito), si la mayoría sale de sucursales foráneas es bajo pedido. */
  const cp = ubicacion?.codigoPostal ?? null;
  const piezasPedido = Math.max(1, Math.min(cantidad + enCarrito, maximoVenta(producto.id, cp)));
  const estadoPedido = modoFigma ? disp.estado : estadoExistencia(producto.id, cp, piezasPedido);
  const foranea = !modoFigma && origenBajoPedido(producto.id, cp, piezasPedido) === 'foranea';
  const aviso = modoFigma || !(tope || maximo <= 0)
    ? null
    : maximo <= 0
      ? 'Ya tienes en tu carrito todas las piezas disponibles para compra en línea.'
      : `Solo hay ${maximo} ${maximo === 1 ? 'pieza disponible' : 'piezas disponibles'} para compra en línea.`;

  const onAgregar = () => {
    if (!ubicacion) {
      abrirUbicacion();
      return;
    }
    agregar(producto, Math.min(cantidad, maximo));
    if (!modoFigma) setCantidad(1);
  };

  return (
    /* Sitio: cabecera 2026 con "Mi tienda" y "Entrega en" (la galería conserva el Navbar clásico del detalle). */
    <PageShell version2026={!modoFigma} enlaceActivo={null}>
      <BuscadorVehiculo variante="detalle" />
      <Breadcrumbs
        items={modoFigma ? ['Especialidades', 'Automotriz', 'Actual section', '2020'] : ['Especialidades', producto.especialidad ?? 'Automotriz', producto.categoria ?? producto.nombre]}
        onBack={() => navigate(-1)}
      />

      {/* Section 12849:113507 — 528 de alto */}
      <section className={styles.section}>
        <div className={styles.gallery}>
          <div className={styles.thumbs}>
            {/* Sitio (D38): una miniatura con la imagen del producto; la galería conserva las 4 de Figma. */}
            {(modoFigma ? MINIATURAS : [[producto.imagenTarjeta]]).map((capas, i) => (
              <button key={i} type="button" className={`${styles.thumb} ${mini === i ? styles.thumbOn : ''}`} onClick={() => setMini(i)}>
                <span className={styles.thumbImg}>
                  {capas.map((c, j) => (
                    <img key={j} src={c} alt="" />
                  ))}
                </span>
                {i === 3 && (
                  <>
                    <span className={styles.overlay} />
                    <img src={playIcon} alt="" className={styles.play} width={40} height={40} />
                  </>
                )}
              </button>
            ))}
          </div>
          <div className={styles.viewer}>
            <span className={`${styles.arrow} ${styles.left}`}>
              <span className={styles.arrowBtn}>
                <Icon name="chevron_left" box={19.2} size={10.08} />
              </span>
            </span>
            <span className={`${styles.arrow} ${styles.right}`}>
              <span className={styles.arrowBtn}>
                <Icon name="navigate_next" box={19.2} size={10.08} />
              </span>
            </span>
            <img
              src={modoFigma ? bujia : producto.imagenTarjeta}
              alt={producto.nombre}
              className={modoFigma ? styles.main : `${styles.main} ${styles.mainSitio} ${producto.imagenPendiente ? styles.pendiente : ''}`}
            />
            <div className={styles.indicators}>
              {modoFigma ? (
                <span className={styles.oferta}>
                  <span className={`${styles.descuento} text-caption-book`}>-30%</span>
                  <span className={`${styles.ofertaTxt} text-body-1-medium`}>Oferta</span>
                </span>
              ) : (
                <span />
              )}
              <Icon name="zoom_in" />
            </div>
          </div>
        </div>

        <div className={styles.desc}>
          <div className={styles.mainDesc}>
            <div className={styles.sku}>
              <span>{modoFigma ? 'SKU #1103113' : producto.skuVisible}</span>
              <span>{modoFigma ? 'No. Original AI3922' : producto.noOriginal}</span>
            </div>
            <p className={styles.nombre}>{producto.nombre}</p>
          </div>
          {modoFigma ? (
            <div className={styles.pricing}>
              <span className={styles.precioOferta}>$132.30</span>
              <span className={styles.precioAntes}>$189.00</span>
            </div>
          ) : (
            /* Sitio (D38): precio del producto, sin oferta simulada */
            <div className={styles.pricing}>
              <span className={styles.precioOferta}>{formatoMXN(producto.precio)}</span>
            </div>
          )}
          <div className={styles.disp}>
            {!modoFigma && estadoPedido === 'bajo-pedido' ? (
              <Icon name="schedule" box={32} size={28} color="var(--color-naranja-bajo-pedido)" />
            ) : (
              <Icon name={disp.ok ? 'check_circle' : 'cancel'} box={32} size={28} color={disp.ok ? 'var(--color-green-700)' : 'var(--color-secondary-500)'} />
            )}
            <span className={styles.dispTxt}>{modoFigma || estadoPedido !== 'bajo-pedido' ? disp.texto : 'Disponible bajo pedido'}</span>
          </div>
          {!modoFigma && estadoPedido === 'bajo-pedido' && (
            <p className={`${styles.dispBajo} text-body-1-book`}>
              Entrega estimada de 2 a 4 días hábiles.{foranea && ` ${LEYENDA_FORANEA}`}
            </p>
          )}
        </div>
        <div className={styles.divider} />
        {/* Logo de Figma solo para Autolite; en el sitio, el nombre de la marca para las demás. */}
        {modoFigma || producto.marca === 'Autolite' ? (
          <img src={marca} alt="Autolite" className={styles.marca} />
        ) : (
          producto.marca && <p className={`${styles.marca} ${styles.marcaTexto} text-heading-3-medium`}>{producto.marca}</p>
        )}

        <div className={styles.side}>
          <div className={aviso ? `${styles.cost} ${styles.costAviso}` : styles.cost}>
            <p className={`${styles.enOferta} text-body-2-medium`}>{modoFigma ? 'Producto en oferta' : 'Precio'}</p>
            <div className={styles.precio}>
              <div className={styles.cost2}>
                <span className={styles.small}>$</span>
                <span className={styles.big}>{modoFigma ? '2,116' : Number(entero).toLocaleString('en-US')}</span>
                <span className={styles.small}>{modoFigma ? '80' : centavos}</span>
              </div>
              {modoFigma && <span className={styles.descTxt}>30% de descuento</span>}
            </div>
            <div className={styles.addToCart}>
              <div className={styles.qty}>
                <button type="button" className={styles.qtyBtn} onClick={() => setCantidad(Math.max(1, cantidad - 1))} aria-label="Quitar uno">
                  <img src={removeIcon} alt="" width={16} height={16} />
                </button>
                <span className={styles.qtyValue}>{cantidad}</span>
                <button type="button" className={`${styles.qtyBtn} ${styles.qtyRight}`} onClick={() => setCantidad(cantidad + 1)} aria-label="Agregar uno" disabled={tope}>
                  <img src={addIcon} alt="" width={16} height={16} />
                </button>
              </div>
              <button type="button" className={`${styles.anadir} text-body-1-book`} disabled={!disp.ok || maximo <= 0} onClick={onAgregar}>
                Añadir al carrito
              </button>
              {aviso && <p className={`${styles.avisoTope} text-body-2-book`}>{aviso}</p>}
            </div>
          </div>
          <div className={styles.lista}>
            <span className="text-body-1-book">Agregar a mi lista</span>
            <Icon name="expand_more" box={16} size={20} />
          </div>
          <div className={styles.politica}>
            <p>Política de  garantía y devoluciones:</p>
            <p>Todos nuestros productos cuentan con 90 días de garantía y 30 días para aplicar una devolución.</p>
          </div>
        </div>
      </section>

      {!modoFigma && (
        <Disponibilidad
          enLinea={existenciaEnLinea(producto.id, ubicacion?.codigoPostal ?? null)}
          soloLocal={esSoloLocal(producto.id)}
          enTienda={tienda ? existenciaEnTienda(producto.id, tienda.id) : 0}
          tienda={tienda ? `${tienda.nombre}, ${tienda.estado}` : null}
          onOtraTienda={() => setOtrasTiendas(true)}
        />
      )}
      {!modoFigma && otrasTiendas && (
        <BuscarOtraTienda
          /* Tiendas que alcanzan la entrega (Foráneo, 350 km) con piezas del producto; "Mi tienda" siempre aparece. */
          tiendas={tiendas
            .filter((t) => t.km <= ALCANCE_MAXIMO_KM || t.id === tienda?.id)
            .map((t) => ({ ...t, piezas: existenciaEnTienda(producto.id, t.id) }))
            .filter((t) => t.piezas > 0 || t.id === tienda?.id)}
          actual={tienda}
          codigoPostal={ubicacion?.codigoPostal ?? null}
          producto={producto.nombre}
          onSeleccionar={(id) => {
            setOtrasTiendas(false);
            conCarga('Cambiando tu tienda', 'Consultamos las existencias de la sucursal…', () => setTienda(id));
          }}
          onCambiarDireccion={() => {
            setOtrasTiendas(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            abrirPanel('entrega');
          }}
          onClose={() => setOtrasTiendas(false)}
        />
      )}

      {/* Comprados juntos 12849:113532 */}
      <section className={styles.juntos}>
        <p className={`${styles.juntosTitle} text-heading-3-medium`}>Comprados juntos habitualmente</p>
        <div className={styles.juntosMain}>
          <div className={styles.photos}>
            {[jBujia, jLiqui, jAceite].map((src, i) => (
              <span key={i} className={styles.photoWrap}>
                {i > 0 && <Icon name="add" />}
                <span className={styles.photo}>
                  <img src={src} alt="" style={{ objectFit: i === 0 ? 'contain' : 'cover' }} />
                </span>
              </span>
            ))}
          </div>
          <div className={styles.juntosAction}>
            <p className={`${styles.total} text-heading-3-medium`}>
              Precio total: <span className={styles.totalMonto}>$1,255.70</span>
            </p>
            <button type="button" className={`${styles.anadir} text-body-1-book`}>
              Añadir productos al carrito
            </button>
          </div>
        </div>
        <div className={styles.checks}>
          {JUNTOS.map((j) => (
            <div key={j.nombre} className={styles.check}>
              <span className={styles.checkLabel}>
                <span className={styles.checkbox}>
                  <Icon name="check" box={24} size={20} color="var(--color-nativo-blanco)" />
                </span>
                <span className="text-body-1-book">{j.nombre}</span>
              </span>
              <span className={`${styles.checkPrecio} text-os-subheadline`}>{j.precio}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs - Especificaciones 12849:113561 */}
      <section className={styles.especificaciones}>
        <div className={styles.tabsMenu}>
          <Tabs tabs={['Especificaciones del producto', 'Aplicaciones', 'Garantías y devoluciones']} activa={tab} onChange={setTab} />
        </div>
        <div className={styles.bullets}>
          {ESPECIFICACIONES.map((col, i) => (
            <div key={i} className={styles.bulletCol}>
              {col.map((b) => (
                <div key={b} className={styles.bullet}>
                  <img src={bullet} alt="" width={20} height={20} />
                  <span className="text-os-body-1">{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Otros productos 12849:113604 */}
      <div className={styles.otros}>
        <Carrusel titulo="Productos sustitutos" items={SUSTITUTOS} />
        <Carrusel titulo="Productos relacionados" items={RELACIONADOS} />
      </div>
    </PageShell>
  );
}

function Carrusel({ titulo, items }: { titulo: string; items: { capas: string[]; precio: string[]; nombre: string }[] }) {
  return (
    <section className={styles.carrusel}>
      <p className={`${styles.carruselTitle} text-heading-1-book`}>{titulo}</p>
      <div className={styles.carruselRow}>
        <span className={styles.navBtn}>
          <Icon name="arrow_back_ios" box={32} size={28} />
        </span>
        <div className={styles.carruselItems}>
          {items.map((p, i) => (
            <div key={i} className={styles.promo}>
              <span className={styles.promoImg}>
                <span>
                  {p.capas.map((c, j) => (
                    <img key={j} src={c} alt="" />
                  ))}
                </span>
              </span>
              <div className={styles.promoContent}>
                <div className={styles.cost2}>
                  <span className={styles.small12}>$</span>
                  <span className={styles.big24}>{p.precio[0]}</span>
                  <span className={styles.small12}>{p.precio[1]}</span>
                </div>
                <p className="text-caption-book">{p.nombre}</p>
              </div>
            </div>
          ))}
        </div>
        <span className={styles.navBtn}>
          <Icon name="arrow_forward_ios" box={32} size={28} />
        </span>
      </div>
    </section>
  );
}

/** Cantidad inicial del detalle: Figma muestra 16. */
function cantidadInicial(modoFigma: boolean) {
  return modoFigma ? 16 : 1;
}

/**
 * SIN RESPALDO EN FIGMA (D34). "Disponibilidad" del ejemplo del usuario: piezas para compra en línea (por rangos)
 * y piezas físicas en "Mi tienda", con "Buscar en otra tienda". Sin pasillo ni bahía.
 */
function Disponibilidad({ enLinea, enTienda, tienda, soloLocal, onOtraTienda }: { enLinea: number; enTienda: number; tienda: string | null; soloLocal: boolean; onOtraTienda: () => void }) {
  return (
    <section className={styles.disponibilidad} aria-label="Disponibilidad">
      <p className="text-subheadline-medium">Disponibilidad</p>
      <div className={styles.dispColumnas}>
        <div className={styles.dispColumna}>
          <p className={`${styles.dispFila} text-body-1-medium`}>
            <Icon name="devices" color="var(--color-neutral-700)" />
            {enLinea > 0 ? (
              <span>
                <span className={styles.dispVerde}>{etiquetaExistencia(enLinea)}</span> disponibles para compra en línea
              </span>
            ) : (
              <span>Sin existencia para compra en línea</span>
            )}
          </p>
          <p className={`${styles.dispGris} text-body-1-book`}>
            {soloLocal
              ? 'Las baterías se surten solo de sucursales locales o locales extendidas de tu zona (hasta 30 km).'
              : 'Te mostraremos los detalles de entrega antes de finalizar tu compra'}
          </p>
        </div>
        <div className={styles.dispColumna}>
          <p className={`${styles.dispFila} text-body-1-medium`}>
            <Icon name="store" color="var(--color-neutral-700)" />
            {tienda ? (
              <span>
                <span className={enTienda > 0 ? styles.dispVerde : styles.dispRojo}>{enTienda}</span> físicamente en {tienda}
              </span>
            ) : (
              <span>Elige tu tienda para ver sus existencias</span>
            )}
          </p>
          <button type="button" className={`${styles.dispEnlace} text-body-1-book`} onClick={onOtraTienda}>
            Buscar en otra tienda
          </button>
        </div>
      </div>
    </section>
  );
}
