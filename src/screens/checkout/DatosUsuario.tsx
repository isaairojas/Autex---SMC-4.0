/**
 * Figma (Autex_2026_Frames): Autex - Checkout - 1 (677:18887), Container 901:31850
 *  - Registrado: "Selecciona un a dirección" con Dirección 1…4, "Editar dirección" y "Añadir dirección +".
 *  - Invitado / nuevo / "Añadir dirección": formulario del archivo anterior (Content Form 1324:96827),
 *    sin respaldo en el archivo 2026; se compone dentro del mismo Container.
 *  - Sitio, invitado (D40): formulario de autex.com.mx (FormularioInvitado) con "Usuario Invitado · Regístrate";
 *    lo capturado se conserva al regresar del paso 2.
 *  - Sitio, registrado (D35): sus direcciones guardadas (las mismas de "Entrega en" y Mi perfil); "Añadir
 *    dirección" abre el alta de Mi perfil y regresa al checkout.
 * Última sincronización: 2026-10-05
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/atoms/Button';
import { LinkButton } from '../../design-system/components/atoms/LinkButton';
import { TextField } from '../../design-system/components/atoms/TextField';
import { CheckoutCard } from '../../design-system/components/organisms/CheckoutCard';
import { OpcionSeleccionable } from '../../design-system/components/molecules/OpcionSeleccionable';
import { useDemo } from '../../state/DemoContext';
import { DIRECCIONES, lineaDireccion, type Cliente, type DireccionGuardada } from '../../mocks/clientes';
import { CheckoutLayout } from './CheckoutLayout';
import { DATOS_INVITADO_VACIOS, FormularioInvitado, validarInvitado, type DatosInvitado } from './FormularioInvitado';
import invitadoStyles from './FormularioInvitado.module.css';
import styles from './DatosUsuario.module.css';

type Props = {
  /** Forzar una lista de direcciones (galería). Por defecto depende del tipo de cliente. */
  direcciones?: keyof typeof DIRECCIONES;
};

