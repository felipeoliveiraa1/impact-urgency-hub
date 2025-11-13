import { CellDensity } from '@/types/tarefa';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useTarefas } from '@/hooks/useTarefas';
import { useState } from 'react';
import { FormularioTarefa } from './FormularioTarefa';

interface ModalTarefasProps {
  cell: CellDensity;
  open: boolean;
  onClose: () => void;
}

export const ModalTarefas = ({ cell, open, onClose }: ModalTarefasProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const getCategoryLabel = (categoria: string) => {
    const labels = {
      fazer_agora: 'Fazer Agora',
      agendar: 'Agendar',
      delegar: 'Delegar',
      eliminar: 'Eliminar',
    };
    return labels[categoria as keyof typeof labels];
  };

  if (editingId) {
    const tarefa = cell.tarefas.find(t => t.id === editingId);
    if (tarefa) {
      return (
        <FormularioTarefa
          open={open}
          onClose={() => {
            setEditingId(null);
            onClose();
          }}
          tarefa={tarefa}
        />
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Tarefas na posição ({cell.coluna}, {cell.linha}) - {cell.count} tarefa(s)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {cell.tarefas.map((tarefa) => (
            <div key={tarefa.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{tarefa.titulo}</h3>
                  {tarefa.descricao && (
                    <p className="text-sm text-muted-foreground mt-1">{tarefa.descricao}</p>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setEditingId(tarefa.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  Impacto: {tarefa.impacto}
                </Badge>
                <Badge variant="outline">
                  Urgência: {tarefa.urgencia}
                </Badge>
                <Badge variant="outline">
                  Complexidade: {tarefa.complexidade}
                </Badge>
                <Badge variant="outline">
                  Risco: {tarefa.risco}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={`bg-${tarefa.categoria}`}>
                  {tarefa.categoria && getCategoryLabel(tarefa.categoria)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Prioridade: {tarefa.prioridade?.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
