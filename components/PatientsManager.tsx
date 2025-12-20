
import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { db } from '../services/db';
import PatientForm from './PatientForm';
import ClinicalHistoryModal from './ClinicalHistoryModal';
import IntegralAttentionModal from './IntegralAttentionModal';
import { Search, Plus, FileText, ClipboardList, Edit, User, Filter, Zap, Stethoscope, Phone, AlertTriangle, ArrowRight, LayoutGrid, List } from 'lucide-react';

interface PatientsManagerProps {
  onNavigate: (view: string) => void;
  autoOpenForm?: boolean;
}

const PatientsManager: React.FC<PatientsManagerProps> = ({ onNavigate, autoOpenForm = false }) => {
  const [patients, setPatients] = useState<Patient[]>(db.getPatients());
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(autoOpenForm);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // View Mode State
  
  // State for Editing
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  // State for Integral Attention (New Consultation)
  const [patientForAttention, setPatientForAttention] = useState<Patient | null>(null);

  // Sync prop with state if it changes
  useEffect(() => {
    if (autoOpenForm) {
      setShowForm(true);
    }
  }, [autoOpenForm]);

  const refreshData = () => {
    setPatients(db.getPatients());
  };

  const handleEditPatient = (patient: Patient) => {
      setSelectedPatient(null);
      setEditingPatient(patient);
      setShowForm(true);
  };

  const handleCloseForm = () => {
      setShowForm(false);
      setEditingPatient(null);
  };
  
  const handleStartAttention = (patient: Patient) => {
      setPatientForAttention(patient);
  };

  const filteredPatients = patients.filter(p => 
    p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dni.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Patient Form Modal */}
      {showForm && (
        <PatientForm 
          onCancel={handleCloseForm} 
          onSuccess={() => {
            refreshData();
            handleCloseForm();
          }} 
          patientToEdit={editingPatient}
        />
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
           <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Directorio de Pacientes</h1>
              <p className="text-slate-500 dark:text-slate-400">Gestione expedientes, historial clínico y contacto.</p>
           </div>
           
           <div className="flex gap-3">
               {/* View Toggle */}
               <div className="bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 flex shadow-sm">
                   <button 
                     onClick={() => setViewMode('grid')}
                     className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                     title="Vista de Tarjetas"
                   >
                       <LayoutGrid size={20} />
                   </button>
                   <button 
                     onClick={() => setViewMode('list')}
                     className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                     title="Vista de Lista"
                   >
                       <List size={20} />
                   </button>
               </div>

               <button 
                    onClick={() => setShowForm(true)}
                    className="group relative px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all overflow-hidden flex items-center gap-2"
                >
                    <Plus size={20} strokeWidth={2.5} />
                    <span>Nuevo Paciente</span>
                </button>
           </div>
      </div>

      {/* SEARCH TOOLBAR */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-2 flex items-center gap-2 sticky top-20 z-20">
             <div className="relative flex-1">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, apellido o carnet..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-transparent text-slate-900 dark:text-white text-lg placeholder:text-slate-400 outline-none"
                />
             </div>
             <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block"></div>
             <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 hidden md:block">
                 {filteredPatients.length} Registros
             </div>
      </div>
        
      {/* CONTENT VIEW (Grid or List) */}
      {filteredPatients.length > 0 ? (
        <>
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPatients.map(p => {
                        const hasAllergies = p.allergies && p.allergies !== 'Ninguna' && p.allergies !== '';
                        const hasConditions = p.medicalHistory && p.medicalHistory.length > 0;
                        
                        return (
                            <div key={p.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 group flex flex-col relative overflow-hidden">
                                
                                {/* Top Decoration Line */}
                                <div className="h-1.5 w-full bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-500"></div>

                                <div className="p-5 flex-1">
                                    {/* Header: Avatar + Info */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-inner">
                                                {p.firstName.charAt(0)}{p.lastName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">{p.firstName} <br/>{p.lastName}</h3>
                                                <p className="text-xs text-slate-400 font-mono mt-1">CI: {p.dni || '---'}</p>
                                            </div>
                                        </div>
                                        <button 
                                        onClick={() => handleEditPatient(p)}
                                        className="text-slate-300 hover:text-indigo-500 transition-colors"
                                        title="Editar"
                                        >
                                            <Edit size={18} />
                                        </button>
                                    </div>

                                    {/* Tags / Alerts */}
                                    <div className="flex flex-wrap gap-2 mb-5 min-h-[28px]">
                                        {hasAllergies ? (
                                            <span className="bg-red-50 text-red-600 border border-red-100 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                                                <AlertTriangle size={10} strokeWidth={3} /> {p.allergies}
                                            </span>
                                        ) : (
                                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 opacity-60">
                                                ✓ Sin Alergias
                                            </span>
                                        )}
                                        {hasConditions && (
                                            <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                                                {p.medicalHistory.length} Antecedentes
                                            </span>
                                        )}
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="opacity-50" />
                                            <span>{p.age ? `${p.age} años` : '--'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="opacity-50" />
                                            <span>{p.phone || '--'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3">
                                    <button 
                                        onClick={() => setSelectedPatient(p)}
                                        className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
                                        title="Ver Historia"
                                    >
                                        <ClipboardList size={20} />
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleStartAttention(p)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-2.5 rounded-xl text-sm font-bold shadow hover:bg-indigo-600 dark:hover:bg-indigo-100 dark:hover:text-indigo-900 transition-all group-hover:translate-x-1"
                                    >
                                        <Stethoscope size={16} />
                                        Iniciar Atención
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wider">Paciente</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Documento / Contacto</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Datos Clínicos</th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredPatients.map(p => {
                                    const hasAllergies = p.allergies && p.allergies !== 'Ninguna' && p.allergies !== '';
                                    return (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-sm">
                                                        {p.firstName.charAt(0)}{p.lastName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800 dark:text-white">{p.firstName} {p.lastName}</div>
                                                        <div className="text-xs text-slate-400">{p.age ? `${p.age} años` : ''} {p.gender ? `• ${p.gender}` : ''}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-slate-600 dark:text-slate-300 text-xs">CI: {p.dni || '---'}</span>
                                                    <span className="text-slate-500 text-xs mt-0.5">{p.phone || 'Sin celular'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {hasAllergies ? (
                                                        <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                                                            <AlertTriangle size={10} /> {p.allergies}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs opacity-50">Sin alergias</span>
                                                    )}
                                                    {p.medicalHistory.length > 0 && (
                                                        <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                                            {p.medicalHistory.length} Antecedentes
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleStartAttention(p)}
                                                        className="p-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                                                        title="Atender"
                                                    >
                                                        <Stethoscope size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setSelectedPatient(p)}
                                                        className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                                                        title="Historia"
                                                    >
                                                        <ClipboardList size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEditPatient(p)}
                                                        className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
      ) : (
        <div className="col-span-full py-20 text-center text-slate-400">
            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Search size={32} className="opacity-40" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No se encontraron pacientes</h3>
            <p className="text-sm opacity-70">Intente con otro término de búsqueda.</p>
        </div>
      )}

      {/* Clinical History Modal */}
      {selectedPatient && (
        <ClinicalHistoryModal 
          patient={selectedPatient} 
          onClose={() => setSelectedPatient(null)} 
        />
      )}
      
      {/* Integral Attention Modal (From button) */}
      {patientForAttention && (
          <IntegralAttentionModal 
            patient={patientForAttention}
            onClose={() => setPatientForAttention(null)}
            onSuccess={() => {
                refreshData();
                setPatientForAttention(null);
            }}
          />
      )}
    </div>
  );
};

export default PatientsManager;
