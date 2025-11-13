import { useMemo } from 'react';
import { Tarefa } from '@/types/tarefa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar, Users, XCircle } from 'lucide-react';

interface DashboardEstatisticasProps {
  tarefas: Tarefa[];
}

export const DashboardEstatisticas = ({ tarefas }: DashboardEstatisticasProps) => {
  const stats = useMemo(() => {
    const byCategory = {
      fazer_agora: tarefas.filter(t => t.categoria === 'fazer_agora').length,
      agendar: tarefas.filter(t => t.categoria === 'agendar').length,
      delegar: tarefas.filter(t => t.categoria === 'delegar').length,
      eliminar: tarefas.filter(t => t.categoria === 'eliminar').length,
    };

    const avgPriority = tarefas.length > 0
      ? tarefas.reduce((sum, t) => sum + (t.prioridade || 0), 0) / tarefas.length
      : 0;

    return { byCategory, avgPriority, total: tarefas.length };
  }, [tarefas]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card className="bg-fazer-agora/10 border-fazer-agora">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fazer Agora</CardTitle>
          <AlertCircle className="h-4 w-4 text-fazer-agora" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byCategory.fazer_agora}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.byCategory.fazer_agora / stats.total) * 100 || 0).toFixed(0)}% do total
          </p>
        </CardContent>
      </Card>

      <Card className="bg-agendar/10 border-agendar">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agendar</CardTitle>
          <Calendar className="h-4 w-4 text-agendar" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byCategory.agendar}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.byCategory.agendar / stats.total) * 100 || 0).toFixed(0)}% do total
          </p>
        </CardContent>
      </Card>

      <Card className="bg-delegar/10 border-delegar">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delegar</CardTitle>
          <Users className="h-4 w-4 text-delegar" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byCategory.delegar}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.byCategory.delegar / stats.total) * 100 || 0).toFixed(0)}% do total
          </p>
        </CardContent>
      </Card>

      <Card className="bg-eliminar/10 border-eliminar">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eliminar</CardTitle>
          <XCircle className="h-4 w-4 text-eliminar" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byCategory.eliminar}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.byCategory.eliminar / stats.total) * 100 || 0).toFixed(0)}% do total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prioridade Média</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgPriority.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Total: {stats.total} tarefas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
