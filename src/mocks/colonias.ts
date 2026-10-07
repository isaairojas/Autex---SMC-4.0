/**
 * Colonias por código postal para el formulario "Nueva dirección" (sin respaldo en Figma, D33).
 * 45138: lista de autex.com.mx (captura 2026-10-06, 52 colonias). El resto son ejemplos; sin catálogo de SEPOMEX,
 * un C.P. desconocido ofrece solo "Centro".
 */
export const COLONIAS: Record<string, string[]> = {
  '45138': ['Armonía Hábitat', 'Base Aérea Militar No. 5', 'Colegio Del Aire', 'El Fresno', 'El Olivo', 'El Olivo Coto Residencial', 'El Real', 'El Secreto', 'El Triángulo', 'Esencia Residencial', 'Ex Hacienda de La Mora', 'Flores del Valle', 'Girasoles Acueducto', 'Girasoles Elite', 'Héroes Nacionales', 'hogares de nuevo mex', 'Hogares de Nuevo México', 'Jardines de Las Fuentes', 'Jardines de Nuevo México', 'Jardines de San Antonio', 'Jardines de Santa Margarita', 'Jardines Del Valle', 'Jardines San Francisco', 'Juan Manuel Ruvalcaba', 'La Casita', 'La Noria Residencial', 'La Tuzania', 'Las Bóvedas', 'Los Mandarinos', 'Lucero del Valle', 'Luis Donaldo Colosio', 'Militar Zapopan', 'Misión Del Valle', 'Misión Del Valle 2', 'Misión del Valle II', 'Misión Jardines', 'Nuevo México', 'Pacífica Habitat', 'Parques de Zapopan', 'Praderas de San Antonio', 'Puerta Laurel', 'Real Del Parque', 'Residencial Militar', 'Residencial Santa Fe', 'Rinconada de Los Fresnos', 'Rinconada del Aire', 'Rinconadas de Zapopan', 'Santa Margarita Residencial', 'V Región Militar', 'Valle Esmeralda', 'Villas de Nuevo México', 'Viveros del Valle'],
  '45040': ['Chapalita', 'Chapalita Inn', 'Jardines de Guadalupe'],
  '44260': ['Mezquitan Country', 'Mezquitán', 'Alcalde Barranquitas'],
  '45500': ['Centro', 'San Pedro Tlaquepaque Centro'],
  '44100': ['Centro', 'Guadalajara Centro'],
  '44400': ['Barrio La Divina Providencia', 'Oblatos'],
  '64000': ['Centro', 'Monterrey Centro'],
};

export const coloniasDe = (cp: string) => COLONIAS[cp] ?? ['Centro'];
