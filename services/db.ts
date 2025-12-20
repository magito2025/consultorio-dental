
import { User, UserRole, Patient, Appointment, Payment, Treatment, Reminder, TreatmentStatus, PaymentMethod, ProcedureItem } from '../types';

// Initial Mock Data
const DEFAULT_USERS: User[] = [
  { id: '1', username: 'admin', name: 'Dr. Taboada (Director)', role: UserRole.PRINCIPAL, password: 'admin', lastAccess: new Date().toISOString() },
  { id: '2', username: 'doc1', name: 'Dra. Vargas', role: UserRole.DOCTOR, password: '123', lastAccess: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', username: 'recepcion', name: 'Secretaría General', role: UserRole.STAFF, password: '123', lastAccess: new Date(Date.now() - 86400000).toISOString() },
];

// --- MOCK DATA GENERATION ---
const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today); dayAfter.setDate(dayAfter.getDate() + 2);
const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);

const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7);
const twoWeeksAgo = new Date(today); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
const lastMonth = new Date(today); lastMonth.setMonth(lastMonth.getMonth() - 1);
const twoMonthsAgo = new Date(today); twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
const threeMonthsAgo = new Date(today); threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

// Defaults for System Configuration
const DEFAULT_PROCEDURES: ProcedureItem[] = [
    { id: 'proc1', name: "Consulta General", price: 100 },
    { id: 'proc2', name: "Limpieza Dental", price: 250 },
    { id: 'proc3', name: "Endodoncia", price: 800 },
    { id: 'proc4', name: "Extracción Simple", price: 200 },
    { id: 'proc5', name: "Extracción Muela Juicio", price: 500 },
    { id: 'proc6', name: "Blanqueamiento", price: 600 },
    { id: 'proc7', name: "Ortodoncia (Mensualidad)", price: 350 },
    { id: 'proc8', name: "Prótesis", price: 1500 },
    { id: 'proc9', name: "Implante", price: 3500 },
    { id: 'proc10', name: "Curación", price: 150 }
];

const DEFAULT_REASONS: string[] = [
    "Revisión General",
    "Limpieza Dental",
    "Dolor de Muela",
    "Extracción",
    "Ortodoncia",
    "Blanqueamiento",
    "Prótesis",
    "Estética"
];

