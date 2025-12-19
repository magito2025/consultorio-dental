
import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { db } from '../services/db';
import PatientForm from './PatientForm';
import ClinicalHistoryModal from './ClinicalHistoryModal';
import { Search, Plus, FileText, ClipboardList, Edit, User, Filter } from 'lucide-react';

interface PatientsManagerProps {
  onNavigate: (view: string) => void;
  autoOpenForm?: boolean;
}

const PatientsManager: React.FC<PatientsManagerProps> = ({ onNavigate, autoOpenForm = false }) => {
  const [patients, setPatients] = useState<Patient[]>(db.getPatients());
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(autoOpenForm);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // State for Editing
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

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
      setSelectedPatient(null); // Ensure history modal is closed
      setEditingPatient(patient);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseForm = () => {
      setShowForm(false);
      setEditingPatient(null); // Clear editing state
  };

  const filteredPatients = patients.filter(p => 
    p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dni.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Patient Form Section (Collapsible) */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <PatientForm 
          onCancel={handleCloseForm} 
          onSuccess={() => {
            refreshData();
            handleCloseForm();
          }} 
          patientToEdit={editingPatient}
        />
      </div>

      {!showForm && (
        <div className="flex justify-end">
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-medium hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Plus size={20} />
            Registrar Nuevo Paciente
          </button>
        </div>
      )}

      {/* Patient Directory */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                <User size={20} className="text-slate-400" />
                Directorio de Pacientes
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Gestión de expedientes ({filteredPatients.length} total)</p>
           </div>
           
           {/* Search Bar */}
           <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-slate-400" />
                </div>
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, apellido o DNI..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm placeholder:text-slate-400"
                />
             </div>
             <button className="p-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 hover:text-primary transition-colors">
               <Filter size={18} />
             </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">Contacto/CI</th>
                <th className="px-6 py-4">Alertas Clínicas</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredPatients.length > 0 ? (
                filteredPatients.map(p => (
                  <tr key={p.id} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold">
                            {p.firstName.charAt(0)}{p.lastName.charAt(0)}
                         </div>
                         <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{p.firstName} {p.lastName}</div>
                            <div className="text-xs text-slate-400">Desde: {new Date(p.createdAt).toLocaleDateString()}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="space-y-1">
                          <div className="font-mono text-slate-600 dark:text-slate-300 text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded w-fit">CI: {p.dni || '---'}</div>
                          <div className="text-xs">{p.phone ? `+591 ${p.phone}` : 'Sin cel.'}</div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.allergies && p.allergies !== 'Ninguna' && p.allergies !== '' ? (
                           <span className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                             ⚠️ {p.allergies}
                           </span>
                        ) : (
                           <span className="text-slate-400 text-xs flex items-center gap-1 opacity-50">✓ Sin alergias</span>
                        )}
                        {p.medicalHistory && p.medicalHistory.length > 0 && (
                             <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                               {p.medicalHistory.length} cond.
                             </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg text-xs font-semibold transition-colors border border-indigo-100 dark:border-indigo-800"
                          title="Nueva Consulta"
                        >
                          <FileText size={14} /> Consulta
                        </button>
                        <button 
                          onClick={() => setSelectedPatient(p)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-600"
                          title="Ver Historia Clínica Completa"
                        >
                          <ClipboardList size={14} /> Ver Historia
                        </button>
                        <button 
                          onClick={() => handleEditPatient(p)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                          title="Editar Datos"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <p>No se encontraron pacientes que coincidan con la búsqueda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical History Modal */}
      {selectedPatient && (
        <ClinicalHistoryModal 
          patient={selectedPatient} 
          onClose={() => setSelectedPatient(null)} 
        />
      )}
    </div>
  );
};

export default PatientsManager;
