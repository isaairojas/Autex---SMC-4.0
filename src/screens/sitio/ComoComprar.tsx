/**
 * SIN RESPALDO EN FIGMA. Réplica de autex.com.mx/como-comprar (2026-10-05): encabezado azul, 4 pasos,
 * beneficios, "Comenzar a comprar", preguntas frecuentes y ayuda. Las fotos del sitio se sustituyen por
 * íconos de Material Icons (regla 5: solo imágenes de Figma).
 */
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/atoms/Button';
import { Icon } from '../../design-system/components/atoms/Icon';
import { PageShell } from '../PageShell';
import styles from './Sitio.module.css';

const PASOS = [
  { icono: 'search', titulo: 'Busca el producto que necesitas', texto: 'Ingresa los detalles de tu vehículo o el nombre de la pieza. Nuestro buscador te ofrecerá resultados precisos según la compatibilidad.', visual: 'directions_car' },
  { icono: 'shopping_cart', titulo: 'Agrega productos a tu carrito', texto: 'Agrega las piezas que necesitas y ajusta cantidades cuando quieras. Puedes seguir navegando el catálogo; tu carrito te espera.', visual: 'add_shopping_cart' },
  { icono: 'credit_card', titulo: 'Paga con confianza', texto: 'Ingresa tus datos de envío y elige tu método de pago preferido. Aceptamos tarjetas de crédito, débito y transferencias bancarias.', visual: 'payments' },
  { icono: 'inventory_2', titulo: 'Rastrea y recibe tu pedido', texto: 'Verifica el estado de tu pedido en tiempo real. Recibe tu pedido de 3 a 5 días hábiles, o si lo prefieres, puedes recogerlo en cualquiera de nuestras sucursales.', visual: 'local_shipping' },
];
const BENEFICIOS = [
  { icono: 'check', titulo: 'Productos originales y compatibles', texto: 'Todos nuestros artículos son originales y cuentan con garantía directa de fabricante.' },
  { icono: 'schedule', titulo: 'Entrega rápida y rastreable', texto: 'Recibe tu pedido de 3 a 5 días hábiles o recoge en cualquiera de nuestras sucursales.' },
  { icono: 'credit_card', titulo: 'Pago 100% seguro', texto: 'Tus datos están protegidos con tecnología de encriptación de última generación.' },
];
const FAQ = [
  ['¿Puedo cancelar mi pedido?', 'Sí. Puedes cancelar tu pedido siempre que aún no haya sido preparado o enviado. Si necesitas hacerlo, comunícate con nuestro equipo de atención al cliente lo antes posible para revisar el estatus de tu compra.'],
  ['¿Cómo puedo obtener la factura de mi compra?', 'Es muy sencillo. Ingresa al módulo de Facturación desde tu cuenta, captura los datos fiscales solicitados y descarga tu factura electrónica en minutos.'],
  ['¿Qué hago si recibo un producto dañado o incorrecto?', 'Todos nuestros productos cuentan con 90 días de garantía. Si tu pedido llegó dañado, incompleto o recibiste una pieza diferente a la solicitada, contáctanos de inmediato para ayudarte con el proceso de cambio o devolución.'],
  ['¿Autex cuenta con sucursales físicas?', 'Sí. Contamos con más de 100 sucursales en todo México. Visita la sección Sucursales para encontrar la ubicación más cercana y consultar sus horarios de atención.'],
];

export function ComoComprar() {
  const navigate = useNavigate();
  return (
    <PageShell version2026 enlaceActivo={null}>
      <div className={styles.contenido} style={{ width: 1360 }}>
        <section className={styles.heroAzul}>
          <h1 className="text-heading-3-book" style={{ margin: 0 }}>
            Compra en Autex fácil y seguro
          </h1>
          <p className="text-subheadline-book">Sin adivinar compatibilidad, sin preocupaciones. Así funciona comprar refacciones originales en Autex, de principio a fin.</p>
        </section>

        <section className={styles.pasos}>
          {PASOS.map((p, i) => (
            <div key={p.titulo} className={i % 2 ? `${styles.paso} ${styles.pasoInvertido}` : styles.paso}>
              <div className={styles.pasoVisual}>
                <span className={`${styles.pasoNumero} text-subheadline-medium`}>{i + 1}</span>
                <Icon name={p.visual} box={140} size={140} color="var(--color-primary-300)" />
              </div>
              <div className={styles.pasoTexto}>
                <p className={`${styles.pasoTitulo} text-headline-medium`}>
                  <Icon name={p.icono} color="var(--color-primary-400)" />
                  {p.titulo}
                </p>
                <p className={`${styles.gris} text-body-1-book`}>{p.texto}</p>
              </div>
            </div>
          ))}
        </section>

        <section className={styles.caja}>
          <h2 className="text-headline-medium" style={{ margin: 0, textAlign: 'center' }}>
            Beneficios de comprar en AUTEX
          </h2>
          <div className={styles.tresColumnas}>
            {BENEFICIOS.map((b) => (
              <div key={b.titulo}>
                <Icon name={b.icono} box={48} size={28} color="var(--color-primary-400)" />
                <p className="text-body-1-medium">{b.titulo}</p>
                <p className={`${styles.gris} text-body-2-book`}>{b.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.centro}>
          <Button onClick={() => navigate('/')}>Comenzar a comprar</Button>
        </div>

        <section className={styles.caja}>
          <h2 className="text-headline-medium">Preguntas frecuentes</h2>
          {FAQ.map(([pregunta, respuesta]) => (
            <div key={pregunta}>
              <p className="text-body-1-medium">{pregunta}</p>
              <p className={`${styles.gris} text-body-2-book`}>
                {pregunta.includes('sucursales') ? (
                  <>
                    Sí. Contamos con más de 100 sucursales en todo México. Visita la sección <Link to="/sucursales">Sucursales</Link> para encontrar la ubicación
                    más cercana y consultar sus horarios de atención.
                  </>
                ) : (
                  respuesta
                )}
              </p>
            </div>
          ))}
        </section>

        <section className={styles.caja} style={{ background: 'var(--color-primary-50)', textAlign: 'center' }}>
          <h2 className="text-headline-medium">¿Necesitas ayuda?</h2>
          <p className={`${styles.gris} text-body-1-book`}>Nuestro equipo está disponible para ayudarte de lunes a viernes de 9:00 a 18:00 hrs</p>
          <div className={styles.centro}>
            <a href="tel:3332084440" style={{ textDecoration: 'none' }}>
              <Button icon={<Icon name="call" color="var(--color-nativo-blanco)" />}>Llamar: 33 3208 4440</Button>
            </a>
            <a href="https://api.whatsapp.com/send?phone=3316025603" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="outline" icon={<Icon name="chat" color="var(--color-green-700)" />}>
                WhatsApp
              </Button>
            </a>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
