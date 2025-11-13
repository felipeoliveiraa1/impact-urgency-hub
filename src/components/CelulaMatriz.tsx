import { CellDensity, TaskCategory } from '@/types/tarefa';
import { cn } from '@/lib/utils';

interface CelulaMatrizProps {
  cell: CellDensity;
  quadrant: TaskCategory;
  onClick: () => void;
  isOnDivider?: boolean;
}

export const CelulaMatriz = ({ cell, quadrant, onClick, isOnDivider }: CelulaMatrizProps) => {
  const getBackgroundColor = (count: number) => {
    const baseColor = `bg-${quadrant}`;
    
    if (count === 0) return baseColor;
    if (count === 1) return `${baseColor}/40`;
    if (count === 2) return `${baseColor}/60`;
    if (count >= 3) return `${baseColor}/80`;
    return baseColor;
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full h-full border border-[#E5E7EB] transition-all hover:scale-105 hover:shadow-lg relative group',
        getBackgroundColor(cell.count),
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
