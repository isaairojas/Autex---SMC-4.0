/**
 * SIN RESPALDO EN FIGMA (D33). Réplica de autex.com.mx/configuracion (cliente registrado, captura 2026-10-06):
 * menú "Mi perfil" (Mi perfil, Dirección de envío, Método de pago), lista de direcciones con estado vacío
 * "Por el momento no hay direcciones registradas" y formulario "Nueva dirección" (colonia por C.P.; ciudad y estado
 * automáticos; "Utilizar esta dirección como predeterminada"). Sin sesión pide iniciarla.
 */
import { useState, type ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../design-system/components/atoms/Button';
import { Icon } from '../../design-system/components/atoms/Icon';
import { TARJETAS_REGISTRADAS } from '../../design-system/components/organisms/PagoRegistrado';
import { lineaDireccion, type DireccionEntrega } from '../../mocks/clientes';
import { coloniasDe } from '../../mocks/colonias';
import { resolverCP } from '../../mocks/tiendas';
import { useDemo } from '../../state/DemoContext';
import { PageShell } from '../PageShell';
import styles from './Configuracion.module.css';

const MENU = [
  { id: 'perfil', texto: 'Mi perfil', icono: 'person' },
  { id: 'direcciones', texto: 'Dirección de envío', icono: 'store' },
  { id: 'pago', texto: 'Método de pago', icono: 'credit_card' },
] as const;

/** Tarjeta con la franja azul y el corte rojo del sitio. */
function Tarjeta({ titulo, children, ancho }: { titulo: string; children: ReactNode; ancho?: number }) {
  return (
    <section className={styles.tarjeta} style={ancho ? { width: ancho, flex: '0 0 auto' } : undefined}>
      <div className={styles.franja}>
        <span className={styles.corte} />
        <h2 className="text-subheadline-book">{titulo}</h2>
      </div>
      <div className={styles.cuerpo}>{children}</div>
    </section>
  );
}

export function Configuracion() {
  const { seccion = 'direcciones', accion } = useParams();
  const navigate = useNavigate();
  const demo = useDemo();
  const registrado = demo.cliente.tipo !== 'invitado';
  /* Alta desde el checkout: al guardar (o cancelar) regresa al pago y la nueva dirección queda como entrega. */
  const volver = (useLocation().state as { volver?: string } | null)?.volver;
  const nueva = seccion === 'direcciones' && accion === 'nueva';
  const titulo = nueva ? 'Nueva dirección' : seccion === 'perfil' ? 'Mi perfil' : seccion === 'pago' ? 'Método de pago' : seccion === 'pedidos' ? 'Mis pedidos' : 'Dirección de envío';

  return (
    <PageShell version2026 enlaceActivo={null}>
      <div className={styles.pagina}>
        <Tarjeta titulo="" ancho={300}>
          <p className={`${styles.menuTitulo} text-subheadline-medium`}>Mi perfil</p>
          <nav className={styles.menu}>
            {MENU.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`${styles.menuItem} ${seccion === m.id ? styles.menuActivo : ''} text-subheadline-book`}
                onClick={() => navigate(`/configuracion/${m.id}`)}
              >
                <Icon name={m.icono} />
                <span>{m.texto}</span>
                <Icon name="chevron_right" />
              </button>
            ))}
          </nav>
        </Tarjeta>
        <Tarjeta titulo={titulo}>
          {!registrado ? (
            <Vacio icono="lock" titulo="Inicia sesión para administrar tu cuenta" texto="Tus direcciones, métodos de pago y pedidos están en tu cuenta Autex.">
              <Button onClick={() => demo.abrirLogin()}>Iniciar sesión</Button>
            </Vacio>
          ) : nueva ? (
            <FormularioDireccion
              onCancelar={() => navigate(volver ?? '/configuracion/direcciones')}
              onGuardar={(d, pred) =>
                demo.conCarga('Guardando tu dirección', pred || volver ? 'Actualizamos tu dirección de entrega y las tiendas de tu zona…' : 'Un momento…', () => {
                  demo.agregarDireccion(d, pred, !!volver);
                  navigate(volver ?? '/configuracion/direcciones');
                })
              }
            />
          ) : seccion === 'perfil' ? (
            <div className={styles.datos}>
              {[
                ['Nombre', demo.cliente.nombre],
                ['Correo electrónico', demo.cliente.correo],
                ['Teléfono', demo.cliente.telefono],
                ['Empresa', demo.cliente.empresa],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className={`${styles.gris} text-body-2-book`}>{k}</p>
                  <p className="text-subheadline-book">{v}</p>
                </div>
              ))}
            </div>
          ) : seccion === 'pago' ? (
            <div className={styles.lista}>
              {TARJETAS_REGISTRADAS.map((t) => (
                <div key={t.id} className={styles.item}>
                  <Icon name="credit_card" color="var(--color-primary-500)" />
                  <p className="text-subheadline-book">{t.texto}</p>
                </div>
              ))}
            </div>
          ) : seccion === 'pedidos' ? (
            <MisPedidos onCatalogo={() => navigate('/busqueda')} />
          ) : (
            <ListaDirecciones onNueva={() => navigate('/configuracion/direcciones/nueva')} />
          )}
        </Tarjeta>
      </div>
    </PageShell>
  );
}

