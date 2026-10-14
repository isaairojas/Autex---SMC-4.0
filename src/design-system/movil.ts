/**
 * Vista de celular (sin respaldo en Figma, D58): por debajo de este ancho se muestra la vista móvil copiada de
 * autex.com.mx (docs/autex-real/movil). Es la regla de CSS más usada del sitio real (max-width: 768px);
 * corresponde al token --breakpoint-movil.
 */
import { useEffect, useState } from 'react';

export const CONSULTA_MOVIL = '(max-width: 768px)';

const coincide = () => typeof window !== 'undefined' && window.matchMedia(CONSULTA_MOVIL).matches;

/** true mientras la ventana mide 768 px o menos (celular). */
export function useMovil() {
  const [movil, setMovil] = useState(coincide);
  useEffect(() => {
    const consulta = window.matchMedia(CONSULTA_MOVIL);
    const alCambiar = () => setMovil(consulta.matches);
    alCambiar();
    consulta.addEventListener('change', alCambiar);
    return () => consulta.removeEventListener('change', alCambiar);
  }, []);
  return movil;
}
