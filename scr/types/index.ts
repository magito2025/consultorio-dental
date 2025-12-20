// types/index.ts
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  ci: string;
  phone: string;
  email: string;
  debt?: number;
}

export interface ProcedureItem {
  id: string;
  name: string;
  price: number;
}

export interface PiezaDental {
  numero: number;
  estado: 'sano' | 'caries' | 'obturado' | 'corona' | 'extraccion' | 'puente' | 'rx' | 'ausente';
  notas: string;
  precio: number;
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

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: string;
  status: string;
}