function Vacio({ icono, titulo, texto, children }: { icono: string; titulo: string; texto: string; children?: ReactNode }) {
  return (
    <div className={styles.vacio}>
      <Icon name={icono} box={80} size={72} color="var(--color-neutral-300)" />
      <p className="text-headline-book">{titulo}</p>
      <p className={`${styles.gris} text-subheadline-book`}>{texto}</p>
      {children}
    </div>
  );
}

/** "Mis pedidos" (D42): los pedidos pagados en la demo con la cuenta; sin pedidos, el estado vacío. */
function MisPedidos({ onCatalogo }: { onCatalogo: () => void }) {
  const pedidos = useDemo().pedidos.filter((p) => p.registrado);
  if (!pedidos.length)
    return (
      <Vacio icono="receipt_long" titulo="Por el momento no tienes pedidos" texto="Cuando compres en Autex verás aquí tus pedidos.">
        <Button onClick={onCatalogo}>Ir al catálogo</Button>
      </Vacio>
    );
  return (
    <div className={styles.lista}>
      <div className={styles.listaCabecera}>
        <p className="text-subheadline-medium">Mis pedidos ({pedidos.length})</p>
      </div>
      {pedidos.map((p) => (
        <div key={p.numero} className={styles.item}>
          <Icon name="receipt_long" color="var(--color-primary-500)" />
          <div className={styles.itemTexto}>
            <p className="text-subheadline-medium">
              Pedido {p.numero}
              <span className={`${styles.etiqueta} text-caption-book`}>{p.enTienda ? 'Pago pendiente en tienda' : 'En preparación'}</span>
            </p>
            <p className={`${styles.gris} text-body-2-book`}>
              {p.fecha} · {p.piezas} {p.piezas === 1 ? 'pieza' : 'piezas'} · Total {p.total}
            </p>
            {p.articulos.map((a) => (
              <p key={a} className="text-body-2-book">
                {a}
              </p>
            ))}
            {p.direccion && <p className={`${styles.gris} text-body-2-book`}>Entrega en {p.direccion}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function ListaDirecciones({ onNueva }: { onNueva: () => void }) {
  const { direcciones, predeterminadaId, hacerPredeterminada, eliminarDireccion } = useDemo();
  if (!direcciones.length)
    return (
      <Vacio icono="add_location_alt" titulo="Por el momento no hay direcciones registradas" texto="Añade una para enviarte tus pedidos">
        <Button onClick={onNueva}>Nueva dirección</Button>
      </Vacio>
    );
  return (
    <div className={styles.lista}>
      <div className={styles.listaCabecera}>
        <p className="text-subheadline-medium">Mis direcciones ({direcciones.length})</p>
        <Button onClick={onNueva}>Nueva dirección</Button>
      </div>
      {direcciones.map((d) => (
        <div key={d.id} className={d.id === predeterminadaId ? `${styles.item} ${styles.itemPred}` : styles.item}>
          <Icon name="location_on" color="var(--color-primary-500)" />
          <div className={styles.itemTexto}>
            <p className="text-subheadline-medium">
              {d.nombre}
              {d.id === predeterminadaId && <span className={`${styles.etiqueta} text-caption-book`}>Predeterminada</span>}
            </p>
            <p className={`${styles.gris} text-body-2-book`}>{lineaDireccion(d)}</p>
            {(d.entreCalle1 || d.senas) && (
              <p className={`${styles.gris} text-body-2-book`}>
                {d.entreCalle1 && `Entre ${d.entreCalle1} y ${d.entreCalle2}`}
                {d.entreCalle1 && d.senas && ' · '}
                {d.senas}
              </p>
            )}
          </div>
          <div className={styles.itemAcciones}>
            {d.id !== predeterminadaId && (
              <button type="button" className={`${styles.enlace} text-body-2-book`} onClick={() => hacerPredeterminada(d.id)}>
                Usar como predeterminada
              </button>
            )}
            <button type="button" className={`${styles.enlace} ${styles.rojo} text-body-2-book`} onClick={() => eliminarDireccion(d.id)}>
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const VACIA = { nombre: '', calle: '', numeroExterior: '', numeroInterior: '', entreCalle1: '', entreCalle2: '', senas: '', codigoPostal: '', colonia: '' };
type Campos = typeof VACIA;

/** Formulario "Nueva dirección" con los campos y obligatorios de autex.com.mx. */
function FormularioDireccion({ onGuardar, onCancelar }: { onGuardar: (d: Omit<DireccionEntrega, 'id'>, predeterminada: boolean) => void; onCancelar: () => void }) {
  const [d, setD] = useState<Campos>(VACIA);
  const [predeterminada, setPredeterminada] = useState(false);
  const zona = d.codigoPostal.length === 5 ? resolverCP(d.codigoPostal) : null;
  const colonias = zona ? coloniasDe(d.codigoPostal) : [];
  const obligatorios: (keyof Campos)[] = ['nombre', 'calle', 'numeroExterior', 'entreCalle1', 'entreCalle2', 'codigoPostal', 'colonia'];
  const completo = !!zona && obligatorios.every((k) => d[k].trim());
  const campo = (k: keyof Campos, etiqueta: string, placeholder: string, obligatorio = true) => (
    <label className={styles.campo}>
      <span className="text-body-2-book">
        {obligatorio && <span className={styles.asterisco}>* </span>}
        {etiqueta}
      </span>
      <input
        className="text-body-1-book"
        name={k}
        placeholder={placeholder}
        inputMode={k === 'codigoPostal' ? 'numeric' : undefined}
        value={d[k]}
        onChange={(e) =>
          setD(k === 'codigoPostal' ? { ...d, codigoPostal: e.target.value.replace(/\D/g, '').slice(0, 5), colonia: '' } : { ...d, [k]: e.target.value })
        }
      />
    </label>
  );
  return (
    <div className={styles.formulario}>
      <p className="text-subheadline-book">Llena los siguientes campos para dar de alta una dirección</p>
      <div className={styles.rejilla}>
        {campo('nombre', 'Asignar nombre a la dirección', 'Asignar nombre')}
        {campo('calle', 'Calle', 'Calle')}
        {campo('numeroExterior', 'Número exterior', 'Número exterior')}
        {campo('numeroInterior', 'Número interior', 'Número interior', false)}
        {campo('entreCalle1', 'Entre calle 1', 'Entre calle 1')}
        {campo('entreCalle2', 'Entre calle 2', 'Entre calle 2')}
        {campo('senas', 'Señas particulares del domicilio o negocio', 'Señas particulares del domicilio o negocio', false)}
        {campo('codigoPostal', 'Código postal', 'Código postal')}
        <label className={styles.campo}>
          <span className="text-body-2-book">
            <span className={styles.asterisco}>* </span>Colonia
          </span>
          <span className={`${styles.selector} ${zona ? '' : styles.deshabilitado}`}>
            <select className="text-body-1-book" name="colonia" value={d.colonia} disabled={!zona} onChange={(e) => setD({ ...d, colonia: e.target.value })} aria-label="Colonia">
              <option value="">{zona ? 'Selecciona tu colonia' : 'Ingresa primero tu código postal'}</option>
              {colonias.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <Icon name="arrow_drop_down" color="var(--color-neutral-500)" />
          </span>
        </label>
        <label className={styles.campo}>
          <span className="text-body-2-book">
            <span className={styles.asterisco}>* </span>Ciudad
          </span>
          <input className="text-body-1-book" placeholder="Ciudad" value={zona?.ciudad ?? ''} disabled aria-label="Ciudad" />
        </label>
        <label className={styles.campo}>
          <span className="text-body-2-book">
            <span className={styles.asterisco}>* </span>Estado
          </span>
          <input className="text-body-1-book" placeholder="Estado" value={zona?.estado ?? ''} disabled aria-label="Estado" />
        </label>
      </div>
      {d.codigoPostal.length === 5 && !zona && <p className={`${styles.rojo} text-body-2-book`}>No encontramos ese código postal.</p>}
      <div className={styles.pie}>
        <label className={`${styles.casilla} text-body-2-book`}>
          <input type="checkbox" checked={predeterminada} onChange={(e) => setPredeterminada(e.target.checked)} />
          Utilizar esta dirección como predeterminada
        </label>
        <div className={styles.botones}>
          <Button variant="outline" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button disabled={!completo} onClick={() => zona && onGuardar({ ...d, ciudad: zona.ciudad, estado: zona.estado }, predeterminada)}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}
