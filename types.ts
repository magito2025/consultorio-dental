
export enum UserRole {
  OWNER = 'OWNER',
  SECRETARY = 'SECRETARY'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  password?: string; // Optional for security in frontend usually, but needed for mock
  lastAccess: string; // ISO Date
}

export interface Reminder {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  createdBy: string; // New field
  createdById: string; // New field
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dni: string; // Carnet de identidad
  email?: string;
  phone?: string;
  allergies: string;
  generalDescription: string;
  medicalHistory: string[]; // Antecedentes (Cardio, etc.)
  // New fields
  age?: string;
  weight?: string;
  height?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string; // ISO String
  type: 'Consulta' | 'Tratamiento' | 'Revisión' | 'Emergencia';
  status: 'Pendiente' | 'Completada' | 'Cancelada';
  notes?: string;
}

// --- NEW MODULES ---

export type TreatmentStatus = 'Planificado' | 'En Proceso' | 'Completado';

export interface Treatment {
  id: string;
  patientId: string;
  patientName: string; // Denormalized for easier display
  procedure: string; // e.g., "Endodoncia", "Limpieza"
  description: string;
  cost: number;
  status: TreatmentStatus;
  date: string;
}

export type PaymentMethod = 'Efectivo' | 'QR' | 'Tarjeta' | 'Transferencia';

export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  notes?: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalPatients: number;
  appointmentsToday: number;
  pendingAppointments: number;
}
