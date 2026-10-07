/**
 * Clientes y ubicaciones simulados. Los valores del invitado son los textos literales de Figma
 * (Checkout - Invitado - Direccion, 397:35700).
 */
export type TipoCliente = 'invitado' | 'nuevo' | 'b2c' | 'b2b';

export type Cliente = {
  tipo: TipoCliente;
  nombre: string;
  telefono: string;
  correo: string;
  cfdi: string;
  regimen: string;
  numeroInterior: string;
  numeroExterior: string;
  entreCalle1: string;
  entreCalle2: string;
  senas: string;
  codigoPostal: string;
  colonia: string;
  ciudad: string;
  estado: string;
  /** Figma: "Ernesto Quiñonez / Taller Chapalita" (1318:95459). */
  empresa: string;
  /** Solo B2B: crédito Apymsa disponible. */
  credito?: boolean;
};

export const CLIENTE_INVITADO: Cliente = {
  tipo: 'invitado',
  nombre: 'Ernesto Quiñonez',
  telefono: '6693318596',
  correo: 'ernesto@empresa.com.mx',
  cfdi: 'G01:Adquisición de mercancías',
  regimen: 'Régimen de Actividades Empresariales y Profesionales',
  numeroInterior: 'N/A',
  numeroExterior: '1101-A',
  entreCalle1: 'C. Valentín Gómez Farías',
  entreCalle2: '1101-A',
  senas: 'Casa azul con palmeras',
  codigoPostal: '44400',
  colonia: 'Barrio La Divina Providencia',
  ciudad: 'Guadalajara',
  estado: 'Jalisco',
  empresa: 'Taller Chapalita',
};

export const CLIENTES: Record<'b2c' | 'b2b' | 'nuevo', Cliente> = {
  b2c: { ...CLIENTE_INVITADO, tipo: 'b2c' },
  b2b: { ...CLIENTE_INVITADO, tipo: 'b2b', credito: true },
  nuevo: { ...CLIENTE_INVITADO, tipo: 'nuevo' },
};

export type Ubicacion = {
  codigoPostal: string;
  /** Línea 1 del indicador del navbar. */
  etiqueta: string;
  /** Línea 2 del indicador del navbar. */
  detalle: string;
  ciudad: string;
  estado: string;
};

/** Valor que muestra el navbar en Figma. */
export const UBICACION_FIGMA: Ubicacion = {
  codigoPostal: '45412',
  etiqueta: 'Av. Periferico,45412,To...',
  detalle: 'Abierto hasta las 6:00PM',
  ciudad: 'Tonalá',
  estado: 'Jalisco',
};

export type DireccionGuardada = { id: string; nombre: string; direccion: string };

const CALZ = 'Calz del Federalismo Nte 1343 Col, Mezquitan Country, 45190 Guadalajara, Jal.';

/** Figma: 463:119946 (B2C, una dirección), 2600:106682 (B2C domicilio, varias), 2600:116110 (B2B). */
export const DIRECCIONES: Record<'b2cUna' | 'b2c' | 'b2b', DireccionGuardada[]> = {
  b2cUna: [{ id: 'd0', nombre: 'Ernesto Quiñonez', direccion: CALZ }],
  /* Autex_2026_Frames: Container 901:31850 — Dirección 1…4 */
  b2c: [
    { id: 'd1', nombre: 'Dirección 1', direccion: CALZ },
    { id: 'd2', nombre: 'Dirección 2', direccion: CALZ },
    { id: 'd3', nombre: 'Dirección 3', direccion: CALZ },
    { id: 'd4', nombre: 'Dirección 4', direccion: CALZ },
  ],
  b2b: [
    { id: 'f1', nombre: 'Ferrepara Matriz', direccion: CALZ },
    { id: 'f2', nombre: 'Ferrepara Sucursal Norte', direccion: CALZ },
  ],
};

/** Figma: Checkout - Nuevo usuario (1324:97519) usa "Carmen Ramirez". */
export const CLIENTE_NUEVO_FIGMA: Cliente = { ...CLIENTE_INVITADO, tipo: 'nuevo', nombre: 'Carmen Ramirez' };

/**
 * Direcciones de entrega guardadas del cliente registrado (sin respaldo en Figma, D33). Campos del formulario
 * "Nueva dirección" de autex.com.mx/configuracion/direcciones (captura 2026-10-06). Se eligen desde "Entrega en".
 */
export type DireccionEntrega = {
  id: string;
  nombre: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  entreCalle1: string;
  entreCalle2: string;
  senas: string;
  codigoPostal: string;
  colonia: string;
  ciudad: string;
  estado: string;
};

export const DIRECCIONES_ENTREGA: DireccionEntrega[] = [
  { id: 'taller', nombre: 'Taller Chapalita', calle: 'Av. Guadalupe', numeroExterior: '1144', numeroInterior: '', entreCalle1: 'Av. de las Rosas', entreCalle2: 'Calle Tepeyac', senas: 'Portón azul', codigoPostal: '45040', colonia: 'Chapalita', ciudad: 'Zapopan', estado: 'Jalisco' },
  { id: 'casa', nombre: 'Casa', calle: 'Calz del Federalismo Nte', numeroExterior: '1343', numeroInterior: '', entreCalle1: 'C. Valentín Gómez Farías', entreCalle2: 'C. Herrera y Cairo', senas: 'Casa azul con palmeras', codigoPostal: '44260', colonia: 'Mezquitan Country', ciudad: 'Guadalajara', estado: 'Jalisco' },
  { id: 'bodega', nombre: 'Bodega Tlaquepaque', calle: 'Av. Niños Héroes', numeroExterior: '2470', numeroInterior: 'B', entreCalle1: 'Calle Juárez', entreCalle2: 'Calle Hidalgo', senas: '', codigoPostal: '45500', colonia: 'Centro', ciudad: 'San Pedro Tlaquepaque', estado: 'Jalisco' },
  { id: 'monterrey', nombre: 'Cliente Monterrey', calle: 'Av. Constitución', numeroExterior: '400', numeroInterior: '', entreCalle1: 'Calle Zaragoza', entreCalle2: 'Calle Escobedo', senas: '', codigoPostal: '64000', colonia: 'Centro', ciudad: 'Monterrey', estado: 'Nuevo León' },
];

/** "Av. Guadalupe 1144 Int. B, Chapalita" */
export const calleCompleta = (d: Pick<DireccionEntrega, 'calle' | 'numeroExterior' | 'numeroInterior'>) =>
  `${d.calle} ${d.numeroExterior}${d.numeroInterior ? ` Int. ${d.numeroInterior}` : ''}`;
export const lineaDireccion = (d: DireccionEntrega) => `${calleCompleta(d)}, ${d.colonia}, C.P. ${d.codigoPostal}, ${d.ciudad}, ${d.estado}`;