// --- EXPANDED PATIENT LIST (14 Patients) ---
const DEFAULT_PATIENTS: Patient[] = [
  { id: '1', firstName: 'Juan', lastName: 'Pérez', dni: '8493021 LP', gender: 'Masculino', civilStatus: 'Casado/a', occupation: 'Arquitecto', allergies: 'Penicilina, Mani', generalDescription: 'Sensibilidad dental generalizada.', medicalHistory: ['Hipertensión'], currentMedications: [{ name: 'Losartan', dosage: '50mg', frequency: 'Cada 12h' }], age: '34', weight: '75', height: '175', createdAt: lastMonth.toISOString() },
  { id: '2', firstName: 'Maria', lastName: 'Gonzales', dni: '5930212 SC', gender: 'Femenino', civilStatus: 'Soltero/a', occupation: 'Abogada', allergies: 'Ninguna', generalDescription: 'Control de ortodoncia.', medicalHistory: [], age: '28', weight: '60', height: '160', createdAt: lastMonth.toISOString() },
  { id: '3', firstName: 'Carlos', lastName: 'Mamani', dni: '4839201 LP', gender: 'Masculino', civilStatus: 'Casado/a', occupation: 'Comerciante', allergies: 'Polvo', generalDescription: 'Dolor en molar inferior.', medicalHistory: ['Diabetes'], age: '45', weight: '82', height: '170', createdAt: twoWeeksAgo.toISOString() },
  { id: '4', firstName: 'Ana', lastName: 'Vargas', dni: '3948201 CB', gender: 'Femenino', civilStatus: 'Soltero/a', occupation: 'Estudiante', allergies: 'Ninguna', generalDescription: 'Ortodoncia en curso.', medicalHistory: [], age: '19', weight: '55', height: '165', createdAt: twoWeeksAgo.toISOString() },
  { id: '5', firstName: 'Pedro', lastName: 'Salinas', dni: '9302193 OR', gender: 'Masculino', civilStatus: 'Divorciado/a', occupation: 'Ingeniero', allergies: 'Aines', generalDescription: 'Extracción programada.', medicalHistory: ['Coagulación'], age: '50', weight: '80', height: '172', createdAt: lastWeek.toISOString() },
  { id: '6', firstName: 'Lucia', lastName: 'Fernandez', dni: '1029384 LP', gender: 'Femenino', civilStatus: 'Soltero/a', occupation: 'Diseñadora', allergies: 'Ninguna', generalDescription: 'Blanqueamiento.', medicalHistory: [], age: '25', weight: '58', height: '158', createdAt: lastWeek.toISOString() },
  { id: '7', firstName: 'Roberto', lastName: 'Justiniano', dni: '5647382 SC', gender: 'Masculino', civilStatus: 'Viudo/a', occupation: 'Jubilado', allergies: 'Latex', generalDescription: 'Prótesis superior.', medicalHistory: ['Cardiopatía'], age: '65', weight: '70', height: '168', createdAt: lastWeek.toISOString() },
  { id: '8', firstName: 'Sofia', lastName: 'Mendoza', dni: '7483920 TJ', gender: 'Femenino', civilStatus: 'Casado/a', occupation: 'Contadora', allergies: 'Ninguna', generalDescription: 'Caries simple.', medicalHistory: [], age: '30', weight: '65', height: '162', createdAt: yesterday.toISOString() },
  { id: '9', firstName: 'Jorge', lastName: 'Torres', dni: '8374651 LP', gender: 'Masculino', civilStatus: 'Soltero/a', occupation: 'Profesor', allergies: 'Polen', generalDescription: 'Limpieza semestral.', medicalHistory: [], age: '38', weight: '78', height: '176', createdAt: yesterday.toISOString() },
  { id: '10', firstName: 'Elena', lastName: 'Quispe', dni: '9283746 EA', gender: 'Femenino', civilStatus: 'Casado/a', occupation: 'Enfermera', allergies: 'Ninguna', generalDescription: 'Dolor agudo muela juicio.', medicalHistory: ['Gastritis'], age: '42', weight: '68', height: '155', createdAt: today.toISOString() },
  { id: '11', firstName: 'Diego', lastName: 'Rojas', dni: '6574839 CB', gender: 'Masculino', civilStatus: 'Soltero/a', occupation: 'Estudiante', allergies: 'Ninguna', generalDescription: 'Consulta estética.', medicalHistory: [], age: '22', weight: '70', height: '178', createdAt: today.toISOString() },
  { id: '12', firstName: 'Camila', lastName: 'Soria', dni: '5647382 BN', gender: 'Femenino', civilStatus: 'Unión Libre', occupation: 'Chef', allergies: 'Mariscos', generalDescription: 'Implante dental.', medicalHistory: [], age: '35', weight: '62', height: '165', createdAt: today.toISOString() },
  { id: '13', firstName: 'Fernando', lastName: 'Aliaga', dni: '4738291 LP', gender: 'Masculino', civilStatus: 'Casado/a', occupation: 'Abogado', allergies: 'Ninguna', generalDescription: 'Diseño de sonrisa.', medicalHistory: ['Bruxismo'], age: '48', weight: '85', height: '174', createdAt: today.toISOString() },
  { id: '14', firstName: 'Patricia', lastName: 'Duran', dni: '3829102 SC', gender: 'Femenino', civilStatus: 'Viudo/a', occupation: 'Ama de Casa', allergies: 'Penicilina', generalDescription: 'Prótesis removible.', medicalHistory: ['Diabetes'], age: '60', weight: '72', height: '160', createdAt: today.toISOString() },
];

