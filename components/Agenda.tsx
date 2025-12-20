
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Appointment, Patient } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, Plus, LayoutList, CalendarDays, Grid } from 'lucide-react';
import IntegralAttentionModal from './IntegralAttentionModal';
import TreatmentModal from './TreatmentModal';

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 to 18:00
const DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
const DAYS_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const Agenda: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  
  // Modals
  const [patientForAttention, setPatientForAttention] = useState<Patient | null>(null);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);

  useEffect(() => {
    setAppointments(db.getAppointments());
    setPatients(db.getPatients());
  }, []);

  // --- HELPERS ---

  // Get Monday of the current week for 'Week' view
  const getMonday = (d: Date) => {
    d = new Date(d);
    const day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(d.setDate(diff));
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getWeekStart = () => getMonday(currentDate);

  const getAppointmentsForCell = (dayDate: Date, hour: number) => {
    return appointments.filter(a => {
      const aDate = new Date(a.date);
      return (
        aDate.getDate() === dayDate.getDate() &&
        aDate.getMonth() === dayDate.getMonth() &&
        aDate.getFullYear() === dayDate.getFullYear() &&
        aDate.getHours() === hour
      );
    });
  };
  
  const getAppointmentsForDay = (dayDate: Date) => {
    return appointments.filter(a => {
      const aDate = new Date(a.date);
      return (
        aDate.getDate() === dayDate.getDate() &&
        aDate.getMonth() === dayDate.getMonth() &&
        aDate.getFullYear() === dayDate.getFullYear()
      );
    });
  };

  const handleAppointmentClick = (appt: Appointment) => {
    const p = patients.find(pat => pat.id === appt.patientId);
    if (p) {
        setPatientForAttention(p);
    }
  };

  const getPatientDebt = (patientId: string) => {
      return db.getPatientBalance(patientId).debt;
  };

  // --- TODAY'S SUMMARY LOGIC ---
  const todaysAppointments = appointments.filter(a => {
      const t = new Date();
      const aDate = new Date(a.date);
      return aDate.getDate() === t.getDate() && aDate.getMonth() === t.getMonth() && aDate.getFullYear() === t.getFullYear();
  }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // --- RENDERERS ---

  const renderHeader = () => {
      let label = '';
      if (viewMode === 'day') {
          label = currentDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
      } else if (viewMode === 'week') {
          const start = getWeekStart();
          const end = new Date(start);
          end.setDate(end.getDate() + 5);
          label = `${start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`;
      } else {
          label = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      }

      return (
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button onClick={() => navigateDate('prev')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all"><ChevronLeft size={20} /></button>
            <span className="text-sm font-bold w-40 text-center text-slate-700 dark:text-slate-300 capitalize">
                {label}
            </span>
            <button onClick={() => navigateDate('next')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all"><ChevronRight size={20} /></button>
        </div>
      );
  };

  const renderWeekView = () => (
    <div className="min-w-[800px]">
        {/* Header Row (Days) */}
        <div className="grid grid-cols-[60px_repeat(6,1fr)] bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
            <div className="p-3 border-r border-slate-200 dark:border-slate-700"></div>
            {DAYS.map((day, i) => {
                const start = getWeekStart();
                const d = new Date(start);
                d.setDate(d.getDate() + i);
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                    <div key={day} className={`p-3 text-center border-r border-slate-200 dark:border-slate-700 ${isToday ? 'bg-primary/5' : ''}`}>
                        <div className="text-xs font-bold text-slate-400 uppercase">{day}</div>
                        <div className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                            {d.getDate()}
                        </div>
                    </div>
                );
            })}
        </div>
        {/* Time Slots */}
        {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-[60px_repeat(6,1fr)] border-b border-slate-100 dark:border-slate-700/50">
                <div className="p-2 text-right text-xs text-slate-400 font-medium border-r border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/20">
                    {hour}:00
                </div>
                {DAYS.map((_, dayIndex) => {
                    const start = getWeekStart();
                    const d = new Date(start);
                    d.setDate(d.getDate() + dayIndex);
                    const cellAppts = getAppointmentsForCell(d, hour);
                    return renderCell(cellAppts, dayIndex);
                })}
            </div>
        ))}
    </div>
  );

  const renderDayView = () => (
      <div className="w-full">
         <div className="grid grid-cols-[80px_1fr] bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
             <div className="p-4 border-r border-slate-200 dark:border-slate-700"></div>
             <div className="p-4 text-center font-bold text-primary text-lg border-r border-slate-200 dark:border-slate-700">
                 {DAYS_FULL[currentDate.getDay()]} {currentDate.getDate()}
             </div>
         </div>
         {HOURS.map(hour => {
             const cellAppts = getAppointmentsForCell(currentDate, hour);
             return (
                <div key={hour} className="grid grid-cols-[80px_1fr] border-b border-slate-100 dark:border-slate-700/50 min-h-[100px]">
                    <div className="p-4 text-right text-sm text-slate-400 font-bold border-r border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/20">
                        {hour}:00
                    </div>
                    <div className="p-2 relative group hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                        {cellAppts.map(appt => renderAppointmentCard(appt))}
                    </div>
                </div>
             );
         })}
      </div>
  );

  const renderMonthView = () => {
      // Logic to render grid of days
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Adjust for Monday start
      
      const gridCells = [];
      // Empty cells
      for(let i=0; i<startDayIndex; i++) gridCells.push(<div key={`empty-${i}`} className="min-h-[100px] bg-slate-50/50 dark:bg-slate-900/20 border-r border-b border-slate-200 dark:border-slate-700"></div>);
      // Days
      for(let d=1; d<=daysInMonth; d++) {
          const date = new Date(year, month, d);
          const dayAppts = getAppointmentsForDay(date);
          const isToday = date.toDateString() === new Date().toDateString();
          
          gridCells.push(
              <div key={d} className={`min-h-[100px] border-r border-b border-slate-200 dark:border-slate-700 p-2 relative group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isToday ? 'bg-primary/5' : ''}`}>
                  <div className={`text-sm font-bold mb-1 ${isToday ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>{d}</div>
                  <div className="space-y-1">
                      {dayAppts.slice(0, 3).map(a => (
                          <div key={a.id} onClick={() => handleAppointmentClick(a)} className="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80">
                              {new Date(a.date).getHours()}:00 {a.patientName}
                          </div>
                      ))}
                      {dayAppts.length > 3 && <div className="text-[10px] text-slate-400 font-medium pl-1">+{dayAppts.length - 3} más</div>}
                  </div>
              </div>
          );
      }

      return (
          <div className="w-full">
              <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  {DAYS_FULL.map(d => <div key={d} className="p-3 text-center text-xs font-bold text-slate-400 uppercase">{d.substring(0,3)}</div>)}
                  {/* Note: In Month view standard calendar has 7 days including Sunday */}
              </div>
              <div className="grid grid-cols-7 border-l border-t border-slate-200 dark:border-slate-700">
                  {gridCells}
              </div>
          </div>
      );
  };

  const renderCell = (cellAppts: Appointment[], key: number) => (
    <div key={key} className="relative min-h-[80px] border-r border-slate-100 dark:border-slate-700 p-1 group hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
        {cellAppts.map(appt => renderAppointmentCard(appt))}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 pointer-events-none">
            <Plus size={20} className="text-slate-300" />
        </div>
    </div>
  );

  const renderAppointmentCard = (appt: Appointment) => {
    const debt = getPatientDebt(appt.patientId);
    return (
        <button 
            key={appt.id}
            onClick={() => handleAppointmentClick(appt)}
            className={`w-full text-left p-2 mb-1 rounded-lg border-l-4 text-xs shadow-sm hover:shadow-md transition-all relative overflow-hidden ${
                appt.status === 'Completada' ? 'bg-slate-100 border-slate-400 text-slate-500 opacity-60' :
                appt.type === 'Tratamiento' ? 'bg-indigo-50 border-indigo-500 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200' :
                'bg-teal-50 border-teal-500 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200'
            }`}
        >
            <div className="font-bold truncate pr-2">{appt.patientName}</div>
            <div className="flex justify-between items-center opacity-80">
                <span className="truncate">{appt.type}</span>
                {viewMode === 'day' && <span className="font-mono">{new Date(appt.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>}
            </div>
            {debt > 0 && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" title={`Deuda: Bs ${debt}`} />
            )}
        </button>
    );
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 animate-fade-in">
      
      {/* Sidebar: Today's Summary */}
      <div className="w-80 flex-shrink-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
              <h3 className="font-bold text-lg mb-1">Citas de Hoy</h3>
              <p className="text-indigo-100 text-xs flex items-center gap-2">
                  <CalendarDays size={14} />
                  {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/20">
              {todaysAppointments.length > 0 ? todaysAppointments.map(app => (
                  <div key={app.id} onClick={() => handleAppointmentClick(app)} className="bg-white dark:bg-slate-700 p-3 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm hover:border-primary cursor-pointer transition-all group">
                      <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-slate-800 dark:text-white">{app.patientName}</span>
                          <span className="text-xs font-bold bg-slate-100 dark:bg-slate-600 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                              {new Date(app.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                          </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className={`w-2 h-2 rounded-full ${app.type === 'Tratamiento' ? 'bg-indigo-500' : 'bg-teal-500'}`}></span>
                          {app.type}
                      </div>
                      <div className="mt-2 text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-wider">
                          Atender Ahora →
                      </div>
                  </div>
              )) : (
                  <div className="text-center py-10 text-slate-400">
                      <div className="mb-2 flex justify-center"><Clock size={32} className="opacity-20" /></div>
                      <p className="text-sm">No hay citas para hoy.</p>
                  </div>
              )}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <button 
                onClick={() => setShowNewAppointmentModal(true)}
                className="w-full py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                  <Plus size={18} /> Nueva Cita
              </button>
          </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          
          {/* Calendar Header Controls */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            {renderHeader()}
            
            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                <button 
                    onClick={() => setViewMode('day')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'day' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
                >
                    Día
                </button>
                <button 
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'week' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
                >
                    Semana
                </button>
                <button 
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'month' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
                >
                    Mes
                </button>
            </div>
          </div>

          {/* Calendar Grid Container */}
          <div className="flex-1 overflow-auto">
             {viewMode === 'day' && renderDayView()}
             {viewMode === 'week' && renderWeekView()}
             {viewMode === 'month' && renderMonthView()}
          </div>
      </div>

      {/* Integral Attention Modal (For attending a patient from agenda) */}
      {patientForAttention && (
          <IntegralAttentionModal 
            patient={patientForAttention}
            onClose={() => setPatientForAttention(null)}
            onSuccess={() => {
                setAppointments(db.getAppointments()); // Refresh agenda
            }}
          />
      )}

      {/* New Appointment Modal (Reusing Treatment Modal Logic but simplifying usage via existing components? 
          Actually, using TreatmentModal with "Planificado" status is the best way to reuse logic) */}
      {showNewAppointmentModal && (
          <TreatmentModal 
             onClose={() => setShowNewAppointmentModal(false)}
             onSuccess={() => {
                 setAppointments(db.getAppointments());
                 setShowNewAppointmentModal(false);
             }}
          />
      )}
    </div>
  );
};

export default Agenda;
