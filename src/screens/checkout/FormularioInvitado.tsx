/**
 * SIN RESPALDO EN FIGMA (D40). Formulario del cliente invitado de autex.com.mx (/PasarelaPago/DatosUsuario,
 * captura 2026-10-06): Datos del cliente, Datos fiscales y Dirección de envío, con los obligatorios del sitio;
 * la colonia se habilita con el C.P. y ciudad / estado se llenan solos.
 */
import { Icon } from '../../design-system/components/atoms/Icon';
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
};
export type DatosInvitado = typeof DATOS_INVITADO_VACIOS;

const REGIMENES = ['Sin obligaciones fiscales', 'Persona física con actividad empresarial', 'Régimen Simplificado de Confianza', 'Persona moral'];
const USOS_CFDI = ['G01 Adquisición de mercancías', 'G03 Gastos en general', 'S01 Sin efectos fiscales'];
const OBLIGATORIOS: (keyof DatosInvitado)[] = ['nombre', 'apellido', 'correo', 'telefono', 'calle', 'numeroExterior', 'entreCalle1', 'entreCalle2', 'codigoPostal', 'colonia'];

/** null si falta algo obligatorio o un dato no es válido. */
export function validarInvitado(d: DatosInvitado) {
  if (OBLIGATORIOS.some((k) => !d[k].trim())) return null;
  if (!/^\S+@\S+\.\S+$/.test(d.correo.trim()) || d.telefono.length !== 10) return null;
  return resolverCP(d.codigoPostal);
}

export function FormularioInvitado({ datos, onCambiar }: { datos: DatosInvitado; onCambiar: (d: DatosInvitado) => void }) {
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
      <p className={`${styles.seccion} text-subheadline-book`}>Datos fiscales</p>
      <div className={styles.rejilla}>
        {lista('regimen', 'Régimen fiscal', 'Régimen fiscal', REGIMENES)}
        {lista('cfdi', 'Uso del CFDI', 'Uso del CFDI', USOS_CFDI)}
      </div>
      <p className={`${styles.seccion} text-subheadline-book`}>Dirección de envío</p>
      <div className={styles.rejilla}>
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
    </div>
  );
}
