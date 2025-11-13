import { CellDensity } from '@/types/tarefa';
import { cn } from '@/lib/utils';

interface CelulaMatrizProps {
  cell: CellDensity;
  onClick: () => void;
}

export const CelulaMatriz = ({ cell, onClick }: CelulaMatrizProps) => {
  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-white';
    if (count === 1) return 'bg-gray-400'; // Cinza médio
    if (count >= 2 && count <= 3) return 'bg-gray-600'; // Cinza escuro
    return 'bg-orange-400'; // Laranja para 4+
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'aspect-square border border-gray-200 transition-all',
        getCellColor(cell.count),
        cell.count > 0 && 'cursor-pointer hover:opacity-80 hover:border-gray-400'
      )}
      disabled={cell.count === 0}
    >
      {/* Cells are solid blocks - no text/count displayed */}
    </button>
  );
};
