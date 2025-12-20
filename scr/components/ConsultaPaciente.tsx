import React, { useState } from 'react';
import { Patient, PiezaDental, PRECIOS } from '../types';
import Odontograma from './Odontograma';
import PiezaModal from './PiezaModal';
import { db } from '../services/db';

interface Props {
  patient: Patient;
}

const ConsultaPaciente: React.FC<Props> = ({ patient }) => {
  const [piezas, setPiezas] = useState<PiezaDental[]>([]);
  const [modal, setModal] = useState<PiezaDental | null>(null);
  const [pago, setPago] = useState(0);
  const [forma, setForma] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');

  const deudaAnterior = patient.debt || 0;
  const costoNuevo = piezas.reduce((s, p) => s + (PRECIOS[p.estado] || 0), 0);
  const total = costoNuevo + deudaAnterior;
  const saldo = total - pago;

  const guardar = () => {
    db.addConsulta({
      pacienteId: patient.id,
      fecha: new Date(),
      odontograma: piezas,
      tratamiento: piezas.map((p) => `Pieza ${p.numero}: ${p.estado}`).join(', '),
      costoTotal: costoNuevo,
      pagos: pago ? [{ fecha: new Date(), monto: pago, forma }] : [],
      saldo,
    });
    db.updatePatient({ ...patient, debt: saldo });
    alert('Consulta guardada');
    setPiezas([]);
    setPago(0);
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-2">Consulta - {patient.name}</h3>

      <Odontograma piezas={piezas} onPieceClick={setModal} />
      {modal && (
        <PiezaModal
          pieza={modal}
          onSave={(p) => {
            setPiezas((prev) => {
              const idx = prev.findIndex((x) => x.numero === p.numero);
              return idx >= 0 ? prev.map((x, i) => (i === idx ? p : x)) : [...prev, p];
            });
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
        <div>Deuda anterior: <span className="font-bold">Bs {deudaAnterior}</span></div>
        <div>Nuevo tratamiento: <span className="font-bold">Bs {costoNuevo}</span></div>
        <div>Total a pagar: <span className="font-bold text-lg">Bs {total}</span></div>
      </div>

      <div className="mt-4 flex gap-3 items-end">
        <div>
          <label className="block mb-1">Pago hoy</label>
          <input type="number" className="w-32" value={pago} onChange={(e) => setPago(Number(e.target.value))} />
        </div>
        <select value={forma} onChange={(e) => setForma(e.target.value as any)}>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
        </select>
        <div className="ml-auto text-right">
          <div className="text-xs text-slate-500">Saldo pendiente</div>
          <div className="text-lg font-bold">Bs {saldo}</div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="btn-primary" onClick={guardar}>Guardar consulta</button>
      </div>
    </div>
  );
};

export default ConsultaPaciente;