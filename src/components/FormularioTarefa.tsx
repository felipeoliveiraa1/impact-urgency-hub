import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useTarefas } from '@/hooks/useTarefas';
import { Tarefa } from '@/types/tarefa';

interface FormularioTarefaProps {
  open: boolean;
  onClose: () => void;
  tarefa?: Tarefa;
}

export const FormularioTarefa = ({ open, onClose, tarefa }: FormularioTarefaProps) => {
  const { createTarefa, updateTarefa } = useTarefas();
  const [formData, setFormData] = useState({
    titulo: tarefa?.titulo || '',
    descricao: tarefa?.descricao || '',
    task_link: tarefa?.task_link || '',
    impacto: tarefa?.impacto || 5,
    urgencia: tarefa?.urgencia || 5,
    complexidade: tarefa?.complexidade || 5,
    risco: tarefa?.risco || 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (tarefa) {
      updateTarefa({ id: tarefa.id, ...formData });
    } else {
      createTarefa(formData);
    }
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tarefa ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título*</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task_link">Link da Tarefa</Label>
            <Input
              id="task_link"
              type="url"
              placeholder="https://..."
              value={formData.task_link}
              onChange={(e) => setFormData({ ...formData, task_link: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Impacto: {formData.impacto}</Label>
              <Slider
                value={[formData.impacto]}
                onValueChange={([value]) => setFormData({ ...formData, impacto: value })}
                min={1}
                max={10}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Quanto impacto essa tarefa terá nos seus objetivos?
              </p>
            </div>

            <div className="space-y-3">
              <Label>Urgência: {formData.urgencia}</Label>
              <Slider
                value={[formData.urgencia]}
                onValueChange={([value]) => setFormData({ ...formData, urgencia: value })}
                min={1}
                max={10}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Quão urgente é fazer essa tarefa agora?
              </p>
            </div>

            <div className="space-y-3">
              <Label>Complexidade: {formData.complexidade}</Label>
              <Slider
                value={[formData.complexidade]}
                onValueChange={([value]) => setFormData({ ...formData, complexidade: value })}
                min={1}
                max={10}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Quão difícil ou demorada é essa tarefa?
              </p>
            </div>

            <div className="space-y-3">
              <Label>Risco: {formData.risco}</Label>
              <Slider
                value={[formData.risco]}
                onValueChange={([value]) => setFormData({ ...formData, risco: value })}
                min={1}
                max={10}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Qual o risco de não fazer essa tarefa?
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {tarefa ? 'Salvar' : 'Criar Tarefa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
