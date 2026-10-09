/**
 * SIN RESPALDO EN FIGMA (D40). Formulario del cliente invitado de autex.com.mx (/PasarelaPago/DatosUsuario,
 * captura 2026-10-06): Datos del cliente, Datos fiscales y Dirección de envío, con los obligatorios del sitio;
 * la colonia se habilita con el C.P. y ciudad / estado se llenan solos.
 * D51: "Buscar dirección" sugiere direcciones mientras se escribe (autocompletado simulado de Google) y llena calle,
 * número, C.P. y colonia; el registrado ve arriba sus direcciones guardadas para llenar la dirección con una de ellas.
 * D57: los datos fiscales solo se piden si el cliente marca "Requiero factura" (sin marcarla, el pedido no se factura).
 * Si todo el pedido se recoge en tienda no se pide dirección: se pide quién recoge y su teléfono (obligatorios).
 */
import { useState } from 'react';
import { Icon } from '../../design-system/components/atoms/Icon';
import { AutocompletarDireccion } from '../../design-system/components/molecules/AutocompletarDireccion';
import { OpcionSeleccionable } from '../../design-system/components/molecules/OpcionSeleccionable';
import { sugerirDirecciones } from '../../mocks/direcciones-sugeridas';
import { coloniasDe } from '../../mocks/colonias';
import { resolverCP } from '../../mocks/tiendas';
import styles from './FormularioInvitado.module.css';

export const DATOS_INVITADO_VACIOS = {
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
  regimen: '',
  cfdi: '',
  calle: '',
  numeroExterior: '',
  numeroInterior: '',
  entreCalle1: '',
  entreCalle2: '',
  senas: '',
  codigoPostal: '',
  colonia: '',
  /** D57: 'si' cuando el cliente pide factura. */
  factura: '',
  /** D57: persona que recoge en tienda y su teléfono (pedido solo para recoger). */
  recoge: '',
  telefonoRecoge: '',
};
export type DatosInvitado = typeof DATOS_INVITADO_VACIOS;

const REGIMENES = ['Sin obligaciones fiscales', 'Persona física con actividad empresarial', 'Régimen Simplificado de Confianza', 'Persona moral'];
const USOS_CFDI = ['G01 Adquisición de mercancías', 'G03 Gastos en general', 'S01 Sin efectos fiscales'];
const CLIENTE: (keyof DatosInvitado)[] = ['nombre', 'apellido', 'correo', 'telefono'];
const DIRECCION: (keyof DatosInvitado)[] = ['calle', 'numeroExterior', 'entreCalle1', 'entreCalle2', 'codigoPostal', 'colonia'];

/** D57: datos del cliente, los fiscales si pide factura y, si todo se recoge, quién recoge y su teléfono. */
export function datosCompletos(d: DatosInvitado, soloRecoger = false) {
  const obligatorios = [...CLIENTE, ...(d.factura && !soloRecoger ? (['regimen', 'cfdi'] as const) : []), ...(soloRecoger ? (['recoge', 'telefonoRecoge'] as const) : DIRECCION)];
  if (obligatorios.some((k) => !d[k].trim())) return false;
  if (!/^\S+@\S+\.\S+$/.test(d.correo.trim()) || d.telefono.length !== 10) return false;
  return !soloRecoger || d.telefonoRecoge.length === 10;
}

/** Zona de la dirección de envío; null si falta algo obligatorio o un dato no es válido. */
export function validarInvitado(d: DatosInvitado) {
  if (!datosCompletos(d)) return null;
  return resolverCP(d.codigoPostal);
}

/** Dirección guardada que llena la sección "Dirección de envío" (cliente registrado, D51). */
export type DireccionParaFormulario = { id: string; nombre: string; descripcion: string; campos: Pick<DatosInvitado, 'calle' | 'numeroExterior' | 'numeroInterior' | 'entreCalle1' | 'entreCalle2' | 'senas' | 'codigoPostal' | 'colonia'> };

