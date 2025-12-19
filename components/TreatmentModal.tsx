
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Patient, TreatmentStatus, PaymentMethod } from '../types';
import { 
  X, Search, FileText, DollarSign, Save, Stethoscope, 
  CalendarPlus, Clock, CheckCircle2, Wallet, 
} from 'lucide-react';

interface TreatmentModalProps {
  onClose: () => void;
  onSuccess: () => void;
  preSelectedPatientId?: string;
}

const TreatmentModal: React.FC<TreatmentModalProps> = ({ onClose, onSuccess, preSelectedPatientId }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form Fields
  const [procedure, setProcedure] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [status, setStatus] = useState<TreatmentStatus>('Planificado');
  
  // Dynamic Date/Time Fields
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [customTime, setCustomTime] = useState(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));

  // Integrated Payment Fields (Only for 'Completado')
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo');

  // Confirmation
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const allPatients = db.getPatients();
    setPatients(allPatients);
    
    if (preSelectedPatientId) {
        const found = allPatients.find(p => p.id === preSelectedPatientId);
        if (found) setSelectedPatient(found);
    }
  }, [preSelectedPatientId]);

  // Auto-fill payment amount when cost changes or status changes to completed
  useEffect(() => {
    if (status === 'Completado' && cost) {
        setPaymentAmount(cost);
    }
  }, [status, cost]);

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.dni.includes(searchTerm)
  );

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !procedure || !cost) return;
    setIsConfirming(true);
  };

  const confirmAndSubmit = () => {
    if (!selectedPatient) return;
    
    // Construct the final date object based on custom inputs or current time
    let finalDate = new Date().toISOString();
    if (status === 'En Proceso' || status === 'Completado') {
        const combined = new Date(`${customDate}T${customTime}`);
        finalDate = combined.toISOString();
    }

    // 1. Save Treatment
    db.addTreatment({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        procedure,
        description,
        cost: parseFloat(cost),
        status,
        date: finalDate
    });

    // 2. If Completed and Payment Amount > 0, Save Payment automatically
    if (status === 'Completado' && paymentAmount && parseFloat(paymentAmount) > 0) {
        db.addPayment({
            patientId: selectedPatient.id,
            patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
            amount: parseFloat(paymentAmount),
            date: finalDate, // Use same timestamp as treatment
            method: paymentMethod,
            notes: `Pago directo por tratamiento: ${procedure}`
        });
    }

    onSuccess();
    onClose();
  };

  const proceduresList = [
      "Consulta General", "Limpieza Dental", "Endodoncia", "Extracción Simple", "Extracción Muela Juicio", 
      "Blanqueamiento", "Ortodoncia (Mensualidad)", "Prótesis", "Implante", "Curación"
  ];

  const inputClass = "w-full p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400 transition-all";

  // --- CONFIRMATION VIEW ---
  if (isConfirming && selectedPatient) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
         <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                status === 'Completado' 
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
            }`}>
               {status === 'Completado' ? <CheckCircle2 size={32} /> : <Stethoscope size={32} />}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                {status === 'Completado' ? '¿Finalizar y Cobrar?' : '¿Guardar Registro?'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Confirme los datos antes de guardar.</p>
            
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6 text-left space-y-2 border border-slate-100 dark:border-slate-600">
                <div className="flex justify-between">
                   <span className="text-xs text-slate-400 uppercase">Paciente</span>
                   <span className="text-sm font-bold text-slate-800 dark:text-white text-right">{selectedPatient.firstName} {selectedPatient.lastName}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-xs text-slate-400 uppercase">Procedimiento</span>
                   <span className="text-sm font-medium text-slate-800 dark:text-white text-right">{procedure}</span>
                </div>
                
                {status === 'En Proceso' && (
                    <div className="flex justify-between">
                        <span className="text-xs text-slate-400 uppercase">Horario</span>
                        <span className="text-sm font-medium text-slate-800 dark:text-white">{customDate} {customTime}</span>
                    </div>
                )}

                <div className="flex justify-between border-t border-slate-200 dark:border-slate-600 pt-2 mt-2">
                   <span className="text-xs text-slate-400 uppercase font-bold">Costo Total</span>
                   <span className="text-lg font-bold text-indigo-600">Bs {parseFloat(cost).toLocaleString()}</span>
                </div>

                {status === 'Completado' && paymentAmount && (
                    <div className="flex justify-between bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg -mx-2 mt-2">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-bold flex items-center gap-1">
                            <Wallet size={12} /> Se Cobrará
                        </span>
                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Bs {parseFloat(paymentAmount).toLocaleString()}</span>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
               <button 
                 onClick={() => setIsConfirming(false)}
                 className="flex-1 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
               >
                 Revisar
               </button>
               <button 
                 onClick={confirmAndSubmit}
                 className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all ${
                     status === 'Completado' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                 }`}
               >
                 {status === 'Completado' ? 'Cobrar' : 'Guardar'}
               </button>
            </div>
         </div>
      </div>
    );
  }

  // --- MAIN FORM VIEW ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
           <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <Stethoscope size={24} />
              </div>
              <div>
                 <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Nueva Consulta / Tratamiento</h2>
                 <p className="text-xs text-slate-400">Registre la actividad clínica</p>
              </div>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handlePreSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 1. Patient Selection */}
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paciente</label>
               {selectedPatient ? (
                   <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-200 dark:border-slate-600 gap-3">
                       <div className="flex items-center gap-3 overflow-hidden">
                           <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold shrink-0">
                               {selectedPatient.firstName.charAt(0)}{selectedPatient.lastName.charAt(0)}
                           </div>
                           <div className="min-w-0">
                               <span className="font-bold text-slate-800 dark:text-white text-sm sm:text-base block truncate">
                                   {selectedPatient.firstName} {selectedPatient.lastName}
                               </span>
                               <span className="text-xs text-slate-500 font-mono">CI: {selectedPatient.dni}</span>
                           </div>
                       </div>
                       <button 
                         type="button" 
                         onClick={() => setSelectedPatient(null)}
                         className="shrink-0 px-3 py-1.5 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-xs font-medium hover:text-red-500 transition-colors shadow-sm"
                       >
                         Cambiar
                       </button>
                   </div>
               ) : (
                   <div className="relative group">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                       </div>
                       <input 
                           type="text"
                           placeholder="Buscar por nombre o DNI..."
                           value={searchTerm}
                           onChange={e => setSearchTerm(e.target.value)}
                           className="w-full pl-10 p-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400 shadow-sm transition-all"
                       />
                       {searchTerm && (
                           <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-700 shadow-xl rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-600 max-h-48 overflow-y-auto z-10">
                               {filteredPatients.map(p => (
                                   <div 
                                     key={p.id}
                                     onClick={() => { setSelectedPatient(p); setSearchTerm(''); }}
                                     className="p-3 hover:bg-indigo-50 dark:hover:bg-slate-600 cursor-pointer border-b border-slate-100 dark:border-slate-600 last:border-0"
                                   >
                                       <div className="font-medium text-slate-800 dark:text-white">{p.firstName} {p.lastName}</div>
                                       <div className="text-xs text-slate-400">CI: {p.dni}</div>
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>
               )}
            </div>

            {/* 2. Visual Status Selector */}
            <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estado del Tratamiento</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Option: Planificado (Agendar) */}
                    <div 
                        onClick={() => setStatus('Planificado')}
                        className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-2 group ${
                            status === 'Planificado' 
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        <div className={`p-2 rounded-full ${status === 'Planificado' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-600 text-slate-400'}`}>
                            <CalendarPlus size={20} />
                        </div>
                        <span className={`text-sm font-bold ${status === 'Planificado' ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                            Agendar Cita
                        </span>
                    </div>

                    {/* Option: En Proceso */}
                    <div 
                        onClick={() => setStatus('En Proceso')}
                        className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-2 group ${
                            status === 'En Proceso' 
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        <div className={`p-2 rounded-full ${status === 'En Proceso' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-600 text-slate-400'}`}>
                            <Clock size={20} />
                        </div>
                        <span className={`text-sm font-bold ${status === 'En Proceso' ? 'text-amber-700 dark:text-amber-300' : 'text-slate-600 dark:text-slate-400'}`}>
                            En Proceso
                        </span>
                    </div>

                    {/* Option: Completado */}
                    <div 
                        onClick={() => setStatus('Completado')}
                        className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-2 group ${
                            status === 'Completado' 
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        <div className={`p-2 rounded-full ${status === 'Completado' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-600 text-slate-400'}`}>
                            <CheckCircle2 size={20} />
                        </div>
                        <span className={`text-sm font-bold ${status === 'Completado' ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>
                            Completar y Cobrar
                        </span>
                    </div>

                </div>
            </div>

            {/* 3. Treatment Details (Main Fields) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Procedimiento</label>
                    <input 
                        list="procedures" 
                        required
                        value={procedure}
                        onChange={e => setProcedure(e.target.value)}
                        className={inputClass}
                        placeholder="Ej. Endodoncia"
                    />
                    <datalist id="procedures">
                        {proceduresList.map(p => <option key={p} value={p} />)}
                    </datalist>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Costo (Bs)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign size={16} className="text-slate-400" />
                        </div>
                        <input 
                            type="number"
                            required
                            min="0"
                            step="0.5"
                            value={cost}
                            onChange={e => setCost(e.target.value)}
                            className={`pl-9 ${inputClass} font-bold text-slate-700`}
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Notas Clínicas</label>
                <textarea 
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Detalles adicionales..."
                />
            </div>

            {/* 4. EXPANDABLE: Payment Module (Only for Completado - MOVED UP) */}
            {status === 'Completado' && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800 animate-slide-down">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 uppercase tracking-wide">
                            <Wallet size={18} /> Módulo de Cobro Inmediato
                        </h4>
                        <div className="text-xs bg-white dark:bg-emerald-900/50 px-2 py-1 rounded text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Registro Automático
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-emerald-700 dark:text-emerald-500 mb-2">Monto a Cobrar (Bs)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">$</span>
                                <input 
                                    type="number"
                                    value={paymentAmount}
                                    onChange={e => setPaymentAmount(e.target.value)}
                                    className="w-full pl-8 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-slate-700 text-emerald-800 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="text-[10px] text-emerald-600/70 mt-1 ml-1">* Deje en 0 para cobrar después.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-emerald-700 dark:text-emerald-500 mb-2">Método de Pago</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['Efectivo', 'QR', 'Tarjeta', 'Transferencia'] as PaymentMethod[]).map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setPaymentMethod(m)}
                                        className={`text-xs p-2 rounded border transition-colors ${
                                            paymentMethod === m 
                                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm' 
                                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                                        }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. EXPANDABLE: Date/Time (Only for En Proceso / Completado - MOVED DOWN) */}
            {(status === 'En Proceso' || status === 'Completado') && (
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-800 animate-fade-in">
                    <h4 className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase mb-3 flex items-center gap-2">
                        <Clock size={14} /> Fecha y Hora del Registro
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-500 mb-1 block">Fecha</label>
                            <input 
                                type="date"
                                value={customDate}
                                onChange={e => setCustomDate(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 mb-1 block">Hora</label>
                            <input 
                                type="time"
                                value={customTime}
                                onChange={e => setCustomTime(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>
            )}

        </form>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
             <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
             >
                Cancelar
             </button>
             <button 
                type="button"
                onClick={handlePreSubmit}
                disabled={!selectedPatient || !cost || !procedure}
                className={`px-6 py-2.5 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 ${
                    status === 'Completado' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700' 
                    : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700'
                }`}
             >
                {status === 'Completado' ? <CheckCircle2 size={18} /> : <Save size={18} />}
                {status === 'Completado' ? 'Finalizar y Guardar' : 'Guardar Tratamiento'}
             </button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentModal;
