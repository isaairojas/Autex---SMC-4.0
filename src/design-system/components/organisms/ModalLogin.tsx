/**
 * Figma (Autex_2026_Frames): Modal login 742:19087 (vacío, 840×848) / 742:19208 (con datos, 792 de contenido)
 * "Iniciar sesión" queda al 50 % de opacidad hasta que hay correo y contraseña.
 * La validación es simulada (constitution, Principio V): cualquier correo y contraseña inicia sesión como cliente registrado.
 * Última sincronización: 2026-10-05
 */
import { useState } from 'react';
import { Icon } from '../atoms/Icon';
import logo from '../../../assets/icons/login-autex.svg';
import facebook from '../../../assets/icons/login-facebook.svg';
import google from '../../../assets/icons/login-google.svg';
import invitado from '../../../assets/icons/login-invitado.svg';
import styles from './ModalLogin.module.css';

type ModalLoginProps = {
  onClose: () => void;
  onIngresar: () => void;
  onInvitado: () => void;
  /** Galería: valores de 742:19208. */
  correoInicial?: string;
  claveInicial?: string;
  /** Galería: sin fondo oscuro, en flujo normal. */
  incrustado?: boolean;
  /** 840 (742:19087) o 792 (742:19208). */
  ancho?: 840 | 792;
};

export function ModalLogin({ onClose, onIngresar, onInvitado, correoInicial = '', claveInicial = '', incrustado = false, ancho = 840 }: ModalLoginProps) {
  const [correo, setCorreo] = useState(correoInicial);
  const [clave, setClave] = useState(claveInicial);
  const [ver, setVer] = useState(false);
  const listo = correo.trim() !== '' && clave !== '';
  return (
    <div className={incrustado ? undefined : styles.fondo} onClick={onClose}>
      <div className={styles.modal} style={{ width: ancho }} role="dialog" aria-label="Iniciar sesión" onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <button type="button" className={styles.cerrar} onClick={onClose} aria-label="Cerrar">
            <Icon name="close" />
          </button>
        </div>
        <div className={styles.cuerpo}>
          <img src={logo} alt="AUTEX" width={147.2} height={21.9} />
          <div className={styles.bienvenida}>
            <p className={styles.titulo}>Bienvenido</p>
            <p className={`${styles.subtitulo} text-os-body-1`}>Autex agradece tu preferencia. Encuentra los mejores productos para tu vehículo.</p>
          </div>
          <div className={styles.formulario}>
            <div className={styles.campos}>
              <label className={styles.campo}>
                <span className={styles.etiqueta}>
                  <span className={styles.requerido}>*</span>
                  <span className="text-body-2-book">Correo electrónico</span>
                </span>
                <input
                  className={`${styles.input} text-os-body-1`}
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </label>
              <label className={styles.campo}>
                <span className={styles.etiqueta}>
                  <span className={styles.requerido}>*</span>
                  <span className="text-body-2-book">Contraseña</span>
                </span>
                <span className={styles.inputIcono}>
                  <input
                    className={`${styles.input} ${styles.inputSinBorde} text-os-body-1`}
                    type={ver ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                  />
                  <button type="button" className={styles.ojo} onClick={() => setVer(!ver)} aria-label="Mostrar contraseña">
                    <Icon name={ver ? 'visibility' : 'visibility_off'} box={16} size={16} />
                  </button>
                </span>
              </label>
            </div>
            <div className={styles.extras}>
              <label className={styles.mantener}>
                <input type="checkbox" className={styles.checkbox} />
                <span className="text-os-body-1">Mantener mi sesión iniciada</span>
              </label>
              <button type="button" className={`${styles.olvido} text-os-body-1`}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
          <div className={styles.acciones}>
            <button type="button" className={`${styles.iniciar} text-os-body-1`} disabled={!listo} onClick={onIngresar}>
              Iniciar sesión
            </button>
            <div className={styles.social}>
              <div className={styles.separador}>
                <span />
                <p className="text-os-body-1">O regístrate con</p>
                <span />
              </div>
              <button type="button" className={`${styles.boton} ${styles.facebook} text-os-body-1`}>
                <img src={facebook} alt="" width={24} height={24} />
                Registrarse con Facebook
              </button>
              <button type="button" className={`${styles.boton} ${styles.google} text-os-body-1`}>
                <img src={google} alt="" width={23} height={23} />
                Registrarse con Google
              </button>
              <button type="button" className={`${styles.boton} ${styles.invitado} text-os-body-1`} onClick={onInvitado}>
                <img src={invitado} alt="" width={20} height={19} />
                Continuar como invitado
              </button>
            </div>
          </div>
          <div className={styles.registro}>
            <span className="text-os-body-1">¿No tienes un cuenta? </span>
            <button type="button" className={`${styles.registrate} text-os-body-1`}>
              Regístrate aquí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
