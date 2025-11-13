import { CellDensity, TaskCategory } from '@/types/tarefa';
import { cn } from '@/lib/utils';

interface CelulaMatrizProps {
  cell: CellDensity;
  quadrant: TaskCategory;
  onClick: () => void;
  isOnDivider?: boolean;
}

export const CelulaMatriz = ({ cell, quadrant, onClick, isOnDivider }: CelulaMatrizProps) => {
  const getDensityColor = (count: number) => {
    if (count === 0) return 'bg-white';
    if (count === 1) return `bg-${quadrant}/20`;
    if (count === 2) return `bg-${quadrant}/40`;
    if (count === 3) return `bg-${quadrant}/60`;
    if (count >= 4) return `bg-${quadrant}/80`;
    return 'bg-white';
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'aspect-square border border-gray-200 transition-all hover:scale-105 hover:shadow-lg relative group',
        getDensityColor(cell.count),
        cell.count > 0 && 'cursor-pointer',
        isOnDivider && 'z-10'
      )}
      disabled={cell.count === 0}
    >
      {cell.count > 0 && (
        <>
          <span className="absolute inset-0 flex items-center justify-center font-bold text-foreground">
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
