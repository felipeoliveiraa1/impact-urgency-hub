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
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Fazer Agora - Red */}
      <Card className="bg-red-50 border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fazer Agora</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byCategory.fazer_agora}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.byCategory.fazer_agora / stats.total) * 100 || 0).toFixed(0)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Agendar - Green */}
      <Card className="bg-green-50 border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agendar</CardTitle>
          <Calendar className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byCategory.agendar}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.byCategory.agendar / stats.total) * 100 || 0).toFixed(0)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Delegar - Yellow */}
      <Card className="bg-yellow-50 border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delegar</CardTitle>
          <Users className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byCategory.delegar}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.byCategory.delegar / stats.total) * 100 || 0).toFixed(0)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Eliminar - Gray */}
      <Card className="bg-gray-50 border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eliminar</CardTitle>
          <XCircle className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byCategory.eliminar}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.byCategory.eliminar / stats.total) * 100 || 0).toFixed(0)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Prioridade Média - White */}
      <Card className="bg-white border border-gray-200 shadow-sm">
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