/** La dirección del formulario coincide con una guardada (mismos calle, número, C.P. y colonia). */
export const esLaMisma = (d: DatosInvitado, g: DireccionParaFormulario['campos']) =>
  (['calle', 'numeroExterior', 'numeroInterior', 'codigoPostal', 'colonia'] as const).every((k) => d[k].trim() === g[k].trim());

type FormularioProps = {
  datos: DatosInvitado;
  onCambiar: (d: DatosInvitado) => void;
  guardadas?: DireccionParaFormulario[];
  /** D57: todo el pedido se recoge en tienda: sin dirección de envío; quién recoge y su teléfono. */
  soloRecoger?: { tienda: string } | null;
};

export function FormularioInvitado({ datos, onCambiar, guardadas, soloRecoger }: FormularioProps) {
  const [busqueda, setBusqueda] = useState('');
  const sugerencias = sugerirDirecciones(busqueda);
  const zona = datos.codigoPostal.length === 5 ? resolverCP(datos.codigoPostal) : null;
  const set = (k: keyof DatosInvitado, v: string) => onCambiar({ ...datos, [k]: v });
  const campo = (k: keyof DatosInvitado, etiqueta: string, placeholder = etiqueta, opciones?: { obligatorio?: boolean; numerico?: number }) => (
    <label className={styles.campo}>
      <span className="text-body-2-book">
        {opciones?.obligatorio !== false && <span className={styles.asterisco}>* </span>}
        {etiqueta}
      </span>
      <input
        className="text-body-1-book"
        name={k}
        placeholder={placeholder}
        inputMode={opciones?.numerico ? 'numeric' : undefined}
        value={datos[k]}
        onChange={(e) => {
          const v = opciones?.numerico ? e.target.value.replace(/\D/g, '').slice(0, opciones.numerico) : e.target.value;
          onCambiar(k === 'codigoPostal' ? { ...datos, codigoPostal: v, colonia: '' } : { ...datos, [k]: v });
        }}
      />
    </label>
  );
  const lista = (k: 'regimen' | 'cfdi' | 'colonia', etiqueta: string, placeholder: string, valores: string[], obligatorio = false, deshabilitado = false) => (
    <label className={styles.campo}>
      <span className="text-body-2-book">
        {obligatorio && <span className={styles.asterisco}>* </span>}
        {etiqueta}
      </span>
      <span className={`${styles.selector} ${deshabilitado ? styles.deshabilitado : ''}`}>
        <select className="text-body-1-book" name={k} aria-label={etiqueta} value={datos[k]} disabled={deshabilitado} onChange={(e) => set(k, e.target.value)}>
          <option value="">{placeholder}</option>
          {valores.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <Icon name="expand_more" color="var(--color-neutral-600)" />
      </span>
    </label>
  );
  return (
    <div className={styles.formulario}>
      <p className={`${styles.seccion} text-subheadline-book`}>Datos del cliente</p>
      <div className={styles.rejilla}>
        {campo('nombre', 'Nombre(s)', 'Nombre')}
        {campo('apellido', 'Apellido(s)')}
        {campo('correo', 'Correo electrónico')}
        {campo('telefono', 'Número de teléfono de contacto', 'Número de teléfono de contacto', { numerico: 10 })}
      </div>
      {/* D57: un pedido solo para recoger no lleva la parte fiscal (decisión del usuario). */}
      {!soloRecoger && (
        <>
          <p className={`${styles.seccion} text-subheadline-book`}>Facturación</p>
          <label className={`${styles.casilla} text-body-1-book`}>
            <input type="checkbox" name="factura" checked={!!datos.factura} onChange={(e) => onCambiar({ ...datos, factura: e.target.checked ? 'si' : '' })} />
            Requiero factura
          </label>
          {datos.factura ? (
            <div className={styles.rejilla}>
              {lista('regimen', 'Régimen fiscal', 'Régimen fiscal', REGIMENES, true)}
              {lista('cfdi', 'Uso del CFDI', 'Uso del CFDI', USOS_CFDI, true)}
            </div>
          ) : (
            <p className={`${styles.ayuda} text-body-2-book`}>Si no la marcas, tu pedido no se factura.</p>
          )}
        </>
      )}
      {soloRecoger ? (
        <>
          <p className={`${styles.seccion} text-subheadline-book`}>¿Quién recoge el pedido?</p>
          <p className={`${styles.ayuda} text-body-2-book`}>Todo tu pedido se recoge en {soloRecoger.tienda}; no necesitamos dirección de envío.</p>
          <div className={styles.rejilla}>
            {campo('recoge', 'Nombre de quien recoge', 'Nombre completo de quien recoge')}
            {campo('telefonoRecoge', 'Teléfono de quien recoge', 'Teléfono a 10 dígitos', { numerico: 10 })}
          </div>
        </>
      ) : (
        <>
      <p className={`${styles.seccion} text-subheadline-book`}>Dirección de envío</p>
      {guardadas && guardadas.length > 0 && (
        <div className={styles.guardadas} role="radiogroup" aria-label="Tus direcciones guardadas">
          <p className="text-body-2-book">Tus direcciones guardadas</p>
          {guardadas.map((g) => (
            <OpcionSeleccionable key={g.id} bordeGrueso selected={esLaMisma(datos, g.campos)} onSelect={() => onCambiar({ ...datos, ...g.campos })} titulo={g.nombre} descripcion={g.descripcion} />
          ))}
        </div>
      )}
      <div className={styles.rejilla}>
        <AutocompletarDireccion
          etiqueta="Buscar dirección"
          placeholder="Empieza a escribir tu calle y número, p. ej. Av. Guadalupe 1144"
          valor={busqueda}
          onCambiar={setBusqueda}
          sugerencias={sugerencias}
          pie="Sugerencias de Google Maps (simuladas en la demo)"
          onElegir={(i) => {
            const s = sugerencias[i];
            setBusqueda(`${s.principal}, ${s.secundario}`);
            onCambiar({ ...datos, calle: s.calle, numeroExterior: s.numeroExterior, codigoPostal: s.codigoPostal, colonia: s.colonia });
          }}
        />
        {campo('calle', 'Calle')}
        {campo('numeroExterior', 'Número exterior')}
        {campo('numeroInterior', 'Número interior', 'Número interior', { obligatorio: false })}
        {campo('entreCalle1', 'Entre calle 1')}
        {campo('entreCalle2', 'Entre calle 2')}
        {campo('senas', 'Señas particulares del domicilio o negocio', 'Señas particulares del domicilio o negocio', { obligatorio: false })}
        {campo('codigoPostal', 'Código postal', 'Código postal', { numerico: 5 })}
        {lista('colonia', 'Colonia', zona ? 'Selecciona tu colonia' : 'Ingresa primero tu código postal', zona ? coloniasDe(datos.codigoPostal) : [], true, !zona)}
        <label className={styles.campo}>
          <span className="text-body-2-book">
            <span className={styles.asterisco}>* </span>Ciudad
          </span>
          <input className="text-body-1-book" placeholder="Ciudad" aria-label="Ciudad" value={zona?.ciudad ?? ''} disabled />
        </label>
        <label className={styles.campo}>
          <span className="text-body-2-book">
            <span className={styles.asterisco}>* </span>Estado
          </span>
          <input className="text-body-1-book" placeholder="Estado" aria-label="Estado" value={zona?.estado ?? ''} disabled />
        </label>
      </div>
      {datos.codigoPostal.length === 5 && !zona && <p className={`${styles.error} text-body-2-book`}>No encontramos ese código postal.</p>}
        </>
      )}
    </div>
  );
}
