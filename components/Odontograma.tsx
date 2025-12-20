import React from 'react';
import { PiezaDental, PRECIOS } from '../types';

interface Props {
  piezas: PiezaDental[];
  onPieceClick: (piece: PiezaDental) => void;
}

const Odontograma: React.FC<Props> = ({ piezas, onPieceClick }) => {
  const getStatus = (n: number) => {
    const p = piezas.find((x) => x.numero === n);
    return p ? p.estado : 'sano';
  };

  // Dibujo rápido: 16 piezas superiores e inferiores
  const adultPieces = Array.from({ length: 16 }, (_, i) => i + 11); // 11-26

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-xl shadow">
      <h4 className="font-bold mb-3 text-center">Odontograma</h4>
      <div className="flex flex-col gap-2">
        {/* Arcada superior */}
        <div className="flex justify-center gap-1">
          {adultPieces.map((n) => (
            <button
              key={n}
              onClick={() => onPieceClick({ numero: n, estado: getStatus(n), notas: '', precio: 0 })}
              className={`w-8 h-8 rounded-md border text-xs font-bold transition
                ${getStatus(n) === 'sano' ? 'bg-green-100 border-green-300' : ''}
                ${getStatus(n) === 'caries' ? 'bg-red-100 border-red-300' : ''}
                ${getStatus(n) === 'obturado' ? 'bg-blue-100 border-blue-300' : ''}
                ${getStatus(n) === 'corona' ? 'bg-yellow-100 border-yellow-300' : ''}
                ${getStatus(n) === 'extraccion' ? 'bg-gray-100 border-gray-300' : ''}
                hover:scale-105
              `}
              title={`Pieza ${n}`}
            >
              {n}
            </button>
          ))}
        </div>
        {/* Arcada inferior (espejo) */}
        <div className="flex justify-center gap-1">
          {adultPieces.map((n) => (
            <button
              key={n + 20}
              onClick={() => onPieceClick({ numero: n + 20, estado: getStatus(n + 20), notas: '', precio: 0 })}
              className={`w-8 h-8 rounded-md border text-xs font-bold transition
                ${getStatus(n + 20) === 'sano' ? 'bg-green-100 border-green-300' : ''}
                ${getStatus(n + 20) === 'caries' ? 'bg-red-100 border-red-300' : ''}
                ${getStatus(n + 20) === 'obturado' ? 'bg-blue-100 border-blue-300' : ''}
                ${getStatus(n + 20) === 'corona' ? 'bg-yellow-100 border-yellow-300' : ''}
                ${getStatus(n + 20) === 'extraccion' ? 'bg-gray-100 border-gray-300' : ''}
                hover:scale-105
              `}
              title={`Pieza ${n + 20}`}
            >
              {n + 20}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Odontograma;