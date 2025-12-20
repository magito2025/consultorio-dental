export interface PiezaDental {
  numero: number; // 11-48, 51-85
  estado: 'sano' | 'caries' | 'obturado' | 'corona' | 'extraccion' | 'puente' | 'rx' | 'ausente';
  notas: string;
  precio: number;
}

export interface Pago {
  fecha: Date;
  monto: number;
  forma: 'efectivo' | 'tarjeta' | 'transferencia';
}

export interface Consulta {
  id?: string;
  pacienteId: string;
  fecha: Date;
  odontograma: PiezaDental[];
  tratamiento: string; // resumen general
  costoTotal: number;
  pagos: Pago[];
  saldo: number;
  proxCitaId?: string; // id de tu modelo Appointment
}
export const PRECIOS: Record<string, number> = {
  sano: 0,
  caries: 120,
  obturado: 150,
  corona: 450,
  extraccion: 100,
  puente: 600,
  rx: 80,
  ausente: 0,
};

export interface PiezaDental {
  numero: number;
  estado: 'sano' | 'caries' | 'obturado' | 'corona' | 'extraccion' | 'puente' | 'rx' | 'ausente';
  notas: string;
  precio: number;
}

export interface Consulta {
  id?: string;
  pacienteId: string;
  fecha: Date;
  odontograma: PiezaDental[];
  tratamiento: string;
  costoTotal: number;
  pagos: { fecha: Date; monto: number; forma: string }[];
  saldo: number;
}