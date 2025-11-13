import { CellDensity, TaskCategory } from '@/types/tarefa';
import { cn } from '@/lib/utils';

interface CelulaMatrizProps {
  cell: CellDensity;
  quadrant: TaskCategory;
  onClick: () => void;
  isOnDivider?: boolean;
}

export const CelulaMatriz = ({ cell, quadrant, onClick, isOnDivider }: CelulaMatrizProps) => {
  const getBackgroundColor = () => {
    if (cell.count === 0) {
      return 'bg-white';
    }
    
    // Cells with tasks - full color based on quadrant
    if (quadrant === 'fazer_agora') {
      if (cell.count === 1) return 'bg-fazer-agora/50';
      if (cell.count === 2) return 'bg-fazer-agora/70';
      return 'bg-fazer-agora/90';
    }
    
    // Other quadrants use gray scale
    if (cell.count === 1) return 'bg-gray-200';
    if (cell.count === 2) return 'bg-gray-300';
    return 'bg-gray-400';
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full h-full border border-[#E5E7EB] transition-all hover:scale-105 hover:shadow-lg relative group',
        getBackgroundColor(),
        cell.count > 0 && 'cursor-pointer',
        isOnDivider && 'z-10'
      )}
      disabled={cell.count === 0}
    >
      {cell.count > 0 && (
        <>
          <span className="absolute inset-0 flex items-center justify-center font-bold text-lg text-foreground">
            {cell.count}
          </span>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-medium">Ver tarefas</span>
          </div>
        </>
      )}
    </button>
  );
};
