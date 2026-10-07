/**
 * Sucursales públicas de autex.com.mx/sucursales (capturadas el 2026-10-05, solo lectura).
 * Página sin respaldo en Figma; se usa en /sucursales.
 */
export type SucursalAutex = {
  nombre: string;
  direccion: string;
  cp: string;
  ciudad: string;
  estado: string;
  horario: string | null;
  telefono: string | null;
  pickup: boolean;
};

export const SUCURSALES_AUTEX: SucursalAutex[] = [
  {
    "nombre": "CDMX Cuauhtemoc",
    "direccion": "EJE 1 PONIENTE AV. GUERRERO #12 Col. San Simón Tolnahuac, 06920 CUAUHTEMOC, Ciudad de México",
    "cp": "06920",
    "ciudad": "Cuauhtemoc",
    "estado": "Ciudad de México",
    "horario": "08:35 A.M. - 19:00 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Mexicali Lazaro Cardenas",
    "direccion": "Boulevard Lazaro Cardenas #2619 Col. Diez División Dos, 21395 Mexicali, Baja California",
    "cp": "21395",
    "ciudad": "Mexicali",
    "estado": "Baja California",
    "horario": "08:35 A.M. - 19:00 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Tijuana la Curva",
    "direccion": "Av. Guadalupe Victoria #22532 Col. Mariano Matamoros (Centro), 22234 Tijuana, Baja California",
    "cp": "22234",
    "ciudad": "Tijuana",
    "estado": "Baja California",
    "horario": "08:35 A.M. - 19:00 P.M.",
    "telefono": "3332084444",
    "pickup": true
  },
  {
    "nombre": "Mexicali Colegio Militar",
    "direccion": "Calzada Heroica Colegio Militar #978 Col. Orizaba, 21160 Mexicali, Baja California",
    "cp": "21160",
    "ciudad": "Mexicali",
    "estado": "Baja California",
    "horario": "08:35 A.M. - 19:00 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Tijuana 5 y 10",
    "direccion": "AV. ENRIQUE SILVESTRE #14997 Col. LOS SANTOS, 22104 TIJUANA, Baja California",
    "cp": "22104",
    "ciudad": "Tijuana",
    "estado": "Baja California",
    "horario": "08:35 A.M. - 19:00 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "San Jose del Cabo",
    "direccion": "CARR. TRANSPENINSULAR #1828 Col. EL ROSARITO, 23407 LOS CABOS, Baja California Sur",
    "cp": "23407",
    "ciudad": "Los Cabos",
    "estado": "Baja California Sur",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "6241943519",
    "pickup": true
  },
  {
    "nombre": "Ciudad del Carmen",
    "direccion": "Avenida Isla de Tris #6 Col. Belisario Domínguez, 24150 Carmen, Campeche",
    "cp": "24150",
    "ciudad": "Carmen",
    "estado": "Campeche",
    "horario": "08:35 A.M. - 19:00 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Saltillo",
    "direccion": "Av. Presidente Cárdenas #1033 Ote Col. Saltillo Zona Centro, 25000 Saltillo, Coahuila de Zaragoza",
    "cp": "25000",
    "ciudad": "Saltillo",
    "estado": "Coahuila de Zaragoza",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "8444108474",
    "pickup": true
  },
  {
    "nombre": "Tuxtla Moto Partes",
    "direccion": "CALZ SAMUEL LEON BRINDIS #1170 Col. CAMINERA, 29090 1593, Chiapas",
    "cp": "29090",
    "ciudad": "1593",
    "estado": "Chiapas",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Tapachula Moto Partes",
    "direccion": "AV. CENTRAL SUR #27 Col. Tapachula Centro, 30700 Tapachula, Chiapas",
    "cp": "30700",
    "ciudad": "Tapachula",
    "estado": "Chiapas",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Comitan",
    "direccion": "Boulevard Dr Belisario Dominguez #415 Col. El Veinticinco, 30023 Comitan de Dominguez, Chiapas",
    "cp": "30023",
    "ciudad": "Comitan De Dominguez",
    "estado": "Chiapas",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Chihuahua Churubusco",
    "direccion": "AV.TECNOLOGICO #7501 Col. CHURUBUSCO, 31120 CHIHUAHUA, Chihuahua",
    "cp": "31120",
    "ciudad": "Chihuahua",
    "estado": "Chihuahua",
    "horario": "08:35 A.M. - 19:00 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Chihuahua Cuauhtemoc",
    "direccion": "Calz. 16 de Septiembre #1885 Col. San Antonio, 31530 Cuauhtémoc, Chihuahua",
    "cp": "31530",
    "ciudad": "Cuauhtémoc",
    "estado": "Chihuahua",
    "horario": "08:50 A.M. - 19:30 P.M.",
    "telefono": "6251554579",
    "pickup": true
  },
  {
    "nombre": "Ciudad Juarez Oscar Flores",
    "direccion": "Boulevard Oscar Flores Sanchez #4444 Col. Jarudo del Norte, 32652 Juárez, Chihuahua",
    "cp": "32652",
    "ciudad": "Juárez",
    "estado": "Chihuahua",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "6565412438",
    "pickup": true
  },
  {
    "nombre": "Leon Torres Landa",
    "direccion": "Boulervard Juan Jose Torres Landa #5901 Col. Fraccionamiento San Isidro, 37530 León, Guanajuato",
    "cp": "37530",
    "ciudad": "León",
    "estado": "Guanajuato",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "4772679689",
    "pickup": true
  },
  {
    "nombre": "Salamanca",
    "direccion": "Faja de oro #1308 Col. El Durazno, 36748 Salamanca, Guanajuato",
    "cp": "36748",
    "ciudad": "Salamanca",
    "estado": "Guanajuato",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Leon Moto Partes",
    "direccion": "BLVD JUAN JOSE TORRES LANDA #5903 Col. Aztecas, 37520 León, Guanajuato",
    "cp": "37520",
    "ciudad": "León",
    "estado": "Guanajuato",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Acapulco Constituyentes",
    "direccion": "Av. Constituyentes #613 Col. Progreso, 39358 Acapulco de Juárez, Guerrero",
    "cp": "39358",
    "ciudad": "Acapulco De Juárez",
    "estado": "Guerrero",
    "horario": "08:50 A.M. - 19:30 P.M.",
    "telefono": "7442613578",
    "pickup": true
  },
  {
    "nombre": "Tulancingo",
    "direccion": "Carretera Mexico-Tuxpan #225 Col. Los Álamos, 43640 Tulancingo de Bravo, Hidalgo",
    "cp": "43640",
    "ciudad": "Tulancingo De Bravo",
    "estado": "Hidalgo",
    "horario": "08:50 A.M. - 19:30 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Tesistan",
    "direccion": "Av. Juan Gil Preciado #4051 Col. Hogares de Nuevo México, 45138 Zapopan, Jalisco",
    "cp": "45138",
    "ciudad": "Zapopan",
    "estado": "Jalisco",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3336243385",
    "pickup": true
  },
  {
    "nombre": "Federalismo",
    "direccion": "Federalismo Norte #1343 Col. Mezquitan Country, 44260 Guadalajara, Jalisco",
    "cp": "44260",
    "ciudad": "Guadalajara",
    "estado": "Jalisco",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3338534113",
    "pickup": true
  },
  {
    "nombre": "Belisario Dominguez",
    "direccion": "Belisario Dominguez #654 Col. La Perla, 44360 Guadalajara, Jalisco",
    "cp": "44360",
    "ciudad": "Guadalajara",
    "estado": "Jalisco",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3336186496",
    "pickup": true
  },
  {
    "nombre": "Colon",
    "direccion": "Colon #2876 Col. Jardines de La Cruz 1a. Sección, 44950 Guadalajara, Jalisco",
    "cp": "44950",
    "ciudad": "Guadalajara",
    "estado": "Jalisco",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3333672826",
    "pickup": true
  },
  {
    "nombre": "Adolf Horn",
    "direccion": "Av. Adolf Horn #147 Col. San Juan Evangelista (San Juan), 45665 Tlajomulco de Zúñiga, Jalisco",
    "cp": "45665",
    "ciudad": "Tlajomulco De Zúñiga",
    "estado": "Jalisco",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3336014669",
    "pickup": true
  },
  {
    "nombre": "Mercado Libre Adolf Horn",
    "direccion": "Av. Adolf Bernard Horn Junior #147 Col. San Juan Evangelista (San Juan), 45665 Tlajomulco de Zuñiga, Jalisco",
    "cp": "45665",
    "ciudad": "Tlajomulco De Zuñiga",
    "estado": "Jalisco",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Forum Tlaquepaque",
    "direccion": "Boulevard Gral. Marcelino Garcia Barragan #2050 Col. Bosques del boulevard, 44899 Guadalajara , Jalisco",
    "cp": "44899",
    "ciudad": "Guadalajara",
    "estado": "Jalisco",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3323151289",
    "pickup": true
  },
  {
    "nombre": "Toluca Pino Suarez",
    "direccion": "Av. Jose Maria Pino Suarez #1517 Col. La Magdalena, 50190 Toluca, México",
    "cp": "50190",
    "ciudad": "Toluca",
    "estado": "México",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Neza",
    "direccion": "Av. Pantitlan #561 Col. General José Vicente Villada, 57710 Nezahualcóyotl, México",
    "cp": "57710",
    "ciudad": "Nezahualcóyotl",
    "estado": "México",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Ojo de Agua",
    "direccion": "Carr. #KM. 31.5 Col. Esmeralda, 55765 Tecámac, México",
    "cp": "55765",
    "ciudad": "Tecámac",
    "estado": "México",
    "horario": "08:35 A.M. - 19:00 P.M.",
    "telefono": "5590120559",
    "pickup": true
  },
  {
    "nombre": "Uruapan",
    "direccion": "Calz. Benito Juarez #34 Col. Lomas del Valle Sur, 60123 Uruapan, Michoacán de Ocampo",
    "cp": "60123",
    "ciudad": "Uruapan",
    "estado": "Michoacán de Ocampo",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "4521106139",
    "pickup": true
  },
  {
    "nombre": "Zamora",
    "direccion": "Av 5 de Mayo #673 Col. El Duero, 59690 Zamora, Michoacán de Ocampo",
    "cp": "59690",
    "ciudad": "Zamora",
    "estado": "Michoacán de Ocampo",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Escobedo Raúl Salinas Lozano",
    "direccion": "Raul Salinas Lozano #635 Col. Praderas de Girasoles, 66056 General Escobedo, Nuevo León",
    "cp": "66056",
    "ciudad": "General Escobedo",
    "estado": "Nuevo León",
    "horario": null,
    "telefono": null,
    "pickup": true
  },
  {
    "nombre": "Guadalupe",
    "direccion": "Av. Benito Juárez #100 Col. Nuevo San Sebastián, 67188 Guadalupe, Nuevo León",
    "cp": "67188",
    "ciudad": "Guadalupe",
    "estado": "Nuevo León",
    "horario": null,
    "telefono": null,
    "pickup": true
  },
  {
    "nombre": "Monterrey Ruiz",
    "direccion": "Ruiz Cortinez Oriente #2758 Col. Moderna, 64530 Monterrey, Nuevo León",
    "cp": "64530",
    "ciudad": "Monterrey",
    "estado": "Nuevo León",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "8183510627",
    "pickup": true
  },
  {
    "nombre": "Monterrey Lincoln",
    "direccion": "Abraham Lincoln #6129 Col. Paseo de las Mitras, 64118 Monterrey, Nuevo León",
    "cp": "64118",
    "ciudad": "Monterrey",
    "estado": "Nuevo León",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "8183102235",
    "pickup": true
  },
  {
    "nombre": "Apodaca",
    "direccion": "Avenida Concordia #612 Col. Ébanos IV, 66612 Apodaca, Nuevo León",
    "cp": "66612",
    "ciudad": "Apodaca",
    "estado": "Nuevo León",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "8140582670",
    "pickup": true
  },
  {
    "nombre": "Oaxaca Madero",
    "direccion": "FRANCISCO I. MADERO #1016 Col. SANTA MARIA, 68034 OAXACA DE JUAREZ, Oaxaca",
    "cp": "68034",
    "ciudad": "Oaxaca De Juarez",
    "estado": "Oaxaca",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Ciudad Valles SLP",
    "direccion": "Boulevard General Lazaro Cardenas del Rio #742 Col. Francisco I Madero, 79040 Ciudad Valles, San Luis Potosí",
    "cp": "79040",
    "ciudad": "Ciudad Valles",
    "estado": "San Luis Potosí",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "4447931749",
    "pickup": true
  },
  {
    "nombre": "Guasave",
    "direccion": "Boulevard Romualdo Ruiz Payan #265 Col. Del Bosque, 81040 Guasave, Sinaloa",
    "cp": "81040",
    "ciudad": "Guasave",
    "estado": "Sinaloa",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "6871442719",
    "pickup": true
  },
  {
    "nombre": "San Luis Rio Colorado",
    "direccion": "Av. Obregon y calle 10 #1000 Col. Comercial, 83449 San Luis Río Colorado, Sonora",
    "cp": "83449",
    "ciudad": "San Luis Río Colorado",
    "estado": "Sonora",
    "horario": "08:35 A.M. - 19:00 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Hermosillo Quiroga",
    "direccion": "Av. Quiroga #144 Col. El llanito, 83174 Hermosillo, Sonora",
    "cp": "83174",
    "ciudad": "Hermosillo",
    "estado": "Sonora",
    "horario": "08:35 A.M. - 19:00 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Hermosillo Periferico",
    "direccion": "Periferico Norte #. Col. Puesta del Sol, 83136 Hermosillo, Sonora",
    "cp": "83136",
    "ciudad": "Hermosillo",
    "estado": "Sonora",
    "horario": "08:35 A.M. - 19:00 P.M.",
    "telefono": "3332084440",
    "pickup": true
  },
  {
    "nombre": "Tampico 2 Centro",
    "direccion": "Av. Hidalgo #911 Col. Rosario, 89176 Tampico, Tamaulipas",
    "cp": "89176",
    "ciudad": "Tampico",
    "estado": "Tamaulipas",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "8332193491",
    "pickup": true
  },
  {
    "nombre": "Nuevo Laredo",
    "direccion": "Av. Cesar Lopez de Lara #3739 Col. Jardín, 88260 Nuevo Laredo, Tamaulipas",
    "cp": "88260",
    "ciudad": "Nuevo Laredo",
    "estado": "Tamaulipas",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "8677155176",
    "pickup": true
  },
  {
    "nombre": "Tampico 1 Norte",
    "direccion": "Carr. Tampico-Mante #1110 Col. Las Américas, 89329 Tampico, Tamaulipas",
    "cp": "89329",
    "ciudad": "Tampico",
    "estado": "Tamaulipas",
    "horario": "08:35 A.M. - 19:30 P.M.",
    "telefono": "8332275968",
    "pickup": true
  },
  {
    "nombre": "Veracruz Diaz Miron",
    "direccion": "AV. SALVADOR DIAZ MIRON #2068 Col. MODERNO, 91918 VERACRUZ, Veracruz de Ignacio de la Llave",
    "cp": "91918",
    "ciudad": "Veracruz",
    "estado": "Veracruz de Ignacio de la Llave",
    "horario": "08:35 A.M. - 19:00 P.M.",
    "telefono": "3332084440",
    "pickup": true
  }
];
