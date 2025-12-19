
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Payment, Patient } from '../types';
import PaymentModal from './PaymentModal';
import { DollarSign, TrendingUp, Users, Search, Calendar, CreditCard, ArrowUpRight, Plus } from 'lucide-react';

const FinanceManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'debtors'>('transactions');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [debtors, setDebtors] = useState<{patient: Patient, debt: number}[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDebtorId, setSelectedDebtorId] = useState<string | undefined>(undefined);
  const [stats, setStats] = useState({ totalIncome: 0, totalDebt: 0 });

  const refreshData = () => {
    const p = db.getPayments();
    const d = db.getDebtors();
    setPayments(p);
    setDebtors(d);
    
    // Calc stats
    const income = p.reduce((acc, curr) => acc + curr.amount, 0);
    const debt = d.reduce((acc, curr) => acc + curr.debt, 0);
    setStats({ totalIncome: income, totalDebt: debt });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleOpenPayment = (patientId?: string) => {
      setSelectedDebtorId(patientId);
      setShowPaymentModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header with Symmetric Action Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
         <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gestión Financiera</h1>
         
         <button 
            onClick={() => handleOpenPayment()}
            className="flex items-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
         >
            <Plus size={18} />
            Registrar Nuevo Ingreso
         </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2 opacity-90">
                  <div className="p-2 bg-white/20 rounded-lg"><DollarSign size={24} /></div>
                  <span className="font-medium">Ingresos Totales (Histórico)</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Bs {stats.totalIncome.toLocaleString()}</h2>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-2 text-red-500">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"><TrendingUp size={24} /></div>
                  <span className="font-medium">Cartera Vencida (Por Cobrar)</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Bs {stats.totalDebt.toLocaleString()}</h2>
          </div>
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

          <div className="p-6">
              {activeTab === 'transactions' ? (
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
                              <tr>
                                  <th className="px-4 py-3">Fecha</th>
                                  <th className="px-4 py-3">Paciente</th>
                                  <th className="px-4 py-3">Método</th>
                                  <th className="px-4 py-3 text-right">Monto</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                              {payments.length > 0 ? payments.map(p => (
                                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                      <td className="px-4 py-3 flex items-center gap-2">
                                          <Calendar size={14} className="text-slate-400" />
                                          {new Date(p.date).toLocaleDateString()} <span className="text-xs text-slate-400">{new Date(p.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                      </td>
                                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{p.patientName}</td>
                                      <td className="px-4 py-3">
                                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs">{p.method}</span>
                                      </td>
                                      <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                          + Bs {p.amount.toLocaleString()}
                                      </td>
                                  </tr>
                              )) : (
                                  <tr><td colSpan={4} className="text-center py-10">No hay transacciones registradas.</td></tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              ) : (
                  <div className="space-y-4">
                      {debtors.length > 0 ? debtors.map((d, i) => (
                          <div key={d.patient.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center font-bold">
                                      {i + 1}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-slate-800 dark:text-white">{d.patient.firstName} {d.patient.lastName}</h4>
                                      <p className="text-xs text-slate-500">CI: {d.patient.dni}</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className="text-xs text-slate-400 uppercase">Deuda Pendiente</p>
                                  <p className="text-xl font-bold text-red-600">Bs {d.debt.toLocaleString()}</p>
                                  <button 
                                    onClick={() => handleOpenPayment(d.patient.id)}
                                    className="mt-2 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 ml-auto transition-colors"
                                  >
                                      Completar Pago <ArrowUpRight size={12} />
                                  </button>
                              </div>
                          </div>
                      )) : (
                          <div className="text-center py-10 text-slate-400">
                              <p>¡Excelente! No hay pacientes con deuda pendiente.</p>
                          </div>
                      )}
                  </div>
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
    </div>
  );
};

export default FinanceManager;
