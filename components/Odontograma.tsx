import React from 'react';
import DentalChart from 'react-dental-chart';
import { PiezaDental } from '../types';

interface Props {
  piezas: PiezaDental[];
  onPieceClick: (piece: PiezaDental) => void;
  readOnly?: boolean;
}

const Odontograma: React.FC<Props> = ({ piezas, onPieceClick, readOnly = false }) => {
  // mapeo interno de la librería
  const statusMap: Record<string, string> = {
    sano: 'healthy',
    caries: 'caries',
    obturado: 'filling',
    corona: 'crown',
    extraccion: 'extracted',
    puente: 'bridge',
    rx: 'rx',
    ausente: 'missing',
  };

  const getStatus = (n: number) => {
    const p = piezas.find((x) => x.numero === n);
    return p ? statusMap[p.estado] || 'healthy' : 'healthy';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow">
      <DentalChart
        adult
        onClick={(n) => {
          if (readOnly) return;
          const p = piezas.find((x) => x.numero === n) || {
            numero: n,
            estado: 'sano',
            notas: '',
            precio: 0,
          };
          onPieceClick(p);
        }}
        pieceStatus={Array.from({ length: 52 }, (_, i) => getStatus(i + 11))}
      />
    </div>
  );
};

export default Odontograma;