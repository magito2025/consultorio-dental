import React from 'react';
import { PiezaDental } from '../types';

interface Props {
  piezas: PiezaDental[];
  onPieceClick: (p: PiezaDental) => void;
  readOnly?: boolean;
}

const Odontograma: React.FC<Props> = ({ piezas, onPieceClick, readOnly = false }) => {
  const getStatus = (n: number) => {
    const p = piezas.find((x) => x.numero === n);
    return p ? p.estado : 'sano';
  };

  const adultPieces = Array.from({ length: 16 }, (_, i) => i + 11); // 11-26

  return (
    <div className="w-full p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <h4 className="text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Odontograma (click en pieza)</h4>
      <div className="flex justify-center gap-1 mb-2">
        {adultPieces.map((n) => (
          <button
            key={n}
            onClick={() => onPieceClick({ numero: n, estado: getStatus(n), notas: '', precio: 0 })}
            className={`w-7 h-7 rounded-md border text-xs font-bold transition
              ${getStatus(n) === 'sano' ? 'bg-green-100 border-green-300' : ''}
              ${getStatus(n) === 'caries' ? 'bg-red-100 border-red-300' : ''}
              ${getStatus(n) === 'obturado' ? 'bg-blue-100 border-blue-300' : ''}
              ${getStatus(n) === 'corona' ? 'bg-yellow-100 border-yellow-300' : ''}
              ${getStatus(n) === 'extraccion' ? 'bg-gray-100 border-gray-300' : ''}
              hover:scale-105
            `}
            title={`Pieza ${n}`}
            disabled={readOnly}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-1">
        {adultPieces.map((n) => (
          <button
            key={n + 20}
            onClick={() => onPieceClick({ numero: n + 20, estado: getStatus(n + 20), notas: '', precio: 0 })}
            className={`w-7 h-7 rounded-md border text-xs font-bold transition
              ${getStatus(n + 20) === 'sano' ? 'bg-green-100 border-green-300' : ''}
              ${getStatus(n + 20) === 'caries' ? 'bg-red-100 border-red-300' : ''}
              ${getStatus(n + 20) === 'obturado' ? 'bg-blue-100 border-blue-300' : ''}
              ${getStatus(n + 20) === 'corona' ? 'bg-yellow-100 border-yellow-300' : ''}
              ${getStatus(n + 20) === 'extraccion' ? 'bg-gray-100 border-gray-300' : ''}
              hover:scale-105
            `}
            title={`Pieza ${n + 20}`}
            disabled={readOnly}
          >
            {n + 20}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Odontograma;