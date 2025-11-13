import { useMemo, useState } from 'react';
import { Tarefa, TaskCategory } from '@/types/tarefa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar, Users, XCircle, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormularioTarefa } from './FormularioTarefa';

interface DashboardEstatisticasProps {
  tarefas: Tarefa[];
}

export const DashboardEstatisticas = ({
  tarefas
}: DashboardEstatisticasProps) => {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const byCategory = {
      fazer_agora: tarefas.filter(t => t.categoria === 'fazer_agora').length,
      agendar: tarefas.filter(t => t.categoria === 'agendar').length,
      delegar: tarefas.filter(t => t.categoria === 'delegar').length,
      eliminar: tarefas.filter(t => t.categoria === 'eliminar').length
    };
    const avgPriority = tarefas.length > 0 ? tarefas.reduce((sum, t) => sum + (t.prioridade || 0), 0) / tarefas.length : 0;
    return {
      byCategory,
      avgPriority,
      total: tarefas.length
    };
  }, [tarefas]);

  const getCategoryLabel = (categoria: TaskCategory) => {
    const labels = {
      fazer_agora: 'Fazer Agora',
      agendar: 'Agendar',
      delegar: 'Delegar',
      eliminar: 'Eliminar'
    };
    return labels[categoria];
  };

  const filteredTarefas = selectedCategory 
    ? tarefas.filter(t => t.categoria === selectedCategory)
    : [];

  if (editingId) {
    const tarefa = filteredTarefas.find(t => t.id === editingId);
    if (tarefa) {
      return <FormularioTarefa 
        open={true} 
        onClose={() => {
          setEditingId(null);
          setSelectedCategory(null);
        }} 
        tarefa={tarefa} 
      />;
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 max-w-6xl mx-auto">
        <Card 
          className="bg-fazer-agora/10 border-fazer-agora cursor-pointer hover:bg-fazer-agora/20 transition-colors"
          onClick={() => setSelectedCategory('fazer_agora')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fazer Agora</CardTitle>
            <AlertCircle className="h-4 w-4 text-fazer-agora" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byCategory.fazer_agora}</div>
            <p className="text-xs text-muted-foreground">
              {(stats.byCategory.fazer_agora / stats.total * 100 || 0).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-agendar/10 border-agendar cursor-pointer hover:bg-agendar/20 transition-colors"
          onClick={() => setSelectedCategory('agendar')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendar</CardTitle>
            <Calendar className="h-4 w-4 text-agendar" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byCategory.agendar}</div>
            <p className="text-xs text-muted-foreground">
              {(stats.byCategory.agendar / stats.total * 100 || 0).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-delegar/10 border-delegar cursor-pointer hover:bg-delegar/20 transition-colors"
          onClick={() => setSelectedCategory('delegar')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delegar</CardTitle>
            <Users className="h-4 w-4 text-delegar" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byCategory.delegar}</div>
            <p className="text-xs text-muted-foreground">
              {(stats.byCategory.delegar / stats.total * 100 || 0).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-eliminar/10 border-eliminar cursor-pointer hover:bg-eliminar/20 transition-colors"
          onClick={() => setSelectedCategory('eliminar')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eliminar</CardTitle>
            <XCircle className="h-4 w-4 text-eliminar" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byCategory.eliminar}</div>
            <p className="text-xs text-muted-foreground">
              {(stats.byCategory.eliminar / stats.total * 100 || 0).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {selectedCategory && (
        <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {getCategoryLabel(selectedCategory)} - {filteredTarefas.length} tarefa(s)
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {filteredTarefas.map(tarefa => (
                <div key={tarefa.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{tarefa.titulo}</h3>
                      {tarefa.descricao && (
                        <p className="text-sm text-muted-foreground mt-1">{tarefa.descricao}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
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
                    <Badge className={`bg-${selectedCategory}`}>
                      {getCategoryLabel(selectedCategory)}
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
      )}
    </>
  );
};