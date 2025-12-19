
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Patient, Treatment } from '../types';
import { X, FileText, Calendar, Activity, Printer } from 'lucide-react';

interface ClinicalHistoryModalProps {
  patient: Patient;
  onClose: () => void;
}

const ClinicalHistoryModal: React.FC<ClinicalHistoryModalProps> = ({ patient, onClose }) => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  useEffect(() => {
    setTreatments(db.getTreatmentsByPatient(patient.id));
  }, [patient.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
             <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-lg text-blue-600 dark:text-blue-400">
               <FileText size={24} />
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-800 dark:text-white">Expediente Digital</h2>
               <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confidencial</p>
             </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Imprimir Informe">
               <Printer size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Patient Header Summary */}
        <div className="bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-6 items-start">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500 dark:text-slate-300">
                    {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{patient.firstName} {patient.lastName}</h3>
                    <p className="text-sm text-slate-500">CI: {patient.dni}</p>
                </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                    <span className="block text-xs text-slate-400">Edad</span>
                    <span className="font-medium dark:text-white">{patient.age || '-'} años</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                    <span className="block text-xs text-slate-400">Celular</span>
                    <span className="font-medium dark:text-white">{patient.phone || '-'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg col-span-2">
                    <span className="block text-xs text-slate-400">Alergias</span>
                    <span className={`font-medium ${patient.allergies && patient.allergies !== 'Ninguna' ? 'text-red-500' : 'dark:text-white'}`}>
                        {patient.allergies || 'Ninguna'}
                    </span>
                </div>
            </div>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 dark:bg-slate-900/10">
            <div className="mb-4 flex items-center gap-2 text-slate-800 dark:text-white font-bold">
                 <Activity size={20} className="text-primary" />
                 <h3>Historia Clínica</h3>
            </div>

            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8 pb-10">
                {treatments.length > 0 ? treatments.map((t, idx) => (
                    <div key={t.id} className="relative pl-8">
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-slate-800 ${t.status === 'Completado' ? 'bg-primary' : 'bg-amber-400'}`}></div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-slate-800 dark:text-white">{t.procedure}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Calendar size={12} /> {new Date(t.date).toLocaleDateString()}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                                t.status === 'Completado' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                                {t.status}
                            </span>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-sm text-slate-600 dark:text-slate-300">
                            <p className="mb-2">{t.description}</p>
                            <p className="text-xs font-mono text-slate-400">Costo: Bs {t.cost}</p>
                        </div>
                    </div>
                )) : (
                    <div className="pl-8 pt-2 text-slate-400 italic">No hay tratamientos registrados aún.</div>
                )}
                
                {/* Initial Registration Marker */}
                <div className="relative pl-8">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-white dark:border-slate-800"></div>
                    <span className="text-sm font-bold text-slate-400">Fecha de Registro</span>
                    <p className="text-xs text-slate-400">{new Date(patient.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalHistoryModal;
