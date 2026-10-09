/**
 * Figma: Footer (componente 38:98638, instancia 125:65118)
 * URL: https://www.figma.com/design/qp14Mbl7khZF2xWAwaocfP/?node-id=125-65118
 * Variante 2026 (Autex_2026_Frames, instancia 677:18917, 1920×491): padding 40/80, contactos sin prefijo,
 * "AUTEX 2023" y TikTok en lugar de WhatsApp.
 * Última sincronización: 2026-10-05
 */
import { Link } from 'react-router-dom';
import logo from '../../../assets/icons/autex-logo-footer.svg';
import visa from '../../../assets/icons/payment-method-visa.svg';
import amex from '../../../assets/icons/payment-method-amex.svg';
import mastercard from '../../../assets/icons/mastercard.svg';
import facebook from '../../../assets/icons/icon-facebook.svg';
import instagram from '../../../assets/icons/icon-instagram.svg';
import whatsapp from '../../../assets/icons/icon-whatsapp.svg';
import tiktok from '../../../assets/icons/icon-tiktok.svg';
import styles from './Footer.module.css';

const COLUMNS = [
  { title: 'Acerca de Autex', links: ['Términos y condiciones', '¿Quiénes somos?', 'Bolsa de trabajo', 'Aviso de privacidad'] },
  { title: 'Ayuda', links: ['Preguntas frecuentes', 'Facturación', 'Garantías y Devoluciones', '¿Cómo comprar en Autex?'] },
  { title: 'Contáctanos', links: ['Teléfono 33 3208 4440', 'WhatsApp 33 2835 9694', 'contacto@autex.com.mx', 'Localiza tu tienda'] },
];

/* Páginas de autex.com.mx replicadas en la demo (sin respaldo en Figma). */
const RUTAS_FOOTER: Record<string, string> = { 'Localiza tu tienda': '/sucursales', '¿Cómo comprar en Autex?': '/como-comprar' };

const COLUMNS_2026 = [
  COLUMNS[0],
  { title: 'Ayuda', links: ['Preguntas frecuentes', 'Facturación', 'Garantías y devoluciones', '¿Cómo comprar en Autex?'] },
  { title: 'Contáctanos', links: ['33 3208 4440', '33 2835 9694', 'contacto@autex.com.mx', 'Localiza tu tienda'] },
];

/** sitio (D57): el mismo año en todas las pantallas (el actual); la galería conserva "AUTEX 2023" / "AUTEX 2022" de Figma. */
export function Footer({ version2026 = false, sitio = false }: { version2026?: boolean; sitio?: boolean }) {
  const columnas = version2026 ? COLUMNS_2026 : COLUMNS;
  return (
    <footer className={styles.footer}>
      <div className={version2026 ? `${styles.main} ${styles.main2026}` : styles.main}>
        <div className={styles.brand}>
          <img src={logo} alt="AUTEX" />
        </div>
        <div className={styles.content}>
          {columnas.map((c) => (
            <div key={c.title} className={styles.column}>
              <p className={`${styles.title} text-subheadline-medium`}>{c.title}</p>
              <div className={styles.list}>
                {c.links.map((l) =>
                  RUTAS_FOOTER[l] ? (
                    <Link key={l} to={RUTAS_FOOTER[l]} className={`${styles.link} text-body-1-book`}>
                      {l}
                    </Link>
                  ) : (
                    <span key={l} className={`${styles.link} text-body-1-book`}>
                      {l}
                    </span>
                  ),
                )}
              </div>
            </div>
          ))}
          <div className={styles.columnFixed}>
            <p className={`${styles.title} text-subheadline-medium`}>Descargables</p>
            <div className={styles.list}>
              <span className={`${styles.link} text-body-1-book`}>Revista mensual</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.legal}>
        <p className={`${styles.legalText} text-body-2-book`}>
          Derechos Reservados <span className="text-body-2-medium">{sitio ? `AUTEX ${new Date().getFullYear()}` : version2026 ? 'AUTEX 2023' : 'AUTEX 2022'}</span>.
        </p>
        <div className={styles.payment}>
          <span className="text-body-2-book">Métodos de pago</span>
          <div className={styles.payments}>
            <img src={visa} alt="Visa" className={styles.pay} />
            <img src={amex} alt="American Express" className={styles.pay} />
            <span className={styles.payMaster}>
              <img src={mastercard} alt="Mastercard" />
            </span>
          </div>
        </div>
        <div className={styles.social}>
          <span className="text-caption-book">Síguenos</span>
          <div className={styles.socialButtons} style={version2026 ? { alignItems: 'center' } : undefined}>
            <img src={facebook} alt="Facebook" width={24} height={24} />
            <img src={instagram} alt="Instagram" width={24} height={24} />
            {version2026 ? (
              <img src={tiktok} alt="TikTok" width={14} height={16} />
            ) : (
              <img src={whatsapp} alt="WhatsApp" width={24} height={24} />
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