export function DatosUsuario({ direcciones }: Props) {
  const navigate = useNavigate();
  const demo = useDemo();
  const { cliente, envioDetalle, setEnvioDetalle, conCarga, modoFigma, setCliente, setUbicacion, abrirLogin } = demo;
  /* Sitio (D40): el invitado llena el formulario de autex.com.mx (vacío la primera vez). */
  const invitadoSitio = !modoFigma && cliente.tipo === 'invitado' && !direcciones;
  const [datos, setDatos] = useState<DatosInvitado>({ ...DATOS_INVITADO_VACIOS, ...demo.borradorInvitado });
  const zonaInvitado = invitadoSitio ? validarInvitado(datos) : null;
  /* Sitio, registrado: sus direcciones reales en lugar de las de Figma. */
  const registradoSitio = !modoFigma && cliente.tipo !== 'invitado' && !direcciones;
  const propias: DireccionGuardada[] = demo.direcciones.map((d) => ({ id: d.id, nombre: d.nombre, direccion: lineaDireccion(d) }));
  const lista = direcciones ?? (cliente.tipo === 'b2b' ? 'b2b' : cliente.tipo === 'b2c' ? 'b2c' : null);
  const opciones = registradoSitio ? propias : lista ? DIRECCIONES[lista] : [];
  const [formulario, setFormulario] = useState(!lista);
  const [sel, setSel] = useState(registradoSitio ? demo.direccion?.id ?? demo.predeterminadaId ?? propias[0]?.id ?? '' : lista ? DIRECCIONES[lista][0].id : '');
  const nuevaDireccion = () => navigate('/configuracion/direcciones/nueva', { state: { volver: '/checkout/envio' } });

  const acciones = (
    <>
      <Button variant="outline" onClick={() => (formulario && lista && !registradoSitio ? setFormulario(false) : navigate('/carrito'))}>
        Regresar
      </Button>
      <Button
        disabled={(invitadoSitio && !zonaInvitado) || (registradoSitio && !sel)}
        onClick={() => {
          if (registradoSitio) {
            const d = demo.direcciones.find((x) => x.id === sel);
            if (!d) return;
            setEnvioDetalle({ ...envioDetalle, direccion: lineaDireccion(d) });
            conCarga('Calculando tu envío', 'Revisamos las existencias de cada sucursal para tu dirección…', () => {
              demo.elegirDireccion(d.id);
              navigate('/checkout/envio');
            });
            return;
          }
          if (invitadoSitio && zonaInvitado) {
            demo.setBorradorInvitado(datos);
            const calle = `${datos.calle} ${datos.numeroExterior}${datos.numeroInterior ? ` Int. ${datos.numeroInterior}` : ''}`;
            setCliente({
              ...cliente,
              nombre: `${datos.nombre.trim()} ${datos.apellido.trim()}`,
              correo: datos.correo.trim(),
              telefono: datos.telefono,
              numeroExterior: datos.numeroExterior,
              numeroInterior: datos.numeroInterior || 'N/A',
              entreCalle1: datos.entreCalle1,
              entreCalle2: datos.entreCalle2,
              senas: datos.senas,
              codigoPostal: datos.codigoPostal,
              colonia: datos.colonia,
              ciudad: zonaInvitado.ciudad,
              estado: zonaInvitado.estado,
              regimen: datos.regimen,
              cfdi: datos.cfdi,
            });
            setEnvioDetalle({ ...envioDetalle, direccion: `${calle}, ${datos.colonia}, C.P. ${datos.codigoPostal}, ${zonaInvitado.ciudad}, ${zonaInvitado.estado}` });
            conCarga('Calculando tu envío', 'Revisamos las existencias de cada sucursal para tu dirección…', () => {
              /* La dirección capturada pasa a ser la ubicación de entrega (envíos y tienda). */
              setUbicacion({ ...zonaInvitado, etiqueta: `C.P. ${datos.codigoPostal}, ${zonaInvitado.ciudad}` });
              navigate('/checkout/envio');
            });
            return;
          }
          const elegida = lista && !formulario ? DIRECCIONES[lista].find((d) => d.id === sel)?.direccion : undefined;
          const capturada = `${cliente.entreCalle1} ${cliente.numeroExterior}, ${cliente.colonia}, ${cliente.codigoPostal} ${cliente.ciudad}, ${cliente.estado}`;
          setEnvioDetalle({ ...envioDetalle, direccion: elegida ?? capturada });
          conCarga('Calculando tu envío', 'Revisamos las existencias de cada sucursal para tu dirección…', () => navigate('/checkout/envio'));
        }}
      >
        Continuar
      </Button>
    </>
  );

  return (
    <CheckoutLayout paso={1}>
      {invitadoSitio ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p className={`${invitadoStyles.modo} text-body-1-book`}>
            <span>Usuario Invitado</span>
            <button type="button" className="text-body-1-book" onClick={() => abrirLogin('/checkout/datos')}>
              Regístrate
            </button>
          </p>
          <CheckoutCard title="Datos del usuario" intro="Llena los siguientes campos para continuar" espacio={20} accionesInset={false} actions={acciones}>
            <FormularioInvitado datos={datos} onCambiar={setDatos} />
          </CheckoutCard>
        </div>
      ) : (
      <CheckoutCard
        title={cliente.tipo === 'nuevo' ? 'Registro de nuevo usuario' : 'Datos del usuario'}
        intro={registradoSitio ? (opciones.length ? 'Selecciona un a dirección' : 'Añade una dirección para enviarte tu pedido') : formulario || !lista ? 'Llena los siguientes campos para continuar' : 'Selecciona un a dirección'}
        espacio={20}
        accionesInset={false}
        actions={acciones}
      >
        {registradoSitio ? (
          <ListaDirecciones lista={opciones} sel={sel} onSel={setSel} onAgregar={nuevaDireccion} onEditar={() => navigate('/configuracion/direcciones')} />
        ) : formulario || !lista ? (
          <Formulario />
        ) : (
          <ListaDirecciones lista={opciones} sel={sel} onSel={setSel} onAgregar={() => setFormulario(true)} />
        )}
      </CheckoutCard>
      )}
    </CheckoutLayout>
  );
}

