import { useMemo, useState } from 'react';
import { Tarefa, CellDensity } from '@/types/tarefa';
import { CelulaMatriz } from './CelulaMatriz';
import { ModalTarefas } from './ModalTarefas';

interface MatrizEisenhowerProps {
  tarefas: Tarefa[];
}

export const MatrizEisenhower = ({ tarefas }: MatrizEisenhowerProps) => {
  const [selectedCell, setSelectedCell] = useState<CellDensity | null>(null);

  const cellDensity = useMemo(() => {
    const density = new Map<string, CellDensity>();
    
    for (let linha = 1; linha <= 12; linha++) {
      for (let coluna = 1; coluna <= 12; coluna++) {
        density.set(`${linha}-${coluna}`, {
          linha,
          coluna,
          count: 0,
          tarefas: [],
        });
      }
    }

    tarefas.forEach(tarefa => {
      if (tarefa.linha && tarefa.coluna) {
        const key = `${tarefa.linha}-${tarefa.coluna}`;
        const cell = density.get(key)!;
        cell.count++;
        cell.tarefas.push(tarefa);
      }
    });

    return density;
  }, [tarefas]);

  return (
    <>
      <div className="w-full max-w-[700px] mx-auto">
        {/* Container with labels */}
        <div className="relative">
          {/* Top label - Importante */}
          <div className="text-center mb-4">
            <p className="text-lg font-bold text-foreground">Importante</p>
          </div>

          <div className="flex items-center">
            {/* Left label - Urgente (rotated) */}
            <div className="relative -mr-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8">
                <p className="text-lg font-bold text-foreground whitespace-nowrap origin-center -rotate-90">
                  Urgente
                </p>
              </div>
            </div>

            {/* Matrix container with thick black border */}
            <div className="relative border-[8px] border-black bg-white">
              {/* Grid 12x12 */}
              <div className="grid grid-cols-12 gap-0">
                {Array.from({ length: 12 }, (_, rowIdx) => {
                  const linha = 12 - rowIdx; // Inverte para urgência crescente de baixo para cima
                  return Array.from({ length: 12 }, (_, colIdx) => {
                    const coluna = colIdx + 1;
                    const key = `${linha}-${coluna}`;
                    const cell = cellDensity.get(key)!;

                    return (
                      <CelulaMatriz
                        key={key}
                        cell={cell}
                        onClick={() => cell.count > 0 && setSelectedCell(cell)}
                      />
                    );
                  });
                })}
              </div>

              {/* Reference lines - horizontal (splits urgency) */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-muted-foreground/30 pointer-events-none" />
              
              {/* Reference lines - vertical (splits importance) */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-muted-foreground/30 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {selectedCell && (
        <ModalTarefas
          cell={selectedCell}
          open={!!selectedCell}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </>
  );
};
