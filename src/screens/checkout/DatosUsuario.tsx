/**
 * Figma (Autex_2026_Frames): Autex - Checkout - 1 (677:18887), Container 901:31850
 *  - Registrado: "Selecciona un a dirección" con Dirección 1…4, "Editar dirección" y "Añadir dirección +".
 *  - Invitado / nuevo / "Añadir dirección": formulario del archivo anterior (Content Form 1324:96827),
 *    sin respaldo en el archivo 2026; se compone dentro del mismo Container.
 *  - Sitio, invitado (D40): formulario de autex.com.mx (FormularioInvitado) con "Usuario Invitado · Regístrate";
 *    lo capturado se conserva al regresar del paso 2.
 *  - Sitio, registrado (D51): el mismo formulario, lleno con su pedido anterior y la dirección en uso; arriba de la
 *    dirección, sus direcciones guardadas. Si la dirección cambia respecto a la del pedido, se pide confirmación y
 *    se regresa a "Método de envío" con las existencias recalculadas.
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
import { calleCompleta, DIRECCIONES, lineaDireccion, PEDIDO_ANTERIOR_REGISTRADO, type Cliente, type DireccionEntrega, type DireccionGuardada } from '../../mocks/clientes';
import { CheckoutLayout } from './CheckoutLayout';
import { useCambioDireccion } from './CambioDireccion';
import { DATOS_INVITADO_VACIOS, esLaMisma, FormularioInvitado, validarInvitado, type DatosInvitado, type DireccionParaFormulario } from './FormularioInvitado';
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
  /* Sitio (D40/D51): invitado y registrado llenan el formulario de autex.com.mx. */
  const sitio = !modoFigma && !direcciones;
  const invitadoSitio = sitio && cliente.tipo === 'invitado';
  const registradoSitio = sitio && cliente.tipo !== 'invitado';
  /* D51: el registrado ve el formulario lleno con su pedido anterior y con la dirección de entrega en uso. */
  const anterior = demo.pedidos.find((p) => p.registrado && p.datos)?.datos ?? PEDIDO_ANTERIOR_REGISTRADO;
  const [datos, setDatos] = useState<DatosInvitado>(() =>
    registradoSitio
      ? { ...DATOS_INVITADO_VACIOS, ...anterior, ...demo.borradorInvitado, ...(demo.direccion ? camposDe(demo.direccion) : {}) }
      : { ...DATOS_INVITADO_VACIOS, ...demo.borradorInvitado },
  );
  const zona = sitio ? validarInvitado(datos) : null;
  const guardadas: DireccionParaFormulario[] = registradoSitio ? demo.direcciones.map((d) => ({ id: d.id, nombre: d.nombre, descripcion: lineaDireccion(d), campos: camposDe(d) })) : [];
  const cambio = useCambioDireccion();
  const lista = direcciones ?? (cliente.tipo === 'b2b' ? 'b2b' : cliente.tipo === 'b2c' ? 'b2c' : null);
  const opciones = lista ? DIRECCIONES[lista] : [];
  const [formulario, setFormulario] = useState(!lista);
  const [sel, setSel] = useState(lista ? DIRECCIONES[lista][0].id : '');

  /* Sitio: guarda los datos y fija la dirección; si ya había una dirección en el pedido y cambia, pide confirmación (D51). */
  const continuarSitio = () => {
    if (!zona) return;
    demo.setBorradorInvitado(datos);
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
      ciudad: zona.ciudad,
      estado: zona.estado,
      regimen: datos.regimen,
      cfdi: datos.cfdi,
    });
    const guardada = registradoSitio ? demo.direcciones.find((d) => esLaMisma(datos, camposDe(d))) : undefined;
    const linea = guardada ? lineaDireccion(guardada) : `${calleCompleta(datos)}, ${datos.colonia}, C.P. ${datos.codigoPostal}, ${zona.ciudad}, ${zona.estado}`;
    const actual = registradoSitio && demo.direccion ? lineaDireccion(demo.direccion) : envioDetalle.direccion;
    const ubicacion = { ...zona, etiqueta: `C.P. ${datos.codigoPostal}, ${zona.ciudad}` };
    if (actual && actual !== linea) {
      cambio.pedir(<span className={styles.gris}>{linea}</span>, () => {
        setEnvioDetalle({ ...envioDetalle, direccion: linea });
        return guardada ? demo.cambiarDireccionPedido(guardada.id) : demo.cambiarUbicacionPedido(ubicacion);
      }, registradoSitio ? datos.codigoPostal : undefined);
      return;
    }
    setEnvioDetalle({ ...envioDetalle, direccion: linea });
    conCarga('Calculando tu envío', 'Revisamos las existencias de cada sucursal para tu dirección…', () => {
      /* La dirección capturada pasa a ser la ubicación de entrega (envíos y tienda). */
      if (guardada && guardada.id !== demo.direccion?.id) demo.elegirDireccion(guardada.id);
      else if (!actual) setUbicacion(ubicacion);
      navigate('/checkout/envio');
    });
  };

  const acciones = (
    <>
      <Button variant="outline" onClick={() => (formulario && lista && !sitio ? setFormulario(false) : navigate('/carrito'))}>
        Regresar
      </Button>
      <Button
        disabled={sitio && !zona}
        onClick={() => {
          if (sitio) return continuarSitio();
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
    <CheckoutLayout paso={1} overlay={cambio.modales}>
      {sitio ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p className={`${invitadoStyles.modo} text-body-1-book`}>
            {invitadoSitio ? (
              <>
                <span>Usuario Invitado</span>
                <button type="button" className="text-body-1-book" onClick={() => abrirLogin('/checkout/datos')}>
                  Regístrate
                </button>
              </>
            ) : (
              <span>Llenamos tus datos con tu pedido anterior; revísalos antes de continuar.</span>
            )}
          </p>
          <CheckoutCard title="Datos del usuario" intro="Llena los siguientes campos para continuar" espacio={20} accionesInset={false} actions={acciones}>
            <FormularioInvitado datos={datos} onCambiar={setDatos} guardadas={registradoSitio ? guardadas : undefined} />
          </CheckoutCard>
        </div>
      ) : (
        <CheckoutCard
          title={cliente.tipo === 'nuevo' ? 'Registro de nuevo usuario' : 'Datos del usuario'}
          intro={formulario || !lista ? 'Llena los siguientes campos para continuar' : 'Selecciona un a dirección'}
          espacio={20}
          accionesInset={false}
          actions={acciones}
        >
          {formulario || !lista ? <Formulario /> : <ListaDirecciones lista={opciones} sel={sel} onSel={setSel} onAgregar={() => setFormulario(true)} />}
        </CheckoutCard>
      )}
    </CheckoutLayout>
  );
}

/** Campos del formulario a partir de una dirección guardada. */
const camposDe = (d: DireccionEntrega): DireccionParaFormulario['campos'] => ({
  calle: d.calle,
  numeroExterior: d.numeroExterior,
  numeroInterior: d.numeroInterior,
  entreCalle1: d.entreCalle1,
  entreCalle2: d.entreCalle2,
  senas: d.senas,
  codigoPostal: d.codigoPostal,
  colonia: d.colonia,
});

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
