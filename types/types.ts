// src/components/IntegralAttentionModal.tsx
import React, { useState, useEffect } from 'react'; // CORRECCIÓN: Se añaden los hooks faltantes
import { db } from './services/db';
import { Patient, TreatmentStatus, PaymentMethod, ProcedureItem, PiezaDental, PRECIOS } from './types';

// CORRECCIÓN: Rutas ajustadas (están en la misma carpeta 'components')
import Odontograma from './Odontograma'; 
import PiezaModal from './PiezaModal';

import {
  X, Stethoscope, Save, DollarSign, Calendar as CalendarIcon,
  CheckCircle2, Wallet, Activity, Zap
} from 'lucide-react';

interface IntegralAttentionModalProps {
  patient: Patient;
  onClose: () => void;
  onSuccess: () => void;
}
// src/types.ts (Asegúrate de tener algo así)
export const PRECIOS: Record<string, number> = {
  sano: 0,
  caries: 50,      // Ejemplo de precio
  obturado: 100,
  corona: 500,
  extraccion: 150,
  rx: 80,
  ausente: 0
};
const IntegralAttentionModal: React.FC<IntegralAttentionModalProps> = ({ patient, onClose, onSuccess }) => {
  const [availableProcedures, setAvailableProcedures] = useState<ProcedureItem[]>([]);
  const [odontograma, setOdontograma] = useState<PiezaDental[]>([]);
  const [piezaModal, setPiezaModal] = useState<PiezaDental | null>(null);
  const [procedure, setProcedure] = useState('');
  const [description, setDescription] = useState('');
  const [totalCost, setTotalCost] = useState<number>(0);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo');
  const [scheduleNext, setScheduleNext] = useState(false);
  const [nextDate, setNextDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [nextTime, setNextTime] = useState('09:00');
  const [nextType, setNextType] = useState('Tratamiento');

  const currentDebt = patient.debt || 0;
  const costoProcedimiento = availableProcedures.find(p => p.name === procedure)?.price || 0;
  
  // Cálculo del costo sumando piezas tratadas y procedimiento base
  const costoPiezas = odontograma.reduce((s, p) => s + (PRECIOS[p.estado] || 0), 0);
  const newDebt = (costoProcedimiento + costoPiezas) - (parseFloat(paymentAmount) || 0);
  const finalBalance = currentDebt + newDebt;

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header simplificado para ahorrar espacio */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-slate-700">
           <div className="flex items-center gap-3">
              <Zap className="text-indigo-500" />
              <h2 className="text-lg font-bold">Atención Integral: {patient.firstName} {patient.lastName}</h2>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* COL 1: CLINICAL */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700">
                        <label className="block text-xs font-bold mb-2 uppercase text-slate-400">Tratamiento</label>
                        <input 
                            list="procedures-list"
                            value={procedure}
                            onChange={(e) => setProcedure(e.target.value)}
                            className={inputClass}
                            placeholder="Ej: Profilaxis..."
                        />
                        <datalist id="procedures-list">
                            {availableProcedures.map(p => <option key={p.id} value={p.name} />)}
                        </datalist>

                        <div className="mt-4">
                            <label className="block text-xs font-bold mb-2 uppercase text-slate-400">Odontograma Experimental</label>
                            <Odontograma piezas={odontograma} onPieceClick={setPiezaModal} />
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-bold mb-2 uppercase text-slate-400">Notas de Evolución</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={`${inputClass} h-24`}
                                placeholder="Notas del día..."
                            />
                        </div>
                    </div>
                </div>

                {/* COL 2: FINANCIAL (Se mantiene igual pero verificado) */}
                <div className="space-y-4">
                   <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700">
                        <h3 className="text-sm font-bold mb-4 text-emerald-500 uppercase">Finanzas</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs text-slate-500">Total a Pagar:</span>
                                <div className="text-2xl font-bold">Bs {totalCost}</div>
                            </div>
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <label className="text-xs font-bold text-emerald-600 block mb-1">Abono del Paciente</label>
                                <input 
                                    type="number" 
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    className="w-full bg-transparent text-xl font-bold outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                   </div>
                </div>

                {/* COL 3: CONTINUITY */}
                <div className="space-y-4">
                    {/* ... (Contenido de agendamiento) */}
                </div>
            </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2">Cancelar</button>
            <button 
                onClick={handleSave} 
                disabled={!procedure}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold disabled:opacity-50"
            >
                Finalizar Atención
            </button>
        </div>

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
    </div>
  );
};

export default IntegralAttentionModal;