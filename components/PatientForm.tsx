
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Patient } from '../types';
import { UserPlus, ChevronDown, ChevronUp, Save, X, Activity, Contact, Ruler, Phone, FileText, Check, AlertCircle, Edit } from 'lucide-react';

interface PatientFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  patientToEdit?: Patient | null;
}

const PatientForm: React.FC<PatientFormProps> = ({ onCancel, onSuccess, patientToEdit }) => {
  const [showAdditional, setShowAdditional] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Initial State logic
  const initialFormData = {
    firstName: '',
    lastName: '',
    dni: '',
    allergies: '',
    generalDescription: '',
    medicalHistory: [] as string[],
    email: '',
    phone: '',
    age: '',
    weight: '',
    height: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  // Load patient data if editing
  useEffect(() => {
    if (patientToEdit) {
        setFormData({
            firstName: patientToEdit.firstName,
            lastName: patientToEdit.lastName,
            dni: patientToEdit.dni,
            allergies: patientToEdit.allergies,
            generalDescription: patientToEdit.generalDescription,
            medicalHistory: patientToEdit.medicalHistory || [],
            email: patientToEdit.email || '',
            phone: patientToEdit.phone || '',
            age: patientToEdit.age || '',
            weight: patientToEdit.weight || '',
            height: patientToEdit.height || ''
        });
        // Auto open additional info if there is relevant data in there
        if (patientToEdit.age || patientToEdit.weight || patientToEdit.height || (patientToEdit.medicalHistory && patientToEdit.medicalHistory.length > 0)) {
            setShowAdditional(true);
        }
    } else {
        setFormData(initialFormData);
    }
  }, [patientToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBiometricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, min, max } = e.target;
    let val = parseFloat(value);
    
    if (value === '') {
        setFormData({ ...formData, [name]: '' });
        return;
    }
    
    if (val < 0) val = 0;
    if (max && val > parseFloat(max)) val = parseFloat(max);
    
    setFormData({ ...formData, [name]: val.toString() });
  };

  const handleCheckbox = (value: string) => {
    setFormData(prev => {
      const history = prev.medicalHistory.includes(value)
        ? prev.medicalHistory.filter(h => h !== value)
        : [...prev.medicalHistory, value];
      return { ...prev, medicalHistory: history };
    });
  };

  const handleReasonClick = (reason: string) => {
    setFormData(prev => ({
      ...prev,
      generalDescription: prev.generalDescription ? `${prev.generalDescription}, ${reason}` : reason
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true); // Trigger confirmation modal instead of saving immediately
  };

  const confirmSave = () => {
    if (patientToEdit) {
        db.updatePatient(patientToEdit.id, formData);
    } else {
        db.addPatient(formData);
    }
    setShowConfirm(false);
    onSuccess();
  };

  const medicalConditions = [
    { id: 'Hipertensión', label: 'Hipertensión', icon: '❤️' },
    { id: 'Diabetes', label: 'Diabetes', icon: '🍬' },
    { id: 'Cardiopatía', label: 'Cardiopatía', icon: '💓' },
    { id: 'Coagulación', label: 'Prob. Coagulación', icon: '🩸' },
    { id: 'Alergia Anestesia', label: 'Alergia Anestesia', icon: '💉' },
    { id: 'Embarazo', label: 'Embarazo', icon: '🤰' },
    { id: 'Fumador', label: 'Fumador', icon: '🚬' },
    { id: 'Respiratorio', label: 'Enf. Respiratoria', icon: '🫁' },
    { id: 'Hepatitis', label: 'Hepatitis', icon: '🦠' },
    { id: 'Renal', label: 'Enf. Renal', icon: '🌊' },
    { id: 'Gastritis', label: 'Gastritis', icon: '🔥' },
    { id: 'Bruxismo', label: 'Bruxismo', icon: '😬' },
  ];

  const commonReasons = [
    "Revisión General",
    "Limpieza Dental",
    "Dolor de Muela",
    "Extracción",
    "Ortodoncia",
    "Blanqueamiento",
    "Prótesis"
  ];

  const inputClass = "w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400";

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-visible mb-8 animate-fade-in transition-colors duration-300">
        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
              {patientToEdit ? <Edit size={20} /> : <UserPlus size={20} />}
            </div>
            {patientToEdit ? 'Editar Datos del Paciente' : 'Registrar Nuevo Paciente'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Section 1: Datos Personales */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
              Datos Personales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombres */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Ej. Juan Carlos"
                />
              </div>
              {/* Apellidos */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Ej. Pérez Rodriguez"
                />
              </div>
              
              {/* Celular Bolivia */}
              <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Celular
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-300 text-sm font-mono">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Bolivia.svg" alt="BO" className="w-4 h-3 mr-2 shadow-sm" />
                      +591
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      maxLength={8}
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); // Solo numeros
                        setFormData({...formData, phone: val});
                      }}
                      className={`flex-1 min-w-0 block w-full px-3 py-3 rounded-r-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400`}
                      placeholder="Ej. 70123456"
                    />
                  </div>
              </div>

              {/* Carnet (Opcional) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Carnet de Identidad <span className="text-xs text-slate-400 font-normal">(Opcional)</span>
                </label>
                <input
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Número de CI"
                />
              </div>
              
              {/* Alergias (Opcional) */}
              <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Alergias Conocidas <span className="text-xs text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <input
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Ej. Penicilina, Látex..."
                  />
              </div>
            </div>
          </div>

          {/* Section 2: Motivo */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
              Motivo de Consulta / Descripción
            </label>
            
            {/* Quick Select Chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {commonReasons.map(reason => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => handleReasonClick(reason)}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary transition-colors border border-transparent hover:border-primary/30"
                >
                  + {reason}
                </button>
              ))}
            </div>

            <textarea
              name="generalDescription"
              rows={3}
              value={formData.generalDescription}
              onChange={handleChange}
              className={inputClass}
              placeholder="Describa el motivo de la visita o sintomatología..."
            />
          </div>

          {/* Additional Information Toggle */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => setShowAdditional(!showAdditional)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                Historia Clínica & Biometría
              </span>
              {showAdditional ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            <div className={`transition-all duration-300 ease-in-out ${showAdditional ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="p-6 bg-white dark:bg-slate-800/50 space-y-8">
                
                {/* Biometrics */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Ruler size={14} /> Datos Biométricos
                  </h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-600 hover:border-primary/30 transition-colors group">
                        <span className="block text-xs text-slate-400 dark:text-slate-400 uppercase font-semibold mb-1 group-hover:text-primary transition-colors">Edad</span>
                        <div className="flex items-center justify-center gap-1">
                          <input
                              name="age"
                              type="number"
                              min="0"
                              max="110"
                              value={formData.age}
                              onChange={handleBiometricChange}
                              className="w-16 bg-transparent text-center text-xl font-bold text-slate-800 dark:text-white focus:outline-none border-b border-transparent focus:border-primary placeholder:text-slate-300"
                              placeholder="0"
                          />
                          <span className="text-xs text-slate-500">años</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-600 hover:border-primary/30 transition-colors group">
                        <span className="block text-xs text-slate-400 dark:text-slate-400 uppercase font-semibold mb-1 group-hover:text-primary transition-colors">Peso</span>
                        <div className="flex items-center justify-center gap-1">
                          <input
                              name="weight"
                              type="number"
                              min="1"
                              max="200"
                              value={formData.weight}
                              onChange={handleBiometricChange}
                              className="w-16 bg-transparent text-center text-xl font-bold text-slate-800 dark:text-white focus:outline-none border-b border-transparent focus:border-primary placeholder:text-slate-300"
                              placeholder="0"
                          />
                          <span className="text-xs text-slate-500">kg</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-600 hover:border-primary/30 transition-colors group">
                        <span className="block text-xs text-slate-400 dark:text-slate-400 uppercase font-semibold mb-1 group-hover:text-primary transition-colors">Talla</span>
                        <div className="flex items-center justify-center gap-1">
                          <input
                              name="height"
                              type="number"
                              min="30"
                              max="230"
                              value={formData.height}
                              onChange={handleBiometricChange}
                              className="w-16 bg-transparent text-center text-xl font-bold text-slate-800 dark:text-white focus:outline-none border-b border-transparent focus:border-primary placeholder:text-slate-300"
                              placeholder="0"
                          />
                          <span className="text-xs text-slate-500">cm</span>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                      Antecedentes Médicos
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {medicalConditions.map(item => {
                        const isSelected = formData.medicalHistory.includes(item.id);
                        return (
                          <div 
                              key={item.id}
                              onClick={() => handleCheckbox(item.id)}
                              className={`
                                cursor-pointer p-3 rounded-xl border text-sm flex items-center gap-3 transition-all
                                ${isSelected 
                                  ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm dark:bg-primary/20' 
                                  : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary/50 dark:hover:border-primary/50'}
                              `}
                          >
                            <span className="text-xl">{item.icon}</span>
                            <div className="flex-1 leading-tight">{item.label}</div>
                            {isSelected && <Check size={14} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 dark:bg-primary text-white rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:teal-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <Save size={18} />
              {patientToEdit ? 'Actualizar Datos' : 'Guardar Expediente'}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600 dark:text-teal-400">
                 <Check size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {patientToEdit ? '¿Actualizar Información?' : '¿Confirmar Registro?'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-2 text-sm">
                Se {patientToEdit ? 'actualizarán los datos' : 'creará el expediente'} para <strong>{formData.firstName} {formData.lastName}</strong>.
              </p>
              <div className="flex gap-3 mt-6">
                 <button 
                   onClick={() => setShowConfirm(false)}
                   className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                 >
                   Revisar
                 </button>
                 <button 
                   onClick={confirmSave}
                   className="flex-1 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-teal-700 shadow-lg"
                 >
                   {patientToEdit ? 'Sí, Actualizar' : 'Sí, Guardar'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default PatientForm;
