
import React, { useEffect, useState, useRef } from 'react';
import { User, UserRole, Appointment, Reminder, Patient, Treatment } from '../types';
import { db } from '../services/db';
import PaymentModal from './PaymentModal';
import IntegralAttentionModal from './IntegralAttentionModal';
import PatientForm from './PatientForm';
import { 
  Users, Calendar, DollarSign, UserPlus, FileText, CreditCard, 
  Clock, Bell, Plus, Trash2, CheckCircle2, Circle, Activity, 
  History, Stethoscope, Search, Zap, CalendarRange, BadgeDollarSign, ChevronRight,
  Sun, Moon, HelpCircle, Info, X, ArrowRight
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState({ income: 0, patients: 0, todayApps: 0 });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState('');
  const [showAddReminder, setShowAddReminder] = useState(false);
  
  // Widget State
  const [activeWidgetTab, setActiveWidgetTab] = useState<'appointments' | 'recent'>('appointments');
  const [recentTreated, setRecentTreated] = useState<{patient: Patient, lastTreatment: Treatment}[]>([]);

  // Modals & Search
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Actions
  const [selectedPatientForAttention, setSelectedPatientForAttention] = useState<Patient | null>(null);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);

  // Time State
  const [currentTime, setCurrentTime] = useState(new Date());

  const loadData = () => {
    const s = db.getStats();
    setStats(s);
    setAppointments(db.getAppointments());
    setReminders(db.getReminders());
    setRecentTreated(db.getRecentTreatedPatients());
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 18) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');

    loadData();

    // Clock Interval
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Click outside handler for search
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        clearInterval(timer);
    };
  }, []);

  // Search Logic
  useEffect(() => {
    if (searchQuery.length > 0) {
        const results = db.searchPatients(searchQuery);
        setSearchResults(results);
        setShowSearchResults(true);
    } else {
        setSearchResults([]);
        setShowSearchResults(false);
    }
  }, [searchQuery]);

  const handlePatientSelect = (patient: Patient) => {
      setSelectedPatientForAttention(patient);
      setSearchQuery('');
      setShowSearchResults(false);
  };

  // --- Handlers ---
  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newReminder.trim()) return;
    db.addReminder(newReminder, user);
    setReminders(db.getReminders());
    setNewReminder('');
    setShowAddReminder(false);
  };

  const handleToggleReminder = (id: string) => {
    db.toggleReminder(id);
    setReminders(db.getReminders());
  };

  const handleDeleteReminder = (id: string) => {
    db.deleteReminder(id);
    setReminders(db.getReminders());
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', { style: 'decimal', minimumFractionDigits: 0 }).format(value);
  };

  // Helper for Date/Time Formatting (La Paz)
  const formatTimeLaPaz = (date: Date) => {
    return new Intl.DateTimeFormat('es-BO', {
        timeZone: 'America/La_Paz',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
  };

  const formatDateLaPaz = (date: Date) => {
    return new Intl.DateTimeFormat('es-BO', {
        timeZone: 'America/La_Paz',
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }).format(date);
  };

  // Filter future appointments
  const upcomingAppointments = appointments.filter(a => a.status === 'Pendiente' && new Date(a.date) >= new Date(new Date().setHours(0,0,0,0))).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* 1. UNIFIED HEADER HERO SECTION (MODERN DARK THEME) */}
      <div className="relative rounded-3xl shadow-xl overflow-hidden p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 text-white transition-all transform hover:scale-[1.01] duration-500">
         {/* Dynamic Background */}
         <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-0"></div>
         
         {/* Modern Gradient Overlay/Blobs */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
         
         {/* Content Left */}
         <div className="relative z-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-400">{user.name}</span>
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-sm transition-transform hover:scale-105">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                <span className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Sistema Activo</span>
            </div>
         </div>

         {/* Content Right (Time) */}
         <div className="relative z-10 flex flex-col items-center md:items-end border-t md:border-t-0 border-white/10 pt-6 md:pt-0 w-full md:w-auto">
            <div className="text-6xl font-bold tracking-tighter tabular-nums drop-shadow-lg leading-none">
                {formatTimeLaPaz(currentTime)}
            </div>
            <div className="text-sm font-medium text-slate-300 uppercase tracking-wide mt-2 flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                {formatDateLaPaz(currentTime)}
            </div>
         </div>
      </div>

      {/* 2. OPERATIONAL CENTER (Search + Distinctive Action Cards) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
          
          {/* A. SEARCH BAR (Main Action Trigger) - SPAN 2 */}
          <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between min-h-[140px]" ref={searchRef}>
             {/* Header */}
             <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <Stethoscope size={20} className="text-primary" />
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Atención Clínica Integral
                    </label>
                </div>
                <button 
                    onClick={() => setShowHelpModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                    <HelpCircle size={14} />
                    <span>¿Cómo funciona?</span>
                </button>
             </div>

             {/* The Search Input - Centered Vertically in remaining space */}
             <div className="relative group flex-1 flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={24} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Busque paciente por nombre o CI para atender..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                />
                
                {/* Search Dropdown Results */}
                {showSearchResults && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-slide-down z-50">
                        {searchResults.length > 0 ? (
                            <>
                                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Resultados de Búsqueda
                                </div>
                                {searchResults.map(p => (
                                    <button 
                                        key={p.id}
                                        onClick={() => handlePatientSelect(p)}
                                        className="w-full text-left px-4 py-3 hover:bg-indigo-50 dark:hover:bg-slate-700 flex items-center justify-between group transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-indigo-900/30 flex items-center justify-center text-slate-600 dark:text-indigo-300 font-bold text-sm group-hover:bg-white group-hover:text-primary transition-colors">
                                                {p.firstName.charAt(0)}{p.lastName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors text-base">{p.firstName} {p.lastName}</p>
                                                <p className="text-xs text-slate-500">CI: {p.dni}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                            Atender <ChevronRight size={16} />
                                        </div>
                                    </button>
                                ))}
                            </>
                        ) : (
                            <div className="p-4 text-center">
                                <p className="text-sm text-slate-500 mb-3">No existe el paciente.</p>
                                <button 
                                    onClick={() => { setShowNewPatientForm(true); setShowSearchResults(false); }}
                                    className="w-full py-3 bg-slate-900 dark:bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                                >
                                    <UserPlus size={18} />
                                    Registrar a: "{searchQuery}"
                                </button>
                            </div>
                        )}
                    </div>
                )}
             </div>
          </div>

          {/* B. SECONDARY ACTIONS (DISTINCTIVE CARDS) - SPAN 1 (Grid inside) */}
          <div className="xl:col-span-1 grid grid-cols-2 gap-4 h-full min-h-[140px]">
              
              {/* Agenda Card */}
              <button 
                onClick={() => onNavigate('appointments')}
                className="relative overflow-hidden rounded-2xl p-4 flex flex-col justify-between h-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                  <div className="absolute top-0 right-0 p-3 opacity-20 transform translate-x-2 -translate-y-2">
                      <CalendarRange size={50} />
                  </div>
                  <div className="relative z-10 bg-white/20 w-fit p-2 rounded-lg backdrop-blur-sm">
                      <CalendarRange size={20} />
                  </div>
                  <div className="relative z-10 mt-auto pt-4">
                      <h3 className="font-bold text-base leading-tight">Agenda</h3>
                      <p className="text-[10px] text-indigo-100 opacity-90 mt-0.5">Gestión de Citas</p>
                  </div>
              </button>

              {/* Ingreso Card */}
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="relative overflow-hidden rounded-2xl p-4 flex flex-col justify-between h-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                  <div className="absolute top-0 right-0 p-3 opacity-20 transform translate-x-2 -translate-y-2">
                      <BadgeDollarSign size={50} />
                  </div>
                  <div className="relative z-10 bg-white/20 w-fit p-2 rounded-lg backdrop-blur-sm">
                      <BadgeDollarSign size={20} />
                  </div>
                  <div className="relative z-10 mt-auto pt-4">
                      <h3 className="font-bold text-base leading-tight">Registrar Ingreso</h3>
                      <p className="text-[10px] text-emerald-100 opacity-90 mt-0.5">Cobro Rápido</p>
                  </div>
              </button>

          </div>
      </div>

      {/* KPI Cards (Stats) - Cleaned */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.role === UserRole.OWNER && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                <DollarSign size={24} />
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Ingresos Totales (Bs)</p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">Bs {formatCurrency(stats.income)}</h3>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
              <Users size={24} />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Pacientes Registrados</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stats.patients}</h3>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-lg text-rose-600 dark:text-rose-400">
              <Calendar size={24} />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Citas Pendientes Hoy</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stats.todayApps}</h3>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Dual Widget: Appointments & Recent Patients) */}
        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-full min-h-[400px]">
              
              {/* Tab Header */}
              <div className="flex border-b border-slate-100 dark:border-slate-700">
                 <button 
                    onClick={() => setActiveWidgetTab('appointments')}
                    className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                       activeWidgetTab === 'appointments' 
                       ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-b-2 border-primary' 
                       : 'bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                 >
                    <Calendar size={18} /> Próximas Citas
                 </button>
                 <button 
                    onClick={() => setActiveWidgetTab('recent')}
                    className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                       activeWidgetTab === 'recent' 
                       ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-b-2 border-primary' 
                       : 'bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                 >
                    <History size={18} /> Pacientes Recientes
                 </button>
              </div>

              {/* Widget Content */}
              <div className="p-0 flex-1 overflow-y-auto max-h-[400px]">
                 {activeWidgetTab === 'appointments' ? (
                     <div>
                        {upcomingAppointments.length > 0 ? (
                           <div className="divide-y divide-slate-100 dark:divide-slate-700">
                              {upcomingAppointments.map(app => (
                                 <div key={app.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                                       <span className="text-xs font-bold uppercase">{new Date(app.date).toLocaleDateString('es-ES', {month: 'short'})}</span>
                                       <span className="text-xl font-bold">{new Date(app.date).getDate()}</span>
                                    </div>
                                    <div className="flex-1">
                                       <h4 className="font-semibold text-slate-800 dark:text-white">{app.patientName}</h4>
                                       <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                          <Clock size={12} />
                                          <span>{new Date(app.date).toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'})}</span>
                                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                          <span>{app.type}</span>
                                       </div>
                                    </div>
                                    <button 
                                      className="px-3 py-1 text-xs border border-slate-200 dark:border-slate-600 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                      onClick={() => onNavigate('appointments')}
                                    >
                                       Gestionar
                                    </button>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                              <Calendar size={40} className="mb-2 opacity-20" />
                              <p>No hay citas próximas programadas.</p>
                              <button onClick={() => onNavigate('appointments')} className="text-primary text-sm font-medium mt-2 hover:underline">Ver Agenda Completa</button>
                           </div>
                        )}
                     </div>
                 ) : (
                     <div>
                        {recentTreated.length > 0 ? (
                           <div className="divide-y divide-slate-100 dark:divide-slate-700">
                              {recentTreated.map(item => (
                                 <div key={item.patient.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-sm">
                                       {item.patient.firstName.charAt(0)}{item.patient.lastName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                       <h4 className="font-semibold text-slate-800 dark:text-white">{item.patient.firstName} {item.patient.lastName}</h4>
                                       <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                          <Stethoscope size={12} />
                                          <span className="font-medium text-slate-700 dark:text-slate-300">{item.lastTreatment.procedure}</span>
                                          <span className="text-slate-300">|</span>
                                          <span className="italic">{new Date(item.lastTreatment.date).toLocaleDateString()}</span>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                          item.lastTreatment.status === 'Completado' 
                                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                       }`}>
                                          {item.lastTreatment.status}
                                       </span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                              <Activity size={40} className="mb-2 opacity-20" />
                              <p>No hay actividad reciente registrada.</p>
                           </div>
                        )}
                     </div>
                 )}
              </div>
           </div>
        </div>

        {/* Right Column (Expanded Reminders Only) */}
        <div className="space-y-6">
            
            {/* REMINDERS WIDGET - Taking full height of column */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-full min-h-[400px]">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-bold">
                    <Bell size={20} />
                    <span>Recordatorios & Notas</span>
                </div>
                <button 
                  onClick={() => setShowAddReminder(!showAddReminder)}
                  className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3">
                  {showAddReminder && (
                    <form onSubmit={handleAddReminder} className="mb-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-amber-200 dark:border-amber-900/50 animate-fade-in">
                      <input 
                        autoFocus
                        type="text" 
                        value={newReminder}
                        onChange={(e) => setNewReminder(e.target.value)}
                        placeholder="Escriba nueva tarea..."
                        className="w-full text-sm border-b border-amber-300 dark:border-amber-600 outline-none bg-transparent text-slate-900 dark:text-white pb-1 placeholder:text-slate-400"
                      />
                      <div className="flex justify-end mt-2">
                        <button type="submit" className="text-xs bg-amber-500 text-white px-3 py-1 rounded shadow-sm hover:bg-amber-600">Añadir</button>
                      </div>
                    </form>
                  )}
                  {reminders.length === 0 && !showAddReminder ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <CheckCircle2 size={40} className="mb-2 opacity-20" />
                        <p className="text-xs italic">Todo está al día</p>
                    </div>
                  ) : (
                    reminders.map(r => (
                      <div key={r.id} className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 group hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                        <div className="flex items-start gap-3">
                            <button onClick={() => handleToggleReminder(r.id)} className="mt-0.5 text-slate-400 hover:text-primary transition-colors">
                              {r.completed ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} />}
                            </button>
                            <span className={`text-sm flex-1 text-slate-700 dark:text-slate-200 leading-snug ${r.completed ? 'line-through opacity-50' : ''}`}>
                              {r.text}
                            </span>
                            <button onClick={() => handleDeleteReminder(r.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity">
                              <Trash2 size={14} />
                            </button>
                        </div>
                        {/* Creator Tag */}
                        <div className="pl-7">
                             <span className="text-[10px] font-medium bg-white dark:bg-slate-600 text-slate-400 dark:text-slate-300 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-500 flex w-fit shadow-sm">
                                Por: {r.createdBy || 'Sistema'}
                             </span>
                        </div>
                      </div>
                    ))
                  )}
              </div>
            </div>

        </div>

      </div>

      {/* MODALS */}
      {showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} onSuccess={loadData} />}
      
      {/* INTEGRAL ATTENTION MODAL */}
      {selectedPatientForAttention && (
          <IntegralAttentionModal 
            patient={selectedPatientForAttention}
            onClose={() => setSelectedPatientForAttention(null)}
            onSuccess={() => {
                loadData();
                setSearchQuery('');
            }}
          />
      )}

      {/* QUICK NEW PATIENT FORM (INLINE) */}
      {showNewPatientForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl max-h-[90vh] overflow-y-auto">
                  <PatientForm 
                    onCancel={() => setShowNewPatientForm(false)}
                    onSuccess={() => {
                        // After creating, immediately find it and open attention modal
                        const newPatients = db.searchPatients(searchQuery); // Search again with same query
                        if(newPatients.length > 0) {
                            setSelectedPatientForAttention(newPatients[0]);
                        }
                        setShowNewPatientForm(false);
                        loadData();
                    }}
                  />
              </div>
          </div>
      )}

      {/* HELP MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-indigo-600 p-6 flex justify-between items-start">
                  <div className="text-white">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                         <Info size={20} />
                         Guía de Flujo Clínico Rápido
                      </h3>
                      <p className="text-indigo-100 text-xs mt-1">Cómo optimizar la atención del paciente</p>
                  </div>
                  <button onClick={() => setShowHelpModal(false)} className="text-white/70 hover:text-white bg-white/10 p-1 rounded-full"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-6">
                  <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 shrink-0">1</div>
                      <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm">Buscar Paciente</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Escriba el nombre o carnet en la barra de búsqueda. Si el paciente no existe, el sistema le ofrecerá registrarlo al instante.
                          </p>
                      </div>
                  </div>
                  <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 shrink-0">2</div>
                      <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm">Acción Inmediata</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Al seleccionar un paciente, se abrirá automáticamente el panel de <strong>Atención Integral</strong>.
                          </p>
                      </div>
                  </div>
                  <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600 shrink-0">3</div>
                      <div>
                          <h4 className="font-bold text-indigo-700 dark:text-indigo-400 text-sm">Registro Unificado</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              En una sola ventana podrá realizar todo el proceso sin navegar a otras pestañas:
                          </p>
                          <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                              <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Registrar tratamiento (Historia Clínica)</li>
                              <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Cobrar servicio (Caja/Finanzas)</li>
                              <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Agendar retorno (Calendario)</li>
                          </ul>
                      </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowHelpModal(false)}
                    className="w-full py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                  >
                      Entendido, Volver al Tablero
                  </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
