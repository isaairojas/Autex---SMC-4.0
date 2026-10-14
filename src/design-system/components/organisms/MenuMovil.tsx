/**
 * SIN RESPALDO EN FIGMA (D58): menú (hamburguesa) de autex.com.mx en celular, copiado del sitio real
 * (docs/autex-real/movil: capturas 02 y registrado/02; medidas en medidas/medidas.json, "menu").
 * Invitado: "Ingresar"; con sesión: "Hola, nombre", "Mis listas", "Mis Pedidos" y "Cerrar sesión".
 * Las páginas que la demo no replica (¿Quiénes somos?, Preguntas frecuentes, Facturación, Garantías, Mis listas) se
 * muestran sin enlace, como en el pie de escritorio.
 * Última revisión contra el sitio: 2026-10-09
 */
import { useNavigate } from 'react-router-dom';
import cerrarIcono from '../../../assets/movil/cerrar-menu.svg';
import autexIcono from '../../../assets/movil/autex-menu.svg';
import personaIcono from '../../../assets/movil/persona.svg';
import personaHola from '../../../assets/movil/persona-hola.svg';
import styles from './MenuMovil.module.css';

type Enlace = [texto: string, ruta: string | null];

type MenuMovilProps = {
  /** Nombre del cliente con sesión; null es invitado. */
  usuario: string | null;
  onClose: () => void;
  onIngresar: () => void;
  onSalir: () => void;
};

export function MenuMovil({ usuario, onClose, onIngresar, onSalir }: MenuMovilProps) {
  const navigate = useNavigate();
  const ir = (ruta: string) => {
    onClose();
    navigate(ruta);
  };
  const enlaces = (lista: Enlace[]) =>
    lista.map(([texto, ruta]) =>
      ruta ? (
        <button key={texto} type="button" className={`${styles.enlace} text-movil-16-16`} onClick={() => ir(ruta)}>
          {texto}
        </button>
      ) : (
        <span key={texto} className={`${styles.enlace} text-movil-16-16`}>
          {texto}
        </span>
      ),
    );
  return (
    <div className={styles.capa} role="dialog" aria-label="Menú">
      <div className={styles.mascara} onClick={onClose} />
      <div className={styles.panel}>
        <div className={styles.cabecera}>
          <div className={styles.cabeceraFila}>
            <button type="button" className={styles.cerrar} onClick={onClose} aria-label="Cerrar menú">
              <img src={cerrarIcono} alt="" width={16} height={16} />
            </button>
            <div className={styles.marca}>
              <img src={autexIcono} alt="AUTEX" width={111} height={18} />
            </div>
          </div>
        </div>
        <div className={styles.cuerpo}>
          <div className={styles.usuario}>
            {usuario ? (
              <div className={styles.hola}>
                <img src={personaHola} alt="" width={24} height={40} />
                <div className={styles.holaTexto}>
                  <p className={`${styles.holaSaludo} text-movil-12-16`}>Hola</p>
                  <p className={`${styles.holaNombre} text-movil-14-16`}>{usuario}</p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={styles.ingresar}
                onClick={() => {
                  onClose();
                  onIngresar();
                }}
              >
                <img src={personaIcono} alt="" width={14} height={14} />
                <span className="text-movil-14-16">Ingresar</span>
              </button>
            )}
          </div>
          <div className={styles.seccion}>
            {enlaces([
              ['Marcas', '/marcas'],
              ['Promociones', '/ofertas'],
              ...(usuario ? ([['Mis listas', null]] as Enlace[]) : []),
            ])}
          </div>
          {usuario && (
            <div className={styles.seccion}>
              <p className={`${styles.grupo} text-movil-20-20`}>Mis Pedidos</p>
              {enlaces([['Historial de pedidos', '/configuracion/pedidos']])}
            </div>
          )}
          <div className={styles.seccion}>
            <p className={`${styles.grupo} text-movil-20-20`}>Empresa</p>
            {enlaces([
              ['¿Quiénes somos?', null],
              ['Sucursales', '/sucursales'],
            ])}
          </div>
          <div className={styles.seccion}>
            <p className={`${styles.grupo} text-movil-20-20`}>Ayuda</p>
            {enlaces([
              ['Preguntas frecuentes', null],
              ['Facturación', null],
              ['Garantías y devoluciones', null],
              ['¿Cómo comprar en Autex?', '/como-comprar'],
            ])}
          </div>
          {usuario && (
            <button
              type="button"
              className={`${styles.enlace} ${styles.salir} text-movil-16-16`}
              onClick={() => {
                onClose();
                onSalir();
              }}
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
