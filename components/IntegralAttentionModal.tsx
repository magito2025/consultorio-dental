import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Patient, TreatmentStatus, PaymentMethod, ProcedureItem, PiezaDental } from '../types';
import Odontograma from './Odontograma';
import PiezaModal from './PiezaModal';
import {
  X, Stethoscope, Save, DollarSign, Calendar as CalendarIcon,
  CheckCircle2, AlertCircle, ChevronRight, Wallet, Clock, Activity, Zap
} from 'lucide-react';

interface IntegralAttentionModalProps {
  patient: Patient;
  onClose: () => void;
  onSuccess: () => void;
}

const IntegralAttentionModal: React.FC<IntegralAttentionModalProps> = ({ patient, onClose, onSuccess }) => {
  // --- STATE ---
  // Data
  const [availableProcedures, setAvailableProcedures] = useState<ProcedureItem[]>([]);
 // Odontograma
  const [odontograma, setOdontograma] = useState<PiezaDental[]>([]);
  const [piezaModal, setPiezaModal] = useState<PiezaDental | null>(null);
 
 // Clinical
  const [procedure, setProcedure] = useState('');
  const [description, setDescription] = useState('');

   // Financial
  const [totalCost, setTotalCost] = useState<number>(0);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo');

  // Scheduling
  const [scheduleNext, setScheduleNext] = useState(false);
  const [nextDate, setNextDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]); // Tomorrow
  const [nextTime, setNextTime] = useState('09:00');
  const [nextType, setNextType] = useState('Tratamiento');

  // Logic Helpers
  const currentDebt = db.getPatientBalance(patient.id).debt;
  const costoProcedimiento = availableProcedures.find(p => p.name === procedure)?.price || 0;
  const costoPiezas = odontograma.reduce((s, p) => s + (p.precio || 0), 0);
  const newDebt = (costoProcedimiento + costoPiezas) - (parseFloat(paymentAmount) || 0);
  const finalBalance = currentDebt + newDebt;

  // Effects
  useEffect(() => {
    setAvailableProcedures(db.getProcedures());
  }, []);

  useEffect(() => {
    setTotalCost(costoProcedimiento + costoPiezas);
  }, [costoProcedimiento, costoPiezas]);

  const handleSave = () => {
    if (!procedure) return;

    db.saveIntegralVisit({
      patient,
      treatment: {
        procedure,
        description: `${description} | Piezas: ${odontograma.map(p => `${p.numero}(${p.estado})`).join(', ')}`,
        cost: totalCost,
        date: new Date().toISOString(),
        status: 'Completado'
      },
      payment: {
        amount: parseFloat(paymentAmount) || 0,
        method: paymentMethod
      },
      nextAppointment: scheduleNext ? {
        date: new Date(`${nextDate}T${nextTime}`).toISOString(),
        type: nextType as any,
        notes: `Seguimiento: ${procedure}`
      } : undefined
    });

    onSuccess();
    onClose();
  };

  const inputClass = "w-full p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
           <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg"><Zap size={24} /></div>
              <div>
                 <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Atención Integral</h2>
                 <p className="text-xs text-slate-400">Tratamiento, Cobro y Agenda en un paso</p>
              </div>
           </div>
           
           <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-slate-50 dark:bg-slate-700/50 rounded-full border border-slate-200 dark:border-slate-600">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                    {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{patient.firstName} {patient.lastName}</span>
                <span className="text-xs text-slate-400 border-l border-slate-300 pl-2 ml-1">
                    Saldo: <span className={currentDebt > 0 ? 'text-red-500 font-bold' : 'text-emerald-500'}>Bs {currentDebt}</span>
                </span>
           </div>

           <button onClick={onClose} className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20} /></button>
        </div>

        {/* Content: 3 Columns Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                
                {/* COL 1: CLINICAL */}
                <div className="space-y-4 flex flex-col">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-wider mb-2">
                        <Stethoscope size={16} /> Registro Clínico
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Tratamiento Realizado</label>
                            <input 
                                list="procedures-list"
                                value={procedure}
                                onChange={(e) => setProcedure(e.target.value)}
                                className={inputClass}
                                placeholder="Buscar procedimiento..."
                                autoFocus
                            />
                            <datalist id="procedures-list">
                                {availableProcedures.map(p => <option key={p.id} value={p.name} />)}
                            </datalist>
                        </div>

                        {/* ODONTOGRAMA INSERTADO AQUÍ */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Odontograma</label>
                            <Odontograma piezas={odontograma} onPieceClick={setPiezaModal} readOnly={false} />
                            {piezaModal && (
                                <PiezaModal
                                    pieza={piezaModal}
                                    onSave={(p) => {
                                        setOdontograma(prev => {
                                            const idx = prev.findIndex(x => x.numero === p.numero);
                                            return idx >= 0 ? prev.map((x, i) => (i === idx ? p : x)) : [...prev, p];
                                        });
                                        setPiezaModal(null);
                                    }}
                                    onClose={() => setPiezaModal(null)}
                                />
                            )}
                        </div>
                        
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Evolución / Notas</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={`${inputClass} h-32 resize-none`}
                                placeholder="Detalle del procedimiento, piezas tratadas, insumos..."
                            />
                        </div>
                    </div>
                </div>

                {/* COL 2: FINANCIAL */}
                <div className="space-y-4 flex flex-col">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase text-xs tracking-wider mb-2">
                        <Wallet size={16} /> Gestión Financiera
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 space-y-6">
                        
                        {/* Cost Input */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Costo Total del Servicio (Deuda)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Bs</span>
                                <input 
                                    type="number"
                                    value={totalCost}
                                    onChange={(e) => setTotalCost(parseFloat(e.target.value) || 0)}
                                    className="w-full pl-10 p-3 text-xl font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 rounded-lg border-2 border-transparent focus:border-primary outline-none"
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Payment Input */}
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800">
                            <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">Abono Inmediato (Haber)</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">$</span>
                                    <input 
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        className="w-full pl-8 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-700 text-emerald-800 font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                                <select 
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                    className="bg-white text-xs border border-emerald-200 rounded-lg text-emerald-700 font-medium px-2 outline-none"
                                >
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="QR">QR</option>
                                    <option value="Tarjeta">Tarjeta</option>
                                    <option value="Transferencia">Transf.</option>
                                </select>
                            </div>
                        </div>

                        {/* Balance Projection */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-slate-500">Saldo Anterior:</span>
                                <span className="text-slate-400">Bs {currentDebt}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-slate-500">Nuevo Movimiento:</span>
                                <span className={newDebt > 0 ? 'text-red-500' : 'text-emerald-500'}>
                                    {newDebt > 0 ? '+' : ''}Bs {newDebt}
                                </span>
                            </div>
                            <div className={`flex justify-between items-center p-3 rounded-lg font-bold ${finalBalance > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                <span>Saldo Final Proyectado:</span>
                                <span>Bs {finalBalance.toLocaleString()}</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* COL 3: CONTINUITY */}
                <div className="space-y-4 flex flex-col">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-xs tracking-wider mb-2">
                        <CalendarIcon size={16} /> Continuidad
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 flex flex-col">
                        
                        <label className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg cursor-pointer mb-4 hover:bg-indigo-100 transition-colors">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${scheduleNext ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'}`}>
                                {scheduleNext && <CheckCircle2 size={14} />}
                            </div>
                            <input type="checkbox" className="hidden" checked={scheduleNext} onChange={() => setScheduleNext(!scheduleNext)} />
                            <span className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Agendar Próxima Sesión</span>
                        </label>

                        {scheduleNext && (
                            <div className="space-y-4 animate-slide-down">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Fecha</label>
                                    <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Hora</label>
                                    <input type="time" value={nextTime} onChange={(e) => setNextTime(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Tipo de Cita</label>
                                    <select value={nextType} onChange={(e) => setNextType(e.target.value)} className={inputClass}>
                                        <option value="Tratamiento">Continuación Tratamiento</option>
                                        <option value="Revisión">Revisión / Control</option>
                                        <option value="Consulta">Nueva Consulta</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {!scheduleNext && (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 text-center p-4">
                                <Activity size={48} className="mb-2 opacity-20" />
                                <p className="text-xs">Sin agendamiento posterior.</p>
                                <p className="text-[10px]">El paciente no requiere cita de seguimiento inmediata.</p>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors">
                Cancelar Op.
            </button>
            <button 
                onClick={handleSave}
                disabled={!procedure}
                className="px-8 py-3 bg-slate-900 dark:bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Save size={20} />
                Finalizar Atención Integral
            </button>
        </div>

      </div>
    </div>
  );
};

export default IntegralAttentionModal;