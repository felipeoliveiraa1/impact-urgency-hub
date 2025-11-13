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

  const getQuadrant = (linha: number, coluna: number) => {
    if (linha > 7 && coluna > 7) return 'fazer_agora';
    if (linha <= 7 && coluna > 7) return 'agendar';
    if (linha > 7 && coluna <= 7) return 'delegar';
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
          <div className="absolute -left-32 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
            <p className="text-lg font-semibold whitespace-nowrap">Urgência (1-10) →</p>
          </div>
          
          <div className="mb-2 text-center">
            <p className="text-lg font-semibold">← Impacto (1-10) →</p>
          </div>

          {/* Grid da matriz */}
          <div className="grid grid-cols-10 gap-1 bg-border p-2 rounded-lg">
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
                  />
                );
              });
            })}
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
