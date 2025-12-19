
import { User, UserRole, Patient, Appointment, Payment, Treatment, Reminder, TreatmentStatus, PaymentMethod } from '../types';

// Initial Mock Data
const DEFAULT_USERS: User[] = [
  { id: '1', username: 'admin', name: 'Dr. Taboada', role: UserRole.OWNER, password: 'admin', lastAccess: new Date().toISOString() },
  { id: '2', username: 'sec', name: 'Secretaría General', role: UserRole.SECRETARY, password: '123', lastAccess: new Date(Date.now() - 86400000).toISOString() },
];

// --- MOCK DATA GENERATION ---
const today = new Date();
const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7);

const DEFAULT_PATIENTS: Patient[] = [
  { id: '1', firstName: 'Juan', lastName: 'Pérez', dni: '8493021', allergies: 'Penicilina', generalDescription: 'Sensibilidad dental.', medicalHistory: ['Hipertensión'], age: '34', weight: '75', height: '175', createdAt: lastWeek.toISOString() },
  { id: '2', firstName: 'Maria', lastName: 'Gonzales', dni: '5930212', allergies: 'Ninguna', generalDescription: 'Revisión semestral.', medicalHistory: [], age: '28', weight: '60', height: '160', createdAt: lastWeek.toISOString() },
  { id: '3', firstName: 'Carlos', lastName: 'Mamani', dni: '4839201', allergies: 'Polvo', generalDescription: 'Dolor en molar inferior.', medicalHistory: ['Diabetes'], age: '45', weight: '82', height: '170', createdAt: new Date(today.getTime() - 86400000 * 10).toISOString() },
  { id: '4', firstName: 'Ana', lastName: 'Vargas', dni: '3948201', allergies: 'Ninguna', generalDescription: 'Ortodoncia en curso.', medicalHistory: [], age: '19', weight: '55', height: '165', createdAt: new Date(today.getTime() - 86400000 * 20).toISOString() },
  { id: '5', firstName: 'Pedro', lastName: 'Salinas', dni: '9302193', allergies: 'Aines', generalDescription: 'Extracción programada.', medicalHistory: ['Coagulación'], age: '50', weight: '80', height: '172', createdAt: new Date(today.getTime() - 86400000 * 5).toISOString() },
  { id: '6', firstName: 'Lucia', lastName: 'Fernandez', dni: '1029384', allergies: 'Ninguna', generalDescription: 'Blanqueamiento.', medicalHistory: [], age: '25', weight: '58', height: '158', createdAt: new Date(today.getTime() - 86400000 * 3).toISOString() },
  { id: '7', firstName: 'Roberto', lastName: 'Justiniano', dni: '5647382', allergies: 'Latex', generalDescription: 'Prótesis superior.', medicalHistory: ['Cardiopatía'], age: '65', weight: '70', height: '168', createdAt: new Date(today.getTime() - 86400000 * 15).toISOString() },
  { id: '8', firstName: 'Sofia', lastName: 'Mendoza', dni: '7483920', allergies: 'Ninguna', generalDescription: 'Caries simple.', medicalHistory: [], age: '30', weight: '65', height: '162', createdAt: new Date(today.getTime() - 86400000 * 2).toISOString() },
];

const DEFAULT_TREATMENTS: Treatment[] = [
  { id: 't1', patientId: '1', patientName: 'Juan Pérez', procedure: 'Endodoncia', description: 'Tratamiento de conducto diente 24', cost: 800, status: 'Completado', date: lastWeek.toISOString() },
  { id: 't2', patientId: '3', patientName: 'Carlos Mamani', procedure: 'Extracción Simple', description: 'Muela dañada', cost: 200, status: 'Completado', date: lastWeek.toISOString() },
  { id: 't3', patientId: '4', patientName: 'Ana Vargas', procedure: 'Ortodoncia Mes 1', description: 'Ajuste de brackets', cost: 350, status: 'Completado', date: new Date(today.getTime() - 86400000 * 18).toISOString() },
  { id: 't4', patientId: '4', patientName: 'Ana Vargas', procedure: 'Ortodoncia Mes 2', description: 'Ajuste de brackets', cost: 350, status: 'En Proceso', date: today.toISOString() },
  { id: 't5', patientId: '7', patientName: 'Roberto Justiniano', procedure: 'Prótesis Completa', description: 'Superior e inferior', cost: 2500, status: 'Planificado', date: yesterday.toISOString() },
  { id: 't6', patientId: '6', patientName: 'Lucia Fernandez', procedure: 'Blanqueamiento', description: 'Sesión 1', cost: 500, status: 'En Proceso', date: new Date(today.getTime() - 86400000 * 0.5).toISOString() },
];

