import { useMemo, useState } from 'react';
import { Tarefa, CellDensity } from '@/types/tarefa';
import { CelulaMatriz } from './CelulaMatriz';
import { ModalTarefas } from './ModalTarefas';
interface MatrizEisenhowerProps {
  tarefas: Tarefa[];
}
export const MatrizEisenhower = ({
  tarefas
}: MatrizEisenhowerProps) => {
  const [selectedCell, setSelectedCell] = useState<CellDensity | null>(null);
  const cellDensity = useMemo(() => {
    const density = new Map<string, CellDensity>();

    // Create 11x11 grid
    for (let linha = 1; linha <= 11; linha++) {
      for (let coluna = 1; coluna <= 11; coluna++) {
        density.set(`${linha}-${coluna}`, {
          linha,
          coluna,
          count: 0,
          tarefas: []
        });
      }
    }

    // Database now returns values 1-11 directly, no mapping needed
    tarefas.forEach(tarefa => {
      if (tarefa.linha && tarefa.coluna) {
        const key = `${tarefa.linha}-${tarefa.coluna}`;
        const cell = density.get(key);
        if (cell) {
          cell.count++;
          cell.tarefas.push(tarefa);
        }
      }
    });
    return density;
  }, [tarefas]);
  const getQuadrant = (linha: number, coluna: number) => {
    // Q1: Upper right (Urgent & Important) - Orange
    if (linha > 6 && coluna > 6) return 'fazer_agora';
    // Q2: Upper left (Not Urgent & Important) - Light gray
    if (linha > 6 && coluna <= 6) return 'agendar';
    // Q3: Lower right (Urgent & Not Important) - Light gray
    if (linha <= 6 && coluna > 6) return 'delegar';
    // Q4: Lower left (Not Urgent & Not Important) - Light gray
    return 'eliminar';
  };
  return <>
      <div className="w-full max-w-[1200px] mx-auto p-4">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2">Matriz TN    </h1>
          <p className="text-muted-foreground">Sistema de priorização baseado em 4 critérios</p>
        </div>

        {/* Labels dos eixos */}
        <div className="relative">
          <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
            <p className="text-xl font-semibold whitespace-nowrap">Urgente</p>
          </div>
          
          <div className="mb-4 text-center">
            <p className="text-xl font-semibold">Importante</p>
          </div>

          {/* Grid da matriz 11x11 */}
          <div className="relative border-[6px] border-black bg-white p-0 aspect-square max-w-[800px] mx-auto">
            <div className="grid grid-cols-11 gap-0 h-full">
              {Array.from({
              length: 11
            }, (_, linhaIdx) => {
              const linha = 11 - linhaIdx; // Inverte para urgência crescente de baixo para cima
              return Array.from({
                length: 11
              }, (_, colunaIdx) => {
                const coluna = colunaIdx + 1;
                const key = `${linha}-${coluna}`;
                const cell = cellDensity.get(key)!;
                const quadrant = getQuadrant(linha, coluna);
                const isLinhaColuna6 = linha === 6 || coluna === 6;
                return <CelulaMatriz key={key} cell={cell} quadrant={quadrant} onClick={() => setSelectedCell(cell)} isOnDivider={isLinhaColuna6} />;
              });
            })}
            </div>
            
            {/* Linha divisória horizontal - na linha 5 (divide em 50%) */}
            
            
            {/* Linha divisória vertical - na coluna 5 (divide em 50%) */}
            
          </div>

          {/* Legenda dos quadrantes */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-fazer-agora/20 border-2 border-fazer-agora">
              <h3 className="font-bold text-lg mb-1">Fazer Agora</h3>
              <p className="text-sm text-muted-foreground">Alto impacto + Alta urgência</p>
            </div>
            <div className="p-4 rounded-lg bg-agendar/20 border-2 border-agendar">
              <h3 className="font-bold text-lg mb-1">Agendar</h3>
              <p className="text-sm text-muted-foreground">Alto impacto + Baixa urgência</p>
            </div>
            <div className="p-4 rounded-lg bg-delegar/20 border-2 border-delegar">
              <h3 className="font-bold text-lg mb-1">Delegar</h3>
              <p className="text-sm text-muted-foreground">Baixo impacto + Alta urgência</p>
            </div>
            <div className="p-4 rounded-lg bg-eliminar/20 border-2 border-eliminar">
              <h3 className="font-bold text-lg mb-1">Eliminar</h3>
              <p className="text-sm text-muted-foreground">Baixo impacto + Baixa urgência</p>
            </div>
          </div>
        </div>
      </div>

      {selectedCell && <ModalTarefas cell={selectedCell} open={!!selectedCell} onClose={() => setSelectedCell(null)} />}
    </>;
};