// --- POPULATED TREATMENTS FOR DEMO ---
const DEFAULT_TREATMENTS: Treatment[] = [
  // Juan Perez History
  { id: 't1', patientId: '1', patientName: 'Juan Pérez', procedure: 'Consulta General', description: 'Evaluación inicial.', cost: 100, status: 'Completado', date: threeMonthsAgo.toISOString() },
  { id: 't1_2', patientId: '1', patientName: 'Juan Pérez', procedure: 'Radiografía Panorámica', description: 'Diagnóstico de terceros molares.', cost: 150, status: 'Completado', date: threeMonthsAgo.toISOString() },
  { id: 't1_3', patientId: '1', patientName: 'Juan Pérez', procedure: 'Limpieza Dental', description: 'Profilaxis profunda.', cost: 250, status: 'Completado', date: twoMonthsAgo.toISOString() },
  { id: 't1_4', patientId: '1', patientName: 'Juan Pérez', procedure: 'Extracción Simple', description: 'Pieza 18, sin complicaciones.', cost: 200, status: 'Completado', date: lastMonth.toISOString() },
  { id: 't1_5', patientId: '1', patientName: 'Juan Pérez', procedure: 'Curación', description: 'Resina pieza 24.', cost: 150, status: 'Completado', date: lastWeek.toISOString() },

  // Maria Gonzales
  { id: 't2', patientId: '2', patientName: 'Maria Gonzales', procedure: 'Limpieza Dental', description: 'Profilaxis.', cost: 250, status: 'Completado', date: lastWeek.toISOString() },
  
  // Sofia Mendoza History
  { id: 't3', patientId: '8', patientName: 'Sofia Mendoza', procedure: 'Consulta General', description: 'Dolor leve al frío.', cost: 100, status: 'Completado', date: twoMonthsAgo.toISOString() },
  { id: 't3_2', patientId: '8', patientName: 'Sofia Mendoza', procedure: 'Curación', description: 'Resina simple pieza 36.', cost: 150, status: 'Completado', date: yesterday.toISOString() },
  
  // Others
  { id: 't4', patientId: '9', patientName: 'Jorge Torres', procedure: 'Consulta General', description: 'Revisión.', cost: 100, status: 'Completado', date: yesterday.toISOString() },
  { id: 't5', patientId: '10', patientName: 'Elena Quispe', procedure: 'Radiografía', description: 'Panorámica.', cost: 100, status: 'Completado', date: today.toISOString() },
  { id: 't6', patientId: '14', patientName: 'Patricia Duran', procedure: 'Toma de Impresión', description: 'Para prótesis.', cost: 200, status: 'Completado', date: today.toISOString() },
];

const DEFAULT_PAYMENTS: Payment[] = [
  { id: 'p1', patientId: '1', patientName: 'Juan Pérez', amount: 150, date: lastMonth.toISOString(), method: 'Efectivo', notes: 'Consulta + RX', status: 'completed' },
  { id: 'p2', patientId: '8', patientName: 'Sofia Mendoza', amount: 150, date: yesterday.toISOString(), method: 'QR', notes: 'Curación', status: 'completed' },
  { id: 'p3', patientId: '10', patientName: 'Elena Quispe', amount: 100, date: today.toISOString(), method: 'Efectivo', notes: 'RX', status: 'completed' },
];

// --- FUTURE APPOINTMENTS FOR WIDGET ---
const DEFAULT_APPOINTMENTS: Appointment[] = [
    // Today
    { id: 'a1', patientId: '4', patientName: 'Ana Vargas', date: new Date(today.setHours(14, 0, 0, 0)).toISOString(), type: 'Tratamiento', status: 'Pendiente', notes: 'Ajuste brackets' },
    { id: 'a2', patientId: '11', patientName: 'Diego Rojas', date: new Date(today.setHours(16, 30, 0, 0)).toISOString(), type: 'Consulta', status: 'Pendiente', notes: 'Valoración' },
    
    // Tomorrow
    { id: 'a3', patientId: '5', patientName: 'Pedro Salinas', date: new Date(tomorrow.setHours(9, 0, 0, 0)).toISOString(), type: 'Tratamiento', status: 'Pendiente', notes: 'Extracción' },
    { id: 'a4', patientId: '12', patientName: 'Camila Soria', date: new Date(tomorrow.setHours(11, 0, 0, 0)).toISOString(), type: 'Consulta', status: 'Pendiente', notes: 'Valoración Implante' },
    
    // Day After
    { id: 'a5', patientId: '7', patientName: 'Roberto Justiniano', date: new Date(dayAfter.setHours(10, 0, 0, 0)).toISOString(), type: 'Revisión', status: 'Pendiente', notes: 'Prueba metal' },
    
    // Next Week
    { id: 'a6', patientId: '13', patientName: 'Fernando Aliaga', date: new Date(nextWeek.setHours(15, 0, 0, 0)).toISOString(), type: 'Tratamiento', status: 'Pendiente', notes: 'Diseño Sonrisa' },
];