function Formulario() {
  const { cliente, setCliente } = useDemo();
  const set = (k: keyof Cliente) => (v: string) => setCliente({ ...cliente, [k]: v });
  const nuevo = cliente.tipo === 'nuevo';
  return (
    <div className={styles.form}>
      <div className={styles.group}>
        <p className={`${styles.groupTitle} text-subheadline-medium`}>Datos del cliente</p>
        <div className={styles.fields}>
          <div className={styles.full}>
            <TextField label="Nombre completo" value={cliente.nombre} onChange={set('nombre')} />
          </div>
          <div className={styles.pair}>
            {/* Figma repite la etiqueta "Nombre completo" en el campo de teléfono (D11) */}
            <TextField label="Nombre completo" value={cliente.telefono} onChange={set('telefono')} />
            <TextField label="Correo electrónico" value={cliente.correo} onChange={set('correo')} />
          </div>
          <div className={styles.pair}>
            <TextField label="Uso del CFDI" value={cliente.cfdi} onChange={set('cfdi')} select />
            {/* En "Nuevo usuario" Figma etiqueta este campo como "Correo electrónico" (D16) */}
            <TextField label={nuevo ? 'Correo electrónico' : 'Regimen Fiscal'} value={cliente.regimen} onChange={set('regimen')} select />
          </div>
        </div>
      </div>

      <div className={styles.group}>
        <p className={`${styles.groupTitle} text-subheadline-medium`}>Dirección</p>
        <div className={styles.group}>
          <div className={styles.pair}>
            <TextField label="Número interior" value={cliente.numeroInterior} onChange={set('numeroInterior')} />
            <TextField label="Número exterior" value={cliente.numeroExterior} onChange={set('numeroExterior')} />
          </div>
          <div className={styles.pair}>
            <TextField label="Entre calle 1" value={cliente.entreCalle1} onChange={set('entreCalle1')} />
            <TextField label="Entre calle 2" value={cliente.entreCalle2} onChange={set('entreCalle2')} />
          </div>
          <div className={styles.pair}>
            <TextField label="Señas particulares del domicilio, negocio" value={cliente.senas} onChange={set('senas')} />
          </div>
          <div className={styles.pair}>
            <TextField label="Código Postal" value={cliente.codigoPostal} onChange={set('codigoPostal')} />
            <TextField label="Colonia" value={cliente.colonia} onChange={set('colonia')} select />
          </div>
          <div className={styles.pair}>
            <TextField label="Ciudad" value={cliente.ciudad} onChange={set('ciudad')} />
            <TextField label="Estado" value={cliente.estado} onChange={set('estado')} />
          </div>
        </div>
      </div>
    </div>
  );
}

type ListaProps = { lista: DireccionGuardada[]; sel: string; onSel: (id: string) => void; onAgregar: () => void; onEditar?: () => void };

function ListaDirecciones({ lista, sel, onSel: setSel, onAgregar, onEditar }: ListaProps) {
  return (
    <>
      {lista.map((d) => (
        <OpcionSeleccionable
          key={d.id}
          selected={sel === d.id}
          onSelect={() => setSel(d.id)}
          bordeGrueso
          titulo={d.nombre}
          descripcion={d.direccion}
          accion={
            <LinkButton width={206} padding="8px 12px 8px 20px" onClick={onEditar}>
              Editar dirección
            </LinkButton>
          }
        />
      ))}
      <div className={styles.anadir}>
        <LinkButton mas onClick={onAgregar}>
          Añadir dirección
        </LinkButton>
      </div>
    </>
  );
}
