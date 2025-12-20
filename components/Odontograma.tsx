// C:\dentalhagc\components\Odontograma.tsx
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

  // Cuadrantes dentales profesionales
  const cuadrante1 = [18, 17, 16, 15, 14, 13, 12, 11]; // Superior derecho
  const cuadrante2 = [21, 22, 23, 24, 25, 26, 27, 28]; // Superior izquierdo
  const cuadrante3 = [31, 32, 33, 34, 35, 36, 37, 38]; // Inferior izquierdo
  const cuadrante4 = [41, 42, 43, 44, 45, 46, 47, 48]; // Inferior derecho

  const renderPiece = (n: number) => (
    <button
      key={n}
      onClick={() => onPieceClick({ numero: n, estado: getStatus(n), notas: '', precio: 0 })}
      disabled={readOnly}
      className={`w-7 h-8 rounded border text-[10px] font-bold transition-all
        ${getStatus(n) === 'sano' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''}
        ${getStatus(n) === 'caries' ? 'bg-red-50 border-red-200 text-red-600' : ''}
        ${getStatus(n) === 'obturado' ? 'bg-blue-50 border-blue-200 text-blue-600' : ''}
        ${getStatus(n) === 'corona' ? 'bg-amber-50 border-amber-200 text-amber-600' : ''}
        ${getStatus(n) === 'extraccion' ? 'bg-slate-100 border-slate-300 text-slate-500' : ''}
        hover:scale-110 active:scale-95
      `}
      title={`Pieza ${n}`}
    >
      {n}
    </button>
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
      {/* Arcada Superior */}
      <div className="flex justify-center gap-4 mb-3">
        <div className="flex gap-0.5">{cuadrante1.map(renderPiece)}</div>
        <div className="w-[1px] bg-slate-200" />
        <div className="flex gap-0.5">{cuadrante2.map(renderPiece)}</div>
      </div>
      
      {/* Arcada Inferior */}
      <div className="flex justify-center gap-4">
        <div className="flex gap-0.5">{cuadrante4.map(renderPiece)}</div>
        <div className="w-[1px] bg-slate-200" />
        <div className="flex gap-0.5">{cuadrante3.map(renderPiece)}</div>
      </div>
    </div>
  );
};

export default Odontograma;