const DEFAULT_PAYMENTS: Payment[] = [
  { id: 'p1', patientId: '1', patientName: 'Juan Pérez', amount: 400, date: lastWeek.toISOString(), method: 'Efectivo', notes: 'Adelanto 50%' },
  { id: 'p2', patientId: '3', patientName: 'Carlos Mamani', amount: 200, date: lastWeek.toISOString(), method: 'QR', notes: 'Pago total' },
  { id: 'p3', patientId: '4', patientName: 'Ana Vargas', amount: 350, date: new Date(today.getTime() - 86400000 * 18).toISOString(), method: 'Transferencia', notes: 'Mes 1 pagado' },
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
    { id: 'a1', patientId: '6', patientName: 'Lucia Fernandez', date: new Date(today.setHours(10, 0)).toISOString(), type: 'Tratamiento', status: 'Pendiente', notes: 'Blanqueamiento sesión 1' },
    { id: 'a2', patientId: '4', patientName: 'Ana Vargas', date: new Date(today.setHours(11, 30)).toISOString(), type: 'Revisión', status: 'Pendiente', notes: 'Control Ortodoncia' },
    { id: 'a3', patientId: '5', patientName: 'Pedro Salinas', date: new Date(today.setHours(15, 0)).toISOString(), type: 'Consulta', status: 'Pendiente', notes: 'Valoración extracción' },
    { id: 'a4', patientId: '2', patientName: 'Maria Gonzales', date: new Date(today.getTime() + 86400000).toISOString(), type: 'Revisión', status: 'Pendiente', notes: 'Control semestral' },
];

const DEFAULT_REMINDERS: Reminder[] = [
    { id: 'r1', text: 'Comprar resina compuesta A2', completed: false, createdAt: yesterday.toISOString(), createdBy: 'Dr. Taboada', createdById: '1' },
    { id: 'r2', text: 'Llamar al laboratorio dental sobre prótesis Sr. Roberto', completed: true, createdAt: lastWeek.toISOString(), createdBy: 'Secretaría General', createdById: '2' },
];

const STORAGE_KEY = 'dentalflow_db_v5'; 
const LOGO_KEY = 'dentalflow_logo';

class LocalDatabase {
  private users: User[];
  private patients: Patient[];
  private appointments: Appointment[];
  private treatments: Treatment[];
  private payments: Payment[];
  private reminders: Reminder[];
  private financialGoal: number;

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
    } else {
      this.users = DEFAULT_USERS;
      this.patients = DEFAULT_PATIENTS;
      this.appointments = DEFAULT_APPOINTMENTS;
      this.treatments = DEFAULT_TREATMENTS;
      this.payments = DEFAULT_PAYMENTS;
      this.reminders = DEFAULT_REMINDERS;
      this.financialGoal = 3300;
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
      financialGoal: this.financialGoal
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

  addPayment(payment: Omit<Payment, 'id'>): Payment {
    const newPayment: Payment = { ...payment, id: Math.random().toString(36).substr(2, 9) };
    this.payments.unshift(newPayment);
    this.save();
    return newPayment;
  }

  // Helper for simple Debt calculation (Total Cost - Total Paid)
  getPatientBalance(patientId: string): { totalCost: number, totalPaid: number, debt: number } {
    const treatments = this.treatments.filter(t => t.patientId === patientId && t.status !== 'Planificado');
    const payments = this.payments.filter(p => p.patientId === patientId);

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
    const income = this.payments.reduce((acc, curr) => acc + curr.amount, 0);
    const today = new Date().toDateString();
    const todayApps = this.appointments.filter(a => new Date(a.date).toDateString() === today).length;

    return {
      income,
      patients: this.patients.length,
      todayApps
    };
  }

  getDailyIncomeStats(): { name: string, ingresos: number, pacientes: number }[] {
    const days = [];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toDateString(); 
      
      const dailyPayments = this.payments.filter(p => new Date(p.date).toDateString() === dayStr);
      const total = dailyPayments.reduce((acc, curr) => acc + curr.amount, 0);
      const uniquePatients = new Set(dailyPayments.map(p => p.patientId)).size;

      days.push({
        name: dayNames[d.getDay()],
        ingresos: total,
        pacientes: uniquePatients
      });
    }
    return days;
  }
}

export const db = new LocalDatabase();
