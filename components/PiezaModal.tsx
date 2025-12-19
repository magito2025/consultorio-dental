import React, { useState } from 'react';
import { PiezaDental } from '../types';

interface Props {
  pieza: PiezaDental;
  onSave: (p: PiezaDental) => void;
  onClose: () => void;
}

const PiezaModal: React.FC<Props> = ({ pieza, onSave, onClose }) => {
  const [estado, setEstado] = useState(pieza.estado);
  const [notas, setNotas] = useState(pieza.notas);
  const [precio, setPrecio] = useState(pieza.precio);

  const handleSave = () => {
    onSave({ ...pieza, estado, notas, precio: Number(precio) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-bold mb-4">Pieza {pieza.numero}</h3>

        <label className="block mb-2 text-sm">Estado</label>
        <select className="w-full mb-3" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="sano">Sano</option>
          <option value="caries">Caries</option>
          <option value="obturado">Obturado</option>
          <option value="corona">Corona</option>
          <option value="extraccion">Extracción</option>
          <option value="puente">Puente</option>
          <option value="rx">Radiografía</option>
          <option value="ausente">Ausente</option>
        </select>

        <label className="block mb-2 text-sm">Notas</label>
        <textarea className="w-full mb-3" rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} />

        <label className="block mb-2 text-sm">Precio (Bs)</label>
        <input type="number" className="w-full mb-4" value={precio} onChange={(e) => setPrecio(e.target.value)} />

        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default PiezaModal;