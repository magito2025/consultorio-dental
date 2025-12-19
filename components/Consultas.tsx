import React, { useState, useEffect } from 'react';
import { Consulta, PiezaDental, Patient } from '../types';
import Odontograma from '../components/Odontograma';
import PiezaModal from '../components/PiezaModal';
import { db } from '../services/db';

const Consultas: React.FC = () => {
  const [paciente, setPaciente] = useState<Patient | null>(null);
  const [piezas, setPiezas] = useState<PiezaDental[]>([]);
  const [modal, setModal] = useState<PiezaDental | null>(null);
  const [tratamiento, setTratamiento] = useState('');
  const [pagoHoy, setPagoHoy] = useState(0);
  const [formaPago, setFormaPago] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');
  const [fechaCita, setFechaCita] = useState('');
  const [horaCita, setHoraCita] = useState('');

  const costoTotal = piezas.reduce((s, p) => s + p.precio, 0);
  const saldo = costoTotal - pagoHoy;

  const guardarTodo = async () => {
    // 1) creamos la consulta
    const consulta: Consulta = {
      pacienteId: paciente!.id,
      fecha: new Date(),
      odontograma: piezas,
      tratamiento,
      costoTotal,
      pagos: pagoHoy ? [{ fecha: new Date(), monto: pagoHoy, forma: formaPago }] : [],
      saldo,
    };
    const idConsulta = await db.addConsulta(consulta); // tu servicio

    // 2) si pidió cita, la creamos en Agenda
    if (fechaCita && horaCita) {
      const citaId = await db.addCita({
        patientId: paciente!.id,
        patientName: paciente!.name,
        date: new Date(`${fechaCita}T${horaCita}:00`),
        type: 'Tratamiento',
        status: 'Pendiente',
      });
      await db.updateConsulta(idConsulta, { proxCitaId: citaId });
    }

    alert('Consulta guardada');
    setPiezas([]);
    setTratamiento('');
    setPagoHoy(0);
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Nueva Consulta</h2>

      {/* Selector paciente (simple) */}
      <select
        className="mb-4"
        onChange={(e) => setPaciente(db.getPatient(e.target.value))}
      >
        <option value="">Seleccionar paciente</option>
        {db.getPatients().map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {paciente && (
        <>
          <Odontograma piezas={piezas} onPieceClick={setModal} />
          <PiezaModal
            pieza={modal!}
            onSave={(p) => {
              setPiezas((prev) => {
                const idx = prev.findIndex((x) => x.numero === p.numero);
                return idx >= 0 ? prev.map((x, i) => (i === idx ? p : x)) : [...prev, p];
              });
              setModal(null);
            }}
            onClose={() => setModal(null)}
          />

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Tratamiento general</label>
              <textarea className="w-full" rows={3} value={tratamiento} onChange={(e) => setTratamiento(e.target.value)} />
            </div>
            <div>
              <div className="mb-2"><strong>Costo total:</strong> Bs {costoTotal}</div>
              <div className="mb-2"><strong>Saldo:</strong> Bs {saldo}</div>
              <label className="block mb-1 text-sm">Pago hoy</label>
              <input type="number" className="w-full mb-2" value={pagoHoy} onChange={(e) => setPagoHoy(Number(e.target.value))} />
              <select className="w-full mb-4" value={formaPago} onChange={(e) => setFormaPago(e.target.value as any)}>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <h4 className="font-bold mb-2">Generar cita de seguimiento</h4>
            <div className="flex gap-3 items-end">
              <div>
                <label className="block text-sm mb-1">Fecha</label>
                <input type="date" value={fechaCita} onChange={(e) => setFechaCita(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Hora</label>
                <select value={horaCita} onChange={(e) => setHoraCita(e.target.value)}>
                  <option value="">--</option>
                  {Array.from({ length: 11 }, (_, i) => i + 8).map((h) => (
                    <option key={h} value={`${h}:00`}>{h}:00</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="btn-primary" onClick={guardarTodo}>Guardar consulta y cita</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Consultas;