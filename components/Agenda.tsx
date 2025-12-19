
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Appointment, Patient } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, AlertCircle } from 'lucide-react';
import IntegralAttentionModal from './IntegralAttentionModal';

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 to 18:00
const DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

const Agenda: React.FC = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [patientForModal, setPatientForModal] = useState<Patient | null>(null);

  useEffect(() => {
    setAppointments(db.getAppointments());
    setPatients(db.getPatients());
  }, []);

  function getMonday(d: Date) {
    d = new Date(d);
    const day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const getDayDate = (dayIndex: number) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + dayIndex);
    return date;
  };

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

  const handleAppointmentClick = (appt: Appointment) => {
    const p = patients.find(pat => pat.id === appt.patientId);
    if (p) {
        // If clicking an existing appointment, we open the Integral Modal directly to attend them
        setPatientForModal(p);
    }
  };

  const getPatientDebt = (patientId: string) => {
      return db.getPatientBalance(patientId).debt;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      
      {/* Header Controls */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CalIcon className="text-primary" /> Agenda Clínica
        </h2>
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button onClick={() => navigateWeek('prev')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all"><ChevronLeft size={20} /></button>
            <span className="text-sm font-semibold w-32 text-center text-slate-700 dark:text-slate-300">
                {currentWeekStart.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })} - {new Date(currentWeekStart.getTime() + 5*86400000).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
            </span>
            <button onClick={() => navigateWeek('next')} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[800px]">
            {/* Header Row (Days) */}
            <div className="grid grid-cols-[60px_repeat(6,1fr)] bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                <div className="p-3 border-r border-slate-200 dark:border-slate-700"></div>
                {DAYS.map((day, i) => {
                    const d = getDayDate(i);
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
                        const cellDate = getDayDate(dayIndex);
                        const cellAppts = getAppointmentsForCell(cellDate, hour);
                        
                        return (
                            <div key={dayIndex} className="relative min-h-[80px] border-r border-slate-100 dark:border-slate-700 p-1 group hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                                {cellAppts.map(appt => {
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
                                            <div className="truncate opacity-80">{appt.type}</div>
                                            
                                            {/* Debt Indicator */}
                                            {debt > 0 && (
                                                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" title={`Deuda: Bs ${debt}`} />
                                            )}
                                        </button>
                                    )
                                })}
                                {/* Add Button on Hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 pointer-events-none">
                                    <Clock size={20} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
      </div>

      {patientForModal && (
          <IntegralAttentionModal 
            patient={patientForModal}
            onClose={() => setPatientForModal(null)}
            onSuccess={() => {
                setAppointments(db.getAppointments()); // Refresh agenda
            }}
          />
      )}
    </div>
  );
};

export default Agenda;
