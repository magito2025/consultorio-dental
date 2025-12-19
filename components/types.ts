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