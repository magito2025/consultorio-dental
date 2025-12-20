
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/db';
import { Patient, Treatment } from '../types';
import { X, FileText, Calendar, Activity, Printer } from 'lucide-react';

interface ClinicalHistoryModalProps {
  patient: Patient;
  onClose: () => void;
}

const ClinicalHistoryModal: React.FC<ClinicalHistoryModalProps> = ({ patient, onClose }) => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [logo, setLogo] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setTreatments(db.getTreatmentsByPatient(patient.id));
    setLogo(db.getLogo());
  }, [patient.id]);

  const handlePrint = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const doc = iframe.contentWindow?.document;
      if (!doc) return;

      const clinicLogo = logo ? `<img src="${logo}" style="height: 60px; max-width: 180px; object-fit: contain; display: block;" />` : `<h1 style="color: #0f172a; font-size: 24px; font-weight: bold; margin: 0;">Clínica Dr. Taboada</h1>`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Historia Clínica - ${patient.firstName} ${patient.lastName}</title>
          <style>
            @media print {
                @page { size: A4; margin: 15mm; }
                body { -webkit-print-color-adjust: exact; }
            }
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 20px; margin: 0; font-size: 12px; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0d9488; padding-bottom: 15px; margin-bottom: 25px; }
            .clinic-info { text-align: right; font-size: 11px; color: #64748b; }
            
            .patient-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 25px; }
            .row { display: flex; gap: 20px; margin-bottom: 10px; }
            .col { flex: 1; }
            .label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 3px; display: block; letter-spacing: 0.5px; }
            .value { font-size: 13px; font-weight: 600; color: #0f172a; }
            .alert { color: #dc2626; font-weight: bold; background: #fee2e2; padding: 2px 6px; border-radius: 4px; }
            
            h3 { font-size: 16px; margin: 0 0 15px 0; color: #0d9488; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
            
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th { text-align: left; background: #f1f5f9; font-size: 10px; text-transform: uppercase; color: #475569; padding: 10px 8px; font-weight: bold; border-bottom: 2px solid #cbd5e1; }
            td { padding: 10px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
            tr:nth-child(even) { background-color: #fcfcfc; }
            
            .status-completed { color: #059669; font-weight: bold; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; display: inline-block; font-size: 10px; }
            
            .footer { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; background: white; }
            
            .signature-box { margin-top: 50px; page-break-inside: avoid; display: flex; justify-content: flex-end; }
            .signature-line { width: 200px; border-top: 1px solid #333; text-align: center; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>${clinicLogo}</div>
            <div class="clinic-info">
              <p style="font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 5px;">Odontología Integral Especializada</p>
              <p>Fecha de Impresión: ${new Date().toLocaleDateString()}</p>
              <p>Historia Clínica Digital # ${patient.id.substring(0, 6).toUpperCase()}</p>
            </div>
          </div>

          <div class="patient-card">
             <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: baseline;">
                <div>
                    <span class="label">Paciente</span>
                    <span class="value" style="font-size: 18px;">${patient.firstName} ${patient.lastName}</span>
                </div>
                <div>
                     <span class="label" style="text-align: right;">CI / DNI</span>
                     <span class="value">${patient.dni || '---'}</span>
                </div>
             </div>
             
             <div class="row">
                <div class="col">
                   <span class="label">Edad / Sexo</span>
                   <span class="value">${patient.age ? patient.age + ' años' : '--'} / ${patient.gender || '--'}</span>
                </div>
                <div class="col">
                   <span class="label">Celular</span>
                   <span class="value">${patient.phone || '---'}</span>
                </div>
                <div class="col">
                   <span class="label">Ocupación</span>
                   <span class="value">${patient.occupation || '---'}</span>
                </div>
             </div>
             
             <div class="row" style="margin-top: 15px;">
                <div class="col">
                   <span class="label">Alergias</span>
                   <span class="value ${patient.allergies && patient.allergies !== 'Ninguna' ? 'alert' : ''}">${patient.allergies || 'Ninguna'}</span>
                </div>
                <div class="col" style="flex: 2;">
                   <span class="label">Antecedentes Patológicos</span>
                   <span class="value" style="line-height: 1.4;">${patient.medicalHistory && patient.medicalHistory.length > 0 ? patient.medicalHistory.join(', ') : 'Sin antecedentes registrados'}</span>
                </div>
             </div>
          </div>

          <h3>Evolución y Tratamientos Realizados</h3>
          
          <table>
             <thead>
                <tr>
                   <th width="12%">Fecha</th>
                   <th width="25%">Procedimiento</th>
                   <th width="40%">Detalle Clínico / Evolución</th>
                   <th width="13%">Estado</th>
                </tr>
             </thead>
             <tbody>
                ${treatments.length > 0 ? treatments.map(t => `
                  <tr>
                     <td>${new Date(t.date).toLocaleDateString()}</td>
                     <td><strong>${t.procedure}</strong></td>
                     <td>${t.description}</td>
                     <td><span class="${t.status === 'Completado' ? 'status-completed' : ''}">${t.status}</span></td>
                  </tr>
                `).join('') : '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #94a3b8; font-style: italic;">No hay tratamientos registrados en el historial.</td></tr>'}
             </tbody>
          </table>

          <div class="signature-box">
             <div class="signature-line">
                 <strong>Dr. Taboada</strong><br>
                 <span style="font-size: 10px; color: #64748b;">Cirujano Dentista - Director</span>
             </div>
          </div>

          <div class="footer">
             Documento generado digitalmente por sistema DentalFlow TMG | Confidencial
          </div>
        </body>
        </html>
      `;

      // Clear previous content
      doc.open();
      doc.write(htmlContent);
      doc.close();

      // Ensure content is loaded, especially images, before printing
      const img = doc.querySelector('img');
      if (img) {
          img.onload = () => {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();
          };
          // Fallback if image load fails or takes too long
          setTimeout(() => {
             if (!iframe.contentWindow?.matchMedia('print').matches) { 
                 iframe.contentWindow?.print(); 
             }
          }, 1000);
      } else {
          // No image, print immediately
          setTimeout(() => {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();
          }, 300);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Hidden Iframe for Printing */}
        <iframe 
            ref={iframeRef} 
            style={{ position: 'absolute', width: '0', height: '0', border: 'none' }} 
            title="print-frame" 
        />

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
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/40 rounded-lg transition-colors text-sm font-bold shadow-sm" 
                title="Imprimir Informe (A4)"
            >
               <Printer size={18} /> Imprimir Reporte
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
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-600">
                    <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Edad</span>
                    <span className="font-bold text-slate-700 dark:text-white text-lg">{patient.age ? patient.age + ' años' : '-'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-600">
                    <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Celular</span>
                    <span className="font-bold text-slate-700 dark:text-white text-lg">{patient.phone || '-'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg col-span-2 border border-slate-100 dark:border-slate-600">
                    <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Alergias</span>
                    <span className={`font-bold text-lg ${patient.allergies && patient.allergies !== 'Ninguna' ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-white'}`}>
                        {patient.allergies || 'Ninguna'}
                    </span>
                </div>
            </div>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 dark:bg-slate-900/10">
            <div className="mb-4 flex items-center gap-2 text-slate-800 dark:text-white font-bold">
                 <Activity size={20} className="text-primary" />
                 <h3>Historia Clínica Detallada</h3>
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
                            <p className="mb-2 font-medium">{t.description}</p>
                            <p className="text-xs font-mono text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">Costo: Bs {t.cost} | Registrado por: Dr. Taboada</p>
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
