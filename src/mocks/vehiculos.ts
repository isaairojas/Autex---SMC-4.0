/**
 * Vehículos para "Mis vehículos" y el buscador por vehículo (sin respaldo en Figma).
 * Réplica simplificada de autex.com.mx (captura 2026-10-06, docs/autex-real/vehiculos): Año → Marca → Modelo →
 * Motor (opcional) y el nombre "Chevrolet Aveo 2014" en el chip "Buscando para". El catálogo real tiene 87 años
 * (1941–2027) y 87 marcas; la demo usa una muestra.
 */
export type Vehiculo = { id: string; anio: string; marca: string; modelo: string; motor: string };

export const ANIOS = Array.from({ length: 30 }, (_, i) => String(2027 - i));
export const MARCAS_AUTO = ['Cadillac', 'Chevrolet', 'Ford', 'Honda', 'Nissan', 'Toyota', 'Volkswagen'];
export const MODELOS: Record<string, string[]> = {
  Cadillac: ['ATS Premium', 'CTS'],
  Chevrolet: ['Aveo', 'Aveo LS', 'Aveo LT', 'Cavalier', 'Spark'],
  Ford: ['Fiesta', 'Focus', 'Ranger'],
  Honda: ['Civic', 'City', 'CR-V'],
  Nissan: ['Versa', 'Sentra', 'March'],
  Toyota: ['Corolla', 'Yaris', 'Hilux'],
  Volkswagen: ['Jetta', 'Vento', 'Golf'],
};
/** Formato del sitio: "4 cil - 1.6L". */
export const MOTORES = ['4 cil - 1.6L', '4 cil - 2.0L', '6 cil - 3.6L'];

export const nombreVehiculo = (v: Pick<Vehiculo, 'marca' | 'modelo' | 'anio'>) => `${v.marca} ${v.modelo} ${v.anio}`;
export const idVehiculo = (v: Omit<Vehiculo, 'id'>) => [v.anio, v.marca, v.modelo, v.motor].join('|');
