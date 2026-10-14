/**
 * SIN RESPALDO EN FIGMA (D58): pie de página y botón flotante de WhatsApp de autex.com.mx en celular, copiados del
 * sitio real (docs/autex-real/movil: capturas *-completa y medidas/pie-*.png; medidas en medidas/medidas.json, "pie").
 * Secciones plegables (Ant Menu) con "Contáctanos" abierta al cargar; abajo derechos, métodos de pago y redes.
 * Teléfonos y año como en el pie de escritorio de la demo (D57).
 * Última revisión contra el sitio: 2026-10-09
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import telefonoIcono from '../../../assets/movil/pie-telefono.svg';
import whatsappIcono from '../../../assets/movil/pie-whatsapp.svg';
import correoIcono from '../../../assets/movil/pie-correo.svg';
import ubicacionIcono from '../../../assets/movil/pie-ubicacion.svg';
import visa from '../../../assets/movil/pago-visa.svg';
import amex from '../../../assets/movil/pago-amex.svg';
import mastercard from '../../../assets/movil/pago-mastercard.svg';
import facebook from '../../../assets/movil/red-facebook.svg';
import instagram from '../../../assets/movil/red-instagram.svg';
import tiktok from '../../../assets/movil/red-tiktok.svg';
import whatsappFlotante from '../../../assets/movil/whatsapp-flotante.svg';
import styles from './PieMovil.module.css';

type Elemento = { texto: string; ruta?: string; icono?: string };

type PieMovilProps = {
  telefono: string;
  whatsapp: string;
};

export function PieMovil({ telefono, whatsapp }: PieMovilProps) {
  const navigate = useNavigate();
  const [abiertas, setAbiertas] = useState<string[]>(['Contáctanos']);
  const secciones: { titulo: string; elementos: Elemento[] }[] = [
    {
      titulo: 'Acerca de Autex',
      elementos: [{ texto: 'Términos y condiciones' }, { texto: '¿Quiénes somos?' }, { texto: 'Bolsa de trabajo' }, { texto: 'Aviso de Privacidad' }],
    },
    {
      titulo: 'Ayuda',
      elementos: [
        { texto: 'Preguntas frecuentes' },
        { texto: 'Facturación' },
        { texto: 'Garantías y Devoluciones' },
        { texto: '¿Cómo comprar en Autex?', ruta: '/como-comprar' },
      ],
    },
    { titulo: 'Descargables', elementos: [{ texto: 'Revista mensual' }] },
    {
      titulo: 'Contáctanos',
      elementos: [
        { texto: telefono, icono: telefonoIcono },
        { texto: whatsapp, icono: whatsappIcono },
        { texto: 'contacto@autex.com.mx', icono: correoIcono },
        { texto: 'Localiza tu tienda', icono: ubicacionIcono, ruta: '/sucursales' },
      ],
    },
  ];
  const alternar = (t: string) => setAbiertas((a) => (a.includes(t) ? a.filter((x) => x !== t) : [...a, t]));
  return (
    <footer className={styles.pie}>
      <ul className={styles.secciones}>
        {secciones.map(({ titulo, elementos }) => {
          const abierta = abiertas.includes(titulo);
          return (
            <li key={titulo}>
              <button type="button" className={`${styles.titulo} text-movil-14-40`} onClick={() => alternar(titulo)} aria-expanded={abierta}>
                {titulo}
                <i className={abierta ? `${styles.flecha} ${styles.flechaAbierta}` : styles.flecha} aria-hidden />
              </button>
              {abierta && (
                <ul className={styles.submenu}>
                  {elementos.map(({ texto, ruta, icono }) => (
                    <li key={texto}>
                      <button
                        type="button"
                        className={`${styles.elemento} text-movil-14-40`}
                        onClick={ruta ? () => navigate(ruta) : undefined}
                        disabled={!ruta}
                      >
                        {icono && <img src={icono} alt="" width={27} height={27} />}
                        <span className={icono ? styles.conIcono : undefined}>{texto}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      <div className={styles.legal}>
        <p className={styles.derechos}>
          <span className="text-movil-12-20">
            Derechos reservados <strong className="text-movil-12-20-medium">AUTEX {new Date().getFullYear()}</strong>
          </span>
        </p>
        <div className={styles.pagos}>
          <span className="text-movil-14-22">Métodos de pago</span>
          <span className={styles.tarjetas}>
            <img src={visa} alt="Visa" width={35} height={24} />
            <img src={amex} alt="American Express" width={35} height={24} />
            <img src={mastercard} alt="Mastercard" width={35} height={24} />
          </span>
        </div>
        <div className={styles.redes}>
          <span className="text-movil-12-20">Síguenos</span>
          <img src={facebook} alt="Facebook" width={24} height={24} />
          <img src={instagram} alt="Instagram" width={24} height={24} />
          <img src={tiktok} alt="TikTok" width={14} height={17} />
        </div>
      </div>
    </footer>
  );
}

/** Botón flotante de WhatsApp (abajo a la derecha en todas las páginas del sitio en celular). */
export function WhatsappFlotante({ numero }: { numero: string }) {
  return (
    <a className={styles.whatsapp} href={`https://wa.me/${numero.replace(/\s/g, '')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">
      <img src={whatsappFlotante} alt="" width={27} height={27} />
    </a>
  );
}
