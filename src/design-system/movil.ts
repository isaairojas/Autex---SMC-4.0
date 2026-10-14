/**
 * Vista de celular (sin respaldo en Figma, D58): por debajo de este ancho se muestra la vista móvil copiada de
 * autex.com.mx (docs/autex-real/movil). Es la regla de CSS más usada del sitio real (max-width: 768px);
 * corresponde al token --breakpoint-movil.
 */
import { useEffect, useState } from 'react';

/** D59: también el celular acostado (táctil y de poca altura), que mide más de 768 px de ancho. */
export const CONSULTA_MOVIL = '(max-width: 768px), (pointer: coarse) and (max-height: 500px)';

const coincide = () => typeof window !== 'undefined' && window.matchMedia(CONSULTA_MOVIL).matches;

/** true en celular: ventana de 768 px o menos, o celular acostado. */
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
