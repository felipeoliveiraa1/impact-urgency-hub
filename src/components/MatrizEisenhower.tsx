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
    
    // Create 10x10 grid
    for (let linha = 1; linha <= 10; linha++) {
      for (let coluna = 1; coluna <= 10; coluna++) {
        density.set(`${linha}-${coluna}`, {
          linha,
          coluna,
          count: 0,
          tarefas: [],
        });
      }
    }

    // Map database values (1-12) to grid values (1-10)
    const mapToGrid = (value: number) => Math.min(Math.ceil(value * 10 / 12), 10);

    tarefas.forEach(tarefa => {
      if (tarefa.linha && tarefa.coluna) {
        const mappedLinha = mapToGrid(tarefa.linha);
        const mappedColuna = mapToGrid(tarefa.coluna);
        const key = `${mappedLinha}-${mappedColuna}`;
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
    if (linha > 5 && coluna > 5) return 'fazer_agora';
    // Q2: Upper left (Not Urgent & Important) - Light gray
    if (linha > 5 && coluna <= 5) return 'agendar';
    // Q3: Lower right (Urgent & Not Important) - Light gray
    if (linha <= 5 && coluna > 5) return 'delegar';
    // Q4: Lower left (Not Urgent & Not Important) - Light gray
    return 'eliminar';
  };

  return (
    <>
      <div className="w-full max-w-[1200px] mx-auto p-4">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2">Matriz de Eisenhower</h1>
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

          {/* Grid da matriz 10x10 */}
          <div className="relative border-[6px] border-black bg-white p-0 aspect-square max-w-[800px] mx-auto">
            <div className="grid grid-cols-10 gap-0 h-full">
              {Array.from({ length: 10 }, (_, linhaIdx) => {
                const linha = 10 - linhaIdx; // Inverte para urgência crescente de baixo para cima
                return Array.from({ length: 10 }, (_, colunaIdx) => {
                  const coluna = colunaIdx + 1;
                  const key = `${linha}-${coluna}`;
                  const cell = cellDensity.get(key)!;
                  const quadrant = getQuadrant(linha, coluna);

                  return (
                    <CelulaMatriz
                      key={key}
                      cell={cell}
                      quadrant={quadrant}
                      onClick={() => setSelectedCell(cell)}
                      isOnDivider={linha === 6 || coluna === 6}
                    />
                  );
                });
              })}
            </div>
            
            {/* Linha divisória horizontal - na linha 5 (divide em 50%) */}
            <div className="absolute left-0 right-0 h-[6px] bg-black z-20" style={{ top: '50%', transform: 'translateY(-50%)' }} />
            
            {/* Linha divisória vertical - na coluna 5 (divide em 50%) */}
            <div className="absolute top-0 bottom-0 w-[6px] bg-black z-20" style={{ left: '50%', transform: 'translateX(-50%)' }} />
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
