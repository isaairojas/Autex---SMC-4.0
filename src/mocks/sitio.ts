/**
 * Contenido público de autex.com.mx capturado el 2026-10-05 (solo lectura) para las páginas
 * sin respaldo en Figma: inicio, catálogo de especialidades, búsqueda por marca y ofertas.
 */
export const ESPECIALIDADES: string[] = ["Automotriz", "Ferreteria", "Herramientas y equipos", "Motocicletas", "Seguridad y prevencion"];

/** Categorías por especialidad (autex.com.mx/catalogo). */
export const CATEGORIAS: Record<string, string[]> = {
  "Automotriz": [
    "Accesorios",
    "Acumuladores",
    "Audio y multimedia",
    "Carroceria",
    "Enfriamiento y aire acondicionado",
    "Limpieza y cuidado automotriz",
    "Mantenimiento de rutina",
    "Prevencion",
    "Refacciones de iluminacion",
    "Refacciones de motor",
    "Refacciones de transmision",
    "Refacciones del sistema de inyeccion",
    "Refacciones electricas arranque y carga",
    "Seguridad",
    "Suspension direccion y frenos"
  ],
  "Ferreteria": [
    "Materiales electricos",
    "Materiales varios"
  ],
  "Herramientas y equipos": [
    "Herramientas automotrices",
    "Herramientas manuales",
    "Herramientas para motor",
    "Soldadura y herreria"
  ],
  "Motocicletas": [
    "Accesorios"
  ],
  "Seguridad y prevencion": [
    "Seguridad laboral",
    "Seguridad personal"
  ]
};

/** Marcas por letra (autex.com.mx/busqueda-marca). */
export const MARCAS_POR_LETRA: Record<string, string[]> = {
  "0-9": [
    "3 en 1",
    "3M"
  ],
  "A": [
    "AC DELCO",
    "ACOSA",
    "ACTRON",
    "AIRTEX",
    "AMETEK",
    "ANCO",
    "AREON",
    "ARMOR ALL",
    "ARROW",
    "ATS",
    "ATS1",
    "AUMA",
    "AUTEK",
    "Autolite",
    "AUTOOL",
    "AUTOPAL",
    "AXPRO"
  ],
  "B": [
    "BERU",
    "BIKALL",
    "BLACK & DECKER",
    "BOSCH",
    "BOSCH",
    "BRASLUX",
    "BRËSSER LKW",
    "BRG"
  ],
  "C": [
    "CARFAN",
    "CARFAN MV",
    "CARFAN POLEAS",
    "CARFAN REFRIGERANTE",
    "CARLING",
    "CARTER",
    "CMC",
    "COLE HERSEE",
    "CONTINENTAL",
    "CRC",
    "CUB"
  ],
  "D": [
    "DAEWOO",
    "DB DRIVE",
    "DELPHI",
    "DENSO",
    "DEPO",
    "DETROIT DIESEL",
    "DEUTSCH",
    "DEWALT",
    "DIRCO",
    "DNI",
    "DOGA",
    "DORMAN",
    "DYNAMIC"
  ],
  "E": [
    "ECCO",
    "ECHLIN",
    "EIKO",
    "ELCA",
    "ELECTREY",
    "ELVAC",
    "EMBRAGUES VALEO",
    "EVERLASTING",
    "EXIDE"
  ],
  "F": [
    "FIAMM",
    "FIRESTONE",
    "FLOSSER",
    "FLOTAMEX"
  ],
  "G": [
    "GARLO",
    "GAUSS",
    "GE",
    "GENETRON",
    "GOODYEAR",
    "GROB",
    "GROTE"
  ],
  "H": [
    "HDLT",
    "HELLA",
    "HELLA HD",
    "HORIZON",
    "HQL"
  ],
  "I": [
    "IAM",
    "IMPORTADO",
    "INDUTEC",
    "INNOVA",
    "INTERFIL",
    "INYECTO MOTRIZ"
  ],
  "J": [
    "JALTEST",
    "JENSEN",
    "JULS CARMAN",
    "JUST PARTS"
  ],
  "K": [
    "KENWOOD",
    "KOSTAL",
    "KRUG"
  ],
  "L": [
    "LAUNCH",
    "LEECE-NEVILLE",
    "LITTLE TREE",
    "LOMBRA",
    "LTH",
    "LUCAS",
    "LUCIDITY"
  ],
  "M": [
    "MAGNETI MARELLI",
    "MANDO",
    "MARGREY",
    "MARILIA",
    "MIKELS",
    "MOBIL",
    "MOMO",
    "MOTORAD",
    "MTE-THOMSON"
  ],
  "N": [
    "Nacional",
    "NEOLITE",
    "NEW ERA",
    "NEWSTAR",
    "NIPON",
    "NOVITA",
    "NTN"
  ],
  "O": [
    "OEM",
    "OSRAM",
    "OTC SPX",
    "Outlet",
    "OVERSTOCK"
  ],
  "P": [
    "PAI",
    "PENNZOIL",
    "PHILLIPS",
    "PIONEER",
    "PLASTICOS RECORD",
    "POLLAK",
    "POLTEK",
    "PRESTO",
    "PRESTOLITE",
    "PRICOL",
    "PUROLATOR"
  ],
  "Q": [
    "QUAKER STATE"
  ],
  "R": [
    "RCP",
    "REGITAR",
    "REIDEN",
    "REMAN",
    "REMY",
    "REWARD"
  ],
  "S": [
    "SCHUMACHER",
    "SCUDA",
    "SHURFLO",
    "SIN MARCA",
    "SONY",
    "SPA",
    "SPRAGUE",
    "ST MARY´S",
    "STABILUS",
    "STANDARD",
    "STANLEY",
    "STAR",
    "STEREN",
    "SYLVANIA"
  ],
  "T": [
    "TDINTEL",
    "TECNOFUEL",
    "TECNOFUEL BOBINAS",
    "TECNOFUEL-EFI",
    "TECNOFUEL-OEM",
    "TECNOFUEL-QUIMICOS",
    "TECNOLAMP",
    "TOMCO",
    "TRAKTOLAMP",
    "TRANSPO",
    "Turtle Wax"
  ],
  "U": [],
  "V": [
    "VALEO",
    "VALUE",
    "VALUE-ALTERNADOR",
    "VALUE-BH",
    "VALUE-EM",
    "VALUE-MARCHAS",
    "VALUE-SL",
    "VDO",
    "VEHTEC",
    "VENDELL",
    "VERZE",
    "VSM"
  ],
  "W": [
    "WAGNER",
    "WAHLER",
    "WAIGEER",
    "WALBRO",
    "WALKER",
    "WD-40",
    "WEISCHLER",
    "WELLS"
  ],
  "X": [
    "XHORSE",
    "XTOOL"
  ],
  "Y": [],
  "Z": [
    "ZEN",
    "ZIZU",
    "ZM",
    "ZZlibre7"
  ]
};
