/**
 * Imágenes para especialidades y categorías: se reutilizan las imágenes de producto descargadas de Figma
 * (regla 5 de docs/design-system/rules.md). Sin imagen se usa un glifo de Material Icons.
 */
import inyector from '../../assets/images/producto-inyector.png';
import alternador from '../../assets/images/producto-alternador.png';
import faro from '../../assets/images/producto-faro.png';
import filtro from '../../assets/images/producto-filtro-aire.png';
import ventilador from '../../assets/images/producto-ventilador.png';
import marcha from '../../assets/images/producto-marcha.png';
import cuerpo from '../../assets/images/producto-cuerpo-aceleracion.png';
import moduloBomba from '../../assets/images/producto-modulo-bomba.png';
import switchLuces from '../../assets/images/producto-switch-luces.png';
import bateria from '../../assets/images/producto-bateria-duralast.png';
import clutch from '../../assets/images/producto-kit-clutch-sachs.png';
import bujia from '../../assets/images/producto-bujia-autolite-plp.png';

export const IMAGEN_ESPECIALIDAD: Record<string, string | { icono: string }> = {
  Automotriz: alternador,
  Ferreteria: { icono: 'hardware' },
  'Herramientas y equipos': { icono: 'handyman' },
  Motocicletas: { icono: 'two_wheeler' },
  'Seguridad y prevencion': { icono: 'health_and_safety' },
};

export const IMAGEN_CATEGORIA: Record<string, string> = {
  Acumuladores: bateria,
  'Enfriamiento y aire acondicionado': ventilador,
  'Mantenimiento de rutina': filtro,
  'Refacciones de iluminacion': faro,
  'Refacciones de motor': cuerpo,
  'Refacciones de transmision': clutch,
  'Refacciones del sistema de inyeccion': inyector,
  'Refacciones electricas arranque y carga': marcha,
  Seguridad: switchLuces,
  Prevencion: bujia,
  Carroceria: moduloBomba,
};
