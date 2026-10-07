/**
 * SIN RESPALDO EN FIGMA (la página Home 0:1 quedó fuera por decisión del usuario).
 * Réplica de la página de inicio de autex.com.mx (2026-10-05): buscador por vehículo, carrusel,
 * beneficios, especialidades, tarjetas azules y marcas destacadas. Imagen del carrusel: Hero banner
 * 12849:114234 (archivo anterior).
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../design-system/components/atoms/Icon';
import hero from '../../assets/images/hero-banner.png';
import { ESPECIALIDADES } from '../../mocks/sitio';
import { ANIOS, MARCAS_AUTO, MODELOS, MOTORES } from '../../mocks/vehiculos';
import { useDemo } from '../../state/DemoContext';
import { PageShell } from '../PageShell';
import { IMAGEN_ESPECIALIDAD } from './imagenes';
import { Mosaico, rutaBusqueda } from './Mosaico';
import styles from './Sitio.module.css';

const BENEFICIOS = [
  { icono: 'local_shipping', titulo: 'Envío gratis', detalle: 'Compras mayores a $499' },
  { icono: 'assignment_return', titulo: 'Devoluciones', detalle: '30 días en todos los productos' },
  { icono: 'verified_user', titulo: '90 días de garantía', detalle: 'en todos los productos' },
];
const DESTACADAS = ['DYNAMIC', 'ACOSA', 'JULS CARMAN', 'VERZE', 'WEISCHLER'];

export function Home() {
  const navigate = useNavigate();
  const { agregarVehiculo } = useDemo();
  const [vehiculo, setVehiculo] = useState({ anio: '', marca: '', modelo: '', motor: '' });
  const [slide, setSlide] = useState(0);
  const SLIDES = 3;

  return (
    <PageShell version2026 enlaceActivo="Inicio">
      <div className={styles.contenido}>
        <section className={styles.buscador}>
          <h1 className={`${styles.titulo} text-heading-3-medium`}>Encuentra los mejores productos para tu vehículo</h1>
          <div className={styles.vehiculo}>
            <select className={`${styles.select} text-body-1-book`} value={vehiculo.anio} onChange={(e) => setVehiculo({ ...vehiculo, anio: e.target.value })} aria-label="Año">
              <option value="">Año</option>
              {ANIOS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <select
              className={`${styles.select} text-body-1-book`}
              value={vehiculo.marca}
              onChange={(e) => setVehiculo({ ...vehiculo, marca: e.target.value, modelo: '' })}
              aria-label="Marca"
            >
              <option value="">Marca</option>
              {MARCAS_AUTO.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <select className={`${styles.select} text-body-1-book`} value={vehiculo.modelo} onChange={(e) => setVehiculo({ ...vehiculo, modelo: e.target.value })} aria-label="Modelo">
              <option value="">Modelo</option>
              {(MODELOS[vehiculo.marca] ?? []).map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <select className={`${styles.select} text-body-1-book`} value={vehiculo.motor} onChange={(e) => setVehiculo({ ...vehiculo, motor: e.target.value })} aria-label="Motor">
              <option value="">Motor (Opcional)</option>
              {(vehiculo.modelo ? MOTORES : []).map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <button
              type="button"
              className={styles.buscar}
              aria-label="Buscar por vehículo"
              onClick={() => {
                /* Como en autex.com.mx: con año, marca y modelo el vehículo se agrega a "Mis vehículos" y queda activo. */
                if (vehiculo.anio && vehiculo.marca && vehiculo.modelo) agregarVehiculo(vehiculo);
                navigate(rutaBusqueda(Object.fromEntries(Object.entries({ anio: vehiculo.anio, marca_auto: vehiculo.marca, modelo: vehiculo.modelo, motor: vehiculo.motor }).filter(([, v]) => v))));
              }}
            >
              <Icon name="search" size={24} color="var(--color-nativo-blanco)" />
            </button>
          </div>
          <div className={`${styles.enlaces} text-subheadline-book`}>
            <Link to="/catalogo">Buscar por producto</Link>
            <span className={styles.separador} />
            <Link to="/marcas">Buscar por marcas</Link>
          </div>
        </section>

        <section className={styles.carrusel} aria-label="Promociones">
          <img src={hero} alt="Promoción vigente" />
          <button type="button" className={styles.flecha} style={{ left: 16 }} aria-label="Anterior" onClick={() => setSlide((slide + SLIDES - 1) % SLIDES)}>
            <Icon name="chevron_left" color="var(--color-nativo-blanco)" />
          </button>
          <button type="button" className={styles.flecha} style={{ right: 16 }} aria-label="Siguiente" onClick={() => setSlide((slide + 1) % SLIDES)}>
            <Icon name="chevron_right" color="var(--color-nativo-blanco)" />
          </button>
          <div className={styles.puntos}>
            {Array.from({ length: SLIDES }, (_, i) => (
              <button key={i} type="button" className={i === slide ? `${styles.punto} ${styles.puntoOn}` : styles.punto} onClick={() => setSlide(i)} aria-label={`Promoción ${i + 1}`} />
            ))}
          </div>
        </section>

        <section className={styles.beneficios}>
          {BENEFICIOS.map((b) => (
            <div key={b.titulo} className={styles.beneficio}>
              <Icon name={b.icono} box={56} size={52} color="var(--color-primary-400)" />
              <div>
                <p className="text-body-1-medium">{b.titulo}</p>
                <p className={`${styles.beneficioDetalle} text-body-2-book`}>{b.detalle}</p>
              </div>
            </div>
          ))}
        </section>

        <section>
          <div className={styles.seccionHead}>
            <h2 className={`${styles.subtitulo} text-headline-medium`}>Explora por especialidad</h2>
            <Link to="/catalogo" className={`${styles.verTodas} text-body-1-book-link`}>
              Ver todas las especialidades...
            </Link>
          </div>
          <div style={{ marginTop: 32 }}>
            <Mosaico items={ESPECIALIDADES.map((e) => ({ nombre: e, imagen: IMAGEN_ESPECIALIDAD[e], to: rutaBusqueda({ especialidad: e }) }))} />
          </div>
        </section>

        <section className={styles.tarjetasAzules}>
          <div className={styles.tarjetaAzul}>
            <p className="text-subheadline-medium">¿Cómo comprar en Autex?</p>
            <Link to="/como-comprar" className={`${styles.botonBlanco} text-body-2-book`}>
              Cómo comprar
            </Link>
          </div>
          <div className={styles.tarjetaAzul}>
            <p className="text-subheadline-medium">¿Necesitas un crédito para hacer crecer tu taller?</p>
            <a
              href="https://resources.apymsa.com.mx/imagenes/ApymsaWeb2018/Solicitudes/Solicitud_de_Credito.pdf"
              target="_blank"
              rel="noreferrer"
              className={`${styles.botonBlanco} text-body-2-book`}
            >
              Solicitar crédito
            </a>
          </div>
          <div className={styles.tarjetaAzul}>
            <p className="text-subheadline-medium">Ver nuestra revista de promociones</p>
            <Link to="/ofertas" className={`${styles.botonBlanco} text-body-2-book`}>
              Ver revista →
            </Link>
          </div>
        </section>

        <section>
          <h2 className={`${styles.subtitulo} text-headline-medium`}>Marcas destacadas</h2>
          <div className={styles.marcasDestacadas} style={{ marginTop: 32 }}>
            {DESTACADAS.map((m) => (
              <Link key={m} to={rutaBusqueda({ marca: m })} className={`${styles.marcaChip} text-subheadline-medium`}>
                {m}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