const DEFAULT_REMINDERS: Reminder[] = [
    { id: 'r1', text: 'Comprar resina compuesta A2', completed: false, createdAt: yesterday.toISOString(), createdBy: 'Dr. Taboada', createdById: '1' },
    { id: 'r2', text: 'Llamar al laboratorio dental sobre prótesis Sr. Roberto', completed: true, createdAt: lastWeek.toISOString(), createdBy: 'Secretaría General', createdById: '3' },
];

const STORAGE_KEY = 'dentalflow_db_v7'; 
const LOGO_KEY = 'dentalflow_logo';

class LocalDatabase {
  private users: User[];
  private patients: Patient[];
  private appointments: Appointment[];
  private treatments: Treatment[];
  private payments: Payment[];
  private reminders: Reminder[];
  private financialGoal: number;
  // Dynamic Settings
  private procedures: ProcedureItem[];
  private consultationReasons: string[];

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      this.users = data.users || DEFAULT_USERS;
      this.patients = data.patients || DEFAULT_PATIENTS;
      this.appointments = data.appointments || DEFAULT_APPOINTMENTS;
      this.treatments = data.treatments || DEFAULT_TREATMENTS;
      this.payments = data.payments || DEFAULT_PAYMENTS;
      this.reminders = data.reminders || DEFAULT_REMINDERS;
      this.financialGoal = data.financialGoal || 3300;
      this.procedures = data.procedures || DEFAULT_PROCEDURES;
      this.consultationReasons = data.consultationReasons || DEFAULT_REASONS;
    } else {
      this.users = DEFAULT_USERS;
      this.patients = DEFAULT_PATIENTS;
      this.appointments = DEFAULT_APPOINTMENTS;
      this.treatments = DEFAULT_TREATMENTS;
      this.payments = DEFAULT_PAYMENTS;
      this.reminders = DEFAULT_REMINDERS;
      this.financialGoal = 3300;
      this.procedures = DEFAULT_PROCEDURES;
      this.consultationReasons = DEFAULT_REASONS;
      this.save();
    }
  }

  private save() {
    const data = {
      users: this.users,
      patients: this.patients,
      appointments: this.appointments,
      treatments: this.treatments,
      payments: this.payments,
      reminders: this.reminders,
      financialGoal: this.financialGoal,
      procedures: this.procedures,
      consultationReasons: this.consultationReasons
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // --- Global Settings (Logo) ---
  saveLogo(base64Image: string) {
    localStorage.setItem(LOGO_KEY, base64Image);
  }

  getLogo(): string | null {
    return localStorage.getItem(LOGO_KEY);
  }

  // --- System Configuration (Procedures & Reasons) ---
  getProcedures(): ProcedureItem[] {
      return [...this.procedures];
  }

  addProcedure(procedure: Omit<ProcedureItem, 'id'>) {
      const newProc = { ...procedure, id: Math.random().toString(36).substr(2, 9) };
      this.procedures.push(newProc);
      this.save();
  }

  removeProcedure(id: string) {
      this.procedures = this.procedures.filter(p => p.id !== id);
      this.save();
  }

  getConsultationReasons(): string[] {
      return [...this.consultationReasons];
  }

  addConsultationReason(reason: string) {
      if (!this.consultationReasons.includes(reason)) {
          this.consultationReasons.push(reason);
          this.save();
      }
  }

  removeConsultationReason(reason: string) {
      this.consultationReasons = this.consultationReasons.filter(r => r !== reason);
      this.save();
  }

  // --- Auth ---
  login(username: string, password: string): User | null {
    const userIndex = this.users.findIndex(u => u.username === username);
    if (userIndex !== -1 && this.users[userIndex].password === password) { 
      this.users[userIndex].lastAccess = new Date().toISOString();
      this.save();
      return this.users[userIndex];
    }
    return null;
  }

  getUsers(): User[] { return [...this.users]; }
  
  addUser(user: Omit<User, 'id' | 'lastAccess'>): User {
    const newUser: User = { ...user, id: Math.random().toString(36).substr(2, 9), lastAccess: new Date().toISOString() };
    this.users.push(newUser);
    this.save();
    return newUser;
  }
  
  updateUser(id: string, data: Partial<User>): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) { this.users[index] = { ...this.users[index], ...data }; this.save(); }
  }
  
  deleteUser(id: string): void { this.users = this.users.filter(u => u.id !== id); this.save(); }

  // --- Reminders ---
  getReminders(): Reminder[] { return [...this.reminders]; }
  
  addReminder(text: string, user: User): Reminder {
    const newReminder: Reminder = { 
        id: Math.random().toString(36).substr(2, 9), 
        text, 
        completed: false, 
        createdAt: new Date().toISOString(),
        createdBy: user.name,
        createdById: user.id
    };
    this.reminders.unshift(newReminder);
    this.save();
    return newReminder;
  }
  
  toggleReminder(id: string): void {
    const r = this.reminders.find(x => x.id === id);
    if(r) { r.completed = !r.completed; this.save(); }
  }
  
  deleteReminder(id: string): void { this.reminders = this.reminders.filter(r => r.id !== id); this.save(); }

  // --- Patients ---
  getPatients(): Patient[] { return [...this.patients]; }
  
  searchPatients(query: string): Patient[] {
    const q = query.toLowerCase();
    return this.patients.filter(p => 
        p.firstName.toLowerCase().includes(q) || 
        p.lastName.toLowerCase().includes(q) || 
        p.dni.includes(q)
    ).slice(0, 10); // Limit results for UI
  }

  addPatient(patient: Omit<Patient, 'id' | 'createdAt'>): Patient {
    const newPatient: Patient = { ...patient, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    this.patients.unshift(newPatient);
    this.save();
    return newPatient;
  }

  updatePatient(id: string, data: Partial<Patient>): void {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
        this.patients[index] = { ...this.patients[index], ...data };
        this.save();
    }
  }

  // --- Appointments ---
  getAppointments(): Appointment[] { return [...this.appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); }
  
  addAppointment(appointment: Omit<Appointment, 'id'>): Appointment {
    const newAppt: Appointment = { ...appointment, id: Math.random().toString(36).substr(2, 9) };
    this.appointments.push(newAppt);
    this.save();
    return newAppt;
  }

  // --- TREATMENTS (CONSULTAS) ---
  getTreatments(): Treatment[] { return [...this.treatments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); }

  getTreatmentsByPatient(patientId: string): Treatment[] {
    return this.treatments.filter(t => t.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addTreatment(treatment: Omit<Treatment, 'id'>): Treatment {
    const newTreatment: Treatment = { ...treatment, id: Math.random().toString(36).substr(2, 9) };
    this.treatments.unshift(newTreatment);
    this.save();
    return newTreatment;
  }
  
  // Get unique patients sorted by their most recent treatment
  getRecentTreatedPatients(): { patient: Patient, lastTreatment: Treatment }[] {
      const sortedTreatments = [...this.treatments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const patientMap = new Map<string, Treatment>();
      
      sortedTreatments.forEach(t => {
          if (!patientMap.has(t.patientId)) {
              patientMap.set(t.patientId, t);
          }
      });

      const result: { patient: Patient, lastTreatment: Treatment }[] = [];
      patientMap.forEach((treatment, patientId) => {
          const patient = this.patients.find(p => p.id === patientId);
          if (patient) {
              result.push({ patient, lastTreatment: treatment });
          }
      });

      return result.slice(0, 5); // Return top 5
  }

  // --- PAYMENTS (FINANZAS) ---
  getPayments(): Payment[] { return [...this.payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); }

  getPaymentsByPatient(patientId: string): Payment[] {
    return this.payments.filter(p => p.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addPayment(payment: Omit<Payment, 'id' | 'status'>): Payment {
    const newPayment: Payment = { 
        ...payment, 
        id: Math.random().toString(36).substr(2, 9),
        status: 'completed'
    };
    this.payments.unshift(newPayment);
    this.save();
    return newPayment;
  }

  cancelPayment(id: string): void {
      const index = this.payments.findIndex(p => p.id === id);
      if (index !== -1) {
          this.payments[index] = { ...this.payments[index], status: 'cancelled' };
          this.save();
      }
  }

  // Helper for simple Debt calculation (Total Cost - Total Paid)
  getPatientBalance(patientId: string): { totalCost: number, totalPaid: number, debt: number } {
    const treatments = this.treatments.filter(t => t.patientId === patientId && t.status !== 'Planificado');
    // Only count payments that are not cancelled
    const payments = this.payments.filter(p => p.patientId === patientId && p.status !== 'cancelled');

    const totalCost = treatments.reduce((acc, curr) => acc + curr.cost, 0);
    const totalPaid = payments.reduce((acc, curr) => acc + curr.amount, 0);

    return { totalCost, totalPaid, debt: totalCost - totalPaid };
  }

  getDebtors(): { patient: Patient, debt: number }[] {
    return this.patients.map(p => {
      const balance = this.getPatientBalance(p.id);
      return { patient: p, debt: balance.debt };
    }).filter(item => item.debt > 0).sort((a, b) => b.debt - a.debt);
  }

  // --- INTEGRAL VISIT (ATOMIC TRANSACTION) ---
  saveIntegralVisit(data: {
      patient: Patient,
      treatment: { procedure: string, description: string, cost: number, date: string, status: TreatmentStatus },
      payment?: { amount: number, method: PaymentMethod },
      nextAppointment?: { date: string, type: any, notes: string }
  }): void {
      // 1. Add Treatment (Charge)
      this.addTreatment({
          patientId: data.patient.id,
          patientName: `${data.patient.firstName} ${data.patient.lastName}`,
          procedure: data.treatment.procedure,
          description: data.treatment.description,
          cost: data.treatment.cost,
          status: data.treatment.status,
          date: data.treatment.date
      });

      // 2. Add Payment if exists (Credit)
      if (data.payment && data.payment.amount > 0) {
          this.addPayment({
              patientId: data.patient.id,
              patientName: `${data.patient.firstName} ${data.patient.lastName}`,
              amount: data.payment.amount,
              date: data.treatment.date, // Same time as treatment
              method: data.payment.method,
              notes: `Pago por: ${data.treatment.procedure}`
          });
      }

      // 3. Add Appointment if requested
      if (data.nextAppointment) {
          this.addAppointment({
              patientId: data.patient.id,
              patientName: `${data.patient.firstName} ${data.patient.lastName}`,
              date: data.nextAppointment.date,
              type: data.nextAppointment.type,
              status: 'Pendiente',
              notes: data.nextAppointment.notes
          });
      }
  }

  // --- DASHBOARD STATS ---
  getFinancialGoal(): number {
    return this.financialGoal;
  }

  setFinancialGoal(amount: number) {
    this.financialGoal = amount;
    this.save();
  }

  getStats(): { income: number; patients: number; todayApps: number } {
    // Only count active payments
    const income = this.payments
        .filter(p => p.status !== 'cancelled')
        .reduce((acc, curr) => acc + curr.amount, 0);
        
    const todayStr = new Date().toDateString();
    const todayApps = this.appointments.filter(a => new Date(a.date).toDateString() === todayStr).length;

    return {
      income,
      patients: this.patients.length,
      todayApps
    };
  }
}

export const db = new LocalDatabase();
