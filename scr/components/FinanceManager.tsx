
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Payment, Patient, Treatment } from '../types';
import PaymentModal from './PaymentModal';
import { DollarSign, TrendingUp, Users, Search, Calendar, CreditCard, ArrowUpRight, Plus, Trash2, AlertTriangle, ArrowRight, ArrowUpDown, Filter } from 'lucide-react';

const FinanceManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'debtors'>('transactions');
  const [payments, setPayments] = useState<Payment[]>([]);
  
  // Enhanced Debtors State with search and sort
  const [debtors, setDebtors] = useState<{patient: Patient, debt: number, lastTreatmentDate: string}[]>([]);
  const [debtorSearchTerm, setDebtorSearchTerm] = useState('');
  const [debtorSort, setDebtorSort] = useState<'highest' | 'lowest' | 'oldest' | 'newest'>('highest');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDebtorId, setSelectedDebtorId] = useState<string | undefined>(undefined);
  const [stats, setStats] = useState({ totalIncome: 0, totalDebt: 0 });
  
  // Time filters state
  const [timeFrame, setTimeFrame] = useState<'day' | 'month' | 'year'>('month');
  
  // Transaction Search
  const [txnSearchTerm, setTxnSearchTerm] = useState('');
  
  // Delete confirmation
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  const refreshData = () => {
    const p = db.getPayments();
    
    // Get Debtors with Last Treatment Date for sorting
    const d = db.getDebtors().map(debtor => {
        const patientTreatments = db.getTreatmentsByPatient(debtor.patient.id);
        const lastDate = patientTreatments.length > 0 ? patientTreatments[0].date : debtor.patient.createdAt; // Default to created date if no treatment
        return {
            ...debtor,
            lastTreatmentDate: lastDate
        };
    });

    setPayments(p);
    setDebtors(d);
    
    // Calc stats (Overall Debt)
    const debt = d.reduce((acc, curr) => acc + curr.debt, 0);
    setStats(prev => ({ ...prev, totalDebt: debt }));
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Calculate dynamic income based on timeframe
  const calculateIncome = () => {
      const now = new Date();
      return payments.filter(p => {
          if (p.status === 'cancelled') return false; // Ignore cancelled
          const d = new Date(p.date);
          
          if (timeFrame === 'day') {
              return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          } else if (timeFrame === 'month') {
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          } else {
              return d.getFullYear() === now.getFullYear();
          }
      }).reduce((acc, curr) => acc + curr.amount, 0);
  };

  const currentIncome = calculateIncome();

  const handleOpenPayment = (patientId?: string) => {
      setSelectedDebtorId(patientId);
      setShowPaymentModal(true);
  };

  const confirmDelete = (id: string) => {
      setPaymentToDelete(id);
  };

  const handleDelete = () => {
      if (paymentToDelete) {
          db.cancelPayment(paymentToDelete);
          setPaymentToDelete(null);
          refreshData();
      }
  };

  // Filter payments by search term
  const filteredPayments = payments.filter(p => 
      p.patientName.toLowerCase().includes(txnSearchTerm.toLowerCase())
  );

  // Filter and Sort Debtors
  const processedDebtors = debtors
    .filter(d => 
        d.patient.firstName.toLowerCase().includes(debtorSearchTerm.toLowerCase()) || 
        d.patient.lastName.toLowerCase().includes(debtorSearchTerm.toLowerCase()) ||
        d.patient.dni.includes(debtorSearchTerm)
    )
    .sort((a, b) => {
        switch (debtorSort) {
            case 'highest': return b.debt - a.debt;
            case 'lowest': return a.debt - b.debt;
            case 'newest': return new Date(b.lastTreatmentDate).getTime() - new Date(a.lastTreatmentDate).getTime();
            case 'oldest': return new Date(a.lastTreatmentDate).getTime() - new Date(b.lastTreatmentDate).getTime();
            default: return b.debt - a.debt;
        }
    });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="mb-2">
         <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gestión Financiera</h1>
      </div>

      {/* Stats Cards - New Layout 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Registered Income */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3 mb-2 opacity-90">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg"><DollarSign size={24} /></div>
                        <span className="font-medium">Ingresos</span>
                      </div>
                      
                      {/* Time Frame Selector */}
                      <div className="flex bg-black/20 p-1 rounded-lg text-xs font-bold">
                          <button onClick={() => setTimeFrame('day')} className={`px-2 py-1 rounded-md transition-all ${timeFrame === 'day' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-100 hover:bg-white/10'}`}>Día</button>
                          <button onClick={() => setTimeFrame('month')} className={`px-2 py-1 rounded-md transition-all ${timeFrame === 'month' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-100 hover:bg-white/10'}`}>Mes</button>
                          <button onClick={() => setTimeFrame('year')} className={`px-2 py-1 rounded-md transition-all ${timeFrame === 'year' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-100 hover:bg-white/10'}`}>Año</button>
                      </div>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight mt-2">Bs {currentIncome.toLocaleString()}</h2>
                  <p className="text-xs text-emerald-100 mt-1 opacity-80">Total registrado en este periodo</p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                  <DollarSign size={120} />
              </div>
          </div>

          {/* Card 2: Pending Debt (Clickable) */}
          <div 
            onClick={() => setActiveTab('debtors')}
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg border border-transparent cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden flex flex-col justify-between group"
          >
              <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3 mb-2 opacity-90">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg"><TrendingUp size={24} /></div>
                        <span className="font-medium">Pagos pendientes</span>
                      </div>
                      <div className="bg-white/20 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight size={16} />
                      </div>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight mt-2">Bs {stats.totalDebt.toLocaleString()}</h2>
                  <p className="text-xs text-orange-100 mt-1 opacity-90">Saldo por cobrar a pacientes</p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                  <AlertTriangle size={120} />
              </div>
          </div>

          {/* Card 3: Action Card (Register New) */}
          <button 
            onClick={() => handleOpenPayment()}
            className="group relative rounded-xl p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all flex flex-col items-center justify-center text-center gap-3 bg-slate-50 dark:bg-slate-800/50"
          >
              <div className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm text-slate-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
                  <Plus size={32} />
              </div>
              <div>
                  <h3 className="font-bold text-slate-700 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">Registrar Nuevo Ingreso</h3>
                  <p className="text-xs text-slate-400 group-hover:text-emerald-600/70">Cobrar a paciente o agregar abono</p>
              </div>
          </button>

      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[500px]">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setActiveTab('transactions')}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'transactions' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                  <CreditCard size={18} /> Historial de Transacciones
              </button>
              <button 
                onClick={() => setActiveTab('debtors')}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'debtors' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                  <Users size={18} /> Deudores ({debtors.length})
              </button>
          </div>

          <div className="p-0">
              {activeTab === 'transactions' ? (
                  <>
                    {/* Search Bar for Transactions */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Buscar transacción por nombre de paciente..."
                                value={txnSearchTerm}
                                onChange={(e) => setTxnSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="px-6 py-3">Fecha</th>
                                    <th className="px-6 py-3">Paciente</th>
                                    <th className="px-6 py-3">Método</th>
                                    <th className="px-6 py-3 text-right">Monto</th>
                                    <th className="px-6 py-3 text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredPayments.length > 0 ? filteredPayments.map(p => (
                                    <tr key={p.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${p.status === 'cancelled' ? 'bg-slate-50/50 dark:bg-slate-800/50 opacity-60' : ''}`}>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span className={p.status === 'cancelled' ? 'line-through' : ''}>
                                              {new Date(p.date).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs text-slate-400">{new Date(p.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">
                                            {p.patientName}
                                            {p.status === 'cancelled' && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase font-bold">Anulado</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs">{p.method}</span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold ${p.status === 'cancelled' ? 'text-slate-400 line-through' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                            + Bs {p.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {p.status !== 'cancelled' && (
                                                <button 
                                                  onClick={() => confirmDelete(p.id)}
                                                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                  title="Anular Pago"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="text-center py-10">No se encontraron transacciones.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                  </>
              ) : (
                  <>
                    {/* Debtors Toolbar */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Buscar deudor..."
                                value={debtorSearchTerm}
                                onChange={(e) => setDebtorSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-slate-400" />
                            <select 
                                value={debtorSort}
                                onChange={(e) => setDebtorSort(e.target.value as any)}
                                className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="highest">Deuda más alta</option>
                                <option value="lowest">Deuda más baja</option>
                                <option value="oldest">Antigua (Última atención)</option>
                                <option value="newest">Reciente (Última atención)</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        {processedDebtors.length > 0 ? processedDebtors.map((d, i) => (
                            <div key={d.patient.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow bg-slate-50/30 dark:bg-slate-700/20">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center font-bold text-sm">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-white">{d.patient.firstName} {d.patient.lastName}</h4>
                                        <p className="text-xs text-slate-500 flex gap-2">
                                            <span>CI: {d.patient.dni}</span>
                                            <span>•</span>
                                            <span className="text-slate-400">Última atención: {new Date(d.lastTreatmentDate).toLocaleDateString()}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 uppercase">Deuda Pendiente</p>
                                    <p className="text-xl font-bold text-red-600">Bs {d.debt.toLocaleString()}</p>
                                    <button 
                                      onClick={() => handleOpenPayment(d.patient.id)}
                                      className="mt-2 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 ml-auto transition-colors shadow-sm hover:shadow"
                                    >
                                        Completar Pago <ArrowUpRight size={12} />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-slate-400">
                                <p>No se encontraron deudores con esos criterios.</p>
                            </div>
                        )}
                    </div>
                  </>
              )}
          </div>
      </div>

      {showPaymentModal && (
          <PaymentModal 
            onClose={() => setShowPaymentModal(false)}
            onSuccess={refreshData}
            preSelectedPatientId={selectedDebtorId}
          />
      )}

      {/* Delete Confirmation Modal */}
      {paymentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
                 <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">¿Anular Pago?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                El registro quedará marcado como "Anulado" y la deuda volverá a sumarse a la cuenta del paciente.
              </p>
              <div className="flex gap-3">
                 <button 
                   onClick={() => setPaymentToDelete(null)}
                   className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                 >
                   Cancelar
                 </button>
                 <button 
                   onClick={handleDelete}
                   className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 shadow-lg"
                 >
                   Sí, Anular
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManager;
